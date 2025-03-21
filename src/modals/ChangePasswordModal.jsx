import React, {useRef, useState, useContext} from 'react'
import { motion, AnimatePresence } from "motion/react"
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/changePassword.css'
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { ModalsContext } from '../contexts/ModalsContextProvider';


export default function ChangePasswordModal() {

    const { notifyUser } = useContext(NotifyContext);
    const {modals, setModals} = useContext(ModalsContext);

    const cpNewRef = useRef();
    const cpConfirmRef = useRef();
    const cpCurrentRef =  useRef();
    const buttonRef = useRef();
    const invalidMatchRef = useRef();

    const [cpNewSvg, setCpNewSvg] = useState({openingEye: true, closingEye:false})
    const [cpConfirmSvg, setCpConfirmSvg] = useState({openingEye: true, closingEye:false});
    const [cpCurrentSvg, setCpCurrentSvg] = useState({openingEye: true, closingEye:false});
    const [passwords, setPasswords] = useState({currentPassword: '', newPassword: '', confirmPassword: ''});


    function handlePasswordMatching(){
      if(cpNewRef.current.value && cpConfirmRef.current.value){

          if(cpNewRef.current.value !== cpConfirmRef.current.value){
              buttonRef.current.disabled = true;
              buttonRef.current.style.cursor = 'not-allowed';
              invalidMatchRef.current.style.display = 'block'
          }else{
              buttonRef.current.disabled = false;
              buttonRef.current.style.cursor = 'default'
              invalidMatchRef.current.style.display = 'none'
          }

      }else{
          buttonRef.current.disabled = false;
          buttonRef.current.style.cursor = 'default'
          invalidMatchRef.current.style.display = 'none'
      }
    }
    
    async function handleChangePassword(e){
      e.preventDefault();
      try{
        const user = localStorage.getItem('proPlannerUsername');
        const response = await apiClient.patch(`/home/settings/update-password`, { user, passwords });

        if(response.status === 200){
          notifyUser("Password changed successfully");
          setModals({...modals, changePasswordModal: false});
          setPasswords({currentPassword: '', newPassword: '', confirmPassword: ''});
        }

      }catch(error){
        notifyUser(
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response?.data?.error) || "Failed to change password. Please try again"
        );
      }
    }



  return (
      <AnimatePresence>
        {modals.changePasswordModal && <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        className='changePasswordModal'>

          <motion.form 
          initial={{ opacity: 0, scale: 0.7, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby='change-password'>


            <button type='button' onClick={()=> {setModals({...modals, changePasswordModal: false}); setPasswords({currentPassword: '', newPassword: '', confirmPassword: ''})}} aria-label='Close button'>X</button>

            <h2 id='change-password'>Change Your Password</h2>

            <p>We recommend that you choose a strong password for better security.</p>

            <div className='password'>
                <input id='current-password' ref={cpCurrentRef} type={cpCurrentSvg.openingEye ? 'password' : 'text'} name='currentPassword' value={passwords.currentPassword} onChange={(e)=> setPasswords({...passwords, [e.target.name]: e.target.value.trim()})} placeholder='Current Password' minLength='8' required autoFocus aria-required={true} aria-label='Enter your current password'/>
                <div>
                    {
                        cpCurrentSvg.openingEye && <svg onClick={()=>{setCpCurrentSvg({openingEye:false, closingEye:true})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Show password'>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    }
                    {
                        cpCurrentSvg.closingEye && <svg onClick={()=>{setCpCurrentSvg({openingEye:true, closingEye:false})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Hide password'>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.43 18.43 0 0 1 3.17-4.88M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.88 2.12M3 3l18 18"></path>
                        </svg>
                    }
                </div>
            </div>

            <div className='password'>
                <input id='new-password' ref={cpNewRef} type={cpNewSvg.openingEye ? 'password' : 'text'} name='newPassword' placeholder='New Password' minLength='8' value={passwords.newPassword} onChange={(e)=> {handlePasswordMatching(e); setPasswords({...passwords, [e.target.name]: e.target.value.trim()})}} required aria-required={true} aria-label='Enter new password'/>
                <div>
                    {
                        cpNewSvg.openingEye && <svg onClick={()=>{setCpNewSvg({openingEye:false, closingEye:true})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Show password'>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    }
                    {
                        cpNewSvg.closingEye && <svg onClick={()=>{setCpNewSvg({openingEye:true, closingEye:false})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Hide password'>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.43 18.43 0 0 1 3.17-4.88M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.88 2.12M3 3l18 18"></path>
                        </svg>
                    }
                </div>
            </div>

            <div className='password'>
                <input id='confirm-password' ref={cpConfirmRef} type={cpConfirmSvg.openingEye ? 'password' : 'text'} name='confirmPassword' placeholder='Confirm New Password' minLength='8' value={passwords.confirmPassword} onChange={(e)=> {handlePasswordMatching(e); setPasswords({...passwords, [e.target.name]: e.target.value.trim()})}} required aria-required={true} aria-label='Re-enter your new password'/>
                <div>
                    {
                        cpConfirmSvg.openingEye && <svg onClick={()=>{setCpConfirmSvg({openingEye:false, closingEye:true})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Show password'>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    }
                    {
                        cpConfirmSvg.closingEye && <svg onClick={()=>{setCpConfirmSvg({openingEye:true, closingEye:false})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Hide password'>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.43 18.43 0 0 1 3.17-4.88M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.88 2.12M3 3l18 18"></path>
                        </svg>
                    }
                </div>
            </div>

            <div className='invalidpasswordmatch' ref={invalidMatchRef}>Password should be same.</div>

            <div>
              <span className='forgetpassword' onClick={()=> setModals({...modals, forgotPasswordModal: true, changePasswordModal: false})} aria-label='Forgot password button'>Forgot Password</span>
            </div>

            <button type='submit' ref={buttonRef} onClick={handleChangePassword} aria-label='Change my password'>Change password</button>
            

          </motion.form>

        </motion.div>}
      </AnimatePresence>
  )
}
