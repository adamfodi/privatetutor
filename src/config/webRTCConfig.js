export const RTCPeerConnectionConfiguration = {
    iceServers: [
        {
            urls: ["stun:eu-turn6.xirsys.com"]
        },
        {
            username: "ojgPiT2ZDqKqfLFj_0cEhlasdndv4c0ifDO_M3XM7w6AKbaOhEcgfjNbbuceZ7FRAAAAAGJaPzlpZm9kYW0=",
            credential: "abec16e4-bd39-11ec-8666-0242ac140004",
            urls: [
                "turn:eu-turn6.xirsys.com:80?transport=udp",
                "turn:eu-turn6.xirsys.com:3478?transport=udp",
                "turn:eu-turn6.xirsys.com:80?transport=tcp",
                // "turn:eu-turn6.xirsys.com:3478?transport=tcp",
                // "turns:eu-turn6.xirsys.com:443?transport=tcp",
                // "turns:eu-turn6.xirsys.com:5349?transport=tcp"
            ]
        }],
    iceCandidatePoolSize: 10,
};

export const RTCPeerConnectionOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
    // iceRestart: restartInput.checked,
};