import { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import WireframePreview from './components/WireframePreview';
import JsonViewer from './components/JsonViewer';
import { useLayoutAgent } from './hooks/useLayoutAgent';

export default function App() {
  const { layout, messages, loading, sendMessage, resetLayout } = useLayoutAgent();
  const [rightTab, setRightTab] = useState('preview');

  const artboard = layout.nodes[layout.rootNodes[0]];

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#f8fafc' }}>
      {/* Left: Chat panel */}
      <div style={{ width: '42%', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #e5e7eb' }}>
        {/* Header */}
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#111827' }}>Layout Agent</h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
              {artboard.name} · {artboard.width}×{artboard.height}px
            </p>
          </div>
          <button
            onClick={resetLayout}
            style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '6px', border: '1px solid #d1d5db', background: '#fff', color: '#374151', cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>

        <ChatWindow messages={messages} loading={loading} />
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>

      {/* Right: Preview + JSON */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
          {['preview', 'json'].map((tab) => (
            <button
              key={tab}
              onClick={() => setRightTab(tab)}
              style={{
                padding: '12px 20px',
                fontSize: '13px',
                fontWeight: rightTab === tab ? 600 : 400,
                borderBottom: rightTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                border: 'none',
                background: 'transparent',
                color: rightTab === tab ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab === 'json' ? 'JSON Output' : 'Wireframe Preview'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {rightTab === 'preview' ? (
            <WireframePreview layout={layout} />
          ) : (
            <JsonViewer layout={layout} />
          )}
        </div>
      </div>
    </div>
  );
}
