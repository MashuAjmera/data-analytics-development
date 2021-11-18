import pymongo

myclient = pymongo.MongoClient("mongodb+srv://Ashwin:Hackathonmongo@ashwinhackathon.u0vht.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", serverSelectionTimeoutMS=9999)
# print(myclient.server_info())
# mydb = myclient["testdb"]
# mycol = mydb["testdata"]


mydb = myclient["userData"]
mycol = mydb["users"]
x = mycol.find()

for post in x:
    print(post)

print(x)