FROM node:slim
# WORKDIR specifies the directory our
# application's code will live within
WORKDIR /app
# We copy our package.json file to our
# app directory
COPY package.json /app


RUN apt-get update \
    && apt-get clean \
    && apt-get install -y ffmpeg

# We then run npm install to install
# express for our applicationRUN 

RUN npm install
# We then copy the rest of our application
# to the app direcoty
COPY . /app
# We start our application by calling
# npm start.
CMD ["npm", "start"]