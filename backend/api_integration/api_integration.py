from google import genai

client = genai.Client(api_key='AIzaSyBPI09UXBL3IL0EHFkVClkhsHWHLHmG8C4')

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Explain how LLM works in a few lines",
)

print(response.text)