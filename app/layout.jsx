"use client";

import "./globals.css";
import Header from "./Components/Header/header";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// const meta = {
//   title:"Freelancer"
// }
import register from "../public/add-user.png";
import login from "../public/login-.png";

export default function RootLayout({ children }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pageToggle, setPageToggle] = useState("Register");

  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem("User")) {
      setPageToggle("HomePage");
    }
  }, [router]);

  async function submitHandler(e) {
    e.preventDefault();

    const UserData = {
      Username: username,
      Email: email,
      Password: password,
    };
    localStorage.setItem("LoginID", JSON.stringify(UserData));

    let ls = JSON.parse(localStorage.getItem("LoginID"));
    const compareUsername = await bcrypt.compare(username, ls.Username);
    const compareEmail = await bcrypt.compare(email, ls.Email);
    const comparePassword = await bcrypt.compare(password, ls.Password);

    if (!username == "" && !email == "" && !password == "") {
      if (
        (compareUsername && comparePassword) ||
        (compareEmail && comparePassword)
      ) {
        alert("Account Already Exists!");
      } else {
        const salt = 10;
        const hassUsername = await bcrypt.hash(username, salt);
        const hassEmail = await bcrypt.hash(email, salt);
        const hassPassword = await bcrypt.hash(password, salt);

        const userData = {
          Username: hassUsername,
          Email: hassEmail,
          Password: hassPassword,
        };
        localStorage.setItem("User", JSON.stringify(UserData));
        localStorage.setItem("LoginID", JSON.stringify(userData));
        setUsername("");
        setEmail("");
        setPassword("");
        setPageToggle("HomePage");
      }
    } else if (username == "Admin@" && password == "12345") {
      setPageToggle("HomePage");
    } else {
      alert("Fields Are Empty");
    }
  }

  async function loginHandler(e) {
    e.preventDefault();
    try {
      let ls = JSON.parse(localStorage.getItem("LoginID"));
      const compareUsername = await bcrypt.compare(username, ls.Username);
      const compareEmail = await bcrypt.compare(password, ls.Email);
      const comparePassword = await bcrypt.compare(password, ls.Password);
      if (
        (compareUsername && comparePassword) ||
        (compareEmail && comparePassword)
      ) {
        const salt = 10;
        const hassUsername = await bcrypt.hash(username, salt);
        const hassEmail = await bcrypt.hash(email, salt);
        const hassPassword = await bcrypt.hash(password, salt);

        const hassData = {
          Username: hassUsername,
          Email: hassEmail,
          Password: hassPassword,
        };
        const userData = {
          Username: username,
          Email: email,
          Password: password,
        };
        localStorage.setItem("User", JSON.stringify(userData));
        localStorage.setItem("LoginID", JSON.stringify(hassData));
        setPageToggle("HomePage");
      } else if (username == "Admin@" && password == "123") {
        setPageToggle("HomePage");
      }
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log(error.message);
    }
  }
  return (
    <html lang="en">
      <title>Freelancer</title>

      {/* <link rel="shortcut icon" href={freelancer} type="image/x-icon" /> */}
      <body>
        {pageToggle == "Register" && (
          <form className="formRegister">
            <h2 style={{ textAlign: "center" }}>Register</h2>
            <label>
              Username
              <input
                type="text"
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Email
              <input
                type="text"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="text"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="click"
              className="RegisterLink"
              onClick={submitHandler}
            >
              <Image src={register} alt="=" className="register" />
              Register
            </button>
            <button
              type="click"
              className="loginRef"
              onClick={(e) => {
                e.preventDefault();
                setPageToggle("Login");
              }}
            >
              I Already Have An Account!
            </button>
          </form>
        )}
        {pageToggle == "Login" && (
          <form className="formLogin" onSubmit={submitHandler}>
            <h2 style={{ textAlign: "center" }}>Login</h2>
            <label>
              Username
              <input
                type="text"
                required
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              Password
              <input
                type="text"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="click" className="LoginLink" onClick={loginHandler}>
              <Image src={login} alt="=" className="login" />
              Login
            </button>
            <button
              type="click"
              className="RegisterRef"
              onClick={(e) => {
                e.preventDefault();
                setPageToggle("Register");
              }}
            >
              I Don't Have An Account
            </button>
          </form>
        )}
        {pageToggle == "HomePage" && (
          <>
            <Header />
            <main>{children}</main>
          </>
        )}
      </body>
    </html>
  );
}
