import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signImg from '../assets/SignUp.png';

const cookies = new Cookies();

const initialState = {
  fullName: '',
  username: '',
  password: '',
  confirmPass: '',
  phoneNr: '',
  avatarURL: ''
}

const Auth = () => {
  const [form, setForm] = useState(initialState);
  //hook to change between sing up and sign in displays.
  const [isSignup, setIsSignup] = useState(true);

  //update state field
  const handleChange=(e)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }

  /**
   * This function handles form submission, sends a request to a back-end API for user authentication,
   * and stores the received data in cookies.
   */
  const handleSubmit = async(e) =>{
    e.preventDefault();

    //get data from form
    const {username, password, phoneNr, avatarURL} = form;
    //get the URL
    const URL = 'https://file-iu-sys.herokuapp.com/auth';
    //make the request to back-end depending on if user is login in or signing up. 
    const {data: {token, userId, hashedPass, fullName}} = await axios.post(`${URL}/${isSignup? 'signup' : 'login'}`, {
      username, password, fullName: form.fullName, phoneNr, avatarURL
    });

    // store the data it gets back on cookies.
    cookies.set('token', token);
    cookies.set('username', username);
    cookies.set('fullName', fullName);
    cookies.set('userId', userId);

    if(isSignup){
      cookies.set('phone Nr.', phoneNr);
      cookies.set('avatarURL', avatarURL);
      cookies.set('hashedPass', hashedPass);
    }
    //reload browser
    window.location.reload();
  }

  //switch state of signin to the one not currently in use.
  const swapLog = () =>{
    setIsSignup((prevIsSignup)=> !prevIsSignup);
  }

  return (
    <div className='authForm-cont'>
      <div className='authForm-contImage'>
        <img src={signImg} alt='sign in'/>
      </div>
      <div className='authForm-contFields'>
        <div className='authForm-contFields-content'>
          <p>{isSignup? 'Anmelden' : 'Einloggen'}</p>
          <form onSubmit={handleSubmit}>
            {isSignup &&(
              <div className='authForm-contFields-content-input'>
              <label htmlFor='fullName'>Name</label>
              <input name='fullName' type='text' placeholder='Name' onChange={handleChange} required/>
            </div>
            )}
            <div className='authForm-contFields-content-input'>
                <label htmlFor='username'>Benutzername</label>
                <input name='username' type='text' placeholder='Benutzername' onChange={handleChange} required/>
            </div>
            {isSignup && (
              <div className='authForm-contFields-content-input'>
                <label htmlFor='phoneNr'>Telefonnummer #</label>
                <input name='phoneNr' type='text' placeholder='Telefonnummer' onChange={handleChange} required/>
              </div>
            )}
            {isSignup && (
              <div className='authForm-contFields-content-input'>
                <label htmlFor='avatarURL'>Avatar URL</label>
                <input name='avatarURL' type='text' placeholder='Avatar URL' onChange={handleChange} required/>
              </div>
            )}
            <div className='authForm-contFields-content-input'>
                <label htmlFor='password'>Kenntwort</label>
                <input name='password' type='password' placeholder='Kenntwort' onChange={handleChange} required/>
            </div>
            {isSignup && (
              <div className='authForm-contFields-content-input'>
                <label htmlFor='confirmPass'>Kennwort bestätigen</label>
                <input name='confirmPass' type='password' placeholder='Kennwort bestätigen' onChange={handleChange} required/>
              </div>
            )}
            <div className='authForm-contFields-content-button'>
              <button>{isSignup? 'Anmelden': 'Einloggen'}</button>
            </div>
          </form>
          <div className='authForm-contFields-account'>
            <p>
              {isSignup? "Haben Sie bereits ein Konto? " : "Kein Konto? "}
              <span onClick={swapLog}>
                {isSignup? 'Log In' : 'Anmelden'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth;