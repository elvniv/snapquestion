#!/usr/bin/env python3
"""
Test script to verify API endpoints work correctly
"""
import os
import json
from main_simple import app
from fastapi.testclient import TestClient

# Set the API key from environment variable
# Make sure to set OPENAI_API_KEY environment variable before running this script

def test_root_endpoint():
    """Test the root endpoint"""
    print("Testing root endpoint...")
    
    try:
        client = TestClient(app)
        response = client.get("/")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "openai_configured" in data
        assert data["openai_configured"] == True
        
        print("✅ Root endpoint test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Root endpoint test failed: {e}")
        return False

def test_health_endpoint():
    """Test the health endpoint"""
    print("\nTesting health endpoint...")
    
    try:
        client = TestClient(app)
        response = client.get("/healthz")
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["ok"] == True
        assert data["openai_configured"] == True
        
        print("✅ Health endpoint test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

def test_answer_endpoint():
    """Test the answer endpoint with OpenAI integration"""
    print("\nTesting answer endpoint...")
    
    try:
        client = TestClient(app)
        
        # Test data
        test_request = {
            "tenant_id": "demo",
            "query_text": "How do I change my HVAC filter?"
        }
        
        response = client.post(
            "/v1/answer",
            json=test_request,
            headers={"Authorization": "Bearer DEV"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200
        data = response.json()
        assert "answer" in data
        assert "citations" in data
        assert "confidence" in data
        assert "escalated" in data
        assert len(data["answer"]) > 0
        
        print("✅ Answer endpoint test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Answer endpoint test failed: {e}")
        return False

def test_answer_endpoint_escalation():
    """Test the answer endpoint with a query that should escalate"""
    print("\nTesting answer endpoint escalation...")
    
    try:
        client = TestClient(app)
        
        # Test data with short query (should trigger escalation)
        test_request = {
            "tenant_id": "demo",
            "query_text": "Help"
        }
        
        response = client.post(
            "/v1/answer",
            json=test_request,
            headers={"Authorization": "Bearer DEV"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["escalated"] == True
        assert data["confidence"] < 0.7
        
        print("✅ Answer endpoint escalation test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Answer endpoint escalation test failed: {e}")
        return False

def test_stats_endpoint():
    """Test the stats endpoint"""
    print("\nTesting stats endpoint...")
    
    try:
        client = TestClient(app)
        
        response = client.get(
            "/v1/tenants/demo/stats",
            headers={"Authorization": "Bearer DEV"}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        assert response.status_code == 200
        data = response.json()
        assert "tenant_id" in data
        assert "total_queries" in data
        assert "escalation_rate" in data
        
        print("✅ Stats endpoint test passed!")
        return True
        
    except Exception as e:
        print(f"❌ Stats endpoint test failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting API Integration Tests\n")
    
    tests = [
        test_root_endpoint,
        test_health_endpoint,
        test_answer_endpoint,
        test_answer_endpoint_escalation,
        test_stats_endpoint
    ]
    
    passed = 0
    for test in tests:
        if test():
            passed += 1
        print("-" * 50)
    
    print(f"\n📊 Test Results: {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All API tests passed! The backend is working correctly with OpenAI integration.")
    else:
        print("⚠️  Some tests failed. Check the error messages above.")