# Use an official Node.js runtime as a parent image
FROM node:20.7.0

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
