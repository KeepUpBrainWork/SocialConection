import React, { createContext, useState, useEffect } from "react";
import apiClient from "../api/client";
import { User, LoginCredentials, RegisterCredentials } from "../types/auth";
// Розшифрування імпортів: User, LoginCredentials, RegisterCredentials — це ваші суворі інтерфейси TypeScript

// 1. Визначаємо суворий контракт (інтерфейс) нашого контексту для TypeScript
interface AuthContextType {
  user: User | null; // Об'єкт користувача з PostgreSQL або null
  isAuthenticated: boolean; // Обчислений прапорець авторизації
  isLoading: boolean; // Флаг фонового запиту для запобігання миготінню екрана
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

// 2. Створюємо сам контекст. Початкове значення undefined — це архітектурний запобіжник для нашого майбутнього хука useAuth
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// 3. Компонент-провайдер, який розгортає "хмару даних" в ОЗУ браузера
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Стартуємо з true, поки чекаємо відповіді від Node.js

  // Фоновий запит захисту від натискання F5 (Сесія на базі HTTP-Only Cookies)
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Запит до вашого Express.js бекенду. Токен автоматично передається браузером через куки завдяки withCredentials
        const response = await apiClient.get<User>("/auth/me");
        setUser(response.data);
      } catch (error) {
        // Якщо токен прострочений або відсутній — сервер поверне 401, ми м'яко зануляємо стан
        setUser(null);
      } finally {
        // У будь-якому випадку знімаємо прапорець завантаження, вивільняючи рендеринг AppRoutes
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Метод авторизації
  const login = async (credentials: LoginCredentials) => {
    // Не обробляємо тут catch, дозволяємо помилці прокинутися у форму Login.tsx для відображення UI-помилок
    const response = await apiClient.post<{ user: User }>(
      "/auth/login",
      credentials,
    );
    setUser(response.data.user);
  };

  // Метод реєстрації
  const register = async (credentials: RegisterCredentials) => {
    const response = await apiClient.post<{ user: User }>(
      "/auth/register",
      credentials,
    );
    setUser(response.data.user);
  };

  // Метод виходу (розрив сесії)
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Помилка при запиті на логаут з сервера:", error);
    } finally {
      // Архітектурне правило: незалежно від успіху запиту до мережі, ми ПОВНІСТЮ очищуємо ОЗУ клієнта
      setUser(null);
    }
  };

  // Обчислювальний стейт на основі наявності об'єкта user (Декларативний підхід)
  const isAuthenticated = !!user; // Перетворення типу в boolean за допомогою подвійного заперечення (JS Type Coercion)

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
