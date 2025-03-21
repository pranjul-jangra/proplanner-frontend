import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css'
import FallbackElement from './components/FallbackElement';

const Home = lazy(() => import('./layouts/Home'));
const Authentication = lazy(() => import('./layouts/Authentication'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const Settings = lazy(() => import('./layouts/Settings'));


export default function App() {
  return (
    <Router>
      <Suspense fallback={<FallbackElement />}>
        <Routes>
          <Route path='/' element={ <Authentication/> } />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/home' element={ <Home/> } />
          <Route path='/home/settings' element={ <Settings/> } />
        </Routes>
      </Suspense>
    </Router>
  )
}
