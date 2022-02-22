#!/usr/bin/env bash
set -euxo pipefail # Exit on command failure and print all commands as they are executed.

python3 manage.py test -v 2 --parallel auto --shuffle --failfast
