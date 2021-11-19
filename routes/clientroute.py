from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json

client_route_blueprint = Blueprint('client_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "clientData"
collectionname = "clients"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def returnExistingclient(name):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    result = collection.find_one({"name":name})
    #print(result)
    return result

@client_route_blueprint.route("/", methods = ["GET"])
def clientList():
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
        print(res)
        #resultstr = resultstr.replace('\\',"")
        thisList.append(res)
    #print(thisList)
    return {"code":2,"message":"Successful","clients":thisList}
     

@client_route_blueprint.route("/add", methods = ["POST","GET"])
def addClient():
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    client = {
        "name": request.json['name']
    }
    existingClientlen = len(str(returnExistingclient(request.json['name'])))
    if existingClientlen < 5:
        collection.insert_one(client)
        return {"code":2,"message":"Client added successfully"}
    else:
        return {"code":4,"message":"Client already exist"}

@client_route_blueprint.route("/<id>", methods = ["GET"])
def clientByid(id):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    resultraw = collection.find_one({"_id":ObjectId(id)})
    result = JSONEncoder().encode(resultraw)
    res = json.loads(result)
    return {"code":2,"message":"Success","client":res}

def insert(request):
    client={
        "name": request.name,
        "drives":[{
            "id":drive['id'],
            "protocol":{
                "id":drive['protocol']['id'],
                "properties":[{
                    "id": prop['id'],
                    "value": prop['value']
                } for prop in drive['protocol']['properties']]
            },
            "parameters":[{"id":p.id,"interval":p.interval} for p in drive['parameters']]
        } for drive in request.drives],
        "endpoints":[{
            "id":ep['id'],
            "properties":[{
                "name": prop['name'],
                "value": prop['value']
            } for prop in ep['properties']]
        } for ep in request.endpoints]
    }
    #userData.clients.insert(client)