import React, {useState} from 'react';
import {StreamChat} from 'stream-chat';
import {Chat} from 'stream-chat-react';
import Cookies from 'universal-cookie';
import {Auth, ChannelContainer, ChannelListContainer} from './components';
//stream chats pre defined css to save time
import 'stream-chat-react/dist/css/index.css';
import './App.css';

const cookies = new Cookies();
const apiKey = 'bv4vx5f2vtnj';
const authToken = cookies.get('token');
//create instance of streamChat
const client = StreamChat.getInstance(apiKey);

//connect user through cookies
if(authToken){
  client.connectUser({
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    id: cookies.get('userId'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPass'),
    phoneNr: cookies.get('phone Nr.')
  }, authToken)
}

/**
 * This is a functional component that renders the main container if the application with channel containers and a channel
 * list container, and conditionally renders an authentication component based on the presence of an
 * authentication token.
 */
const App = () => {
  const [createTp, setCreateTp] = useState('');
  const [isCrt, setIsCrt] = useState(false);
  const [isRegis, setIsRegis] = useState(false);
  const [isVis, setIsVis] = useState(false);

  if(!authToken) return <Auth />

  return (
    <div className='appWrapper'>
      <Chat client={client} theme='team light' >
        <ChannelContainer 
          isCrt = {isCrt}
          setIsCrt = {setIsRegis}
          isRegis = {isRegis}
          setIsRegis = {setIsRegis}
          isVis = {isVis}
          setIsVis = {setIsVis}
          createTp = {createTp}
        />
        <ChannelListContainer 
          isCrt = {isCrt}
          setIsCrt = {setIsCrt}
          setCreateTp = {setCreateTp}
          setIsRegis = {setIsRegis}
          setIsVis = {setIsVis}
        />
      </Chat>
    </div>
  );
}

export default App;