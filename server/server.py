from flask import Flask, jsonify, request
from flask_cors import CORS
import csv
import os

app = Flask(__name__)
CORS(app, origins='*')  # Enable CORS for all routes

processed_data = []

def read_file(file_path):
    filedata = []
    with open(file_path, newline='') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            filedata.append(row)  # Get the last column
    return filedata

@app.route("/api/data", methods=['POST'])
def upload_and_process_file():
    global processed_data
    # Check if a file was sent in the request
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    # Save the file
    file = request.files['file']
    #Note by Abdulrehman Suliman
    # The file is in the same directory so just type the file name
    file_path = os.path.join(file.filename)
    print(file_path)
    file.save(file_path)

    # Process the file
    processed_data = read_file(file_path)
    return jsonify({'message': 'File processed successfully'})

@app.route("/api/processed_data", methods=['GET'])
def get_processed_data():
    return jsonify(processed_data)

if __name__ == '__main__':
    app.run(debug=True)