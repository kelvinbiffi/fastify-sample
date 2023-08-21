# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY . .

# Install the application dependencies inside the container
RUN npm install

# Copy the rest of the application to the container
COPY ./src ./src

# Specify the command to run the application
CMD ["npm", "start"]
