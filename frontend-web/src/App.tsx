import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 4. Захист від несуexisting сторінок (Помилка 404) */}
        <Route
          path="*"
          element={
            <div
              style={{
                textAlign: "center",
                marginTop: "50px",
                fontFamily: "sans-serif",
              }}
            >
              <h2>Помилка 404: Сторінку не знайдено</h2>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
