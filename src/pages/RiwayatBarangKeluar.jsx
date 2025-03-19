import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";

export function RiwayatBarangKeluar() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4">
          <NavBar />

          {/* Konten Riwayat Barang Keluar */}
          <div className="min-h-screen">
            <h1>Riwayat Barang Keluar</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
