from flask import Blueprint, Response, request, jsonify
import requests
from groq import Groq
from scrape.scraper import scrape_urls, scrape_website, initialize_tools

scrapy_bp = Blueprint('scrape', __name__)

@scrapy_bp.route('/start', methods=['POST'])
def start_scraping():
    print("Received call from frontend")
    data = request.json
    user_prompt, user_schema = data.get("prompt"), data.get("schema")
    print(f"User prompt: {user_prompt}, User Schema: {user_schema}")
    # Scrapybara Scraping Urls (do not delete)
    print("Starting to scrape for urls")
    url_list, browser, client, scrapy_instance = scrape_urls(user_prompt)

    def generate():
        for url in url_list:
            # Scrapybara scrape website
            print(f"Starting scrape for this url: {url}")
            article_text = scrape_website(url, client, scrapy_instance, browser)
            
            # Sending to groq for quantitative data extraction
            print(f"Completed scraping text for {url}, sending to groq")
            try: 
                response = requests.post(
                    "http://127.0.0.1:5000/api/groq/process", 
                    json={
                        "article_text": article_text, 
                        "schema": user_schema
                        }, 
                    headers={"Content-Type": "application/json"})
                
                # Stream the response
                print("Received back groq output on call")

                for chunk in response.iter_content(chunk_size=1024):
                    if chunk:
                        print(f"Chunk: {chunk}")
                        yield chunk.decode("utf-8")  # Convert bytes to string before yielding
        
            except requests.exceptions.RequestException as e:
                print(f"Error calling the API: {e}")
                return None

    return Response(generate(), content_type="application/json")

    

    # while url_list:
        #url = "https://aimresearch.co/ai-startups/top-tech-ma-deals-of-2024"
        # url = url_list.pop()
        # client, browser, scrapy_instance = initialize_tools()
        # article_text = scrape_website(url, client, scrapy_instance, browser)

        # #Sending results to groq
        # print("Sending results to groq")

        # url = "http://127.0.0.1:5000/api/groq/process"
        # headers = {"Content-Type": "application/json"}
        # try: 
        #     response = requests.post(url, json=article_text, headers=headers)
        #     response.raise_for_status()
        #     return response.json()
    
        # except requests.exceptions.RequestException as e:
        #     print(f"Error calling the API: {e}")
        #     return None

        # print("Done scraping")
    # return jsonify({"hello": "world"})
    # return Response(generate(), content_type="application/json")


