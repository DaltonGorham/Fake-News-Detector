from datetime import datetime
from ..lib.supabase_client import get_supabase_client, supabase_admin_client

def get_all(user_id: str, user_jwt: str = None):
    """Get all articles for a specific user"""
    # SQL: SELECT * FROM "Input History" 
    # WHERE input_by_user = user_id 
    # ORDER BY history_index DESC
    client = get_supabase_client(user_jwt)
    response = client.from_('Input History') \
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
                    related_articles,
                    is_satire
                )
            )
        ''') \
        .eq('input_by_user', user_id) \
        .order('history_index', desc=True) \
        .execute()
    return response.data

def get_by_id(article_id: int, user_jwt: str = None):
    """Get a single article by ID with its AI result"""
    # SQL: SELECT * FROM Article 
    # WHERE id = article_id 
    # JOIN "AI Result" on article_id
    client = get_supabase_client(user_jwt)
    response = client.from_('Article') \
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
                related_articles,
                is_satire
            )
        ''') \
        .eq('id', article_id) \
        .single() \
        .execute()
    
    return response.data

def save(analysis_data: dict, user_jwt: str = None):
    """Save a new article analysis across multiple tables"""
    user_client = get_supabase_client(user_jwt)

    # SQL: INSERT INTO Article (url, title, source, collected_date)
    article_data = {
        'url': analysis_data['article']['url'],
        'title': analysis_data['article']['title'],
        'source': analysis_data['article']['source'],
        'collected_date': datetime.now().isoformat()
    }
    article_response = supabase_admin_client.table('Article').insert(article_data).execute()
    article_id = article_response.data[0]['id']

    # SQL: INSERT INTO "AI Result" (article_id, genre, truthness_label, truthness_score, related_articles, is_satire)
    ai_result_data = {
        'article_id': article_id,
        'genre': analysis_data['ai_result']['genre'],
        'truthness_label': analysis_data['ai_result']['truthness_label'],
        'truthness_score': analysis_data['ai_result']['truthness_score'],
        'related_articles': analysis_data['ai_result']['related_articles'],
        'is_satire': analysis_data['ai_result'].get('is_satire', False)
    }
    ai_result_response = supabase_admin_client.table('AI Result').insert(ai_result_data).execute()
    ai_result_id = ai_result_response.data[0]['id']

    # SQL: SELECT history_index FROM "Input History" 
    # WHERE input_by_user = user_id 
    # ORDER BY history_index DESC 
    # LIMIT 1
    history_response = user_client.from_('Input History') \
        .select('history_index') \
        .eq('input_by_user', analysis_data['input_by_user']) \
        .order('history_index', desc=True) \
        .limit(1) \
        .execute()

    next_index = 1
    if history_response.data:
        next_index = history_response.data[0]['history_index'] + 1

    # SQL: INSERT INTO "Input History" (created_at, history_index, input_by_user, article_id, ai_result_id)
    history_data = {
        'created_at': datetime.now().isoformat(),
        'history_index': next_index,
        'input_by_user': analysis_data['input_by_user'],
        'article_id': article_id,
        'ai_result_id': ai_result_id
    }
    user_client.table('Input History').insert(history_data).execute()

    return get_by_id(article_id, user_jwt)

def clear(user_id: str, user_jwt: str = None):
    """Clear all articles from history for a specific user"""
    user_client = get_supabase_client(user_jwt)
    
    # SQL: SELECT article_id FROM "Input History" WHERE input_by_user = user_id
    history_response = user_client.from_('Input History') \
        .select('article_id') \
        .eq('input_by_user', user_id) \
        .execute()
    
    if not history_response.data:
        return True

    article_ids = [item['article_id'] for item in history_response.data]

    # Delete in correct order due to foreign key constraints
    # SQL: DELETE FROM "Input History" WHERE input_by_user = user_id
    user_client.table('Input History').delete().eq('input_by_user', user_id).execute()
    # SQL: DELETE FROM "AI Result" WHERE article_id IN (article_ids)
    supabase_admin_client.table('AI Result').delete().in_('article_id', article_ids).execute()
    # SQL: DELETE FROM Article WHERE id IN (article_ids)
    supabase_admin_client.table('Article').delete().in_('id', article_ids).execute()
    
    return True