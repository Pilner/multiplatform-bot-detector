from flask import Flask, jsonify, request, url_for, send_file
from flask_cors import CORS

from methods_prediction import predict
from methods_performance import performance

import pandas as pd

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
    data['prediction'] = end_data
    return jsonify(data)


@app.route('/performance/baseline', methods=['POST'])
def baseline_performance():
    if 'file' not in request.files:
        return jsonify({
            "message": "No file part"
        }), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            "message": "No file selected for uploading"
        }), 400

    end_data, excel_file = performance(file, "baseline_model")

    file_url = url_for('download_excel', filename=excel_file, _external=True)

    end_data.update({
        "excel_download": file_url
    })

    return jsonify(end_data)


@app.route('/performance/proposed', methods=['POST'])
def proposed_performance():
    if 'file' not in request.files:
        return jsonify({
            "message": "No file part"
        }), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            "message": "No file selected for uploading"
        }), 400

    end_data, excel_file = performance(file, "proposed_model")

    file_url = url_for('download_excel', filename=excel_file, _external=True)

    end_data.update({
        "excel_download": file_url
    })

    return jsonify(end_data)


@app.route('/performance/download_excel', methods=['GET'])
def download_excel():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({
            "message": "No file specified"
        }), 400

    try:
        # Return the Excel file as an attachment
        return send_file(filename, as_attachment=True)
    except Exception as e:
        return jsonify({
            "message": f"File not found: {e}"
        }), 404

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
