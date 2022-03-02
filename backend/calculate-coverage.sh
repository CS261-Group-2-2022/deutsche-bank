#!/usr/bin/env bash
set -euxo pipefail # Exit on command failure and print all commands as they are executed.

# Do *not* run this with --parallel on, that breaks coverage checking.
coverage run --omit 'apis/migrations/*' manage.py test -v 2 --shuffle --failfast
