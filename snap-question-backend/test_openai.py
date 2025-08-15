#!/usr/bin/env python3
"""
Simple test script to verify OpenAI API integration
"""
import os
from openai import OpenAI

# Set the API key from environment variable
# Make sure to set OPENAI_API_KEY environment variable before running this script

def test_openai_connection():
    """Test basic OpenAI API connection"""
    print("Testing OpenAI API connection...")
    
    try:
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Simple test query
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for HVAC technicians."},
                {"role": "user", "content": "How do I reset an HVAC filter?"}
            ],
            temperature=0.1,
            max_tokens=200
        )
        
        answer = response.choices[0].message.content
        print(f"✅ OpenAI API connection successful!")
        print(f"Response: {answer}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI API connection failed: {e}")
        return False

def test_rag_simulation():
    """Test RAG-like functionality with mock context"""
    print("\nTesting RAG simulation with mock context...")
    
    try:
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Mock context from documentation
        context = """
        From HVAC Maintenance Manual (similarity: 0.89):
        To replace the air filter, first turn off the HVAC system. Locate the filter compartment, usually near the air handler or return air duct. Remove the old filter by sliding it out. Insert the new filter with the airflow arrow pointing toward the unit. Turn the system back on.
        
        From Quick Start Guide (similarity: 0.76):
        Filter replacement should be done every 1-3 months depending on usage. Always check the filter size before purchasing a replacement.
        """
        
        system_prompt = """You are a helpful AI assistant for a field service company. You help customers with HVAC, generator, and equipment questions by providing accurate answers based on the provided documentation.

Instructions:
1. Answer the question using ONLY the information provided in the context
2. If the context doesn't contain enough information to answer the question, say so
3. Be specific and practical in your responses
4. Include relevant safety warnings when appropriate
5. Keep responses concise but complete"""

        user_prompt = f"""Context from documentation:
{context}

Question: How do I change my HVAC filter?

Please provide a helpful answer based on the context above."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=300
        )
        
        answer = response.choices[0].message.content
        print(f"✅ RAG simulation successful!")
        print(f"Response: {answer}")
        return True
        
    except Exception as e:
        print(f"❌ RAG simulation failed: {e}")
        return False

def test_escalation_scenario():
    """Test escalation scenario with insufficient context"""
    print("\nTesting escalation scenario...")
    
    try:
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        # Empty or irrelevant context
        context = """
        From Installation Manual (similarity: 0.23):
        The unit should be installed by a qualified technician.
        """
        
        system_prompt = """You are a helpful AI assistant for a field service company. You help customers with HVAC, generator, and equipment questions by providing accurate answers based on the provided documentation.

Instructions:
1. Answer the question using ONLY the information provided in the context
2. If the context doesn't contain enough information to answer the question, say so and recommend human assistance
3. Be specific and practical in your responses
4. Include relevant safety warnings when appropriate
5. Keep responses concise but complete"""

        user_prompt = f"""Context from documentation:
{context}

Question: My generator won't start and is making a strange clicking noise. What should I do?

Please provide a helpful answer based on the context above."""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=300
        )
        
        answer = response.choices[0].message.content
        print(f"✅ Escalation scenario test successful!")
        print(f"Response: {answer}")
        return True
        
    except Exception as e:
        print(f"❌ Escalation scenario test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting OpenAI Integration Tests\n")
    
    tests = [
        test_openai_connection,
        test_rag_simulation,
        test_escalation_scenario
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print("-" * 50)
    
    print(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All tests passed! OpenAI integration is working correctly.")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")