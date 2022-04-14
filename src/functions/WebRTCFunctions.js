export const startWebcam = async (localStream, remoteStream, localVideoRef, remoteVideoRef) => {
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
            localStream.current = mediaStream;
            localVideoRef.current.srcObject = mediaStream;
            console.log(localStream)
        });
    remoteVideoRef.current.srcObject = remoteStream.current;
}

export const stopWebcam =  (localStream, localVideoRef) => {
    console.log("Webcam stopping...")
    localStream.current.getTracks().forEach((track) => track.stop())
    localVideoRef.current = null;
}