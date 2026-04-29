import React, { useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";

export default function ChatWindow({ onSuggestionClick }) {
  const { messages, isChatLoading, chatError, clearChat } = useAppContext();
  const scrollRef = useRef(null);

  // Auto-scroll với fix cho iOS Safari
  useEffect(() => {
    if (scrollRef.current) {
      // Dùng requestAnimationFrame để đảm bảo tính toán layout đã xong trên iOS
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isChatLoading]);

  const renderIntentBadge = (intent) => {
    const badges = {
      ADD_EXPENSE: { label: "💸 Đã ghi chi tiêu", color: "var(--expense, #ef4444)" },
      ADD_INCOME: { label: "💰 Đã ghi thu nhập", color: "var(--income, #10b981)" },
      SET_BUDGET: { label: "🎯 Đã cập nhật ngân sách", color: "var(--indigo, #6366f1)" },
      QUERY_REPORT: { label: "📊 Báo cáo", color: "var(--text-secondary, #9ca3af)" },
    };

    const badge = badges[intent];
    if (!badge) return null;

    return (
      <div className="intent-badge" style={{ 
        fontSize: '0.7rem', 
        marginTop: '6px', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '4px',
        color: badge.color,
        fontWeight: 600,
        opacity: 0.9,
        animation: 'fadeIn 0.3s ease'
      }}>
        {badge.label}
      </div>
    );
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      
      {messages.length > 1 && (
        <button 
          onClick={clearChat}
          aria-label="Xóa lịch sử trò chuyện"
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            zIndex: 10, 
            background: 'rgba(255,255,255,0.05)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)', 
            color: 'var(--text-secondary)', 
            padding: '4px 10px', 
            borderRadius: '8px', 
            fontSize: '0.7rem', 
            cursor: 'pointer'
          }}
        >
          🗑️ Dọn dẹp
        </button>
      )}

      <div 
        className="message-list" 
        role="log" 
        aria-live="polite" 
        aria-relevant="additions"
        style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {messages.length <= 1 && !isChatLoading && (
          <div className="empty-chat" style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', padding: '0 20px' }}>
            <div aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '15px', animation: 'bounce 2s infinite' }}>🤖</div>
            <h4 style={{ margin: '0 0 10px 0', color: 'var(--text)' }}>D-Assistant đã sẵn sàng</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
              {[
                { label: "📝 Thêm chi tiêu", val: "Ăn sáng 45k" },
                { label: "📊 Xem báo cáo", val: "Tháng này tiêu bao nhiêu rồi?" },
                { label: "🎯 Đặt ngân sách", val: "Đặt ngân sách mua sắm 2 triệu" }
              ].map(chip => (
                <button 
                  key={chip.label}
                  onClick={() => onSuggestionClick(chip.val)}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text)', padding: '10px 16px', borderRadius: '20px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div 
            key={m.id} 
            className={`msg-wrapper ${m.role}`} 
            style={{ 
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: m.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'slideUp 0.3s ease'
            }}
          >
            <div 
              role="article"
              aria-label={m.role === 'user' ? "Tin nhắn của bạn" : "Tin nhắn của AI"}
              style={{ 
                padding: '12px 18px',
                borderRadius: m.role === 'user' ? '22px 22px 4px 22px' : '22px 22px 22px 4px',
                background: m.role === 'user' ? 'var(--indigo, #6366f1)' : 'rgba(255,255,255,0.04)',
                backdropFilter: m.role === 'user' ? 'none' : 'blur(12px)',
                border: m.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                color: m.role === 'user' ? '#fff' : 'var(--text)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                boxShadow: m.role === 'user' ? '0 8px 20px rgba(99, 102, 241, 0.25)' : 'none',
                backgroundColor: m.isError ? 'rgba(239, 68, 68, 0.08)' : undefined,
                borderLeft: m.isError ? '4px solid #ef4444' : undefined
              }}
            >
              {m.isLoading ? (
                <div className="typing-dots" aria-label="AI đang soạn tin nhắn..." style={{ display: 'flex', gap: '5px', padding: '4px 0' }}>
                  <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                  <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
                  <span className="dot" style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
                </div>
              ) : (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {m.isError && <span aria-hidden="true" style={{ marginRight: '8px' }}>⚠️</span>}
                  {m.content}
                </div>
              )}
            </div>
            {!m.isLoading && !m.isError && renderIntentBadge(m.intent)}
          </div>
        ))}
        <div ref={scrollRef} style={{ float: 'left', clear: 'both' }} />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
