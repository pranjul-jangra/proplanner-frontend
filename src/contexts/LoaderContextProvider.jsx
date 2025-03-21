import React, {createContext, useState} from 'react'
import '../styles/loader.css'

export const LoaderContext = createContext();

export default function LoaderContextProvider({children}) {
  const [isLoaderActive, setIsLoaderActive] = useState(false);
    
  return (
    <>
    <section onClick={e => e.stopPropagation()} className={`loader ${isLoaderActive ? 'active' : 'notActive'}`}>
      <div></div>
      <div></div>
      <div></div>
    </section>  
    <LoaderContext.Provider value={{isLoaderActive, setIsLoaderActive}} >
        {children}
    </LoaderContext.Provider>
    </>
  )
}
