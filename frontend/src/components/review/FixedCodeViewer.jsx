import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Code2 } from 'lucide-react'

export default function FixedCodeViewer({ code, language }) {
  const [copied, setCopied] = useState(false)

  if (!code) return null

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const langMap = {
    javascript: 'javascript', typescript: 'typescript', python: 'python',
    java: 'java', 'c++': 'cpp', c: 'c', 'c#': 'csharp', go: 'go',
    rust: 'rust', php: 'php', ruby: 'ruby', swift: 'swift', kotlin: 'kotlin',
    sql: 'sql', bash: 'bash', html: 'markup', css: 'css', react: 'jsx',
  }
  const lang = langMap[language?.toLowerCase()] || 'text'

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 size={15} className="text-accent" />
          <span className="font-display font-semibold text-sm text-white">Optimized Code</span>
          <span className="text-xs text-muted font-mono bg-surface px-2 py-0.5 rounded border border-border ml-1">
            {language}
          </span>
        </div>
        <button onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-body text-muted hover:text-accent transition-colors px-2 py-1 rounded hover:bg-accent/10">
          {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="syntax-container max-h-[500px] overflow-auto">
        <SyntaxHighlighter
          language={lang}
          style={oneDark}
          customStyle={{ margin: 0, background: '#111118', padding: '1.25rem' }}
          showLineNumbers
          lineNumberStyle={{ color: '#374151', fontSize: '0.75rem' }}>
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
