from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
from datetime import datetime
from typing import Optional
from ..config import settings

security = HTTPBearer()

class AuthMiddleware:
    def __init__(self):
        self.jwt_secret = settings.SUPABASE_JWT_SECRET
        self.jwt_audience = "authenticated"

    def verify_token(self, token: str) -> dict:
        """
        Verify and decode a JWT token
        """
        try:
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=["HS256"],
                audience=self.jwt_audience,
                options={
                    "verify_aud": True,
                    "verify_exp": True,
                    "verify_signature": True
                }
            )
                    
            return payload
            
        except JWTError as e:
            raise ValueError(f"Invalid token: {str(e)}")
        except Exception as e:
            raise ValueError(f"Token verification failed: {str(e)}")
            
    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Security(security)) -> str:
        """
        Get the current user's ID from the verified token
        """
        if not credentials:
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Authentication required",
                    "error": "No credentials provided"
                }
            )

        token = credentials.credentials
        try:
            payload = self.verify_token(token)
            
            user_id = payload.get('sub')
            if not user_id:
                raise ValueError("User ID not found in token")
                
            return user_id
            
        except ValueError as e:
            raise HTTPException(
                status_code=401,
                detail={
                    "message": "Invalid authentication token",
                    "error": str(e),
                    "code": "INVALID_TOKEN"
                }
            )

auth_handler = AuthMiddleware()