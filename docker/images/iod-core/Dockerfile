FROM node:carbon
LABEL maintainer="Paul Smith <code@uvwxy.de>"

WORKDIR /opt/iod-core/
COPY iod-core*.tgz .
RUN tar xf iod-core*.tgz && mv package/* ./ && rmdir package

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

EXPOSE 8080
CMD [ "npm", "start" ]