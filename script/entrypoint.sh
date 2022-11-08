#!/bin/bash
echo -n "Enter the name of a service: "
read Service
#Environment creation and installation
yarn install
yarn build "$Service"
#Map build files
sudo apt-get install sed
cd ..

function runDocker {
  local services=$Service
  sudo docker-compose up -d
  echo "[+] good job ${services}"
}

case $Service in
  gateway)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  user)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  role)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  file)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  token)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  mailer)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  product)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  position)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  marketing)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  service)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  branch)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  company)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;

  customer)
    sed -i "s/<service>/${Service}/g" Dockerfile
    runDocker
    sed -i "s/${Service}/<service>/g" Dockerfile
    ;;
  *)
    echo -n "service has not been initialized!"
    ;;
esac

