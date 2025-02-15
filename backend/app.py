from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.groq_routes import groq_bp
from routes.scrape_routes import scrapy_bp


app = Flask(__name__)
CORS(app)  # Allow requests from React

app.register_blueprint(scrapy_bp, url_prefix='/api/scrape')
app.regiser_blueprint(groq_bp, url_prefix='/api/groq')

if __name__ == '__main__':
    app.run(debug=True) # Locally running on http://127.0.0.1:5000


