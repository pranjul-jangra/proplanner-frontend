import React, {useState, useContext} from 'react'
import { ThemeContext } from '../contexts/ThemeContextProvider';
import { NotifyContext } from '../contexts/NotifyContextProvider';
import apiClient from '../axiosClient/apiClient';
import '../styles/footer.css'

export default function Footer() {

    const { theme } = useContext(ThemeContext);
    const { notifyUser } = useContext(NotifyContext);

    const [feedbackData, setFeedbackData] = useState({ name: '', email: '', feedbackType: 'general', message: ''});


    async function handleSubmitFeedback(e){
        e.preventDefault();
        try {
          const dataToSend = feedbackData; 
          setFeedbackData({ name: '', email: '', feedbackType: 'general', message: ''})
    
          notifyUser('Thank you for sharing your feedback! 😊 Your insights help us improve and create a better experience for you.');
          await apiClient.post(`/home/settings/submit-feedback`, dataToSend);
    
        } catch (error) {
          notifyUser('Failed to submit feedback.');
        }
    };

  return (

    <footer className={`footer ${theme}`}>

          <section aria-labelledby="feedback-heading">
            <form onSubmit={handleSubmitFeedback}>

              <h2 id="feedback-heading">Feedback</h2>
              <h4>💬 We Value Your Feedback</h4>

              <p>Your thoughts matter! 🌟</p>
              <p>Tell us what you love about the app — features that make your experience smooth, enjoyable, or productive.</p>
              <p>If there's anything you feel could be improved, we’d love to hear that too. Whether it's new features, design tweaks, or ways to simplify things — your feedback helps us grow and improve.</p>
              <p>Your voice shapes the future of this app, so don’t hesitate to share your ideas! 🚀</p>

              <input type="text" name='name' placeholder='Your name (optional)' value={feedbackData.name} onChange={(e)=> setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value })} aria-label='Your name (optional)'/>
              <input type="email" name='email' placeholder='Your Email (Optional)' value={feedbackData.email} onChange={(e)=> setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value })} aria-label='Your email (optional)'/>

              <select name="feedbackType" value={feedbackData.feedbackType} onChange={(e)=> setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value })} aria-label='Choose the type of feedback'>
                <option value="general">General Feedback</option>
                <option value="bug-report">Bug Report</option>
                <option value="feature-request">Feature Request</option>
                <option value="ui-ux">UI/UX Suggestions</option>
                <option value="security">Security Concern</option>
              </select>

              <textarea placeholder="Share your feedback..." name="message" value={feedbackData.message} onChange={(e)=> setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value })} required aria-label='Type your message'></textarea>
              <button type="submit" aria-label='Submit feedback button'>Submit</button>

            </form>
          </section>
    </footer>
  )
}
