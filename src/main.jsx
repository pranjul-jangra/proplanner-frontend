import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ThemeContextProvider from './contexts/ThemeContextProvider';
import ModalContextProvider from './contexts/ModalContextProvider';
import LoaderContextProvider from './contexts/LoaderContextProvider';
import NotifyContextProvider from './contexts/NotifyContextProvider';
import EditDetailContextProvider from './contexts/EditDetailContextProvider';
import ModalsContextProvider from './contexts/ModalsContextProvider';
import OtpGenerationContextProvider from './contexts/OtpGenerationContextProvider';


createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ThemeContextProvider>
        <LoaderContextProvider>
          <ModalsContextProvider>
            <OtpGenerationContextProvider>
              <EditDetailContextProvider>
                <NotifyContextProvider>
                  <ModalContextProvider>
                    <App />
                  </ModalContextProvider>
                </NotifyContextProvider>
              </EditDetailContextProvider>
            </OtpGenerationContextProvider>
          </ModalsContextProvider>
        </LoaderContextProvider>
      </ThemeContextProvider> 
  </StrictMode>,
)
