### CS261 Group 2 Software Engineering Project

Workflow status:

![Tests](https://github.com/CS261-Group-2-2022/deutsche-bank/actions/workflows/backend-testing.yaml/badge.svg)

## Building and running in Docker using Docker Compose
# First,
To build and run this project, make sure you have the latest versions of Docker
and Docker Compose installed. For guidance on this, see the next section.

This project is expected to be ran with auto-generated test data. To run it in production, please see the deployment checklist, as well as the section on turning off automatic random data generation.

# Building and running
In the base directory of the project (where this file and the docker-compose.yml file are located),
run:

``` sh
docker-compose up --build;
```

This will fetch the required container images, configure each container and
start the whole composition.

You are advised to pay attention to any warnings/notices, especially the ones
sent by our backend server. These will warn you about security issues, potential
misconfiguration problems, as well as providing useful maintenance and log
information such as the details of the database connection and logs about random
data generation (including the seed for debugging/reproducibility).

# Accessing the running site
The web server container (nginx) listens on host port 80.

To access the site locally, visit `localhost:80` in your browser.

## How to install Docker and Docker Compose
There are up-to-date installation guides available online for every major platform.

Please follow the instructions at https://docs.docker.com/get-docker/ to install
Docker for your platform.

Note that for the Mac and Windows platforms, you may consider using https://docs.docker.com/desktop/.

## Stopping the system without losing the database data
You may safely shut down the service with the following command:

``` sh
docker-compose down;
```

This will gracefully shut down the composition, allowing each container to
perform any required cleanup before shutting them off.

However, the database state will be carried over to the next run of the
composition, meaning no user data is lost.

This means the system can be updated on the fly without risking data loss.

## Stopping the system and wiping the database
In the case that the database needs to be cleared, remember to make a backup,
before running the following command:

``` sh
docker-compose down --volumes;
```

This will do the same as the previous command, but also clear the storage volume used by Postgres.

This command can be useful when an update to the software requires the database
tables to massively changed, or if there's an issue with the data in the
database (for example, if it accidentally contains dummy data).
However, in the first case, please note that you should first try to run the
updated code normally.
This is because migrations are automatically applied on startup, which means
it's likely that the database doesn't need to be cleared to accommodate new
changes.

## Running back-end tests
To run the tests locally, do the following.

Note that to run the code locally, you need to install the dependencies locally. See the final section on how to do so.

Enter into the backend directory:

``` sh
cd backend/
```

Then invoke the testing script.

``` sh
./run-tests.sh
```

## Measuring branch coverage
To measure code coverage using branch coverage, do the following.

Note that to run the code locally, you need to install the dependencies locally. See the final section on how to do so.

Enter into the backend directory:

``` sh
cd backend/
```

Then invoke the testing script.

``` sh
./branch-coverage.sh
```

You may view the results in the terminal using the following command.

``` sh
./print-coverage.sh
```

## Viewing coverage report in HTML to see visually see what code is tested and what isn't
To view a coverage report in HTML, please make sure you run branch coverage first using the instructions in the previous section.

Note that to run the code locally, you need to install the dependencies locally. See the final section on how to do so.

Then, make sure to navigate to the backend directory:

``` sh
cd backend/
```

Before generating the coverage report with:

``` sh
coverage html
```

To view the report, open the index file with your preferred browser, for example as follows:

``` sh
firefox htmlcov/index.html
```

## Running front-end tests
To run the front-end tests, navigate to the front-end directory:

``` sh
cd frontend/
```

Note that to run the code locally, you need to install the dependencies locally. See the final section on how to do so.

Then, run the tests with:

``` sh
npm test
```

## Generating random data using our custom management command
To generate random data locally, navigate to the back-end directory:

``` sh
cd backend/
```

Then invoke the generate_data command.

``` sh
python3 manage.py generate_data
```

You may provide an optional seed. This allows you to repeat a previous test.

``` sh
python3 manage.py generate_data --seed "We're literally the best software eng team.";
```

For help around this command, invoke:

``` sh
python3 manage.py generate_data --help
```

## Turning off automatic random data generation inside Docker
This project is intended to be tested with the random data generation enabled.

However, for production deployment, this feature needs to be disabled.

To do this, edit the init.sh file in the backend folder.

Remove the line containing the generate data command.

Then, when the project is ran, dummy data will not be generated, leaving an empty database.

## Deployment checklist
Before deploying live, you should follow these guidelines.

1) Please ensure you use HTTPS. This is for password security, and also to ensure
that sensitive data isn't leaked to third parties.

2) By default, this project launches in debug mode.

To change this, edit the docker-compose.yml file. Namely, for the backend
service, set the environment variable PRODUCTION to True.

The system will warn you on start-up if this was not done.

3) Further, the project also uses an unsafe debug SECRET_KEY.

The system will warn you on start-up if this was not modified.

Please set this to a safely generated secret key by setting the environment variable SECRET_KEY.
This can be done in the docker-compose.yml file as well.

4) The backend system uses an insecure Postgres user with a weak password.

Please modify the password of the Postgres user used by the backend by changing it in settings.py.

This password also needs to be updated in the Postgres container configuration, in postgres-database-initalisation-script.sql.

This is also the case for the Postgres container itself - it uses the default
Postgres user 'postgres'. Please change this before deploying.

5) You may wish to clear environment variables after they're used.
The reason for this is that if one container is compromised, the secrets (such
as secret keys, account details) conveyed in its environment are readily
available to attackers. To mitigate this issue, inside each container's
configuration, clear the variables after they've been used.


## Installing dependencies locally
# Backend dependencies
To install python, follow the guidance at https://www.python.org/downloads/.

Then, install pip if it isn't installed by default. One useful guide is https://pip.pypa.io/en/stable/installation/.

Then, install the project requirements using:

``` sh
cd backend/
pip3 install -r requirements.txt
```

# Frontend dependencies
To install npm, follow the guidance at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm.

Then, install the requirements by:

``` sh
npm install
```
