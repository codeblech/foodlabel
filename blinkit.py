from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in headless mode
    service = Service("path/to/chromedriver")  # Update this path
    return webdriver.Chrome(service=service, options=chrome_options)


def extract_image_urls(url):
    driver = setup_driver()
    driver.get(url)

    # Wait for the product images to load
    image_selector = ".ProductCarousel__CarouselImage-sc-11ow1fv-4"
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, image_selector))
    )

    # Extract all image URLs
    images = driver.find_elements(By.CSS_SELECTOR, image_selector)
    image_urls = [img.get_attribute("src") for img in images]

    driver.quit()
    return image_urls


def main():
    url = "https://blinkit.com/prn/tops-tomato-ketchup/prid/436913"  # Replace with the actual product URL
    image_urls = extract_image_urls(url)

    print(f"Found {len(image_urls)} image URLs:")
    for i, url in enumerate(image_urls, 1):
        print(f"{i}. {url}")


if __name__ == "__main__":
    main()
