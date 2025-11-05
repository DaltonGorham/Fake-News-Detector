import pytest
from unittest.mock import Mock, patch, MagicMock
from src.repository import article_repository


class TestArticleRepository:
    
    def test_get_all_success(self):
        mock_data = [
            {"id": 1, "article": {"url": "https://example.com/1"}},
            {"id": 2, "article": {"url": "https://example.com/2"}}
        ]
        
        mock_response = Mock()
        mock_response.data = mock_data
        
        mock_client = Mock()
        mock_table = Mock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.order.return_value = mock_table
        mock_table.execute.return_value = mock_response
        
        mock_client.from_.return_value = mock_table
        
        with patch('src.repository.article_repository.get_supabase_client', return_value=mock_client):
            result = article_repository.get_all("user123", "fake_jwt")
            
            assert result == mock_data
            assert len(result) == 2
    
    def test_get_by_id_success(self):
        mock_data = {
            "id": 1,
            "url": "https://example.com",
            "title": "Test Article"
        }
        
        mock_response = Mock()
        mock_response.data = mock_data
        
        mock_client = Mock()
        mock_table = Mock()
        mock_table.select.return_value = mock_table
        mock_table.eq.return_value = mock_table
        mock_table.single.return_value = mock_table
        mock_table.execute.return_value = mock_response
        
        mock_client.from_.return_value = mock_table
        
        with patch('src.repository.article_repository.get_supabase_client', return_value=mock_client):
            result = article_repository.get_by_id(1, "fake_jwt")
            
            assert result == mock_data
            assert result["id"] == 1
    
    def test_save_success(self):
        analysis_data = {
            "article": {
                "url": "https://example.com",
                "title": "Test",
                "source": "example.com"
            },
            "ai_result": {
                "genre": "Real News",
                "truthness_label": "Reliable",
                "truthness_score": 0.85,
                "related_articles": [],
                "is_satire": False
            },
            "input_by_user": "user123"
        }
        
        mock_article_response = Mock()
        mock_article_response.data = [{"id": 1}]
        
        mock_ai_response = Mock()
        mock_ai_response.data = [{"id": 1}]
        
        mock_history_check_response = Mock()
        mock_history_check_response.data = [{"history_index": 5}]
        
        mock_history_insert_response = Mock()
        mock_history_insert_response.data = [{"id": 1}]
        
        with patch('src.repository.article_repository.supabase_admin_client') as mock_admin:
            with patch('src.repository.article_repository.get_supabase_client') as mock_user:
                mock_admin_table = Mock()
                mock_admin_table.insert.return_value = mock_admin_table
                mock_admin_table.execute.side_effect = [mock_article_response, mock_ai_response]
                mock_admin.table.return_value = mock_admin_table
                
                mock_user_client = Mock()
                mock_user_table = Mock()
                mock_user_table.select.return_value = mock_user_table
                mock_user_table.eq.return_value = mock_user_table
                mock_user_table.order.return_value = mock_user_table
                mock_user_table.limit.return_value = mock_user_table
                mock_user_table.insert.return_value = mock_user_table
                mock_user_table.execute.side_effect = [mock_history_check_response, mock_history_insert_response]
                mock_user_client.from_.return_value = mock_user_table
                mock_user_client.table.return_value = mock_user_table
                mock_user.return_value = mock_user_client
                
                result = article_repository.save(analysis_data, "fake_jwt")
                
                assert result is not None
    
    def test_clear_success(self):
        mock_history_response = Mock()
        mock_history_response.data = [
            {"article_id": 1},
            {"article_id": 2}
        ]
        
        mock_delete_response = Mock()
        mock_delete_response.data = []
        
        with patch('src.repository.article_repository.get_supabase_client') as mock_user:
            with patch('src.repository.article_repository.supabase_admin_client') as mock_admin:
                mock_user_client = Mock()
                mock_user_table = Mock()
                mock_user_table.select.return_value = mock_user_table
                mock_user_table.eq.return_value = mock_user_table
                mock_user_table.delete.return_value = mock_user_table
                mock_user_table.execute.side_effect = [mock_history_response, mock_delete_response]
                mock_user_client.from_.return_value = mock_user_table
                mock_user_client.table.return_value = mock_user_table
                mock_user.return_value = mock_user_client
                
                mock_admin_table = Mock()
                mock_admin_table.delete.return_value = mock_admin_table
                mock_admin_table.in_.return_value = mock_admin_table
                mock_admin_table.execute.return_value = mock_delete_response
                mock_admin.table.return_value = mock_admin_table
                
                result = article_repository.clear("user123", "fake_jwt")
                
                assert result == True
