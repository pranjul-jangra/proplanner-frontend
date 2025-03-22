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

        const otpGeneratedTime = parseInt(localStorage.getItem('otpGeneratedTime')) || 0;
        const expiryTime = otpGeneratedTime + 15 * 60 * 1000;
        const otpIsStillValid = expiryTime > Date.now();
        
        if (otpIsStillValid && !forceOtpGeneration) {
          const cooldownTime = otpGeneratedTime + 90 * 1000;
          const remainingSeconds = Math.ceil((cooldownTime - Date.now()) / 1000);
          setCountdown(remainingSeconds);
          setIsRunning(true);
          return notifyUser('Please enter the otp sent to your email');
        }
    
        setIsResending(true);
        setVerificationCodes({ first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' })
    
        try{
          const response = await apiClient.post(`/home/settings/generate-otp`, { email: userProfile.email });
          
          if (response.status === 200) {
            setCountdown(90);
            setIsRunning(true);
            const otpGeneratedTime = Date.now();
            localStorage.setItem('otpGeneratedTime', otpGeneratedTime);
            notifyUser("OTP sent to your email");
          }
    
        }catch(error){
          setCountdown(0);
          setIsRunning(false);
          
          notifyUser(
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response?.data?.error) || "An error occurred"
          );
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
