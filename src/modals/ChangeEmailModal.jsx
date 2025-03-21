import React, {useState, useEffect, useContext, useRef} from 'react'
import { motion, AnimatePresence } from "motion/react"
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/changeEmail.css'
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { ModalsContext } from '../contexts/ModalsContextProvider';
import { OtpGenerationContext } from '../contexts/OtpGenerationContextProvider';


export default function ChangeEmailModal({userProfile, fetchUser}) {

    const { notifyUser } = useContext(NotifyContext);
    const {modals, setModals} = useContext(ModalsContext);
    const { handleGenerateOtp, isResending, isOtpVerified, setIsOtpVerified, countDown, setCountdown, isRunning, setIsRunning, verificationCodes, setVerificationCodes } = useContext(OtpGenerationContext);

    const otpVerificationTimeoutRef = useRef(null);

    const [newEmail, setNewEmail] = useState('');


    useEffect(() => {
      if (isRunning && countDown > 0) {
        const timer = setInterval(() => {
          setCountdown((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer);
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
    
        return () => clearInterval(timer);
      }
    }, [isRunning, countDown]); 



    // VALIDATE AND AUTO-FOCUS INPUT FIELD'S
    function handleInputOtp(e){
        const { name, value } = e.target;
        const regex = /^[0-9]$/;
        if (value && !regex.test(value)) return;
    
        setVerificationCodes(prev => ({...prev, [name]: value}));
    

        if (value) {
          const inputs = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
          const currentIndex = inputs.indexOf(name);
          const nextInput = inputs[currentIndex + 1];
          
          if (nextInput) {
            const nextElement = document.querySelector(`input[name='${nextInput}']`);
            if (nextElement) nextElement.focus();
          } else {
            document.querySelector('button[type="submit"]').focus();
          }
        }
    }


    // VERIFY OTP
    async function verifyOtp() {
        const otpValue = Object.values(verificationCodes).join('');
        
        if (otpValue.length !== 6) {
          return notifyUser("Please enter the complete 6-digit OTP");
        }
        
        try {
          const response = await apiClient.post(`/home/settings/verify-otp`, {
            email: userProfile.email,
            otp: otpValue
          });
          
          if (response.status === 200) {
            setIsOtpVerified(true);
            notifyUser("OTP verified successfully");
    
            if (otpVerificationTimeoutRef.current) {
              clearTimeout(otpVerificationTimeoutRef.current);
            }
            
            otpVerificationTimeoutRef.current = setTimeout(() => {
              setIsOtpVerified(false);
              setVerificationCodes({ first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' });
              notifyUser("The time limit to update your email has expired. Please request a new OTP to proceed.");
            }, 2 * 60 * 1000);
            
          }
        } catch (error) {
          notifyUser(
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response?.data?.error) || "Invalid OTP. Please try again."
          );
          setVerificationCodes({ first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' });
        }
    }


    // CHANGE THE EMAIL
    async function handleEmailChange(){
        try{
          const response = await apiClient.patch(`/home/settings/update-email`, {currentEmail: userProfile.email, newEmail});
    
          if(response.status === 200){
            setIsOtpVerified(false);
    
            setCountdown(90);
            setIsRunning(false);
    
            notifyUser(
              typeof error.response?.data?.error === "string"
                ? error.response.data.error
                : JSON.stringify(error.response?.data?.error) || "Email updated successfully"
            );
            setModals({...modals, changeEmailModal: false});
    
            if(otpVerificationTimeoutRef.current){
              clearTimeout(otpVerificationTimeoutRef.current);
            }
    
            await fetchUser();
          }
    
        }catch(error){
          notifyUser(
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response?.data?.error) || "Failed to update email. Please try again"
          );
        }
    }


  return (
      <AnimatePresence>
        {
          modals.changeEmailModal && <motion.section 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3, ease: 'easeOut'}}
          className='changeEmailModal'>

            { 
            !isOtpVerified && <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -80 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-labelledby='change-email'>

              <button type='button' onClick={()=> setModals({...modals, changeEmailModal: false})} aria-label='Close button'>X</button>

              <h2 id='change-email'>Change Your Email</h2>
              <p>Enter the verification code sent to your email.</p>

              <div>
                <input type="text" name='first' value={verificationCodes.first} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' autoFocus aria-label='OTP input 1'/>
                <input type="text" name='second' value={verificationCodes.second} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' aria-label='OTP input 2'/>
                <input type="text" name='third' value={verificationCodes.third} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' aria-label='OTP input 3'/>
                <input type="text" name='fourth' value={verificationCodes.fourth} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' aria-label='OTP input 4'/>
                <input type="text" name='fifth' value={verificationCodes.fifth} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' aria-label='OTP input 5'/>
                <input type="text" name='sixth' value={verificationCodes.sixth} onChange={handleInputOtp} pattern="[0-9]" inputMode="numeric" maxLength='1' aria-label='OTP input 6'/>
              </div>

              <div>
                <button type='button' onClick={()=> { handleGenerateOtp(true, userProfile, notifyUser) } } disabled={countDown > 0 || isResending} aria-label='Resend otp'>{isResending ? "Sending..." : "Resend OTP"}</button>
                <span>{Math.floor(countDown / 60)}:{String(countDown % 60).padStart(2, "0")}</span>
              </div>

              <button type='submit' onClick={verifyOtp} aria-label='Verify OTP'>Verify OTP</button>

            </motion.div>
            }
            
            {
              isOtpVerified && <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -80 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className='newEmailInputModal'
              aria-labelledby='change-email'>
  
                <button type='button' onClick={()=> setModals({...modals, changeEmailModal: false})} aria-label='Close button'>X</button>

                <h2 id='change-email'>Change Your Email</h2>
                <p>Current email: {userProfile.email}</p>

                <input type="email" name='email' value={newEmail} onChange={(e)=>{ setNewEmail(e.target.value); }} placeholder='New email' aria-required={true} aria-label='Enter your new email' autoFocus/>

                <button type='submit' onClick={handleEmailChange} aria-label='Change email'>Change email</button>
  
              </motion.div>
            }

          </motion.section>
        }
      </AnimatePresence>
  )
}
