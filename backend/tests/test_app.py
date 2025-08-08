from fastapi.testclient import TestClient
from server import app


client = TestClient(app)


test_example = {
    "username": "testuser_123",
    "password": "testpassword"
}
access_token = None
chat_id = None

# Test user registration
def test_signup():
    global access_token,chat_id
    response = client.post("/users/register", json={
        "username": test_example["username"],
        "password": test_example["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    access_token = data["access_token"]
    assert "chat_id" in data
    
# Test LogIn

def test_login():
    global access_token,chat_id
    response = client.post("/users/login", json={
        "username": test_example["username"],
        "password": test_example["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "access_token" in data
    access_token = data["access_token"]
    assert "chat_id" in data
    chat_id = data["chat_id"]
    
    
# Testing  for new chat creation    
def test_new_chat():
    global access_token,chat_id
    response=client.post("/messages/create_chat", json={"chat_id":chat_id},headers={
        "Authorization": f"Bearer {access_token}"
    })
    assert response.status_code==200
    data = response.json()
    assert data["status"] == "success"
    assert "message" in data
    assert data["chat_id"] is not None
    chat_id = data["chat_id"]  
    
    
# Testing chat for response

def test_chat_response():
    global access_token, chat_id
    response = client.post(
        "/messages/request",
        json={"chat_id": chat_id, "text": "Hello, how can I help you?"},
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "response" in data
    assert data["response"] is not None
    assert isinstance(data["response"], str)
    print(data["response"])
    
    
    
    
 
# chat_history   
def test_chat_history():
    global access_token,chat_id
    response=client.post("/messages/chat_history", json={
        "chat_id": chat_id
    }, headers={
        "Authorization": f"Bearer {access_token}"
    })
    assert response.status_code==200
    data = response.json()
    assert data["status"] == "success"
    assert "chat_history" in data
    
    
# chat_conversation
def test_chat_conversation():
    global access_token,chat_id
    response=client.post("/messages/chat_conversation", json={"chat_id":chat_id},headers={
        "Authorization": f"Bearer {access_token}"
    })
    assert response.status_code==200
    data = response.json()
    assert data["status"] == "success"
    assert "messages" in data 
    assert "message" in data









