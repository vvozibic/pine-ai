// Основной каркас React-приложения с CSS Modules и Monaco Editor

import MonacoEditor from "@monaco-editor/react";
import React, { KeyboardEvent, useRef, useState } from "react";
import { FiMaximize2, FiMinimize2 } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./App.module.css";
import ParsedView from "./ParsedView";
import TVChart from "./TVChart";
import { useChat } from "./useChat";

export default function App() {
  const [chartFullScreen, setChartFullScreen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [editorWidth, setEditorWidth] = useState(600);
  const [input, setInput] = useState("");
  const [editorCode, setEditorCode] = useState(
    '// @version=5\nstrategy("My Strategy", overlay=true)\n\n// Your PineScript code here'
  );

  const dragRef = useRef(null);
  const dragRef2 = useRef(null);

  const { messages, sendMessage, loading } = useChat();

  console.log(messages);

  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    const startX = e.clientX;
    const startSidebarWidth = sidebarWidth;
    const startEditorWidth = editorWidth;

    const onMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      if (type === "sidebar") {
        setSidebarWidth(Math.max(200, startSidebarWidth + delta));
      } else if (type === "editor") {
        setEditorWidth(Math.max(400, startEditorWidth + delta));
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const insertCodeToEditor = (code: string) => {
    setEditorCode(code);
  };

  const renderers = {
    code({ inline, className, children }: any) {
      const raw = String(children).trim();
      const lang = /language-(\w+)/.exec(className || "")?.[1];

      const looksLikePine =
        lang === "pine" ||
        /strategy|plot|@version|entry|exit|sma|ema|rsi/.test(raw);

      if (looksLikePine) {
        return (
          <div style={{ background: "#2d2d30", padding: 8, marginBottom: 8 }}>
            <pre>{raw}</pre>
            <button
              onClick={() => insertCodeToEditor(raw)}
              style={{
                marginTop: 4,
                fontSize: 12,
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              ⬇️ Insert to editor
            </button>
          </div>
        );
      } else {
        return (
          <pre>
            <code>{raw}</code>
          </pre>
        );
      }
    },
  };

  return (
    <div
      className={chartFullScreen ? styles.fullChartContainer : styles.container}
    >
      {!chartFullScreen && (
        <div className={styles.sidebar} style={{ width: `${sidebarWidth}px` }}>
          <div className={styles.chatBubble}>
            {messages.map((msg, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <strong>{msg.role === "assistant" ? "🤖" : "🧑"}</strong>:
                <ReactMarkdown
                  children={msg.content}
                  remarkPlugins={[remarkGfm]}
                  components={renderers}
                />
              </div>
            ))}
            {loading && <div>⏳ Генерация ответа...</div>}
          </div>

          <div className={styles.chatInputWrapper}>
            <input
              className={styles.chatInput}
              placeholder="Ask about PineScript or trading strategies..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className={styles.sendButton} onClick={handleSubmit}>
              ➤
            </button>
          </div>
        </div>
      )}

      {!chartFullScreen && (
        <div
          ref={dragRef}
          className={styles.dragHandle}
          onMouseDown={(e) => handleMouseDown(e, "sidebar")}
        />
      )}

      {!chartFullScreen && (
        <div
          className={styles.editorWrapper}
          style={{ width: `${editorWidth}px` }}
        >
          <MonacoEditor
            height="100%"
            defaultLanguage="typescript"
            language="pine"
            value={editorCode}
            onChange={(value) => setEditorCode(value || "")}
            theme="vs-dark"
          />
        </div>
      )}

      {!chartFullScreen && (
        <div
          ref={dragRef2}
          className={styles.dragHandle}
          onMouseDown={(e) => handleMouseDown(e, "editor")}
        />
      )}

      <div className={chartFullScreen ? styles.chartFull : styles.chartPreview}>
        <div className={styles.chartHeader}>
          <p>Chart Preview</p>
          <button
            className={styles.toggleButton}
            onClick={() => setChartFullScreen((prev) => !prev)}
          >
            {chartFullScreen ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
        </div>
        <div className={styles.chartPlaceholder}>
          <TVChart />
          <ParsedView code={editorCode || ""} />
        </div>
      </div>
    </div>
  );
}
