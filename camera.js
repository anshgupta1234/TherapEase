async function runPoseNet() {
  // Load PoseNet model
  const net = await posenet.load();

  // Get webcam feed
  const video = document.getElementById('webcam');
  if (navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
  }

  // Wait for the video to load metadata and play
  video.onloadedmetadata = function() {
      video.play();
      detectPoseInRealTime(video, net);
  };
}

// Function to detect poses in real-time and draw them on the canvas
async function detectPoseInRealTime(video, net) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // Set canvas size to match video feed
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Main detection loop
  async function poseDetectionFrame() {
      const pose = await net.estimateSinglePose(video, {
          flipHorizontal: false,
          imageScaleFactor: 0.3
      });

      // Clear canvas
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw detected pose
      drawPose(pose, ctx);

      // Call poseDetectionFrame again
      requestAnimationFrame(poseDetectionFrame);
  }

  // Start pose detection loop
  poseDetectionFrame();
}

// Function to draw the detected pose on the canvas
function drawPose(pose, ctx) {
  // Draw keypoints
  pose.keypoints.forEach(keypoint => {
      if (keypoint.score > 0.5) {
          ctx.beginPath();
          ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
      }
  });

  // Draw skeleton
  let adjacentKeyPoints = posenet.getAdjacentKeyPoints(pose.keypoints, 0.5);
  adjacentKeyPoints.forEach(connection => {
    drawSegment(ctx, connection[0].position, connection[1].position, 'red');
  })
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