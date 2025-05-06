import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import loginAssets from "../assets/login-assets.svg";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex align-items-center justify-content-center bg-slate-200 flex-col">
      <div
        className="card"
        style={{
          //   width: "80%",
          maxWidth: "1200px",
          minHeight: "500px",
          borderRadius: "12px",
          backgroundColor: "#3b82f6", // Biru Tailwind 500
          boxShadow: "0 8px 10px rgba(0, 0, 0, 0.1)",
          opacity: "90%",
        }}
      >
        <div className="flex flex-column md:flex-row">
          <div className="w-full md:w-5 flex flex-column justify-content-center py-5">
            <img src={loginAssets} className="w-[950px] ml-24 mt-6" />
          </div>

          <div className="w-full md:w-2">
            <Divider layout="vertical" className="hidden md:flex">
              {/* <b>OR</b> */}
            </Divider>
            <Divider
              layout="horizontal"
              className="flex md:hidden"
              align="center"
            >
              {/* <b>OR</b> */}
            </Divider>
          </div>

          <div className="w-full md:w-4 flex flex-column align-items-center gap-3 py-5 px-4">
            <h1
              className="text-4xl font-bold mb-4 mt-6 text-white"
              style={{ color: "#2563eb" }}
            >
              USER LOGIN
            </h1>
            <div className="w-full max-w-md">
              {" "}
              {/* Container untuk form */}
              <label className="w-6rem text-white">Username</label>
              <InputText
                id="username"
                type="text"
                className="w-full h-10 px-4 py-2 text-base mt-1.5" // h-10 = height 2.5rem
                pt={{
                  root: {
                    style: { borderRadius: "8px" },
                  },
                }}
              />
            </div>
            <div className="w-full max-w-md">
              <label className="w-6rem text-white">Password</label>
              <InputText
                id="username"
                type="text"
                className="w-full h-10 px-4 py-2 text-base mt-1.5" // h-10 = height 2.5rem
                pt={{
                  root: {
                    style: { borderRadius: "8px" },
                  },
                }}
              />
            </div>
            {/* <div className="flex w-12rem">
              <a href="#" className="text-sm text-primary">
                Forgot password?
              </a>
            </div> */}
            <Button
              label="Login"
              // icon="pi pi-user"
              className="mt-4 w-10rem mx-auto bg-slate-200 text-black py-2 px-2 "
              raised
            />
          </div>
        </div>
      </div>
    </div>
  );
}
