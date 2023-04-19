import React from 'react';
import {Channel, MessageTeam} from 'stream-chat-react';

import {InnerChannel, CreateChannel, RegisterForm, RegisterTable} from './';

/* The ChannelContainer component renders a different component
* depending on the value of the isCrt, isRegis and isVis states
  the state of the props is defined by other components*/
const ChannelContainer = ({isCrt, setIsCrt, isRegis, setIsRegis, isVis, setIsVis, createTp}) => {

   if(isCrt){
     return (
       <div className='channelCont'>
         <CreateChannel createTp={createTp} setIsCrt={setIsCrt}/>
       </div>
     )
  }

  if(isVis){
    return (
      <div className='channelCont-dark'>
        <RegisterTable setIsVis={setIsVis}/>
      </div>
    )
  }

  if(isRegis){
    return (
      <div className='channelCont-dark'>
        <RegisterForm setIsRegis={setIsRegis} setIsVis={setIsVis}/>
      </div>
    )
  }

  const EmptyState = () =>(
    <div className='channel-empty-cont'>
      <p className='channel-empty1'>Hier beginnt Ihr Chatverlauf.</p>
      <p className='channel-empty2'>Erlaubt sind: Nachrichten, Anlagen, links und Emojis.</p>
    </div>
  )
  
  return (
    <div className='channelCont'>
      <Channel
        EmptyStateIndicator={EmptyState} 
        //display all the messages sent by users.
        Message={(messageProps, i)=> <MessageTeam key={i} {...messageProps}/>}
      >
        <InnerChannel setIsRegis={setIsRegis}/>
      </Channel>
    </div>
  );
}

export default ChannelContainer;