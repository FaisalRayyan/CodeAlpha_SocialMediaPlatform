import { ImagePlus, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function Composer({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const input = useRef();

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() && !file) return;
    const form = new FormData();
    form.append('text', text);
    if (file) form.append('image', file);
    setBusy(true);
    try {
      const { data } = await api.post('/posts', form);
      setText(''); setFile(null); setPreview('');
      onCreated?.(data.post);
    } finally { setBusy(false); }
  }

  function pick(e) {
    const next = e.target.files?.[0];
    if (!next) return;
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  return (
    <form className="composer surface" onSubmit={submit}>
      <Avatar user={user} />
      <div className="composer-body">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share something with your circle..." maxLength={1500} />
        {preview && <div className="image-preview"><img src={preview} alt="preview" /><button type="button" onClick={() => { setFile(null); setPreview(''); }}><X size={18} /></button></div>}
        <div className="composer-actions">
          <input ref={input} type="file" accept="image/*" hidden onChange={pick} />
          <button type="button" className="ghost-btn" onClick={() => input.current?.click()}><ImagePlus size={19} /> Photo</button>
          <button className="primary-btn" disabled={busy || (!text.trim() && !file)}><Send size={17} /> {busy ? 'Posting...' : 'Post'}</button>
        </div>
      </div>
    </form>
  );
}
