import os
import json
import re
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


class Website_Info(BaseModel):
    weburl: str
    article_text: str


def scrape_urls(prompt: str):
    # initialie Scrapybara client and scrapy instance 
    scrapy_key = os.getenv("SCRAPYBARAKEY")
    print("Starting the client instance")
    client = Scrapybara(api_key=scrapy_key)

    print("Starting the remote ubuntu server")
    scrapy_instance = client.start_ubuntu(timeout_hours=0.1)

    print("Initializing the browser")
    cdp_url = scrapy_instance.browser.start().cdp_url

    print("Starting playwright")
    playwright = sync_playwright().start()
    browser = playwright.chromium.connect_over_cdp(cdp_url)

    # Search browser
    print("Starting browser")
    page = browser.new_page()
    page.goto("https://www.google.com")

    # TODO: LLM response to prompt engineer google search 

    page.locator("textarea.gLFyf").fill(prompt)
    page.locator("textarea.gLFyf").press("Enter")
    page.wait_for_timeout(2000)

    print("Extracting Links across pages")
    page_links = []

    for _ in range(5):
        page_links.extend(page.eval_on_selector_all("a", "elements => elements.map(el => el.href)"))
        print(f"curret link length {len(page_links)}")

        # Scroll to the #pnnext element before clicking
        print("Scrolling all the way down")
        page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        
        print("Attempting to click on the next button")
        page.click('a#pnnext')
        page.wait_for_timeout(2000)

    print(f"Page Links Extracted: {len(page_links)},  {page_links}")
    valid_urls = list(filter(link_filter, page_links))

    print(f"Valid links Extract: {len(valid_urls)}, {valid_urls}")
    return [valid_urls, browser, client, scrapy_instance]

def initialize_tools():
    # initialie Scrapybara client and scrapy instance 
    print("Starting the client ")
    scrapy_key = os.getenv("SCRAPYBARAKEY")
    client = Scrapybara(api_key=scrapy_key)

    print("Starting ubuntu instance")
    scrapy_instance = client.start_ubuntu(timeout_hours=0.1)
    
    print("Starting browser")
    cdp_url = scrapy_instance.browser.start().cdp_url

    print("Starting playwright")
    playwright = sync_playwright().start()
    browser = playwright.chromium.connect_over_cdp(cdp_url)

    return [client, browser, scrapy_instance]

def scrape_website(url, client, scrapy_instance, browser):
    # Starting Scrapybara instance 
    page = browser.new_page()
    page.goto(url)
    page.wait_for_timeout(1000)

    # getcontent_response = client.act(
    #     model=Anthropic(),
    #     tools=[
    #         BashTool(scrapy_instance),
    #         ComputerTool(scrapy_instance),
    #         EditTool(scrapy_instance),
    #     ],
    #     system=UBUNTU_SYSTEM_PROMPT,
    #     prompt=f"""
    #     You are currently on the website of interest.
    #     Extract all the raw text of the article directly from the nested HTML. 
    #     Do not click on any pop-ups. X them out. 

    #     Do not extract text from ads or any unrelated content.
    #     If you hit a CAPTCHA, stop scraping.
    #     """,
    #     schema=Website_Info,
    #     on_step=lambda step: print(step.text)
    #     )
    
    page_content = page.inner_text('body') 
    print(f"\nExtraction: {page_content}")

    return page_content

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
