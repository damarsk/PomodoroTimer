const notifier = require('node-notifier');
const moment = require('moment');
const argTime = process.argv.slice(2);

console.log(`Argument received: ${argTime}`);
const POMODORO_DURATION = parseFloat(argTime[0]) || 25;
const BREAK_DURATION = parseFloat(argTime[1]) || 5;

if (isNaN(POMODORO_DURATION) || isNaN(BREAK_DURATION) || POMODORO_DURATION <= 0 || BREAK_DURATION <= 0) {
    console.error('Invalid input. Please provide valid numbers for Pomodoro and Break durations.');
    process.exit(1);
}

let isWorking = true;
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
    
    console.log(`\n${isWorking ? '💻 Starting work session' : '☕ Starting break session'} - ${duration} minutes`);

    const timer = setInterval(() => {
        remainingTime--;

        const formattedTime = formattingTime(remainingTime);
        console.log(`${isWorking ? '💻 Work' : '☕ Break'} time remaining: ${formattedTime}`);

        if (remainingTime === 0) {
            clearInterval(timer);
            
            notifier.notify({
                title: isWorking ? '💻 Work Session Finished!' : '☕ Break Finished!',
                message: isWorking ? 'Great job! Time for a break!' : 'Break over! Ready to work?',
                sound: true,
                wait: true
            });

            isWorking = !isWorking;
            
            const nextDuration = isWorking ? POMODORO_DURATION : BREAK_DURATION;
            startTimer(nextDuration);
        }
    }, 1000);
}

console.log('💻 Pomodoro Timer Started!');
console.log(`Work duration: ${POMODORO_DURATION} minutes`);
console.log(`Break duration: ${BREAK_DURATION} minutes`);
startTimer(POMODORO_DURATION);