import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
// import TabelLogMasuk from "../components/fragments/tabel/log produk/TabelLogMasuk";
import TabelProduk from "../components/fragments/tabel/produk/TabelProduk";

export function Produk() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <TabelProduk />
        </div>
      </div>
    </div>
  );
}
