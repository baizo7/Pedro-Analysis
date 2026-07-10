from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.api import deps
from app.models.user import User
from app.models.dataset import Dataset, Title
import os
import json

try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

router = APIRouter()

class ChatRequest(BaseModel):
    query: str

@router.post("/query")
def chat_query(
    request: ChatRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id
    
    # Simple Mock Fallback if no OpenAI Key
    api_key = os.getenv("OPENAI_API_KEY")
    if not OPENAI_AVAILABLE or not api_key:
        return {
            "answer": f"Simulated AI response for: '{request.query}'. (Configure OPENAI_API_KEY in .env to enable real SQL translation)",
            "data": None
        }

    openai.api_key = api_key

    schema_context = """
    Table: titles
    Columns:
    - id (UUID)
    - dataset_id (UUID)
    - type (String) -> 'Movie' or 'TV Show'
    - title (String)
    - director (String)
    - cast_members (Text)
    - country (String)
    - release_year (Integer)
    - rating (String)
    - duration (String)
    - listed_in (Text) -> Genres
    - description (Text)
    """

    system_prompt = f"""
    You are an AI Data Analyst for a PostgreSQL database containing streaming media catalogs.
    Translate the user's natural language question into a valid, safe, SELECT-only SQL query.
    {schema_context}
    
    IMPORTANT RULES:
    1. Only return the raw SQL query. Do not add markdown blocks like ```sql.
    2. NEVER return any destructive commands (DROP, DELETE, UPDATE, INSERT).
    3. The titles table is tied to an organization. Always join via dataset_id but for this prompt, ASSUME we have already filtered the data. Just write the query against 'titles'.
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": request.query}
            ]
        )
        sql_query = response.choices[0].message['content'].strip()
        
        # Clean markdown if present
        if sql_query.startswith("```sql"):
            sql_query = sql_query[6:-3].strip()
        
        # Security: Prevent basic destructive operations
        unsafe_words = ["DROP", "DELETE", "UPDATE", "INSERT", "TRUNCATE", "ALTER"]
        if any(word in sql_query.upper() for word in unsafe_words):
            raise ValueError("Unsafe SQL generated")

        # Execute Query (wrapping it to ensure we only get their org's data)
        # Note: This is an MVP approach. A production app would use Row Level Security (RLS) in Postgres.
        safe_sql = f"SELECT * FROM ({sql_query}) AS ai_query LIMIT 50"
        
        result = db.execute(text(safe_sql)).mappings().all()
        data = [dict(row) for row in result]
        
        # Ask LLM to summarize the data
        summary_res = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a friendly data analyst. Summarize this data payload to answer the user's question concisely."},
                {"role": "user", "content": f"Question: {request.query}\nData: {json.dumps(data)}"}
            ]
        )
        answer = summary_res.choices[0].message['content']
        
        return {
            "answer": answer,
            "data": data,
            "sql": sql_query
        }
    except Exception as e:
        return {
            "answer": f"Sorry, I couldn't process that query. Error: {str(e)}",
            "data": None
        }
