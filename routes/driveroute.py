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
import os


drive_route_blueprint = Blueprint('drive_route_blueprint', __name__)

clusterurl = os.getenv('URI')
dbname = "informationModel"
collectionname = "drives"

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def insertDrive(path,protocolList):
    try:

        with open(path, encoding='utf-8-sig') as myfile:
            data=myfile.read()

        obj = json.loads(data)
        thislist = []
        dname = str(obj["name"])

        for variablename in obj['variables']:
            #print(str(obj['variables'][variablename]))
            try:
                namevar = str(obj['variables'][variablename]['description']).split(" (")[0]
                listitem = {"_id":variablename,"name":namevar,"unit":str(obj['variables'][variablename]['unit'])}
                thislist.append(listitem)
            except:
                namevar = str(obj['variables'][variablename]['description']).split(" (")[0]
                listitem = {"_id":variablename,"name":namevar,"unit":"NA"}
                thislist.append(listitem)

        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        

        drivedata = {
            "name":dname,
            "parameters":thislist,
            "protocols": protocolList,
            "approved":False
        }
        collection.insert_one(drivedata)
        return 1
    except:
        return 0


@drive_route_blueprint.route("/", methods = ["GET"])
def driveList():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
    if user == 'governer' or user == 'onboarder' or user == 'admin':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        result = collection.find({},{ "_id": 1, "name": 1,"approved":1})
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
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/approved", methods = ["GET"])
def approvedDriveList():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
    if user == 'admin' or user == 'developer':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        result = collection.find({"approved":True},{"_id": 1, "name": 1})
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
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/<id>", methods = ["GET"])
def drivebyId(id):
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
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

        return {"drive":resp},200
    else:
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/getapproval/<id>", methods = ["PUT"])
def approveDrive(id):
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
    if user == 'governer' or user == 'admin':
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]
        
        updateresult = collection.find_one_and_update({'_id':ObjectId(id)},{ '$set': { "approved" : True}}, return_document = ReturnDocument.AFTER)
        
        return jsonify('Successful'),200
    else:
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/onboarddrive", methods = ["POST"])
def onboardDrive():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
    if user == 'admin' or user == 'onboarder':
        homedir = os.path.expanduser('~')
        if request.method == 'POST':  
            f = request.files['file']  
            f.save(homedir,f.filename)
            finalpath = homedir+f.filename
            protoList = request.json['protocols']
            ret = insertDrive(finalpath,protoList)
        if ret == 1:
            return jsonify('Successful'),200
        else:
            return jsonify('Unsuccessful'),400
    else:
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/createdrive", methods = ["POST"])
def createDrive():
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
    if user == 'admin' or user == 'onboarder':
        requestname = request.json['name']
        parameters = request.json['parameters']
        protocols = request.json['protocols']
        drive = {
            "name":requestname,
            "parameters":parameters,
            "protocols":protocols,
            "approved":False
        }
        cluster = mongo_client.MongoClient(clusterurl)
        db = cluster[dbname]
        collection = db[collectionname]

        collection.insert_one(drive)

        return jsonify('Successful'),200

    else:
        return jsonify('Unauthorised Access'),401

@drive_route_blueprint.route("/<id>/parameters/<paramid>", methods = ["PUT"])
def editdriveparameter(id,paramid):
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
    except:
        return jsonify('Invalid Token'),401
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
                    "unit":parameter['unit'],
                    "Alias":parameter['Alias']
                }
                parameterList.append(param)
            else:
                parameterList.append(parameter)
        resultraw = collection.find_one_and_update({'_id':ObjectId(id)},{ '$set': { "parameters" : parameterList}}, return_document = ReturnDocument.AFTER)

        return jsonify('Successfully Updated'),200
    else:
        return jsonify('Unauthorised Access'),401


def insert(request):
    drive={
        "name": request.name,
        "parameters":[{"id":'',"name": p['name'],"unit":p['unit'],"type": p["type"],"alias":p['name'], "interval":p["interval"]} for p in request.parameters],
        "protocols":[id for id in request.protocols],
    }
    #model.drives.insert(drive)
