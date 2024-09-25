from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
import os
from dotenv import load_dotenv

def setup_driver():
    load_dotenv()
    chrome_options = webdriver.ChromeOptions()
    service = webdriver.chrome.service.Service(os.getenv("CHROMEDRIVER_PATH"))
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_window_size(1920, 1080)
    return driver

def download_pdfs(url, download_dir):
    # Create the download directory if it doesn't exist
    os.makedirs(download_dir, exist_ok=True)

    # Initialize the Selenium webdriver
    try:
        driver = setup_driver()
    except WebDriverException as e:
        print(f"Error initializing Chrome driver: {str(e)}")
        return

    try:
        # Navigate to the URL
        driver.get(url)

        # Wait for the page to load
        wait = WebDriverWait(driver, 30)
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".bulk-content__article")))

        # Find all the PDF links
        pdf_links = [link.get_attribute("href") for link in driver.find_elements(By.CSS_SELECTOR, "a[href$='.pdf']")]

        # Download the PDF files
        for pdf_link in pdf_links:
            pdf_filename = os.path.basename(pdf_link)
            pdf_path = os.path.join(download_dir, pdf_filename)

            # Download the PDF file
            driver.execute_script(f"window.open('{pdf_link}','_blank');")
            driver.switch_to.window(driver.window_handles[1])
            with open(pdf_path, "wb") as file:
                file.write(driver.find_element(By.TAG_NAME, "body").text.encode())
            driver.close()
            driver.switch_to.window(driver.window_handles[0])

            print(f"Downloaded: {pdf_filename}")

    except TimeoutException:
        print("Timed out waiting for page to load.")
    except NoSuchElementException:
        print("Unable to find PDF links on the page.")
    except Exception as e:
        print(f"An error occurred during PDF download: {str(e)}")
    finally:
        # Close the webdriver
        driver.quit()

if __name__ == "__main__":
    url = "https://efsa.onlinelibrary.wiley.com/results/fdcaead5-2be1-4c72-bf46-18a428c3b60e/26169106-fb5e-4541-9486-5c2ad6248fb8"
    download_dir = "pdf_downloads"
    download_pdfs(url, download_dir)