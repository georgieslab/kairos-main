// src/components/journal/MyJournalsList.jsx
// Component to display user's registered journals

import React, { useState, useEffect } from 'react';
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
    if (!confirm(`Are you sure you want to delete this journal?\n\nJournal ID: ${journalId}\n\nThis action cannot be undone.`)) {
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
      
      alert('Journal deleted successfully!');
    } catch (error) {
      console.error('Error deleting journal:', error);
      alert('Failed to delete journal. Please try again.');
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
            <h2 className="mjl-title">My Journals</h2>
          </div>
          <button 
            className="mjl-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mjl-content">
          {loading ? (
            <div className="mjl-loading">
              <Loader2 size={32} className="mjl-loading-spinner" />
              <p>Loading journals...</p>
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
                    <div className="mjl-journal-header">
                      <div 
                        className="mjl-journal-icon"
                        style={{ background: tierConfig?.color }}
                      >
                        <TierIcon size={20} />
                      </div>
                      <div className="mjl-journal-title">
                        <strong className="mjl-journal-number">
                          Journal #{index + 1}
                        </strong>
                        <span className="mjl-journal-tier">
                          {tierConfig?.name} Tier
                        </span>
                      </div>
                      <button
                        className="mjl-delete-btn"
                        onClick={() => handleDeleteJournal(journalId)}
                        disabled={deletingJournal === journalId}
                        title="Delete journal"
                        aria-label="Delete journal"
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
                        Serial: {details.metadata.serialNumber}
                      </div>
                    )}
                    
                    {journalId === primaryJournalId && (
                      <div className="mjl-primary-badge">
                        <CheckCircle2 size={14} />
                        <span>Primary</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mjl-empty-state">
              <BookOpen size={48} className="mjl-empty-icon" />
              <p className="mjl-empty-text">No journals registered yet</p>
              <p className="mjl-empty-hint">
                Register your first physical journal to get started
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
            Close
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
            Register Another Journal
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyJournalsList;
