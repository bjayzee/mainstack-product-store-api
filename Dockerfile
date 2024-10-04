# Use an official Node.js runtime as a parent image
FROM node:20.7.0

# Set the working directory inside the container (better to organize in /app)
WORKDIR /app

# Copy package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Run the TypeScript build to compile files to the dist folder
RUN npm run build

# Ensure that the 'dist' directory was created
RUN ls dist/

# Expose the port your app runs on (assuming 3000 is your port)
EXPOSE 3000

# Command to run your app using the start script (which runs 'node dist/index.js')
CMD ["npm", "start"]