import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext'; // ✅ named import corregido

export const metadata = {
  title: 'Task App',
  description: 'App de tareas con login',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}



