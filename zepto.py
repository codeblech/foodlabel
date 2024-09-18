from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import os
from dotenv import load_dotenv
import re
import requests
from io import BytesIO
from PIL import Image

load_dotenv()

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run headless Chrome
    service = Service(os.getenv("CHROMEDRIVER_PATH"))
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_window_size(1920, 1080)
    return driver

def extract_image_urls(driver, url):
    driver.get(url)
    # CSS selector based on the provided HTML
    image_selector = "div[class*='relative'] img"
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, image_selector))
        )
    except TimeoutException:
        print("Timed out waiting for product images to load.")
        return []

    # Extract src attribute of all image elements
    images = driver.find_elements(By.CSS_SELECTOR, image_selector)
    image_urls = [img.get_attribute("src") for img in images if img.get_attribute("src")]
    return image_urls

def extract_image_urls_from_url(url):
    driver = setup_driver()
    try:
        return extract_image_urls(driver, url)
    finally:
        driver.quit()

def open_image_from_url(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        return image
    except Exception as e:
        print(f"Error opening image from URL {image_url}: {str(e)}")
        return None

def modify_image_url(url):
    # Remove any existing size and quality parameters
    return re.sub(r'(,w=\d+|,h=\d+|,q=\d+)', '', url)

if __name__ == "__main__":
    url = "https://www.zeptonow.com/pn/mccain-french-fries/pvid/d29ed8d9-cf7a-4547-a96d-a8883785ab64"
    image_urls = extract_image_urls_from_url(url)
    image_urls = [modify_image_url(url) for url in image_urls]

    print("Extracted image URLs:")
    for url in image_urls:
        print(url)

    image_list = [
        open_image_from_url(image_url)
        for image_url in image_urls
        if open_image_from_url(image_url) is not None
    ]

    print(f"Number of images successfully loaded: {len(image_list)}")

    if not image_list:
        print("No images were successfully loaded. Exiting.")
        exit()

    # You can now process the images as per your requirements.
