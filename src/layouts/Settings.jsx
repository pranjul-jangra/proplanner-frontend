import React, { useContext, useEffect, useState, useRef, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeContext } from '../contexts/ThemeContextProvider'
import { ModalsContext } from '../contexts/ModalsContextProvider'
import {NotifyContext} from '../contexts/NotifyContextProvider'
import { OtpGenerationContext } from '../contexts/OtpGenerationContextProvider'
import apiClient from '../axiosClient/apiClient';
import '../styles/settings.css'
import FallbackElement from '../components/FallbackElement'
import { LoaderContext } from '../contexts/LoaderContextProvider'

const ForgotPasswordModal = lazy(()=> import('../modals/ForgotPasswordModal'));
const Footer = lazy(()=> import('../components/Footer'));
const EmptyingTaskModal = lazy(()=> import('../modals/EmptyingTaskModal'));
const EditProfileModal = lazy(()=> import('../modals/EditProfileModal'));
const DeleteAccountModal = lazy(()=> import('../modals/DeleteAccountModal'));
const LogoutModal = lazy(()=> import('../modals/LogoutModal'));
const ChangeEmailModal = lazy(()=> import('../modals/ChangeEmailModal'));
const ChangePasswordModal = lazy(()=> import('../modals/ChangePasswordModal'));


export default function Settings() {
  const navigate = useNavigate();

  const { theme } = useContext(ThemeContext);
  const { notifyUser } = useContext(NotifyContext);
  const {modals, setModals} = useContext(ModalsContext);
  const { handleGenerateOtp } = useContext(OtpGenerationContext);
  const { setIsLoaderActive } = useContext(LoaderContext);

  
  const [userProfile, setUserProfile] = useState({});  // contains profile info & also prop to changeEmail modal
  const [containerToEmpty, setContainerToEmpty] = useState('');  // prop to emptying modal
  const [dataToEdit, setDataToEdit] = useState({}); // prop to editProfile modal

  // FETCHING USER INFORMATIONS
  async function fetchUser() {
    try {
      setIsLoaderActive(true);
      const user = localStorage.getItem('proPlannerUsername');

      if(!user){
        notifyUser('User not found or the session has expired. Please login again.')
        localStorage.removeItem('proPlannerAccessToken');
        localStorage.removeItem('proPlannerUsername');
        navigate('/');
      }

      const response = await apiClient.get(`/home/settings/user-profile`, {
        params: { user }
      });
      setUserProfile(response.data.userData);
      setDataToEdit(response.data.userData);

    } catch (error) {
      notifyUser('Something went wrong');
      navigate('/');
    }finally{
      setIsLoaderActive(false);
    }
  }


  useEffect(() => {
    fetchUser();
  }, [])


  function handleProfileDataChange(e){                                 // Prop function to editProfileModal
    setDataToEdit({...dataToEdit, [e.target.name]: e.target.value});
  }


  return (
    <>
      <Suspense fallback={<FallbackElement />}>

        <EmptyingTaskModal containerToEmpty={containerToEmpty} />
        <EditProfileModal fetchUser={fetchUser} dataToEdit={dataToEdit} handleChange={handleProfileDataChange} />
        <ChangeEmailModal userProfile={userProfile} fetchUser={fetchUser} />
        <ForgotPasswordModal />
        <ChangePasswordModal />
        <LogoutModal />
        <DeleteAccountModal />

      </Suspense>



      <main className={`settingspage ${theme}`}>
        <div>
          <div>
            <div className='userProfile' aria-labelledby='info'>
              <h2 id='info'>Your Information</h2>
              <div>Username: {userProfile.username || 'User not found'}</div>
              <div>Gender: {userProfile.gender || 'Prefer not to say'}</div>
              <div>Email: {userProfile.email || 'Email not found'}</div>
            </div>

            <div className='controlButtons' aria-labelledby='tasks'>
              <h2 id='tasks'>Task Management</h2>
              <h4>Manage Your Tasks Efficiently</h4>
              <button type='button' onClick={()=> {setModals({...modals, taskModal: true}); setContainerToEmpty('daily')}} aria-label='Delete all daily tasks'>🗑️ Empty daily tasks</button>
              <button type='button' onClick={()=> {setModals({...modals, taskModal: true}); setContainerToEmpty('weekly')}} aria-label='Delete all weekly tasks'>🗑️ Empty Weekly tasks</button>
              <button type='button' onClick={()=> {setModals({...modals, taskModal: true}); setContainerToEmpty('notes')}} aria-label='Delete all notes'>🗑️ Empty notes</button>
            </div>

            <div className='settings' aria-labelledby='account'>
              <h2 id='account'>Account Settings</h2>
              <h4>Your Profile & Privacy</h4>
              <button type="button" onClick={()=> setModals({...modals, updateProfileModal: true})} aria-label='Edit your profile'>✏️ Edit Profile</button>
              <button type='button' onClick={()=> { setModals({...modals, changeEmailModal: true}); handleGenerateOtp(false, userProfile, notifyUser) }} aria-label='Change your email'>✉️ Change Email</button>
              <button type="button" onClick={()=> setModals({...modals, changePasswordModal: true})} aria-label='Change your password'>🔒 Change Password</button>
              <button type='button' onClick={()=> setModals({...modals, logoutModal: true})} aria-label='Logout'>🔓 Log Out</button>
              <button type="button" onClick={()=> setModals({...modals, deleteAccountModal: true})} className='delete' aria-label='Delete your account'>❌ Delete Account</button>
            </div>
          </div>
          

          <Suspense fallback={<FallbackElement />}>
            <Footer />
          </Suspense>

        </div>
      </main>
    </>
  )
}