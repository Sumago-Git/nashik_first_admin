

////sos
////logout without logout api . remove token
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { confirmAlert } from "react-confirm-alert";
// import "react-confirm-alert/src/react-confirm-alert.css";

// const Logout = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       localStorage.removeItem("accessToken");
//       toast.success("Logged out successfully.");
//     } 
//     navigate("/");
//   }, [navigate]);

//   return null;
// };

// export default Logout;

////confirmaiton
import { useCallback ,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <div
          style={{
            textAlign: "left",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(5, 5, 5, 0.2)",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to log out?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "20px",
            }}
          >
            <button
              style={{ marginRight: "10px" }}
              className="btn btn-primary"
              onClick={() => {
                const token = localStorage.getItem("accessToken");
                if (token) {
                  localStorage.removeItem("accessToken");
                  toast.success("Logged out successfully.");
                }
                navigate("/");
                onClose();
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                navigate("/headercontact");
                onClose();
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
    });
  }, [navigate]);

  
  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return null;
};

export default Logout;