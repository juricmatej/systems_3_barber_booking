import { BrowserRouter, Routes, Route } from "react-router";
import Menu from "../components/Menu";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { BookingProvider } from "../context/BookingContext";
import  Book  from "../pages/Book";
import  Admin  from "../pages/Admin";
import Home from "../pages/Home";
import Barber from "../pages/Barber";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Menu />

      <Routes>

        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookingProvider> <Book/ > </BookingProvider>  } />
        <Route path="/admin" element={<Admin />} />
        <Route path="barber" element={<Barber />} />



      </Routes>
    </BrowserRouter>
  );
}