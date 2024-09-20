# from selenium import webdriver
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# import json

# def scrape_product_images(url):
#     # Setup WebDriver (Chrome in this example)
#     driver = webdriver.Chrome()  # Make sure you have chromedriver installed and in PATH
    
#     try:
#         # Navigate to the page
#         driver.get(url)
        
#         # Wait for the div with id="holder" to be present
#         holder = WebDriverWait(driver, 10).until(
#             EC.presence_of_element_located((By.ID, "holder"))
#         )
        
#         # Find all img elements within the holder div
#         img_elements = holder.find_elements(By.TAG_NAME, "img")
        
#         # Extract image information
#         images = []
#         for img in img_elements:
#             image_info = {
#                 "alt": img.get_attribute("alt"),
#                 "src": img.get_attribute("src")
#             }
#             images.append(image_info)
        
#         # Print and save the results
#         print(json.dumps(images, indent=2))
#         with open("product_images.json", "w") as f:
#             json.dump(images, f, indent=2)
        
#         print(f"Scraped {len(images)} images. Data saved to product_images.json")
        
#     finally:
#         # Close the browser
#         driver.quit()

# # URL of the page to scrape
# url = "https://www.zeptonow.com/pn/mccain-french-fries/pvid/d29ed8d9-cf7a-4547-a96d-a8883785ab64"

# scrape_product_images(url)

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import json
import time

def scrape_product_images(url):
    # Setup WebDriver (Chrome in this example)
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in headless mode (optional)
    driver = webdriver.Chrome(options=options)
    
    try:
        # Navigate to the page
        driver.get(url)
        
        # Wait for the slider wrapper to be present
        slider_wrapper = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "slider-wrapper"))
        )
        
        # Find the right arrow button
        right_arrow = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[@aria-label='right arrow']"))
        )
        
        images = []
        prev_src = set()
        
        while True:
            # Wait for images to load
            time.sleep(1)
            
            # Find all img elements within the slider wrapper
            img_elements = slider_wrapper.find_elements(By.TAG_NAME, "img")
            
            # Extract image information
            for img in img_elements:
                src = img.get_attribute("src")
                if src and src not in prev_src:
                    image_info = {
                        "alt": img.get_attribute("alt"),
                        "src": src
                    }
                    images.append(image_info)
                    prev_src.add(src)
            
            # Click the right arrow
            try:
                right_arrow.click()
            except:
                # If clicking fails, we've reached the end of the slideshow
                break
        
        # Print and save the results
        print(json.dumps(images, indent=2))
        with open("product_images.json", "w") as f:
            json.dump(images, f, indent=2)
        
        print(f"Scraped {len(images)} images. Data saved to product_images.json")
        
    finally:
        # Close the browser
        driver.quit()

# URL of the page to scrape
url = "https://www.zeptonow.com/product/mccain-french-fries-1-25-kg/d29ed8d9-cf7a-4547-a96d-a8883785ab64"

scrape_product_images(url)