// src/components/journal/MyJournalsList.jsx
// Component to display user's registered journals

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, X, Radio, CheckCircle2, Trash2, Crown, Star, Gem, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { deleteJournal, getJournalDetails } from '../../services/journalService';
import './MyJournalsList.css';

const TIER_INFO = {
  essential: {
    name: 'Essential',
    icon: BookOpen,
    color: '#10b981'
  },
  insight: {
    name: 'Insight',
    icon: Star,
    color: '#3b82f6'
  },
  legacy: {
    name: 'Legacy',
    icon: Crown,
    color: '#8b5cf6'
  }
};

function MyJournalsList({ isOpen, onClose, onRegisterAnother }) {
  const { t } = useTranslation('journal');
  const { userProfile, currentUser, updateUserProfile } = useAuth();
  const { isDarkMode } = useTheme();
  const [deletingJournal, setDeletingJournal] = useState(null);
  const [journalDetails, setJournalDetails] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch journal details when modal opens
  useEffect(() => {
    if (isOpen && userProfile?.journals?.length > 0) {
      fetchJournalDetails();
    }
  }, [isOpen, userProfile?.journals]);

  const fetchJournalDetails = async () => {
    setLoading(true);
    const details = {};
    
    for (const journalId of userProfile.journals) {
      try {
        const data = await getJournalDetails(journalId);
        details[journalId] = data;
      } catch (error) {
        console.error(`Error fetching journal ${journalId}:`, error);
        details[journalId] = null;
      }
    }
    
    setJournalDetails(details);
    setLoading(false);
  };

  if (!isOpen) return null;

  const journals = userProfile?.journals || [];
  const primaryJournalId = userProfile?.primaryJournalId;

  const handleDeleteJournal = async (journalId) => {
    if (!confirm(t('myJournals.confirmDelete', 'Are you sure you want to delete this journal?\n\nJournal ID: {{journalId}}\n\nThis action cannot be undone.', { journalId }))) {
      return;
    }

    try {
      setDeletingJournal(journalId);

      // Delete from Firestore
      await deleteJournal(journalId, currentUser.uid);

      // Update local user profile
      const updatedJournals = journals.filter(j => j !== journalId);
      const updates = { journals: updatedJournals };

      // If deleting primary journal, clear it
      if (journalId === primaryJournalId) {
        updates.primaryJournalId = null;
      }

      await updateUserProfile(updates);

      alert(t('myJournals.deleteSuccess', 'Journal deleted successfully!'));
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert(t('myJournals.deleteFailed', 'Failed to delete journal. Please try again.'));
    } finally {
      setDeletingJournal(null);
    }
  };

  return (
    <div className="mjl-overlay" onClick={onClose} data-theme={isDarkMode ? 'dark' : 'light'}>
      <div className="mjl-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mjl-header">
          <div className="mjl-title-wrapper">
            <BookOpen className="mjl-title-icon" size={24} />
            <h2 className="mjl-title">{t('myJournals.title', 'My Journals')}</h2>
          </div>
          <button
            className="mjl-close-btn"
            onClick={onClose}
            aria-label={t('myJournals.closeAriaLabel', 'Close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mjl-content">
          {loading ? (
            <div className="mjl-loading">
              <Loader2 size={32} className="mjl-loading-spinner" />
              <p>{t('myJournals.loading', 'Loading journals...')}</p>
            </div>
          ) : journals.length > 0 ? (
            <div className="mjl-journals-list">
              {journals.map((journalId, index) => {
                const details = journalDetails[journalId];
                const tier = details?.tier || 'essential';
                const tierConfig = TIER_INFO[tier];
                const TierIcon = tierConfig?.icon || BookOpen;
                
                return (
                  <div
                    key={journalId}
                    className="mjl-journal-card"
                  >
                    <svg
                      className="mjl-journal-art"
                      viewBox="0 0 100 100"
                      fill="none"
                      style={{ color: tierConfig?.color }}
                      aria-hidden="true"
                    >
                      <rect x="20" y="8" width="60" height="84" rx="6" stroke="currentColor" strokeWidth="3" />
                      <line x1="32" y1="8" x2="32" y2="92" stroke="currentColor" strokeWidth="3" />
                      <line x1="44" y1="30" x2="68" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <line x1="44" y1="42" x2="68" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <line x1="44" y1="54" x2="60" y2="54" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                      <path d="M60 8 L72 8 L72 24 L66 18 L60 24 Z" fill="currentColor" />
                    </svg>
                    <div className="mjl-journal-header">
                      <div 
                        className="mjl-journal-icon"
                        style={{ background: tierConfig?.color }}
                      >
                        <TierIcon size={20} />
                      </div>
                      <div className="mjl-journal-title">
                        <strong className="mjl-journal-number">
                          {t('myJournals.journalNumber', 'Journal #{{number}}', { number: index + 1 })}
                        </strong>
                        <span className="mjl-journal-tier">
                          {t('myJournals.tierLabel', '{{tier}} Tier', { tier: t(`registration.tiers.${tier}.name`, tierConfig?.name) })}
                        </span>
                      </div>
                      <button
                        className="mjl-delete-btn"
                        onClick={() => handleDeleteJournal(journalId)}
                        disabled={deletingJournal === journalId}
                        title={t('myJournals.deleteJournal', 'Delete journal')}
                        aria-label={t('myJournals.deleteJournal', 'Delete journal')}
                      >
                        {deletingJournal === journalId ? (
                          <Loader2 size={16} className="mjl-deleting-spinner" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                    
                    <div className="mjl-journal-id">
                      {journalId}
                    </div>

                    {details?.metadata?.serialNumber && (
                      <div className="mjl-journal-serial">
                        {t('myJournals.serial', 'Serial: {{serialNumber}}', { serialNumber: details.metadata.serialNumber })}
                      </div>
                    )}

                    {journalId === primaryJournalId && (
                      <div className="mjl-primary-badge">
                        <CheckCircle2 size={14} />
                        <span>{t('myJournals.primary', 'Primary')}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mjl-empty-state">
              <BookOpen size={48} className="mjl-empty-icon" />
              <p className="mjl-empty-text">{t('myJournals.emptyState.title', 'No journals registered yet')}</p>
              <p className="mjl-empty-hint">
                {t('myJournals.emptyState.hint', 'Register your first physical journal to get started')}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mjl-footer">
          <button
            className="mjl-btn mjl-btn-secondary"
            onClick={onClose}
          >
            {t('myJournals.close', 'Close')}
          </button>
          <button
            className="mjl-btn mjl-btn-primary"
            onClick={() => {
              onClose();
              if (onRegisterAnother) {
                onRegisterAnother();
              }
            }}
          >
            <Radio size={18} />
            {t('myJournals.registerAnother', 'Register Another Journal')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyJournalsList;
