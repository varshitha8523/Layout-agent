function getNodeStyle(node) {
  const base = {
    position: 'absolute',
    left: `${node.nx * 100}%`,
    top: `${node.ny * 100}%`,
    width: `${node.nw * 100}%`,
    height: `${node.nh * 100}%`,
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: '10px',
    lineHeight: 1.2,
  };

  if (node.type === 'image') {
    return { ...base, background: 'rgba(55,138,221,0.2)', border: '1px solid rgba(55,138,221,0.55)' };
  }
  if (node.type === 'text') {
    return { ...base, background: 'rgba(186,117,23,0.2)', border: '1px solid rgba(186,117,23,0.55)' };
  }
  if (node.type === 'shape') {
    const isCircle = node.data?.shapeType === 'circle';
    return {
      ...base,
      background: 'rgba(244,207,27,0.45)',
      border: '2px solid rgba(244,207,27,0.85)',
      borderRadius: isCircle ? '50%' : '4px',
    };
  }
  return { ...base, background: 'rgba(150,150,150,0.2)', border: '1px solid rgba(150,150,150,0.4)' };
}

export default function WireframePreview({ layout }) {
  const rootId = layout.rootNodes[0];
  const artboard = layout.nodes[rootId];
  const ar = artboard.height / artboard.width;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: `${ar * 100}%`,
          background: '#111827',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        {artboard.children.map((id) => {
          const node = layout.nodes[id];
          if (!node) return null;
          const label = node.data?.content
            ? node.data.content.replace(/\n/g, ' ').substring(0, 22)
            : node.name?.substring(0, 18);

          return (
            <div key={id} title={`${node.name} (${node.type})`} style={getNodeStyle(node)}>
              <span
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '9px',
                  padding: '1px 3px',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  fontFamily: 'monospace',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', textAlign: 'center' }}>
        {artboard.width} × {artboard.height}px · {artboard.children.length} layers
      </p>
    </div>
  );
}
