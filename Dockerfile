FROM node:12.18.0-alpine as build
COPY . /app
WORKDIR /app
RUN apk add python3
RUN apk add py3-pip
RUN pip3 install -r requirements.txt
RUN npm install
RUN npm run build
RUN rm -r public src
EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD [ "app.py" ]
