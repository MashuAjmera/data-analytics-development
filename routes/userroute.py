from flask import Flask, request, send_from_directory, jsonify, send_file
import requests
import pymongo
from pymongo import mongo_client
from flask import Blueprint
from cryptography.fernet import Fernet

user_route_blueprint = Blueprint('user_route_blueprint', __name__)

clusterurl = "mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
dbname = "userData"
collectionname = "users"

tokenkey = None

def encodepassword(password):
    key = 'wq7mKkng6_BGUVnoXTABPEuVY6qFwlVMdfLBuSp0948='
    fernet = Fernet(key.encode())
    encpass = fernet.encrypt(password.encode())
    return encpass

def decodepassword(password):
    key = 'wq7mKkng6_BGUVnoXTABPEuVY6qFwlVMdfLBuSp0948='
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
    #print(key)
    fernettok = Fernet(tokenkey)
    #encMessage = fernet.encrypt(token.encode())
    decMessage = fernettok.decrypt(token.encode())
    #print(decMessage)
    return decMessage.decode()

@user_route_blueprint.before_app_first_request
def before_first_request():
    global tokenkey
    tokenkey = Fernet.generate_key()

@user_route_blueprint.route("/checkuser", methods = ["POST","GET"])
def checkUser():
    #adminstatus = False
    author = request.headers.get('Authorization')
    try:
        user = authorisationcheck(author)
        return user,200
    except:
        return 'Invalid Token',400
    

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
        return resp,200
        #return {"code":2,"message":"Login Successful","type":entry["type"]}
    else:
        resp = 'Invalid Username or Password'
        return resp,400
        #return {"code":4,"message":"Invalid username or password"}

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
        return 'Successful',200
        #return {"code":2,"message":"Signup Successful"}
    else:
        return 'User already exist',400
        #return {"code":4,"message":"User already exist"}




