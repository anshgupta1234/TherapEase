import '@tensorflow/tfjs'
import * as posenet from '@tensorflow-models/posenet'

async function runPoseNet() {
  // Load PoseNet model
  const net = await posenet.load();

  // Get webcam feed
  const video = document.getElementById('webcam');
  const video2 = document.getElementById('remote-video');

  const canvas = document.getElementById('local-canvas');
  const remote_canvas = document.getElementById('remote-canvas');

  if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
  }

  // Wait for the video to load metadata and play
  video.onloadedmetadata = function() {
      video.play();
      detectPoseInRealTime(video, net, canvas, false, "positionTrainee");
  };

  video2.onloadedmetadata = function() {
    detectPoseInRealTime(video2, net, remote_canvas, true, "positionTrainer");
  };
}

let positionData = {};

// Function to detect poses in real-time and draw them on the canvas
async function detectPoseInRealTime(video, net, canvas, clear, view) {

  const ctx = canvas.getContext('2d');

  // Set canvas size to match video feed
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  let lastPose = null

  // Main detection loop
  async function poseDetectionFrame() {
      const pose = await net.estimateSinglePose(video, {
          flipHorizontal: false,
          imageScaleFactor: 0.4
      });

      lastPose = pose

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw detected pose
      drawPose(pose, ctx);

      // Call poseDetectionFrame again
      requestAnimationFrame(poseDetectionFrame);
  }

  // Start pose detection loop
  poseDetectionFrame();

  // Set an interval to log the pose every 2 seconds
  setInterval(() => positionData[view] = lastPose, 200);
}

// Function to draw the detected pose on the canvas
function drawPose(pose, ctx) {
  let flattened1 = [];
  let flattened2 = [];
  let similarity = 0;
  if (positionData.positionTrainee != null && positionData.positionTrainer != null) {
    flattened1 = flattenKeypoints(positionData.positionTrainee.keypoints)
    flattened2 = flattenKeypoints(positionData.positionTrainer.keypoints)
    similarity = cosineSimilarity(flattened1, flattened2);
    console.log(similarity);
  } 
  // Draw keypoints
  pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5 && similarity < 0.90) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
      } else if (keypoint.score > 0.5) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
      }
  });

  // Draw skeleton
  // let adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
  // if (similarity < 0.90) {
  //   adjacentKeyPoints.forEach(connection => {
  //     drawSegment(ctx, connection[0].position, connection[1].position, 'yellow');
  //   })
  // } else {
  //   adjacentKeyPoints.forEach(connection => {
  //     drawSegment(ctx, connection[0].position, connection[1].position, 'blue');
  //   })
  // }
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] ** 2;
    normB += vecB[i] ** 2;
  }

  if (normA === 0 || normB === 0) {
    return 0; 
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// call through fetch
function flattenKeypoints(keypoints) {
  let acc = []
  for (let i = 0; i < keypoints.length; i++) {
    acc.push(keypoints[i].position.x, keypoints[i].position.y)
  }
  return acc;
}

// Function to draw a line segment between two points
function drawSegment(ctx, a, b, color) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}
// Call the function to start PoseNet
runPoseNet();