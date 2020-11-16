let video;
let poseNet;
let pose;
let skeleton;
let mic;
let bg;
function setup() {
    createCanvas(640, 480);
    mic = new p5.AudioIn();
    mic.start();
    
    video = createCapture(VIDEO);
    video.hide();
  
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    
}

function modelLoaded() {
    console.log('poseNet ready');
    bg = createButton('Switch');
    bg.mousePressed(runSwitch);
    bg.position(20, width * 0.80);
}
let off = false;
function runSwitch(){
    if(off == false)
        off = true;
    else
        off = false;
}
function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}
let lEyeIn, rEyeIn, rEyeUp, rEyeDown, lEyeUp, lEyeDown, rEyeOut, lEyeOut;
let eyenoseR, eyenoseL;

let wristo = [];
function draw() {
    image(video, 0, 0);
    if(off == true)
        background(0);
    if (pose) {
        let rEye = pose.rightEye;
        let lEye = pose.leftEye;
        let nose = pose.nose;
        let rEar = pose.rightEar;
        let lEar = pose.leftEar
        let rShould = pose.rightShoulder;
        let lShould = pose.leftShoulder;
        let rWrist = pose.rightWrist;
        
        if(rWrist.confidence > 0.3 && rWrist.x < width && rWrist.y < height) {
            let o = {
                x: rWrist.x,
                y: rWrist.y, 
                a: 255
            }
            wristo.push(o);  
        }
        
        for(let obj of wristo) {
            noStroke();
            fill(255, obj.a)
            ellipse(obj.x, obj.y, 30);
            if(obj.a > 30)
                obj.a -= 20;
        }
        
        
        let betEyes = {
            x: rEye.x + ((lEye.x - rEye.x)/2)
        }
        //distance bet eyes
        let d = dist(rEye.x, rEye.y, lEye.x, lEye.y); 
        drawEyes(rEye, lEye, nose, d);
        
    //NOSE
        push()
        fill(255, 0, 0)
        //ellipse(nose.x, nose.y, 5)
        pop()
        push()
        noFill()
        stroke(255)
        strokeWeight(2)
        //lower
        triangle(nose.x, nose.y + (d * 0.15), nose.x-(d*0.20), nose.y - (d * 0.05), nose.x+(d*0.20), nose.y - (d*0.05))
        //upper
        triangle(betEyes.x, (rEye.y + lEye.y)/2, nose.x-(d*0.20), nose.y - (d * 0.05), nose.x+(d*0.20), nose.y - (d*0.05))
        pop()
        
        
    //FACE
        let dshould = dist(rShould.x, rShould.y, lShould.x, lShould.y);
        let chin = {
            x: betEyes.x,
            //a + (b-a/2)
            y: findMid(((nose.y + nose.y)/2), ((rShould.y + lShould.y)/2), 2) + (d * 0.1)
        }
        push()
        fill(255,0,0)
        //increase chin.y as dist decreases
//        ellipse(chin.x, chin.y, 10)
        pop()
        
        let jaw = {
            right: rEar.x + (d * 0.27),
            left: lEar.x - (d * 0.27),
            //a + (b-a/3.7)
            y: findMid(nose.y, ((rShould.y + lShould.y)/2), 3.7) + (d * 0.1)
        }
        push()
        fill(255,0,0)
        //increase chin.y as dist decreases
//        ellipse(jaw.right, jaw.y, 10)
//        ellipse(jaw.left, jaw.y, 10)
        pop()
        
        let top = {
            x: betEyes.x,
            y: (lEar.y + rEar.y)/2 - (lEar.x - rEar.x) /1.4
        }
        let temple = {
            left: lEar.x - 15,
            right: rEar.x + 15,
            //a + (b-a/2)
            y: findMid(top.y, ((lEar.y + rEar.y)/2), 2)
        }
        
        push()
        fill(255,0,0)
//        ellipse(top.x, top.y, 10)
//        ellipse(temple.left, temple.y, 10)
//        ellipse(temple.right, temple.y, 10)
        pop()
        
    //Draw Face
        push();
        noFill()
        beginShape();
        vertex(chin.x, chin.y);
        vertex(jaw.left, jaw.y);
        vertex(lEar.x, lEar.y);
        vertex(temple.left, temple.y);
        vertex(top.x, top.y);
        vertex(temple.right, temple.y);
        vertex(rEar.x, rEar.y);
        vertex(jaw.right, jaw.y);
        endShape(CLOSE);
        pop();
        
    //MOUTH
        let corners = {
            left: lEye.x - 10,
            right: rEye.x + 10,
            y: findMid(nose.y, chin.y, 2)
        }
        push()
        //corners
//        fill(255,0,0)
//        ellipse(corners.left, corners.y, 10);
//        ellipse(corners.right, corners.y, 10);
        pop()
        let lips = {
            up: corners.y,
            down: corners.y, 
            //x: findMid(corners.left, corners.right, 2)
            x: nose.x
        }
        push();
        
        let sound = mic.getLevel();
        let s = map(sound, 0, 0.09, 0, 10);
        print(sound);
        //lips speaking
        fill(255,0,0)
//        ellipse(lips.x, lips.up - s, 5);
//        ellipse(lips.x, lips.down + s, 5);
//        //outer
//        ellipse(lips.x, lips.up - 12 - (sound * 5), 5);
//        ellipse(lips.x, lips.down + 17 + (sound * 5), 5);
//        
//        //peaks
//        ellipse(lips.x - 5, lips.up - 15 - (sound * 5), 5);
//        ellipse(lips.x + 5, lips.up - 15 - (sound * 5), 5);
        let peak = {
            left: lips.x + 5,
            right: lips.x - 5,
            y: lips.up - 15 - (s * 5)
        }
        pop()
        
        //Draw Mouth
        push();
        noFill()
        beginShape();
        vertex(corners.left, corners.y);
        vertex(peak.left, peak.y);
        vertex(lips.x, lips.up - 12 - (s * 5));
        vertex(peak.right, peak.y);
        vertex(corners.right, corners.y);
        vertex(lips.x, lips.down + 17 + (s * 5));
        endShape(CLOSE);
        pop();
        
        //upper
        push();
        noFill()
        beginShape();
        vertex(corners.left, corners.y);
        vertex(lips.x, lips.up - s);
        vertex(corners.right, corners.y);
        endShape(CLOSE);
        pop();
        
        //lower
        push();
        noFill()
        beginShape();
        vertex(corners.left, corners.y);
        vertex(lips.x, lips.down + s);
        vertex(corners.right, corners.y);
        endShape(CLOSE);
        pop();
        
        
    //POLY EFFETCS
        let extrapoint = {
            x: nose.x,
            y: findMid(top.y, (rEye.y + lEye.y)/2, 2)
        };
//        fill(0, 0, 255)
//        ellipse(nose.x, extrapoint.y, 5)
        
        line(top.x, top.y, extrapoint.x, extrapoint.y)
        line(extrapoint.x, extrapoint.y, betEyes.x, (rEye.y + lEye.y)/2)
        
        line(extrapoint.x, extrapoint.y, lEyeIn.x, lEyeIn.y)
        line(extrapoint.x, extrapoint.y, rEyeIn.x, rEyeIn.y)
        
        line(extrapoint.x, extrapoint.y, temple.left, temple.y)
        line(extrapoint.x, extrapoint.y, temple.right, temple.y)  
        
        line(temple.left, temple.y, lEyeUp.x, lEyeUp.y)
        line(temple.right, temple.y, rEyeUp.x, rEyeUp.y)
        
        line(rEyeDown.x, rEyeDown.y, betEyes.x, (rEye.y + lEye.y)/2)
        line(lEyeDown.x, lEyeDown.y, betEyes.x, (rEye.y + lEye.y)/2)
        
        line(rEyeIn.x, rEyeIn.y, betEyes.x, (rEye.y + lEye.y)/2)
        line(lEyeIn.x, lEyeIn.y, betEyes.x, (rEye.y + lEye.y)/2)
        
        if(eyenoseR < eyenoseL) {
            line(rEyeOut.x, rEyeOut.y, rEar.x, rEar.y)
            line(lEyeOut.stillx, lEyeOut.stilly, lEar.x, lEar.y)
            
            line(rEyeOut.x, rEyeOut.y, jaw.right, jaw.y)
            line(lEyeOut.stillx, lEyeOut.stilly, jaw.left, jaw.y)
        }
        else {
            line(rEyeOut.stillx, rEyeOut.stilly, rEar.x, rEar.y)
            line(lEyeOut.x, lEyeOut.y, lEar.x, lEar.y)
            
            line(rEyeOut.stillx, rEyeOut.stilly, jaw.right, jaw.y)
            line(lEyeOut.x, lEyeOut.y, jaw.left, jaw.y)
        }
        
        //jaw to nose
        line(jaw.right, jaw.y, nose.x-(d*0.20), nose.y - (d * 0.05))
        line(jaw.left, jaw.y, nose.x+(d*0.20), nose.y - (d * 0.05))
        //jaw to mouthcorner
        line(jaw.right, jaw.y, corners.right, corners.y)
        line(jaw.left, jaw.y, corners.left, corners.y)
        
        //ear to nose
        line(rEar.x, rEar.y, nose.x-(d*0.20), nose.y - (d * 0.05))
        line(lEar.x, lEar.y, nose.x+(d*0.20), nose.y - (d * 0.05))
        
        //nose to mouth corner
        line(corners.right, corners.y, nose.x-(d*0.20), nose.y - (d * 0.05))
        line(corners.left, corners.y, nose.x+(d*0.20), nose.y - (d * 0.05))
        
        line(corners.right, corners.y, chin.x, chin.y)
        line(corners.left, corners.y, chin.x, chin.y)
        
        line(nose.x, nose.y + (d * 0.15), lips.x, lips.up - 12 - (s * 5))

        
//        //more chaotoc version
//        line(temple.left, temple.y, rEyeUp.x, rEyeUp.y)
//        line(temple.right, temple.y, lEyeUp.x, lEyeUp.y)
        
        
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
    
    eyenoseR = dist(rEye.x, 0, nose.x, 0);
    eyenoseL = dist(lEye.x, 0, nose.x, 0);
    
    rEyeIn ={
        x: rEye.x + size,
        y: rEye.y
    }
    rEyeOut = {
        x: rEye.x - eyenoseR * 0.50,
        y: rEye.y,
        stillx: rEye.x - size * 1.25,
        stilly: rEye.y
    }
    rEyeUp = {
        x: rEye.x,
        y: rEye.y - size/2
    }
    rEyeDown = {
        x: rEye.x,
        y: rEye.y + size/2
    }
    lEyeIn = {
        x: lEye.x - size,
        y: lEye.y
    }
    lEyeOut = {
        x: lEye.x + eyenoseL * 0.50,
        y: lEye.y,
        stillx: lEye.x + size * 1.25,
        stilly: lEye.y
    }
    lEyeUp = {
        x: lEye.x,
        y: lEye.y - size/2
    }
    lEyeDown = {
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
function findMid(a, b, num) {
    //num = 2 is between
    return (a + ((b-a)/num));
}


