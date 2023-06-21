import React, {useState, useEffect} from 'react';
import {ChannelList, useChatContext} from 'stream-chat-react';
import Cookies from 'universal-cookie';

import {ChannelSearch, TeamChannelList, TeamChannelPreview, UserSettings} from './';
import IUicon from '../assets/IU-logo.svg';
import logouticon from '../assets/logouticon.jpg';
import gearicon from '../assets/gear-icon.svg';

const cookies = new Cookies();

/*
 * This is a functional component for a sidebar with icons for navigating to the main chat page and
 * logging out.
 */
const SideBar = ({logout, setIsCrt, setIsRegis, setIsVis, toggleSettings, toggleGear}) => (
  <div className='channel-list-sidebar'>
    <div className='channel-list-sidebar-icon1'>
      <div className='icon1' onClick={()=>{setIsCrt(false); setIsRegis(false); setIsVis(false);}}>
        <img src={IUicon} alt='Chat' width='auto' />
      </div>
    </div>
    <div className='channel-list-sidebar-icon2'>
      <div className='icon2' onClick={logout}>
        <img src={logouticon} alt='Logout' width='30' />
      </div>
      <div className='icon2' onClick={toggleGear}>
        <img src={gearicon} alt='Settings' width='30' />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => (
  <div className='channel-listHeader'>
    <p className='channel-listHeader-text'>File-SYS IU</p>
  </div>
)

const customChannelTeamFilter = (channels)=>{
  return channels.filter((channel) => channel.type === 'team');
}

const customChannelDMsFilter = (channels)=>{
  return channels.filter((channel) => channel.type === 'messaging');
}

/* The `ChannelListContent` component renders the general outlook of the right
  panel of the application (save for the sidebar) */
const ChannelListContent = ({isCrt, setIsCrt, setCreateTp, setIsRegis, setIsVis, setToggleContainer, toggleSettings, toggleGear}) => {
  const {client} = useChatContext();
  
  // clear the cookies to logout
  const logout = () =>{
    cookies.remove('token');
    cookies.remove('userId');
    cookies.remove('username');
    cookies.remove('fullName');
    cookies.remove('avatarURL');
    cookies.remove('hashedPass');
    cookies.remove('phone Nr.');

    window.location.reload();
  }

  const filters = {members: {$in: [client.userID]}}

  return (
    <>
      {toggleSettings && 
        <UserSettings 
          logout={logout}/>
      }
      <div className='channel-list__list-wrapper'>
        <CompanyHeader />
        <ChannelSearch />
        <ChannelList 
          filters={filters} 
          channelRenderFilterFn={customChannelTeamFilter} 
          List={(listProps)=>(
            <TeamChannelList 
              {...listProps} 
              type='team' 
              isCrt={isCrt} 
              setIsCrt={setIsCrt} 
              setCreateTp={setCreateTp} 
              setIsRegis={setIsRegis} 
              setIsVis={setIsVis}
              setToggleContainer={setToggleContainer}
            />)} 
            Preview={(previewProps)=>(
              <TeamChannelPreview 
                {...previewProps} 
                setIsCrt={setIsCrt} 
                setIsRegis={setIsRegis} 
                setIsVis={setIsVis}
                setToggleContainer={setToggleContainer}  
                type='team'
              />
            )}
        />
        <ChannelList 
          filters={filters} 
          channelRenderFilterFn={customChannelDMsFilter} 
          List={(listProps)=>(
            <TeamChannelList 
              {...listProps} 
              type='messaging'
              isCrt={isCrt} 
              setIsCrt={setIsCrt} 
              setCreateTp={setCreateTp} 
              setIsRegis={setIsRegis} 
              setIsVis={setIsVis}
              setToggleContainer={setToggleContainer}
            /> 
          )} 
          Preview={(previewProps) =>(
            <TeamChannelPreview 
              {...previewProps} 
              type='messaging'
              setIsCrt={setIsCrt} 
              setIsRegis={setIsRegis}
              setIsVis={setIsVis} 
              setToggleContainer={setToggleContainer}
            />
          )}
        />
      </div>
      <SideBar 
        logout={logout}
        setIsCrt={setIsCrt} 
        setIsRegis={setIsRegis} 
        setIsVis={setIsVis}
        toggleSettings={toggleSettings}
        toggleGear={toggleGear}/>
    </>
  );
}

const ChannelListContainer = ({setCreateTp, setIsCrt, setIsRegis, setIsVis}) =>{
  const [toggleContainer, setToggleContainer] = useState(false);
  const [toggleSettings, setToggleSettings] = useState(false);

  const toggleGear = () =>{
    setToggleSettings((prev) => !prev);
  }

  useEffect(() => {
    if (toggleSettings) {
      document.body.classList.add('userSettings-wrapper-visible');
    } else {
      document.body.classList.remove('userSettings-wrapper-visible');
    }
  }, [toggleSettings]);

  return(
    <>
      {console.log(toggleSettings)}
      <div className='channel-list-cont'>
        <ChannelListContent 
          setIsCrt ={setIsCrt}
          setCreateTp ={setCreateTp}
          setIsRegis = {setIsRegis}
          setIsVis={setIsVis}
          toggleSettings={toggleSettings}
          toggleGear={toggleGear}
        />
      </div>
    
      <div className='channel-list-cont-responsive' style={{left: toggleContainer ? '0%' : '-89%', backgroundColor: '#005fff'}}>
        <div className='channel-list-cont-toggle' onClick={()=> setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
        </div>
        <ChannelListContent 
          setIsCrt ={setIsCrt}
          setCreateTp ={setCreateTp}
          setIsRegis = {setIsRegis}
          setIsVis={setIsVis}
          setToggleContainer={setToggleContainer}
        />
      </div>
    </>
  )
}

export default ChannelListContainer;