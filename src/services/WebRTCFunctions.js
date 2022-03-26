import {TeachingRoomService} from "./TeachingRoomService";

export const createOffer = async (connection, localStream, remoteRole, localRole) => {
    try {
        const offer = await connection.createOffer()
        await connection.setLocalDescription(offer)

        await TeachingRoomService.sendOffer('U6yzPD8HqSyNC979jfyC', remoteRole, localRole, offer)

    } catch (exception) {
        console.error(exception)
    }
}

export const createAnswer = async (connection, localStream, remoteRole, localRole, myWebRTC) => {
    try {
        // connection.signalingState !== 'stable' &&
        console.log(connection)
        await connection.setRemoteDescription(JSON.parse(myWebRTC.offer))
            .then(() => {
                console.log(connection)
                connection.createAnswer().then((answer) => {
                    console.log(connection)
                    connection.setLocalDescription(answer)
                        .then(() => {
                            console.log(connection)
                            TeachingRoomService.sendOffer('U6yzPD8HqSyNC979jfyC', remoteRole, localRole, answer)
                            console.log(connection)
                        })
                })
            })

        // const offer = JSON.parse(myWebRTC.offer)
        // await connection.setRemoteDescription(offer)
        //
        // const answer = await connection.createAnswer()
        // console.log(answer)
        // await connection.setLocalDescription(answer)
        // console.log(answer)
        //
        // await TeachingRoomService.sendOffer('U6yzPD8HqSyNC979jfyC', remoteRole, localRole, answer)
    } catch (exception) {
        console.error(exception)
    }
}

export const listenToConnectionEvents = (connection, id, remoteRole, localRole, remoteVideoRef) => {
    if (connection) {

        connection.onicecandidate = ((event) => {
            if (event.candidate) {
                TeachingRoomService.sendCandidate('U6yzPD8HqSyNC979jfyC', remoteRole, localRole, event.candidate)
                    .catch((err) => console.log(err))
            }
        })

        connection.ontrack = ((event) => {
            if (remoteVideoRef.current.srcObject !== event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0]
            }
        })
    }
}

export const startCall = (connection, myWebRTC) => {
    if (connection) {
        const answer = JSON.parse(myWebRTC.answer)
        connection.setRemoteDescription(answer)
            .catch((err) => console.log(err))
    }
}

export const addCandidate = ((connection, myWebRTC) => {
    if (connection) {
        const candidate = JSON.parse(myWebRTC.candidate)
        connection.addIceCandidate(new RTCIceCandidate(candidate))
            .catch((err) => console.log(err))
    }
})