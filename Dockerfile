FROM node:12.18.0-alpine as build
COPY . /app
WORKDIR /app
RUN apk update && apk add --no-cache python3 py3-pip build-base libffi-dev python3-dev
RUN pip3 install --upgrade pip && pip3 install --no-cache-dir -r requirements.txt
RUN npm install
RUN npm run build
RUN rm -r public src
EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD [ "app.py" ]
