/* Postgres database initialisation script */
/* Should be ran on first startup of the database. */

CREATE USER django_app_user WITH ENCRYPTED PASSWORD 'a';
ALTER ROLE django_app_user SET client_encoding TO 'utf8';
ALTER ROLE django_app_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE django_app_user SET timezone TO 'UTC';
CREATE DATABASE deutschebank;
GRANT ALL PRIVILEGES ON DATABASE deutschebank TO django_app_user;
