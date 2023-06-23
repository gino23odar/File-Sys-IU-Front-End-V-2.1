import React, {useState} from 'react';
import logoutIc from '../assets/logout.svg';
import returnicon from '../assets/return.svg';
import imageSwap from '../assets/imageSwap.svg';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

const PassChange = ({togglePassForm, handleChange}) =>{
  const changePassword = () => {
    console.log('hi');
  }

  return(
    <div className='userSettings-change'>
      <div className='settings-head'>
        <div onClick={togglePassForm}>
          <img src={returnicon} alt='return' width='80' />
        </div>
        <p> Password ändern</p>
      </div>
      <div className='settings-body'>
        <form className='settings-form'>
          <input className='settings-input' name='password' type='text' placeholder='aktuelles Kentwort' onChange={handleChange} />
          <input className='settings-input' name='newPassword' type='text' placeholder='neues Kenntwort' onChange={handleChange} />
          <input className='settings-input' name='confirmPass' type='text' placeholder='neues Kenntwort bestätigen' onChange={handleChange} />
          <button className='settings-button' onClick={()=>changePassword()}>ändern</button>
        </form>
      </div>
    </div>
  )
}

const AvatarChange = ({toggleAvatarForm, client}) =>{
  const [newAvatarURL, setNewAvatarURL] = useState('');

  const handleChange = (e) => {
    setNewAvatarURL(e.target.value);
  }

  const changeAvatar = async() => {
    try{
      let update = {
        id: client.userID,
        set:{
          image: newAvatarURL
        }
      }
      await client.partialUpdateUser(update)
      cookies.set('avatar', newAvatarURL);
      toggleAvatarForm();
    } catch(err){
      console.log(err);
    }
    console.log('hi')
  }

  return(
    <div className='userSettings-change'>
      <div className='settings-head'>
        <div onClick={toggleAvatarForm}>
          <img src={returnicon} alt='return' width='80' />
        </div>
        <p> Avatar ändern</p>
      </div>
      <div className='settings-body'>
        <div className='icon4'>
          <img src={imageSwap}  alt='return' width='200' />
        </div>
        <input className='settings-input' name='newAvatarURL' type='text' placeholder='Neue Avatar URL' onChange={handleChange} /> 
        <button className='settings-button' onClick={()=>changeAvatar()}>ändern</button>
      </div>
    </div>
  )
}

const UserSettings = ({logout}) => {
  const [passForm, setPassForm] = useState(false);
  const [avatarForm, setAvatarForm] = useState(false);
  const [form, setForm] = useState({});
  const {client} = useChatContext();
  const [passwordMatch, setPasswordMatch] = useState(true);

  const togglePassForm = () =>{
    setPassForm((prev)=>!prev);
  }

  const toggleAvatarForm = () =>{
    setAvatarForm((prev)=>!prev);
  }

  const handleChange=(e)=>{
    setForm({...form, [e.target.name]: e.target.value});
      // Check password matching
    if (e.target.name === "confirmPass") {
      setPasswordMatch(e.target.value === form.password);
    }
  }

  if(passForm) return(
    <div className='userSettings-change-wrapper'>
      <PassChange 
        togglePassForm={togglePassForm}
        onChange={handleChange}
      />
    </div>
  )
  if(avatarForm) return(
    <div className='userSettings-change-wrapper'>
      <AvatarChange 
        toggleAvatarForm={toggleAvatarForm}
        client={client}
      />
      {console.log(client)}
    </div>
  )

  return (
    <div className='userSettings-wrapper'>
      <div>
        <div className='icon3' onClick={logout}>
          <img src={logoutIc} alt='Logout' title='Ausloggen' width='100' />
        </div>
      </div>
      <div className='userSettings-option' onClick={togglePassForm}>
        Passwort ändern
      </div>
      <div className='userSettings-option' onClick={toggleAvatarForm}>
        Avatar ändern
      </div>
    </div>
  )
}

export default UserSettings