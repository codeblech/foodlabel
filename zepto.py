from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import google.generativeai as genai
import os
from dotenv import load_dotenv
import PIL.Image
import requests
from io import BytesIO
import re

load_dotenv()

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    service = Service(os.getenv("CHROMEDRIVER_PATH"))
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_window_size(1920, 1080)
    return driver

def extract_image_urls(driver, url):
    driver.get(url)
    try:
        # Wait for the holder div to be present
        holder = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "holder"))
        )
        # Find all img elements within the holder div
        img_elements = holder.find_elements(By.TAG_NAME, "img")
        # Extract src attributes
        image_urls = [img.get_attribute("src") for img in img_elements if img.get_attribute("src")]
        return image_urls
    except TimeoutException:
        print("Timed out waiting for images to load.")
        return []
    except NoSuchElementException:
        print("Could not find the holder div.")
        return []

def modify_image_url(url):
    # Remove any existing size and quality parameters
    url = re.sub(r'(,w=\d+|,h=\d+|,q=\d+)', '', url)
    # Add our desired parameters
    return f"{url},w=1200,h=1200,q=100"

def open_image_from_url(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = PIL.Image.open(BytesIO(response.content))
        return image
    except Exception as e:
        print(f"Error opening image from URL {image_url}: {str(e)}")
        return None

if __name__ == "__main__":
    url = "https://www.zeptonow.com/pn/mccain-french-fries/pvid/d29ed8d9-cf7a-4547-a96d-a8883785ab64"
    driver = None
    try:
        driver = setup_driver()
        image_urls = extract_image_urls(driver, url)
        image_urls = [modify_image_url(url) for url in image_urls]
        
        genai.configure(api_key=os.getenv("API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-pro")
        
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
        
        prompt = [
            r"""extract the nutritional label and ingredients. only answer on the basis of the images i provide. some images might not have any useful information. provide the complete relevant information. do not miss out details. do not guess anything. only use the data in the images. if ingredients not present say "ingredients not present" if nutritional label not present say "nutritional label not present" your output should be in json format."""
        ]
        
        response = model.generate_content(prompt + image_list)
        print(response.text)
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        if driver:
            driver.quit()