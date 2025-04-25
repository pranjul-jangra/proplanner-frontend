import React, {useContext, useRef, useState, useEffect, lazy, Suspense } from 'react'
import {useNavigate} from 'react-router-dom';
import apiClient from '../axiosClient/apiClient';
import { motion } from "motion/react"
import { ThemeContext } from '../contexts/ThemeContextProvider';
import { ModalContext } from '../contexts/ModalContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import { EditDetailContext } from '../contexts/EditDetailContextProvider';
import '../styles/home.css'
import { LoaderContext } from '../contexts/LoaderContextProvider';

const Navigations = lazy(()=> import('../components/Navigations'));
const Taskcontainer = lazy(()=> import('./Taskcontainer'));
const AddTasks = lazy(()=> import('../components/AddTasks'));


export default function Home() {
  const navigate = useNavigate();

  const constraintRef = useRef();
  const floatingButtonRef = useRef();

  const {theme} = useContext(ThemeContext);
  const {setIsModalOpen} = useContext(ModalContext);
  const {notifyUser} = useContext(NotifyContext);
  const {setEditDetails} = useContext(EditDetailContext);
  const {setIsLoaderActive} = useContext(LoaderContext);

  const [isDragging, setIsDragging] = useState(false);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [weeklyTasks, setWeeklyTasks] = useState([]);
  const [notes, setNotes] = useState([]);


  const user = localStorage.getItem('proPlannerUsername');

  const fetchTasks = () => {  // it is declared outside of useEffect so that it can re-run when handleAddTask function will trigger
    
    if(!user){
      notifyUser('User not found or the session has expired. Please login again.');
      localStorage.removeItem('proPlannerUsername');
      localStorage.removeItem('proPlannerAccessToken');
      return navigate('/');
    }

    setIsLoaderActive(true);

    apiClient.get(`/home/data`, { params: { user } })
      .then((response) => {
        const sortedTasks = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDailyTasks(sortedTasks.filter((t) => t.countdownPeriod === 'daily'));
        setWeeklyTasks(sortedTasks.filter((t) => t.countdownPeriod === 'weekly'));
        setNotes(sortedTasks.filter((t)=> t.countdownPeriod === 'noExpiry'));
        setIsLoaderActive(false);
      })
      .catch((error) => {
        setIsLoaderActive(false);
        if (error.response?.status === 403) {
          navigate('/');
        }
      });
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  

  async function handleAddTask(taskText, countdownPeriod) {
    try {
      setIsLoaderActive(true);
      await apiClient.post(`/home/add`, { taskText, countdownPeriod, user });
      fetchTasks(); // This function is called even if the home did't re-renders 
      setIsModalOpen(false);
    } catch (error) {
      setIsLoaderActive(false);
      notifyUser('Failed to add task. Please try again.');
    }
  }

  async function handleDeleteTask(taskId){
    try{
      setIsLoaderActive(true);
      await apiClient.delete(`/home/delete`, { data: { taskId, user } }); //data property is must with delete req
      fetchTasks();
    }catch(error){
      setIsLoaderActive(false);
      notifyUser('Failed to delete')
    }
  }

  async function handleUpdateTask(taskText, countdownPeriod, taskId){

    if(countdownPeriod === 'daily'){
      const willMatch = dailyTasks.some(t => t.task === taskText);
      if(willMatch) return notifyUser('No changes were detected.');
    }
    else if(countdownPeriod === 'weekly'){
      const willMatch = weeklyTasks.some(t => t.task === taskText);
      if(willMatch) return notifyUser('No changes were detected.');
    }
    else if(countdownPeriod === 'noExpiry'){
      const willMatch = notes.some(t => t.task === taskText);
      if(willMatch) return notifyUser('No changes were detected.');
    }
  
    try{
      setIsLoaderActive(true);
      await apiClient.patch(`/home/edit`, {taskId, taskText, countdownPeriod, user});
      fetchTasks();
    }catch(error){
      setIsLoaderActive(false);
      notifyUser('Failed to update task');
    }
  }

  async function handleCompleteTask(taskId){
    try{
      setIsLoaderActive(true);
      await apiClient.patch(`/home/markascomplete`, {taskId, user})
      fetchTasks();
    }catch(error){
      setIsLoaderActive(false);
      notifyUser('Failed to mark it as complete')
    }
  }


  return (

    <main>
      <header>
        <h1 className="visually-hidden">ProPlanner - Task Manager</h1>
      </header>


      <section>

        <Suspense fallback={<div>Loading...</div>}>
          <div className={`homepage ${theme}`}>
            <nav aria-label="Main navigation">
              <Navigations /> 
            </nav>
            <div>
              <h2 className="visually-hidden">Tasks</h2>
              <AddTasks onAdd={handleAddTask} onEdit={handleUpdateTask} />
              <div>
                <Taskcontainer setIsModalOpen={setIsModalOpen} handleCompleteTask={handleCompleteTask} deleteFn={handleDeleteTask} tasks={dailyTasks} containerName="📋 Daily Tasks" />
                <Taskcontainer setIsModalOpen={setIsModalOpen} handleCompleteTask={handleCompleteTask} deleteFn={handleDeleteTask} tasks={weeklyTasks} containerName="📆 Weekly Tasks" />
              </div>
            </div>
            <div>
              <h2 className="visually-hidden">Notes</h2>
              <Taskcontainer setIsModalOpen={setIsModalOpen} shouldHideCompleteButton={true} deleteFn={handleDeleteTask} tasks={notes} containerName='🗒️ Notes' />
            </div>
          </div>
        </Suspense>



        <div ref={constraintRef} className={`floating-button ${theme}`}>
          <motion.button 
            drag 
            ref={floatingButtonRef}
            dragConstraints={constraintRef} 
            dragTransition={{ power: 0.1, timeConstant: 500 }} 
            transition={{ type: "spring", stiffness: 50, damping: 10 }} 
            onDragStart={() => {setIsDragging(true); floatingButtonRef.current.style.cursor = 'grabbing'}}
            onDragEnd={() => {setTimeout(() => setIsDragging(false), 200); floatingButtonRef.current.style.cursor = 'pointer'}}
            aria-label="Add a new task"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditDetails({task: '', countdownPeriod: 'daily'})
              if (!isDragging) setIsModalOpen(true);
            }}
          >+</motion.button>
        </div>
      </section>
    </main>
  )
}
