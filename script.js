const startElement = document.getElementById('start');
const stopElement = document.getElementById('stop');
const resetElement = document.getElementById('reset');
const timerElement = document.getElementById('timer');
let interval;
let timeLeft = 1500;
const audioElement = new Audio('dreamers_jungkook.mp3');
let wakeLock = null;

function updateTime() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  let formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  timerElement.innerHTML = formattedTime;
}

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    updateTime();
    if (timeLeft === 0) {
      clearInterval(interval);
      audioElement.play();
      timeLeft = 1500;
      releaseWakeLock(); // Release the wake lock when the timer reaches zero
    }
  }, 1000);

  requestWakeLock(); // Request a wake lock when the timer starts
}

function stopTimer() {
  clearInterval(interval);
  audioElement.pause();
  releaseWakeLock(); // Release the wake lock when the timer stops
}

function resetTimer() {
  clearInterval(interval);
  timeLeft = 1500;
  updateTime();
  audioElement.pause();
  releaseWakeLock(); // Release the wake lock when the timer resets
}

function requestWakeLock() {
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').then((lock) => {
      wakeLock = lock;
      console.log('Wake lock acquired');
    });
  }
}

function releaseWakeLock() {
  if (wakeLock !== null) { 
    wakeLock.release()
      .then(() => {
        wakeLock = null;
        console.log('Wake lock released');
      })
      .catch((error) => {
        console.error('Failed to release wake lock:', error);
      });
  }
}

startElement.addEventListener("click", startTimer);
stopElement.addEventListener("click", stopTimer);
resetElement.addEventListener("click", resetTimer);