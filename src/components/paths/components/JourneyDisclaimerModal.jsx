// src/components/paths/components/JourneyDisclaimerModal.jsx
//
// Shown before starting a path whose subject sits close to something a
// journal alone should not be handling. Gated in JourneyPreviewModal, which
// maps path ids to a variant — deliberately a short list, because a warning
// on every path is a warning on none.
//
// Three variants today:
//   substance     — Transformation Journey: habits, substances, behaviour
//   displacement  — the Starting Over pack: leaving, arriving, what was lost
//   moralInjury   — Moral Pain: what you did, or failed to prevent
//
// The resources differ per variant and that is the whole point. Pointing
// someone rebuilding a life in a new country at a substance-recovery helpline
// would be worse than showing nothing, and pointing someone in moral pain at
// either would miss entirely.

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertTriangle, Check, ExternalLink } from 'lucide-react';

const VARIANTS = {
  substance: {
    aboutKey: 'disclaimerModal.aboutText',
    aboutFallback:
      'The "Transformation Journey: Breaking Patterns" is designed to support you in addressing and transforming challenging patterns in your life. This may include habits related to substances, behaviors, or thought patterns that you wish to change.',
    disclaimerKey: 'disclaimerModal.disclaimerText',
    disclaimerFallback:
      "While journaling can be a powerful tool for personal growth and recovery, this journey is not a substitute for professional treatment, therapy, or medical advice. If you're struggling with addiction or other serious mental health issues, please consult with a healthcare professional.",
    privacy1Key: 'disclaimerModal.privacyText1',
    privacy1Fallback:
      'The prompts in this journey will refer to "[substance/behavior]" - mentally replace this with the specific pattern you\'re working to transform. Your responses are private and processed according to your privacy settings.',
    resources: [
      { key: 'disclaimerModal.resourceSamhsa', label: 'SAMHSA National Helpline: 1-800-662-4357', href: 'https://www.samhsa.gov/find-help/national-helpline' },
      { key: 'disclaimerModal.resourceAA', label: 'Alcoholics Anonymous', href: 'https://www.aa.org/' },
      { key: 'disclaimerModal.resourceSmartRecovery', label: 'SMART Recovery', href: 'https://www.smartrecovery.org/' },
      { key: 'disclaimerModal.resourceFindTherapist', label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
    ],
  },

  chronicPain: {
    aboutKey: 'disclaimerModal.cpAboutText',
    aboutFallback:
      '"The Body That Hurts" is for living in a body that hurts most days, and for the second injury of not being believed about it. It asks about ordinary days, language, appointments, the body you had before, and what genuinely helps.',
    disclaimerKey: 'disclaimerModal.cpDisclaimerText',
    disclaimerFallback:
      'This path does not suggest your pain is caused by stress, attitude or unprocessed feelings, and it will not ask you to reframe it. Writing is not treatment and will not reduce your pain. It also does not replace medical care: if your symptoms change or worsen, that belongs with a clinician, not a journal. Living with constant pain carries a raised risk of depression and of thoughts of suicide — if that is where you are, please use one of the services below or contact your doctor today.',
    privacy1Key: 'disclaimerModal.cpPrivacyText1',
    privacy1Fallback:
      'Write as little as you like — energy is the scarce resource here and every day is designed to be answerable in a few lines. Any day can be left blank. Your entries are private and processed according to your privacy settings, and you can export them if you want to bring a record to an appointment.',
    resources: [
      { key: 'disclaimerModal.resourceBefrienders', label: 'Befrienders Worldwide — crisis lines by country', href: 'https://www.befrienders.org/' },
      { key: 'disclaimerModal.resourceIasp', label: 'IASP — crisis centres worldwide', href: 'https://www.iasp.info/resources/Crisis_Centres/' },
      { key: 'disclaimerModal.resourceFindTherapist', label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
    ],
  },

  existential: {
    aboutKey: 'disclaimerModal.exAboutText',
    aboutFallback:
      '"Existential Pain" stays with four questions that have no answers: that you will die, that no one is coming to tell you what your life is for, that no one can fully reach you inside it, and whether any of it means anything. It does not offer consolation, because consolation is what stops working once you have genuinely looked.',
    disclaimerKey: 'disclaimerModal.exDisclaimerText',
    disclaimerFallback:
      'Sitting with these questions deliberately can be steadying, and it can also make a low period lower. If you are already in a dark stretch, this may not be the right fortnight for it. If you are having thoughts of ending your life, please contact one of the services below or your own doctor today — not after the next entry. Writing is not treatment, no day here has to be completed, and stopping is a reasonable thing to do.',
    privacy1Key: 'disclaimerModal.exPrivacyText1',
    privacy1Fallback:
      'You decide how much to write, and any day can be left blank. Your entries are private and processed according to your privacy settings.',
    resources: [
      { key: 'disclaimerModal.resourceBefrienders', label: 'Befrienders Worldwide — crisis lines by country', href: 'https://www.befrienders.org/' },
      { key: 'disclaimerModal.resourceIasp', label: 'IASP — crisis centres worldwide', href: 'https://www.iasp.info/resources/Crisis_Centres/' },
      { key: 'disclaimerModal.resourceFindTherapist', label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
    ],
  },

  moralInjury: {
    aboutKey: 'disclaimerModal.miAboutText',
    aboutFallback:
      '"Moral Pain" is for something you did, watched, or failed to prevent, and have not been able to put down since. It asks directly about the act, who was harmed by it, and what you believe you owe. It does not set out to reassure you, and it does not set out to condemn you.',
    disclaimerKey: 'disclaimerModal.miDisclaimerText',
    disclaimerFallback:
      'This kind of pain is closely linked to depression, post-traumatic stress and thoughts of suicide, and looking straight at it can make things feel worse before they feel better. Writing is not treatment. If you are having thoughts of harming yourself, please contact one of the services below or your own doctor — today, not after the next entry. There is no wrong time to stop, and nothing here has to be finished.',
    privacy1Key: 'disclaimerModal.miPrivacyText1',
    privacy1Fallback:
      'You decide how much to write, and any day can be left blank. Your entries are private and processed according to your privacy settings. If what you are writing about may have legal consequences, consider speaking to a lawyer before recording a detailed account anywhere, including here.',
    resources: [
      { key: 'disclaimerModal.resourceBefrienders', label: 'Befrienders Worldwide — crisis lines by country', href: 'https://www.befrienders.org/' },
      { key: 'disclaimerModal.resourceIasp', label: 'IASP — crisis centres worldwide', href: 'https://www.iasp.info/resources/Crisis_Centres/' },
      { key: 'disclaimerModal.resourceMoralInjury', label: 'Moral injury — what it is and who it affects', href: 'https://www.ptsd.va.gov/professional/treat/cooccurring/moral_injury.asp' },
      { key: 'disclaimerModal.resourceFindTherapist', label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
    ],
  },

  displacement: {
    aboutKey: 'disclaimerModal.dpAboutText',
    aboutFallback:
      'The "Starting Over" paths are for people who left one country and began again in another. They ask directly about what ended, what was left behind, and what the move cost — including the parts most people skip when they tell the story.',
    disclaimerKey: 'disclaimerModal.dpDisclaimerText',
    disclaimerFallback:
      'Leaving is not always a choice, and it is not always safe. If your move involved violence, loss, separation from family, or an ongoing asylum process, some of these questions may reach further than you expected. Writing is not treatment. Nothing here is a substitute for a therapist, a doctor, or a lawyer, and there is no wrong time to stop and come back later.',
    privacy1Key: 'disclaimerModal.dpPrivacyText1',
    privacy1Fallback:
      'You choose how much to write and can leave any day blank. Your entries are private and processed according to your privacy settings.',
    resources: [
      { key: 'disclaimerModal.resourceBefrienders', label: 'Befrienders Worldwide — crisis lines by country', href: 'https://www.befrienders.org/' },
      { key: 'disclaimerModal.resourceUnhcr', label: 'UNHCR Help — country-by-country guidance', href: 'https://help.unhcr.org/' },
      { key: 'disclaimerModal.resourceFamilyLinks', label: 'Restoring Family Links (ICRC)', href: 'https://familylinks.icrc.org/' },
      { key: 'disclaimerModal.resourceFindTherapist', label: 'Find a Therapist', href: 'https://www.psychologytoday.com/us/therapists' },
    ],
  },
};

const JourneyDisclaimerModal = ({ onAccept, onCancel, variant = 'substance' }) => {
  const { t } = useTranslation('paths');
  const v = VARIANTS[variant] || VARIANTS.substance;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            <AlertTriangle className="modal-title-icon" />
            {t('disclaimerModal.header', 'Important Information')}
          </h2>
          <button onClick={onCancel} className="modal-close">
            <X className="modal-close-icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.aboutTitle', 'About This Journey')}</h3>
            <p>{t(v.aboutKey, v.aboutFallback)}</p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.disclaimerTitle', 'Important Disclaimer')}</h3>
            <p>{t(v.disclaimerKey, v.disclaimerFallback)}</p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.privacyTitle', 'Privacy & Personalization')}</h3>
            <p>{t(v.privacy1Key, v.privacy1Fallback)}</p>
            <p>
              {t('disclaimerModal.privacyText2', 'Your entries are processed to generate your reflections and are never used to train AI models.')}
            </p>
          </div>

          <div className="disclaimer-section">
            <h3 className="disclaimer-title">{t('disclaimerModal.resourcesTitle', 'Support Resources')}</h3>
            <ul className="resource-list">
              {v.resources.map(({ key, label, href }) => (
                <li key={key}>
                  <ExternalLink className="resource-icon" />
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {t(key, label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onCancel} className="modal-button secondary">
            {t('disclaimerModal.cancel', 'Cancel')}
          </button>
          <button onClick={onAccept} className="modal-button primary">
            <Check className="button-icon" />
            {t('disclaimerModal.accept', 'I Understand & Want to Begin')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JourneyDisclaimerModal;
