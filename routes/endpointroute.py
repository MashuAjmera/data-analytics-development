from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json
from routes.userroute import authorisationcheck

endpoint_route_blueprint = Blueprint('endpoint_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "informationModel"
collectionname = "endpoints"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def returnExistingendpoint(name):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    result = collection.find_one({"name":name})
    #print(result)
    return result

@endpoint_route_blueprint.route("/", methods = ["GET"])
def endpointList():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400
    if user == 'admin' or user == 'developer':
        
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        #print("request obtained")
        result = collection.find({},{ "_id": 1, "name": 1})
        #print(result)
        thisList = []
        for x in result:
            resultstr = JSONEncoder().encode(x)
            res = json.loads(resultstr)
            #print(res)
            #resultstr = resultstr.replace('\\',"")
            thisList.append(res)
        #print(thisList)
        resp = {"endpoints":thisList}
        return resp,200
    else:
        return jsonify('Unauthorised Access'),401

@endpoint_route_blueprint.route("/createendpoint", methods = ["POST","GET"])
def createEndpoint():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400
    if user == 'admin' or user == 'onboarder':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        properties = []
        property1 = {
            "_id":"e_01",
            "name":"url"
        }
        property2 = {
            "_id":"e_02",
            "name":"username"
        }
        property3 = {
            "_id":"e_03",
            "name":"password"
        }
        properties.append(property1)
        properties.append(property2)
        properties.append(property3)
        endpoint = {
        "name": request.json['name'],
        "properties":properties
        }
        existingClientlen = len(str(returnExistingendpoint(request.json['name'])))
        if existingClientlen < 5:
            collection.insert_one(endpoint)
            return jsonify('Successful'),200
        else:
            return jsonify('Endpoint already exists'),400
    else:
        return jsonify('Unauthorised Access'),401

@endpoint_route_blueprint.route("/<id>", methods = ["GET"])
def endpointbyId(id):
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400

    if user == 'admin' or user == 'developer':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        resultraw = collection.find_one({"_id":ObjectId(id)})
        result = JSONEncoder().encode(resultraw)
        resp = json.loads(result)
        return resp,200
    else:
        return jsonify('Unauthorised Access'),401

def insert(request):
    endpoint={
        "name": request.name,
        "properties":[{"name": p['name'],"required":p['required'],"type":p["type"]} for p in request.properties],
    }
    #model.endpoints.insert(endpoint)


@endpoint_route_blueprint.route("/xyz", methods = ["GET"])
def endpointxyzbyId():
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    endpoint = {
    "name": "IoT Hub",
    "properties": [
        { "_id":"123","name": "Host", "required": True, "type": "integer" },
        { "_id":"456","name": "PORT", "required": True, "type": "integer" },
    ],
    }
    collection.insert_one(endpoint)
    return jsonify('Successful'),200