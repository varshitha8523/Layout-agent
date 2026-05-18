import { useEffect, useRef } from 'react';

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {messages.map((m, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
          <div
            style={{
              maxWidth: '80%',
              padding: '10px 14px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? '#3b82f6' : '#f1f5f9',
              color: m.role === 'user' ? '#fff' : '#1e293b',
              fontSize: '13.5px',
              lineHeight: 1.55,
            }}
          >
            {m.content}
          </div>
        </div>
      ))}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: '#f1f5f9', color: '#64748b', fontSize: '13.5px' }}>
            <span className="typing-dots">Thinking…</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
