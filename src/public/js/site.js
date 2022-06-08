var video = document.getElementById('video');
var score = document.getElementById('score');

//const canvas = document.querySelector('#motion');

const canv = document.createElement('canvas');
const context = canv.getContext('2d');
canv.width = 480;
canv.height = 360;
context.width = canv.width;
context.height = canv.height;

var hasMotion = false;

const socket = io();

function initSuccess() {
	DiffCamEngine.start();
}

function initError() {
	alert('Something went wrong.');
}

var movementFlag = true;
function capture(payload) {
	score.textContent = payload.score;
	hasMotion = payload.hasMotion;
	context.drawImage(video, 0, 0, context.width, context.height);
	
	if(hasMotion){
		socket.emit('stream', canv.toDataURL('image/png'));
	}
}

DiffCamEngine.init({
	video: video,
	//motionCanvas: canvas,
	initSuccessCallback: initSuccess,
	initErrorCallback: initError,
	captureCallback: capture,
	scoreThreshold: 5,
});
