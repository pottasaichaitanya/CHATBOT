# routes
# /users/login and /users/login -> take username and password  return token
# /messages/request->take token in request headers , text and chat_id in request body it will give ai response 
# /messages/chat_history=>take token in request headers fetch chat_history in latest activity as first
# /messages/chat_conversation=>take token in request headers chat_id in request body, fetch chat conversation
# /messages/create_chat=>take token in request headers  and give acces to new chat_area

# LINK To docker-compose.yml file->https://drive.google.com/file/d/1nFr_bQyUL8vqZj2xK7ByVb8UjJ7Emmxj/view?usp=sharing
# This is the docker-compose file  run using docker-compose up then we can acess it locally  where  front end at http://localhost:5173
# backend at http://localhost:8000
