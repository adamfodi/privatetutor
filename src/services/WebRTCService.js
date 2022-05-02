import {RTCPeerConnectionConfiguration, RTCPeerConnectionOfferOptions} from "../config/webRTCConfig";


export const WebRTCService = {

    async startWebcam(peerConnection, localStream, localVideoRef) {
        console.log("Webcam starting...")
        await navigator
            .mediaDevices
            .getUserMedia(
                {
                    video: true,
                    audio: true
                }
            )
            .then(async mediaStream => {
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;

                replaceTracks(peerConnection, localStream);
            });
    },

    async startScreenShare(peerConnection, localStream, localVideoRef,stopLocalMediaStreamBrowser) {
        console.log("ScreenShare starting...")
        await navigator
            .mediaDevices
            .getDisplayMedia()
            .then(async mediaStream => {
                localStream.current = mediaStream;
                localVideoRef.current.srcObject = mediaStream;

                await navigator
                    .mediaDevices
                    .getUserMedia(
                        {
                            audio: true
                        }
                    )
                    .then(async mediaStream => {
                        localStream.current.addTrack(mediaStream.getAudioTracks()[0])
                        localStream.current.getVideoTracks()[0].onended = () => {
                            console.log("Kepernyomegosztas kikapcsolása böngésző által felajánlott gombbal")
                            replaceTracks(peerConnection, localStream);
                            stopLocalMediaStreamBrowser()
                        }
                        replaceTracks(peerConnection, localStream);
                    });
            });
    },

    async stopLocalMediaStream(peerConnection, localStream) {
        console.log("LocalMediaStream stopping...")
        localStream.current.getTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
        })
        replaceTracks(peerConnection, localStream);
    },

    async createDummyStream(localStream, localVideoRef) {
        console.log("creaeting dummy")
        let silence = () => {
            let ctx = new AudioContext(), oscillator = ctx.createOscillator();
            let dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();
            return Object.assign(dst.stream.getAudioTracks()[0], {enabled: false});
        }

        let black = ({width = 640, height = 480} = {}) => {
            let canvas = Object.assign(document.createElement("canvas"), {width, height});
            canvas.getContext('2d').fillRect(0, 0, width, height);
            let stream = canvas.captureStream();
            return Object.assign(stream.getVideoTracks()[0], {enabled: false});
        }

        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);

        localStream.current = blackSilence();
        localVideoRef.current.srcObject = localStream.current;
    },

    async createRoom(peerConnection, localStream, remoteStream, remoteVideoRef, setConnectionState,
                     tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef) {

        remoteVideoRef.current.srcObject = remoteStream.current;

        console.log('Create PeerConnection with configuration: ');
        peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

        peerConnection.current.addEventListener('iceconnectionstatechange', (event) => iceConnectionStateEventListener(event, setConnectionState));

        localStream.current.getTracks().forEach(track => {
            peerConnection.current.addTrack(track, localStream.current);
        });

        peerConnection.current.addEventListener('icecandidate', (event) => tutorIceCandidateEventListener(event, tutorCandidatesCollectionRef));
        await this.createOffer(peerConnection, teachingRoomRef);
        peerConnection.current.addEventListener('track', (event) => trackEventListener(event, remoteStream));
        teachingRoomSnapshot(peerConnection, teachingRoomRef);
        studentCandidatesSnapshot(peerConnection, studentCandidatesCollectionRef);
    },

    async joinRoom(peerConnection, localStream, remoteStream, remoteVideoRef, setConnectionState,
                   tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef) {

        remoteVideoRef.current.srcObject = remoteStream.current;

        const roomSnapshot = await teachingRoomRef.current.get();
        console.log('Got room:', roomSnapshot.exists);

        if (roomSnapshot.exists) {
            // // console.log('Create PeerConnection with configuration: ', configuration);
            peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

            peerConnection.current.addEventListener('iceconnectionstatechange', (event) => iceConnectionStateEventListener(event, setConnectionState));

            localStream.current.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStream.current);
            });

            peerConnection.current.addEventListener('icecandidate', (event) => studentIceCandidateEventListener(event, studentCandidatesCollectionRef));
            peerConnection.current.addEventListener('track', (event) => trackEventListener(event, remoteStream));
            await this.createAnswer(peerConnection, roomSnapshot, teachingRoomRef);
            teachingRoomSnapshot(peerConnection, teachingRoomRef);
            tutorCandidatesSnapshot(peerConnection, tutorCandidatesCollectionRef);
        }
    },

    async createOffer(peerConnection, teachingRoomRef) {
        const offer = await peerConnection.current.createOffer(RTCPeerConnectionOfferOptions);
        await peerConnection.current.setLocalDescription(offer);
        console.log('Created offer:');

        const roomWithOffer = {
            'offer': {
                type: offer.type,
                sdp: offer.sdp,
            },
        };

        await teachingRoomRef.current.update(roomWithOffer);
    },

    async createAnswer(peerConnection, roomSnapshot, teachingRoomRef) {
        const offer = roomSnapshot.data().offer;
        // console.log('Got offer:', offer);
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.current.createAnswer(RTCPeerConnectionOfferOptions);
        // console.log('Created answer:', answer);
        await peerConnection.current.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };

        await teachingRoomRef.current.update(roomWithAnswer);
    },

    unSubscribe(role, peerConnection, localStream, remoteStream, teachingRoomRef, studentCandidatesCollectionRef, tutorCandidatesCollectionRef) {
        if (role === 'tutor') {
            peerConnection.current.removeEventListener('icecandidate', tutorIceCandidateEventListener);
            studentCandidatesCollectionRef.current.onSnapshot(() => {
            });
        }

        if (role === 'student') {
            peerConnection.current.removeEventListener('icecandidate', studentIceCandidateEventListener);
            tutorCandidatesCollectionRef.current.onSnapshot(() => {
            });
        }

        peerConnection.current.removeEventListener('track', iceConnectionStateEventListener);
        peerConnection.current.removeEventListener('track', trackEventListener);
        teachingRoomRef.current.onSnapshot(() => {
        })

        localStream.current && localStream.current.getTracks().forEach(track => {
            track.stop();
        });

        remoteStream.current && remoteStream.current.getTracks().forEach(track => {
            track.stop();
        });

        peerConnection.current.close();
    }
}

