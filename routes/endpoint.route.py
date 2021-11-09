def insert(request):
    endpoint={
        "name": request.name,
        "properties":[{"name": p['name'],"required":p['required'],"type":p["type"]} for p in request.properties],
    }
    model.endpoints.insert(endpoint)