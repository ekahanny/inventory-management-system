import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import TabelBrgMasuk from "../components/fragments/TabelBrgMasuk";

export function BarangMasuk() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <TabelBrgMasuk />
        </div>
      </div>
    </div>
  );
}
