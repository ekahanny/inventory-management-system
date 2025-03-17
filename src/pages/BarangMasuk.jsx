import { NavBar } from "../components/elements/NavBar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import TabelBrgMasuk from "../components/fragments/TabelBrgMasuk";

export function BarangMasuk() {
  return (
    <div className="bg-slate-200 min-h-screen">
      <NavBar />
      <div className="flex flex-row flex-grow h-screen">
        <VerticalTabs />
        <div className="flex-grow overflow-y-auto p-4">
          <TabelBrgMasuk />
        </div>
      </div>
    </div>
  );
}
