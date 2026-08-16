// src/components/subscription/PathUnlockModal.jsx
// Purchase sheet for exclusive one-time-purchase paths (e.g. Kairos Moments).
// Payment is a Stripe Checkout session; the webhook grants the path by adding
// it to users/{uid}.purchasedPaths, so after paying the user just returns here.

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Hourglass, Mic, Palette, Sparkles, Lock, Loader2, Ticket, CheckCircle2, Package } from 'lucide-react';
import { startPathPurchase } from '../../services/SubscriptionService';
import { resolveInviteCode } from '../../constants/inviteCodes';
import { getPurchaseAnchorId, isKairosMomentsPackage } from '../../constants/pathBundles';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/components/pathUnlockModal.css';

const PathUnlockModal = ({ path, userId, onClose }) => {
  const { t } = useTranslation('paths');
  const { userProfile, updateUserProfile, refreshUserProfile } = useAuth();
  const [isBuying, setIsBuying] = useState(false);
  const [error, setError] = useState(null);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeValue, setCodeValue] = useState('');
  const [codeError, setCodeError] = useState(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  if (!path) return null;

  const handleBuy = async () => {
    if (!userId || isBuying) return;
    setError(null);
    setIsBuying(true);
    try {
      // Bundle members buy the single Kairos Moments package product — see
      // constants/pathBundles.js. One payment unlocks every path in the bundle.
      const result = await startPathPurchase(userId, getPurchaseAnchorId(path.id));
      // Checkout happens elsewhere — a popup on web, an in-app browser on
      // native. Keep the modal open so the user lands back on a stable screen.
      // The webhook grants access server-side, but this app's in-memory
      // userProfile has no way to learn that on its own, so wait until the user
      // is done with checkout and re-read it. Without this the purchase only
      // appears after a full restart.
      if (result?.finished) {
        result.finished.then(() => refreshUserProfile()).catch(() => {});
      }
    } catch (err) {
      setError(t('unlockModal.error', 'Could not start the payment. Please try again.'));
    } finally {
      setIsBuying(false);
    }
  };

  const handleRedeem = async () => {
    if (isRedeeming || redeemed) return;
    setCodeError(null);

    const unlockedPathIds = resolveInviteCode(codeValue);
    if (!unlockedPathIds || !unlockedPathIds.includes(path.id)) {
      setCodeError(t('unlockModal.codeInvalid', "That code isn't valid for this path."));
      return;
    }

    setIsRedeeming(true);
    try {
      const existing = userProfile?.purchasedPaths || [];
      const merged = [...new Set([...existing, ...unlockedPathIds])];
      await updateUserProfile({ purchasedPaths: merged });
      setRedeemed(true);
      // Give the success state a beat, then close — the card is now unlocked.
      setTimeout(onClose, 1400);
    } catch (err) {
      console.error('Error redeeming invite code:', err);
      setCodeError(t('unlockModal.codeFailed', 'Could not redeem the code. Please try again.'));
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="pum-overlay" onClick={onClose}>
      <div
        className="pum-sheet"
        style={{ '--c': path.color }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={path.title}
      >
        <button className="pum-close" onClick={onClose} aria-label={t('unlockModal.close', 'Close')}>
          <X size={18} />
        </button>

        <div className="pum-icon-halo">
          <Hourglass size={30} />
        </div>

        <span className="pum-new-chip">{t('pathSelection.new', 'NEW')}</span>
        <h2 className="pum-title">{path.title}</h2>
        <p className="pum-subtitle">{path.subtitle}</p>

        <ul className="pum-perks">
          <li>
            <Sparkles size={16} />
            <span>{t('unlockModal.perkDays', '{{count}} carefully crafted days', { count: path.duration })}</span>
          </li>
          <li>
            <Mic size={16} />
            <span>{t('unlockModal.perkChoice', 'You choose each day: write it, speak it, or draw it')}</span>
          </li>
          <li>
            <Palette size={16} />
            <span>{t('unlockModal.perkExclusive', 'Exclusive path — yours forever, one payment')}</span>
          </li>
          {isKairosMomentsPackage(path.id) && (
            <li>
              <Package size={16} />
              <span>{t('unlockModal.perkBundle', 'One payment unlocks the whole Kairos Moments package — both paths')}</span>
            </li>
          )}
        </ul>

        {error && <p className="pum-error">{error}</p>}

        {redeemed ? (
          <div className="pum-redeemed">
            <CheckCircle2 size={20} />
            <span>{t('unlockModal.codeSuccess', 'Path unlocked — enjoy the journey!')}</span>
          </div>
        ) : (
          <>
            <button className="pum-buy" onClick={handleBuy} disabled={isBuying}>
              {isBuying ? <Loader2 size={18} className="pum-spin" /> : <Lock size={18} />}
              <span>
                {isBuying
                  ? t('unlockModal.opening', 'Opening secure checkout...')
                  : t('unlockModal.buy', 'Unlock for {{price}}', { price: path.price })}
              </span>
            </button>

            {showCodeInput ? (
              <div className="pum-code-row">
                <input
                  className="pum-code-input"
                  type="text"
                  value={codeValue}
                  onChange={(e) => { setCodeValue(e.target.value); setCodeError(null); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRedeem(); }}
                  placeholder={t('unlockModal.codePlaceholder', 'Enter invite code')}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck="false"
                  autoFocus
                />
                <button
                  className="pum-code-redeem"
                  onClick={handleRedeem}
                  disabled={isRedeeming || !codeValue.trim()}
                >
                  {isRedeeming
                    ? <Loader2 size={16} className="pum-spin" />
                    : t('unlockModal.redeem', 'Redeem')}
                </button>
              </div>
            ) : (
              <button className="pum-code-toggle" onClick={() => setShowCodeInput(true)}>
                <Ticket size={14} />
                {t('unlockModal.haveCode', 'Have an invite code?')}
              </button>
            )}

            {codeError && <p className="pum-error">{codeError}</p>}

            <p className="pum-note">
              {t('unlockModal.note', 'Secure payment via Stripe. Access unlocks automatically after payment — just return to this screen.')}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PathUnlockModal;
