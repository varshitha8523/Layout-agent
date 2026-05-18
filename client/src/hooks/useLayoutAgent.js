import { useState, useCallback } from 'react';
import { sendLayoutInstruction } from '../utils/api';
import initialLayout from '../data/initialLayout.json';

export function useLayoutAgent() {
  const [layout, setLayout] = useState(initialLayout);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your layout agent. The Instagram Post design is loaded. Try asking me to convert it to 9:16, move elements, resize text, or change colors.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      setError(null);

      try {
        const result = await sendLayoutInstruction({
          message: trimmed,
          layout,
          history: messages,
        });
        setLayout(result.updatedLayout);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.explanation },
        ]);
      } catch (err) {
        const errMsg =
          err.response?.data?.error || err.message || 'Something went wrong.';
        setError(errMsg);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Sorry, I ran into an error: ${errMsg}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [layout, messages, loading]
  );

  const resetLayout = useCallback(() => {
    setLayout(initialLayout);
    setMessages([
      {
        role: 'assistant',
        content: 'Layout reset to original. What would you like to change?',
      },
    ]);
    setError(null);
  }, []);

  return { layout, messages, loading, error, sendMessage, resetLayout };
}
