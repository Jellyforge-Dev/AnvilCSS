import { useI18n } from '../i18n';

// Structure mirrors jellyfin-web's real login page (verified against its source):
// #loginPage > .visualLoginForm (bare <h1>, no class) + .manualLoginForm (h1.sectionTitle).
// .splashLogo is technically the pre-React boot splash, not part of this persistent page, but is
// rendered here too so the login-logo toggle can be previewed against every selector it targets.
export function LoginView() {
  const { t } = useI18n();

  return (
    <div id="loginPage" className="page standalonePage flex flex-direction-column mockup-login-page">
      <div className="splashLogo mockup-splash-logo">
        <span className="mockup-splash-logo-label">{t('mockup.splashLogoLabel')}</span>
      </div>

      <div className="mockup-login-forms">
        <div className="visualLoginForm">
          <h1>{t('mockup.serverName')}</h1>
          <div className="mockup-user-list">
            <button type="button" className="card mockup-user-card">
              <div className="cardBox visualCardBox">
                <div className="cardScalable">
                  <div className="cardContent mockup-user-avatar">AC</div>
                </div>
              </div>
              <div className="cardText cardTextCentered">AnvilCSS</div>
            </button>
          </div>
        </div>

        <form className="manualLoginForm" onSubmit={(e) => e.preventDefault()}>
          <h1 className="sectionTitle">{t('mockup.signIn')}</h1>
          <div className="inputContainer">
            <input className="emby-input" type="text" readOnly value="AnvilCSS" />
            <div className="fieldDescription inputLabelUnfocused">{t('mockup.username')}</div>
          </div>
          <div className="inputContainer">
            <input className="emby-input" type="password" readOnly value="********" />
            <div className="fieldDescription inputLabelUnfocused">{t('mockup.password')}</div>
          </div>
          <button type="submit" className="raised button-submit block emby-button">
            <span>{t('mockup.signIn')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
