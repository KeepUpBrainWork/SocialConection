import { useForm } from "react-hook-form";
import { RegisterCredentials } from "../types/auth";

export default function Register() {
  // Ініціалізуємо форму з типом RegisterCredentials, який ми створили раніше
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterCredentials>({
    defaultValues: {
      gender: "male", // задаємо початкове значення для радіо-кнопок
    },
  });

  // watch дозволяє зчитувати значення поля пароля в реальному часі для порівняння
  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterCredentials) => {
    try {
      console.log("Логіка під капотом: дані готові для Node.js:", data);

      // Тут буде ваш fetch/axios запит до бекенду:
      // const res = await fetch('http://localhost:5000/api/auth/register', { ... })

      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Реєстрація успішна (імітація)!");
    } catch (error) {
      console.error("Помилка реєстрації:", error);
    }
  };

  // Логіка перевірки повноліття (18 років) під капотом
  const validateAge = (value: string) => {
    const birthDate = new Date(value);
    const today = new Date();

    // Обчислюємо різницю в роках
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Коригуємо вік, якщо день народження цього року ще не настав
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18 || "Додаток тільки для повнолітніх (18+)";
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
          width: "340px",
          gap: "15px",
          padding: "25px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#ff4b6e",
            margin: "0 0 10px 0",
          }}
        >
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
            {...register("name", { required: "Ім'я обов'язкове" })}
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: errors.name ? "1px solid red" : "1px solid #ccc",
            }}
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
            {...register("email", { required: "Введіть email" })}
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: errors.email ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.email && (
            <span style={{ color: "red", fontSize: "12px" }}>
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Вибір статі (Радіо-кнопки) */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Ваша стать
          </label>
          <div style={{ display: "flex", gap: "15px" }}>
            <label>
              <input type="radio" value="male" {...register("gender")} />{" "}
              Чоловік
            </label>
            <label>
              <input type="radio" value="female" {...register("gender")} />{" "}
              Жінка
            </label>
          </div>
        </div>

        {/* Дата народження з валідацією 18+ */}
        <div>
          <label
            style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}
          >
            Дата народження
          </label>
          <input
            type="date"
            {...register("birthDate", {
              required: "Вкажіть дату народження",
              validate: validateAge, // підключаємо кастомну функцію валідації
            })}
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: errors.birthDate ? "1px solid red" : "1px solid #ccc",
            }}
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
            {...register("password", {
              required: "Придумайте пароль",
              minLength: { value: 6, message: "Мінімум 6 символів" },
            })}
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: errors.password ? "1px solid red" : "1px solid #ccc",
            }}
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
            Підтвердіть пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword", {
              required: "Повторіть пароль",
              validate: (value) =>
                value === passwordValue || "Паролі не збігаються",
            })}
            style={{
              width: "100%",
              padding: "10px",
              boxSizing: "border-box",
              border: errors.confirmPassword
                ? "1px solid red"
                : "1px solid #ccc",
            }}
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
            padding: "12px",
            backgroundColor: isSubmitting ? "#ccc" : "#ff4b6e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px",
          }}
        >
          {isSubmitting ? "Реєстрація..." : "Створити акаунт"}
        </button>
      </form>
    </div>
  );
}
