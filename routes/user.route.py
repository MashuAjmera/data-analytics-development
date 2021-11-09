def insert(request):
    user={
        "name": request.name,
        "password": hash(request.password),
        "type": request.type
    }
    userData.users.insert(user)