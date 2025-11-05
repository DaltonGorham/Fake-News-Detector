import pytest
from unittest.mock import Mock, AsyncMock, patch
from src.services.user_service import UserService
from fastapi import UploadFile


class TestUserService:
    
    @pytest.mark.asyncio
    async def test_upload_avatar_success(self):
        mock_client = Mock()
        mock_storage = Mock()
        mock_storage.upload.return_value = Mock(error=None)
        mock_storage.get_public_url.return_value = "https://storage.example.com/avatar.jpg"
        
        mock_table = Mock()
        mock_table.update.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute.return_value = Mock(error=None)
        
        mock_client.storage.from_ = Mock(return_value=mock_storage)
        mock_client.table = Mock(return_value=mock_table)
        
        with patch('src.services.user_service.supabase_admin_client', mock_client):
            service = UserService()
            
            mock_file = Mock(spec=UploadFile)
            mock_file.filename = "avatar.jpg"
            mock_file.content_type = "image/jpeg"
            mock_file.read = AsyncMock(return_value=b"fake_image_data")
            mock_file.close = AsyncMock()
            
            result = await service.upload_avatar("user123", mock_file)
            
            assert result["filename"] == "avatar.jpg"
            assert result["size"] == 15
            assert "avatar_url" in result
    
    @pytest.mark.asyncio
    async def test_upload_avatar_storage_error(self):
        mock_client = Mock()
        mock_error = Mock()
        mock_error.message = "Storage full"
        
        mock_storage = Mock()
        mock_storage.upload.return_value = Mock(error=mock_error)
        
        mock_client.storage.from_ = Mock(return_value=mock_storage)
        
        with patch('src.services.user_service.supabase_admin_client', mock_client):
            service = UserService()
            
            mock_file = Mock(spec=UploadFile)
            mock_file.filename = "avatar.jpg"
            mock_file.content_type = "image/jpeg"
            mock_file.read = AsyncMock(return_value=b"fake_image_data")
            mock_file.close = AsyncMock()
            
            with pytest.raises(Exception) as exc_info:
                await service.upload_avatar("user123", mock_file)
            
            assert "Failed to upload avatar" in str(exc_info.value)
    
    @pytest.mark.asyncio
    async def test_upload_avatar_database_error(self):
        mock_client = Mock()
        mock_storage = Mock()
        mock_storage.upload.return_value = Mock(error=None)
        mock_storage.get_public_url.return_value = "https://storage.example.com/avatar.jpg"
        
        mock_error = Mock()
        mock_error.message = "Database connection failed"
        
        mock_table = Mock()
        mock_table.update.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.execute.return_value = Mock(error=mock_error)
        
        mock_client.storage.from_ = Mock(return_value=mock_storage)
        mock_client.table = Mock(return_value=mock_table)
        
        with patch('src.services.user_service.supabase_admin_client', mock_client):
            service = UserService()
            
            mock_file = Mock(spec=UploadFile)
            mock_file.filename = "avatar.jpg"
            mock_file.content_type = "image/jpeg"
            mock_file.read = AsyncMock(return_value=b"fake_image_data")
            mock_file.close = AsyncMock()
            
            with pytest.raises(Exception) as exc_info:
                await service.upload_avatar("user123", mock_file)
            
            assert "Failed to upload avatar" in str(exc_info.value)
