import "./Content.css";
import ContentTop from '../../components/ContentTop/ContentTop';
import { Route, Routes } from "react-router-dom";
import LearnerLicense from "../../Screens/Training/Learner-driving-license";
import SuspendedLicense from "../../Screens/Training/Suspended-driving-license";
import SchoolBusDriverTraining from "../../Screens/Training/Training-for-school-bus-driver";
import SchoolStudentTraining from "../../Screens/Training/School-students-training-group";
import CollegeOrgTrainingGroup from "../../Screens/Training/College-organization-training–group";
import CollegeOrgTrainingIndivisual from "../../Screens/Training/College-organization-training–indivisual";
import HomeCounter from "../../ScreenComponents/HomeComponents/HomeCounter";

const Content = ({ title }) => {

  return (
    <div className={`${window.innerWidth > 1200 ? 'main-content' : 'main-content1'}`}>
      <ContentTop title={title ? title : "Holiday"}/>
      <Routes>
        <Route path="/counter" Component={HomeCounter} />
        <Route path="/learner-driving-license-holder-training" Component={LearnerLicense} />
        <Route path="/suspended-driving-license-holders-training" Component={SuspendedLicense} />
        <Route path="/training-for-school-bus-driver" Component={SchoolBusDriverTraining} />
        <Route path="/school-students-training-group" Component={SchoolStudentTraining} />
        <Route path="/college-organization-training–group" Component={CollegeOrgTrainingGroup} />
        <Route path="/college-organization-training–individual" Component={CollegeOrgTrainingIndivisual} />
      </Routes>
    </div>
  )
}

export default Content
