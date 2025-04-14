import requests

api_key = "AIzaSyC1vbVEqNFxn9ssybIMKIOueAi5CZSzNXA"  # <-- Replace with your actual key

url = f"https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"

headers = {
    "Content-Type": "application/json"
}

body = {
    "contents": [
        {
            "parts": [
                {"text": "Generate a 3-slide presentation about the future of AI"}
            ]
        }
    ]
}

response = requests.post(f"{url}?key={api_key}", headers=headers, json=body)

print(response.status_code)
print(response.json())