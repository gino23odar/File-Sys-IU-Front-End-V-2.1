import React, {useEffect, useState} from 'react';
import {Avatar, useChatContext} from 'stream-chat-react';

import {InviteIcon} from '../assets/InviteIcon.js';

const ListCont = ({children}) =>{
  return(
    <div className='user-listCont'>
      <div className='user-listHeader' >
        <p>Benutzer</p>
        <p>Einladen</p>
      </div>
      {children}
    </div>
  )
}

/**
 * This is a React component that renders a user item with the ability to toggle selection and update a
 * list of selected users.
 */
const UserItem = ({user, setSelectedUsers}) =>{
  const [selected, setSelected] = useState(false);

  /**
   * This function toggles the selection of a user and updates the list of selected users accordingly.
   */
  const handleSelect = () =>{
    if(selected){
      setSelectedUsers((prevUsers)=>prevUsers.filter((prevUser) => prevUser !== user.id))
    } else{
      setSelectedUsers((prevUsers) => [...prevUsers, user.id])
    }

    setSelected((prevSelected)=> !prevSelected);
  }

  return(
    <div className='user-itemWrapper' onClick={handleSelect}>
      <div className='user-item-nameWrapper'>
        <Avatar image={user.image} name={user.fullName || user.id} size={32}/>
        {/* the stream-chat user name is under .name, users do not become a .fullName */}
        <p className='user-item-name'>{user.name || user.id}</p>
      </div>
      {selected? <InviteIcon /> : <div className='user-item-invite-empty' />}
    </div>
  )
}

const UserList = ({setSelectedUsers}) =>{
  const { client } = useChatContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listEmpty, setListEmpty] = useState(false);
  const [error, setError] = useState(false);

  /* This is a useEffect hook that is fetching a list of users from the Stream Chat API and updating
  the state of the component with the fetched data. It runs only once when the component mounts (due
  to the empty dependency array []) and checks if the loading state is false before making the API
  call. If loading is true, it returns early and does not make the API call. If loading is false, it
  sets the loading state to true, makes the API call using the client.queryUsers method, and updates
  the state with the fetched data. If there is an error, it sets the error state to true. Finally,
  it sets the loading state to false. */
  useEffect(() => {
    const getUsers = async () =>{
      if(loading) return;

      setLoading(true);

      try {
        //exclude the current user from the query of users
        const response = await client.queryUsers(
          {id: {$ne: client.userID}},
          {id: 1},
          {limit: 8}
        );

        if(response.users.length){
          setUsers(response.users);
        } else {
          setListEmpty(true);
        }
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    }

    if(client) getUsers()
  }, []);

  if(error){
    return(
      <ListCont>
        <div className='user-listMessage'>
          Fehler beitritt.
        </div>
      </ListCont>
    )
  }

  if(listEmpty){
    return(
      <ListCont>
        <div className='user-listMessage'>
          Keine Benutzer.
        </div>
      </ListCont>
    )
  }
  

  return(
    <ListCont>
      {loading? <div className='user-listMessage'>
        Benutzer werden geladen...
      </div> : (
        users?.map((user, i)=>(
          <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers}/>
        ))
      )}
    </ListCont>
  )
}

export default UserList;