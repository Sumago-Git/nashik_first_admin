////sos
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Leadership from "./screens/submenus/Leadership";
import Infrastructure from "./screens/submenus/Infrastructure";

import HeaderContact from "./screens/submenus/HeaderContact";
import Login from "./screens/submenus/Login";
import Office from "./screens/submenus/Office";
import Logout from "./screens/submenus/Logout";
import ProtectedRoutes from "./api/ProtectedRoutes";
import SocialContact from "./screens/submenus/SocialContact";
import AnnualReport from "./screens/submenus/AnnualReport";
import AnnualReturn from "./screens/submenus/AnnualReturn";
import ContactInfo from "./screens/submenus/ContactInfo";
import Holiday from "./screens/Masters/Holiday";
import TrafficAwarenessVideo from "./screens/submenus/TrafficAwarenessVideo";
import Bookings from "./screens/submenus/Bookings";
import Session from "./screens/Masters/Session";
import Slots from "./screens/submenus/Slots";
import Seats from "./screens/submenus/Seats";
import UpcommingEvents from "./screens/submenus/UpcommingEvents";
import PastEvents from "./screens/submenus/PastEvents";
import Calender from "./screens/submenus/Booking/Calender";
import Bookpackages from "./screens/Booking Packages/Bookpackages";
import Trainer from "./components/Trainer/Trainer";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
        <Route element={<BaseLayout />}>
          <Route
            path="/dashboard"
            element={<ProtectedRoutes Component={Dashboard} />}
          />
          <Route
            path="/infrastructure"
            element={<ProtectedRoutes Component={Infrastructure} />}
          />
          <Route
            path="/slots"
            element={<ProtectedRoutes Component={Slots} />}
          />
          <Route
            path="/session"
            element={<ProtectedRoutes Component={Session} />}
          />
          <Route
            path="/seat"
            element={<ProtectedRoutes Component={Seats} />}
          />
          <Route
            path="/bookings"
            element={<ProtectedRoutes Component={Bookings} />}
          />
          <Route
            path="/leadership"
            element={<ProtectedRoutes Component={Leadership} />}
          />
          <Route
            path="/headercontact"
            element={<ProtectedRoutes Component={HeaderContact} />}
          />
          <Route
            path="/calender"
            element={<ProtectedRoutes Component={Calender} />}
          />
          <Route
            path="/annualreport"
            element={<ProtectedRoutes Component={AnnualReport} />}
          />
          <Route
            path="/trinner"
            element={<ProtectedRoutes Component={Trainer} />}
          />
          <Route
            path="/annualreturn"
            element={<ProtectedRoutes Component={AnnualReturn} />}
          />
          <Route
            path="/social-contact"
            element={<ProtectedRoutes Component={SocialContact} />}
          />
          <Route
            path="/pastevents"
            element={<ProtectedRoutes Component={PastEvents} />}
          />
          <Route
            path="/upcommingevents"
            element={<ProtectedRoutes Component={UpcommingEvents} />}
          />
          <Route
            path="/bookpackg"
            element={<ProtectedRoutes Component={Bookpackages} />}
          />
          <Route
            path="/office"
            element={<ProtectedRoutes Component={Office} />}
          />
          <Route
            path="/trafficawarenessvideo"
            element={<ProtectedRoutes Component={TrafficAwarenessVideo} />}
          />
          <Route
            path="/holiday"
            element={<ProtectedRoutes Component={Holiday} />}
          />
          <Route
            path="/contactinfo"
            element={<ProtectedRoutes Component={ContactInfo} />}
          />
          <Route
            path="/logout"
            element={<ProtectedRoutes Component={Logout} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
