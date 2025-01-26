from flask import Flask, request, jsonify
import openai
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Requests

# Test endpoint
@app.route("/members")
def members():
    return jsonify({"members": ["Member1", "Member2", "Member3"]})

# Keep Prompting Endpoint
@app.route("/prompting", methods=["POST"])
def keepPrompting():
    try:
        # Get user input from the frontend
        data = request.json
        currentTextData = data.get("currentTextData", "")

        # Call OpenAI API to generate new prompts
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Provide three journal prompts related to the given text."},
                {"role": "user", "content": currentTextData}
            ],
            max_tokens=100
        )

        # Extract prompts from API response
        prompts = response["choices"][0]["message"]["content"].strip().split("\n")

        return jsonify({"prompts": prompts[:3]})  # Return first 3 prompts

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/prompting", methods=["POST"])


if __name__ == "__main__":
    app.run(debug=True, port=5000)