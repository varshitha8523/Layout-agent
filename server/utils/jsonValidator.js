export function validateLayout(layout) {
  if (!layout || typeof layout !== 'object') throw new Error('Layout is not an object');
  if (!Array.isArray(layout.rootNodes) || layout.rootNodes.length === 0)
    throw new Error('rootNodes must be a non-empty array');
  if (!layout.nodes || typeof layout.nodes !== 'object')
    throw new Error('nodes must be an object');

  for (const id of layout.rootNodes) {
    if (!layout.nodes[id]) throw new Error(`Root node "${id}" missing from nodes`);
    const root = layout.nodes[id];
    if (typeof root.width !== 'number' || typeof root.height !== 'number')
      throw new Error('Artboard must have numeric width and height');
    if (!Array.isArray(root.children))
      throw new Error('Artboard must have a children array');
  }

  return true;
}
