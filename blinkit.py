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
import json
import PIL.Image
import requests
from io import BytesIO
import re


from prompts import analyze_food_prompt
load_dotenv()


def setup_driver():
    print("Setting up the Chrome driver...")
    chrome_options = Options()
    service = Service(os.getenv("CHROMEDRIVER_PATH"))
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_window_size(1920, 1080)
    print("Chrome driver setup complete.")
    return driver


def close_popup(driver):
    print("Attempting to close the popup...")
    try:
        close_button = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//img[@alt='Close Slider']"))
        )
        close_button.click()
        print("Popup closed successfully.")
    except TimeoutException:
        print("No popup found or popup didn't appear within the timeout.")
    except NoSuchElementException:
        print("Close button not found. Popup may not be present.")
    except Exception as e:
        print(f"An error occurred while trying to close the popup: {str(e)}")


def extract_image_urls(driver, url):
    print(f"Navigating to URL: {url}")
    driver.get(url)

    close_popup(driver)

    image_selector = ".ProductCarousel__CarouselImage-sc-11ow1fv-4"
    print("Waiting for product images to load...")
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, image_selector))
        )
    except TimeoutException:
        print("Timed out waiting for product images to load.")
        return []

    images = driver.find_elements(By.CSS_SELECTOR, image_selector)
    image_urls = [img.get_attribute("src") for img in images]
    print(f"Extracted {len(image_urls)} image URLs.")

    return image_urls


def extract_image_urls_from_url(url):
    driver = setup_driver()
    try:
        return extract_image_urls(driver, url)
    finally:
        print("Closing the browser...")
        driver.quit()


def open_image_from_url(image_url):
    print(f"Opening image from URL: {image_url}")
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Ensure the request was successful
        image = PIL.Image.open(BytesIO(response.content))
        print("Image opened successfully.")
        return image
    except Exception as e:
        print(f"Error opening image from URL {image_url}: {str(e)}")
        return None


def modify_image_url(url):
    print(f"Modifying image URL: {url}")
    # Pattern to match w, h, and q parameters
    height_pattern = r",h=\d+"
    width_pattern = r",w=\d+"
    quality_pattern = r",q=\d+"

    # Apply the replacements
    modified_url = re.sub(height_pattern, ",h=1200", url)
    modified_url = re.sub(width_pattern, ",w=1200", modified_url)
    modified_url = re.sub(quality_pattern, ",q=100", modified_url)

    print(f"Modified URL: {modified_url}")
    return modified_url


if __name__ == "__main__":
    print("Starting the image extraction process...")
    url = "https://blinkit.com/prn/britannia-fruit-cake/prid/336628"
    image_urls = extract_image_urls_from_url(url)
    image_urls = [modify_image_url(url) for url in image_urls]

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-pro")

    print("Opening images and generating content...")
    image_list = [
        open_image_from_url(image_url)
        for image_url in image_urls
        if open_image_from_url(image_url) is not None
    ]
    prompt = [analyze_food_prompt]

    response = model.generate_content(prompt + image_list)
    print("Content generated successfully.")
    print(response.text)
    data = json.loads(response.text.strip().strip("```json").strip("```"))
    print(data)
    ingredients_list = data["ingredients"]
    nutritional_label = data["nutritional label"]
    print("Ingredients List:", ingredients_list)
    print("Nutritional Label:", nutritional_label)
