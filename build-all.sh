#!/bin/bash
set -e

# Билдим клиент
cd client
npm install
npm run build

# Билдим сервер
cd ../server
npm install
npm run build:server