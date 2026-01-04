// frontend/src/App.jsx

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Games from "./pages/Games";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />

          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route index element={<Navigate to="/games" replace />} />
              <Route path="/games" element={<Games />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

            <Route path="*" element={<Navigate to="/games" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
