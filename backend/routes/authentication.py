from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import SECRET_KEY, ALGORITHM

security = HTTPBearer()


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            return {"status": "error", "message": "User ID not found in token"}
        return {"status": "success", "user_id": int(user_id)}
    except JWTError:
        return {"status": "error", "message": "Invalid or expired token"}
