import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";

export function BarangMasuk() {
  return (
    <div>
      <NavBar />
      <div className="flex flex-row bg-slate-200">
        <VerticalTabs />

        <div className="m-5">
          <h1>Barang Masuk</h1>
        </div>
      </div>
    </div>
  );
}
