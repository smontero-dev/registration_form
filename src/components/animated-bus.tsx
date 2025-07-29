import React from "react";

const AnimatedBus = () => {
  return (
    <svg
      viewBox="0 0 400 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[250px] h-auto"
    >
      <style>
        {`
          .bus-body {
            animation: bus-move 2s ease-in-out infinite;
          }
          @keyframes bus-move {
            0% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
          .wheel {
            transform-origin: center;
            transform-box: fill-box;
            animation: wheel-spin 1s linear infinite;
          }
          @keyframes wheel-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .road-lines {
            animation: road-move 1.5s linear infinite;
          }
          @keyframes road-move {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -60; }
          }
        `}
      </style>

      {/* Road */}
      <path d="M0 180 H400" stroke="#6b7280" strokeWidth="4" />
      <path
        d="M0 180 H400"
        stroke="#f3f4f6"
        strokeWidth="4"
        strokeDasharray="30 30"
        className="road-lines"
      />

      <g className="bus-body">
        {/* Bus Body */}
        <rect x="50" y="80" width="250" height="80" fill="#f59e0b" rx="10" />
        <rect x="60" y="90" width="230" height="20" fill="#fbbf24" />

        {/* Windows */}
        <rect x="70" y="95" width="40" height="30" fill="#a5f3fc" rx="5" />
        <rect x="120" y="95" width="40" height="30" fill="#a5f3fc" rx="5" />
        <rect x="170" y="95" width="40" height="30" fill="#a5f3fc" rx="5" />
        <rect x="220" y="95" width="40" height="30" fill="#a5f3fc" rx="5" />

        {/* Front of bus */}
        <path d="M300 80 L320 110 L320 160 L300 160 Z" fill="#f59e0b" />
        <rect x="305" y="115" width="10" height="20" fill="#a5f3fc" rx="2" />

        {/* Lights */}
        <circle cx="65" cy="145" r="5" fill="#ef4444" />
        <circle cx="315" cy="145" r="5" fill="#facc15" />

        {/* Wheels */}
        <g className="wheel">
          <circle cx="100" cy="160" r="20" fill="#111827" />
          <circle cx="100" cy="160" r="10" fill="#d1d5db" />
        </g>
        <g className="wheel">
          <circle cx="260" cy="160" r="20" fill="#111827" />
          <circle cx="260" cy="160" r="10" fill="#d1d5db" />
        </g>
      </g>
    </svg>
  );
};

export default AnimatedBus;
