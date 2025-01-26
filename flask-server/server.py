from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env file
load_dotenv()  
openai_api_key = "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"

client = OpenAI(api_key=openai_api_key)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Test endpoint
@app.route("/members")
def members():
    return jsonify({"members": ["Member1", "Member2", "Member3"]})

# Test functionality of journaling endpoints
@app.route("/test_journal", methods=["GET"])
def test_journal():
    test_response = {
        "keep_prompting": {
            "currentTextData": "Today was a productive day."
        },
        "start_conversation": "Starting journal prompts.",
        "save_journal": {
            "conversationData": [
                "What went well today?",
                "What challenges did you face?",
                "What are you grateful for?"
            ]
        }
    }
    return jsonify(test_response)

# Keep Prompting Endpoint
@app.route("/keep_prompting", methods=["POST"])
def keep_prompting():
    try:
        # Get user input from the frontend
        data = request.json
        current_text_data = data.get("currentTextData", "")

        # Call OpenAI API to generate new prompts
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Provide three journal prompts related to the given text."},
                {"role": "user", "content": current_text_data}
            ],
            max_tokens=100
        )

        # Extract prompts from API response
        prompts = response["choices"][0]["message"]["content"].strip().split("\n")

        return jsonify({"prompts": prompts[:3]})  # Return first 3 prompts

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start Conversation Endpoint
@app.route("/start_conversation", methods=["GET","POST"])
def start_conversation():
    try:
        # Call OpenAI API with a clear request for JSON-formatted output
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an AI designed for journaling assistance. Respond with exactly three journal prompts formatted as JSON: {startingPrompts: {entry: [\"prompt1\", \"prompt2\", \"prompt3\"]}}."}
            ],
            max_tokens=100,
            response_format={"type": "json_object"}  # Ensure JSON output
        )

        # Extract structured JSON response
        json_response = response.choices[0].message.content

        return jsonify(json.loads(json_response))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Save Journal Log Endpoint
@app.route("/save_journal", methods=["POST"])
def save_journal():
    try:
        # Get user input from the frontend
        data = request.json
        conversation_data = data.get("conversationData", [])

        # Add timestamp to the log
        log_entry = {
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "conversation": conversation_data
        }

        # Save to a JSON file
        log_file = "journal_logs.json"

        if os.path.exists(log_file):
            with open(log_file, "r") as file:
                logs = json.load(file)
        else:
            logs = []

        logs.append(log_entry)

        with open(log_file, "w") as file:
            json.dump(logs, file, indent=4)

        return jsonify({"message": "Journal log saved successfully."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)