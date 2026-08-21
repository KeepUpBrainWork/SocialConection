import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Matches from "./pages/Matches";

function AppRoutes() {
  // Використовуємо наш новий ергономічний хук замість сирого useContext
  const auth = useAuth();

  // Показуємо екран очікування, поки Node.js перевіряє HTTP-Only Cookie (/auth/me)
  if (auth.isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Завантаження додатка LoveApp...</h3>
      </div>
    );
  }

  return (
    <Routes>
      {/* Гості бачать форми. Авторизовані — автоматично редіректяться на /matches */}
      <Route
        path="/login"
        element={
          auth.isAuthenticated ? <Navigate to="/matches" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          auth.isAuthenticated ? (
            <Navigate to="/matches" replace />
          ) : (
            <Register />
          )
        }
      />

      {/* Захищений маршрут. Доступний лише якщо isAuthenticated === true */}
      <Route
        path="/matches"
        element={
          auth.isAuthenticated ? <Matches /> : <Navigate to="/login" replace />
        }
      />

      {/* Маршрути за замовчуванням та обробка помилок */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="*"
        element={
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Сторінку не знайдено</h2>
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
