import React, { useEffect, useState } from 'react'

const Countdown = ({ targetTime }) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const target = new Date(targetTime);
        const difference = target - now;

        if (difference <= 0) return null; // Đã hết hạn      

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { hours, minutes, seconds };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (!timeLeft) return;

        const timer = setInterval(() => {
            const newTime = calculateTimeLeft();
            if (!newTime) {
                clearInterval(timer);
            }
            setTimeLeft(newTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetTime, timeLeft]);

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div className="flex flex-col text-neutral-600">
                <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": timeLeft?.hours } /* as React.CSSProperties */} aria-live="polite" aria-label={timeLeft?.hours}>{timeLeft?.hours}</span>
                </span>
                hours
            </div>
            <div className="flex flex-col text-neutral-600">
                <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": timeLeft?.minutes } /* as React.CSSProperties */} aria-live="polite" aria-label={timeLeft?.minutes}>{timeLeft?.minutes}</span>
                </span>
                min
            </div>
            <div className="flex flex-col text-neutral-600">
                <span className="countdown font-mono text-3xl">
                    <span style={{ "--value": timeLeft?.seconds } /* as React.CSSProperties */} aria-live="polite" aria-label={timeLeft?.seconds}>{timeLeft?.seconds}</span>
                </span>
                sec
            </div>
        </div>
    )
}

export default Countdown