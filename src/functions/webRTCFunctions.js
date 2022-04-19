import {RTCPeerConnectionConfiguration, RTCPeerConnectionOfferOptions} from "../config/webRTCConfig";

export const WebRTCFunctions = (role, localStream, remoteStream, localVideoRef, remoteVideoRef, peerConnection,
                                teachingRoomRef, tutorCandidatesCollectionRef, studentCandidatesCollectionRef, setConnectionState) => {

    const startWebcam = async (localStream, localVideoRef) => {
        // console.log("Webcam starting...")
        await navigator
            .mediaDevices
            .getUserMedia(
                {
                    video: true,
                    audio: true
                }
            )
            .then(mediaStream => {
                console.log(mediaStream)
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;
            });

    };

    const startScreenShare = async (localStream, localVideoRef) => {
        // console.log("Webcam starting...")
        await navigator
            .mediaDevices
            .getDisplayMedia(
                {
                    video: true,
                    audio: true
                }
            )
            .then(mediaStream => {
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;
            });
    };

    const stopLocalMediaStream = (localStream) => {
        // console.log("Webcam stopping...")
        localStream.current.getTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
        })
    };

    const createRoom = async () => {
        remoteVideoRef.current.srcObject = remoteStream.current;

        // console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

        peerConnection.current.addEventListener('iceconnectionstatechange', iceConnectionStateEventListener);
        peerConnection.current.addEventListener('negotiationneeded', negotiationNeededEventListener);
        peerConnection.current.addEventListener('signalingstatechange', signalingStateChangeEventListener);

        localStream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream.current);
        });

        peerConnection.current.addEventListener('icecandidate', tutorIceCandidateEventListener);
        await createOffer();
        peerConnection.current.addEventListener('track', trackEventListener);
        teachingRoomSnapshot();
        studentCandidatesSnapshot();

    };

    const joinRoom = async () => {
        remoteVideoRef.current.srcObject = remoteStream.current;
        const roomSnapshot = await teachingRoomRef.current.get();
        // console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            // console.log('Create PeerConnection with configuration: ', configuration);
            peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

            peerConnection.current.addEventListener('iceconnectionstatechange', iceConnectionStateEventListener);

            localStream.current.getTracks().forEach(track => {
                // console.log(track)
                peerConnection.current.addTrack(track, localStream.current);
            });

            peerConnection.current.addEventListener('icecandidate', studentIceCandidateEventListener);
            peerConnection.current.addEventListener('track', trackEventListener);
            await createAnswer(roomSnapshot);
            teachingRoomSnapshot();
            tutorCandidatesSnapshot();
        }
    }

    const createOffer = async () => {

        const offer = await peerConnection.current.createOffer(RTCPeerConnectionOfferOptions);
        await peerConnection.current.setLocalDescription(offer);
        console.log('Created offer:', offer);

        const roomWithOffer = {
            'offer': {
                type: offer.type,
                sdp: offer.sdp,
                role: role

            },
        };
        // console.log(roomWithOffer)

        await teachingRoomRef.current.update(roomWithOffer);
    }

    const createAnswer = async (roomSnapshot) => {
        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.current.createAnswer(RTCPeerConnectionOfferOptions);
        console.log('Created answer:', answer);
        await peerConnection.current.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
                role: role
            },
        };
        await teachingRoomRef.current.update(roomWithAnswer);
        // Code for creating SDP answer above
    }

    const updateMediaStream = async () => {
        const senders = peerConnection.current.getSenders();
        senders.forEach((sender) => peerConnection.current.removeTrack(sender));

        localStream.current.getTracks().forEach(track => {
            console.log(track)
            peerConnection.current.addTrack(track, localStream.current);
        });

        // const answer = await peerConnection.current.createAnswer(RTCPeerConnectionOfferOptions);
        // console.log('Created answer:', answer);
        // await peerConnection.current.setLocalDescription(answer);
        //
        // const roomWithAnswer = {
        //     answer: {
        //         type: answer.type,
        //         sdp: answer.sdp,
        //         role: role
        //     },
        // };
        // await teachingRoomRef.current.update(roomWithAnswer);
        await createOffer();
    }

    const tutorIceCandidateEventListener = event => {
        event.candidate && tutorCandidatesCollectionRef.current.add(event.candidate.toJSON())
    };

    const studentIceCandidateEventListener = event => {
        event.candidate && studentCandidatesCollectionRef.current.add(event.candidate.toJSON())
    };

    const iceConnectionStateEventListener = event => {
        event.currentTarget && event.currentTarget.iceConnectionState && setConnectionState(event.currentTarget.iceConnectionState);
    };

    const negotiationNeededEventListener = event => {
        console.log("Negotiation needed")
        console.log(peerConnection.current)
        console.log(event)
    };

    const signalingStateChangeEventListener = event => {
        console.log("signalingStateChangeEventListener")
        console.log(peerConnection.current)
        console.log(event)
    };

    const trackEventListener = event => {
        console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
            console.log('Add a track to the remoteStream:', track);
            remoteStream.current.addTrack(track);
        });
    };

    const teachingRoomSnapshot = () => {
        teachingRoomRef.current.onSnapshot(async (snapshot) => {
            // console.log("HAHOHAHOAHO")
            const data = snapshot.data();
            if (!peerConnection.current.currentRemoteDescription && data && data.answer && peerConnection.current.signalingState !== "closed") {
                // console.log('Got remote description: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                await peerConnection.current.setRemoteDescription(rtcSessionDescription)
            }
        });
    };


    const tutorCandidatesSnapshot = () => {
        tutorCandidatesCollectionRef.current.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidateTU: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                }
            });
        });
    }

    const studentCandidatesSnapshot = () => {
        studentCandidatesCollectionRef.current.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                    let data = change.doc.data();
                    console.log(`Got new remote ICE candidateST: ${JSON.stringify(data)}`);
                    await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
                }
            });
        });
    };

    return {
        startWebcam,
        startScreenShare,
        stopMediaStream: stopLocalMediaStream,
        createRoom,
        joinRoom,
        iceConnectionStateEventListener,
        tutorIceCandidateEventListener,
        studentIceCandidateEventListener,
        trackEventListener,
        updateMediaStream
    };
}



