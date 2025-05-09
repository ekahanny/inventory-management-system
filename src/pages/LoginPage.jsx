import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import backgroundPhoto from "../assets/bgblue.jpg";
import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  return (
    <div
      className="min-h-screen flex flex-col align-items-center justify-content-center"
      style={{
        backgroundImage: `url(${backgroundPhoto})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h1 className="text-white text-5xl font-bold mb-5">Welcome Back!👋🏻 </h1>
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
          backgroundColor: "#3b82f6",
          boxShadow: "0 8px 10px rgba(0, 0, 0, 0.1)",
          opacity: "0.85",
          padding: "2rem",
        }}
      >
        <div className="flex flex-column align-items-center gap-4 px-3">
          {/* <h1 className="text-4xl font-bold  text-white text-center mt-4">
            SIGN IN
          </h1> */}

          <div className="w-full">
            <label htmlFor="username" className="block text-white mb-2">
              Username
            </label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3"
              pt={{
                root: { style: { borderRadius: "8px" } },
              }}
              placeholder="Masukkan Username"
            />
          </div>

          <div className="w-full">
            <label htmlFor="password" className="block text-white mb-2">
              Password
            </label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              inputClassName="w-full p-3"
              pt={{
                root: { style: { borderRadius: "8px" } },
                input: { style: { width: "100%" } },
              }}
              placeholder="Masukkan Password"
              // toggleMask
              feedback={false}
            />
          </div>

          <Button
            label="Login"
            className="py-2 px-4 mt-2 bg-white text-blue-600 font-semibold"
            raised
            onClick={() =>
              console.log("Login attempt:", { username, password })
            }
          />

          <div className="">
            <a href="#" className="text-white text-sm hover:underline">
              Lupa password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
