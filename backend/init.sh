#!/bin/bash
python3 manage.py makemigrations
python3 manage.py makemigrations apis
python3 manage.py migrate
python3 manage.py generate_data --seed "We're literally the best software eng team."
gunicorn deutschebank.wsgi --bind 0.0.0.0:8000
