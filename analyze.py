from blinkit import extract_image_urls_from_url, modify_image_url, open_image_from_url
import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
from prompts import analyze_food_prompt, extract_ingredients_and_nutrition_prompt
from flask import jsonify
import PIL.Image
import pandas as pd
from googli import analyze_google_sync

def load_reference_data():
    """Load and prepare reference data from CSV files"""
    try:
        # Load CSV files
        scogs_df = pd.read_csv('data/FDA--SCOGS.csv')
        monographs_df = pd.read_csv('data/monographs.csv')
        roc_df = pd.read_csv('data/roc15_casrn_index.csv')
        fda_substances_df = pd.read_csv('data/FDA--FoodSubstances.csv')

        return {
            'scogs': scogs_df,
            'monographs': monographs_df,
            'roc': roc_df,
            'fda_substances': fda_substances_df
        }
    except Exception as e:
        print(f"Error loading reference data: {e}")
        return None

def lookup_ingredient_safety(ingredient_name, cas_number, reference_data):
    """Look up safety information for an ingredient across reference databases"""
    safety_info = []

    # Check SCOGS database
    scogs_match = reference_data['scogs'][
        (reference_data['scogs']['GRAS Substance'].str.contains(ingredient_name, case=False, na=False)) |
        (reference_data['scogs']['CAS Reg. No. or other ID CODE'] == cas_number)
    ]
    if not scogs_match.empty:
        safety_info.append(f"FDA SCOGS Status: {scogs_match.iloc[0]['SCOGS Type of Conclusion']}")

    # Check IARC Monographs
    monographs_match = reference_data['monographs'][
        (reference_data['monographs']['Agent'].str.contains(ingredient_name, case=False, na=False)) |
        (reference_data['monographs']['CAS No.'] == cas_number)
    ]
    if not monographs_match.empty:
        safety_info.append(f"IARC Classification: Group {monographs_match.iloc[0]['Group']}")

    # Check ROC listing
    roc_match = reference_data['roc'][
        (reference_data['roc']['NAME OR SYNONYM'].str.contains(ingredient_name, case=False, na=False)) |
        (reference_data['roc']['CASRN'] == cas_number)
    ]
    if not roc_match.empty:
        safety_info.append(f"Report on Carcinogens Status: {roc_match.iloc[0]['Listing in the 15th RoC']}")

    return safety_info if safety_info else ["No safety classification found in reference databases"]

def analyze_product_image(image_path):
    try:
        print("\n=== Starting Image Analysis ===")

        # Setup Gemini
        print("\n1. Configuring Gemini...")
        load_dotenv()
        genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
        model = genai.GenerativeModel("gemini-1.5-pro")

        # Load reference data
        reference_data = load_reference_data()
        if not reference_data:
            raise Exception("Failed to load reference data")

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

        # After extracting ingredients, look up safety information
        safety_data = {}
        for ingredient in extracted_data["ingredients"]:
            # Note: In practice, you'd need to extract/match CAS numbers
            safety_info = lookup_ingredient_safety(ingredient, None, reference_data)
            safety_data[ingredient] = safety_info

        # Add safety data to the analysis
        extracted_data["safety_classifications"] = safety_data

        # Add Google search results for ingredients
        google_results = analyze_google_sync(extracted_data["ingredients"])
        extracted_data["ingredient_search_results"] = google_results

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

        # After extracting ingredients and nutrition data
        extracted_data = json.loads(extraction_response.text.strip().strip("```json").strip())

        # Add Google search results for ingredients
        google_results = analyze_google_sync(extracted_data["ingredients"])
        extracted_data["ingredient_search_results"] = google_results

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