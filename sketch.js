let video;
let poseNet;
let pose;
let skeleton;
let mic;
let bg;

//ASCII ART STUFF
var myAsciiArt;
var asciiart_width = 140;
var asciiart_height = 70;
var duplicate;

function setupASCII(video){
 video.elt.setAttribute('playsinline', '');
    duplicate = createGraphics(asciiart_width, asciiart_height);
    duplicate.pixelDensity(1);
    myAsciiArt = new AsciiArt(this);
    //myAsciiArt.printWeightTable();
    textAlign(CENTER, CENTER); textFont('monospace', 6); textStyle(NORMAL);
//    noStroke();
}
function drawASCII() {
    duplicate.background(0);
    duplicate.image(video, 0, 0, duplicate.width, duplicate.height);
    duplicate.filter(POSTERIZE, 5);
    ascii_arr = myAsciiArt.convert(duplicate);
    
    myAsciiArt.typeArray2d(ascii_arr, this)
}
function setup() {
    createCanvas(640, 480);
    mic = new p5.AudioIn();
    mic.start();
    
    video = createCapture(VIDEO);
    video.hide();
    
    //ASCII ART setup
    setupASCII(video);
  
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    
}
let text;
let text2;
let text3;
function modelLoaded() {
    console.log('poseNet ready');
//    bg = createButton('Switch');
//    bg.mousePressed(runSwitch);
//    bg.position(20, width * 0.80);
    text = createElement('h2', 'Tilt your head up to change state.');
    text.position(30, height);
    
    text2 = createElement('h2', 'Move head side to side to change eyes.');
    text2.position(30, height + 20);
    
    text3 = createElement('h2', 'Step back and show both wrists to firebend(ish).');
    text3.position(30, height + 40);
}
let off = false;
//function runSwitch(){
//    if(off == false)
//        off = true;
//    else
//        off = false;
//}
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

let state = "video";
let changestate = false;
function draw() {
    strokeWeight(2)
    stroke(255)
    image(video, 0, 0);
    if (pose) {        
        let rEye = pose.rightEye;
        let lEye = pose.leftEye;
        let nose = pose.nose;
        let rEar = pose.rightEar;
        let lEar = pose.leftEar
        let rShould = pose.rightShoulder;
        let lShould = pose.leftShoulder;
        let rWrist = pose.rightWrist;
        let lWrist = pose.leftWrist;
        //distance bet eyes
        let d = dist(rEye.x, rEye.y, lEye.x, lEye.y); 
        if(nose.y <= ((lEye.y + rEye.y)/2) + d*0.1 && changestate == false) {
            if(state == "video")
                state = "black";
            else if(state == "black")
                state = "ASCII";
            else if(state == "ASCII")
                state = "video";
            changestate = true;
        }
        if(nose.y > ((lEye.y + rEye.y)/2) + d*0.1 && changestate == true) {
            changestate = false;
        }
        if(state == "black") {
            background(0);
            fill(180);
        }
        else if(state == "ASCII") {
            background(0);
            fill(180);
            drawASCII();
        }
      
//push();
//    translate(nose.x, nose.y)
//    let rot = atan2(mouseY - nose.y, mouseX - nose.x);   
//    rotate(rot);
//    push();
//    translate(-nose.x, -nose.y)
        if(rWrist.confidence > 0.3 && lWrist.confidence > 0.3 && rWrist.x < width && rWrist.y < height) {
            let o = {
                x: (rWrist.x + lWrist.x)/2,
                y: (rWrist.y + lWrist.y)/2, 
                a: 200,
                s: dist(rWrist.x, rWrist.y, lWrist.x, lWrist.y) * 0.8
            }
            wristo.push(o);  
        }
        
        for(let obj of wristo) {
            push()
            noStroke();
            fill(255, 160, 120, obj.a)
            ellipse(obj.x, obj.y, obj.s);
            pop();
            if(obj.s > 0)
                obj.s -=5;
            if(obj.a > 0) 
                obj.a -= 20;
        }
        
        
        let betEyes = {
            x: rEye.x + ((lEye.x - rEye.x)/2)
        }
        let c = map(nose.x, rEye.x, lEye.x, 0, 255);
        push();
        fill(c)
        drawEyes(rEye, lEye, nose, d);
        pop();
        
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
        let jaw = {
            right: rEar.x + (d * 0.27),
            left: lEar.x - (d * 0.27),
            //a + (b-a/3.7)
            y: findMid(nose.y, ((rShould.y + lShould.y)/2), 3.7) + (d * 0.1)
        }
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

        let lips = {
            up: corners.y,
            down: corners.y, 
            //x: findMid(corners.left, corners.right, 2)
            x: nose.x
        }
        push();
        
        let sound = mic.getLevel();
        let s = map(sound, 0, 0.09, 0, 10);
        //print(sound);
        //lips speaking
        fill(255,0,0)

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
//    pop();
//pop();

  }
    
}

function drawEyes(rEye, lEye, nose, d) {
    stroke(255);
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
        beginShape();
        vertex(rEyeUp.x, rEyeUp.y);
        vertex(rEyeOut.x, rEyeOut.y);
        vertex(rEyeDown.x, rEyeDown.y);
        vertex(rEyeIn.x, rEyeIn.y);
        endShape(CLOSE);
        
        //left
        beginShape();
        vertex(lEyeUp.x, lEyeUp.y);
        vertex(lEyeOut.stillx, lEyeOut.stilly);
        vertex(lEyeDown.x, lEyeDown.y);
        vertex(lEyeIn.x, lEyeIn.y);
        endShape(CLOSE);
    }
    else {
        //right
        beginShape();
        vertex(rEyeUp.x, rEyeUp.y);
        vertex(rEyeOut.stillx, rEyeOut.stilly);
        vertex(rEyeDown.x, rEyeDown.y);
        vertex(rEyeIn.x, rEyeIn.y);
        endShape(CLOSE);
        
        //left
        beginShape();
        vertex(lEyeUp.x, lEyeUp.y);
        vertex(lEyeOut.x, lEyeOut.y);
        vertex(lEyeDown.x, lEyeDown.y);
        vertex(lEyeIn.x, lEyeIn.y);
        endShape(CLOSE);
    }

}
function findMid(a, b, num) {
    //num = 2 is between
    return (a + ((b-a)/num));
}


