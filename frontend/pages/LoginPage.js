'use client'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const { user } = useContext(AuthContext)

  return (
    <main className="flex justify-center items-center h-screen">
      {user ? (
        <div>
          <h2>Bienvenido, {user.username}</h2>
          {/* Aquí tu dashboard o contenido privado */}
        </div>
      ) : (
        <LoginForm />
      )}
    </main>
  )
}

