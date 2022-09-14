// Countdown Timer for the testing page.

const TimerDisplay = (props) => {
    const formatTime = (secs) => {
        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);
        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        minutes = minutes > 9 ? minutes : '0' + minutes;
        seconds = seconds > 9 ? seconds : '0' + seconds;
        return { minutes, seconds };
    }

    const time = formatTime(props.seconds);
    return (
        <div className='test__timer' title='Time Left' style={{
            color: props.seconds > 10 ? null : "red",
        }}>
            {time.minutes} : {time.seconds} 
        </div>
    );
}

export default TimerDisplay;
