import { Cast, Home, Menu, Search, Settings, Tv, Film } from 'lucide-react';
import { useI18n } from '../i18n';
import { useUiStore } from '../state/uiStore';
import { MockItem, CONTINUE_WATCHING, MOVIES, SHOWS, posterUrl } from './catalog';

function Card({ item, onOpen }: { item: MockItem; onOpen: (item: MockItem) => void }) {
  const unwatched = item.type === 'Series' ? item.unplayedCount : undefined;
  return (
    <button type="button" className="card overflowPortraitCard" onClick={() => onOpen(item)}>
      <div className="cardBox visualCardBox">
        <div className="cardScalable">
          <div className="cardPadder" />
          <div className="cardContent cardContent-shadow">
            <div className="cardImageContainer" style={{ backgroundImage: `url(${posterUrl(item.id)})` }}>
              <div className="cardOverlayContainer" />
              {!!unwatched && <div className="countIndicator">{unwatched}</div>}
              {item.favorite && <div className="mockup-favorite-badge">★</div>}
            </div>
          </div>
          {typeof item.progress === 'number' && (
            <div className="itemProgressBar">
              <div className="itemProgressBarForeground" style={{ width: `${item.progress}%` }} />
            </div>
          )}
        </div>
      </div>
      <div className="cardText cardTextCentered">{item.name}</div>
      <div className="cardText cardText-secondary cardTextCentered">{item.year}</div>
    </button>
  );
}

export function DashboardView() {
  const { t } = useI18n();
  const openDetailAction = useUiStore((s) => s.openDetail);
  const openDetail = (item: MockItem) => openDetailAction(item.id);

  return (
    <div className="mainAnimatedPages mockup-dashboard-page">
      <div className="skinHeader skinHeader-withBackground">
        <button type="button" className="headerButton headerButtonLeft" aria-label={t('mockup.menu')}>
          <Menu size={20} />
        </button>
        <div className="pageTitleWithLogo mockup-page-title">{t('mockup.serverName')}</div>
        <div className="headerRight">
          <button type="button" className="headerButton">
            <Search size={18} />
          </button>
          <button type="button" className="headerButton headerCastButton">
            <Cast size={18} />
          </button>
          <button type="button" className="fab paper-icon-button-light mockup-user-fab">AC</button>
        </div>
      </div>

      <div className="mainDrawer drawer-open">
        <div className="mainDrawer-scrollContainer">
          <div className="navMenuOption navMenuOption-selected">
            <Home size={17} />
            <span className="navMenuOptionText">{t('mockup.navHome')}</span>
          </div>
          <div className="navMenuOption">
            <Film size={17} />
            <span className="navMenuOptionText">{t('mockup.navMovies')}</span>
          </div>
          <div className="navMenuOption">
            <Tv size={17} />
            <span className="navMenuOptionText">{t('mockup.navShows')}</span>
          </div>
          <div className="navMenuOption">
            <Settings size={17} />
            <span className="navMenuOptionText">{t('mockup.navSettings')}</span>
          </div>
        </div>
      </div>

      <div className="backgroundContainer mockup-content">
        <h2 className="sectionTitle">{t('mockup.continueWatching')}</h2>
        <div className="itemsContainer mockup-row">
          {CONTINUE_WATCHING.map((item) => (
            <Card key={item.id} item={item} onOpen={openDetail} />
          ))}
        </div>

        <h2 className="sectionTitle">{t('mockup.navMovies')}</h2>
        <div className="itemsContainer mockup-row">
          {MOVIES.map((item) => (
            <Card key={item.id} item={item} onOpen={openDetail} />
          ))}
        </div>

        <h2 className="sectionTitle">{t('mockup.navShows')}</h2>
        <div className="itemsContainer mockup-row">
          {SHOWS.map((item) => (
            <Card key={item.id} item={item} onOpen={openDetail} />
          ))}
        </div>
      </div>
    </div>
  );
}
