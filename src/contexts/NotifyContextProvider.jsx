import React, { useRef, createContext } from 'react'
import '../styles/notifycontext.css'

export const NotifyContext = createContext();

export default function NotifyContextProvider({ children }) {
    const notifyRef = useRef(); 
    let timeoutId; // Track the timeout for clearing

    function notifyUser(message) {
        // Clear any previous timeout
        if (timeoutId) clearTimeout(timeoutId);

        notifyRef.current.style.transition = 'none'; // Disable transition temporarily
        notifyRef.current.style.transform = 'translateY(-200%) translateX(-50%) scaleX(0.3)';
        notifyRef.current.style.opacity = 0;

        // Wait for the next frame to reanimate
        requestAnimationFrame(() => {
            notifyRef.current.innerText = message;

            notifyRef.current.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            notifyRef.current.style.transform = 'translateY(0) translateX(-50%) scaleX(1)';
            notifyRef.current.style.opacity = 1;
        });

        // Hide notification after 4.5 seconds
        timeoutId = setTimeout(() => {
            notifyRef.current.style.transform = 'translateY(-200%) translateX(-50%) scaleX(0.3)';
            notifyRef.current.style.opacity = 0;
        }, 4500);
    }

    return (
        <>
            <section ref={notifyRef} id="notify-user">Please enter valid details...</section>
            <NotifyContext.Provider value={{ notifyUser }}>
                {children}
            </NotifyContext.Provider>
        </>
    );
}
