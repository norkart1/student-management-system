import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-slate-400 selection:bg-emerald-100 selection:text-emerald-700 border-slate-200 h-10 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20',
        'aria-invalid:ring-red-200 aria-invalid:border-red-500',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
