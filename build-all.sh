#!/bin/bash
set -e

npm install

# Билдим клиент
cd client
npm install
npm run build

# Билдим сервер
cd ../server
npm install
npm run build:server