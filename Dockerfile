# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy the package.json and package-lock.json to the working directory
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . /app

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]

