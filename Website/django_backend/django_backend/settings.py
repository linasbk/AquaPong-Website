#install daphn and channel_redis

from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = 'django-insecure-1u)1v93&aa89o_ahr@q%1h0xxblwdvg4xbi81t)@5_h(0#m%qj'
DEBUG = True

ALLOWED_HOSTS = ['*']


AUTH_USER_MODEL = 'Sign_up.User'

INSTALLED_APPS = [ 
    "daphne",
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'chat',
    'channels',
    'rest_framework',
    'corsheaders',
    'groups',
    'Sign_up',
    'Dashboard_home',
    'notification',
    'rest_framework_simplejwt',
    'django.contrib.sites',
    'playground',
    'rest_framework_simplejwt.token_blacklist',
    'django_password_validators',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',

]
CORS_ALLOW_ALL_ORIGINS = True 
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]



CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


ROOT_URLCONF = 'django_backend.urls'

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
import os
from dotenv import load_dotenv
load_dotenv()

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [(os.getenv('redis_host'), 6379)],
        },
    },
}

ASGI_APPLICATION = 'django_backend.asgi.application'


DATABASES = {
    'default': {
        'ENGINE': os.getenv('post_ENGIN'),
        'NAME': os.getenv('post_NAME'),
        'USER': os.getenv('post_USER'),
        'PASSWORD': os.getenv('post_PASSWORD'),
        'HOST': os.getenv('post_HOST'),
        'PORT': os.getenv('post_PORT'),
    }
}
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'django_backend.authentication.CustomJWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=2),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'USER_ID_FIELD': 'userID',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_COOKIE': 'access_token',  # Cookie name. Enables cookies if value is set.
    'AUTH_COOKIE_REFRESH': 'refresh_token',  # Cookie name for refresh token
    'AUTH_COOKIE_DOMAIN': None,
    'AUTH_COOKIE_SECURE': True,    # Whether the auth cookies should be secure (https:// only).
    'AUTH_COOKIE_HTTP_ONLY': True, # Http only cookie flag.It's not fetch by javascript.
    'AUTH_COOKIE_SAMESITE': 'Lax', # Whether to set the flag restricting cookie access.
}
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
    {
        'NAME': 'django_password_validators.password_character_requirements.password_validation.PasswordCharacterValidator',
        'OPTIONS': {
            'min_length_upper': 1,
            'min_length_lower': 1,
            'min_length_digit': 1,
            'min_length_special': 1,
            'special_characters': "~!@#$%^&*()_-+{}\":;'[]"
        }
    }
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

SITE_ID = 1
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# LOGGING_CONFIG = None

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = ["http://localhost:3000","https://0.0.0.0:443", "https://10.13.1.66:443"]

