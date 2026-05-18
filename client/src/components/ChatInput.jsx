import { useState, useRef } from 'react';

const SUGGESTIONS = [
  'Convert this design to 9:16',
  'Move the headline to the top',
  'Make the headline smaller',
  'Move the offer badge higher',
  'Keep the product large',
  'Change the headline color to orange',
  'Make the discount badge bigger',
  'Center the product',
];

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || loading) return;
    onSend(value);
    setValue('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ borderTop: '1px solid #e5e7eb', padding: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSend(s)}
            disabled={loading}
            style={{
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              background: loading ? '#f9fafb' : '#fff',
              color: '#374151',
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me to change the layout…"
          disabled={loading}
          style={{
            flex: 1,
            padding: '9px 12px',
            fontSize: '13.5px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            outline: 'none',
            background: loading ? '#f9fafb' : '#fff',
            color: '#1e293b',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !value.trim()}
          style={{
            padding: '9px 16px',
            fontSize: '13.5px',
            borderRadius: '8px',
            border: 'none',
            background: loading || !value.trim() ? '#93c5fd' : '#3b82f6',
            color: '#fff',
            cursor: loading || !value.trim() ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
