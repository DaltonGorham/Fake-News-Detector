from datetime import datetime
from ..lib.supabase_client import supabase_client

def get_all(user_id: str):
    """Get all articles for a specific user"""
    response = supabase_client.from_('Input History') \
        .select('''
            id,
            created_at,
            history_index,
            input_by_user,
            article:article_id (
                id,
                url,
                title,
                source,
                collected_date,
                ai_result:"AI Result" (
                    id,
                    genre,
                    truthness_label,
                    truthness_score,
                    related_articles
                )
            )
        ''') \
        .eq('input_by_user', user_id) \
        .order('history_index', desc=True) \
        .execute()
    return response.data

def get_by_id(article_id: int):
    """Get a single article by ID with its AI result"""
    response = supabase_client.from_('Article') \
        .select('''
            id,
            url,
            title,
            source,
            collected_date,
            ai_result:"AI Result" (
                id,
                genre,
                truthness_label,
                truthness_score,
                related_articles
            )
        ''') \
        .eq('id', article_id) \
        .single() \
        .execute()
    
    return response.data

def save(analysis_data: dict):
    """Save a new article analysis across multiple tables"""

    article_data = {
        'url': analysis_data['article']['url'],
        'title': analysis_data['article']['title'],
        'source': analysis_data['article']['source'],
        'collected_date': datetime.now().isoformat()
    }
    article_response = supabase_client.table('Article').insert(article_data).execute()
    article_id = article_response.data[0]['id']

    ai_result_data = {
        'article_id': article_id,
        'genre': analysis_data['ai_result']['genre'],
        'truthness_label': analysis_data['ai_result']['truthness_label'],
        'truthness_score': analysis_data['ai_result']['truthness_score'],
        'related_articles': analysis_data['ai_result']['related_articles']
    }
    ai_result_response = supabase_client.table('AI Result').insert(ai_result_data).execute()
    ai_result_id = ai_result_response.data[0]['id']

    history_response = supabase_client.from_('Input History') \
        .select('history_index') \
        .eq('input_by_user', analysis_data['input_by_user']) \
        .order('history_index', desc=True) \
        .limit(1) \
        .execute()

    next_index = 1
    if history_response.data:
        next_index = history_response.data[0]['history_index'] + 1

    history_data = {
        'created_at': datetime.now().isoformat(),
        'history_index': next_index,
        'input_by_user': analysis_data['input_by_user'],
        'article_id': article_id,
        'ai_result_id': ai_result_id
    }
    supabase_client.table('Input History').insert(history_data).execute()

    return get_by_id(article_id)

def clear(user_id: str):
    """Clear all articles from history for a specific user"""
    history_response = supabase_client.from_('Input History') \
        .select('article_id') \
        .eq('input_by_user', user_id) \
        .execute()
    
    if not history_response.data:
        return True

    article_ids = [item['article_id'] for item in history_response.data]

    # Delete in correct order due to foreign key constraints
    supabase_client.table('Input History').delete().eq('input_by_user', user_id).execute()
    supabase_client.table('AI Result').delete().in_('article_id', article_ids).execute()
    supabase_client.table('Article').delete().in_('id', article_ids).execute()
    return True