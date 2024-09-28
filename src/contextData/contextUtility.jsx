import { createContext, useState } from "react"

const SideBarTitle = createContext()

const SideBarTitleData = ({ children }) => {
    const [titles, setTitle] = useState("false")
    return (
        <SideBarTitle.Provider value={{ titles, setTitle }}>
            {children}
        </SideBarTitle.Provider>
    )
}

export { SideBarTitle, SideBarTitleData }