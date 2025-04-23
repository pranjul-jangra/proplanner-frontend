import React, {useContext, useCallback, useRef, useMemo} from 'react';
import '../styles/task.css'
import { ThemeContext } from '../contexts/ThemeContextProvider'
import { EditDetailContext } from '../contexts/EditDetailContextProvider';
import { motion, useInView } from 'motion/react';

export default function Task({task, setTaskId, handleCompleteTask, deleteFn, setIsDetailBoxOpen, getRemainingTime, remainingTime, setIsModalOpen}) {
    
    const ref = useRef(null);
    const inView = useInView(ref, { once: false, margin: "-7% 0px -7% 0px" }); 

    const {theme} = useContext(ThemeContext);
    const {setEditDetails} = useContext(EditDetailContext);
    
    // Memoized expiredTask to prevent unnecessary renders
    const expiredTask = useMemo(() => task.countdownPeriod !== 'noExpiry' && remainingTime === 'Time expired!' && !task.isCompleted,  [remainingTime, task]);  //returns boolean

    
    const handleEditClick = useCallback((e, task) => {
        e.stopPropagation();
        setEditDetails({ taskId: task._id, task: task.task, countdownPeriod: task.countdownPeriod, modalMode: 'edit' });
        setTimeout(() => setIsModalOpen(true), 10);
    }, [setEditDetails, setIsModalOpen]);



  return (
    <motion.article 
    ref={ref}
    key={task._id}
    initial={{ opacity: 0,  scale: 0.95 }} 
    animate={inView ? { opacity: 1,  scale: 1 } : { opacity: 0,  scale: 0.95 }} 
    exit={{ opacity: 0,  scale: 0.95, transition:{ duration: 0.15, ease: 'easeInOut'} }}
    transition={{ duration: 0.3, ease: "easeIn" }}
    onClick={()=> {setIsDetailBoxOpen(true); setTaskId(task._id)}} className={`tasks ${theme} ${expiredTask && 'expiredTask'}`}
    aria-labelledby={`task-title-${task._id}`}>
        
        <div>
            <h4 id={`task-title-${task._id}`}>{task.task.length >120 ? task.task.slice(0, 120) + '...' : task.task}</h4>
            <div>
                <p>
                    <strong>Created at: 
                        <time dateTime={new Date(task.createdAt).toISOString()}>
                            {new Date(task.createdAt).toLocaleString() || ''}
                        </time>
                    </strong>
                </p>

                {
                    task.updatedAt && <p>
                        <strong>Updated at: 
                            <time dateTime={new Date(task.updatedAt).toISOString()}>
                            {new Date(task.updatedAt).toLocaleString() || ''}
                            </time>
                        </strong>
                    </p>
                }

                {
                    task.countdownPeriod !== 'noExpiry' && (!task.isCompleted && <p>
                        <strong>Deadline: {getRemainingTime(task.createdAt, task.countdownPeriod) || ''}</strong>
                    </p>)
                }
                {
                    task.countdownPeriod !== 'noExpiry' && (!task.isCompleted && <p>
                        <strong>Remaining Time: {remainingTime || ''}</strong>
                    </p>)
                }
            </div>

            <div>
                <button onClick={e => handleEditClick(e, task) } type='button' aria-label="Edit Task">✏️ Edit</button>

                <button onClick={e => { e.stopPropagation(); deleteFn(task._id) }} type='button' aria-label="Delete Task">🗑️ Delete</button>

                {task.countdownPeriod !== 'noExpiry' ? (!task.isCompleted && <button onClick={(e)=> { e.stopPropagation(); handleCompleteTask(task._id) }} type='button' aria-label="Mark Task as Completed">✅ Mark as completed</button>) : ''}
            </div>
            
        </div>
        {expiredTask && <div className={expiredTask && 'expireTag'} aria-live="polite">Expired!</div>}
    </motion.article>
  )
}