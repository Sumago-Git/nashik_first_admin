//sos
// import { createContext, useState } from "react";
// import { PropTypes } from "prop-types";

// export const SidebarContext = createContext({});

// export const SidebarProvider = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const openSidebar = () => {
//     setSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <SidebarContext.Provider
//       value={{
//         isSidebarOpen,
//         openSidebar,
//         closeSidebar,
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// SidebarProvider.propTypes = {
//   children: PropTypes.node,
// };












// import { createContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";

// export const SidebarContext = createContext({});

// export const SidebarProvider = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default
//   const [activeMenuName, setActiveMenuName] = useState("Header Contact"); // Default active menu

//   // Simulate user login
//   useEffect(() => {
//     setSidebarOpen(true);
//     setActiveMenuName("Header Contact");
//   }, []);

//   const openSidebar = () => {
//     setSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   const setActiveMenu = (name) => {
//     setActiveMenuName(name);
//   };

//   return (
//     <SidebarContext.Provider
//       value={{
//         isSidebarOpen,
//         openSidebar,
//         closeSidebar,
//         activeMenuName,
//         setActiveMenu,
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// SidebarProvider.propTypes = {
//   children: PropTypes.node,
// };





////v1
// import { createContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { useLocation } from "react-router-dom";

// export const SidebarContext = createContext({});

// export const SidebarProvider = ({ children }) => {
//   const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default
//   const [activeMenuName, setActiveMenuName] = useState("Header Contact"); // Default active menu
//   const location = useLocation();

//   useEffect(() => {
//     // Map URL paths to menu names
//     const pathToMenuMap = {
//       "/testimonial": "Testimonial",
//       // Add other paths and their corresponding menu names here
//       // "/another-path": "Another Menu",
//     };

//     const currentPath = location.pathname;
//     const menuName = pathToMenuMap[currentPath] || "Header Contact";
//     setActiveMenuName(menuName);
//   }, [location.pathname]);

//   const openSidebar = () => {
//     setSidebarOpen(true);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   const setActiveMenu = (name) => {
//     setActiveMenuName(name);
//   };

//   return (
//     <SidebarContext.Provider
//       value={{
//         isSidebarOpen,
//         openSidebar,
//         closeSidebar,
//         activeMenuName,
//         setActiveMenu,
//       }}
//     >
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// SidebarProvider.propTypes = {
//   children: PropTypes.node,
// };







////v2
import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

export const SidebarContext = createContext({});

export const SidebarProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // Sidebar is open by default
  const [activeMenuName, setActiveMenuName] = useState("Header Contact"); // Default active menu
  const [activeSubMenu, setActiveSubMenu] = useState(""); // New state for active submenu
  const location = useLocation();

  useEffect(() => {
    // Map URL paths to menu names
    const pathToMenuMap = {
      "/testimonial": { menu: "Testimonial", subMenu: "" },
      // Add other paths and their corresponding menu and submenu names here
      // "/another-path": { menu: "Another Menu", subMenu: "Submenu Name" },
    };

    const currentPath = location.pathname;
    const { menu, subMenu } = pathToMenuMap[currentPath] || { menu: "Header Contact", subMenu: "" };
    setActiveMenuName(menu);
    setActiveSubMenu(subMenu);
  }, [location.pathname]);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const setActiveMenu = (name) => {
    setActiveMenuName(name);
    setActiveSubMenu(""); // Reset active submenu when main menu is changed
  };

  const setActiveSub = (subMenu) => {
    setActiveSubMenu(subMenu); // Set active submenu
  };

  return (
    <SidebarContext.Provider
      value={{
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        activeMenuName,
        setActiveMenu,
        activeSubMenu,
        setActiveSub,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

SidebarProvider.propTypes = {
  children: PropTypes.node,
};