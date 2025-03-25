import React, { useContext, useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { ThemeContext } from '../contexts/ThemeContextProvider';
import { motion, AnimatePresence } from "motion/react"
import FallbackElement from '../components/FallbackElement';
import '../styles/taskcontainer.css'

const TaskComponent = lazy(()=> import('../components/Task'));

export default function Taskcontainer({containerName, tasks,handleCompleteTask, deleteFn, shouldCompleteButtonDisplay, setIsModalOpen}) {
  const {theme} = useContext(ThemeContext)
  const [isDetailBoxOpen, setIsDetailBoxOpen] = useState(false);
  const [taskId, setTaskId] = useState(null);  //get it from child to know which task is clicked
  const [remainingTime, setRemainingTime] = useState({})
  const [activeTab, setActiveTab] = useState({default: true, completedTask: false});

  const completedTask = useMemo(() => tasks.filter((t) => t.isCompleted), [tasks]);
  const incompleteTask = useMemo(() => tasks.filter((t) => !t.isCompleted), [tasks]);


  function getRemainingTime(createdAt, period) {
    try {
      const createdDate = new Date(createdAt);
      let deadline;
      
      if (period === "weekly") {
        deadline = new Date(createdDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (period === "daily") {
        deadline = new Date(createdDate.getTime() + 24 * 60 * 60 * 1000);
      } else {
        return "Invalid period";
      }
  
      const now = new Date();
      const diffMs = deadline.getTime() - now.getTime();
      
      if (diffMs <= 0) return "Time expired!";
       
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      // Add error checking for NaN values
      if (isNaN(days) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        return "Invalid time calculation";
      }
      
      return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
    } catch (error) {
      console.error("Error calculating remaining time:", error);
      return "Time calculation error";
    }
  }
  


  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTimes) => {
        const updatedTimes = {};
        tasks.forEach((task) => {
          updatedTimes[task._id] = getRemainingTime(task.createdAt, task.countdownPeriod);
        });

        return updatedTimes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const selectedTask = tasks.find((t) => t._id === taskId);


  return (
    <>
      <AnimatePresence>
        {isDetailBoxOpen && <motion.section 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.3, ease: 'easeOut'}}
        role='dialog'
        className='detailModalBox'>

          <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -80 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -80 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>

            <button type='button' onClick={()=> {setIsDetailBoxOpen(false);}} aria-label='Close details box'>Close</button>

            <div aria-label='Content'>{selectedTask.task || 'No task details available.'}</div>

            <div aria-label={`Target type: ${selectedTask.countdownPeriod !== 'noExpiry' ?  selectedTask.countdownPeriod : 'Notes (No expiry)' || ''}`}>Target type:  {selectedTask.countdownPeriod !== 'noExpiry' ?  selectedTask.countdownPeriod : 'Notes (No expiry)' || ''}</div>

            <div aria-label={`Createf at: ${new Date(selectedTask.createdAt).toLocaleString() || ''}`}>Created at:  {new Date(selectedTask.createdAt).toLocaleString() || ''}</div>

            {
              selectedTask.updatedAt && <div aria-label={`Updated at: ${new Date(selectedTask.updatedAt).toLocaleString() || ''}`} aria-live='polite'>Updated at:  {new Date(selectedTask.updatedAt).toLocaleString() || ''}</div>
            }

            {
              selectedTask.countdownPeriod !== 'noExpiry' && <div aria-label={`Deadline period: ${getDeadline(selectedTask.createdAt, selectedTask.countdownPeriod)}`} aria-live="polite">Deadline:  {getDeadline(selectedTask.createdAt, selectedTask.countdownPeriod)}</div>
            }

            {
              selectedTask.countdownPeriod !== 'noExpiry' && (!selectedTask.isCompleted ? <div aria-label={`Remaning time: ${remainingTime[selectedTask._id]}`}>Remaning time:  {remainingTime[selectedTask._id]} </div> : 
              <div aria-label='Task completed'>Task Completed</ div>)
            }
          </motion.div>

        </motion.section>}
      </AnimatePresence>



      <section className={`taskcontainer ${theme}`}>

        <div>

          <div>
            <button type='button' onClick={()=> setActiveTab({default: true, completedTask: false})} aria-label={`View incomplete tasks in ${containerName}`}> {containerName} </button>
            <button type='button' onClick={()=> setActiveTab({default: false, completedTask: true})} className={shouldCompleteButtonDisplay ? 'visible':'hide'} aria-label={`View completed tasks`}>✅ Completed Tasks</button>
          </div>

          {
            activeTab.default && <div aria-label={`Total tasks/notes: ${incompleteTask.length}`} aria-live="polite">Total Count: {incompleteTask.length}</div>
          }
          {
            activeTab.completedTask && <div aria-label={`Total tasks/notes: ${completedTask.length}`} aria-live="polite">Total Count: {completedTask.length}</div>
          }

        </div>

        <div>
          <AnimatePresence>
            <Suspense fallback={<FallbackElement />}>
              {
                activeTab.default && (incompleteTask.length === 0 ? 'No data yet....' : incompleteTask.map(task => {
                    return <TaskComponent
                    setIsModalOpen={setIsModalOpen}
                    setTaskId={setTaskId}
                    getDeadline={getDeadline}
                    remainingTime={remainingTime[task._id] || "Calculating..."}
                    setIsDetailBoxOpen={setIsDetailBoxOpen}
                    handleCompleteTask={handleCompleteTask}
                    deleteFn={deleteFn} 
                    key={task._id + activeTab.default}  //This forces React to remount the component when switching between "Active" and "Completed" tasks
                    task={task}
                  />
                }))
              }
              {
                activeTab.completedTask && (completedTask.length === 0 ? 'No data yet....' : completedTask.map(task => {
                  return <TaskComponent
                  setIsModalOpen={setIsModalOpen}
                  setTaskId={setTaskId}
                  getDeadline={getDeadline}
                  remainingTime={remainingTime[task._id] || "Calculating..."}
                  setIsDetailBoxOpen={setIsDetailBoxOpen}
                  handleCompleteTask={handleCompleteTask}
                  deleteFn={deleteFn}
                  key={task._id}
                  task={task}
                />
              }))
              }
            </Suspense>
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
