#!/usr/bin/env bash
opt=$1
service=$2

if [[ $opt = "up" ]]; then
  docker-compose -f docker-compose.prod.yml up -d
elif [[ $opt = "build" ]]; then
  sed -i "s/name/${service}/g" Dockerfile
  docker build -t vohoang/anmoga-be-"${service}" .
  sed -i "s/${service}/name/g" Dockerfile
elif [[ $opt = "down" ]]; then
  docker-compose -f docker-compose.prod.yml down
fi 