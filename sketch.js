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
    //background(0);
    if (pose) {
        let rEye = pose.rightEye;
        let lEye = pose.leftEye;
        let nose = pose.nose;
        //distance bet eyes
        let d = dist(rEye.x, rEye.y, lEye.x, lEye.y); 
        drawEyes(rEye, lEye, nose, d);
        
        push()
        fill(255, 0, 0)
        //ellipse(nose.x, nose.y, 5)
        pop()
        push()
        noFill()
        stroke(255)
        strokeWeight(2)
        triangle(nose.x, nose.y + (d * 0.15), nose.x-(d*0.20), nose.y - (d * 0.05), nose.x+(d*0.20), nose.y - (d*0.05))
        triangle(nose.x, (rEye.y + lEye.y)/2, nose.x-(d*0.20), nose.y - (d * 0.05), nose.x+(d*0.20), nose.y - (d*0.05))
        pop()

    // Draw an ellipse on eack keypoint
//    for (let i = 0; i < pose.keypoints.length; i++) {
//      let x = pose.keypoints[i].position.x;
//      let y = pose.keypoints[i].position.y;
//      fill(0, 255, 0);
//      ellipse(x, y, 16, 16);
//    }

  }
    
}

function drawEyes(rEye, lEye, nose, d) {
    
    
    stroke(255);
    //line(rEye.x, rEye.y, lEye.x, lEye.y);
    fill(255, 0, 0);
    
    let size = d * 0.20;
    
    let eyenoseR = dist(rEye.x, 0, nose.x, 0);
    let eyenoseL = dist(lEye.x, 0, nose.x, 0);
    
    let rEyeIn ={
        x: rEye.x + size,
        y: rEye.y
    }
    let rEyeOut = {
        x: rEye.x - eyenoseR * 0.50,
        y: rEye.y,
        stillx: rEye.x - size * 1.25,
        stilly: rEye.y
    }
    let rEyeUp = {
        x: rEye.x,
        y: rEye.y - size/2
    }
    let rEyeDown = {
        x: rEye.x,
        y: rEye.y + size/2
    }
    let lEyeIn = {
        x: lEye.x - size,
        y: lEye.y
    }
    let lEyeOut = {
        x: lEye.x + eyenoseL * 0.50,
        y: lEye.y,
        stillx: lEye.x + size * 1.25,
        stilly: lEye.y
    }
    let lEyeUp = {
        x: lEye.x,
        y: lEye.y - size/2
    }
    let lEyeDown = {
        x: lEye.x,
        y: lEye.y + size/2
    }
    
    strokeWeight(2);
    //check which has less dist & apply
    if(eyenoseR < eyenoseL) {
        //right
        line(rEyeOut.x, rEyeOut.y, rEyeDown.x, rEyeDown.y);
        line(rEyeOut.x, rEyeOut.y, rEyeUp.x, rEyeUp.y);
        
        //left
        line(lEyeOut.stillx, lEyeOut.stilly, lEyeDown.x, lEyeDown.y);
        line(lEyeOut.stillx, lEyeOut.stilly, lEyeUp.x, lEyeUp.y);
    }
    else {
        //right
        line(rEyeOut.stillx, rEyeOut.stilly, rEyeDown.x, rEyeDown.y);
        line(rEyeOut.stillx, rEyeOut.stilly, rEyeUp.x, rEyeUp.y);
            
        //left
        line(lEyeOut.x, lEyeOut.y, lEyeUp.x, lEyeUp.y);
        line(lEyeOut.x, lEyeOut.y, lEyeDown.x, lEyeDown.y);
    }
    //let outReye = size * 1.25;
        
    //inner lines
    //right
    line(rEyeIn.x, rEyeIn.y, rEyeDown.x, rEyeDown.y);
    line(rEyeIn.x, rEyeIn.y, rEyeUp.x, rEyeUp.y);
            
    //left
    line(lEyeIn.x, lEyeIn.y, lEyeUp.x, lEyeUp.y);
    line(lEyeIn.x, lEyeIn.y, lEyeDown.x, lEyeDown.y);
}
function confidence(obj) {
    
}



