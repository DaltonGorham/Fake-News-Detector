from supabase import create_client, Client
from ..config import settings

def get_supabase_client(user_jwt: str = None) -> Client:
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY
    )
    
    # If we have a user JWT, set it in the auth header
    # This makes Supabase treat requests as coming from that authenticated user
    if user_jwt:
        client.postgrest.auth(user_jwt)
    
    return client

# Initialize admin client only if not in testing mode
if settings.TESTING:
    supabase_admin_client = None
else:
    supabase_admin_client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )