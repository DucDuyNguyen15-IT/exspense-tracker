import { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  // Hàm xử lý khi user click vào một chip gợi ý trong ChatWindow
  const handleSuggestion = (text) => {
    setSuggestion(text);
    // Reset để ChatInput có thể nhận giá trị mới trong lần tới
    setTimeout(() => setSuggestion(""), 100);
  };

  return (
    <div className="chatbot-wrapper" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      {isOpen ? (
        <div className="chat-window-container stat-card" style={{ 
          width: 380, 
          height: 550, 
          display: 'flex', 
          flexDirection: 'column', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
          padding: 0, 
          overflow: 'hidden', 
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'var(--surface, #0f0f0f)',
          backdropFilter: 'blur(25px)',
          borderRadius: '28px',
          animation: 'scaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}>
          {/* Header với đèn báo online */}
          <div className="chat-header" style={{ padding: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 12px #10b981' }}></div>
              <span style={{ fontWeight: 800, color: 'var(--indigo, #6366f1)', letterSpacing: '0.8px', fontSize: '0.85rem' }}>D-ASSISTANT AI</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1, padding: '5px', opacity: 0.6, transition: 'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity = 1}
              onMouseOut={e => e.currentTarget.style.opacity = 0.6}
            >
              ×
            </button>
          </div>

          {/* Khu vực hiển thị tin nhắn */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
             <ChatWindow onSuggestionClick={handleSuggestion} />
          </div>

          {/* Ô nhập liệu chân trang */}
          <ChatInput initialValue={suggestion} />
        </div>
      ) : (
        /* Nút tròn nổi (Trigger) */
        <button 
          onClick={() => setIsOpen(true)}
          className="chat-trigger-btn"
          style={{ 
            width: 65, 
            height: 65, 
            borderRadius: '22px', 
            background: 'var(--indigo, #6366f1)', 
            color: 'white', 
            fontSize: '1.8rem', 
            border: 'none', 
            cursor: 'pointer', 
            boxShadow: '0 12px 30px rgba(99, 102, 241, 0.4)', 
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(8deg)';
            e.currentTarget.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.5)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.4)';
          }}
        >
          <span style={{ zIndex: 2 }}>🤖</span>
          {/* Hiệu ứng tia sáng chạy qua nút */}
          <div style={{ 
            position: 'absolute', 
            top: 0, left: '-100%', 
            width: '100%', height: '100%', 
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', 
            animation: 'shimmer 3s infinite' 
          }}></div>
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.8) translateY(30px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          30%, 100% { left: 100%; }
        }
      `}} />
    </div>
  );
}
