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
import Thanksto from "./components/ThanksTo/Thanksto";
import Homebanner from "./components/HomeBanner/Homebanner";
import ObjectiveofAnf from "./components/Objective of ANF/ObjectiveofAnf";
import PhotoGallary from "./components/PhotoGallary/PhotoGallary";
import HomeCounter from "./components/Home Counter/HomeCounter";
import Directors from "./components/Directors/Directors";
import FollowonUs from "./components/Follow on us/FollowonUs";
import News from "./components/News/News";
import HomeVideos from "./components/Home Videos/HomeVideos";
import ConatctFrom from "./components/Contact From/ConatctFrom";
import bookingcatname from "./screens/Booking Packages/bookingcatname";
import Slotlistpage from "./screens/Booking Packages/Slotlistpage";
import Bookcalender from "./screens/Booking Packages/Bookcalender";
import CalenderComp from "./components/Calender Component/CalenderComp";

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
            path="/homebanner"
            element={<ProtectedRoutes Component={Homebanner} />}
          />
          <Route
            path="/objective-of-anf"
            element={<ProtectedRoutes Component={ObjectiveofAnf} />}
          />
          <Route
            path="/infrastructure"
            element={<ProtectedRoutes Component={Infrastructure} />}
          />
          <Route
            path="/photo-gallary"
            element={<ProtectedRoutes Component={PhotoGallary} />}
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
            path="/CalenderComp"
            element={<ProtectedRoutes Component={CalenderComp} />}
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
            path="/conact-form"
            element={<ProtectedRoutes Component={ConatctFrom} />}
          />
          <Route
            path="/trainer"
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
            path="/home-counter"
            element={<ProtectedRoutes Component={HomeCounter} />}
          />
          <Route
            path="/directors"
            element={<ProtectedRoutes Component={Directors} />}
          />
          <Route
            path="/follow-on-us"
            element={<ProtectedRoutes Component={FollowonUs} />}
          />
          <Route
            path="/news"
            element={<ProtectedRoutes Component={News} />}
          />
          <Route
            path="/home-videos"
            element={<ProtectedRoutes Component={HomeVideos} />}
          />
          <Route
            path="/thanksto"
            element={<ProtectedRoutes Component={Thanksto} />}
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
            path="/Bookcalender"
            element={<ProtectedRoutes Component={Bookcalender} />}
          />
          <Route
            path="/Slotlistpage"
            element={<ProtectedRoutes Component={Slotlistpage} />}
          />
          <Route
            path="/bookseats"
            element={<ProtectedRoutes Component={bookingcatname} />}
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
