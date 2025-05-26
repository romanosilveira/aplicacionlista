from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Cargar .env
load_dotenv()

# Inicializar app
app = Flask(__name__)
app.config.from_object('config')

# CORS y JWT
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
jwt = JWTManager(app)

# Ruta simple para pruebas
@app.route('/')
def index():
    return "API funcionando"

# Rutas
from routes.auth import auth_bp
from routes.tasks import tasks_bp

app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(tasks_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(ssl_context=app.config.get("SSL_CONTEXT"), debug=True)

