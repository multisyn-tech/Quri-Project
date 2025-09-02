/* eslint-disable */
import React, { useEffect, useState } from "react";
import Dropdown from "../dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { getSettings } from "../../../../features/settings/settingSlice";

import avatar from "../../../../assets/img/avatars/avatar4.png";
import { useTheme } from "../../../../state/themeContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Navbar = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize dispatch
  const { onOpenSidenav, brandText } = props;
  const { darkMode, toggleDarkMode } = useTheme();

  // Fetch user role from localStorage and normalize it to lowercase
  const role = localStorage.getItem("role")?.toLowerCase();

  const restaurantNames = useSelector((state) => state.settings?.settings);

  const restaurantName = restaurantNames && restaurantNames.length > 0
    ? restaurantNames.find(item => item.KeyID === "RestaurantName")?.Value
    : "Restaurant Not Available";



  const loading = useSelector((state) => state.settings.loading);

  const img = useSelector((state) => state.settings.img);
  // console.log("Image: ",img)

  useEffect(() => {
    dispatch(getSettings()); // Fetch settings to get the image
  }, [dispatch]);


  useEffect(() => {
    const fetchSettings = async () => {
      await dispatch(getSettings()); // Fetch settings including the image immediately
    };

    fetchSettings(); // Call the async function to fetch settings
  }, [dispatch]);


  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("restaurantId");
    localStorage.removeItem("role");
    // Navigate to the login page
    navigate("/admins/login");
  };



  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 bg-[#F4F7FE] dark:bg-[#0b14374d]">
      <div className="ml-[6px] flex items-center">
        <div className="h-6 w-[224px] pt-1">
          <a
            className="text-sm font-normal text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            href=" "
          >
            Pages
            <span className="mx-1 text-sm text-navy-700 hover:text-navy-700 dark:text-white">
              {" "}
              /{" "}
            </span>
          </a>
          <Link
            className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white dark:hover:text-white"
            to="#"
          >
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white ml-2 md:ml-0">
          <Link
            to="#"
            className="font-bold capitalize hover:text-navy-700 dark:hover:text-white"
          >
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-full md:w-[155px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0 md:gap-1 xl:w-[200px] xl:gap-2">
        <div className="hidden flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>
        <span
          className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden"
          onClick={onOpenSidenav}
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div
          className="cursor-pointer text-gray-600"
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>

        {/* Profile & Dropdown */}
        <Dropdown
          button={
            <img
              className="w-14 h-12 rounded-full"
              src={img == null || img === '' ? avatar : `${BASE_URL}/${img}`}
              alt="Avatar"
            />
          }
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  {loading ? (
                    <p className="text-sm font-bold text-navy-700 dark:text-white">
                      Loading...
                    </p>
                  ) : (
                    role === 'restaurant' && (
                      <p className="text-sm font-bold text-navy-700 dark:text-white">
                        {restaurantName}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                {role === 'restaurant' && (
                  <Link
                    to="/admin/manage/settings"
                    className="text-sm text-gray-800 dark:text-white hover:dark:text-blue-400"
                  >
                    Profile Settings
                  </Link>
                )}
                <button
                  className="flex flex-auto mt-3 text-sm font-medium text-red-500 hover:text-red-700 transition duration-150 ease-out hover:ease-in"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>

    </nav>
  );
};

export default Navbar;