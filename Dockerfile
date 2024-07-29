FROM node:12.18.0-alpine as build
COPY . /app
WORKDIR /app
RUN npm install
RUN npm run build
RUN rm -r public src
RUN apk add python3
RUN apk add py3-pip
RUN apk update && apk add build-base python3-dev
RUN pip3 install -r requirements.txt
EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD [ "app.py" ]
