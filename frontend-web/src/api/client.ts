import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Змінити на ваш бекенд URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Додаємо цю опцію для відправки cookies
});

export default api;
