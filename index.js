const App = () => {
    const [displayTime, setDisplayTime] = React.useState(5);
    const [breakTime, setBreakTime] = React.useState(3);
    const [sessionTime, setSessionTime] = React.useState(displayTime);
    const [timerOn, setTimerOn] = React.useState(false);
    const [onBreak, setOnBreak] = React.useState(false);

    const formatTime = (time) => {
        let minutes = Math.floor(time/60);
        let seconds = time % 60;

        return (
            (minutes < 10 ? "0" + minutes : minutes)
            + ":" +
            (seconds < 10 ? "0" + seconds : seconds)
            )
    }

    const changeTime = (amount, type) => {
        if(type === 'break') {
            if(breakTime <= 60 && amount < 0) {
                return;
            }
            setBreakTime((prev) => prev + amount)
        } else {
            if(sessionTime <= 60 && amount < 0) {
                return;
            }
            setSessionTime((prev) => prev + amount)
            if(!timerOn){
                setDisplayTime(sessionTime + amount );
            }
        }
    }

    const controlTime = () => {
        let second = 1000;
        let date = new Date().getTime();
        let nextDate = new Date().getTime() + second;
        let onBreakVariable = onBreak;
        if(!timerOn){
            let interval = setInterval(() => {
                date = new Date().getTime();
                if(date > nextDate){
                    setDisplayTime((prev) => {
                        if(prev <= 0 && !onBreakVariable){
                            onBreakVariable = true;
                            setOnBreak(true);
                            return breakTime;
                        } else if(prev <= 0 && onBreakVariable) {
                            onBreakVariable = false;
                            setOnBreak(false);
                            return sessionTime;
                        }
                        return prev - 1;
                    });
                    nextDate += second;
                }
            }, 30);
            localStorage.clear();
            localStorage.setItem("interval-id", interval);
        }
        if(timerOn){
            clearInterval(localStorage.getItem("interval-id"))
        }
        setTimerOn(!timerOn);
    }

    const resetTime = () => {
        setDisplayTime(25*60)
        setBreakTime(5*60)
        setSessionTime(25*60)
    }

    return(
        <div className=" text-center m-5">
            <h1>STOP CLOCK</h1>
            <div className="row">
                <div className="col">
                    <Length 
                        title={"Break Length"} 
                        changeTime={changeTime} 
                        type={"break"} 
                        time={breakTime} 
                        formatTime={formatTime}
                    />
                </div>
                <div className="col">
                   <Length 
                        title={"Session Length"} 
                        changeTime={changeTime} 
                        type={"session"} 
                        time={sessionTime} 
                        formatTime={formatTime}
                    /> 
                </div>
            </div>
            <div>
                <h3>{onBreak ? "Break" : "Session"}</h3>
            <h1>{formatTime(displayTime)}</h1>
            <button className="btn btn-info text-black" onClick={controlTime}>
                {timerOn ? <i class="bi bi-pause-fill"></i> : <i class="bi bi-play-fill"></i>}
            </button>
            <button className="btn btn-info text-black" onClick={resetTime}>
                <i class="bi bi-arrow-clockwise"></i>
            </button>
            </div>
            
        </div>
    )
}

const Length = ({title, changeTime, type, time, formatTime}) => {
    return (
        <div>
            <h3>{title}</h3>
            <div className="text-center">
                <button className="btn btn-info" onClick={() => changeTime(-60, type)} >
                    <i className="bi bi-arrow-down-square-fill"></i>
                </button>
                <h3>{formatTime(time)}</h3>
                <button className="btn btn-info" onClick={() => changeTime(60, type)} >
                    <i className="bi bi-arrow-up-square-fill"></i>
                </button>
            </div>
        </div>
    )
}

ReactDOM.render(<App/>, document.getElementById("app"))