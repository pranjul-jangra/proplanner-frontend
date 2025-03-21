import React, { useRef, useState, useContext } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { LoaderContext } from '../contexts/LoaderContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import apiClient from '../axiosClient/apiClient';
import '../styles/resetpassword.css'

export default function ResetPassword() {

    let { token } = useParams();
    token = decodeURIComponent(token);
    const navigate = useNavigate();

    const { setIsLoaderActive } = useContext(LoaderContext);
    const {notifyUser} = useContext(NotifyContext);

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const buttonRef = useRef();
    const invalidMatchRef = useRef();

    const [passwordSvg, setpasswordSvg] = useState({openingEye: true, closingEye:false})
    const [confirmPasswordSvg, setConfirmPasswordSvg] = useState({openingEye: true, closingEye:false});


    async function handleSubmit (e) {
        e.preventDefault();

        if (!token) return notifyUser('Invalid reset link. Please try again.');

        const newPassword = passwordRef.current?.value.trim();
        if(newPassword === '') return notifyUser('Please enter a valid password');
        
        try {
          setIsLoaderActive(true);
          const response = await apiClient.post(`/reset-password`, { newPassword }, { headers: { Authorization: `Bearer ${token}` } });

          if(response.status === 200){
            localStorage.removeItem('proPlannerUsername');
            localStorage.removeItem('proPlannerAccessToken');
            notifyUser("Password updated successfully");
            navigate("/");
          }
            
        } catch (error) {
          notifyUser(
            typeof error.response?.data?.error === "string"
              ? error.response.data.error
              : JSON.stringify(error.response?.data?.error) || "An error occurred"
          );

        }finally {
          setIsLoaderActive(false);
        }
    };

    function handlePasswordMatching(){
      if(passwordRef.current.value && confirmPasswordRef.current.value){
          if(passwordRef.current.value !== confirmPasswordRef.current.value){
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



  return (
    <>
    <main className='resetpage'>
        <form aria-labelledby='create-a-new-password'>
          <h2 id='create-a-new-password'>Create a New Password</h2>
          <p>Make sure your new password is secure and something you'll remember!</p>

          <div className='password-div'>
            <input id='password' ref={passwordRef} type={passwordSvg.openingEye ? 'password' : 'text'} name='password' placeholder='Enter a strong password' minLength='8' required onChange={(e)=>{handlePasswordMatching()}} autoFocus aria-required={true} aria-label='Enter a strong password'/>
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

          <div className='password-div'>
            <input id='confirm-password' ref={confirmPasswordRef} type={confirmPasswordSvg.openingEye ? 'password' : 'text'} name='confirmPassword' placeholder='Re-enter your new password' minLength='8' required onChange={(e)=>{ handlePasswordMatching(); }} aria-required={true} aria-label='Re-enter your new password'/>
            <div>
                {
                    confirmPasswordSvg.openingEye && <svg onClick={()=>{setConfirmPasswordSvg({openingEye:false, closingEye:true})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Show password'>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                }
                {
                    confirmPasswordSvg.closingEye && <svg onClick={()=>{setConfirmPasswordSvg({openingEye:true, closingEye:false})}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label='Hide password'>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.43 18.43 0 0 1 3.17-4.88M9.88 9.88A3 3 0 0 1 12 9c1.66 0 3 1.34 3 3a3 3 0 0 1-.88 2.12M3 3l18 18"></path>
                    </svg>
                }
            </div>
          </div>

          <div className='invalidpasswordmatch' ref={invalidMatchRef}>Password should be same.</div>
          <button ref={buttonRef} type="submit" onClick={handleSubmit} aria-label='Save new password button'>Save New Password</button>

        </form>
    </main>
    </>
  )
}
