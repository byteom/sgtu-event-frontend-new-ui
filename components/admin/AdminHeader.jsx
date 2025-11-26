"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminHeader({ theme, toggleTheme, adminName, onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleProfileClick = () => {
    router.push("/admin/settings");
    setShowProfileMenu(false);
  };

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
    setShowProfileMenu(false);
  };

  return (
    <header
      className="
        fixed top-0 right-0 left-0 md:left-64
        h-16 flex items-center
        bg-card-background dark:bg-card-background
        border-b border-light-gray-border
        z-30
      "
    >
      <div className="w-full flex items-center justify-between px-4 sm:px-6 gap-2 sm:gap-4">
        {/* LEFT - PAGE TITLE */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-dark-text dark:text-white truncate">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* RIGHT - ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="
              text-dark-text dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              p-2 rounded-lg transition
            "
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <span className="material-symbols-outlined text-xl sm:text-2xl">dark_mode</span>
            ) : (
              <span className="material-symbols-outlined text-xl sm:text-2xl">light_mode</span>
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-light-gray-border dark:border-gray-700 hover:opacity-80 transition"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                {adminName ? adminName.charAt(0).toUpperCase() : "AD"}
              </div>
              <span className="text-xs sm:text-sm font-medium text-dark-text dark:text-gray-300 hidden lg:block">
                {adminName || "Admin User"}
              </span>
              <span className="material-symbols-outlined text-lg text-dark-text dark:text-gray-300 hidden lg:block">
                {showProfileMenu ? "expand_less" : "expand_more"}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card-background rounded-lg border border-light-gray-border shadow-soft z-50 overflow-hidden">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-dark-text hover:bg-soft-background transition text-left"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  <span>Profile</span>
                </button>
                <div className="border-t border-light-gray-border"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function getPageTitle(pathname) {
  const titles = {
    "/admin": "Dashboard Overview",
    "/admin/events": "Events Management",
    "/admin/students": "Students Management",
    "/admin/volunteers": "Volunteers Management",
    "/admin/stalls": "Stall Management",
    "/admin/scans": "Attendance Log (Scans)",
    "/admin/analytics": "Analytics",
    "/admin/reports": "Reports & Statistics",
    "/admin/settings": "Profile & Settings",
    "/admin/event-managers": "Event Managers",
  };
  return titles[pathname] || "Dashboard Overview";
}
