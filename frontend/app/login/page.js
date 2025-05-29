'use client'
import LoginForm from '../../components/LoginForm'
import "../globals.css"; // Asegúrate de importar tus estilos globales
export default function LoginPage() {
  return (
    <main className="flex justify-center items-center h-screen">
      <LoginForm />
    </main>
  )
}

