"use client"

export function OrderSuccessCSS() {
  return (
    <>
      <style jsx>{`
        @keyframes circle-in {
          0% { transform: scale(0); opacity: 0; }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes check-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes glow {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 0.15; transform: scale(1.2); }
        }
        .success-circle {
          animation: circle-in 400ms cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }
        .success-check {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: check-draw 500ms ease-out 500ms forwards;
        }
        .success-glow {
          animation: glow 1200ms cubic-bezier(0.19, 1, 0.22, 1);
        }
        @media (prefers-reduced-motion: reduce) {
          .success-circle, .success-check, .success-glow { animation: none; opacity: 1; }
        }
      `}</style>

      <div className="relative w-32 h-32 mx-auto">
        <div className="success-glow absolute inset-0 bg-indigo-500 rounded-full blur-2xl" />
        <svg className="relative w-full h-full" viewBox="0 0 128 128">
          <circle className="success-circle" cx="64" cy="64" r="60" fill="white" stroke="black" strokeWidth="2" />
          <path className="success-check" d="M 35 64 L 55 84 L 93 46" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </>
  )
}
