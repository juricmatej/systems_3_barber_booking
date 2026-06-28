import { useState } from "react";
import { API_URL } from "../api/api";

export default function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (res.ok) {
        setMessage("Register sucessful");
      } else {
        setMessage(data.message || "Register failed.");
      }
    } catch (err) {
      console.log("Login error:", err);
      setMessage("Login error. Please try again.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <div>
            <label>First name</label>
            <input
              type="text"
              value={first_name}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div>
            <label>Last name</label>
            <input
              type="text"
              value={last_name}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>

            <div>
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">Register</button>
        </form>

        {message && <p>{message}</p>}
      </section>
    </main>
  );
}
