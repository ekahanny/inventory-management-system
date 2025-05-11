import React from "react";
import { Menubar } from "primereact/menubar";
import logo from "../../assets/logo.png";
import { classNames } from "primereact/utils";

export function NavBar() {
  const items = [];

  const profileItems = [
    {
      label: "Profile",
      icon: "pi pi-user",
      classNames: "w-4",
      command: () => console.log("Profile clicked"),
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => console.log("Logout clicked"),
    },
  ];

  const start = (
    <div className="flex items-center h-10">
      <img src={logo} alt="Logo" className="w-14 ml-4" />
      <span className="font-semibold text-xl text-black ml-2">
        Cokonuri Mart
      </span>
    </div>
  );

  return (
    <div className="fixed top-0 left-[210px] right-0 z-50 h-16 bg-white border-b flex items-center px-4 shadow-sm">
      <Menubar
        model={items}
        start={start}
        end={
          <div className="flex items-center gap-2 ml-2">
            <Menubar
              model={[
                {
                  label: "",
                  icon: "pi pi-user",
                  items: profileItems,
                },
              ]}
            />
          </div>
        }
        className="w-full h-full border-none shadow-none"
      />
    </div>
  );
}
