import { useState } from 'react';

export default function JsonViewer({ layout }) {
  const [collapsed, setCollapsed] = useState(true);
  const json = JSON.stringify(layout, null, 2);
  const display = collapsed ? json.substring(0, 600) + '\n...' : json;

  const handleCopy = () => {
    navigator.clipboard.writeText(json).catch(() => {});
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>Layout JSON</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={handleCopy} style={{ fontSize: '11px', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#374151' }}>
            Copy
          </button>
          <button onClick={() => setCollapsed((c) => !c)} style={{ fontSize: '11px', padding: '2px 8px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f9fafb', color: '#374151' }}>
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '10px',
          background: '#0f172a',
          color: '#94a3b8',
          borderRadius: '8px',
          fontSize: '11px',
          lineHeight: 1.6,
          overflow: 'auto',
          maxHeight: collapsed ? '200px' : '500px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
          fontFamily: 'monospace',
        }}
      >
        {display}
      </pre>
    </div>
  );
}
