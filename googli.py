import pprint
from dotenv import load_dotenv
import os
import asyncio
import aiohttp
from urllib.parse import quote

load_dotenv()

GOOGLE_CUSTOM_SEARCH_API_KEY = os.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY_2")
GOOGLE_CUSTOM_SEARCH_ENGINE_ID = os.getenv("GOOGLE_CUSTOM_SEARCH_ENGINE_ID_2")


async def search_ingredient(session, ingredient):
    """
    Perform async search for a single ingredient
    """
    try:
        # Construct the API URL
        query = quote(f"{ingredient} health analysis")
        url = f"https://www.googleapis.com/customsearch/v1"
        params = {
            "key": GOOGLE_CUSTOM_SEARCH_API_KEY,
            "cx": GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
            "q": f"{ingredient} health analysis",
            "num": 10,
        }

        async with session.get(url, params=params) as response:
            data = await response.json()

            # Extract relevant information from search results
            search_results = []
            for item in data.get("items", []):
                search_results.append(
                    {
                        "title": item.get("title"),
                        "snippet": item.get("snippet"),
                        "link": item.get("link"),
                    }
                )

            return ingredient, search_results

    except Exception as e:
        print(f"Error searching for {ingredient}: {str(e)}")
        return ingredient, []


async def analyze_google(ingredients):
    """
    Asynchronously search for health analysis of each ingredient using Google Custom Search API

    Args:
        ingredients (list): List of ingredient names

    Returns:
        dict: Dictionary with ingredients as keys and their search results as values
    """
    async with aiohttp.ClientSession() as session:
        # Create tasks for all ingredients
        tasks = [search_ingredient(session, ingredient) for ingredient in ingredients]

        # Wait for all tasks to complete
        results = await asyncio.gather(*tasks)

        # Convert results to dictionary
        return dict(results)


# Helper function to run async code from sync context
def analyze_google_sync(ingredients):
    """
    Synchronous wrapper for analyze_google
    """
    return asyncio.run(analyze_google(ingredients))


if __name__ == "__main__":
    ingredients = ["sugar"]
    results = analyze_google_sync(ingredients)
    pprint.pprint(results)
