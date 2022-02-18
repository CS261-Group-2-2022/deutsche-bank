FROM postgres

# 1) Install python so we can use the python adapter inside the postgresdb container
RUN apt-get update
RUN apt-get install -y python3 python3-pip
RUN apt-get install -y libpq-dev

# 2) Install psycopg2 adapter
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 3) Run initialisation
# TODO Don't yet know how to make this actually happen.
# Currently, for first launch of this container, we need to manually sign in to the docker container
# and run `psql --file postgres-database-initialisation-script.sql` before the container can work.
COPY postgres-database-initialisation-script.sql ./postgres-database-initialisation-script.sql

# 4) Change users and expose the port that postgres talks on.
USER postgres
EXPOSE 5432

