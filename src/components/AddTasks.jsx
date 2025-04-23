import React, {useContext, useEffect} from 'react';
import '../styles/addtasks.css';
import { ModalContext } from '../contexts/ModalContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { motion, AnimatePresence } from "motion/react" 
import { EditDetailContext } from '../contexts/EditDetailContextProvider';

export default function AddTasks({ onAdd, onEdit }) {

    const {isModalOpen, setIsModalOpen} = useContext(ModalContext);
    const {notifyUser} = useContext(NotifyContext)
    const {editDetails, setEditDetails} = useContext(EditDetailContext);


    useEffect(() => {
        function handleKeyDown(e) {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                handleSubmit(e);
            }
            if(e.ctrlKey && e.key === "x"){
                e.preventDefault();
                setIsModalOpen(false);
            }
        }

        if (isModalOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen, editDetails]); 



    function handleSubmit(e) {
        e.preventDefault(); 
        if(!editDetails.task || !editDetails.countdownPeriod) return notifyUser('All fields are required');

        if(!editDetails.taskId){
            onAdd(editDetails.task, editDetails.countdownPeriod);
            setIsModalOpen(false);
        }else{
            onEdit(editDetails.task, editDetails.countdownPeriod, editDetails.taskId)
            setIsModalOpen(false);
        }
    }


    return (
        <AnimatePresence>
            {isModalOpen && <motion.section
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3, ease: 'easeOut'}}
            aria-labelledby="task-dialog-title"
            aria-describedby="task-dialog-description"
            className='addtask' role="dialog" onClick={e => e.stopPropagation()}>

                <motion.form 
                initial={{opacity: 0, scale: 0.7, y: -80}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.7, y: -80}}
                transition={{ duration: 0.3, ease: 'easeOut' }}>

                    <h2 id="task-dialog-title">{editDetails.modalMode === 'edit' ? "Edit Task" : "Add Task"}</h2>
                    <p id="task-dialog-description">
                        {editDetails.modalMode === 'edit' ? "Edit your task details below." : "Add a new task and set a deadline."}
                    </p>

                    <button type='button' onClick={e => { e.preventDefault(); setIsModalOpen(false) }} aria-label="Close task modal">X</button>

                    <textarea name='task' placeholder='Enter data' value={editDetails.task || ''} onChange={(e) => setEditDetails({...editDetails, [e.target.name]: e.target.value})} aria-label="Task description input field. Enter your content here." aria-required="true" autoFocus required></textarea>

                    <select value={editDetails.countdownPeriod || 'daily'} onChange={(e) => setEditDetails({...editDetails, [e.target.name]: e.target.value})} aria-label="Select deadline period for the task" name="countdownPeriod">
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="noExpiry">Notes</option>
                    </select>

                    <div role="status" aria-live="polite" >Deadline: {
                        (()=>{
                            if(editDetails.countdownPeriod === 'daily') return '1 Day'
                            else if(editDetails.countdownPeriod === 'weekly') return '7 Days'
                            else return 'No Expiry'
                        })()
                    }</div>
                    
                    <button type='submit' 
                    onClick={(e)=>{ handleSubmit(e); setEditDetails({ task: '', countdownPeriod: 'daily' }); }}
                    aria-label={editDetails.modalMode === 'edit' ? "Update task details" : "Add new task"}>
                        {editDetails.modalMode === 'edit' ? "Update" : "Add"}
                    </button>

                </motion.form>

                    <span>
                        <p onClick={(e)=>{ handleSubmit(e); setEditDetails({ task: '', countdownPeriod: 'daily' }); }}>Ctrl+S = Save</p>
                        <p onClick={e => { e.preventDefault(); setIsModalOpen(false) }}>Ctrl+X = Close</p>
                    </span>
            </motion.section>}
        </AnimatePresence>
    );
}
