import React from 'react';

const AmountLoader = ({tablemates, totalAmount, currentAmount, partsToPay }) => {
    const radius = 90; // Radius of the circle
    const strokeWidth = 6; // Stroke width of the circle
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    // Calculate the angle of each segment (based on tablemates)
    const segmentAngle = 360 / tablemates;
    const percentage = (partsToPay / tablemates) * 100;

    // Calculate stroke dasharray and dashoffset for the filled portion
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`; //Dash array
    const strokeDashoffset = circumference; // Start from full circumference to make it visible
    const segmentLength = circumference/tablemates;
    const gapLength = segmentLength*0.1;
    const dashArray = `${segmentLength-gapLength} ${gapLength}`;


    return (
      <div className="flex justify-center items-center">
        <svg height={radius * 2} width={radius * 2}>
          {/* Background circle (Gray, unfilled) */}
          <circle
            stroke="#E0E0E0" // Gray background
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            strokeDasharray={circumference}
            strokeDashoffset={0} // No offset, full circle
          />
          {/* Progress circle (Full circle since we're keeping the total amount fixed) */}
          <circle
            stroke="#6D00CB" // Gradient or primary color for filled portion
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 0.35s' }}
          />
          {/* Total bill text */}
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="24"
            fontWeight={'bold'}
            fill="#000"
          >
            {totalAmount}
          </text>
          {/* Label text */}
          <text
            x="50%"
            y="65%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="12"
            fill="#888"
          >
           Amount to share
          </text>
        </svg>
      </div>
    );
};

export default AmountLoader;