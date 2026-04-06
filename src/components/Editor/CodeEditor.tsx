/**
 * CodeEditor.tsx
 *
 * Monaco Editor 封装组件。
 *
 * 功能：
 * - 支持 html / css / javascript 三种语言
 * - 顶部工具栏显示当前语言标签 + 片段快捷按钮
 * - 暴露 insertSnippet 方法（通过 forwardRef）供父组件调用
 */

import { useCallback, useRef, forwardRef, useImperativeHandle } from 'react'
import Editor, { OnMount } from '@monaco-editor/react'
import type * as Monaco from 'monaco-editor'
import { SNIPPETS, MONACO_LANGUAGE, TAB_LABELS, type SnippetLanguage } from '@/data/snippets'

// ---------------------------------------------------------------------------
// 类型
// ---------------------------------------------------------------------------

export interface CodeEditorProps {
  /** 当前语言 */
  language: SnippetLanguage
  /** 编辑器内容 */
  value: string
  /** 内容变更回调 */
  onChange: (value: string | undefined) => void
}

/** 暴露给父组件的方法 */
export interface CodeEditorHandle {
  /** 在光标处插入指定文本 */
  insertSnippet: (text: string) => void
}

// ---------------------------------------------------------------------------
// 组件
// ---------------------------------------------------------------------------

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  ({ language, value, onChange }, ref) => {
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)

    /** 向外暴露 insertSnippet */
    useImperativeHandle(ref, () => ({
      insertSnippet(text: string) {
        const editor = editorRef.current
        if (!editor) return
        const selection = editor.getSelection()
        if (!selection) return
        editor.executeEdits('snippet', [
          { range: selection, text, forceMoveMarkers: true },
        ])
        editor.focus()
      },
    }))

    /** Monaco Editor 挂载回调：保存实例引用并聚焦 */
    const handleMount: OnMount = useCallback((editor) => {
      editorRef.current = editor
      editor.focus()
    }, [])

    // 当前语言对应的片段列表
    const snippets = SNIPPETS[language]
    const tabLabel = TAB_LABELS[language]

    return (
      <div className="h-full flex flex-col bg-[#1e1e1e]">
        {/* ── 顶栏：标签 + 片段按钮 ── */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#252526] border-b border-[#3c3c3c]">
          {/* 语言标签 */}
          <span className="text-sm text-gray-300 font-medium">{tabLabel}</span>

          {/* 片段快捷按钮 */}
          <div className="flex items-center gap-1">
            {snippets.map((s) => (
              <button
                key={s.label}
                title={`插入: ${s.label}`}
                onClick={() => {
                  const editor = editorRef.current
                  if (!editor) return
                  const selection = editor.getSelection()
                  if (!selection) return
                  editor.executeEdits('snippet', [
                    { range: selection, text: s.code, forceMoveMarkers: true },
                  ])
                  editor.focus()
                }}
                className="text-xs px-1.5 py-0.5 rounded text-gray-500 hover:text-gray-200 hover:bg-white/10 transition"
              >
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Monaco Editor ── */}
        <div className="flex-1">
          <Editor
            height="100%"
            language={MONACO_LANGUAGE[language]}
            value={value}
            onChange={onChange}
            onMount={handleMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              minimap:              { enabled: false },
              scrollBeyondLastLine:  false,
              automaticLayout:       true,
              tabSize:               2,
              wordWrap:              'on',
              lineNumbers:           'on',
              glyphMargin:           false,
              folding:               true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars:   3,
              renderLineHighlight:   'line',
              scrollbar: {
                verticalScrollbarSize:   10,
                horizontalScrollbarSize: 10,
              },
            }}
          />
        </div>
      </div>
    )
  }
)

CodeEditor.displayName = 'CodeEditor'
