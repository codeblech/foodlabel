from googleapiclient.discovery import build
import pprint
from dotenv import load_dotenv
import os

load_dotenv()

GOOGLE_CUSTOM_SEARCH_API_KEY = os.getenv("GOOGLE_CUSTOM_SEARCH_API_KEY")
GOOGLE_CUSTOM_SEARCH_ENGINE_ID = os.getenv("GOOGLE_CUSTOM_SEARCH_ENGINE_ID")

def main():
    service = build("customsearch", "v1", developerKey=GOOGLE_CUSTOM_SEARCH_API_KEY)

    res = (
        service.cse()
        .list(
            q="chia seeds health analysis",
            cx=GOOGLE_CUSTOM_SEARCH_ENGINE_ID,
            num=2,
        )
        .execute()
    )
    pprint.pprint(res)


if __name__ == "__main__":
    main()
