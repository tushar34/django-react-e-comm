'''Use this for development'''
from .base import *
ALLOWED_HOSTS += ['127.0.0.1']
DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

CORS_ORIGIN_WHITELIST = (
    'http://localhost:3000',
)

# STRIPE_PUBLIC_KEY = config()
# STRIPE_SECRET_KEY = config()
STRIPE_PUBLIC_KEY = "pk_test_51Ibk4KSGafLm2PSq84YA7Kn99WYEANFwxWuLrCJ5R4tZogmUmsfIQ9DV5oATk8MNs3b2gPN2LqrI36LqNYFuEnvf00n84GmYNG"
STRIPE_SECRET_KEY = "sk_test_51Ibk4KSGafLm2PSq913WdziBK9Xiag7aADHkoiOjSUUblysgCH1e6q4fr76e09u4rRpogYRjJZezjn7xCmUgTEOs00wcgcrNRb"
