FROM python:3-slim
# ^ Don't do alpine, pre-built wheels may not work and cause recompilations

# Ensure that output cannot be lost if the app crashes
ENV PYTHONUNBUFFERED 1
# Set an environment variable to tell backend it's in Docker.
# This is then used to decide whether to connect to Postgres or the local Sqlite database.
ENV DB_BACKEND_IN_DOCKER 1

# 1) Install run requirements using pip
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 2) Copy the backend code into the container
COPY . .

RUN rm -rf /apis/migrations/
RUN rm -rf /*/.__pycache__/
RUN python3 manage.py collectstatic --noinput
RUN sed 's/\r$//' init.sh > script.sh
# 3) Initialise the django app - making sure all migrations are applied

# 4) Run the django server
ENTRYPOINT ["sh", "script.sh"]
# TODOs
# - TODO Run tests and fail if they fail?
