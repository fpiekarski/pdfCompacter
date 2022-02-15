FROM node:14-alpine

# Create app directory
WORKDIR /usr/local/appNode/pdf


RUN apk add ghostscript \
    apk add nodejs \
    npm install
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

# Bundle app source
COPY . .

EXPOSE 7000
ENV NODE_TLS_REJECT_UNAUTHORIZED = 0
CMD [ "node","--tls-min-v1.0", "i.js" ]


