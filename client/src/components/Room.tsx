import '../index.css';
import peer from "../providers/peer";
import { useSocket } from '../providers/socket';
import {useState, useEffect ,useCallback} from 'react';
import ReactPlayer from "react-player";

export default function Room() {

    const { socket } = useSocket();
    // const { peer } = usePeer();
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);



    const handleUserJoined = useCallback((data:{ name:string, id:string }) => {
        console.log(`user ${data.name} joined room`);
        setRemoteSocketId(data.id);
      }, []);
    
      const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
      }, [remoteSocketId, socket]);
    
      const handleIncommingCall = useCallback(
        async ({ from, offer }:{from:string,offer:any}) => {
          setRemoteSocketId(from);
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setMyStream(stream);
          console.log(`Incoming Call`, from, offer);
          const ans = await peer.getAnswer(offer);
          socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
      );
    
      const sendStreams = useCallback(() => {
        if(myStream)
            for (const track of myStream.getTracks()) {
                if (peer.peer)
                    peer.peer.addTrack(track, myStream);
            }
      }, [myStream]);

      const stopStreams = useCallback(() => {
        if(myStream)
            for (const track of myStream.getTracks()) {
                if (peer.peer && track)
                    peer.peer.removeTrack(peer.peer.getSenders()[0]);
            }
      }, [myStream]);
    
      const handleCallAccepted = useCallback(
        ({ from, ans }:{from:string,ans:any}) => {
          peer.setLocalDescription(ans);
          console.log("Call Accepted", from);
          sendStreams();
        },
        [sendStreams]
      );
    
      const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
      }, [remoteSocketId, socket]);
    
      useEffect(() => {
        if (peer.peer)
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            if (peer.peer)
          peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
      }, [handleNegoNeeded]);
    
      const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }:{from:string,offer:any}) => {
          const ans = await peer.getAnswer(offer);
          socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
      );
    
      const handleNegoNeedFinal = useCallback(async ({ ans }:{ans:any}) => {
        await peer.setLocalDescription(ans);
      }, []);
    
      useEffect(() => {
        if (peer.peer)
        peer.peer.addEventListener("track", async (ev:any) => {
          const remoteStream = ev.streams;
          console.log("GOT TRACKS!!");
          setRemoteStream(remoteStream[0]);
        });
      }, [remoteStream, peer.peer]);
    
      useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);
    
        return () => {
          socket.off("user:joined", handleUserJoined);
          socket.off("incomming:call", handleIncommingCall);
          socket.off("call:accepted", handleCallAccepted);
          socket.off("peer:nego:needed", handleNegoNeedIncomming);
          socket.off("peer:nego:final", handleNegoNeedFinal);
        };
      }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
      ]);
    
      return (
        <div>
          <h1>Room Page</h1>
          <h4>{remoteSocketId ? "Connected" : "No one in room"}</h4>
          {myStream && <button onClick={sendStreams}>Send Stream</button>}
          {myStream && <button onClick={stopStreams}>pause Stream</button>}
          {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
          {myStream && (
            <>
              <h1>My Stream</h1>
              <ReactPlayer
                playing
                muted
                height="100px"
                width="200px"
                url={myStream}
              />
            </>
          )}
          {remoteStream && (
            <>
              <h1>Remote Stream</h1>
              <ReactPlayer
                playing
                muted
                height="100px"
                width="200px"
                url={remoteStream}
              />
            </>
          )}
        </div>
      );
    };
