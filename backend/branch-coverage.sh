#!/usr/bin/env bash
set -euxo pipefail # Exit on command failure and print all commands as they are executed.

# Do *not* run this with --parallel on, that breaks coverage checking.
#coverage run --omit 'apis/migrations/*' 'apis/tests.py' 'apis/test_matching_algorithm.py' 'apis/test_topic_modelling.py' 'deutschebank/settings.py' --branch manage.py test -v 2 --shuffle --failfast
coverage run --omit='apis/migrations/*','deutschebank/settings.py','manage.py' --branch manage.py test -v 2 --shuffle --failfast
