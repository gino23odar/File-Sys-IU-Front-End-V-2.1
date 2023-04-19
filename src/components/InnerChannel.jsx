//check what is passed to the input (text, gif, attachment...)
import React, { useState } from 'react';
import { Avatar, MessageList, useChannelActionContext, MessageInput, Thread, useChannelStateContext, useChatContext, Window } from 'stream-chat-react';
import { ChannelInfo } from "../assets/ChannelInfo.js";

const HeaderTC = () => {
    const { channel} = useChannelStateContext();
    const { client } = useChatContext();
  
    /**
     * The HeaderMsg function displays information about the members of a messaging channel or the name
     * and ID of a non-messaging channel.
     * @returns The `HeaderMsg` component is returning either a list of members in a messaging channel
     * or the name of a channel and a tooltip with its ID, depending on the type of the channel.
     */
    const HeaderMsg = () => {
      const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
      const extraMembers = members.length - 6;
  
      if(channel.type === 'messaging') {
        return (
          <div className='team-nameWrapper'>
            {<p> {members.length} Benutzer:</p>}
            {members.map(({ user }, i) => (
              <div key={i} className='team-name-multi'>
                <Avatar  
                  name={user.fullName || user.id} 
                  image={user.image}size={28} 
                />
                <p className='team-name user'>{user.fullName || user.id}</p>
              </div>
            ))}
            {extraMembers > 0 && <p className='team-name user'>und {extraMembers} extra</p>}
          </div>
        );
      }
  
      return (
        <div className='team-channelHeader-channelWrapper'>
          <p className='team-channelHeader-name'># {channel.data.name}</p>
          <div className = 'tooltip'>
            <ChannelInfo/>
              <span className = 'tooltiptext'>{channel.data.cid}</span>
          </div>
        </div>
      );
    };
  
    return (
      <div className='team-channelHeader-cont'>
        <HeaderMsg />
      </div>
    );
  };

export const GiphyC = React.createContext({});

const InnerChannel = ({ setIsRegis }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();
  
  /**
   * The function overrides the submit handler for a message and updates the message with attachments,
   * mentioned users, parent ID, parent, and text, and adds a Giphy command if the Giphy state is true.
   */
  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };
    
    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }
    
    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyC.Provider value={{ giphyState, setGiphyState }}>
      <div style={{ display: 'flex', width: '100%' }}>
        <Window>
          <HeaderTC/>
          <MessageList />
          {/* fit the button to be next to the input component */}
          <div className = 'team-channel-inputControl'>
          <button className = 'team-channel-registrationButton' onClick={()=>{if(setIsRegis){setIsRegis((prevState)=> !prevState)}}}>Anmeldungen</button>
            <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
          </div>
        </Window>
        <Thread />
      </div>
    </GiphyC.Provider>
  );
};

  export default InnerChannel;