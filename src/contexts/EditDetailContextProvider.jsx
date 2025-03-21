import React, {useState, createContext} from 'react'

export const EditDetailContext = createContext();

export default function EditDetailContextProvider({children}) {
  const [editDetails, setEditDetails] = useState({})

  return (
    <EditDetailContext.Provider value={{editDetails, setEditDetails}}>
        {children}
    </EditDetailContext.Provider>
  )
}
