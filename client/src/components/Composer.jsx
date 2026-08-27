import { ImagePlus, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import api, { errorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';

export default function Composer({ onCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const input = useRef();

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  async function submit(e) {
    e.preventDefault();
    if (!text.trim() && !file) return;
    const form = new FormData();
    form.append('text', text.trim());
    if (file) form.append('image', file);
    setBusy(true); setError('');
    try {
      const { data } = await api.post('/posts', form);
      setText(''); setFile(null); setPreview('');
      onCreated?.(data.post);
    } catch (err) {
      setError(errorMessage(err, 'Could not publish your post.'));
    } finally { setBusy(false); }
  }

  function pick(e) {
    const next = e.target.files?.[0];
    e.target.value = '';
    if (!next) return;
    if (next.size > 5 * 1024 * 1024) { setError('Image must be 5 MB or smaller.'); return; }
    setError('');
    if (preview) URL.revokeObjectURL(preview);
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null); setPreview('');
  }

  return (
    <form className="composer surface" onSubmit={submit}>
      <Avatar user={user} />
      <div className="composer-body">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Share something with your circle..." maxLength={1500} />
        {preview && <div className="image-preview"><img src={preview} alt="Selected upload preview" /><button type="button" onClick={clearImage} aria-label="Remove selected image"><X size={18} /></button></div>}
        {error && <div className="inline-error">{error}</div>}
        <div className="composer-actions">
          <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={pick} />
          <button type="button" className="ghost-btn" onClick={() => input.current?.click()}><ImagePlus size={19} /> Photo</button>
          <div className="composer-submit"><span>{text.length}/1500</span><button className="primary-btn" disabled={busy || (!text.trim() && !file)}><Send size={17} /> {busy ? 'Posting...' : 'Post'}</button></div>
        </div>
      </div>
    </form>
  );
}
