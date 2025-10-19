from fastapi import APIRouter, HTTPException, Depends, UploadFile
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