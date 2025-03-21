import React, {createContext, useState} from 'react'
import apiClient from '../axiosClient/apiClient';

export const OtpGenerationContext = createContext();

export default function OtpGenerationContextProvider({children}) {


    const [isResending, setIsResending] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [countDown, setCountdown] = useState(90);
    const [isRunning, setIsRunning] = useState(false);
    const [verificationCodes, setVerificationCodes] = useState({ first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' });


    async function handleGenerateOtp(forceOtpGeneration = false, userProfile, notifyUser){
        if (isResending || !userProfile?.email) return;
        if (isOtpVerified)  return;
    
        setIsResending(true);
    
        setVerificationCodes({ first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' })
    
        try{
          const response = await apiClient.post(`/home/settings/generate-otp`, { email: userProfile.email, forceOtpGeneration: forceOtpGeneration });
          
          if (response.status === 200) {
            setCountdown(90);
            setIsRunning(true);
            notifyUser("OTP sent to your email");
          }
    
        }catch(error){
          console.log("OTP generation error:", error.response?.data);
    
          // If we receive a 429 error (too many requests)
          if (error.response?.status === 429 && error.response?.data?.resendCountdown) {
            const serverTime = parseInt(error.response.data.resendCountdown);
            const currentTime = Date.now();
            const remainingTime = Math.max(0, Math.floor((serverTime - currentTime) / 1000));
            
            console.log("Server time:", serverTime);
            console.log("Current time:", currentTime);
            console.log("Remaining time:", remainingTime);
            
            setCountdown(remainingTime);
            setIsRunning(true);
            return;
          }

          setCountdown(0);
          setIsRunning(false);
          
          notifyUser(error.response?.data?.error || "Failed to generate OTP");
    
        }finally {
          setIsResending(false);
        }
    };


  return (
    <OtpGenerationContext.Provider 
    value={{ 
        handleGenerateOtp , 
        isResending, setIsResending, 
        isOtpVerified, setIsOtpVerified, 
        countDown, setCountdown, 
        isRunning, setIsRunning, 
        verificationCodes, setVerificationCodes }}>

        {children}

    </OtpGenerationContext.Provider>
  )
}
