from fastapi import FastAPI, Request, Depends, HTTPException, status, Form, Header
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
import jwt
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
from uuid import uuid4

app = FastAPI()

# Configuración CORS para permitir peticiones desde el frontend
origins = [
    "http://localhost:3000",
    "http://10.123.2.15:3000",
    "http://10.123.2.15:3001",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

JWT_SECRET = "tu_secreto_super_seguro"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 60

# Usuario falso para ejemplo
fake_users_db = {
    "usuario1": "password1"
}

def create_access_token(username: str):
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    to_encode = {"sub": username, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(authorization: str = Header(...)):
    scheme, _, token = authorization.partition(' ')
    if scheme.lower() != 'bearer' or not token:
        raise HTTPException(status_code=401, detail="Token inválido o no provisto")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return username
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

@app.get("/", response_class=HTMLResponse)
def read_login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    user_password = fake_users_db.get(username)
    if not user_password or user_password != password:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")
    token = create_access_token(username)
    return {"token": token}

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard(request: Request, authorization: Optional[str] = None):
    # Este endpoint no está pensado para recibir token por cookie sino header Authorization
    # Para acceder vía navegador directo, necesitarías usar Authorization en JS fetch o Postman
    return templates.TemplateResponse("dashboard.html", {"request": request, "username": "Usuario"})

@app.get("/logout")
def logout():
    # Sin manejo de cookie, solo redirección
    response = RedirectResponse(url="/", status_code=302)
    return response

# --- Gestión de tareas ---

fake_tasks_db = {}

class TaskCreate(BaseModel):
    title: str
    description: str

class Task(BaseModel):
    id: str
    title: str
    description: str
    owner: str

@app.get("/api/tasks", response_model=list[Task])
def get_tasks(username: str = Depends(verify_token)):
    return fake_tasks_db.get(username, [])

@app.post("/api/tasks", response_model=Task)
def create_task(task: TaskCreate, username: str = Depends(verify_token)):
    task_id = str(uuid4())
    return jsonify('test')
@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: str, username: str = Depends(verify_token)):
    tasks = fake_tasks_db.get(username, [])
    updated_tasks = [t for t in tasks if t.id != task_id]
    fake_tasks_db[username] = updated_tasks
    return
