import os
import dotenv
import requests
import json

dotenv.load_dotenv()  # Load environment variables from .env file

# Access API key from environment variable
API_KEY = os.getenv("NOMIC_ATLAS_API_KEY")
DATASET_ID = os.getenv("NOMIC_ATLAS_DATASET_ID")

def store_data(data, data_format="json"):
    """Stores data in the specified format to the Nomic Atlas dataset."""

    url = f"https://api.nomic.atlas/v1/datasets/{DATASET_ID}/records"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    if data_format == "json":
        response = requests.post(url, json=data, headers=headers)
    elif data_format == "csv":
        # Handle CSV data conversion and upload here
        # ...
        # Replace with your CSV handling logic
        response = requests.post(url, data=csv_data, headers=headers)
    else:
        raise ValueError("Invalid data format. Must be 'json' or 'csv'.")

    if response.status_code == 200:
        print("Data stored successfully")
    else:
        print("Error storing data:", response.text)

def retrieve_data(data_format="json"):
    """Retrieves data from the Nomic Atlas dataset in the specified format."""

    url = f"https://api.nomic.atlas/v1/datasets/{DATASET_ID}/records"
    headers = {"Authorization": f"Bearer {API_KEY}"}

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data_format == "json":
            return data["records"]
        elif data_format == "csv":
            # Handle CSV data conversion and return here
            # ...
            # Replace with your CSV handling logic
            return csv_data
        else:
            raise ValueError("Invalid data format. Must be 'json' or 'csv'.")
    else:
        print("Error retrieving data:", response.text)
        return None

def process_data(data):
    """Processes the retrieved data and generates a response."""

    # Example: Count the number of records
    num_records = len(data)
    print(f"Number of records in the dataset: {num_records}")

    # You can customize this function to perform any desired processing
    # and generate appropriate responses based on the data.

if __name__ == "__main__":
    # Example usage:

    # Store JSON data
    json_data = {
        "name": "John Doe",
        "age": 30,
        "city": "New York"
    }
    store_data(json_data)

    # Retrieve and process data
    retrieved_data = retrieve_data()
    process_data(retrieved_data)