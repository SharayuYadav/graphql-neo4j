FROM node:16.20.0 as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD node index.js

# Stage 2: Create a lightweight production image
#FROM nginx:alpine

#COPY --from=build-stage /app/build /usr/share/nginx/html

#EXPOSE 80

#CMD ["nginx", "-g", "daemon off;"]
