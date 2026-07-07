import { useState } from 'react';
import { Heart, Play } from 'lucide-react';
import { useI18n } from '../i18n';
import { useUiStore } from '../state/uiStore';
import { ALL_ITEMS, backdropUrl, posterUrl } from './catalog';

type Tab = 'overview' | 'cast' | 'details';

export function DetailView() {
  const { t } = useI18n();
  const selectedItemId = useUiStore((s) => s.selectedItemId);
  const [tab, setTab] = useState<Tab>('overview');
  const item = ALL_ITEMS.find((i) => i.id === selectedItemId) ?? ALL_ITEMS[0];

  return (
    <div className="itemDetailPage mockup-detail-page">
      <div className="backdropImage" style={{ backgroundImage: `url(${backdropUrl(item.id)})` }} />
      <div className="mockup-detail-body">
        <div className="itemDetailImage cardContent" style={{ backgroundImage: `url(${posterUrl(item.id)})` }} />

        <div className="mockup-detail-info">
          <div className="detailRibbon">HD</div>
          <h1 className="itemName mockup-item-name">{item.name}</h1>
          <div className="mockup-detail-meta">
            <span>{item.year}</span>
            {item.runtimeMinutes && <span>{item.runtimeMinutes} min</span>}
            <span className="starRatingContainer">★ {item.rating.toFixed(1)}</span>
          </div>
          <div className="genreLinksContainer mockup-genres">{item.genres.join(' · ')}</div>

          <div className="mainDetailButtons">
            <button type="button" className="button-submit detailFloatingButton emby-button raised">
              <Play size={18} />
              <span>{t('mockup.play')}</span>
            </button>
            <button type="button" className="fab paper-icon-button-light" aria-label={t('mockup.favorite')}>
              <Heart size={18} />
            </button>
          </div>

          <div className="emby-tabs mockup-tabs">
            <button
              type="button"
              className={`emby-tab-button ${tab === 'overview' ? 'emby-tab-button-active' : ''}`}
              onClick={() => setTab('overview')}
            >
              {t('mockup.tabOverview')}
            </button>
            <button
              type="button"
              className={`emby-tab-button ${tab === 'cast' ? 'emby-tab-button-active' : ''}`}
              onClick={() => setTab('cast')}
            >
              {t('mockup.tabCast')}
            </button>
            <button
              type="button"
              className={`emby-tab-button ${tab === 'details' ? 'emby-tab-button-active' : ''}`}
              onClick={() => setTab('details')}
            >
              {t('mockup.tabDetails')}
            </button>
          </div>

          {tab === 'overview' && <p className="mockup-overview">{item.overview}</p>}

          {tab === 'cast' && (
            <div id="castCollapsible" className="paperList mockup-cast-list">
              {['A. Sample', 'B. Placeholder', 'C. Example', 'D. Demo'].map((name) => (
                <div key={name} className="card mockup-cast-card">
                  <div className="cardBox visualCardBox">
                    <div className="cardScalable">
                      <div className="cardContent mockup-cast-avatar">{name[0]}</div>
                    </div>
                  </div>
                  <div className="cardText cardTextCentered">{name}</div>
                </div>
              ))}
            </div>
          )}

          {tab === 'details' && (
            <div className="paperList mockup-details-list">
              <div>
                <strong>IMDb:</strong> {item.imdbId}
              </div>
              <div>
                <strong>TMDB:</strong> {item.tmdbId}
              </div>
              {item.childCount !== undefined && (
                <div>
                  <strong>{t('mockup.episodes')}:</strong> {item.childCount}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
