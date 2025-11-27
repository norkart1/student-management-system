"use client"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
}

export function Spinner({ size = "md", message = "Loading..." }: SpinnerProps) {
  const sizeClasses = {
    sm: { outer: "w-12 h-12", inner: "w-6 h-6", text: "text-xs" },
    md: { outer: "w-20 h-20", inner: "w-10 h-10", text: "text-sm" },
    lg: { outer: "w-28 h-28", inner: "w-14 h-14", text: "text-base" },
  }

  const sizes = sizeClasses[size]

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes.outer}`}>
        <svg
          className={`${sizes.outer} animate-spin`}
          viewBox="0 0 100 100"
        >
          <circle
            className="stroke-[#CFF4D2]"
            strokeWidth="8"
            fill="none"
            cx="50"
            cy="50"
            r="42"
          />
          <circle
            className="stroke-[#329D9C]"
            strokeWidth="8"
            fill="none"
            cx="50"
            cy="50"
            r="42"
            strokeLinecap="round"
            strokeDasharray="264"
            strokeDashoffset="180"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${sizes.inner} bg-gradient-to-br from-[#329D9C] to-[#56C596] rounded-full flex items-center justify-center shadow-lg`}>
            <svg
              className="w-1/2 h-1/2 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </div>
      </div>
      {message && (
        <p className={`text-[#329D9C] font-medium ${sizes.text}`}>{message}</p>
      )}
    </div>
  )
}
