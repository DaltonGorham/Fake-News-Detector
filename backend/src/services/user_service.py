from datetime import datetime
from typing import BinaryIO
import uuid
from fastapi import UploadFile

from ..lib.supabase_client import supabase_client

class UserService:
    def __init__(self):
        self._client = supabase_client
        self._bucket_name = "avatars"

    async def upload_avatar(self, user_id: str, file: UploadFile) -> str:
        """
        Upload a user's avatar to Supabase storage and update their profile
        
        Args:
            user_id: The ID of the user
            file: The avatar image file
        
        Returns:
            str: The URL of the uploaded avatar
        """
        file_ext = file.filename.split('.')[-1]
        file_name = f"{user_id}/{str(uuid.uuid4())}.{file_ext}"
        
        content = await file.read()
        
        try:
            res = self._client.storage.from_(self._bucket_name).upload(
                path=file_name,
                file=content,
                file_options={"content-type": file.content_type}
            )
            
            if hasattr(res, 'error') and res.error:
                raise Exception(f"Storage error: {res.error.message}")
            
            public_url = self._client.storage.from_(self._bucket_name).get_public_url(file_name)
            
            res = self._client.table('Users').update({
                'avatar_url': public_url
            }).eq('id', user_id).execute()
            
            if hasattr(res, 'error') and res.error:
                raise Exception(f"Database error: {res.error.message}")
            
            return {
                "filename": file.filename,
                "size": len(content),
                "avatar_url": public_url
            }
            
        except Exception as e:
            raise Exception(f"Failed to upload avatar: {str(e)}")
        finally:
            await file.close()