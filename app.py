from flask import Flask, request, send_from_directory, jsonify, send_file
import os
from cryptography.fernet import Fernet
from flask import Blueprint
from json import loads, dumps
from time import sleep
from sys import path
import requests
import pymongo
from pymongo import mongo_client
from routes.userroute import user_route_blueprint
from routes.clientroute import client_route_blueprint
from routes.driveroute import drive_route_blueprint
from routes.endpointroute import endpoint_route_blueprint

if os.environ.get("FLASK_ENV")=='development':
    from dotenv import load_dotenv
    load_dotenv() # take environment variables from .env

app = Flask(__name__,static_folder='build')
#app = Flask(__name__)
app.register_blueprint(user_route_blueprint, url_prefix="/api/users")
app.register_blueprint(client_route_blueprint, url_prefix="/api/clients")
app.register_blueprint(drive_route_blueprint, url_prefix="/api/drives")
app.register_blueprint(endpoint_route_blueprint, url_prefix="/api/endpoints")

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