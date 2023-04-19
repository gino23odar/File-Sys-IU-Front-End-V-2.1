import React from 'react';

import {AddChannel} from '../assets/AddChannel.js';

// The TeamChannelList component is used to display the list of channels in a team or the list of DMs
const TeamChannelList = ({children, error=false, loading, type, isCrt, setIsCrt, setCreateTp, setIsRegis, setIsVis, setToggleContainer}) => {
  if(error){
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-listMessage'>
        Verbindungsfehler
        </p>
      </div>
    ) : null
  }

  if(loading){
    return(
      <div className='team-channel-list'>
        <p className='team-channel-listMessage'>
           {type === 'team' ? 'Channels': 'DMs'} Webanwendung wird geladen...
        </p>
      </div>
    )
  }
  return (
    <div className='team-channel-list'>
      <div className='team-channel-listHeader'>
        <p className='team-channel-listHeader-title'>
        {type === 'team'? 'Channels' : 'them DMs'} 
        </p>
        {type === 'team'
        ? ''
        :<AddChannel 
          isCrt={isCrt} 
          setIsCrt={setIsCrt} 
          setCreateTp={setCreateTp} 
          setIsRegis={setIsRegis}
          setIsVis={setIsVis}
          type={type === 'team'? 'team': 'messaging'}
          setToggleContainer={setToggleContainer}
        />
        }
      </div>
      {children}
    </div>
  );
}

export default TeamChannelList;