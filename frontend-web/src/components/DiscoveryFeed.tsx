import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import { useAuth } from "../hooks/useAuth";

interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
}

export const DiscoveryFeed: React.FC = () => {
  // Наші "магічні коробочки" для збереження стану (useState)
  const [profiles, setProfiles] = useState<UserProfile[]>([]); // Тут лежать усі анкети
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Номер картки, яку ми зараз дивимось
  const [isFetching, setIsFetching] = useState<boolean>(true); // Чи шукаємо ми картки прямо зараз?

  const auth = useAuth(); // Дізнаємося ім'я нашого користувача

  // 2. Ефект "Першого погляду" (useEffect) — спрацьовує один раз, коли відкривається сторінка
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        // Просимо нашого поштаря Axios збігати на сервер за анкетами
        const response = await apiClient.get<UserProfile[]>(
          "/profiles/recommendations",
        );
        setProfiles(response.data); // Кладемо знайдені анкети в коробочку
      } catch (error) {
        console.error("Ой! Не вдалося завантажити анкети з сервера:", error);
      } finally {
        setIsFetching(false); // Кажемо комп'ютеру: "Ми закінчили шукати!"
      }
    };

    loadProfiles();
  }, []);

  // 3. Функція прийняття рішення (Лайк або Дизлайк)
  const handleDecision = async (
    profileId: string,
    action: "like" | "dislike",
  ) => {
    // Хитрість: Ми миттєво перемикаємо на наступну картку (Оптимістичний інтерфейс)
    // Користувач не чекає інтернету, для нього все літає!
    setCurrentIndex((prevIndex) => prevIndex + 1);

    try {
      // Відправляємо лист на сервер: "Юзер поставив цьому профілю лайк/дизлайк"
      await apiClient.post(`/profiles/${profileId}/${action}`);
    } catch (error) {
      console.error(`Не вдалося надіслати ${action} на сервер:`, error);
      // Якщо інтернет зник і сталася помилка — повертаємо картку назад (Відкат стану)
      setCurrentIndex((prevIndex) => prevIndex - 1);
      alert("Ой, схоже зник інтернет! Спробуй ще раз.");
    }
  };

  // Перевірка №1: Якщо ми ще шукаємо картки в інтернеті
  if (isFetching) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "20px",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Шукаємо найкращі анкети для тебе... 🔍</h3>
      </div>
    );
  }

  // Перевірка №2: Якщо картки закінчилися або список порожній
  if (currentIndex >= profiles.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px",
          fontFamily: "sans-serif",
        }}
      >
        <h3>Упс! Анкети навколо закінчилися. 🌍</h3>
        <p>Заходь трохи пізніше, обов'язково з'явиться хтось новенький!</p>
      </div>
    );
  }

  // Беремо поточну картку за її номером у списку
  const currentProfile = profiles[currentIndex];

  return (
    <div
      className="discovery-container"
      style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "sans-serif" }}
    >
      {/* Сама картка супергероя */}
      <div
        className="profile-card"
        style={{
          border: "1px solid #ccc",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        {/* Фотографія */}
        <img
          src={currentProfile.photos[0] || "https://placeholder.com"}
          alt={currentProfile.name}
          style={{ width: "100%", height: "350px", objectFit: "cover" }}
        />

        {/* Текстова інформація */}
        <div style={{ padding: "20px" }}>
          <h2 style={{ margin: "0 0 10px 0" }}>
            {currentProfile.name}, {currentProfile.age}
          </h2>
          <p style={{ color: "#666", fontSize: "14px", minHeight: "40px" }}>
            {currentProfile.bio || "Користувач не залишив опису."}
          </p>

          {/* Кнопочки для гри */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => handleDecision(currentProfile.id, "dislike")}
              style={{
                width: "45%",
                padding: "12px",
                background: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              ✕ Ні
            </button>
            <button
              onClick={() => handleDecision(currentProfile.id, "like")}
              style={{
                width: "45%",
                padding: "12px",
                background: "#52c41a",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              ♥ Так!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryFeed;
