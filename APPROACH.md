# Approach Note

## How I structured the LLM prompt

The system prompt is the most critical piece. It has five sections:

1. **Canvas rules** — explains the dual coordinate system (absolute x/y/width/height + normalized nx/ny/nw/nh) and the recomputation formula for when the artboard resizes. The LLM needs to understand that moving/resizing means updating both representations.

2. **Semantic role mapping** — maps node `name` and `data.content` to human concepts (headline, product image, offer badge, etc.). Without this, the LLM has no way to interpret "move the headline" from raw IDs.

3. **Transformation recipes** — explicit formulas for common operations ("move to top → set ny=0.02, y=ny*H"). This is better than letting the LLM free-form invent math, which is error-prone.

4. **Linked element hints** — tells the model that the yellow Circle and "20% OFF" text are a unit and must move together.

5. **Strict output format** — JSON only, no markdown fences, with a known `{explanation, updatedLayout}` shape. The parser strips any accidental fences and falls back to regex extraction if needed.

The current artboard dimensions are injected dynamically so the prompt is always accurate.

## How I handle JSON transformations safely

- The backend validates every LLM response with `jsonValidator.js` before sending it to the client.
- The frontend never trusts the layout until the server confirms its shape.
- `layoutTransforms.js` provides deterministic helpers (`resizeArtboard`, `moveNode`, `scaleNode`) that the LLM can be instructed to use by returning action objects — or that can be called directly for predictable operations like "convert to 9:16".
- All helpers use `structuredClone` to avoid mutating the input layout.

## How I maintain conversation context

- The frontend passes `history.slice(-6)` (last 6 messages) on every API call, giving the LLM enough context to resolve pronoun references like "it", "that element", "make it bigger".
- The current layout JSON is always re-injected into the system prompt on each call, so the model always reasons over the *current* state, not a stale one.

## Trade-offs and what I'd improve with more time

**Trade-offs made:**
- Letting the LLM handle all transformations (vs a hybrid code+LLM approach) is simpler but occasionally imprecise on font sizes or exact pixel math. The helper functions exist as a fallback but aren't wired as tool-calls yet.
- Passing the full layout JSON in every request is verbose (the layout is ~6KB) but necessary since the model has no memory between calls.

**With more time I'd add:**
- **Tool use / function calling**: expose `resizeArtboard`, `moveNode`, `scaleNode` as Claude tools so the model calls structured functions instead of returning modified JSON directly — much more reliable.
- **Undo/redo**: store layout history in a stack for `Cmd+Z`.
- **Diff highlighting**: highlight changed nodes in the wireframe after each instruction.
- **PNG export**: render the wireframe to a canvas and allow download.
- **Real image rendering**: swap the colored placeholder rects for actual `<img>` tags using the `sourceUrl` fields.
