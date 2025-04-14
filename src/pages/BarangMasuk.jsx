import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import TabelLogMasuk from "../components/fragments/tabel/log produk/TabelLogMasuk";

export function BarangMasuk() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <TabelLogMasuk />
        </div>
      </div>
    </div>
  );
}