const iceConnectionStateEventListener = (event, setConnectionState) => {
    console.log("iceConnectionStateEventListener")
    console.log(event.currentTarget && event.currentTarget.iceConnectionState)
    event.currentTarget && event.currentTarget.iceConnectionState && setConnectionState(event.currentTarget.iceConnectionState);
};

const tutorIceCandidateEventListener = (event, tutorCandidatesCollectionRef) => {
    console.log("tutorIceCandidateEventListener")
    event.candidate && tutorCandidatesCollectionRef.current.add(event.candidate.toJSON())
};

const studentIceCandidateEventListener = (event, studentCandidatesCollectionRef) => {
    console.log("studentIceCandidateEventListener")
    event.candidate && studentCandidatesCollectionRef.current.add(event.candidate.toJSON())
};

const trackEventListener = (event, remoteStream) => {
    // console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
        // console.log('Add a track to the remoteStream:', track);
        remoteStream.current.addTrack(track);
    });
};

const teachingRoomSnapshot = (peerConnection, teachingRoomRef) => {
    teachingRoomRef.current.onSnapshot(async (snapshot) => {
        console.log("teachingroomsnapshot")
        const data = snapshot.data();
        if (!peerConnection.current.currentRemoteDescription && data && data.answer && peerConnection.current.signalingState !== "closed") {
            console.log('Got remote description: ', data.answer);
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await peerConnection.current.setRemoteDescription(rtcSessionDescription)
        }
    });
};

const tutorCandidatesSnapshot = (peerConnection, tutorCandidatesCollectionRef) => {
    // console.log("tutorCandidatesSnapshot")
    tutorCandidatesCollectionRef.current.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                let data = change.doc.data();
                // // console.log(`Got new remote ICE candidateTU: ${JSON.stringify(data)}`);
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
            }
        });
    });
};

const studentCandidatesSnapshot = (peerConnection, studentCandidatesCollectionRef) => {
    // console.log("studentCandidatesSnapshot")
    studentCandidatesCollectionRef.current.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async change => {
            if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                let data = change.doc.data();
                // console.log(`Got new remote ICE candidateST: ${JSON.stringify(data)}`);
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
            }
        });
    });
};

const replaceTracks = (peerConnection, localStream) => {
    if (peerConnection && peerConnection.current) {
        peerConnection.current.getSenders().forEach((rtpSender) => {
            if (rtpSender.track.kind === 'video') {
                rtpSender.replaceTrack(localStream.current.getVideoTracks()[0]).then(function () {
                    console.log("Replaced video track from camera to screen");
                }).catch(function (error) {
                    console.log("Could not replace video track: " + error);
                });
            }

            if (rtpSender.track.kind === 'audio') {
                rtpSender.replaceTrack(localStream.current.getAudioTracks()[0]).then(function () {
                    console.log("Replaced audio track from camera to screen");
                }).catch(function (error) {
                    console.log("Could not replace audio track: " + error);
                });
            }
        })
    }
}

