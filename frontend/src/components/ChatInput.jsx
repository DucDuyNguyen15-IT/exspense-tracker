import React, { useState, useRef, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

export default function ChatInput({ initialValue = "" }) {
  const { sendMessage, isChatLoading } = useAppContext();
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Đồng bộ khi có giá trị truyền vào từ bên ngoài
  useEffect(() => {
    if (initialValue) {
      setInput(initialValue);
      if (textareaRef.current) {
        textareaRef.current.focus();
        setTimeout(adjustHeight, 0);
      }
    }
  }, [initialValue]);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    adjustHeight();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    
    if (trimmedInput && !isChatLoading) {
      sendMessage(trimmedInput);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      aria-label="Chat input form"
      style={{ 
        padding: '16px', 
        borderTop: '1px solid rgba(255,255,255,0.08)', 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '12px',
        background: 'rgba(255,255,255,0.01)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div className="input-wrapper" style={{ flex: 1, position: 'relative' }}>
        <label htmlFor="chat-textarea" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
          Nhập tin nhắn
        </label>
        <textarea
          id="chat-textarea"
          ref={textareaRef}
          value={input}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={isChatLoading ? "AI đang tính toán..." : "Nhắn gì đó sương sương..."}
          readOnly={isChatLoading}
          rows={1}
          aria-busy={isChatLoading}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            padding: '12px 16px',
            color: 'var(--text)',
            fontSize: '0.92rem',
            lineHeight: '1.5',
            resize: 'none',
            outline: 'none',
            maxHeight: '120px',
            transition: 'all 0.2s ease',
            boxShadow: isChatLoading ? 'none' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
            overflowY: 'auto'
          }}
        />
      </div>

      <button 
        type="submit"
        disabled={!input.trim() || isChatLoading}
        aria-label={isChatLoading ? "Đang gửi..." : "Gửi tin nhắn"}
        style={{
          width: '48px',
          height: '48px',
          flexShrink: 0,
          borderRadius: '16px',
          border: 'none',
          background: (input.trim() && !isChatLoading) ? 'var(--indigo, #6366f1)' : 'rgba(255,255,255,0.05)',
          color: 'white',
          cursor: (input.trim() && !isChatLoading) ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: (input.trim() && !isChatLoading) ? '0 8px 20px rgba(99, 102, 241, 0.3)' : 'none'
        }}
      >
        {isChatLoading ? (
          <div role="status" aria-live="polite" className="spinner" style={{ 
            width: '22px', 
            height: '22px', 
            border: '2.5px solid rgba(255,255,255,0.2)', 
            borderTopColor: 'white', 
            borderRadius: '50%', 
            animation: 'spin 0.8s cubic-bezier(0.5, 0, 0.5, 1) infinite' 
          }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'translateX(1px)' }}>
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        )}
      </button>
    </form>
  );
}
