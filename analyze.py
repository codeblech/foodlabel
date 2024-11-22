from blinkit import extract_image_urls_from_url, modify_image_url, open_image_from_url
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from prompts import analyze_food_prompt, extract_ingredients_and_nutrition_prompt
from flask import jsonify
import PIL.Image

def analyze_product_image(image_path):
    try:
        print("\n=== Starting Image Analysis ===")

        # Setup Gemini
        print("\n1. Configuring Gemini...")
        load_dotenv()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-pro")

        # Load and process image
        print("\n2. Processing image...")
        image = PIL.Image.open(image_path)

        # Extract ingredients and nutrition data
        print("\n3. Extracting ingredients and nutrition data...")
        extraction_response = model.generate_content([extract_ingredients_and_nutrition_prompt, image])
        print("Raw extraction response:", extraction_response.text)

        extracted_data = json.loads(extraction_response.text.strip().strip("```json").strip())
        print("\nExtracted Data:")
        print("Ingredients:", extracted_data["ingredients"])
        print("Nutrition:", extracted_data["nutritional label"])

        # Analyze the data
        print("\n4. Analyzing nutritional data...")
        analysis_prompt = analyze_food_prompt + "\n\nAnalyze this product data:\n" + json.dumps(extracted_data)
        analysis_response = model.generate_content(analysis_prompt)
        analysis_response_cleaned = analysis_response.text.strip().strip("```json").strip()
        analysis_response_cleaned = json.loads(analysis_response_cleaned)

        print("\n=== Analysis Results ===")
        print(analysis_response_cleaned)

        return {
            "success": True,
            "data": {
                "extracted_data": extracted_data,
                "analysis": analysis_response_cleaned
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Update the original analyze_product function to handle both URLs and images
def analyze_product(source, is_url=True):
    if is_url:
        # Existing URL analysis code
        return analyze_product_url(source)
    else:
        # New image analysis code
        return analyze_product_image(source)

# Rename the original function to be more specific
def analyze_product_url(url):
    try:
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
        analysis_response_cleaned = analysis_response.text.strip().strip("```json").strip()
        analysis_response_cleaned = json.loads(analysis_response_cleaned)

        print("\n=== Analysis Results ===")
        print(analysis_response_cleaned)

        return {
            "success": True,
            "data": {
                "extracted_data": extracted_data,
                "analysis": analysis_response_cleaned
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    url = "https://blinkit.com/prn/cadbury-gems-duo-pack-chocolate/prid/110655"
    analyze_product(url)