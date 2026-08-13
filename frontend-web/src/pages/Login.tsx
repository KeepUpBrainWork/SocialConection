import { useForm } from "react-hook-form";
import { LoginCredentials } from "../types/auth";

export default function Login() {
  // 1. Ініціалізація хука з прив'язкою до нашого TypeScript-інтерфейсу
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  // 2. Функція, яка спрацює ТІЛЬКИ у разі успішної валідації
  const onSubmit = (data: LoginCredentials) => {
    console.log("Дані готові для відправки на Node.js бекенд:", data);
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
      {/* 3. Перехоплення нативної події відправки форми */}
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

        {/* Блок інпуту Email */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Електронна пошта
          </label>
          {/* 4. Реєстрація інпуту з правилами валідації */}
          <input
            type="text"
            placeholder="example@mail.com"
            {...register("email", {
              required: "Це поле є обов'язковим",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Некоректний формат email",
              },
            })}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
          {/* 5. Умовний рендеринг помилки */}
          {errors.email && (
            <p style={{ color: "red", margin: "4px 0 0 0", fontSize: "13px" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Блок інпуту Пароля */}
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Пароль
          </label>
          <input
            type="password"
            placeholder="••••••••"
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
            <p style={{ color: "red", margin: "4px 0 0 0", fontSize: "13px" }}>
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#ff4b6e",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
