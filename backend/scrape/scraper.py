import os
import json
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright
from pydantic import BaseModel
from scrapybara.tools import BashTool, ComputerTool, EditTool
from scrapybara.anthropic import Anthropic
from scrapybara.prompts import UBUNTU_SYSTEM_PROMPT
from scrapybara import Scrapybara


load_dotenv()
with open("./data/invalid_domains.json", "r") as fp:
    data = json.load(fp)


def scrape_urls():
    # initialie Scrapybara client and scrapy instance 
    print("Starting the client instance")
    scrapy_key = os.getenv("SCRAPYBARAKEY")
    client = Scrapybara(api_key=scrapy_key)
    scrapy_instance = client.start_ubuntu(timeout_hours=0.1)
    cdp_url = scrapy_instance.browser.start().cdp_url

    print("Starting playwright")
    playwright = sync_playwright().start()
    browser = playwright.chromium.connect_over_cdp(cdp_url)

    # Search browser
    print("Starting browser")
    page = browser.new_page()
    page.goto("https://www.google.com")
    page.locator("textarea.gLFyf").fill("Startup Acquisitions in 2024")
    page.locator("textarea.gLFyf").press("Enter")
    page.wait_for_timeout(2000)

    print("Extracting Links across pages")
    page_links = []

    for _ in range(5):
        page_links.extend(page.locator('a').all())
        print(f"curret link length {len(page_links)}")

        # Scroll to the #pnnext element before clicking
        print("Scrolling all the way down")
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        
        print("Attempting to click on the next button")
        page.click('a#pnnext')
        # element = page.locator('span#pnnext')
        # element.scroll_into_view_if_needed()
        # element.click()
        page.wait_for_timeout(2000)

    print(f"Page Links Extracted: {len(page_links)},  {page_links}")
    valid_urls = list(filter(link_filter, page_links))

    print(f"Valid links Extract: {len(valid_urls)}, {valid_urls}")
    return

def scrape_website():
    return 




def link_filter(link_url):
    # https:
    if not link_url or link_url[0:8] != "https://":
        return False 
    
    # domain filter 
    pattern = r'^(?:https?://)?(?:www\.)?([^/]+)'
    match = re.match(pattern, link_url)
    if match:
        if match.group(1) in data["invalid_urls"]:
            return False 
    return True
