import { NavBar } from "../components/elements/NavBar";
import SidebarComponent from "../components/elements/Sidebar";

export default function UserProfile() {
  return (
    <div className="flex bg-slate-200">
      <SidebarComponent />
      <div className="flex-1">
        <div className="ml-[210px] mt-[60px] p-4 min-h-screen">
          <NavBar />
          <h1>Ini laman profile</h1>
        </div>
      </div>
    </div>
  );
}
