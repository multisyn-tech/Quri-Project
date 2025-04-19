import React, { useState } from 'react';

const Button = ({ children, onClick, gradientFrom, gradientMid, gradientTo }) => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
            onClick();
        }, 300);
    };

    return (
        <button
            className={`flex justify-center border items-center text-white font-normal py-2.5 px-4 rounded-full w-full text-xl transition ease-out duration-300${clicked ? 'transform scale-95 shadow-none' : 'shadow-[0px_7px_21px_0px_rgba(0,0,0,0.14)]'}`}
            style={{
                border: '2px solid transparent',
                // borderRadius: '1rem',
                background: `linear-gradient(90deg, ${gradientFrom} 0%, ${gradientMid} 50%, ${gradientTo} 100%)`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box',
            }}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

export const Button2 = ({ children, onClick, gradientFrom, gradientMid, gradientTo }) => {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        setClicked(true);
        setTimeout(() => {
            setClicked(false);
            onClick();
        }, 300);
    };

    return (
        <button
            className={`flex justify-center border font-normal items-center py-2.5 px-4 rounded-full w-full text-xl transition ease-out duration-300${clicked ? 'transform scale-95 shadow-none' : 'shadow-[0px_7px_21px_0px_rgba(0,0,0,0.14)]'}`}
            style={{
                border: '2px solid transparent',
                // borderRadius: '1rem',
                backgroundImage: `linear-gradient(white, white), linear-gradient(90deg, ${gradientFrom} 0%, ${gradientMid} 50%, ${gradientTo} 100%)`,
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
            }}
            onClick={handleClick}
        >
            {children}
        </button>
    );

};


export default Button;
