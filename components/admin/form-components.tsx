export function FormSection({ label, children, badge }: { label: string; children: React.ReactNode; badge?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3">
        {badge && (
          <span className="px-2 py-0.5 rounded-md bg-brand-50 text-primary text-[10px] font-semibold uppercase tracking-wider">
            {badge}
          </span>
        )}
        <h2 className="font-semibold text-gray-800 text-sm">{label}</h2>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

export function Input({ value, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      value={value ?? ''}
      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    />
  )
}

export function Textarea({ value, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      value={value ?? ''}
      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y"
    />
  )
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
    >
      {children}
    </select>
  )
}

export function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-white font-semibold text-sm shadow-sm shadow-amber-200/50 hover:shadow-md hover:shadow-amber-200/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {saving ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Save Changes
        </>
      )}
    </button>
  )
}

export function SaveMessage({ message, type }: { message: string; type?: 'success' | 'error' }) {
  if (!message) return null
  const isSuccess = type !== 'error'
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm ${
        isSuccess
          ? 'bg-emerald-50 border border-emerald-100 text-emerald-700'
          : 'bg-red-50 border border-red-100 text-red-700'
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {message}
    </div>
  )
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
      {description && <p className="text-gray-500 mt-1 text-sm">{description}</p>}
    </div>
  )
}
