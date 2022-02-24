FROM python:3-slim
# ^ Don't do alpine, pre-built wheels may not work and cause recompilations

ENV PYTHONUNBUFFERED 1 # Ensure that output cannot be lost if the app crashes

# 1) Install run requirements using pip
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copy the backend code into the container
COPY . .

RUN rm -rf /apis/migrations/
RUN rm -rf /*/.__pycache__/
RUN python3 manage.py collectstatic --noinput
# 3) Initialise the django app - making sure all migrations are applied

# 4) Run the django server
ENTRYPOINT ["sh", "init.sh"]
# TODOs
# - TODO Run tests and fail if they fail?
#
# - TODO Environment vars for:
#    (See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/)
#   - DEBUG: Debug or no
#   - SECRET_KEY: The secret key to use for django
