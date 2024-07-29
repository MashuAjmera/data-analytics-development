# Data Flow App Development Toolkit
# Vision
This project envisions a platform to 
- onboard a sensor drive
- approval process around the onboarding
- developers using the sensors to get data, transform data and then publishing it to an endpoint
- an app gallery where users can publish their app

## Technologies Used
This project is made using Flask, MongoDb, React in a docker container.
Check it out at: https://data-flow-app.onrender.com/
Demo Username: admin, password: admin

## Dockerize
Build Image: `sudo docker build --tag test .`
Run Container: `sudo docker run -it -p 5001:5000 --name test test`
