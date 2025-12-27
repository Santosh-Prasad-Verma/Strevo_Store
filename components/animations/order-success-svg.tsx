"use client"

export function OrderSuccessSVG() {
  return (
    <div className="relative w-32 h-32 mx-auto">
      <style jsx>{`
        @keyframes circleScale {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes glowPulse {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); opacity: 0.15; }
          100% { transform: scale(1); opacity: 0; }
        }
        .circle { animation: circleScale 0.4s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
        .check { 
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: checkDraw 0.5s ease-out 0.5s forwards;
        }
        .glow { animation: glowPulse 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
      `}</style>

      <div className="glow absolute inset-0 bg-indigo-500 rounded-full blur-2xl" />
      
      <svg className="relative w-full h-full" viewBox="0 0 128 128">
        <circle className="circle" cx="64" cy="64" r="60" fill="white" stroke="black" strokeWidth="2" />
        <path className="check" d="M 35 64 L 55 84 L 93 46" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
