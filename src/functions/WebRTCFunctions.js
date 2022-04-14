export const WebRTCFunctions = (localStream, remoteStream, localVideoRef, remoteVideoRef,
                                peerConnection, configuration, teachingRoomRef, tutorCandidatesCollectionRef, studentCandidatesCollectionRef) => {

    const startWebcam = async (localStream, localVideoRef) => {
        console.log("Webcam starting...")
        await navigator
            .mediaDevices
            .getUserMedia(
                {
                    video: true,
                    audio: true
                }
            )
            .then(mediaStream => {
                // console.log(mediaStream.getVideoTracks()[0].getSettings())
                // console.log(mediaStream.getVideoTracks()[1].getSettings())
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;
            });
        console.log(localStream.current.getTracks())
        remoteVideoRef.current.srcObject = remoteStream.current;
    };

    const startScreenShare = async (localStream, localVideoRef) => {
        console.log("Webcam starting...")
        await navigator
            .mediaDevices
            .getDisplayMedia(
                {
                    video: true,
                    audio: true
                }
            )
            .then(mediaStream => {
                console.log(mediaStream.getTracks())
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;
            });
        remoteVideoRef.current.srcObject = remoteStream.current;
    };

    const stopMediaStream = (localStream) => {
        console.log("Webcam stopping...")
        localStream.current.getTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
        })
    };

    const createRoom = async () => {
        console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection.current = new RTCPeerConnection(configuration);

        localStream.current.getTracks().forEach(track => {
            console.log(track)
            peerConnection.current.addTrack(track, localStream.current);
        });

        peerConnection.current.addEventListener('icecandidate', tutorIceCandidateEventListener);
        await createOffer();
        peerConnection.current.addEventListener('track', trackEventListener);
        teachingRoomSnapshot();
        studentCandidatesSnapshot();
    };

    const createOffer = async () => {
        // Code for creating a room below
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        console.log('Created offer:', offer);

        const roomWithOffer = {
            'offer': {
                type: offer.type,
                sdp: offer.sdp,
            },
        };
        await teachingRoomRef.current.update(roomWithOffer);
        // Code for creating a room above
    }

    const joinRoom = async () => {
        const roomSnapshot = await teachingRoomRef.current.get();
        console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            console.log('Create PeerConnection with configuration: ', configuration);
            peerConnection.current = new RTCPeerConnection(configuration);

            localStream.current.getTracks().forEach(track => {
                console.log(track)
                peerConnection.current.addTrack(track, localStream.current);
            });

            peerConnection.current.addEventListener('icecandidate', studentIceCandidateEventListener);
            peerConnection.current.addEventListener('track', trackEventListener);
            await createAnswer(roomSnapshot);
            teachingRoomSnapshot();
            tutorCandidatesSnapshot();
        }
    }

    const createAnswer = async (roomSnapshot) => {
        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.current.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };
        await teachingRoomRef.current.update(roomWithAnswer);
        // Code for creating SDP answer above
    }

    const tutorIceCandidateEventListener = (event => {
        event.candidate && tutorCandidatesCollectionRef.current.add(event.candidate.toJSON())
    });

    const studentIceCandidateEventListener = (event => {
        event.candidate && studentCandidatesCollectionRef.current.add(event.candidate.toJSON())
    });

    const trackEventListener = (event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            remoteStream.current.addTrack(track);
        });
    });

    const teachingRoomSnapshot = () => {
        teachingRoomRef.current.onSnapshot(async (snapshot) => {
            const data = snapshot.data();
            if (!peerConnection.current.currentRemoteDescription && data && data.answer) {
                console.log('Got remote description: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await peerConnection.current.setRemoteDescription(rtcSessionDescription)
                    .catch(() => {
                        console.log("Connection closed!")
                    })
            }
        });
    };

    const tutorCandidatesSnapshot = () => {
        teachingRoomRef.current.collection('tutorCandidates').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                        .catch(() => {
                            console.log("Connection closed!")
                        })
                }
            });
        });
    }

    const studentCandidatesSnapshot = () => {
        studentCandidatesCollectionRef.current.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                        .catch(() => {
                            console.log("Connection closed!")
                        })
                }
            });
        });
    };

    return {startWebcam, startScreenShare, stopMediaStream, createRoom, joinRoom};
}



