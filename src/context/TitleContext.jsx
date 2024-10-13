
////sos

import { createContext, useState } from "react"

const TitleContext = createContext()

const TitleData = ({ children }) => {
    const [title, setTitle] = useState("")
    return (
        <TitleContext.Provider value={{ title, setTitle }}>
            {children}
        </TitleContext.Provider>
    )
}

export { TitleData, TitleContext }