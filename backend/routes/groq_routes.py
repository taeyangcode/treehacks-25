from flask import Blueprint, request, jsonify
from groq.groq_client import process_groq_tool


groq_bp = Blueprint('groq', __name__)

@groq_bp.route('/process', methods=['POST'])
def process_groqllm():
    data = request.json
    return