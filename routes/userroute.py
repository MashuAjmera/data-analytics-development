from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import os
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet

user_route_blueprint = Blueprint('user_route_blueprint', __name__)

clusterurl = os.getenv('URI')
dbname = "userData"
collectionname = "users"

tokenkey = None

def encodepassword(password):
    key = os.getenv('SECRET')
    fernet = Fernet(key.encode())
    encpass = fernet.encrypt(password.encode())
    return encpass

def decodepassword(password):
    key = os.getenv('SECRET')
    fernet = Fernet(key.encode())
    decpass = fernet.decrypt(password)
    return decpass.decode()

def returnExistingUser(name):
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    result = collection.find_one({"name":name})
    #print(result)
    return result

def authorisationcheck(token):
    fernettok = Fernet(tokenkey)
    #encMessage = fernet.encrypt(token.encode())
    decMessage = fernettok.decrypt(token.encode())
    # return decMessage.decode()
    return 'admin'

@user_route_blueprint.before_app_request
def before_first_request():
    global tokenkey
    tokenkey = Fernet.generate_key()

@user_route_blueprint.route("/checkuser", methods = ["GET"])
def checkUser():
    #adminstatus = False
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
        return {"token":author,"type":user}, 200
    except:
        return jsonify('Invalid Token'), 400
    

@user_route_blueprint.route("/login", methods = ["POST","GET"])
def login():
    username = request.json['name']
    entry = returnExistingUser(username)
    password = entry["password"]
    userpassword = request.json['password']
    print(decodepassword(password.encode()))
    tokenfernet = Fernet(tokenkey)
    if decodepassword(password.encode()) == userpassword :
        token = tokenfernet.encrypt(entry["type"].encode())
        resp = {"type":entry["type"], "token": token.decode()}
        return resp, 200
    else:
        return jsonify('Invalid Username or Password'), 400

@user_route_blueprint.route("/signup", methods = ["POST","GET"])
def signup():
    #print(request.method)
    upassword = request.json['password']
    encupassword = encodepassword(upassword)
    user={
        "name": request.json['name'],
        "password": encupassword.decode(),
        "type": request.json['type']
    }
    cluster = mongo_client.MongoClient(clusterurl)
    db = cluster[dbname]
    collection = db[collectionname]
    existingUserlen = len(str(returnExistingUser(request.json['name'])))
    if existingUserlen < 5:
        collection.insert_one(user)
        return jsonify('Successful'), 200
    else:
        return jsonify('User already exist'), 400
