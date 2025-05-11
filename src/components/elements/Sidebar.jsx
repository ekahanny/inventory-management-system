import React, { useState, useRef } from "react";
import { Sidebar } from "primereact/sidebar";
import { NavLink } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function SidebarComponent() {
  const toast = useRef(null);

  const handleLogout = () => {
    confirmDialog({
      message: "Are you sure you want to sign out?",
      header: "Logout Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName:
        "px-2.5 py-1.5 text-sm border-1 border-sky-400 text-white bg-sky-400",
      rejectClassName:
        "px-2 py-1.5 border-1 border-sky-400 text-sm text-sky-400 mr-2",
      acceptLabel: "Yes",
      rejectLabel: "Cancel",
      accept: () => {
        localStorage.clear();
        sessionStorage.clear();

        // Redirect to login page
        setTimeout(() => {
          window.location.href = "/login"; // Full page reload to clear state
        }, 1000);
      },
      reject: () => {
        toast.current.show({
          severity: "info",
          summary: "Cancelled",
          detail: "Logout was cancelled",
          life: 3000,
        });
      },
    });
  };

  return (
    <div className="card flex justify-content-center">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Sidebar
        visible={true} // Sidebar selalu tampil
        dismissable={false} // Sidebar tidak bisa ditutup dengan klik di luar
        showCloseIcon={false} // Menyembunyikan tombol close
        modal={false} // Menghindari efek modal
        content={() => (
          <div className="min-h-screen flex relative lg:static surface-ground">
            <div
              id="app-sidebar-2"
              className="surface-section h-screen block flex-shrink-0 lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
              style={{ width: "210px" }}
            >
              <div className="flex flex-column h-full">
                <div className="overflow-y-auto">
                  <ul className="list-none p-3 m-0">
                    <li>
                      <ul className="list-none p-0 m-0 overflow-hidden">
                        <li>
                          <NavLink
                            to="/"
                            className={({ isActive }) =>
                              `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                isActive ? " bg-blue-300" : "bg-white"
                              }`
                            }
                          >
                            <i className="pi pi-home mr-2"></i>
                            <span className="font-medium">Dashboard</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/barang-masuk"
                            className={({ isActive }) =>
                              `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                isActive ? " bg-blue-300" : "bg-white"
                              }`
                            }
                          >
                            <i className="pi pi-shopping-cart mr-2"></i>
                            <span className="font-medium">Barang Masuk</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/barang-keluar"
                            className={({ isActive }) =>
                              `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                isActive ? " bg-blue-300" : "bg-white"
                              }`
                            }
                          >
                            <i className="pi pi-shop mr-2"></i>
                            <span className="font-medium">Barang Keluar</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/riwayat-produk"
                            className={({ isActive }) =>
                              `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                isActive ? " bg-blue-300" : "bg-white"
                              }`
                            }
                          >
                            <i className="pi pi-history mr-2"></i>
                            <span className="font-medium">Riwayat Produk</span>
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/kategori"
                            className={({ isActive }) =>
                              `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                isActive ? " bg-blue-300" : "bg-white"
                              }`
                            }
                          >
                            <i className="pi pi-box mr-2"></i>
                            <span className="font-medium">Kategori</span>
                          </NavLink>
                        </li>
                        {/* <li>
                          <StyleClass
                            nodeRef={btnRef2}
                            selector="@next"
                            enterFromClassName="hidden"
                            enterActiveClassName="slidedown"
                            leaveToClassName="hidden"
                            leaveActiveClassName="slideup"
                          >
                            <a
                              ref={btnRef2}
                              className="flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200"
                            >
                              <i className="pi pi-history mr-2"></i>
                              <span className="font-medium">Riwayat</span>
                              <i className="pi pi-chevron-down ml-auto mr-1"></i>
                            </a>
                          </StyleClass>
                          <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out">
                            <li>
                              <NavLink
                                to="/riwayat-barang-masuk"
                                className={({ isActive }) =>
                                  `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                    isActive ? " bg-blue-300" : "bg-white"
                                  }`
                                }
                              >
                                <i className="pi pi-chart-line mr-3"></i>
                                <span className="font-medium text-sm">
                                  Barang Masuk
                                </span>
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/riwayat-barang-keluar"
                                className={({ isActive }) =>
                                  `flex align-items-center cursor-pointer p-3 border-round text-900 hover:surface-200 w-full ${
                                    isActive ? " bg-blue-300" : "bg-white"
                                  }`
                                }
                              >
                                <i className="pi pi-chart-bar mr-3"></i>
                                <span className="font-medium text-sm">
                                  Barang Keluar
                                </span>
                              </NavLink>
                            </li>
                          </ul>
                        </li> */}
                      </ul>
                    </li>
                  </ul>
                </div>
                <div className="mt-auto">
                  <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                  <a
                    onClick={handleLogout}
                    className="flex m-2 align-items-center cursor-pointer p-3 gap-2 border-round text-900 hover:surface-200"
                  >
                    <i className="pi pi-sign-out ml-5"></i>

                    <span className="font-bold">Sign Out</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      ></Sidebar>
    </div>
  );
}
