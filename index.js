import { Heartbeat } from "./heartbeat";

const OPENCV_URI = "https://docs.opencv.org/master/opencv.js";
const HAARCASCADE_URI = "haarcascade_frontalface_alt.xml"
const RESCAN_INTERVAL = 1000;
const DEFAULT_FPS = 30;
const LOW_BPM = 42;
const HIGH_BPM = 240;
const REL_MIN_FACE_SIZE = 0.4;
const SEC_PER_MIN = 60;
const MSEC_PER_SEC = 1000;
const MAX_CORNERS = 10;
const MIN_CORNERS = 5;
const QUALITY_LEVEL = 0.01;
const MIN_DISTANCE = 10;

console.log("yolo")

// Load opencv when needed
async function loadOpenCv(uri) {
  return new Promise(function(resolve, reject) {
    console.log("starting to load opencv");
    var tag = document.createElement('script');
    tag.src = uri;
    tag.async = true;
    tag.type = 'text/javascript'
    tag.onload = () => {
      cv['onRuntimeInitialized'] = () => {
        console.log("opencv ready");
        resolve();
      }
    };
    tag.onerror = () => {
      throw new URIError("opencv didn't load correctly.");
    };
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  });
}

let demo = new Heartbeat("webcam", "canvas", HAARCASCADE_URI, 30, 6, 250);
var ready = loadOpenCv(OPENCV_URI);

ready.then(function() {
  demo.init();
});

const webSocket = new WebSocket("ws://10.5.119.71:3000")

webSocket.onmessage = (event) => {
    handleSignallingData(JSON.parse(event.data))
}

function handleSignallingData(data) {
    switch (data.type) {
        case "offer":
            peerConn.setRemoteDescription(data.offer)
            createAndSendAnswer()
            break
        case "candidate":
            peerConn.addIceCandidate(data.candidate)
    }
}

function createAndSendAnswer () {
    peerConn.createAnswer((answer) => {
        peerConn.setLocalDescription(answer)
        sendData({
            type: "send_answer",
            answer: answer
        })
    }, error => {
        console.log(error)
    })
}

function sendData(data) {
    data.username = username
    webSocket.send(JSON.stringify(data))
}


let localStream
let peerConn
let username

username = "monkey";

navigator.getUserMedia({
    video: {
        frameRate: 24,
        width: {
            min: 480, ideal: 720, max: 1280
        },
        aspectRatio: 1.33333
    },
    audio: true
}, (stream) => {
    localStream = stream
    document.getElementById("webcam").srcObject = localStream

    let configuration = {
        iceServers: [
            {
                "urls": ["stun:stun.l.google.com:19302", 
                "stun:stun1.l.google.com:19302", 
                "stun:stun2.l.google.com:19302"]
            }
        ]
    }

    peerConn = new RTCPeerConnection(configuration)
    peerConn.addStream(localStream)

    peerConn.onaddstream = (e) => {
        document.getElementById("remote-video")
        .srcObject = e.stream
    }

    peerConn.onicecandidate = ((e) => {
        if (e.candidate == null)
            return
        
        sendData({
            type: "send_candidate",
            candidate: e.candidate
        })
    })

    sendData({
        type: "join_call"
    })

}, (error) => {
    console.log(error)
})