from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

tasks_bp = Blueprint('tasks', __name__)

# Base de datos temporal en memoria
fake_tasks_db = {
    "usuario": [
        {"id": 1, "title": "Ejemplo tarea", "description": "Descripción de ejemplo", "execution_date": ""}
    ]
}

# Para crear IDs únicos de tarea
def get_next_task_id(user):
    tasks = fake_tasks_db.get(user, [])
    if not tasks:
        return 1
    return max(task["id"] for task in tasks) + 1

@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user = get_jwt_identity()
    tasks = fake_tasks_db.get(current_user, [])
    return jsonify(tasks), 200

@tasks_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    current_user = get_jwt_identity()
    data = request.get_json()

    title = data.get('title', '').strip()
    description = data.get('description', '').strip() if data.get('description') else ''
    execution_date = data.get('execution_date', '').strip() if data.get('execution_date') else ''

    if not title:
        return jsonify({"message": "El título es obligatorio"}), 400

    new_task = {
        "id": get_next_task_id(current_user),
        "title": title,
        "description": description,
        "execution_date": execution_date
    }
    if current_user not in fake_tasks_db:
        fake_tasks_db[current_user] = []
    fake_tasks_db[current_user].append(new_task)

    return jsonify(new_task), 201

@tasks_bp.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    current_user = get_jwt_identity()
    tasks = fake_tasks_db.get(current_user, [])

    task = next((t for t in tasks if t["id"] == task_id), None)
    if not task:
        return jsonify({"message": "Tarea no encontrada"}), 404

    fake_tasks_db[current_user] = [t for t in tasks if t["id"] != task_id]
    return jsonify({"message": "Tarea eliminada"}), 200
