import React from 'react';
import logoutIc from '../assets/logout.svg';

const UserSettings = ({logout}) => {
  return (
    <div className='userSettings-wrapper'>
      <div>
        <div className='icon3' onClick={logout}>
          <img src={logoutIc} alt='Logout' title='Ausloggen' width='100' />
        </div>
      </div>
      <div className='userSettings-option'>
        Passwort ändern
      </div>
      <div className='userSettings-option'>
        Avatar ändern
      </div>
    </div>
  )
}

export default UserSettings