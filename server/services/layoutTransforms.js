/**
 * Resize the artboard and recompute all child positions using normalized coords.
 * This is the reliable math-based fallback for aspect-ratio conversions.
 */
export function resizeArtboard(layout, newWidth, newHeight) {
  const updated = structuredClone(layout);
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];

  artboard.width = newWidth;
  artboard.height = newHeight;

  artboard.children.forEach((childId) => {
    const node = updated.nodes[childId];
    if (!node) return;
    node.x = node.nx * newWidth;
    node.y = node.ny * newHeight;
    node.width = node.nw * newWidth;
    node.height = node.nh * newHeight;
  });

  return updated;
}

/**
 * Move a node to a semantic position. Updates both absolute and normalized coords.
 */
export function moveNode(layout, nodeId, position) {
  const updated = structuredClone(layout);
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];
  const node = updated.nodes[nodeId];
  if (!node) return updated;

  const W = artboard.width;
  const H = artboard.height;

  switch (position) {
    case 'top':      node.ny = 0.02; break;
    case 'bottom':   node.ny = 0.92 - node.nh; break;
    case 'center-v': node.ny = 0.5 - node.nh / 2; break;
    case 'center-h': node.nx = 0.5 - node.nw / 2; break;
    case 'left':     node.nx = 0.02; break;
    case 'right':    node.nx = 0.98 - node.nw; break;
  }

  node.x = node.nx * W;
  node.y = node.ny * H;

  return updated;
}

/**
 * Scale a node's size by a factor. Updates absolute, normalized, and fontSize.
 */
export function scaleNode(layout, nodeId, factor) {
  const updated = structuredClone(layout);
  const rootId = updated.rootNodes[0];
  const artboard = updated.nodes[rootId];
  const node = updated.nodes[nodeId];
  if (!node) return updated;

  const W = artboard.width;
  const H = artboard.height;
  const oldNw = node.nw;
  const oldNh = node.nh;

  node.nw *= factor;
  node.nh *= factor;
  node.width = node.nw * W;
  node.height = node.nh * H;

  // Keep centered after scale
  node.nx += (oldNw - node.nw) / 2;
  node.ny += (oldNh - node.nh) / 2;
  node.x = node.nx * W;
  node.y = node.ny * H;

  if (node.style?.visual?.fontSize) {
    node.style.visual.fontSize *= factor;
    if (node.fontSizeRatio) node.fontSizeRatio *= factor;
  }

  return updated;
}

/**
 * Validate that the returned layout has the expected shape.
 */
export function validateLayout(layout) {
  if (!layout) throw new Error('Layout is null or undefined');
  if (!Array.isArray(layout.rootNodes)) throw new Error('rootNodes must be an array');
  if (typeof layout.nodes !== 'object') throw new Error('nodes must be an object');
  for (const id of layout.rootNodes) {
    if (!layout.nodes[id]) throw new Error(`Missing root node: ${id}`);
  }
  const root = layout.nodes[layout.rootNodes[0]];
  if (typeof root.width !== 'number' || typeof root.height !== 'number') {
    throw new Error('Artboard must have numeric width and height');
  }
  return true;
}
