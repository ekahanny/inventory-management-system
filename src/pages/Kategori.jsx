import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";

export function Kategori() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4">
          <NavBar />

          {/* Konten Kategori Barang */}
          <div className="min-h-screen">
            <h1>Kategori</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
