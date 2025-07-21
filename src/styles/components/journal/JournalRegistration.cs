/* src/components/journal/JournalRegistration.css */

.jr-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease-out;
}

.jr-modal {
  background: var(--bg-primary, #ffffff);
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: slideInScale 0.3s ease-out;
}

.jr-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary, #64748b);
  z-index: 10;
}

.jr-close-btn:hover {
  background: var(--bg-tertiary, #f1f5f9);
  color: var(--text-primary, #1e293b);
}

.jr-content {
  padding: 2rem;
  padding-bottom: 1rem;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

/* Step Styling */
.jr-step {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.jr-header {
  text-align: center;
}

.jr-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  position: relative;
}

.jr-icon-wrapper.jr-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.jr-icon-wrapper.jr-celebration {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.jr-header-icon {
  color: white;
  font-size: 28px;
}

.jr-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary, #1e293b);
  margin-bottom: 0.5rem;
}

.jr-subtitle {
  font-size: 1rem;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
}

/* Features List */
.jr-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.jr-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary, #f8fafc);
  border-radius: 12px;
  border-left: 4px solid var(--primary-color, #667eea);
}

.jr-feature-icon {
  color: var(--primary-color, #667eea);
  flex-shrink: 0;
  margin-top: 2px;
}

.jr-feature h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 0.25rem;
}

.jr-feature p {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  line-height: 1.4;
}

/* Tier Selection */
.jr-tiers {
  display: grid;
  gap: 1rem;
}

.jr-tier-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--border-color, #e2e8f0);
  border-radius: 12px;
  background: var(--bg-primary, #ffffff);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.jr-tier-card:hover {
  border-color: var(--tier-color, #667eea);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.jr-tier-card.selected {
  border-color: var(--tier-color, #667eea);
  background: var(--bg-secondary, #f8fafc);
  box-shadow: 0 0 0 1px var(--tier-color, #667eea);
}

.jr-tier-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.jr-tier-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--tier-color, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.jr-tier-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
}

.jr-tier-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.jr-tier-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
}

.jr-tier-features li svg {
  color: var(--tier-color, #667eea);
  flex-shrink: 0;
}

/* Registration Info */
.jr-registration-info {
  background: var(--bg-secondary, #f8fafc);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.jr-info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.jr-info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.jr-info-item strong {
  color: var(--text-primary, #1e293b);
  font-weight: 600;
}

/* Success Info */
.jr-registration-success {
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.jr-success-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.jr-success-item strong {
  color: #065f46;
  font-weight: 600;
  font-size: 0.875rem;
}

.jr-success-item code {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: 6px;
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.8125rem;
  color: #065f46;
  word-break: break-all;
}

.jr-url-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.jr-url-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.jr-url-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.8);
  font-family: 'SF Mono', Consolas, monospace;
  font-size: 0.75rem;
  color: #065f46;
}

.jr-copy-btn {
  padding: 0.5rem;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: #065f46;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.jr-copy-btn:hover {
  background: white;
  border-color: #10b981;
}

/* Instructions */
.jr-nfc-instructions {
  background: var(--bg-secondary, #f8fafc);
  border-radius: 12px;
  padding: 1.5rem;
}

.jr-nfc-instructions h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 1rem;
}

.jr-nfc-instructions ol {
  padding-left: 1.25rem;
  margin: 0;
}

.jr-nfc-instructions li {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

/* Completion Info */
.jr-completion-info {
  text-align: left;
}

.jr-next-steps h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin-bottom: 1rem;
}

.jr-next-steps ul {
  padding-left: 1.25rem;
  margin: 0;
}

.jr-next-steps li {
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

/* Error Message */
.jr-error {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Actions */
.jr-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.jr-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 0.925rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-family: inherit;
}

.jr-btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.jr-btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.jr-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.jr-btn-secondary {
  background: var(--bg-secondary, #f8fafc);
  color: var(--text-primary, #1e293b);
  border: 1px solid var(--border-color, #e2e8f0);
}

.jr-btn-secondary:hover:not(:disabled) {
  background: var(--bg-tertiary, #f1f5f9);
  border-color: var(--border-hover, #cbd5e1);
}

/* Progress Bar */
.jr-progress {
  padding: 1rem 2rem;
  border-top: 1px solid var(--border-light, #e2e8f0);
  background: var(--bg-secondary, #f8fafc);
}

.jr-progress-bar {
  width: 100%;
  height: 4px;
  background: var(--border-light, #e2e8f0);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.jr-progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.jr-progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary, #64748b);
  text-align: center;
  font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .jr-modal {
    max-width: 100%;
    margin: 0;
    border-radius: 16px 16px 0 0;
    max-height: 95vh;
  }
  
  .jr-content {
    padding: 1.5rem;
  }
  
  .jr-title {
    font-size: 1.25rem;
  }
  
  .jr-actions {
    flex-direction: column;
  }
  
  .jr-tiers {
    gap: 0.75rem;
  }
  
  .jr-tier-card {
    padding: 1.25rem;
  }
  
  .jr-url-wrapper {
    flex-direction: column;
    align-items: stretch;
  }
  
  .jr-copy-btn {
    align-self: flex-end;
    width: auto;
  }
}

/* Dark Mode Support */
[data-theme="dark"] .jr-modal {
  background: #1e293b;
  color: #f1f5f9;
}

[data-theme="dark"] .jr-close-btn {
  background: #334155;
  color: #cbd5e1;
}

[data-theme="dark"] .jr-close-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

[data-theme="dark"] .jr-feature {
  background: #334155;
}

[data-theme="dark"] .jr-tier-card {
  background: #1e293b;
  border-color: #475569;
}

[data-theme="dark"] .jr-tier-card.selected {
  background: #334155;
}

[data-theme="dark"] .jr-registration-info {
  background: #334155;
}

[data-theme="dark"] .jr-info-item {
  border-bottom-color: #475569;
}

[data-theme="dark"] .jr-nfc-instructions {
  background: #334155;
}

[data-theme="dark"] .jr-btn-secondary {
  background: #334155;
  border-color: #475569;
  color: #f1f5f9;
}

[data-theme="dark"] .jr-btn-secondary:hover:not(:disabled) {
  background: #475569;
  border-color: #64748b;
}

[data-theme="dark"] .jr-progress {
  background: #334155;
  border-top-color: #475569;
}

[data-theme="dark"] .jr-progress-bar {
  background: #475569;
}