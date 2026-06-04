export default function CodeEditor({ value, onChange, language }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-border focus-within:border-accent/40 transition-colors"
      style={{ background: '#0d0d14' }}>
      {/* Editor header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-muted font-mono ml-2">
          {language ? `${language.toLowerCase()}.snippet` : 'paste-your-code-here'}
        </span>
      </div>

      {/* Line numbers + textarea side by side */}
      <div className="flex">
        <div className="select-none py-4 px-3 text-right border-r border-border min-w-[3rem]"
          style={{ background: '#0a0a0f' }}>
          {(value || '').split('\n').map((_, i) => (
            <div key={i} className="text-xs text-muted/50 font-mono leading-6">{i + 1}</div>
          ))}
          {!value && <div className="text-xs text-muted/50 font-mono leading-6">1</div>}
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          placeholder={`// Paste your ${language || 'code'} here...\n\nfunction example() {\n  // AI will analyze this\n}`}
          className="flex-1 p-4 bg-transparent text-sm font-mono text-gray-300 placeholder:text-muted/40
                     resize-none focus:outline-none min-h-[320px] leading-6"
          style={{ tabSize: 2 }}
        />
      </div>
    </div>
  )
}
