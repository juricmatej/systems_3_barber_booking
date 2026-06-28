import { BrowserRouter, Routes, Route } from "react-router";
import Menu from "../components/Menu";
import Register from "../pages/Register";
import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />

      <Routes>
     
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}