import { Link } from "react-router";

export default function Menu() {
  return (
    <nav>
      <Link to="/news">News</Link>
      <Link to="/about">About</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}