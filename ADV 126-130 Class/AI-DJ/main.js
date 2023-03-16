LIMIT = 150
HEIGHT = 400
WIDTH = 500
BAR_SIZE = 50

song = ''
paused = 1
speedRaw = 0 /* leftWristY */
volumeRaw = 0 /* rightWristY */

function preload(){song = loadSound('music.mp3') }
function modelLoaded(){console.log('Model Intact')}
function rawEqu(raw){return LIMIT / raw}

function audio(){
    paused = (paused + 1) % 2
    if (paused == 0){
        song.play()
        song.rate(rawEqu(speedRaw))
        document.getElementById('audioBtn').innerHTML = 'Reset Audio'
        document.getElementById('audioBtn').className = 'btn btn-danger'
    } else {
        song.stop()
        document.getElementById('audioBtn').innerHTML = 'Play Audio'
        document.getElementById('audioBtn').className = 'btn btn-success'
    }
}
function setup(){
    canvas = createCanvas(WIDTH, HEIGHT)
    canvas.center()
    
    video = createCapture(VIDEO)
    video.hide()
    
    poseNet = ml5.poseNet(video, modelLoaded)
    poseNet.on('pose', gotPoses)
}
function gotPoses(results){
    if (results.length > 0){
        /* console.log(results) */
        speedRaw = results[0].pose.leftWrist.y
        volumeRaw = results[0].pose.rightWrist.y
        /* console.log(speedRaw + ', ' + volumeRaw) */
    }
}
function draw(){
    background('#020550')
    
    stroke('#4dd2dd')
    fill('#4dd2dd')
    rect(WIDTH / 4 - BAR_SIZE, 0, BAR_SIZE, speedRaw)

    stroke('#0d59ad')
    fill('#0d59ad')
    rect(3 * WIDTH / 4, 0, BAR_SIZE, volumeRaw)
    
    stroke('#ffffff')
    fill('#ffffff')
    rect(0, HEIGHT - LIMIT, WIDTH, 1)
    
    document.getElementById('speedMeter').innerHTML = 'Speed: ' + (rawEqu(speedRaw)).toFixed(2) + "x"
    document.getElementById('volumeMeter').innerHTML = 'Volume: ' + (rawEqu(volumeRaw)).toFixed(2) + "x"
}