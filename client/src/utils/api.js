import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function sendLayoutInstruction({ message, layout, history }) {
  const { data } = await axios.post(`${BASE_URL}/api/chat`, {
    message,
    layout,
    history: history.slice(-6),
  });
  return data;
}
