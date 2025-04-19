import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import TabelRiwayatProduk from "../components/fragments/tabel/produk/TabelRiwayatProduk";

export default function RiwayatProduk() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <TabelRiwayatProduk />
        </div>
      </div>
    </div>
  );
}
