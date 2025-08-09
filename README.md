# routes
# /users/login and /users/login -> take username and password  return token
# /messages/request->take token in request headers , text and chat_id in request body it will give ai response 
# /messages/chat_history=>take token in request headers fetch chat_history in latest activity as first
# /messages/chat_conversation=>take token in request headers chat_id in request body, fetch chat conversation
# /messages/create_chat=>take token in request headers  and give acces to new chat_area

# LINK To docker-compose.yml file->
# Install Docker if you haven’t .
# Download the file from above mentioned link
# Run the application on command terminal using command ->docker compose up
# Access services:
#Frontend → http://localhost:5173
#Backend API → http://localhost:8000
# Stop services on command terminal using command: docker compose down
