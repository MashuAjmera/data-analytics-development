def insert(request):
    drive={
        "name": request.name,
        "parameters":[{"id":randomID(),"name": p['name'],"unit":p['unit'],"type": p["type"]} for p in request.parameters],
        "protocols":[id for id in request.protocols],
    }
    model.drives.insert(drive)