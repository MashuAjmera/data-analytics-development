FROM python:3.12-slim AS build

# Install Python and build tools
RUN apt-get update && \
    apt-get install -y build-essential libffi-dev

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Install Node.js and its dependencies
RUN apt-get install -y nodejs npm
RUN npm install && npm run build

# Remove unnecessary directories
RUN rm -r public src

# Expose port and set entrypoint
EXPOSE 5000
ENTRYPOINT ["python"]
CMD ["app.py"]
