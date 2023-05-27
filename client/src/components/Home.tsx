import '../index.css';
import {useSocket} from '../providers/socket';
import  { useState,useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');

  const navigate = useNavigate();
  const {socket} = useSocket();



  useEffect(() => {
    socket.on('room-join', (data: {roomId:string,name:string}) => {
      console.log("new user joined",data);
      navigate(`/room/${data.roomId}`);
    });
    return () => {
      socket.off('room-join');
    }
  }, [socket]);    

  const createRoom = (e:FormEvent) => {
    e.preventDefault();
    console.log(name,roomId);
    socket.emit('room-join'  ,{name,roomId});

  }

  return (
    <div className='Home'>
      <form >
        <input type="text" value={name} placeholder="Enter your name" onChange={(e)=>{setName(e.target.value)}}/>
        <input type="text" value={roomId} placeholder="Enter room id" onChange={(e)=>{setRoomId(e.target.value)}}/>
        <button  onClick={createRoom}>Join</button>
      </form>
    </div>
  )
}