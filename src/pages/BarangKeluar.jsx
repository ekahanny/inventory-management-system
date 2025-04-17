import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import TabelLogKeluar from "../components/fragments/tabel/log produk/TabelLogKeluar";

export function BarangKeluar() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <TabelLogKeluar />
        </div>
      </div>
    </div>
  );
}
