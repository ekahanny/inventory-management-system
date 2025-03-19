import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";

export function BarangKeluar() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4">
          <NavBar />

          {/* Konten Barang Keluar */}
          <div className="min-h-screen">
            <h1>Barang Keluar</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
