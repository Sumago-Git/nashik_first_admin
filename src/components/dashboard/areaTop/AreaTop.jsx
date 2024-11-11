// // // ////sir code
import { useContext, useEffect, useRef, useState } from "react";
import { SidebarContext } from "../../../context/SidebarContext";
import { TitleContext } from "../../../context/TitleContext";
import { ShowContext } from "../../../context/ShowContext";
import { Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { addDays } from "date-fns";

import "./AreaTop.scss";

const AreaTop = ({ buttonValue, tableView }) => {

  const { openSidebar, activeMenuName } = useContext(SidebarContext);
  const [headerName, setHeader] = useState("");
  const { title, setTitle } = useContext(TitleContext);
  const { toggleShows } = useContext(ShowContext);
  const [buttonText, setButtonText] = useState("View");
  const dateRangeRef = useRef(null);
  const location = useLocation();

  const handleClickOutside = (event) => {
    if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    setTitle(activeMenuName);
  }, [activeMenuName, setTitle]);

  const handleButtonClick = () => {
    toggleShows();
    setButtonText((prevText) => (prevText === "View" ? "Add" : "View"));
  };

  const hiddenPaths = [
    "/subscribe",
    "/carousalform",
    "/requestcallbackform",
    "/uploadcv",
    "/getintouch",
    "/subscribe",
    "/headercontact",
    "/testimonial",
    "/headercontact",
    "/homeslider",
    "/carousal",
    "/infrastructure",
    "/ourteam",
    "/leadership",
    "/productname",
    "/productdetails",
    "/technicaldata",
    "/optionsdata",
    "/materialdata",
    "/blogdetails",
    "/applicationdata",
    "/uploadcv",
    "/subscribe",
    "/getintouch",
    "/office",
    "/contactsalesperson",
    "/events",
    "/news",
    "/productimages",
    "/social-contact",
    "/leadership",
    "/about",
    "/annualreport",
    "/annualreturn",
    "/contactinfo",
    "/holiday",
    "/pastevents",
    "/upcommingevents",
    "/slots",
    "/bookings",
    "/seat",
    "/trafficawarenessvideo",
    "/calender",
    "/bookpackg",
    "/thanksto",
    "/homebanner",
    "/objective-of-anf",
    "/photo-gallary",
    "/home-counter",
    "/directors",
    "/follow-on-us",
    "/news",
    "/home-videos",
    "/trainer"
  ];
  const isHiddenPath = hiddenPaths.includes(location.pathname);

  useEffect(() => {
    if (window.location.pathname == "/testimonial") {
      setHeader("Testimonial");
    } else if (window.location.pathname == "/headercontact") {
      setHeader("Header Contact");
    } else if (window.location.pathname == "/homeslider") {
      setHeader("Image Slider");
    } 
    else if (window.location.pathname == "/news") {
      setHeader("News");
    }
    else if (window.location.pathname == "/home-videos") {
      setHeader("Home Video");
    }
    else if (window.location.pathname == "/homebanner") {
      setHeader("Home Banner");
    }
    else if (window.location.pathname == "/home-counter") {
      setHeader("Home Counter");
    }
    else if (window.location.pathname == "/directors") {
      setHeader("Directors");
    }
    else if (window.location.pathname == "/follow-on-us") {
      setHeader("Follow on Us");
    }
    else if (window.location.pathname == "/photo-gallary") {
      setHeader("Photo Gallary");
    }
    else if (window.location.pathname == "/objective-of-anf") {
      setHeader("Objective Of ANF");
    }
    else if (window.location.pathname == "/carousal") {
      setHeader("Home Sliding Media");
    } else if (window.location.pathname == "/leadership") {
      setHeader("Leadership");
    } else if (window.location.pathname == "/about") {
      setHeader("About");
    } else if (window.location.pathname == "/infrastructure") {
      setHeader("Infrastructure");
    } else if (window.location.pathname == "/ourteam") {
      setHeader("Our Team");
    } else if (window.location.pathname == "/annualreport") {
      setHeader("Annual Report");
    }
    else if (window.location.pathname == "/trainer") {
      setHeader("Trainer");
    }
    else if (window.location.pathname == "/annualreturn") {
      setHeader("Annual Return");
    }
    else if (window.location.pathname == "/social-contact") {
      setHeader("Social Contacts");
    } else if (window.location.pathname == "/productname") {
      setHeader("Product Name");
    } else if (window.location.pathname == "/productdetails") {
      setHeader("Product Details");
    } else if (window.location.pathname == "/technicaldata") {
      setHeader("Models");
    } else if (window.location.pathname == "/optionsdata") {
      setHeader("Accessories & Optional");
    } else if (window.location.pathname == "/materialdata") {
      setHeader("Material Data");
    } else if (window.location.pathname == "/blogdetails") {
      setHeader("Blog Details");
    } else if (window.location.pathname == "/news") {
      setHeader("News");
    } else if (window.location.pathname == "/events") {
      setHeader("Events");
    } else if (window.location.pathname == "/contactsalesperson") {
      setHeader("Contact Sales Person");
    } else if (window.location.pathname == "/office") {
      setHeader("Our Offices");
    } else if (window.location.pathname == "/carousalform") {
      setHeader("User Data List");
    }
    else if (window.location.pathname == "/pastevents") {
      setHeader("Past Events");
    }
    else if (window.location.pathname == "/upcommingevents") {
      setHeader("Upcomming Events");
    }
    else if (window.location.pathname == "/bookpackg") {
      setHeader("Booking Packages");
    }
     else if (window.location.pathname == "/requestcallbackform") {
      setHeader("Request Callback Form");
    } else if (window.location.pathname == "/office") {
      setHeader("Our Offices");
    } else if (window.location.pathname == "/calender") {
      setHeader("Calender");
    } else if (window.location.pathname == "/bookings") {
      setHeader("Bookings");
    } else if (window.location.pathname == "/contactinfo") {
      setHeader("Contact Details");
    } else if (window.location.pathname == "/getintouch") {
      setHeader("Get In Touch");
    } else if (window.location.pathname == "/subscribe") {
      setHeader("Subscriber List");
    } else if (window.location.pathname == "/uploadcv") {
      setHeader("Cv List");
    } else if (window.location.pathname == "/holiday") {
      setHeader("Holiday");
    } else if (window.location.pathname == "/slots") {
      setHeader("Slots");
    } else if (window.location.pathname == "/session") {
      setHeader("Sessions");
    } else if (window.location.pathname == "/seat") {
      setHeader("Seat Availability");
    } else if (window.location.pathname == "/applicationdata") {
      setHeader("Application Data");
    } else if (window.location.pathname == "/productimages") {
      setHeader("Product Images");
    }
    else if (window.location.pathname == "/thanksto") {
      setHeader("Thanks To ");
    }
    else if (window.location.pathname == "/trafficawarenessvideo") {
      setHeader("Our Video");
    }

  }, [window.location.pathname]);
  return (
    <section className="content-area-top bg-white p-3 mb-3">
      <div className="area-top-l">
        <button
          className="sidebar-open-btn"
          type="button"
          onClick={openSidebar}
        >
          <MdOutlineMenu size={24} />
        </button>
        <h2 className="area-top-title text-capitalize">{headerName}</h2>
      </div>
      <div className="area-top-r">
        {!isHiddenPath && (
          <Button onClick={handleButtonClick} variant="outline-danger">
            {buttonText}
          </Button>
        )}
      </div>
    </section>
  );
};

export default AreaTop;