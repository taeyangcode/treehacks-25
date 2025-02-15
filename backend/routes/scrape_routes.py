from flask import Blueprint, request, jsonify 
from scrape.scraper import start_scrape

scrapy_bp = Blueprint('scrape', __name__)

@scrapy_bp.route('/start', methods=['POST'])
def start_scraping():
    data = request.json

    
    return 