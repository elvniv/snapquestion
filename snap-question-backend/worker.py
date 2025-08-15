import os
import time
import json
import logging
from typing import Dict, List, Any
import redis
from rq import Worker, Queue, Connection
import psycopg
from sentence_transformers import SentenceTransformer
import numpy as np
from pdfminer.high_level import extract_text
import pytesseract
from PIL import Image
import io

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize connections
REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))

DB_CONFIG = {
    'host': os.getenv('PGHOST', 'localhost'),
    'port': int(os.getenv('PGPORT', 5432)),
    'dbname': os.getenv('PGDATABASE', 'snapq'),
    'user': os.getenv('PGUSER', 'postgres'),
    'password': os.getenv('PGPASSWORD', 'postgres')
}

# Initialize embedding model (using a smaller model for faster processing)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_db_connection():
    """Create a database connection"""
    return psycopg.connect(**DB_CONFIG)

def chunk_text(text: str, max_tokens: int = 500) -> List[Dict[str, Any]]:
    """Split text into chunks for embedding"""
    # Simple chunking by sentences (you can improve this)
    sentences = text.split('. ')
    chunks = []
    current_chunk = []
    current_tokens = 0
    
    for sentence in sentences:
        # Approximate token count (1 token ≈ 4 characters)
        sentence_tokens = len(sentence) // 4
        
        if current_tokens + sentence_tokens > max_tokens and current_chunk:
            chunk_text = '. '.join(current_chunk) + '.'
            chunks.append({
                'text': chunk_text,
                'tokens': current_tokens
            })
            current_chunk = [sentence]
            current_tokens = sentence_tokens
        else:
            current_chunk.append(sentence)
            current_tokens += sentence_tokens
    
    # Add remaining chunk
    if current_chunk:
        chunk_text = '. '.join(current_chunk)
        chunks.append({
            'text': chunk_text,
            'tokens': current_tokens
        })
    
    return chunks

def process_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        text = extract_text(file_path)
        return text
    except Exception as e:
        logger.error(f"Error processing PDF: {e}")
        # Fallback to OCR if text extraction fails
        return process_with_ocr(file_path)

def process_with_ocr(file_path: str) -> str:
    """Process image or scanned PDF with OCR"""
    try:
        # For images
        if file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
            image = Image.open(file_path)
            text = pytesseract.image_to_string(image)
            return text
        # For scanned PDFs, you'd need to convert PDF pages to images first
        # This is simplified - in production you'd use pdf2image
        return ""
    except Exception as e:
        logger.error(f"OCR processing error: {e}")
        return ""

def ingest_document(tenant_id: str, source_id: str, file_path: str, filename: str):
    """Main document ingestion pipeline"""
    logger.info(f"Starting ingestion for {filename} (tenant: {tenant_id})")
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Update document status to processing
        cur.execute("""
            UPDATE documents 
            SET status = 'processing', updated_at = NOW()
            WHERE source_id = %s
        """, (source_id,))
        conn.commit()
        
        # Extract text based on file type
        text = ""
        if filename.lower().endswith('.pdf'):
            text = process_pdf(file_path)
        elif filename.lower().endswith(('.txt', '.md')):
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            text = process_with_ocr(file_path)
        else:
            raise ValueError(f"Unsupported file type: {filename}")
        
        if not text:
            raise ValueError("No text extracted from document")
        
        # Get document ID
        cur.execute("SELECT id FROM documents WHERE source_id = %s", (source_id,))
        doc_id = cur.fetchone()[0]
        
        # Chunk the text
        chunks = chunk_text(text)
        logger.info(f"Created {len(chunks)} chunks for document {source_id}")
        
        # Generate embeddings and store chunks
        for seq, chunk in enumerate(chunks):
            # Generate embedding
            embedding = embedding_model.encode(chunk['text'])
            
            # Store chunk with embedding
            cur.execute("""
                INSERT INTO chunks (document_id, tenant_id, seq, text, tokens, embedding)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                doc_id,
                tenant_id,
                seq,
                chunk['text'],
                chunk['tokens'],
                embedding.tolist()
            ))
        
        # Update document status to completed
        cur.execute("""
            UPDATE documents 
            SET status = 'completed', updated_at = NOW()
            WHERE source_id = %s
        """, (source_id,))
        
        conn.commit()
        logger.info(f"Successfully ingested document {source_id}")
        
    except Exception as e:
        logger.error(f"Ingestion error for {source_id}: {e}")
        cur.execute("""
            UPDATE documents 
            SET status = 'failed', error_message = %s, updated_at = NOW()
            WHERE source_id = %s
        """, (str(e), source_id))
        conn.commit()
        raise
    
    finally:
        cur.close()
        conn.close()

def search_similar_chunks(tenant_id: str, query: str, limit: int = 5) -> List[Dict]:
    """Search for similar chunks using vector similarity"""
    # Generate query embedding
    query_embedding = embedding_model.encode(query)
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Perform similarity search
        cur.execute("""
            SELECT 
                c.text,
                c.seq,
                d.title,
                d.source_id,
                1 - (c.embedding <=> %s::vector) as similarity
            FROM chunks c
            JOIN documents d ON c.document_id = d.id
            WHERE c.tenant_id = %s
            ORDER BY c.embedding <=> %s::vector
            LIMIT %s
        """, (
            query_embedding.tolist(),
            tenant_id,
            query_embedding.tolist(),
            limit
        ))
        
        results = []
        for row in cur.fetchall():
            results.append({
                'text': row[0],
                'seq': row[1],
                'title': row[2],
                'source_id': row[3],
                'similarity': float(row[4])
            })
        
        return results
        
    finally:
        cur.close()
        conn.close()

def main():
    """Main worker loop"""
    logger.info("Starting SnapQuestion worker...")
    
    # Connect to Redis
    redis_conn = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
    
    # Define queues
    queues = [
        Queue('ingest', connection=redis_conn),
        Queue('answer', connection=redis_conn),
        Queue('default', connection=redis_conn)
    ]
    
    # Start worker
    with Connection(redis_conn):
        worker = Worker(queues)
        worker.work()

if __name__ == '__main__':
    main()