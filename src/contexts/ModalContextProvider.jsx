import React, { createContext, useState } from 'react'

export const ModalContext = createContext();

export default function ModalContextProvider({children}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
  return (
    <ModalContext.Provider value={{isModalOpen, setIsModalOpen}}>
        {children}
    </ModalContext.Provider>
  )
}
