import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { personsImgs } from '../../utils/images';
import "./Sidebar.css";

// Sample navigation links with submenu items
const navigationLinks = [
  {
    id: 1,
    title: "MASTERS",
    submenus: [
      { id: 1, title: "Holiday", urlLink: "/holiday" },
      { id: 2, title: "Session", urlLink: "/session" },
      { id: 3, title: "Type of Vehicle", urlLink: "type-of-vehicle" },
      { id: 4, title: "Training", urlLink: "/training" },
      { id: 5, title: "Status", urlLink: "/status" },
    ]
  },
  {
    id: 2,
    title: "HOME",
    submenus: [
      { id: 1, title: "Counter", urlLink: "/counter" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
  {
    id: 3,
    title: "ABOUT",
    submenus: [
      { id: 1, title: "RTO – Learner Driving License Holder Training", urlLink: "/learner-driving-license-holder-training" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
  {
    id: 4,
    title: "TRAINING",
    submenus: [
      { id: 1, title: "RTO – Learner Driving License Holder Training", urlLink: "/learner-driving-license-holder-training" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
  {
    id: 5,
    title: "TRAFFIC AWARENESS",
    submenus: [
      { id: 1, title: "RTO – Learner Driving License Holder Training", urlLink: "/learner-driving-license-holder-training" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
  {
    id: 6,
    title: "INVESTER",
    submenus: [
      { id: 1, title: "RTO – Learner Driving License Holder Training", urlLink: "/learner-driving-license-holder-training" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
  {
    id: 7,
    title: "CONTACT",
    submenus: [
      { id: 1, title: "RTO – Learner Driving License Holder Training", urlLink: "/learner-driving-license-holder-training" },
      { id: 2, title: "RTO – Suspended Driving License Holders Training", urlLink: "/suspended-driving-license-holders-training" },
      { id: 3, title: "RTO – Training for School Bus Driver", urlLink: "/training-for-school-bus-driver" },
      { id: 4, title: "School Students Training – Group", urlLink: "/school-students-training-group" },
      { id: 5, title: "College / Organization Training – Group", urlLink: "/college-organization-training-group" },
      { id: 6, title: "College / Organization Training – Individual", urlLink: "/college-organization-training-individual" },
    ]
  },
];

const SidebarMenu = ({ setTitles }) => {
  const [activeSubMenu, setActiveSubMenu] = useState("MASTERS"); // Set the "MASTERS" submenu open by default
  const location = useLocation(); // Get current route

  useEffect(() => {
    // Find the "Holiday" menu item and set it active
    const defaultSubMenu = navigationLinks.find(item => item.title === "MASTERS")?.submenus.find(submenu => submenu.title === "Holiday");
    if (defaultSubMenu) {
    }
  }, []);

  // Function to handle submenu click
  const handleSubMenuClick = (title) => {
    setActiveSubMenu(prevTitle => (prevTitle === title ? null : title));
  };

  // Function to apply active styles to the submenu label
  const getSubMenuActiveStyle = (title) => {
    // Check if any submenu item of this menu is active
    const isActive = navigationLinks.find(item => item.title === title)?.submenus.some(submenu => location.pathname === submenu.urlLink);
    return isActive || activeSubMenu === title ? { backgroundColor: '#f0f0f0', fontWeight: 'bold' } : {};
  };

  // Function to apply active styles to the menu items
  const getActiveStyle = (urlLink) => {
    return location.pathname === urlLink ? { backgroundColor: '#dcdcdc', fontWeight: 'bold' } : {};
  };

  return (
    <div className={`sidebar sidebar-change`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img src={personsImgs.person_five} alt="profile" />
        </div>
        <span className="info-name">Nashik First</span>
      </div>

      <Sidebar>
        <Menu>
          {navigationLinks.map((item) => (
            <SubMenu
              key={item.id}
              label={item.title}
              open={activeSubMenu === item.title}
              onClick={() => handleSubMenuClick(item.title)}
              style={getSubMenuActiveStyle(item.title)} // Apply active style to the submenu
            >
              {item.submenus.map((data) => (
                <MenuItem
                  key={data.id}
                  style={getActiveStyle(data.urlLink)} // Apply active style to the menu item
                >
                  <Link style={{ color: "black", textDecoration: 'none' }} onClick={() => setTitles(data.title)} to={data.urlLink}>
                    {data.title}
                  </Link>
                </MenuItem>
              ))}
            </SubMenu>
          ))}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarMenu;
