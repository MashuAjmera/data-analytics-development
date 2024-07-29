# Data Flow App Development Toolkit
# Vision
This project envisions a platform to 
- **onboard a sensor** (parameters the sensor can measure and protocols using which it can communicate)
- **approval process around the onboarding** (approve/ reject/ approve with changes)
- **developers using the sensors to create an app** (get data, transform data for analysis and then publishing analytics to an endpoint)
- **an app gallery** (for all the published apps)

## Technologies Used
This project is made using **Flask**, **MongoDb**, **React** packaged in a **docker** container.  
Check it out at: https://data-flow-app.onrender.com/  
Demo username: admin, password: admin

## Dockerize
Build Image: `sudo docker build --tag test .`  
Run Container: `sudo docker run -it -p 5001:5000 --name test test`
