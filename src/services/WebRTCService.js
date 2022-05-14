import {RTCPeerConnectionConfiguration, RTCPeerConnectionOfferOptions} from "../config/webRTCConfig";
import Swal from "sweetalert2";
import {TeachingRoomService} from "./TeachingRoomService";

let unsubscribeTeachingRoom = () => {
};
let unsubscribeTutorCandidatesCollection = () => {
};
let unsubscribeStudentCandidatesCollection = () => {
};

export const WebRTCService = {

    async startWebcam(peerConnection, localStream, localVideoRef) {
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

    async startScreenShare(peerConnection, localStream, localVideoRef, stopLocalMediaStreamBrowser) {
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
                            replaceTracks(peerConnection, localStream);
                            stopLocalMediaStreamBrowser()
                        }
                        replaceTracks(peerConnection, localStream);
                    });
            });
    },

    async stopMediaStream(peerConnection, localStream) {
        localStream.current.getTracks().forEach((track) => {
            track.enabled = false;
            track.stop();
        })
        replaceTracks(peerConnection, localStream);
    },

    async createDummyStream(localStream, localVideoRef) {
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
                     tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef, roomID, navigate) {

        remoteVideoRef.current.srcObject = remoteStream.current;

        peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

        peerConnection.current.addEventListener('iceconnectionstatechange',
            (event) => iceConnectionStateEventListener(event, setConnectionState, tutorCandidatesCollectionRef,
                studentCandidatesCollectionRef, roomID, navigate));

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
                   tutorCandidatesCollectionRef, teachingRoomRef, studentCandidatesCollectionRef, roomID, navigate) {

        remoteVideoRef.current.srcObject = remoteStream.current;

        const roomSnapshot = await teachingRoomRef.current.get();

        if (roomSnapshot.exists) {
            peerConnection.current = new RTCPeerConnection(RTCPeerConnectionConfiguration);

            peerConnection.current.addEventListener('iceconnectionstatechange',
                (event) => iceConnectionStateEventListener(event, setConnectionState, tutorCandidatesCollectionRef,
                    studentCandidatesCollectionRef, roomID, navigate));

            localStream.current.getTracks().forEach(track => {
                peerConnection.current.addTrack(track, localStream.current);
            });

            peerConnection.current.addEventListener('icecandidate', (event) => studentIceCandidateEventListener(event, studentCandidatesCollectionRef));
            peerConnection.current.addEventListener('track', (event) => trackEventListener(event, remoteStream));
            await this.createAnswer(peerConnection, roomSnapshot, teachingRoomRef);
            tutorCandidatesSnapshot(peerConnection, tutorCandidatesCollectionRef);
        }
    },

    async createOffer(peerConnection, teachingRoomRef) {
        const offer = await peerConnection.current.createOffer(RTCPeerConnectionOfferOptions);
        await peerConnection.current.setLocalDescription(offer);

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
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.current.createAnswer(RTCPeerConnectionOfferOptions);
        await peerConnection.current.setLocalDescription(answer);

        const roomWithAnswer = {
            answer: {
                type: answer.type,
                sdp: answer.sdp,
            },
        };

        await teachingRoomRef.current.update(roomWithAnswer);
    },

    unSubscribe(role, peerConnection, localStream, remoteStream) {
        if (role === 'tutor') {
            peerConnection.current.removeEventListener('icecandidate', tutorIceCandidateEventListener);
            unsubscribeTeachingRoom();
            unsubscribeStudentCandidatesCollection();
        }

        if (role === 'student') {
            peerConnection.current.removeEventListener('icecandidate', studentIceCandidateEventListener);
            unsubscribeTutorCandidatesCollection();
        }

        peerConnection.current.removeEventListener('track', iceConnectionStateEventListener);
        peerConnection.current.removeEventListener('track', trackEventListener);

        localStream.current && localStream.current.getTracks().forEach(track => {
            track.stop();
        });

        remoteStream.current && remoteStream.current.getTracks().forEach(track => {
            track.stop();
        });

        peerConnection.current.close();
    }
}

const iceConnectionStateEventListener = (event, setConnectionState, tutorCandidatesCollectionRef, studentCandidatesCollectionRef, roomID, navigate) => {
    event.currentTarget && event.currentTarget.iceConnectionState && setConnectionState(event.currentTarget.iceConnectionState);

    if (event.currentTarget && event.currentTarget.iceConnectionState === "disconnected") {
        Swal.fire({
            didOpen: () => {
                Swal.showLoading();
            },
            title: "Csatlakozás...",
            allowOutsideClick: false,
            allowEscapeKey: false
        });
        TeachingRoomService.resetTeachingRoom(roomID, tutorCandidatesCollectionRef, studentCandidatesCollectionRef)
            .then(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'A kapcsolat megszakadt!',
                    allowEscapeKey: false,
                    allowOutsideClick: false
                })
                    .then(() => navigate("/private-lessons"))
            })
    }
};

const tutorIceCandidateEventListener = (event, tutorCandidatesCollectionRef) => {
    event.candidate && tutorCandidatesCollectionRef.current.add(event.candidate.toJSON())
};

const studentIceCandidateEventListener = (event, studentCandidatesCollectionRef) => {
    event.candidate && studentCandidatesCollectionRef.current.add(event.candidate.toJSON())
};

const trackEventListener = (event, remoteStream) => {
    event.streams[0].getTracks().forEach(track => {
        remoteStream.current.addTrack(track);
    });
};

const teachingRoomSnapshot = (peerConnection, teachingRoomRef) => {
    unsubscribeTeachingRoom = teachingRoomRef.current.onSnapshot(async (snapshot) => {
        const data = snapshot.data();
        if (!peerConnection.current.currentRemoteDescription && data && data.answer && peerConnection.current.signalingState !== "closed") {
            const rtcSessionDescription = new RTCSessionDescription(data.answer);
            await peerConnection.current.setRemoteDescription(rtcSessionDescription)
        }
    });
};

const tutorCandidatesSnapshot = (peerConnection, tutorCandidatesCollectionRef) => {
    unsubscribeTutorCandidatesCollection = tutorCandidatesCollectionRef.current.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                let data = change.doc.data();
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
            }
        });
    });
};

const studentCandidatesSnapshot = (peerConnection, studentCandidatesCollectionRef) => {
    unsubscribeStudentCandidatesCollection = studentCandidatesCollectionRef.current.onSnapshot(snapshot => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added' && peerConnection.current.signalingState !== "closed") {
                let data = change.doc.data();
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(data))
            }
        });
    });
};

const replaceTracks = (peerConnection, localStream) => {
    if (peerConnection && peerConnection.current) {
        peerConnection.current.getSenders().forEach((rtpSender) => {
            if (rtpSender.track.kind === 'video') {
                rtpSender.replaceTrack(localStream.current.getVideoTracks()[0])
                    .catch(() => {
                    });
            }

            if (rtpSender.track.kind === 'audio') {
                rtpSender.replaceTrack(localStream.current.getAudioTracks()[0])
                    .catch(() => {
                    });
            }
        })
    }
}

