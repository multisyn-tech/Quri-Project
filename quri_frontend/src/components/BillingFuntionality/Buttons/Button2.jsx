import React, { useState } from 'react';

const Button = ({ children, onClick, gradientFrom, gradientTo }) => {
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
            className={`flex justify-center items-center text-white py-2 px-4 rounded-xl w-full text-xl transition ease-out duration-300${clicked ? 'transform scale-95 shadow-none' : 'shadow-[0px_7px_21px_0px_rgba(0,0,0,0.14)]'}`}
            style={{
                background: `linear-gradient(90deg, ${gradientFrom} 0.91%, ${gradientTo} 100.96%)`
            }}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}

export default Button;
