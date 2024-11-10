from blinkit import extract_image_urls_from_url, modify_image_url, open_image_from_url
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from prompts import analyze_food_prompt, extract_ingredients_and_nutrition_prompt

def analyze_product(url):
    print("\n=== Starting Product Analysis ===")

    # Extract and process images
    print("\n1. Extracting images from URL...")
    image_urls = extract_image_urls_from_url(url)
    image_urls = [modify_image_url(url) for url in image_urls]

    # Setup Gemini
    print("\n2. Configuring Gemini...")
    load_dotenv()
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-pro")

    # Process images
    print("\n3. Processing images...")
    image_list = [
        open_image_from_url(image_url)
        for image_url in image_urls
        if open_image_from_url(image_url) is not None
    ]

    # First get ingredients and nutrition data
    print("\n4. Extracting ingredients and nutrition data...")
    extraction_response = model.generate_content([extract_ingredients_and_nutrition_prompt] + image_list)
    print("Raw extraction response:", extraction_response.text)

    extracted_data = json.loads(extraction_response.text.strip().strip("```json").strip())
    print("\nExtracted Data:")
    print("Ingredients:", extracted_data["ingredients"])
    print("Nutrition:", extracted_data["nutritional label"])

    # Then analyze the data
    print("\n5. Analyzing nutritional data...")
    analysis_prompt = analyze_food_prompt + "\n\nAnalyze this product data:\n" + json.dumps(extracted_data)
    analysis_response = model.generate_content(analysis_prompt)

    print("\n=== Analysis Results ===")
    print(analysis_response.text)

    return extracted_data, analysis_response.text

if __name__ == "__main__":
    url = "https://blinkit.com/prn/budweiser-green-apple-beer/prid/480014"
    extracted_data, analysis = analyze_product(url)
