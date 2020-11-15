let video;
let poseNet;
let pose;
let skeleton;

function setup() {
    createCanvas(640, 480);
    
    video = createCapture(VIDEO);
    video.hide();
  
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
}

function modelLoaded() {
    console.log('poseNet ready');
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
    image(video, 0, 0);
    
    //drawREye(10, 10);
    
    if (pose) {
        let rEye = pose.rightEye;
        let lEye = pose.leftEye;
        let nose = pose.nose;
    // We use the difference between the ears
    // as the size of the mask.
        let d = dist(rEye.x, rEye.y, lEye.x, lEye.y);
        stroke(255);
        line(rEye.x, rEye.y, lEye.x, lEye.y);
        fill(255, 0, 0);
        let size = d * 0.17;
//        ellipse(rEye.x, rEye.y, size)
//        ellipse(lEye.x, lEye.y, size)
        
        //lower points
        ellipse(rEye.x, rEye.y + size/2, 5)
        ellipse(lEye.x, lEye.y + size/2, 5)
        
        //upper points
        ellipse(rEye.x, rEye.y - size/2, 5)
        ellipse(lEye.x, lEye.y - size/2, 5)
        
        let eyenoseR = dist(rEye.x, 0, nose.x, 0);
        strokeWeight(2);
        let eyenoseL = dist(lEye.x, 0, nose.x, 0);
        strokeWeight(2);
        //check which has less dist & apply
        if(eyenoseR < eyenoseL) {
            //outer point
            ellipse(rEye.x - eyenoseR * 0.50, rEye.y, 5)
            ellipse(lEye.x + size * 1.25, lEye.y, 5)
        }
        else {
            //outer point
            ellipse(rEye.x - size * 1.25, rEye.y, 5)
            ellipse(lEye.x + eyenoseL * 0.50, lEye.y, 5)
        }
        let outReye = size * 1.25;
        
        
        //inner points
        ellipse(rEye.x + size, rEye.y, 5)
        ellipse(lEye.x - size, lEye.y, 5)

        
        line()
        
//    fill(255, 0, 0, 50);
//    ellipse(pose.nose.x, pose.nose.y, d, d*1.25);
//    fill(0, 0, 255);
//
//    // Draw an ellipse on eack keypoint
//    for (let i = 0; i < pose.keypoints.length; i++) {
//      let x = pose.keypoints[i].position.x;
//      let y = pose.keypoints[i].position.y;
//      fill(0, 255, 0);
//      ellipse(x, y, 16, 16);
//    }

  }
    
}

function confidence(obj) {
    
}
function drawREye(x, y) {
    translate(x, y);
    
}


