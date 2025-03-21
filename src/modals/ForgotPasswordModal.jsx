import React, {useContext, useRef} from 'react'
import { motion, AnimatePresence } from "motion/react"
import { ModalsContext } from '../contexts/ModalsContextProvider';
import { LoaderContext } from '../contexts/LoaderContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/forgotPassword.css'

export default function ForgotPasswordModal() {

    const {modals, setModals} = useContext(ModalsContext);
    const {setIsLoaderActive} = useContext(LoaderContext);
    const {notifyUser} = useContext(NotifyContext);

    const modalEmailRef = useRef();

    async function handleGenerateLink(e){
        e.preventDefault();
        e.stopPropagation();
        
        try{
          if(modalEmailRef.current.value.trim() === '') return notifyUser("Please enter your email");
          
          setIsLoaderActive(true);
          const response = await apiClient.post(`/forgot-password`, { email: modalEmailRef.current.value.trim()});
          
          if(response.status === 200){
            notifyUser('Reset link sent to your email address');
            setModals({...modals, forgotPasswordModal: false});
          }
    
        }catch(error){
          notifyUser(error.response?.data?.error || "Your request can't be completed. Please try again later.");
    
        }finally{
          setIsLoaderActive(false);
        }
    }

  return (
    <AnimatePresence>
                {
                    modals.forgotPasswordModal && <motion.section 
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.3, ease: 'easeOut'}}
                    className='forgotPasswordModal'>
    
                    <motion.div 
                    initial={{ opacity: 0, scale: 0.7, y: -80 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.7, y: -80 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={(e) => e.stopPropagation()}>
    
                        <button type='button' onClick={()=> setModals({...modals, forgotPasswordModal: false})} aria-label='Close modal'>X</button>
    
                        <h2 id='reset-password'>Reset Password</h2>
                        <p>Enter your email to receive a reset link. </p>
    
                        <form aria-labelledby='reset-password'>
                            <input ref={modalEmailRef} type="email" placeholder='Your email' autoFocus required aria-required="true" aria-label='Enter your email'/>
                            <button type='submit' onClick={handleGenerateLink} aria-label='Send password reset link'>Send Reset Link</button>
                        </form>
    
                        <p>If you don't receive an email within a few minutes, check your spam folder or try again.</p>
    
                    </motion.div>
    
                    </motion.section>
                }
            </AnimatePresence>
  )
}
