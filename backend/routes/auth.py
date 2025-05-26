from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    # Aquí puedes agregar lógica de registro si quieres
    return jsonify({"message": "Registro no implementado aún"}), 200

@auth_bp.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Falta JSON en la solicitud"}), 400

    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if not username or not password:
        return jsonify({"msg": "Faltan usuario o contraseña"}), 400

    # Usuario falso para ejemplo, reemplaza con DB real
    fake_users_db = {
        "usuario": "contraseña"
    }

    user_password = fake_users_db.get(username, None)
    if not user_password or user_password != password:
        return jsonify({"msg": "Usuario o contraseña incorrectos"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200
