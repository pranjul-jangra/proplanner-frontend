import React, {useContext} from 'react'
import '../styles/navigations.css'
import { ThemeContext } from '../contexts/ThemeContextProvider'
import { useNavigate } from 'react-router-dom';

export default function Navigations() {
  const navigate = useNavigate();
  const {theme, setTheme} = useContext(ThemeContext);

  function handleThemeChange(e){
    const newTheme = e.target.dataset.theme;
    setTheme(newTheme)
    localStorage.setItem('todo-theme', newTheme);
  }

  return (
    <nav className={`navigations ${theme}`} aria-label="Navigation bar">
        <div className="theme-selector">
            <div>Theme: </div>
            <button type='button' onClick={handleThemeChange} aria-label="Switch to Pink Theme" data-theme='pink' style={{'--accent-color': 'pink'}}></button>
            <button type='button' onClick={handleThemeChange} aria-label="Switch to light Theme" data-theme='light' style={{'--accent-color': 'aliceblue'}}></button>
            <button type='button' onClick={handleThemeChange} aria-label="Switch to dark Theme" data-theme='dark' style={{'--accent-color': 'black'}}></button>
            <button type='button' onClick={handleThemeChange} aria-label="Switch to lightgreen Theme" data-theme='lightgreen' style={{'--accent-color': 'lightgreen'}}></button>
        </div>
        <button type='button' aria-label="Go to settings page" onClick={()=> navigate('/home/settings')}>Settings</button>
    </nav>
  )
}
