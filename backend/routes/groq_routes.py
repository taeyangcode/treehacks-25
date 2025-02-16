from flask import Blueprint, request, jsonify
from groq_func.groq_client import groq_response
from pydantic import BaseModel, create_model
from typing import Dict, Any, Type


groq_bp = Blueprint('groq', __name__)

@groq_bp.route('/process', methods=['POST'])
def process_groqllm():
    data = request.json

    print("Defining user-defined schema")
    # Dynamically changeg user schema
    user_schema: Dict[str, str] = data.get("schema", {})
    DynamicSchema = create_model("DynamicSchema", **{key: (eval(value), ...) for key, value in user_schema.items()})
    
    class RowList(BaseModel):
        row_list: list[DynamicSchema]  # type: ignore # Enforce list of rows
    
    
    print("Calling groq to send data")
    article_text = data.get("article_text")
    response = groq_response(RowList, article_text)
    return jsonify(response.model_dump())