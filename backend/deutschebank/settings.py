"""
Django settings for deutschebank project.

Generated by 'django-admin startproject' using Django 4.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.0/ref/settings/
"""
import os
from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
import pytz

BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')
if SECRET_KEY is None:
    print("[Security Warning]: ",
          "Running django app with default secret key. DO NOT do this in production.",
          "Please set the environment variable 'SECRET_KEY' to False in order to fix this.")
    DEBUG = True
    SECRET_KEY = 'django-insecure-i#!gl500yq#@^odppp6whok!r&mph8tvn#7bajb8c3o2aux_fy'


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG')
if DEBUG is None:
    print("[Security Warning]: ",
          "Running django app with DEBUG mode. DO NOT do this in production.\n",
          "Please set the environment variable 'DEBUG' to False in order to fix this.\n",
          "You can do this in the docker-compose.yml file")
    DEBUG = True

ALLOWED_HOSTS = ['api']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'django_extensions',
    'knox',  # https://james1345.github.io/django-rest-knox/
    'corsheaders',  # https://pypi.org/project/django-cors-headers/

    'apis',
    'openapi',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'deutschebank.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, '../')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'deutschebank.wsgi.application'


# Database configuration
# We select the database to use depending on whether or not we're running in Docker or not.
# This environment variable is set in the backend Dockerfile.
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases
DATABASES = {}
if os.getenv('DB_BACKEND_IN_DOCKER'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': 'deutschebank',
            'USER': 'django_app_user',
            'PASSWORD': 'a', # TODO NODEPLOY postgres pwd
            #'USER': 'postgres',
            #'PASSWORD': 'postgres',
            'HOST': 'postgresdb',
            'PORT': '5432',
        }
    }
    print(f'[Database Settings]: Using Postgres database:' +
          f' (because environment var {os.getenv("DB_BACKEND_IN_DOCKER")=})')
    print(f' - {DATABASES["default"]["HOST"]=}')
    print(f' - {DATABASES["default"]["PORT"]=}')
    print(f' - {DATABASES["default"]["USER"]=}')
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    print(f'[Database Settings]: Using local Sqlite3 database:' +
          f' (because environment var {os.getenv("DB_BACKEND_IN_DOCKER")=})')
    print(f' - {DATABASES["default"]["NAME"]=}')

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'
TIME_ZONE_INFO = pytz.timezone(TIME_ZONE)

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

STATIC_URL = 'apifiles/'
STATIC_ROOT = os.path.join(BASE_DIR, "apifiles")

STATICFILES_DIRS = [
]

# TODO NOCOMMIT Not required anymore.
CORS_ORIGIN_WHITELIST = [  # TODO: Remove
    # Whitelist default local React ports
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

CORS_ALLOWED_ORIGINS = [
    # Whitelist default local React ports
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# User model
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-user-model
AUTH_USER_MODEL = 'apis.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
}

REST_KNOX = {
    'SECURE_HASH_ALGORITHM': 'cryptography.hazmat.primitives.hashes.SHA512',
    'AUTH_TOKEN_CHARACTER_LENGTH': 64,
    'TOKEN_TTL': timedelta(hours=4),
    'USER_SERIALIZER': 'apis.serializers.UserSerializer',
    'TOKEN_LIMIT_PER_USER': None,
    'AUTO_REFRESH': True,  # This defines if the token expiry time is extended by TOKEN_TTL each time the token is used
}
