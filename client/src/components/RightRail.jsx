import { useEffect, useState } from 'react';
import api from '../api/client.js';
import UserRow from './UserRow.jsx';

export default function RightRail() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users/suggestions').then(({ data }) => setUsers(data.users)).catch(() => {});
  }, []);

  async function follow(user) {
    try {
      await api.post(`/users/${user._id}/follow`);
      setUsers((all) => all.filter((item) => item._id !== user._id));
    } catch { /* Keep suggestion if request fails. */ }
  }

  return (
    <aside className="right-rail">
      <section className="rail-card surface">
        <div className="rail-title"><h3>People to follow</h3><span>Suggested</span></div>
        {users.length ? users.slice(0, 4).map((user) => (
          <UserRow key={user._id} user={user} trailing={<button className="mini-follow" onClick={() => follow(user)}>Follow</button>} />
        )) : <p className="rail-empty">You’re all caught up.</p>}
      </section>
      <p className="rail-footer">SocialSphere · CodeAlpha Internship Project</p>
    </aside>
  );
}
