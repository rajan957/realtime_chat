let localStream;
let peerConnection;
const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

function startVoiceCall() {
  startCall(false);
}
function startVideoCall() {
  startCall(true);
}

function startCall(withVideo) {
  navigator.mediaDevices.getUserMedia({ video: withVideo, audio: true }).then(stream => {
    localStream = stream;
    peerConnection = new RTCPeerConnection(config);
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate);
      }
    };

    peerConnection.ontrack = event => {
      const remoteVideo = document.getElementById('remote-video');
      remoteVideo.srcObject = event.streams[0];
    };

    peerConnection.createOffer().then(offer => {
      peerConnection.setLocalDescription(offer);
      socket.emit('offer', offer);
    });

    const localVideo = document.getElementById('local-video');
    localVideo.srcObject = stream;
  });
}

socket.on('offer', offer => {
  peerConnection = new RTCPeerConnection(config);
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localStream = stream;
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer().then(answer => {
      peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer);
    });
    document.getElementById('local-video').srcObject = stream;
  });

  peerConnection.ontrack = event => {
    document.getElementById('remote-video').srcObject = event.streams[0];
  };

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  };
});

socket.on('answer', answer => {
  peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
});

socket.on('candidate', candidate => {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
});
