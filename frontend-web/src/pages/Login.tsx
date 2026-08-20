import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { LoginCredentials } from "../types/auth";
import api from "../api/client"; // Імпортуємо наш створений клієнт
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const auth = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>();

  // Робимо функцію асинхронною (async), бо запити до сервера займають час
  const onSubmit = async (data: LoginCredentials) => {
    try {
      console.log("Фронтенд: Відправляємо запит на бекенд...");

      // Під капотом Axios зробить POST-запит на http://localhost:5000/api/auth/login
      const response = await api.post("/auth/login", data);

      console.log("Бекенд успішно відповів! Дані:", response.data);

      if (auth) {
        // Викликаємо метод login з нашого контексту, передаючи токен
        auth.login(response.data.token);
      }

      // Тут у майбутньому буде логіка: збереження токена та редірект на головну сторінку знайомств
    } catch (error: any) {
      // Логіка обробки помилок під капотом Axios:
      // Якщо сервер повернув помилку (наприклад, 401 Wrong Password або 404 User Not Found)
      if (error.response) {
        console.error("Помилка від сервера Node.js:", error.response.data);
        alert(error.response.data.message || "Неправильний email або пароль");
      } else {
        // Якщо сервер взагалися вимкнений або немає інтернету
        console.error("Сервер бекенду не відповідає:", error.message);
        alert(
          "Не вдалося зв'язатися з сервером. Перевірте, чи запущений Node.js!",
        );
      }
    }
  };

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "320px",
          gap: "15px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Вхід у LoveApp</h2>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Електронна пошта
          </label>
          <input
            type="text"
            placeholder="example@mail.com"
            disabled={isSubmitting} // Блокуємо інпут під час запиту
            {...register("email", {
              required: "Це поле є обов'язковим",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некоректний формат email",
              },
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.email && (
            <p style={{ color: "red", margin: "4px 0 0 0", fontSize: "13px" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting} // Блокуємо інпут під час запиту
            {...register("password", {
              required: "Введіть пароль",
              minLength: {
                value: 6,
                message: "Пароль має бути не менше 6 символів",
              },
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "13px" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Кнопка автоматично блокується, поки йде запит (isSubmitting = true) */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px",
            backgroundColor: isSubmitting ? "#ccc" : "#ff4b6e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {isSubmitting ? "Зв'язок із сервером..." : "Увійти"}
        </button>

        <div
          style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}
        >
          <span>Ще немає акаунту? </span>
          <Link
            to="/register"
            style={{
              color: "#ff4b6e",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Зареєструватися
          </Link>
        </div>
      </form>
    </div>
  );
}
