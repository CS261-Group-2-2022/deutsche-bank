#!/bin/bash
python3 manage.py makemigrations
python3 manage.py makemigrations apis
python3 manage.py migrate
gunicorn deutschebank.wsgi --bind 0.0.0.0:8000