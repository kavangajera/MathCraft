from flask import Flask, request, jsonify
from flask_cors import CORS
from ai21 import AI21Client
from ai21.models.chat import UserMessage
import json

app = Flask(__name__)
CORS(app)

# Load configuration
with open('cred.json') as f:
    config = json.load(f)

# Initialize the AI21 client with the API key
API_KEY = config["AI21_KEY"]
client = AI21Client(api_key=API_KEY)

def single_message_instruct(question):
    messages = [
        UserMessage(
            content=question
        )
    ]

    response = client.chat.completions.create(
        model="jamba-1.5-large",
        messages=messages,
        top_p=1.0
    )

    # Extracting the content from the response
    answer = response.choices[0].message.content
    return answer

@app.route('/classify', methods=['POST'])
def classify_question():
    data = request.json
    question = data['question']
    
    prompt = f"Question -> {question} . What is category of this question from Logarithms,Geometry,Statistics,Probability,Polynomials,Calculus,Trigonometry,Complex Number,Relation & Functions and Matrix . Give me one word answer"
    
    category = single_message_instruct(prompt)
    
    return jsonify({"category": category.strip()[:-1]})

if __name__ == '__main__':
    app.run(debug=True, port=5001)