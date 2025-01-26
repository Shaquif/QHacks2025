from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from openai import OpenAI

# Load API key from .env file
load_dotenv()  
openai_api_key = os.getenv("API_KEY")
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
        data = request.get_json()
        current_text_data = data.get("currentTextData", "")

        # Call OpenAI API to generate new prompts
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Provide three journal prompts related to the given text, formatted as JSON: {prompts: [\"prompt1\", \"prompt2\", \"prompt3\"]}."},
                {"role": "user", "content": current_text_data}
            ],
            max_tokens=100,
            response_format={"type": "json_object"}  # Ensure JSON output
        )

        # Extract structured JSON response
        json_response = response.choices[0].message.content
        parsed_response = json.loads(json_response)

        return jsonify(parsed_response)

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
    
# Define functions for processing text
def summarize_text(text):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Your job is to summarize the text you are given. Format it like you are talking to the person, so language like 'you said you....' type of thing."},
                {"role": "user", "content": f"Summarize the following text:\n{text}"}
            ],
            temperature=0.7
        )
        print("Raw response:", response)  # Debugging step
        return response.choices[0].message.content
    except Exception as e:
        print("Error in summarize_text:", e)
        return None


def analyze_sentiment(text):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an assistant that performs sentiment analysis. "
                               "Classify the sentiment of the text into one of these emotions: "
                               "Happy, Very Happy, Excited, Sad, Scared, Angry, Depressed, Frustrated. Return only the emotion"
                },
                {
                    "role": "user",
                    "content": f"Analyze the sentiment of the following text:\n{text}"
                }
            ],
            temperature=0.7
        )
        print("Raw response:", response)
        return response.choices[0].message.content.strip()  # Strip extra spaces/newlines
    except Exception as e:
        print("Error in analyze_sentiment:", e)
        return "Error: Unable to analyze sentiment."

# Save Journal Log Endpoint
@app.route("/save_journal", methods=["POST"])
def save_journal():
    try:
        # Get user input from the frontend
        data = request.json
        conversation_data = data.get("conversationData", "")

        # Process text (summarize and analyze sentiment)
        summary = summarize_text(conversation_data)
        sentiment = analyze_sentiment(conversation_data)

         # Save to a JSON file
        log_file = "journal_logs.json"

        if os.path.exists(log_file):
            with open(log_file, "r") as file:
                logs = json.load(file)
        else:
            logs = []

        next_id = 1 if not logs else logs[-1].get("id", 0) + 1

        # Add timestamp and processed data to the log
        log_entry = {
            "id": next_id,
            "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "conversation": conversation_data,
            "summary": summary,
            "sentiment": sentiment
        }

        logs.append(log_entry)

        with open(log_file, "w") as file:
            json.dump(logs, file, indent=4)

        return jsonify({"message": "Journal log saved successfully.", "id": next_id})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/flask-server/journal_logs.json')
def get_logs():
    import json
    with open('journal_logs.json') as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)