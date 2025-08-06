from fastapi import FastAPI
from dbconnection.dbconnection import  engine
import models.models as models
from routes.userRoute import router as userroute
from routes.messages import router as messages_router
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def GreetUser():
    return {"message": "Hello, User!"}
app.include_router(userroute, prefix="/users", tags=["users"])
app.include_router(messages_router, prefix="/messages", tags=["messages"])