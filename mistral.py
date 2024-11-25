import os
from mistralai import Mistral
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["MISTRAL_API_KEY"]
print(api_key)
model = "mistral-large-latest"

client = Mistral(api_key=api_key)

chat_response = client.chat.complete(
    model=model,
    response_format={"type": "json_object"},
    messages=[
        {
            "role": "user",
            "content": "What is the best French cheese?",
        },
    ],
)

print(chat_response.choices[0].message.content)
