import './App.css';
import SidebarMenu from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import { useState } from 'react';
import { SideBarTitleData } from './contextData/contextUtility';
function App() {
  const [title, setTitle] = useState("")

  return (
    <>
    <SideBarTitleData>
      <div className='app'>
        <SidebarMenu setTitles={(setTitle)} />
        <Content title={title}/>
      </div>
      </SideBarTitleData>
    </>
  )
}

export default App
