import React from 'react';

export default function BackgroundBlur() {
    return (
        <>
            <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[#08B74F]/10 blur-[180px] rounded-full pointer-events-none z-0" />
            <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] bg-[#08B74F]/5 blur-[120px] rounded-full pointer-events-none z-0" />
        </>
    );
}
