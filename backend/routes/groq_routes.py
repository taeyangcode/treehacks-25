from flask import Blueprint, request, jsonify
from groq_func.groq_client import stream_groq_response


groq_bp = Blueprint('groq', __name__)

@groq_bp.route('/process', methods=['POST'])
def process_groqllm():
    data = request.json

    print("backend server groq api was hit")
    print(data)

    print("Calling groq to send data")
    stream_groq_response(data)

    # Call the streaming groq response function 
    return jsonify({"Hello": "world"})