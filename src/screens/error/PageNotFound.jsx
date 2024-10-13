import React from "react";
import notFoundImage from "../../assets/images/404-plain.jpg";
const PageNotFound = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <img src={notFoundImage} alt="Page Not Found" />
    </div>
  );
};
export default PageNotFound;
