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
        });
    remoteVideoRef.current.srcObject = remoteStream.current;
}