import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { RegisterCredentials } from "../types/auth";
import api from "../api/client"; // Імпортуємо наш централізований API-клієнт

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    defaultValues: {
      gender: "male",
    },
  });

  const passwordValue = watch("password");

  // Асинхронна функція для зв'язку з Node.js бекендом
  const onSubmit = async (data: RegisterCredentials) => {
    try {
      console.log(
        "Фронтенд: Перевірка пройшла успішно. Починаємо реєстрацію...",
      );

      // 1. Відправляємо POST-запит на http://localhost:5000/api/auth/register
      // Передаємо об'єкт data, який Axios автоматично перетворить на рядок JSON
      const response = await api.post("/auth/register", data);

      console.log(
        "Бекенд успішно створив користувача! Відповідь:",
        response.data,
      );
      alert("Анкету успішно створено! Ласкаво просимо.");
    } catch (error: any) {
      // 2. Обробка помилок у фоновому режимі
      if (error.response) {
        // Сервер відповів кодом помилки (наприклад, 400 Bad Request або 409 Conflict - Email вже зайнятий)
        console.error("Бекенд Node.js відхилив запит:", error.response.data);
        alert(error.response.data.message || "Помилка під час реєстрації");
      } else {
        // Сервер вимкнено або немає зв'язку
        console.error("Немає зв'язку з бекендом:", error.message);
        alert(
          "Помилка підключення: перевірте, чи запущено ваш сервер Node.js на порту 5000!",
        );
      }
    }
  };

  const validateAge = (value: string) => {
    const birthDate = new Date(value);
    const today = new Date(); // Сьогодні 14 серпня 2026 року

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18 || "Реєстрація дозволена тільки з 18 років!";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "320px",
          gap: "15px",
          padding: "25px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#ff4b6e", margin: "0" }}>
          Створення анкети
        </h2>

        {/* Поле Імені */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Як вас звати?
          </label>
          <input
            type="text"
            placeholder="Ваше ім'я"
            disabled={isSubmitting}
            {...register("name", { required: "Введіть ваше ім'я" })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.name && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.name.message}
            </span>
          )}
        </div>

        {/* Поле Email */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Email
          </label>
          <input
            type="email"
            placeholder="example@mail.com"
            disabled={isSubmitting}
            {...register("email", { required: "Введіть email" })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Вибір статі через Radio Buttons */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Ваша стать
          </label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label>
              <input
                type="radio"
                value="male"
                disabled={isSubmitting}
                {...register("gender")}
              />{" "}
              Чоловік
            </label>
            <label>
              <input
                type="radio"
                value="female"
                disabled={isSubmitting}
                {...register("gender")}
              />{" "}
              Жінка
            </label>
          </div>
        </div>

        {/* Календар */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Дата народження
          </label>
          <input
            type="date"
            disabled={isSubmitting}
            {...register("birthDate", {
              required: "Вкажіть дату народження",
              validate: validateAge,
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.birthDate && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.birthDate.message}
            </span>
          )}
        </div>

        {/* Пароль */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            {...register("password", {
              required: "Придумайте пароль",
              minLength: { value: 6, message: "Мінімум 6 символів" },
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Підтвердження пароля */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Повторіть пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            disabled={isSubmitting}
            {...register("confirmPassword", {
              required: "Це поле є обов'язковим",
              validate: (value) =>
                value === passwordValue || "Паролі не збігаються",
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {errors.confirmPassword && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

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
            marginTop: "10px",
          }}
        >
          {isSubmitting ? "Створення анкети..." : "Зареєструватися"}
        </button>

        <div
          style={{ textAlign: "center", marginTop: "15px", fontSize: "14px" }}
        >
          <span>Вже є акаунт? </span>
          <Link
            to="/login"
            style={{
              color: "#ff4b6e",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Увійти
          </Link>
        </div>
      </form>
    </div>
  );
}
