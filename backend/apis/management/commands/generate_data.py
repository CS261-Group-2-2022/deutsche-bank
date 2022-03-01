#!/usr/bin/env python3
from typing import *
from django.core.management.base import BaseCommand, CommandError
from apis.models import *
from apis.dummy_data import create_dummy_data
import random
import time

class Command(BaseCommand):
    help = 'This command creates pseudorandom data and enters it into the database.'
    random_seed = None

    def add_arguments(self, parser):
        # Add an optional argument to specify the seed.
        parser.add_argument(
            '--seed',
            help=f'The seed to use for the random number generator. (default={self.random_seed})',
        )

    def handle(self, *args, **options):
        try:
            if options['seed']:
                self.random_seed = options['seed']
            else:
                self.random_seed = time.time()

            create_dummy_data(seed=self.random_seed)
            self.stdout.write(
                self.style.SUCCESS(f'Successfully generated dummy data. ({self.random_seed=})'))
        except Exception as exception:
            self.stderr.write(
                self.style.ERROR(f'Failed to generate dummy data. ({self.random_seed=})'))
            self.stderr.write(self.style.ERROR(f' - Cause: {exception=}'))
            raise CommandError(f'Generating dummy data has failed.')
