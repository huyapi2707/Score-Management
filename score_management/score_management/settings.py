"""
Django settings for score_management project.

Generated by 'django-admin startproject' using Django 5.0.4.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-7+!vi6b(b1$0tq-((8-rg0fz78k66scafjduk#=4m_44k(q!i$'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True



AUTH_USER_MODEL = "api.User"

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'drf_yasg',
    'rest_framework',
    'ckeditor',
    'ckeditor_uploader',
    'django_seed',
    'oauth2_provider',

]

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 2,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'oauth2_provider.contrib.rest_framework.OAuth2Authentication',
    ),
    'DEFAULT_PARSER_CLASSES': (
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser'
    )

}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]


ALLOWED_HOSTS = ['192.168.7.103', '127.0.0.1', "localhost", "192.168.1.3"]


ROOT_URLCONF = 'score_management.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'score_management.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'score_management_db',
        'USER': 'admin',
        'PASSWORD': 'admin',

    }
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_ROOT = '%s/api/static/' % BASE_DIR

import cloudinary

cloudinary.config(
    cloud_name="ddgtjayoj",
    api_key="451466636224894",
    api_secret="8jP48b2XeCzhNdKNe9yGIwiDiN8"
)
CKEDITOR_UPLOAD_PATH = "scoreManagement/images"

# Mail

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'dangdinhhuyisme@gmail.com'
EMAIL_HOST_PASSWORD = 'kggq xlce prbq luvi'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
DEFAULT_FROM_EMAIL = 'dangdinhhuyisme@gmail.com'

# CLIENT_ID = 'EkyweN7hkDmBMjv8jVM16ayiO7oIeM9lIESPQvbU'
# CLIENT_SECRECT = 'q96hEQqqz3qnUN7OVlT9mdKxppqVNdS9pk197kXuE9tTeUlnfObMSukwGsofnwkFTI3x5WjYQhyO0qR06GgdhxAXPZdNtg9DJzr7XlQyZZnQbxJp7P9ibf18aMGcdLol'

CLIENT_ID = "m6X5b284y5UwnS2onuK7K6y00WLGTOzMPcpyK4BW";
CLIENT_SECRECT = "qkIaLIsMh1W1Y3fvndEGJfpIgYBh09nm5SOHsFfRa5nQA3343OaRQkfGMSKqDuguALSi1QdI4CcwMyQkATFbtMIJg6TBuAYGdJhHpPsfGEDMRArFrJGlD1P8K8aln9IQ";
