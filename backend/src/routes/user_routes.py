from fastapi import APIRouter, HTTPException, Depends, UploadFile
from typing import Tuple
from ..middleware.auth import auth_handler
from ..services.user_service import UserService

router = APIRouter()
user_service = UserService()

router = APIRouter()

@router.post("/users/avatar")
async def upload_avatar(
    file: UploadFile,
    user_id: str = Depends(auth_handler.get_current_user)
):
    """Upload a user's avatar image"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Invalid file type",
                "error": "File must be an image"
            }
        )
    
    try:
        avatar_url = await user_service.upload_avatar(user_id, file)
        return {"data": {"avatar_url": avatar_url}, "error": None}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Failed to upload avatar",
                "error": str(e)
            }
        )

@router.delete("/users/account")
async def delete_account(user_data: Tuple[str, str] = Depends(auth_handler.get_user_with_token)):
    """Delete the current user's account from Supabase Auth"""
    user_id, user_jwt = user_data
    try:
        await user_service.delete_account(user_id, user_jwt)
        return {"data": None, "error": None}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Failed to delete account",
                "error": str(e)
            }
        )