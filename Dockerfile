# Stage 1: Build the Vue.js application
FROM node:16 AS build

# Set the working directory
WORKDIR /cast_game_front

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files into the docker image
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine



# Copy the built assets from the build stage
COPY --from=build /cast_game_front/dist /usr/share/nginx/html

# Copy the Nginx configuration file => important pour la redirection des routes
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]
