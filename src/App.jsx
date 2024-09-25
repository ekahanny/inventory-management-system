import { Avatar, Dropdown, Navbar, Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

function App() {
  return (
    <>
      <Navbar fluid rounded>
        <Navbar.Brand href="https://flowbite-react.com">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Flowbite React
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        {/* <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="#">About</Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse> */}
      </Navbar>

      <div className="flex">
        {/* Tabs akan berada di kolom kiri */}
        <Tabs aria-label="Vertical tabs" className="flex flex-col w-1/12">
          <Tabs.Item active title="Profile" icon={HiUserCircle}></Tabs.Item>
          <Tabs.Item title="Dashboard" icon={MdDashboard}></Tabs.Item>
          <Tabs.Item title="Settings" icon={HiAdjustments}></Tabs.Item>
          <Tabs.Item title="Contacts" icon={HiClipboardList}></Tabs.Item>
        </Tabs>

        {/* Konten dari tab akan berada di kolom kanan */}
        <div className="flex-1 p-4">
          This is{" "}
          <span className="font-medium text-gray-800 dark:text-white">
            Profile tab associated content
          </span>
          . Clicking another tab will toggle the visibility of this one for the
          next. The tab JavaScript swaps classes to control the content
          visibility and styling.
        </div>
      </div>
    </>
  );
}

export default App;
