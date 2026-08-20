import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Створюємо допоміжний внутрішній компонент для контролю рендерингу
function AppRoutes() {
  // Витягуємо дані з нашої глобальної хмари за допомогою хука useContext
  const auth = useContext(AuthContext);

  // Обов'язкова архітектурна перевірка: якщо контекст не знайдено (наприклад, файл не підключено)
  if (!auth) {
    return null;
  }

  // Логіка під капотом: поки йде фоновий запит до Node.js (/auth/me), показуємо екран очікування
  if (auth.loading) {
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
      {/* Якщо користувач вже авторизований, і намагається зайти на /login або /register, 
          ми за допомогою компонента Navigate автоматично перенаправляємо його на майбутню головну сторінку /matches */}
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

      {/* Заглушка для головної сторінки сайту знайомств */}
      <Route
        path="/matches"
        element={
          auth.isAuthenticated ? (
            <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
              <h2>Вітаємо, {auth.user?.name}!</h2>
              <p>Тут буде розкрутка анкет для сайту знайомств.</p>
              <button
                onClick={auth.logout}
                style={{
                  padding: "10px",
                  backgroundColor: "#333",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Вийти з акаунта
              </button>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Автоматичний редірект з кореня сайту */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Помилка */}
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

// Головний компонент-архітектор додатка
export default function App() {
  return (
    // 1. Огортаємо ВСЕ в AuthProvider. Тепер хмара контексту доступна для всього, що знаходиться всередині
    <AuthProvider>
      {/* 2. Підключаємо керування URL-історією браузера */}
      <BrowserRouter>
        {/* 3. Запускаємо наші маршрути */}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
