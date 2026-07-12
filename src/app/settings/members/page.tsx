'use client';

import { useMemo, useState } from 'react';
import PageHead from '@/components/PageHead';
import { Monogram } from '@/components/ui';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';
import { MEMBERS, SECTION_META, type Member } from '@/lib/data';

export default function MembersPage() {
  const meta = SECTION_META.members;
  const [query, setQuery] = useState('');
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [invite, setInvite] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [query, members]);

  const initials = (n: string) =>
    n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <PageHead
        title={meta.title}
        blurb={meta.blurb}
        actions={
          <span className="pill">
            {members.length} {members.length === 1 ? 'person' : 'people'}
          </span>
        }
      />

      <div className="toolbar">
        <div className="input-wrap" style={{ maxWidth: 320 }}>
          <Icon.search size={16} />
          <input
            className="input"
            placeholder="Search members…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rows">
        {filtered.map((m) => (
          <div className="row" key={m.email}>
            <Monogram text={initials(m.name)} hue={m.hue} />
            <div className="row__main">
              <div className="row__title">
                {m.name}
                {m.you && <span className="pill">You</span>}
              </div>
              <div className="row__sub">
                {m.email} · Joined {m.joined}
              </div>
            </div>

            {m.role === 'Owner' ? (
              <span className="pill pill--owner">
                <Icon.key size={13} /> Owner
              </span>
            ) : (
              <>
                <div className="select">
                  <select
                    defaultValue={m.role}
                    onChange={(e) =>
                      toast(`${m.name} is now ${e.target.value}`)
                    }
                  >
                    <option>Admin</option>
                    <option>Member</option>
                  </select>
                  <Icon.chevronD size={15} />
                </div>
                <button
                  className="btn btn--sm"
                  onClick={() => {
                    setMembers((prev) => prev.filter((x) => x.email !== m.email));
                    toast(`${m.name} removed`);
                  }}
                >
                  Remove
                </button>
              </>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="row" style={{ color: 'var(--text-muted)', padding: 22 }}>
            No members match “{query}”.
          </div>
        )}
      </div>

      {/* Invite */}
      <section className="card" style={{ marginTop: 18 }}>
        <div className="card__head">
          <div className="card__head-icon">
            <Icon.plus size={18} />
          </div>
          <div>
            <div className="card__title">Add member</div>
            <div className="card__desc">
              Invite someone who already has a Dan account by their email address.
            </div>
          </div>
        </div>
        <div className="card__body">
          <div className="field">
            <div className="input-wrap">
              <Icon.members size={16} />
              <input
                className="input"
                placeholder="colleague@company.com"
                value={invite}
                onChange={(e) => setInvite(e.target.value)}
              />
            </div>
            <div className="select">
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                <option>Member</option>
                <option>Admin</option>
              </select>
              <Icon.chevronD size={15} />
            </div>
            <button
              className="btn btn--primary"
              disabled={!invite.includes('@')}
              onClick={() => {
                toast(`Invite sent to ${invite}`);
                setInvite('');
              }}
            >
              Send invite
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
