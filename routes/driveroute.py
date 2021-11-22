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


drive_route_blueprint = Blueprint('drive_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "informationModel"
collectionname = "drives"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

@drive_route_blueprint.route("/", methods = ["GET"])
def driveList():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400
    if user == 'admin' or user == 'developer':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        result = collection.find({},{ "_id": 1, "name": 1})
        thisList = []
        for x in result:
            resultstr = JSONEncoder().encode(x)
            res = json.loads(resultstr)
            #print(res)
            #resultstr = resultstr.replace('\\',"")
            thisList.append(res)
        resp = {"drives":thisList}
        return resp,200
    else:
        return 'Unauthorised Access',400

@drive_route_blueprint.route("/<id>", methods = ["GET"])
def drivebyId(id):
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
        protocolIdList = resp['protocols']
        collectionProtocol = db['protocols']
        protocolList = []
        for x in protocolIdList:
            resultprotocol = collectionProtocol.find_one({"_id":ObjectId(x['_id'])})
            resultprotocol1 = JSONEncoder().encode(resultprotocol)
            resultprotocol2 = json.loads(resultprotocol1)
            protocolList.append(resultprotocol2)
        updatedict = {
            "protocols":protocolList
        }
        for sub in resp:
            if sub in updatedict:
                resp[sub]  = updatedict[sub]

        return resp,200
    else:
        return 'Unauthorised Access',400

@drive_route_blueprint.route("/createDrive", methods = ["POST"])
def createDrive():
    #author = request.headers.get('Authorization')
    #try:
    #    user = authorisationcheck(author)
    #except:
    #    return 'Invalid Token',400
    #if user == 'admin' or user == 'onboarder':
    f = request.files['file']
    print(f.filename)
    f.save('/home/ashwin/Desktop', f.filename)
    return 'Successful',200
    #else:
    #    return 'Unauthorised Access',400

@drive_route_blueprint.route("/<id>/parameters/<paramid>", methods = ["PUT"])
def editdriveparameter(id,paramid):
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return 'Invalid Token',400
    if user == 'governer' or user == 'admin':
        paramname = request.json['name']
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        resultraw = collection.find_one({"_id":ObjectId(id)})
        result = JSONEncoder().encode(resultraw)
        resp = json.loads(result)
        parameterList = []
        for parameter in resp['parameters']:
            if paramid == parameter['_id']:
                param = {
                    "_id": parameter['_id'],
                    "name":paramname,
                    "unit":parameter['unit']
                }
                parameterList.append(param)
            else:
                parameterList.append(parameter)
        resultraw = collection.find_one_and_update({'_id':ObjectId(id)},{ '$set': { "parameters" : parameterList}}, return_document = ReturnDocument.AFTER)

        return 'Successfully Updated',200
    else:
        return 'Unauthorised Access',400


def insert(request):
    drive={
        "name": request.name,
        "parameters":[{"id":'',"name": p['name'],"unit":p['unit'],"type": p["type"],"alias":p['name'], "interval":p["interval"]} for p in request.parameters],
        "protocols":[id for id in request.protocols],
    }
    #model.drives.insert(drive)