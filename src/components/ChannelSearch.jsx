import React, {useState, useEffect} from 'react';
import {useChatContext} from 'stream-chat-react';

import {ResultsDropdown} from './';
import {SearchIcon} from '../assets/SearchIcon.js';

const ChannelSearch = ({setToggleContainer}) => {
  //useState hooks
  const [teamChannel, setTeamChannel] = useState([]);
  const [dmChannels, setDmChannels] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const {client, setActiveChannel} = useChatContext();
  


  /* This `useEffect` hook is watching for changes in the `query` state variable. If the `query` state
  variable is empty, it will set the `teamChannel` and `dmChannels` state variables to empty arrays.
  This is useful for resetting the search results when the user clears the search input field. */
  useEffect(() => {
    if(!query){
      setTeamChannel([]);
      setDmChannels([]);
    }
  }, [query])

  /* The function fetches channels and users based on a search query and sets the state of team and
   direct message channels accordingly.*/
  const getChannel = async(text) =>{
    try{
      //filter Channels
      const channelResponse = client.queryChannels({
        name: {$autocomplete: text}, 
        members: {$in: [client.userID]},
        type: 'team', 
      });
      const userResponse = client.queryUsers({
        id: {$ne: client.userID},
        name: {$autocomplete: text},

      });

      const [channels, {users}] = await Promise.all([channelResponse, userResponse]);
      
      if(channels.length) setTeamChannel(channels);
      if(users.length) setDmChannels(users);
    }catch(error){
      setQuery('')
    }
  }

  /*This function sets the query value and calls another function to get a channel based on the query
  value, while also setting the loading state to true.*/
  const lookUp = (event) => {
    //avoid reloading the page
    event.preventDefault();
    setQuery(event.target.value);
    getChannel(event.target.value);
    setLoading(true);
  }

  const setChannel = (channel) =>{
    setQuery('');
    setActiveChannel(channel);
  }

  return (
    <div className='channel-search-cont'>
      <div className='channel-search-inputWrapper'>
        <input className='channel-search-inputText' placeholder='Look Up teams or users' type='text' value={query} onChange={lookUp}/>
        <div className='channel-search-inputIcon'>
          <SearchIcon/>
        </div>
      </div>
      {query && (
        <ResultsDropdown 
          loading={loading}
          teamChannels={teamChannel}
          setQuery={setQuery}
          setToggleContainer={setToggleContainer}
          directChannels={dmChannels}
          setChannel={setChannel}
          
        />
      )}
    </div>
  )
}

export default ChannelSearch