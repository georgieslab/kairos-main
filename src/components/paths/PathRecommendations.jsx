// src/components/paths/PathRecommendations.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, RefreshCw } from 'lucide-react';
import PathRecommendationCard from './PathRecommendationCard';
import { getAiRecommendations } from '../../services/pathRecommender';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import '../../styles/components/pathRecommendation.css';

const PathRecommendations = ({ onPathSelect, maxRecommendations = 3 }) => {
  const { t } = useTranslation('paths');
  const { currentUser, userProfile } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (currentUser && userProfile) {
      loadRecommendations();
    }
  }, [currentUser, userProfile]);

  const loadRecommendations = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Get recent journal entries for better context
      const entriesRef = collection(db, 'users', currentUser.uid, 'journal_entries');
      const entriesQuery = query(entriesRef, orderBy('timestamp', 'desc'), limit(20));
      const entriesSnapshot = await getDocs(entriesQuery);
      const journalEntries = entriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      console.log(`📚 Found ${journalEntries.length} recent entries for context`);

      // Get AI-powered recommendations
      const recs = await getAiRecommendations(
        userProfile,
        journalEntries,
        {
          count: maxRecommendations,
          includeCompleted: false,
          forceRefresh
        }
      );

      setRecommendations(recs);
      setLoading(false);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError(err.message || t('pathRecommendations.loadError', 'Failed to load recommendations'));
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations(true);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="path-recommendations-loading">
        <Sparkles size={48} className="path-rec-loading-icon" />
        <p className="path-rec-loading-text">{t('pathRecommendations.loadingText', 'Finding your perfect next journey...')}</p>
        <p className="path-rec-loading-subtext">{t('pathRecommendations.loadingSubtext', 'Analyzing your interests and progress')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="path-recommendations-error">
        <p>{t('pathRecommendations.unableToGenerate', 'Unable to generate recommendations')}</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>{error}</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="path-recommendations-error">
        <p>{t('pathRecommendations.noneAvailable', 'No recommendations available')}</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
          {t('pathRecommendations.completeFirstJourney', 'Complete your first journey to get personalized suggestions')}
        </p>
      </div>
    );
  }

  return (
    <div className="path-recommendations-container">
      <div className="path-recommendations-header">
        <div>
          <h2 className="path-recommendations-title">
            <Sparkles size={28} />
            <span>{t('pathRecommendations.title', 'Recommended For You')}</span>
          </h2>
          <p className="path-recommendations-subtitle">
            {t('pathRecommendations.subtitle', 'AI-curated paths based on your journey')}
          </p>
        </div>

        <button
          className="path-rec-refresh-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          aria-label={t('pathRecommendations.refreshAriaLabel', 'Refresh recommendations')}
        >
          <RefreshCw size={16} className={refreshing ? 'path-rec-loading-icon' : ''} />
          <span>{t('pathRecommendations.refresh', 'Refresh')}</span>
        </button>
      </div>

      <div className="path-recommendations-list">
        {recommendations.map((rec, index) => (
          <PathRecommendationCard
            key={rec.pathId}
            recommendation={rec}
            index={index}
            onStart={onPathSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PathRecommendations;
