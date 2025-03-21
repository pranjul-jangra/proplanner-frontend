import React, {createContext, useState} from 'react'

export const ModalsContext = createContext();

export default function ModalsContextProvider({children}) {

  const [modals, setModals] = useState({taskModal: false, updateProfileModal: false, deleteAccountModal: false, changeEmailModal: false, logoutModal: false, changePasswordModal: false, forgotPasswordModal: false});


  return (
    <ModalsContext.Provider value={{modals, setModals}}>
        {children}
    </ModalsContext.Provider>
  )
}
