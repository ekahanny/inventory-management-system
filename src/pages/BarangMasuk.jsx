import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import TabelBrgMasuk from "../components/fragments/TabelBrgMasuk";

export function BarangMasuk() {
  return (
    <div>
      <NavBar />
      <div className="flex flex-row bg-slate-200">
        <VerticalTabs />
        <div className="mx-6 mt-5 w-5/6">
          <TabelBrgMasuk />
        </div>
      </div>
    </div>
  );
}
