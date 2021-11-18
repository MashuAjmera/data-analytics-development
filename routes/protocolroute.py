def insert(request):
    protocol={
        "name": request.name,
        "properties":[{"name": p['name'],"required":p['required'],"type":p['type']} for p in request.properties],
    }
    model.protocols.insert(protocol)