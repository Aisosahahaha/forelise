"use strict"; 
const spawnPoints = document.querySelectorAll(".spawnPoints");
const amtOfPoints = 19;
const amtOfSpawnPoints = 3;
const amtInEachSpawnPoint = Math.floor(amtOfPoints / amtOfSpawnPoints);
const remainderAmtForMiddleSpawnPoint = amtOfPoints % amtOfSpawnPoints;
let canStartBlowingOutCandles = false;
window.addEventListener("resize", handleResize);
let timer;
function handleResize() {
    const allEls = document.querySelectorAll(".candle");
    allEls.forEach(eachEl => {
        document.body.removeChild(eachEl);
    });
    if (timer)
        clearTimeout(timer);
    timer = setTimeout(() => {
        start();
    }, 100);
}
function start() {
    const safePoints = getSafePoints(spawnPoints, amtInEachSpawnPoint, remainderAmtForMiddleSpawnPoint);
    const candles = makeCandles(amtOfPoints);
    setTimeout(() => {
        canStartBlowingOutCandles = true;
    }, amtOfPoints * 100 + 1000);
    safePoints.forEach((eachPositionArr, eachPositionArrIndex) => {
        addCandleToLocation(candles[eachPositionArrIndex], eachPositionArr, document.body);
    });
}
function getSafePoints(seenSpawnPoints, seenAmtInEachSpawnPoint, seenRemainderAmtForMiddleSpawnPoint) {
    const localSafePoints = [];
    seenSpawnPoints.forEach((eachEl) => {
        const { left, top, width, height } = eachEl.getBoundingClientRect();
        const limiter = 10;
        const amtToLoop = eachEl.id === "spawnPoint" ? seenAmtInEachSpawnPoint + seenRemainderAmtForMiddleSpawnPoint : seenAmtInEachSpawnPoint;
        for (let index = 0; index < amtToLoop; index++) {
            const randomX = left + limiter + (Math.floor(Math.random() * width) - limiter * 2);
            const randomY = top + Math.floor(Math.random() * height - 10);
            localSafePoints.push([Math.floor(randomX), Math.floor(randomY)]);
        }
    });
    return localSafePoints;
}
function addCandleToLocation(candle, position, floorEl) {
    candle.style.left = `${position[0]}px`;
    candle.style.top = `${position[1]}px`;
    candle.style.translate = `0 -85%`;
    candle.style.zIndex = `${position[1]}`;
    floorEl.appendChild(candle);
}
function makeCandles(amtToMake) {
    const divArray = [];
    for (let index = 0; index < amtToMake; index++) {
        let divElement = document.createElement("div");
        divElement.classList.add("candle");
        const randomHeight = Math.floor(Math.random() * 10) + 60;
        divElement.style.setProperty(`--candleHeight`, `${randomHeight}px`);
        divElement.style.setProperty(`--candleWidth`, `20px`);
        divElement.style.setProperty(`--delayTime`, `${1000 + (index * 100)}ms`);
        let flameDiv = document.createElement("div");
        flameDiv.classList.add("flame");
        flameDiv.classList.add("active");
        divElement.appendChild(flameDiv);
        let shadowDiv = document.createElement("div");
        shadowDiv.classList.add("shadow");
        divElement.appendChild(shadowDiv);
        divArray.push(divElement);
    }
    return divArray;
}
let message = document.querySelector("#message");
let openingMessageCont = document.getElementById("openingMessage");
let birthdayCakeCont = document.getElementById("birthdayCakeCont");
let yesButton = document.querySelector("#yes");
let noButton = document.querySelector("#no");
yesButton.addEventListener("click", yesClick);
noButton.addEventListener("click", noClick);
function yesClick() {
    openingMessageCont.style.display = "none";
    birthdayCakeCont.style.display = "block";
    //make candles on cake
    start();
    message.innerHTML = "Make a Wish. <br>Blow out the candles.";
    //  store the audio context
    let audioCon = new AudioContext();
    //  store media stream source
    let mediaStreamSource = null;
    //  store script processor node
    let scriptProcessorNode = null;
    //  store the threshold value
    let threshold = 0.2;
    // function to handle the microphone input
    function handleMicInput(stream) {
        // create a media stream source from the stream
        mediaStreamSource = audioCon.createMediaStreamSource(stream);
        // create a script processor node with a buffer size of 4096 and one input and output channel
        scriptProcessorNode = audioCon.createScriptProcessor(4096, 1, 1);
        // connect the media stream source to the script processor node
        mediaStreamSource.connect(scriptProcessorNode);
        // connect the script processor node to the destination
        scriptProcessorNode.connect(audioCon.destination);
        // add an event listener for the audio process event
        scriptProcessorNode.addEventListener("audioprocess", function (event) {
            // get the input buffer from the event
            let inputBuffer = event.inputBuffer;
            // get the data from the input buffer
            let data = inputBuffer.getChannelData(0);
            // create a variable to store the maximum value
            let max = 0;
            // loop through the data
            for (let i = 0; i < data.length; i++) {
                // get the absolute value of the data point
                let value = Math.abs(data[i]);
                // check if the value is greater than the max
                if (value > max) {
                    // update the max value
                    max = value;
                }
            }
            // check if the max value is greater than the threshold
            if (max > threshold) {
                blowOutCandle();
            }
        });
    }
    // mic error handling
    function handleMicErr(error) {
        message.innerHTML = "Sorry, there was an error accessing your microphone: " + error.message;
    }
    // request mic access 
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(handleMicInput)
        .catch(handleMicErr);
}
function noClick() {
    message.innerHTML = "...your pillow will be warm... 🧍🏾";
}

var audio = new Audio("Justin_Timberlake_-_Mirrors.mp3");
var isPlaying = false;

function togglePlayPause() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
    }
    isPlaying = !isPlaying;
}

  

  function blowOutCandle() {
    if (!canStartBlowingOutCandles)
        return;
    const allActiveFlames = document.querySelectorAll(".active");
    const randIndex = Math.floor(Math.random() * allActiveFlames.length);
    const chosenEl = allActiveFlames[randIndex];
    chosenEl.classList.add("putFlameOut");
    chosenEl.classList.remove("active");
    console.log(`$chosenEl`, chosenEl);
    let amtPutOut = 0;
    allActiveFlames.forEach(eachEl => {
        if (eachEl.className.includes("putFlameOut")) {
            amtPutOut++;
            if (amtPutOut > allActiveFlames.length) {
                amtPutOut = allActiveFlames.length;
            }
        }
    });
    console.log(`$amtPutOut`, amtPutOut);
    if (allActiveFlames.length === amtPutOut) {
        message.innerHTML = "Happy Birthday Elise<br><br>May the joy you spread daily multiply and come back to you. Have a great 19th and more. You're beautiful, talented, awesome and I pray nothing brings you down. I wish you all the best. Love you fr 🙏🏾💞. Stay Blessed To-funkle! 🗣️ ";       
        
        
    }

          
    }


