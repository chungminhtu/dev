## Document
Health check: [http://hostname/api/v1](http://hostname/api/v1) \
Api doc: [http://hostname/apidoc](http://hostname/apidoc) \

## Installation
Install Node18, pm2, docker, docker-compose
```bash
cd dreamld-proj
npm install
npm i -g pm2
```
or
```bash
cd dreamld-proj
npm i -g pm2
yarn install
```

## Config & Pre-Run
Create  file `.env` from file `.env.example`

## Running the app
### dev mode
```bash
docker-compose up -d
```
Dự án chạy microservice nên phải run từng service
```bash
npm run start:<service>
```
### prod mode
```bash
docker-compose -f docker-compose.prod.yml up -d
```
or
```bash
pm2 start 
```
## Build Libs
### build core
```bash
npm run build:core
```
### build core
```bash
npm run build:shared
```
## Build Docs
### build docs
```bash
npm run compodoc
```
### build docs watch
```bash
npm run compodoc:watch
```

- _Re deploy_
