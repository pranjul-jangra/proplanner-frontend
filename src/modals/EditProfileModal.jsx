import React, {useContext} from 'react'
import { motion, AnimatePresence } from "motion/react"
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/editProfile.css'
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { ModalsContext } from '../contexts/ModalsContextProvider';



export default function EditProfileModal({fetchUser, dataToEdit, handleChange}) {

    const { notifyUser } = useContext(NotifyContext);
    const {modals, setModals} = useContext(ModalsContext);


    async function handleUpdateProfile(e){
        e.preventDefault();
        const user = localStorage.getItem('proPlannerUsername');
        
        if(dataToEdit.username.trim().length < 5){
          return notifyUser('Please enter a username with at least 5 characters')
        }
        setModals({...modals, updateProfileModal: false});
        
        try{
          const response = await apiClient.patch(`/home/settings/update-profile`, {user, dataToEdit});
    
          if(response.status === 200) {
            notifyUser(response.data.message);
            localStorage.setItem('proPlannerUsername', response.data.username);
            localStorage.setItem('proPlannerAccessToken', response.data.accessToken);
            fetchUser();
          }
    
        }catch(error){
          notifyUser(error.response.data.error || 'An error occurred')
        }
    }



  return (
    <AnimatePresence>
            {modals.updateProfileModal && <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3, ease: 'easeOut'}}
            className='editProfileModal'>
    
              <motion.form 
              initial={{ opacity: 0, scale: 0.7, y: -80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -80 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              aria-labelledby='update-profile'>
    
                <button type='button' className="close-btn" onClick={() => setModals({...modals, updateProfileModal: false})} aria-label='Close button'>X</button>

                <h2 id='update-profile'>Update Your Profile</h2>
                <p>Make sure your details are accurate to enjoy a better experience.</p>

                <input type="text" name='username' minLength='5' placeholder='New username' value={dataToEdit.username} onChange={handleChange} required autoFocus aria-required={true} aria-label='Your username'/>
    
                <select name="gender" value={dataToEdit.gender} onChange={handleChange} aria-label='Choose your gender'>
                  <option value="prefer not to say">Gender (Prefer not to say)</option>
                  <option value="male">Gender (Male)</option>
                  <option value="female">Gender (Female)</option>
                  <option value="other">Gender (Other)</option>
                </select>
    
                <button type='submit' onClick={handleUpdateProfile} aria-label='Update your information'>Update</button>
                
              </motion.form>
    
            </motion.div>}
    </AnimatePresence>
  )
}
