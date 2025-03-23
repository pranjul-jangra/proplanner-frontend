import React, {useRef, useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react"
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/deleteAccount.css'
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { ModalsContext } from '../contexts/ModalsContextProvider';
import { LoaderContext } from '../contexts/LoaderContextProvider';


export default function DeleteAccountModal() {
    const navigate = useNavigate();

    const passwordRef = useRef();

    const { notifyUser } = useContext(NotifyContext);
    const {modals, setModals} = useContext(ModalsContext);
    const {setIsLoaderActive} = useContext(LoaderContext);

    const [passwordSvg, setpasswordSvg] = useState({openingEye: true, closingEye:false});


    async function handleDeleteAccount(e){
      e.preventDefault();
      const username = localStorage.getItem('proPlannerUsername');

      const password = passwordRef.current.value;
      if(password.length < 8 ) return notifyUser("Your password must be at least 8 characters long");
 
      try{
        setIsLoaderActive(true);
        const response = await apiClient.post('/home/settings/delete-account', {username, password})
        
        if(response.status === 200){
          setModals({...modals, deleteAccountModal: false});
          localStorage.removeItem('proPlannerUsername');
          localStorage.removeItem('proPlannerAccessToken');
          localStorage.removeItem('proPlannerDeviceId');
          localStorage.removeItem('otpGeneratedTime');
          
          navigate('/');
        }

      }catch(error){
        notifyUser(
          typeof error.response?.data?.error === "string"
            ? error.response.data.error
            : JSON.stringify(error.response?.data?.error) || "Error Deleting Account. Please try again later"
        );
      }finally{
        setIsLoaderActive(false);
      }
    }


  return (
      <AnimatePresence>
        {
          modals.deleteAccountModal && <motion.section
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.3, ease: 'easeOut'}}
          className='deleteAccountModal'>

            <motion.div
            initial={{ opacity: 0, scale: 0.7, y: -80 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: -80 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            aria-labelledby='delete-account'>

              <button type='button' onClick={()=> setModals({...modals, deleteAccountModal: false})} aria-label='Close button'>X</button>

              <h2 id='delete-account'>Delete Your Account</h2>

              <div className="text-content">
                <p>We're sorry to see you go.</p>
                <p>Thank you for being a part of our journey.</p>
                <p>Please confirm your password to continue.</p>
              </div>

              <div className='password'>
                <input id='password' ref={passwordRef} type={passwordSvg.openingEye ? 'password' : 'text'} name='password' placeholder='Password' minLength='8' required autoFocus aria-required={true} aria-label='Enter your password'/>
                <div>
                    {
                      passwordSvg.openingEye && <svg onClick={()=>{setpasswordSvg((prev) => ({openingEye: !prev.openingEye,closingEye: !prev.closingEye}))}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Show password'>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    }
                    {
                      passwordSvg.closingEye && <svg onClick={()=>{setpasswordSvg((prev) => ({openingEye: !prev.openingEye,closingEye: !prev.closingEye}))}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Hide password'>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.43 18.43 0 0 1 3.17-4.88M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.88 2.12M3 3l18 18"></path>
                      </svg>
                    }
                </div>
              </div>
              
              <button type='submit' onClick={handleDeleteAccount} aria-label='Delete my account'>Delete My Account</button>

            </motion.div>

          </motion.section>
        }
      </AnimatePresence>
  )
}
