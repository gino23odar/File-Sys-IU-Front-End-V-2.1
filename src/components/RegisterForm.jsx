import React, {useState} from 'react';
import Cookies from 'universal-cookie';
import Axios from 'axios';

const cookies = new Cookies();


const RegisterForm = ({setIsRegis, setIsVis}) => {
  const [fach, setFach] = useState('');
  const [dateiName, setDateiName] = useState('');
  const [seite, setSeite] = useState('');
  const [beschreibung, setBeschreibung] = useState('');

  const student = cookies.get('phone Nr.')|| cookies.get('fullName');

  /**
   * The function submits the registration form outlined in the return statement
   * to the heroku server and displays an alert message.
   */
  const submitRegistration = (event) =>{
    event.preventDefault()
    Axios.post("https://file-iu-sys.herokuapp.com/api/insert", {
      Student: student,
      Fach: fach,
      DateiName: dateiName,
      Seite: seite,
      Beschreibung: beschreibung
    }).then((response)=>{
      alert(response);
    }, (err)=>{
      alert(err);
    })
    alert('register made, please check in the list');
  };

  return (
    <div>
      <div className='register-channelHeader-cont'>RegisterForm</div>
      <div className='registerForm-cont'>
        <div className='authForm-contFields'>
          <div className='registerForm-contFields-cont'>
            <div>
              <p>Deine Name: {student}</p>
            </div>
            <form onSubmit={submitRegistration}>
              {/* <div className='authForm-contFields-content-input'>
                <label htmlFor='Student'>Deine Name</label>
                <input name='Student' type='text' placeholder='Name' onChange={(e)=>{ setStudent(e.target.value);}} required/>
              </div> */}
              <div className='authForm-contFields-content-input'>
                <label htmlFor='Fach'>Fach</label>
                <input name='Fach' type='text' placeholder='Fach' onChange={(e)=>{ setFach(e.target.value);}} required/>
              </div>
              <div className='registerForm-contFields-contInput'>
                <label htmlFor='DateiName'>Datei Name</label>
                <input name='DateiName' type='text' placeholder='Datei Name' onChange={(e)=>{ setDateiName(e.target.value);}} required/>
              </div>
              <div className='registerForm-contFields-contInput'>
                <label htmlFor='Seite'>Seite</label>
                <input name='Seite' type='number' placeholder='Nr.' onChange={(e)=>{ setSeite(e.target.value);}} required/>
              </div>
              <div className='authForm-contFields-content-input'>
                <label htmlFor='Beschreibung'>Beschreibung</label>
                <textarea id='beschreibung' name='Beschreibung' type='text' placeholder='Beschreibung' onChange={(e)=>{ setBeschreibung(e.target.value);}} />
              </div>
              <div>
                {/* <input name='Datum' type='hidden'>{currentDate()}</input>*/}
              </div>
              <div className='authForm-contFields-content-button'>
                <button>Einreichen</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='register-channelFooter-cont'>
        <button className = 'team-channel-registrationButton-return' onClick={()=>{if(setIsRegis){setIsRegis((prevState)=> !prevState)}}}>Anmeldungen</button>
        <button className = 'team-channel-registrationButton-return' onClick={()=>{if(setIsVis){setIsVis((prevState)=> !prevState)}}}>Liste</button>
      </div>
    </div>
  )
}

export default RegisterForm