from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json
from routes.userroute import authorisationcheck

protocol_route_blueprint = Blueprint('protocol_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "informationModel"
collectionname = "protocols"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def returnExistingprotocol(name):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    result = collection.find_one({"name":name})
    #print(result)
    return result

@protocol_route_blueprint.route("/", methods = ["GET"])
def protocolList():
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
        resp = {"protocols":thisList}
        return resp,200
    else:
        return 'Unauthorised',400

@protocol_route_blueprint.route("/createprotocol", methods = ["POST","GET"])
def createprotocol():
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
            "_id":"p_01",
            "name":"ip_address"
        }
        property2 = {
            "_id":"p_02",
            "name":"port"
        }
        
        properties.append(property1)
        properties.append(property2)
        
        protocol = {
        "name": request.json['name'],
        "properties":properties
        }
        existingClientlen = len(str(returnExistingprotocol(request.json['name'])))
        if existingClientlen < 5:
            collection.insert_one(protocol)
            return 'Successful',200
        else:
            return 'Endpoint already exists',400
    else:
        return 'Unauthorised Access',400

@protocol_route_blueprint.route("/<id>", methods = ["GET"])
def protocolbyId(id):
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
        return 'Unauthorised Access',400

def insert(request):
    protocol={
        "name": request.name,
        "properties":[{"name": p['name'],"required":p['required'],"type":p['type']} for p in request.properties],
    }
    #model.protocols.insert(protocol)