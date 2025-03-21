import React, {useContext} from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useNavigate } from 'react-router-dom'
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/logoutModal.css'
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { ModalsContext } from '../contexts/ModalsContextProvider';

export default function LogoutModal() {
    const navigate = useNavigate();

    const { notifyUser } = useContext(NotifyContext);
    const {modals, setModals} = useContext(ModalsContext);


    async function handleLogout(){
      try{
        const response = await apiClient.post(`/home/settings/logout`);

        if(response.status === 200){
          localStorage.removeItem('proPlannerUsername');
          localStorage.removeItem('proPlannerAccessToken');
          
          navigate('/');
        }

      }catch(error){
        notifyUser(
          typeof error.response?.data?.error === "string"
            ? error.response.data.error
            : JSON.stringify(error.response?.data?.error) || "Failed to logout. Please try again later"
        );
      }
    }


  return (
      <AnimatePresence>
        {modals.logoutModal && <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        className='logoutModal'>

          <motion.div 
          initial={{ opacity: 0, scale: 0.7, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby='logout'>

            <h2 id='logout'>Log Out</h2>

            <p>🚀 Ready to take a break?</p>
            <p>We’ll log you out, but your data is safe. You can return anytime and pick up right where you left off!</p>

            <div>
              <button type='button' onClick={ ()=> { handleLogout(); setModals({...modals, logoutModal: false}) }} aria-label='Log out'>Log Me Out</button>
              <button type='button' onClick={() => setModals({...modals, logoutModal: false})} aria-label='Stay logged in'>Stay Logged In</button>
            </div>

          </motion.div>

        </motion.div>}
      </AnimatePresence>
  )
}