text_data = """
    Cisco Acquires Splunk for $28 Billion In a landmark deal, 
    Cisco completed its $28 billion acquisition of Splunk on March 18, 2024. 
    The all-cash transaction valued Splunk at $157 per share and brought 
    together Cisco’s networking expertise with Splunk’s data analytics and 
    cybersecurity capabilities. With Gary Steele, Splunk’s former CEO, 
    joining Cisco as Executive Vice President and General Manager of Splunk, 
    the combined entity aims to redefine data utilization for security and 
    operations, creating a robust AI-powered platform to enhance visibility 
    and insights across digital footprints.

    HPE Acquires Juniper Networks for $14 Billion
    Hewlett Packard Enterprise (HPE) announced its intent to acquire Juniper 
    Networks for approximately $14 billion, a deal expected to close in late 
    2024 or early 2025. Valued at $40 per share, the acquisition will
    significantly expand HPE’s networking portfolio, particularly with 
    Juniper’s Mist AI capabilities. The move positions HPE as a leader
    in secure, AI-native architecture from edge to cloud, doubling its
    networking business and enhancing its ability to capitalize on the 
    growing demand for AI-driven networking solutions.

    IBM Acquires HashiCorp for $6.4 Billion
    IBM’s $6.4 billion acquisition of HashiCorp, set to close by the end of 
    2024, underscores its commitment to hybrid cloud and AI automation. By 
    integrating HashiCorp’s Terraform platform with IBM’s Red Hat portfolio,
    the deal is poised to strengthen IBM’s multicloud offerings and expand its 
    infrastructure management capabilities. The acquisition is expected to 
    drive significant growth, positioning IBM more competitively in the 
    trillion-dollar cloud market with a robust end-to-end hybrid cloud solution.
    
    Thoma Bravo Acquires Darktrace for $5.3 Billion
    Private equity giant Thoma Bravo completed its $5.3 billion acquisition 
    of cybersecurity AI company Darktrace on October 1, 2024. With overwhelming shareholder approval, 
    Darktrace will continue under its existing management team. The acquisition provides Darktrace 
    with the resources to enhance its AI-driven cybersecurity solutions and expand its market reach,
      solidifying Thoma Bravo’s standing in the cybersecurity sector amid growing demand for AI-powered 
      security tools.

    Synopsys Acquires Ansys for $35 Billion
    Synopsys announced its $35 billion acquisition of Ansys on January 16, 2024, with the transaction 
    expected to close in the first half of 2025. Combining Synopsys’ chip design tools with Ansys’ 
    expertise in larger electronic systems evaluation, the merger aims to address challenges in AI, 
    silicon proliferation, and software-defined systems. Ansys shareholders will receive a mix of cash 
    and stock, and Synopsys will own approximately 84% of the combined company, creating a leader in 
    silicon-to-systems design solutions.

    Capital One Acquires Discover Financial Services for $35.3 Billion
    In a significant move in the financial services sector, Capital One announced its $35.3 billion 
    acquisition of Discover Financial Services in February 2024. The all-stock transaction, expected 
    to close in early 2025, merges two of America’s largest credit card companies. Discover shareholders 
    will receive 1.0192 Capital One shares per Discover share, resulting in Capital One shareholders 
    owning 60% of the combined entity. The merger will create the largest credit card issuer in the U.S. 
    by loans, offering cost synergies and enhanced capabilities in the payments market.

    AMD Acquires Silo AI for $665 Million
    AMD bolstered its AI capabilities with the $665 million acquisition of Silo AI, Europe’s largest 
    private AI lab. Expected to close in the second half of 2024, the deal brings expertise in scalable, 
    multilingual large language models (LLMs) to AMD’s Artificial Intelligence Group. Led by Silo AI CEO 
    Peter Sarlin, the team will enhance AMD’s presence in the European AI market and accelerate its strategy 
    for AI innovation, particularly in language processing and open-source tools.

    Nvidia Acquires OctoAI for $250 Million
    Nvidia continued its acquisition spree with the $250 million purchase of OctoAI on September 30, 2024. 
    Specializing in generative AI tools and cloud platforms, OctoAI enhances Nvidia’s ability to offer 
    enterprise solutions for AI model optimization and deployment. As Nvidia’s fifth acquisition of the year, 
    this deal supports the company’s strategy to build a comprehensive generative AI stack while ensuring 
    flexibility and scalability across diverse hardware platforms.

    Google’s $2.7 Billion Investment in Character.AI
    Google orchestrated a $2.7 billion reverse acquihire with Character.AI in August 2024, hiring key talent, 
    including founders Noam Shazeer and Daniel De Freitas, while securing a non-exclusive license for the 
    company’s technology. Character.AI remains independent under interim CEO Dominic Perella. This strategic 
    move bolsters Google’s Gemini initiative and its broader AI projects, providing access to advanced large 
    language model (LLM) technology.

    Amazon’s Reverse Acquihire of Covariant
    Amazon executed a reverse acquihire with robotics AI startup Covariant in August 2024, bringing founders 
    Pieter Abbeel, Peter Chen, and Rocky Duan, along with 25% of Covariant’s workforce, into its fold. The 
    deal also secured a non-exclusive license for Covariant’s AI models for robotics. This strategic move 
    enhances Amazon’s capabilities in warehouse automation and AI-driven robotics, reinforcing its competitive 
    position in the AI talent market.
    """
    
