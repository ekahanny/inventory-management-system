import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import Sidebars from "../components/elements/Sidebar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import TabelBrgMasuk from "../components/fragments/TabelBrgMasuk";

export function BarangMasuk() {
  return (
    <div className="flex bg-slate-200">
      {/* Sidebar */}
      <SidebarComponent />

      {/* Konten utama */}
      <div className="flex-1 px-5 py-3 ml-[320px]">
        <TabelBrgMasuk />
      </div>
    </div>
  );
}
