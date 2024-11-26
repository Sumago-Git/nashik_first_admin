import { useContext, useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import logo from "../../assets/images/logo.png";
import { Sidebar as MenuBar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import {
  MdOutlineClose,
  MdHome,
  MdLogout,
  MdOutlinePermContactCalendar,
  MdOutlinePhotoSizeSelectLarge, MdInfoOutline, MdOutlineFlag, MdTimer, MdPhotoLibrary,
  MdPeopleOutline, MdEvent, MdPlayCircleOutline, MdArticle, MdEventNote, MdAssessment, MdContactMail,
  MdSchool, MdLocalOffer, MdSupervisorAccount, MdThumbUp
} from "react-icons/md";
import { RiTeamFill, RiContactsBookLine, RiFileListLine } from "react-icons/ri";
import { FiUsers, FiList, FiFileText, FiUploadCloud } from "react-icons/fi";
import {
  AiOutlineAppstoreAdd,
  AiOutlineProject,
} from "react-icons/ai";
import { BsNewspaper, BsBuilding, BsChatSquareQuote } from "react-icons/bs";
import { FaRegNewspaper } from "react-icons/fa";
import "./Sidebar.scss";
import { SidebarContext } from "../../context/SidebarContext";
import { TitleContext } from "../../context/TitleContext";
import { IoIosOptions, IoIosPeople } from "react-icons/io";
// Sidebar menu structure
const SidebarMenu = [
  {
    menu: "CMS",
    url: "/dashboard",
    mainIcon: <MdHome size={24} />,
    subMenu: [
      {
        subMenus: "Home Banner",
        url: "/homebanner",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      // {
      //   subMenus: "Header Contact",
      //   url: "/headercontact",
      //   icon: <RiContactsBookLine style={{ color: "red" }} size={24} />,
      // },
      {
        subMenus: "Social Contacts",
        url: "/social-contact",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Objective of ANF",
        url: "/objective-of-anf",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Home Counter",
        url: "/home-counter",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Photo Gallary",
        url: "/photo-gallary",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Director",
        url: "/directors",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Past Event",
        url: "/pastevents",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Upcomming Events",
        url: "/upcommingevents",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Our Videos",
        url: "/trafficawarenessvideo",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Home Video",
        url: "/home-videos",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "News",
        url: "/news",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Annual Reports",
        url: "/annualreport",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Annual Returns",
        url: "/annualreturn",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Contact Details",
        url: "/contactinfo",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Follow on us",
        url: "/follow-on-us",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Contact Form",
        url: "/conact-form",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "Thanks To",
        url: "/thanksto",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  // {
  //   menu: "Home Banner",
  //   url: "/homebanner",
  //   mainIcon: <MdOutlinePhotoSizeSelectLarge size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Home Banner",
  //       url: "/homebanner",
  //       icon: <AiOutlineAppstoreAdd  style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "About",
  //   url: "/about",
  //   mainIcon: <MdInfoOutline size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Leadership",
  //       url: "/leadership",
  //       icon: <FiUsers style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "Objective of ANF",
  //   url: "/objective-of-anf",
  //   mainIcon: <MdOutlineFlag size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Objective of ANF",
  //       url: "/objective-of-anf",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "Home Counter",
  //   url: "/home-counter",
  //   mainIcon: <MdTimer size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Home Counter",
  //       url: "/home-counter",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "Photo Gallary",
  //   url: "/photo-gallary",
  //   mainIcon: <MdPhotoLibrary size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Photo Gallary",
  //       url: "/photo-gallary",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  // {
  //   menu: "Directors",
  //   url: "/directors",
  //   mainIcon: <MdPeopleOutline size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Director",
  //       url: "/directors",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  // {
  //   menu: "Events",
  //   url: "/masters",
  //   mainIcon: <MdEvent size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Past Event",
  //       url: "/pastevents",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //     {
  //       subMenus: "Upcomming Events",
  //       url: "/upcommingevents",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  // {
  //   menu: "Video",
  //   url: "/tav",
  //   mainIcon: <MdPlayCircleOutline size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Our Videos",
  //       url: "/trafficawarenessvideo",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //     {
  //       subMenus: "Home Video",
  //       url: "/home-videos",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "News",
  //   url: "/news",
  //   mainIcon: <MdArticle size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "News",
  //       url: "/news",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  {
    menu: "Slot Booking",
    url: "/report",
    mainIcon: <MdEventNote size={24} />,
    subMenu: [
      {
        subMenus: "TEP",
        url: "/CalenderComp",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
      {
        subMenus: "On Site",
        url: "/calender2",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      }
    ],
  },
  // {
  //   menu: "Reports",
  //   url: "/report",
  //   mainIcon: <MdAssessment size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Annual Reports",
  //       url: "/annualreport",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //     {
  //       subMenus: "Annual Returns",
  //       url: "/annualreturn",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },

  //   ],
  // },
  // {
  //   menu: "Contact Us",
  //   url: "/contactus",
  //   mainIcon: <MdContactMail size={24} />,
  //   subMenu: [
  //     // {
  //     //   subMenus: "Our Offices",
  //     //   url: "/office",
  //     //   icon: <BsBuilding style={{ color: "red" }} size={24} />,
  //     // },
  //     {
  //       subMenus: "Contact Details",
  //       url: "/contactinfo",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //     {
  //       subMenus: "Follow on us",
  //       url: "/follow-on-us",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //     {
  //       subMenus: "Contact Form",
  //       url: "/conact-form",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     }
  //   ],
  // },
  // {
  //   menu: "Training",
  //   url: "/training",
  //   mainIcon: <MdSchool size={24} />,
  //   subMenu: [
  //     {
  //       subMenus: "Bookings",
  //       url: "/bookings",
  //       icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
  //     },
  //   ],
  // },
  {
    menu: "Booking Package",
    url: "/bookseats",
    mainIcon: <MdLocalOffer size={24} />,
    subMenu: [
      {
        subMenus: "Booking Package",
        url: "/bookseats",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  {
    menu: "Trainer",
    url: "/trainer",
    mainIcon: <MdSupervisorAccount size={24} />,
    subMenu: [
      {
        subMenus: "Trainer",
        url: "/trainer",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  {
    menu: "Group registration",
    url: "/groupbooking",
    mainIcon: <MdLocalOffer size={24} />,
    subMenu: [
      {
        subMenus: "Booking Package",
        url: "/groupbooking",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  {
    menu: "Search",
    url: "/search",
    mainIcon: <MdLocalOffer size={24} />,
    subMenu: [
      {
        subMenus: "Search",
        url: "/search",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  {
    menu: "Masters",
    url: "/masters",
    mainIcon: <MdSchool size={24} />,
    subMenu: [
      {
        subMenus: "Holiday",
        url: "/holiday",
        icon: <AiOutlineAppstoreAdd style={{ color: "red" }} size={24} />,
      },
    ],
  },
  {
    menu: "Logout",
    url: "/logout",
    mainIcon: <MdLogout size={24} />,
    subMenu: [],
  },
];

// Sidebar Component
const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
  const navbarRef = useRef(null);
  const { setTitle } = useContext(TitleContext);
  const [activeMenu, setActiveMenu] = useState("");
  const [activeSubMenu, setActiveSubMenu] = useState("");

  // Close sidebar on clicking outside
  const handleClickOutside = (event) => {
    if (
      navbarRef.current &&
      !navbarRef.current.contains(event.target) &&
      event.target.className !== "sidebar-open-btn"
    ) {
      closeSidebar();
    }
  };

  // Close sidebar on window resize
  const handleResize = () => {
    if (window.innerWidth <= 1200) {
      closeSidebar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle main menu click
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? "" : menu); // Toggle active menu
    setActiveSubMenu(""); // Close any open sub menu when a main menu is clicked
    setTitle(menu); // Set the title context
  };

  // Handle sub menu click
  const handleSubMenuClick = (subMenu) => {
    setActiveSubMenu(subMenu); // Set active sub menu
  };

  return (
    <nav ref={navbarRef} className={`sidebar ${isSidebarOpen ? "sidebar-show" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <img className="w-75 mx-auto" src={logo} alt="Logo" />
          {/* <span className="sidebar-brand-text text-danger">
            Nashik First
          </span> */}
        </div>
        <Button
          variant="outline-danger"
          className="sidebar-close-btn"
          onClick={closeSidebar}
        >
          <MdOutlineClose size={24} />
        </Button>
      </div>
      <div className="sidebar-body">
        <div className="sidebar-menu">
          <MenuBar>
            <Menu>
              {SidebarMenu.map((item, id) => (
                <div key={id}>
                  {item.subMenu.length > 0 ? (
                    <SubMenu
                      className={`menu-link-text bg-white ${activeMenu === item.menu ? "active" : ""
                        }`}
                      icon={item.mainIcon}
                      label={item.menu}
                      open={activeMenu === item.menu}
                      onClick={() => handleMenuClick(item.menu)}
                    >
                      {item.subMenu.map((subItem, subId) => (
                        <MenuItem
                          key={subId}
                          component={<Link to={subItem.url} />}
                          icon={subItem.icon}
                          className={`menu-link-text bg-white ${activeSubMenu === subItem.subMenus ? "active" : ""
                            }`}
                          onClick={() => handleSubMenuClick(subItem.subMenus)}
                        >
                          {subItem.subMenus}
                        </MenuItem>
                      ))}
                    </SubMenu>
                  ) : (
                    <MenuItem
                      icon={item.mainIcon}
                      className={`menu-link-text bg-white ${activeMenu === item.menu ? "active" : ""
                        }`}
                      onClick={() => {
                        handleMenuClick(item.menu);
                        closeSidebar(); // Close sidebar on menu item click
                      }}
                      component={<Link to={item.url} />}
                    >
                      {item.menu}
                    </MenuItem>
                  )}
                </div>
              ))}
            </Menu>
          </MenuBar>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;