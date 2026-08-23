// src/components/common/VersionNews.jsx
//
// "What version am I on, and what changed?" — the release history, opened
// from the same row as What's New and wearing the same sheet.
//
// The two are deliberately different things and both are worth having.
// What's New is editorial: three or four announcements, chosen, written for
// someone deciding whether to care. This is the record: every release, in
// order, including the ones whose whole content was "nothing changes for you".
// Collapsing them into one surface would mean either burying the announcement
// in a changelog or throwing the changelog away.
//
// It renders through a portal for the same reason What's New does: the hero
// header is transform-animated, which makes it a containing block for fixed
// positioning and would trap the overlay inside it.

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Info, X, Sparkles, Wrench, Bug, ChevronDown } from 'lucide-react';
import { APP_VERSION, VERSION_HISTORY } from '../../utils/versionControl';
import '../../styles/components/versionNews.css';

// Newest first — the file is authored oldest-first because it is appended to.
const RELEASES = [...VERSION_HISTORY].reverse();

const SECTIONS = [
  { key: 'features',     icon: Sparkles, labelKey: 'version.new',    label: 'New' },
  { key: 'improvements', icon: Wrench,   labelKey: 'version.better', label: 'Better' },
  { key: 'bugFixes',     icon: Bug,      labelKey: 'version.fixed',  label: 'Fixed' },
];

const VersionNews = () => {
  const { t } = useTranslation('journey');
  const [isOpen, setIsOpen] = useState(false);
  // Only the newest release is open on arrival. Everything before it is
  // history, and history that unfolds itself is a wall.
  const [expanded, setExpanded] = useState(() => new Set([RELEASES[0]?.version]));

  const toggle = useCallback((v) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const modal = (
    <div className="whats-new-overlay" onClick={() => setIsOpen(false)}>
      <div
        className="whats-new-sheet vn-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('version.title', 'Version & news')}
      >
        <button
          className="whats-new-close"
          onClick={() => setIsOpen(false)}
          aria-label={t('whatsNew.close', 'Close')}
        >
          <X size={18} />
        </button>

        <div className="vn-head">
          <span className="vn-current">{APP_VERSION}</span>
          <span className="vn-current-label">
            {t('version.youAreOn', 'the version you are running')}
          </span>
        </div>

        <div className="vn-list">
          {RELEASES.map((r) => {
            const open = expanded.has(r.version);
            const hasBody = SECTIONS.some((s) => r[s.key]?.length) || r.notes?.length;
            return (
              <section key={r.version} className={`vn-release${open ? ' is-open' : ''}`}>
                <button
                  className="vn-release-head"
                  onClick={() => hasBody && toggle(r.version)}
                  aria-expanded={open}
                  disabled={!hasBody}
                >
                  <span className="vn-version">{r.version}</span>
                  {r.codename && <span className="vn-codename">{r.codename}</span>}
                  <span className="vn-date">{r.releaseDate}</span>
                  {hasBody && <ChevronDown size={15} className="vn-chevron" />}
                </button>

                {open && (
                  <div className="vn-body">
                    {SECTIONS.map(({ key, icon: Icon, labelKey, label }) =>
                      r[key]?.length ? (
                        <div key={key} className={`vn-group vn-${key}`}>
                          <span className="vn-group-label">
                            <Icon size={12} strokeWidth={2} />
                            {t(labelKey, label)}
                          </span>
                          <ul>
                            {r[key].map((line, i) => <li key={i}>{line}</li>)}
                          </ul>
                        </div>
                      ) : null
                    )}
                    {r.notes?.length ? (
                      <div className="vn-group vn-notes">
                        <ul>
                          {r.notes.map((line, i) => <li key={i}>{line}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        className="whats-new-pill vn-pill"
        onClick={() => setIsOpen(true)}
        aria-label={t('version.title', 'Version & news')}
      >
        <Info size={14} />
      </button>
      {isOpen && createPortal(modal, document.body)}
    </>
  );
};

export default VersionNews;
