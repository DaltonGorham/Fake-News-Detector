from datetime import datetime
from typing import BinaryIO
import uuid
from fastapi import UploadFile

from ..lib.supabase_client import supabase_admin_client
from ..repository import article_repository

class UserService:
    def __init__(self):
        # Use admin client for storage operations (file uploads)
        # Storage operations require elevated permissions
        self._client = supabase_admin_client
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

    async def delete_account(self, user_id: str, user_jwt: str):
        """
        Delete a user's account from Supabase Auth
        Clears user history, storage files, then deletes from Auth which cascades to Users table.
        
        Args:
            user_id: The ID of the user to delete
            user_jwt: The user's JWT token for authenticated operations
        """
        # Clear article history
        try:
            article_repository.clear(user_id, user_jwt)
        except Exception as e:
            print(f"Warning: Failed to clear article history: {e}")
        
        # Delete avatar files from storage using admin client
        try:
            files_response = self._client.storage.from_(self._bucket_name).list(user_id)
            if files_response and len(files_response) > 0:
                file_paths = [f"{user_id}/{file['name']}" for file in files_response]
                self._client.storage.from_(self._bucket_name).remove(file_paths)
        except Exception as e:
            print(f"Warning: Failed to delete storage files: {e}")
        
        # Delete user from Supabase Auth using admin client
        try:
            self._client.auth.admin.delete_user(user_id)
        except Exception as e:
            raise Exception(f"Failed to delete user account: {str(e)}")