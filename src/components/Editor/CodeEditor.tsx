import Editor, { OnMount } from '@monaco-editor/react'
import { useCallback, useRef } from 'react'
import type * as Monaco from 'monaco-editor'

interface CodeEditorProps {
  language: 'html' | 'css' | 'javascript'
  value: string
  onChange: (value: string | undefined) => void
}

const languageMap = {
  html: 'html',
  css: 'css',
  javascript: 'javascript'
} as const

const tabLabels = {
  html: 'HTML',
  css: 'CSS',
  javascript: 'JS'
} as const

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor
    editor.focus()
  }, [])

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3c3c3c]">
        <span className="text-sm text-gray-300 font-medium">
          {tabLabels[language]}
        </span>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          language={languageMap[language]}
          value={value}
          onChange={onChange}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Consolas', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'line',
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10
            }
          }}
        />
      </div>
    </div>
  )
}