from flask import Flask, jsonify, request
from flask_cors import CORS

from methods import predict

app = Flask(__name__)

# Apply CORS to this app
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}},
     allow_headers=["Content-Type", "Authorization",
                    "Access-Control-Allow-Credentials"],
     )


@app.route('/detection', methods=['POST'])
def prediction():
    data = request.get_json()
    end_data = predict(data)
    data.update(end_data)
    return jsonify(data)


# Catch All Unknown/Unspecified Routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def not_found(path):
    return jsonify({
        "message": "Not Found"
    }), 404


if __name__ == '__main__':
    # Run the Flask app and port 5000
    app.run(port=8000, debug=True)
