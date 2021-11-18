from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json

endpoint_route_blueprint = Blueprint('endpoint_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "endpointData"
collectionname = "endpoints"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def insert(request):
    endpoint={
        "name": request.name,
        "properties":[{"name": p['name'],"required":p['required'],"type":p["type"]} for p in request.properties],
    }
    #model.endpoints.insert(endpoint)