FROM node:16-alpine as build

# Install build tools
RUN apk update && \
    apk add --no-cache build-base python3 py3-pip libffi-dev

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install Python and Node.js dependencies
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r requirements.txt
RUN npm install
RUN npm run build

# Remove unnecessary directories
RUN rm -r public src

# Expose port and set entrypoint
EXPOSE 5000
ENTRYPOINT ["python3"]
CMD ["app.py"]
