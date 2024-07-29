FROM node:12.18.0-alpine as build
COPY . /app
WORKDIR /app
RUN apk update && apk add build-base python3-dev libffi-dev py3-pip
RUN pip3 install --upgrade pip setuptools wheel
RUN pip3 install --no-cache-dir -r requirements.txt
RUN npm install
RUN npm run build
RUN rm -r public src
EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD [ "app.py" ]
