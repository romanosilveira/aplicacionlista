import os
from datetime import timedelta

DEBUG = True
SECRET_KEY = os.environ.get('SECRET_KEY', 'clave-secreta-desarollo')

JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', SECRET_KEY)
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

SSL_CONTEXT = None  # Para simplificar durante desarrollo
