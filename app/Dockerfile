# This official base image contains node.js and npm

FROM node:14
# Copy the application files
RUN mkdir /opt/app
WORKDIR /opt/app

USER root

COPY ./package.json /opt/app

# Download the required packages
RUN npm update && npm install

COPY ./app /opt/app
