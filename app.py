from flask import Flask, request, send_from_directory, jsonify, send_file
import os
from cryptography.fernet import Fernet
from json import loads, dumps
from time import sleep
from sys import path
import requests

if os.environ.get("FLASK_ENV")=='development':
    from dotenv import load_dotenv
    load_dotenv() # take environment variables from .env

app = Flask(__name__,static_folder='build')

username = None
password = None
key = None

@app.before_first_request
def before_first_request():
    global key
    key = Fernet.generate_key()

@app.route("/api/login", methods = ["POST"])
def login():
    responsereq = request.data
    jsonvalue = loads(responsereq)
    fernet = Fernet(key)
    adminmessage = 'admin'
    usermessage = 'user'
    encMessage1 = fernet.encrypt(adminmessage.encode())
    encMessage2 = fernet.encrypt(usermessage.encode())
    if jsonvalue['username'] == 'admin':
        if jsonvalue['password'] == 'admin':
            return {"code":2,"message":"Login Successful","admin":True,"token":encMessage1.decode()}
        else:
            return {"code":4,"message":"Incorrect Password"}
    elif jsonvalue['username'] == 'user':
        if jsonvalue['password'] == 'user':
            return {"code":2,"message":"Login Successful","admin":False,"token":encMessage2.decode()}
        else:
            return {"code":4,"message":"Incorrect Password"}
    else:
        return {"code":4,"message":"user does not exist"}

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if os.environ.get("FLASK_ENV")!='development':
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

if __name__=="__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)