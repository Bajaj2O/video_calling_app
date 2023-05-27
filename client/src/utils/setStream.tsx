// let localStream: MediaStream;
// let remoteStream: MediaStream;
// let peerConnection: RTCPeerConnection;

// const iceServers = {
//     iceServers: [
//         {
//             urls: 'stun:stun.stunprotocol.org'
//         }
//     ]


// }

// const setRemoteStream = async  ()=>{
//     remoteStream = new MediaStream();
//     peerConnection = new RTCPeerConnection(iceServers);
//     let remote = document.getElementById('2') as HTMLVideoElement
//     if(remote)
//         remote.srcObject = remoteStream;

//     peerConnection.ontrack = (event) => {
//         remoteStream.addTrack(event.track);
//     }

//     peerConnection.onicecandidate = (event) => {
//         if(event.candidate){
//             console.log('new ice candidate');
//         }

//     }
    

//     const offer = await peerConnection.createOffer();
//     await peerConnection.setLocalDescription(offer);
   
// }

// export const setLocalStream = async () => {
//     localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
//     let local = document.getElementById('1') as HTMLVideoElement
//     if(local)
//         local.srcObject = localStream;
//     else
//         console.log('local video element not found');

//     localStream.getTracks().forEach(track => {  
//         peerConnection.addTrack(track, localStream);
//     });

//     setRemoteStream();

// }   
