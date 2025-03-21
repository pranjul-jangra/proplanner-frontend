import React, { useEffect ,useState, useRef, useContext, lazy } from 'react'
import { useNavigate } from 'react-router-dom';
import apiClient from '../axiosClient/apiClient';
import { LoaderContext } from '../contexts/LoaderContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import '../styles/authentication.css'
import { ModalsContext } from '../contexts/ModalsContextProvider';

const ForgotPasswordModal = lazy(()=> import('../modals/ForgotPasswordModal'));

export default function Authentication() {
    const navigate = useNavigate(); 
    
    const {setIsLoaderActive} = useContext(LoaderContext);
    const {notifyUser} = useContext(NotifyContext);
    const {modals,setModals} = useContext(ModalsContext);

    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const buttonRef = useRef();
    const invalidMatchRef = useRef();
    
    const [activeSection, setActiveSection] = useState({login: true, signup: false});
    const [passwordSvg, setpasswordSvg] = useState({openingEye: true, closingEye:false})
    const [confirmPasswordSvg, setConfirmPasswordSvg] = useState({openingEye: true, closingEye:false});
    const [formData, setFormData] = useState({ username: '', email: '', gender: 'prefer not to say', password: '', confirmPassword: '' });

    
    useEffect(()=>{
        async function verify() {
            try {
                setIsLoaderActive(true);
                
                const accessToken = localStorage.getItem('proPlannerAccessToken');
                if (!accessToken) {
                    setIsLoaderActive(false);
                    return;
                }
                
                const response = await apiClient.get(`/auth/verify`);
                if (response.status === 200) {
                    return navigate("/home");
                }
            } catch (error) {
                console.error("Verification failed:", error);
                // The interceptor will handle token refresh automatically
            } finally {
                setIsLoaderActive(false);
            }
        }

        verify();  
    },[]);


    function handlePasswordMatching(){
        if(passwordRef.current.value && confirmPasswordRef.current.value && passwordRef.current.value !== confirmPasswordRef.current.value){
            buttonRef.current.disabled = true;
            buttonRef.current.style.cursor = 'not-allowed';
            invalidMatchRef.current.style.display = 'block'
        }else{
            buttonRef.current.disabled = false;
            buttonRef.current.style.cursor = 'default'
            invalidMatchRef.current.style.display = 'none'
        }
    }

    
    async function handleSubmit(e, endpoint){
        e.preventDefault();    
        const { confirmPassword, ...dataToSend } = formData;
        setIsLoaderActive(true);
        
        try { 
            const response = await apiClient.post(endpoint, dataToSend);
            const  {accessToken, username} = response.data;
            
            localStorage.setItem('proPlannerAccessToken', accessToken);
            localStorage.setItem('proPlannerUsername', username)
            navigate('/home');
            
        } catch (error) {
            notifyUser(error.response?.data?.error || "An error occurred");
        }
        setIsLoaderActive(false);
    };

    
    function handlePageChange(){
        setpasswordSvg({openingEye: true, closingEye:false});
        setConfirmPasswordSvg({openingEye: true, closingEye:false});
        setFormData({ username: '', email: '', gender: 'prefer not to say', password: '', confirmPassword: '' })
    }


    //COMPONENT
  return (
    <>
        <ForgotPasswordModal />

        {
            activeSection.login && <main className='authpage'>
                <div>
                    <h2>Securely Login & Continue Your Journey.</h2>
                    <p>A Seamless Way to Keep Your Thoughts Organized.</p>

                    <form onSubmit={(e) => handleSubmit(e, `/login`)} aria-label='Login field'>
                        <input id='username' type="text" name='username' placeholder='Username' minLength='5' required value={formData.username} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })} autoFocus aria-required="true" aria-label='Enter your username'/>
                        <div className='password-div'>
                            <input id='password' ref={passwordRef} type={passwordSvg.openingEye ? 'password' : 'text'} name='password' placeholder='Password' minLength='8' required value={formData.password} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })} aria-required="true" aria-label='Enter your password' />
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

                        <div>
                            <span className='forgetpassword' onClick={()=> setModals({...modals, forgotPasswordModal: true})} aria-label='Forgot password button'>Forgot Password</span>
                        </div>

                        <button type="submit" aria-label='Login button'>Login</button>
                        <div>
                            <div></div>
                            <div onClick={()=>{setActiveSection({login:false, signup:true}); handlePageChange()}} aria-label='Switch to signup page'>Create a new account</div>
                        </div>
                    </form>
                    
                </div>
            </main>
        }


        {
            activeSection.signup && <main className='authpage'>
                <div>
                    <h2>Join Us & Bring Your Ideas to Life!</h2>
                    <p>A smarter way to organize your notes, ideas, and plans—anytime, anywhere!</p>

                    <form onSubmit={(e) => handleSubmit(e, `/signup`)} aria-label='signup field'>
                        <input id='username' type="text" name='username' placeholder='Username' minLength='5' required value={formData.username} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })}  autoFocus aria-required="true" aria-label='Enter your username'/>
                        <input id='email' type="email" name='email' placeholder='email' required value={formData.email} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })} aria-required="true" aria-label='Enter your email'/>
                        
                        <select value={formData.gender} onChange={e => setFormData({ ...formData, [e.target.name]: e.target.value.trim() })} name="gender" aria-label='Choose your gender'>
                            <option value="prefer not to say">Gender (Prefer not to say)</option>
                            <option value="male">Gender (Male)</option>
                            <option value="female">Gender (Female)</option>
                            <option value="other">Gender (Other)</option>
                        </select>

                        <div className='password-div'>
                            <input id='password' ref={passwordRef} type={passwordSvg.openingEye ? 'password' : 'text'} name='password' placeholder='Password' minLength='8' required value={formData.password} onChange={(e)=>{setFormData({ ...formData, [e.target.name]: e.target.value.trim() }), handlePasswordMatching()}} aria-required="true" aria-label='Enter your password'/>
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
                            <input id='confirm-password' ref={confirmPasswordRef} type={confirmPasswordSvg.openingEye ? 'password' : 'text'} name='confirmPassword' placeholder='Confirm Password' minLength='8' required value={formData.confirmPassword} onChange={(e)=>{ setFormData({ ...formData, [e.target.name]: e.target.value.trim() }); handlePasswordMatching(); }} aria-required="true" aria-label='Re-enter your password'/>
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
                        <button ref={buttonRef} type="submit" aria-label='Signup button'>Signup</button>
                        <div>
                            <div></div>
                            <div onClick={()=>{setActiveSection({login:true, signup:false}); handlePageChange()}} aria-label='Switch to login page'>Login to existing account</div>
                        </div>
                    </form>
                </div>
            </main>
        }
    </>
  )
}
