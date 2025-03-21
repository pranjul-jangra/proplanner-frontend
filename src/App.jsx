import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './app.css'
import FallbackElement from './components/FallbackElement';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./layouts/Home'));
const Authentication = lazy(() => import('./layouts/Authentication'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const Settings = lazy(() => import('./layouts/Settings'));


export default function App() {
  return (
    <Router>
      <Suspense fallback={ <FallbackElement /> }>
        <Routes>
          <Route path='/' element={ <ErrorBoundary> <Authentication/> </ErrorBoundary> } />
          <Route path="/reset-password/:token" element={ <ErrorBoundary> <ResetPassword /> </ErrorBoundary> } />
          <Route path='/home' element={ <ErrorBoundary> <Home/> </ErrorBoundary> } />
          <Route path='/home/settings' element={ <ErrorBoundary> <Settings/> </ErrorBoundary> } />
        </Routes>
      </Suspense>
    </Router>
  )
}
