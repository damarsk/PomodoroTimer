const notifier = require('node-notifier');
const moment = require('moment');
const argTime = process.argv.slice(2);

console.log(`Argument received: ${argTime}`);
const POMODORO_DURATION = parseInt(argTime[0]) || 25; // default 25 menit
const BREAK_DURATION = parseInt(argTime[1]) || 5;     // default 5 menit

let isWorking = true; // mulai dengan sesi kerja
let remainingTime = 0;

function formattingTime(totalSeconds) {
    const duration = moment.duration(totalSeconds, 'seconds');
    const hours = duration.hours().toString().padStart(2, '0');
    const minutes = duration.minutes().toString().padStart(2, '0');
    const seconds = duration.seconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

function startTimer(duration) {
    remainingTime = duration * 60;
    
    console.log(`\n${isWorking ? '🍅 Starting work session' : '☕ Starting break session'} - ${duration} minutes`);

    const timer = setInterval(() => {
        remainingTime--;

        const formattedTime = formattingTime(remainingTime);
        console.log(`${isWorking ? '🍅 Work' : '☕ Break'} time remaining: ${formattedTime}`);

        if (remainingTime === 0) {
            clearInterval(timer);
            
            // Tampilkan notifikasi berdasarkan sesi yang baru selesai
            notifier.notify({
                title: isWorking ? '🍅 Work Session Finished!' : '☕ Break Finished!',
                message: isWorking ? 'Great job! Time for a break!' : 'Break over! Ready to work?',
                sound: true,
                wait: true
            });

            // Toggle ke sesi berikutnya
            isWorking = !isWorking;
            
            // Mulai sesi berikutnya
            const nextDuration = isWorking ? POMODORO_DURATION : BREAK_DURATION;
            startTimer(nextDuration);
        }
    }, 1000);
}

// Mulai dengan sesi kerja
console.log('🍅 Pomodoro Timer Started!');
console.log(`Work duration: ${POMODORO_DURATION} minutes`);
console.log(`Break duration: ${BREAK_DURATION} minutes`);
startTimer(POMODORO_DURATION);