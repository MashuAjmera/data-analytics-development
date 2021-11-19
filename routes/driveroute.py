from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json

drive_route_blueprint = Blueprint('drive_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "driveData"
collectionname = "drives"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

@drive_route_blueprint.route("/", methods = ["GET"])
def driveList():
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    result = collection.find({},{ "_id": 1, "name": 1})
    thisList = []
    for x in result:
        resultstr = JSONEncoder().encode(x)
        #resultstr = resultstr.replace('\\',"")
        thisList.append(resultstr)
    return {"code":2,"message":"Successful","drives":thisList}

@drive_route_blueprint.route("/<id>", methods = ["GET"])
def clientByid(id):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    resultraw = collection.find_one({"_id":ObjectId(id)})
    result = JSONEncoder().encode(resultraw)
    return {"code":2,"message":"Success","drive":result}


def insert(request):
    drive={
        "name": request.name,
        "parameters":[{"id":'',"name": p['name'],"unit":p['unit'],"type": p["type"],"alias":p['name'], "interval":p["interval"]} for p in request.parameters],
        "protocols":[id for id in request.protocols],
    }
    #model.drives.insert(drive)