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


          <nav aria-label="Contact Information" className="contact-links">
            <h2>Contact Us</h2>

            <div className='ContactTags'>

              <a data-social="Phone" title="tel on: 9812471042" id="phoneLogo" href="tel:+919812471042"  aria-label="Call us at +91 9812471042">
                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 202.592 202.592" >
                  <g>
                    <g>
                      <path d="M198.048,160.105l-31.286-31.29c-6.231-6.206-16.552-6.016-23.001,0.433l-15.761,15.761 c-0.995-0.551-2.026-1.124-3.11-1.732c-9.953-5.515-23.577-13.074-37.914-27.421C72.599,101.48,65.03,87.834,59.5,77.874 c-0.587-1.056-1.145-2.072-1.696-3.038l10.579-10.565l5.2-5.207c6.46-6.46,6.639-16.778,0.419-23.001L42.715,4.769 c-6.216-6.216-16.541-6.027-23.001,0.433l-8.818,8.868l0.243,0.24c-2.956,3.772-5.429,8.124-7.265,12.816 c-1.696,4.466-2.752,8.729-3.235,12.998c-4.13,34.25,11.52,65.55,53.994,108.028c58.711,58.707,106.027,54.273,108.067,54.055 c4.449-0.53,8.707-1.593,13.038-3.275c4.652-1.818,9.001-4.284,12.769-7.233l0.193,0.168l8.933-8.747 C204.079,176.661,204.265,166.343,198.048,160.105z M190.683,176.164l-3.937,3.93l-1.568,1.507 c-2.469,2.387-6.743,5.74-12.984,8.181c-3.543,1.364-7.036,2.24-10.59,2.663c-0.447,0.043-44.95,3.84-100.029-51.235 C14.743,94.38,7.238,67.395,10.384,41.259c0.394-3.464,1.263-6.95,2.652-10.593c2.462-6.277,5.812-10.547,8.181-13.02l5.443-5.497 c2.623-2.63,6.714-2.831,9.112-0.433l31.286,31.286c2.394,2.401,2.205,6.492-0.422,9.13L45.507,73.24l1.95,3.282 c1.084,1.829,2.23,3.879,3.454,6.106c5.812,10.482,13.764,24.83,29.121,40.173c15.317,15.325,29.644,23.27,40.094,29.067 c2.258,1.249,4.32,2.398,6.17,3.5l3.289,1.95l21.115-21.122c2.634-2.623,6.739-2.817,9.137-0.426l31.272,31.279 C193.5,169.446,193.31,173.537,190.683,176.164z"/>
                    </g>
                  </g>
                </svg>
              </a>

              <a data-social="Email" title="Mail on: pranjuljan68@gmail.com" id="emailLogo" href="mailto:pranjuljan68@gmail.com" aria-label="Send us an email">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M3.75 5.25L3 6V18L3.75 18.75H20.25L21 18V6L20.25 5.25H3.75ZM4.5 7.6955V17.25H19.5V7.69525L11.9999 14.5136L4.5 7.6955ZM18.3099 6.75H5.68986L11.9999 12.4864L18.3099 6.75Z"/>
                </svg>
              </a>

              <a data-social="LinkedIn" title="View LinkedIn Profile" id="linkedInLogo" href="https://www.linkedin.com/in/pranjul-jangra-107700332/" target="_blank" rel="noopener noreferrer" aria-label="Visit our LinkedIn">
                <svg viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                  <path  d="M478.234 600.75V1920H.036V600.75h478.198Zm720.853-2.438v77.737c69.807-45.056 150.308-71.249 272.38-71.249 397.577 0 448.521 308.666 448.521 577.562v737.602h-480.6v-700.836c0-117.867-42.173-140.215-120.15-140.215-74.134 0-120.151 23.55-120.151 140.215v700.836h-480.6V598.312h480.6ZM239.099 0c131.925 0 239.099 107.294 239.099 239.099s-107.174 239.099-239.1 239.099C107.295 478.198 0 370.904 0 239.098 0 107.295 107.294 0 239.099 0Z" fillRule="evenodd"/>
                </svg>
              </a>

              <a data-social="GitHub" title="View GitHub Profile" id="githubLogo" href="https://github.com/pranjul-jangra?tab=overview&from=2024-09-01&to=2024-09-30" target="_blank" rel="noopener noreferrer" aria-label="Check out our GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 16 16">
                  <path  d="M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z"></path>
                </svg>    
              </a>

            </div>
          </nav>
          
    </footer>
  )
}
