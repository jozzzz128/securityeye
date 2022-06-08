var cv = require('./node_modules/opencv/lib/opencv');
var sleep = require('sleep');

var camera = new cv.VideoCapture(0); //open camera

//set the video size to 512x288
camera.setWidth(512);
camera.setHeight(288);
var window = new cv.NamedWindow('Camera');
var firstFrame, frameDelta, gray, thresh;

sleep.sleep(3);
camera.read(function(err, frame){
    firstFrame = frame;
    //convert to grayscale
    firstFrame.cvtColor('CV_BGR2GRAY');
    firstFrame.gaussianBlur([21, 21]);
});

interval = setInterval(function() {
    camera.read(function(err, frame) {

        gray = frame.copy();
        gray.cvtColor('CV_BGR2GRAY');
        gray.gaussianBlur([21, 21]);

        frameDelta = new cv.Matrix();
        //compute difference between first frame and current frame
        frameDelta.absDiff(firstFrame, gray);
        thresh = frameDelta.threshold(25,255);
        thresh.dilate(2);

        var cnts = thresh.findContours();

        for(i = 0; i < cnts.size(); i++) {

            if(cnts.area(i) < 500) {
                continue;
            }

            frame.putText("Motion Detected", 10, 20, cv.FONT_HERSHEY_SIMPLEX, [0, 0, 255], 0.75, 2);
        }

        window.show(frame);
        keyPressed = window.blockingWaitKey(0, 50);
        
        if(keyPressed == 27) {
            //exit if ESC is pressed
            clearInterval(interval);
        }

    });
}, 20);