import React,{useContext} from 'react'
import { motion, AnimatePresence } from "motion/react"
import { ModalsContext } from '../contexts/ModalsContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import apiClient from '../axiosClient/apiClient';
import '../modalStyles/emptyingTask.css'

export default function EmptyingTaskModal({containerToEmpty}) {

    const {modals, setModals} = useContext(ModalsContext);
    const { notifyUser } = useContext(NotifyContext);


    async function handleEmptyingTasks(){
        const user = localStorage.getItem('proPlannerUsername');
    
        if(!containerToEmpty) return notifyUser('Select the tasks to empty');
    
        try{
          const response = await apiClient.delete(`/home/settings/empty-tasks`, { params: {user, containerToEmpty} })
          if(response.status === 200) return notifyUser(response.data.message);
    
        }catch(error){
          notifyUser(error.response?.data?.error || 'Unable to delete tasks/notes. Please try again later')
        }
    }


  return (
    <AnimatePresence>
        {modals.taskModal && <motion.section 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        className='EmptyTaskModal'>

          <motion.div 
          initial={{ opacity: 0, scale: 0.7, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          aria-labelledby='delete-tasks'>

            <h2 id='delete-tasks'>Delete Your Tasks / Notes</h2>

            <p>"Note: Deleted tasks/notes cannot be recovered in the future."</p> 
            <p>Are you sure you want to continue?</p>

            <div>
              <button type="button" onClick={()=>{setModals({...modals, taskModal: false}); handleEmptyingTasks()}} aria-label='Empty button'>Empty</button>
              <button type='button' onClick={()=>{setModals({...modals, taskModal: false})}} aria-label='Cancel button'>Cancel</button>
            </div>

          </motion.div>

        </motion.section>}
      </AnimatePresence>
  )
}
