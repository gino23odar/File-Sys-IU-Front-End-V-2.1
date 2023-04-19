import React, {useEffect, useState} from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useChatContext } from 'stream-chat-react';
import Axios from 'axios';

const RegisterTable = ({setIsVis}) => {
  const [anmeldungenList, setAnmeldungenList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowStat, setSelectedRowStat] = useState([]);
  const {client} = useChatContext();

  /*dumm hard coded solution to bypassing the security to log in as admin
    the intention behind it is to avoid the need for an additional
    tool with the stream-chat API to manage the users*/
  const adminList = [
    "40a45ef8f30fc503feb5fd1b2ef620e6",
  ]

  const columns = [
     { field: 'id', headerName: 'ID', width: 70 },
     { field: 'Student', headerName: 'Student Name', width: 130 },
     { field: 'Fach', headerName: 'Fach', width: 80 },
     { field: 'Datum', headerName: 'Datum', type:'date', width: 110 },
     { field: 'DateiName', headerName: 'DateiName', width: 130 },
     { field: 'Seite', headerName: 'Seite', type: 'number',width: 90 },
     { field: 'Beschreibung', headerName: 'Beschreibung', width: 360 },
     { field: 'Status', headerName: 'Status', width: 130 },
   ];

  /**
   * The function maps selected row IDs and their corresponding status from an array of objects and
   * sets them as state variables.
   */
  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => anmeldungenList.find((row) => row.id === id));
    const selectedRowsIdArr = selectedRowsData.map((val)=>{ return val.id});
    const selectedRowsStatArr = selectedRowsData.map((val)=>{ return val.Status});
    console.log(selectedRowsIdArr);
    console.log(selectedRowsStatArr);
    setSelectedRows(selectedRowsIdArr);
    setSelectedRowStat(selectedRowsStatArr);
  };

  /**
   * The function deletes registrations from a database based on their IDs.
   */
  const deleteRegistration = (ids) =>{
    if(ids.length){
      for(let i = 0; i < ids.length; i++){
        Axios.delete(`https://file-iu-sys.herokuapp.com/api/delete/${ids[i]}`)
      }
      alert(`Zeilen mit ID: ${selectedRows} entfernt`);
    }
  }

  /**
   * The function updates the status of selected rows in a database using Axios.
   */
  const updateStatus = (ids, stat) =>{
    if(ids.length){
      for(let i = 0; i < ids.length; i++){
        if(stat[i] == 'NEU'){
          Axios.put(`https://file-iu-sys.herokuapp.com/api/update/${ids[i]}`, {Status: 'IM BEARBEITUNG'})
        } else if(stat[i] == 'IM BEARBEITUNG'){
          Axios.put(`https://file-iu-sys.herokuapp.com/api/update/${ids[i]}`, {Status: 'AKZEPTIERT'})
        } else {
          continue;
        } 
      }
      alert(`Status bei Zeilen mit ID: ${selectedRows} sktualisiert`);
    }
  }

  /**
   * This function rejects registration by updating the status of selected rows to "ABGELEHNT" using
   * Axios.
   */
  const rejectRegistration = (ids) =>{
    if(ids.length){
      for(let i = 0; i < ids.length; i++){
        Axios.put(`https://file-iu-sys.herokuapp.com/api/update/${ids[i]}`, {Status: 'ABGELEHNT'})
      }
      alert(`Zeilen mit ID: ${selectedRows} abgelehnt`);
    }
  }

  //useEffect hook to get items from db
  useEffect(() => {
    Axios.get("https://file-iu-sys.herokuapp.com/api/get").then((response)=>{
      setAnmeldungenList(response.data);
    })
  }, []) 


  return (
    <div>
      {adminList.includes(client.userID)? 
        <div>
          <div className='register-channelHeader-cont'>Anmeldungen</div>
          <div className='registerForm-cont'>
            <div className='authForm-contFields'>
              <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                  className='registerTable-gridCont'
                  rows={anmeldungenList}
                  onSelectionModelChange={(ids)=>onRowsSelectionHandler(ids)}
                  columns={columns} 
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                  />
              </div>
            </div>
          </div>
          {console.log(`this is : ${selectedRows}`)}
          {console.log(`this statuses : ${selectedRowStat}`)}
          {console.log(client.userID)}
          <div className='register-channelFooter-cont'>
            <button className = 'team-channel-registrationButton-return' onClick={()=>{if(setIsVis){setIsVis((prevState)=> !prevState)}}}>Anmeldungen</button>
            <button className = 'team-channel-statusChangeButton' onClick={()=>{updateStatus(selectedRows, selectedRowStat)}}>Status andern</button>
            <button className = 'team-channel-denyButton-return' onClick={()=>{rejectRegistration(selectedRows)}}>Ablehnen</button>
            <button className = 'team-channel-deleteButton-return' onClick={()=>{deleteRegistration(selectedRows)}}>Loschen</button>
          </div>
        </div> : 
        <div>
        <div className='register-channelHeader-cont'>Anmeldungen</div>
        <div className='registerForm-cont'>
          <div className='authForm-contFields'>
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                className='registerTable-gridCont'
                rows={anmeldungenList}
                onSelectionModelChange={(ids)=>onRowsSelectionHandler(ids)}
                columns={columns} 
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                />
            </div>
          </div>
        </div>
        {console.log(`this is : ${selectedRows}`)}
        {console.log(`this statuses : ${selectedRowStat}`)}
        {console.log(client.userID)}
        <div className='register-channelFooter-cont'>
          <button className = 'team-channel-registrationButton-return' onClick={()=>{if(setIsVis){setIsVis((prevState)=> !prevState)}}}>Anmeldungen</button>
        </div>
      </div>}
    </div>
  )
}

export default RegisterTable