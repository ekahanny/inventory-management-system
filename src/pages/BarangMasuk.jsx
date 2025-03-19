import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";
import Sidebars from "../components/elements/Sidebar";
import { VerticalTabs } from "../components/elements/VerticalTabs";
import TabelBrgMasuk from "../components/fragments/TabelBrgMasuk";

export function BarangMasuk() {
  return (
    // <div>
    //   {/* <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md"> */}
    //   <NavBar />
    //   {/* </div> */}
    //   <div className="flex flex-col bg-slate-200">
    //     <SidebarComponent />
    //     <div className="flex-grow px-4 py-3 ml-[210px]">
    //       <TabelBrgMasuk />
    //     </div>
    //   </div>
    // </div>

    <div className="flex bg-slate-200">
      <div className="">
        <SidebarComponent />
      </div>
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4">
          <NavBar />
          <TabelBrgMasuk />
        </div>
      </div>
    </div>
  );
}
