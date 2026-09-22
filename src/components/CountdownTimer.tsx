import { useState, useEffect } from 'react';
import { formatBengaliTimerNumber } from '../utils/bengaliUtils';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

interface CountdownTimerProps {
  variant?: 'dark' | 'light' | 'gold' | 'bento';
}

export default function CountdownTimer({ variant = 'gold' }: CountdownTimerProps) {
  // Target: June 1, 2027 (Golden Jubilee Festival Ullapara Press Club)
  const targetDate = new Date('2027-06-01T00:00:00');

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +targetDate - +new Date();
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isComplete: false
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'দিন', value: timeLeft.days },
    { label: 'ঘণ্টা', value: timeLeft.hours },
    { label: 'মিনিট', value: timeLeft.minutes },
    { label: 'সেকেন্ড', value: timeLeft.seconds }
  ];

  if (variant === 'bento') {
    return (
      <div className="grid grid-cols-4 gap-2 text-center w-full">
        {timeBlocks.map((block, idx) => (
          <div 
            key={idx} 
            className="bg-amber-50 p-2.5 sm:p-3 rounded-xl border-b-4 border-amber-500 shadow-xs flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5"
          >
            <span className="block text-2xl sm:text-3xl font-black text-[#0d3b66] font-mono tracking-tight">
              {formatBengaliTimerNumber(block.value)}
            </span>
            <span className="text-[10px] sm:text-xs uppercase font-bold text-slate-500 mt-1">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'gold') {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {timeBlocks.map((block, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-b from-amber-500/20 to-amber-600/10 border border-amber-400/40 rounded-xl backdrop-blur-md flex items-center justify-center shadow-inner">
              <span className="text-2xl sm:text-3xl font-bold text-amber-300 font-mono tracking-tight">
                {formatBengaliTimerNumber(block.value)}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-amber-200/80 font-medium mt-1.5">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'dark') {
    return (
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {timeBlocks.map((block, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-800/90 border border-slate-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl sm:text-2xl font-bold text-white font-mono">
                {formatBengaliTimerNumber(block.value)}
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-slate-400 font-medium mt-1">
              {block.label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Light variant
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {timeBlocks.map((block, idx) => (
        <div key={idx} className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-rose-700 font-mono">
              {formatBengaliTimerNumber(block.value)}
            </span>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
