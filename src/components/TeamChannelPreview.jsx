import React from 'react';
import {Avatar, useChatContext} from 'stream-chat-react';

const TeamChannelPreview = ({setActiveChannel, setIsCrt, setIsRegis, setIsVis, setToggleContainer, channel, type}) => {
  const {channel: activeChannel, client} = useChatContext();
  
  const ChannelPreview =()=>(
    <p className='channel-preview-item'>
      #{channel?.data?.name || channel?.data?.id}
    </p>
  );

  /**
   * The DirectPreview function returns a component that displays the avatar and name of the first
   * member in a channel, excluding the current user.
   */
  const DirectPreview = () =>{
    const members = Object.values(channel.state.members).filter(({user})=>user.id !== client.userID)
    return(
      <div className='channel-preview-item single'>
        <Avatar 
          image={members[0]?.user?.image}
          name={members[0]?.user?.fullName || members[0]?.user?.id}
          size={30}
        />
        <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
      </div>
    )
  }
  
  return (
    <div className={
      channel?.id === activeChannel?.id 
      ? 'channel-previewWrapper-selected'
      : 'channel-previewWrapper'
    }
    onClick ={()=>{
      setIsCrt(false);
      setIsRegis(false);
      setIsVis(false);
      setActiveChannel(channel);

      if(setToggleContainer){
        setToggleContainer((prevState) => !prevState)
      }
    }}>
      {type === 'team' ? <ChannelPreview /> : <DirectPreview/>}
    </div>
  );
}

export default TeamChannelPreview;