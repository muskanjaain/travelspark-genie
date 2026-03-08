from flask import Flask, request, jsonify
from flask_cors import CORS
from engine.recommendation_engine import RecommendationEngine

app = Flask(__name__)
CORS(app)

engine = RecommendationEngine()

@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.json

    result = engine.recommend(data)

    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)