FROM node:16-alpine3.14 as development
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

ENV NODE_ENV=development
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT [ "npm", "run", "dev" ]



FROM node:16-alpine3.14 as production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production
COPY . .
COPY --from=development /app/build/ /app/build/

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
USER node
ENTRYPOINT [ "npm", "run", "start" ]
