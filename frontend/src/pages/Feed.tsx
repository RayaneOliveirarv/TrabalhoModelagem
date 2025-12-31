import React from 'react';
import NavbarPrincipal from '../components/NavbarPrincipal';
import BuscaFeed from '../components/BuscaFeed';
import NavbarFeed from '../components/NavbarFeed';
import NovoPostButton from '../components/NovoPostButton';
import '../styles/Feed/Feed.css';

const Feed: React.FC = () => {
  return (
    <div className="feed-bg">
      <div className="feed-container">
        <NavbarPrincipal />
        <div className="feed-row" style={{ alignItems: 'center' }}>
          <div className="feed-busca" style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <BuscaFeed />
            <div style={{ marginLeft: 12 }}>
              <NovoPostButton />
            </div>
          </div>
        </div>
        <div className="feed-navbarfeed">
          <NavbarFeed />
        </div>
        <div className="feed-card-wrapper">
          <div className="feed-card">
            <div className="feed-card-header">
              <div className="feed-card-avatar" />
              <div className="feed-card-user">
                <div className="feed-card-user-name">Fulano</div>
                <div className="feed-card-user-time">3 horas atrás</div>
              </div>
              <div className="feed-card-status">PERDIDO</div>
            </div>
            <img src="https://images.unsplash.com/photo-1558788353-f76d92427f16" alt="dog" className="feed-card-img" />
            <div className="feed-card-title">Ben10</div>
            <div className="feed-card-desc">
              Golden Retriever perdido desde ontem. Estava com coleira azul. Muito dócil e responde pelo nome Ben.
            </div>
            <div className="feed-card-location">
              <span role="img" aria-label="location">📍</span> São Paulo, rua das flores - SP
            </div>
            <div className="feed-card-actions">
              <span className="feed-card-like">20</span>
              <span className="feed-card-comment">💬 6</span>
              <span className="feed-card-star">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
