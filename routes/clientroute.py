from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet
from bson.objectid import ObjectId
import json
from routes.userroute import authorisationcheck
from pymongo import ReturnDocument

client_route_blueprint = Blueprint('client_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "userData"
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
        return {"clients":thisList},200
    else:
        return 'Unauthorised',400
     

@client_route_blueprint.route("/add", methods = ["POST","GET"])
def addClient():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400
    if user == 'admin' or user == 'developer':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        client = {
            "name": request.json['name'],
            "drives":[],
            "endpoints":[]
        }
        existingClientlen = len(str(returnExistingclient(request.json['name'])))
        if existingClientlen < 5:
            collection.insert_one(client)
            return 'Successful',200
        else:
            return 'Client already exists',400
    else:
        return 'Unauthorised Access',400

@client_route_blueprint.route("/<id>", methods = ["GET"])
def clientByid(id):
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
        driveList = []
        endpointList = []
        infoDb = cluster['informationModel']
        collectionDrives = infoDb['drives']
        collectionProtocol = infoDb['protocols']
        collectionEndpoint = infoDb['endpoints']
        for drive in resp['drives']:
            resultprotocol = collectionProtocol.find_one({"_id":ObjectId(drive['protocol']['_id'])})
            resultprotocol1 = JSONEncoder().encode(resultprotocol)
            resultprotocol2 = json.loads(resultprotocol1)
            print(resultprotocol2)
            resultdrive = collectionDrives.find_one({"_id":ObjectId(drive['_id'])})
            resultdrive1 = JSONEncoder().encode(resultdrive)
            resultdrive2 = json.loads(resultdrive1)
            #print(resultdrive2)
            datapointsize = len(drive['parameters'])
            #print(datapointsize)
            driveListItem = {
                "_id":drive['_id'],
                "name":resultdrive2['name'],
                "properties":[{"protocol":resultprotocol2['name']},{"datapoints":datapointsize}]
            }
            driveList.append(driveListItem)
        
        for endpoint in resp['endpoints']:
            resultendpoint = collectionEndpoint.find_one({"_id":ObjectId(endpoint['_id'])})
            resultendpoint1 = JSONEncoder().encode(resultendpoint)
            resultendpoint2 = json.loads(resultendpoint1)
            propertiesList = []
            for prop in endpoint['properties']:
                for proper in resultendpoint2['properties']:
                    if prop['_id'] == proper['_id']:
                        propertiesListItem = {"_id":prop['_id'],"name":proper['name'],"value":prop['value']}
                        propertiesList.append(propertiesListItem)
                        break
            #print(resultendpoint2)
            endpointListItem = {
                "_id":resultendpoint2['_id'],
                "name":resultendpoint2['name'],
                "properties":propertiesList
            }
            endpointList.append(endpointListItem)

        responsefinal = {
            "_id":id,
            "name":resp['name'],
            "drives":driveList,
            "endpoints":endpointList

        }
        return {"client": responsefinal},200
    else:
        return 'Unauthorised Access',400

@client_route_blueprint.route("/adddrive", methods = ["GET","POST"])
def clientAddDrive():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400

    if user == 'admin' or user == 'developer':
        clientid = request.json['clientId']
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        drive = request.json['drive']
        resultraw = collection.find_one({"_id":ObjectId(clientid)})
        result1 = JSONEncoder().encode(resultraw)
        resp = json.loads(result1)
        thisList = resp['drives']
        thisList.append(drive)
        resultraw = collection.find_one_and_update({'_id':ObjectId(clientid)},{ '$set': { "drives" : thisList}}, return_document = ReturnDocument.AFTER)
        result = JSONEncoder().encode(resultraw)
        resp = json.loads(result)
        
        return resp,200
    else:
        return 'Unauthorised Access',400

@client_route_blueprint.route("/addendpoint", methods = ["GET"])
def clientAddEndpoint():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400

    if user == 'admin' or user == 'developer':
        clientid = request.json['clientId']
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        endpoint = request.json['endpoint']
        resultraw = collection.find_one({"_id":ObjectId(clientid)})
        result1 = JSONEncoder().encode(resultraw)
        resp = json.loads(result1)
        thisList = resp['endpoints']
        thisList.append(endpoint)
        resultraw = collection.find_one_and_update({'_id':ObjectId(clientid)},{ '$set': { "endpoints" : thisList}}, return_document = ReturnDocument.AFTER)
        result = JSONEncoder().encode(resultraw)
        resp = json.loads(result)
        
        return resp,200
    else:
        return 'Unauthorised Access',400

def insert(request):
    client={
        "name": request.name,
        "drives":[{
            "id":drive['id'],
            "protocol":{
                "id":drive['protocol']['id'],
                "properties":[{
                    "name": prop['name'],
                    "value": prop['value']
                } for prop in drive['protocol']['properties']]
            },
            "parameters":[pid for pid in drive['parameters']]
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