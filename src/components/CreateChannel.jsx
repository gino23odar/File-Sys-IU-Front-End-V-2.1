
import React, {useState} from 'react';
import {useChatContext} from 'stream-chat-react';

import {UserList} from './';

const CreateChannel = ({createTp, setIsCrt}) => {
  const {client, setActiveChannel} = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);
  const [channelName, setChannelName] = useState('');

  /**
   * This function creates a new chat channel/private-convo and sets it as the active channel.
   */
  const createChannel = async(e) =>{
    e.preventDefault();
    try {
      const newMessage = await client.channel(createTp, channelName, {name: channelName, members: selectedUsers})
      await newMessage.watch();

      setChannelName('');
      setIsCrt(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newMessage);

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='create-channelCont'>
      <div className='create-channelHeader'>
        <p>private Nachrichten schicken</p>
      </div>
      <UserList setSelectedUsers={setSelectedUsers}/>
      <div className='create-channel-button-wrapper' onClick={createChannel}>
        <p>Nachrichtengruppe erstellen</p>
      </div>
    </div>
  )
}

export default CreateChannel;