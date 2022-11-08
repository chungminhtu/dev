###################
# BUILD FOR build
###################
FROM node:18.4.0

RUN mkdir -p /src && chown -R node:node /src
WORKDIR /src
COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY --chown=node:node . .

USER node

CMD ["npm", "run", "run:name"]

#CMD [ "node", "apps", "name", "src", "main.js" ]