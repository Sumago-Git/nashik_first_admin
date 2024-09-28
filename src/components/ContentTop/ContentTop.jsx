import { useContext, useEffect, useState } from "react";
import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { AiOutlineMenu } from "react-icons/ai";
const ContentTop = ({ title }) => {
  const [toggleValue, setToggleValue] = useState(false); // Initial value is false
  console.log("toggleValue", toggleValue);
  
  const handleToggle = () => {
    const newValue = !toggleValue; // Get the opposite of the current value
    setToggleValue(newValue); 
  };

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        {/* <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar() }>
                <img src={ iconsImgs.menu } alt="" />
            </button> */}
        <h3 className="content-top-title">{title}</h3>
      </div>
      <div className="content-top-btns">
        <span className="">
          <button onClick={handleToggle} class="px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300">
            view
          </button>
        </span>
      </div>
    </div>
  )
}

export default ContentTop
