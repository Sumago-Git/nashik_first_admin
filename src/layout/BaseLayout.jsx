import { Outlet } from "react-router-dom";
import { AreaTop, Sidebar } from "../components";
import { useState } from "react";
const BaseLayout = () => {

  const [buttonText, setButtonText] = useState("")
  const [tableView, setTableView] = useState()
  
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <Sidebar setButtonText={setButtonText} setTableView={setTableView}/>
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <AreaTop buttonValue={buttonText} tableView={tableView} />
        <Outlet />
      </div>
    </main>
  );
};

export default BaseLayout;
