/* eslint-disable */
import { HiX } from "react-icons/hi";
import Links from "./components/Links";
import quriLogo from '../../../../assets/Admin/Quri.svg';
import AdminRoutes from "../../../../Router/AdminRoutes";
import SuperAdminRoutes from "../../../../Router/SuperAdminRoutes";

const Sidebar = ({ open, onClose }) => {

  const role = localStorage.getItem("role")?.toLowerCase();

  const routes = role === "admin" ? SuperAdminRoutes : AdminRoutes;



  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex flex-col  h-full w-64 bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0  ${open ? "translate-x-0" : "-translate-x-96"
        }`}
    >
      <div className="flex flex-col">
        <span
          className="absolute top-4 right-4 block cursor-pointer xl:hidden"
          onClick={onClose}
        >
         <HiX className="text-xl" />
        </span>

        <div className="mx-[56px] mt-[50px] flex items-center flex-col">
          <div className="flex justify-center">
            <div className="bg-amber-100 rounded-full p-2">
              <img src={quriLogo} alt="Quri Logo" className="w-14 h-14" />
            </div>
          </div>
          <div className="mt-4 ml-1 h-2.5 font-poppins text-[20px] font-bold uppercase text-navy-700 dark:text-white">
            Admin <span className="font-medium">Panel</span>
          </div>
        </div>
        <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      </div>
      
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <ul className="mb-auto pt-1">
          <Links routes={routes} />
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
