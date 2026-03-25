'use client';

import { useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ value, onChange, readOnly = false }: Props) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-line">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={(v) => onChange(v || '')}
        onMount={handleMount}
        theme="vs-dark"
        options={{
          readOnly,
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: 'on',
          renderLineHighlight: 'line',
          bracketPairColorization: { enabled: true },
          tabSize: 2,
          wordWrap: 'on',
          automaticLayout: true,
          contextmenu: false,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          parameterHints: { enabled: false },
        }}
      />
    </div>
  );
}
