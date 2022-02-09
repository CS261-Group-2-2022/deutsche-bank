#!/usr/bin/env bash
set -euxo pipefail # Exit on command failure and print all commands as they are executed.

echo " Running DB project (backend Django server + frontend React server) locally..."

cd backend
    python3 manage.py runserver &
cd ..

cd frontend
    npm run start
cd ..
