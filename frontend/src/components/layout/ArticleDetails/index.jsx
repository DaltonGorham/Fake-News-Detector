import { useState, useEffect } from 'react';
import { HiX, HiExternalLink, HiCalendar, HiNewspaper } from 'react-icons/hi';
import { articleApi } from '../../../api/articles';
import Loading from '../../common/Loading';
import TruthnessGauge from '../../common/TruthnessGauge';
import { createCache, cachedFetch } from '../../../util/cacheManager';
import './styles.css';

const articleDetailsCache = {};

export default function ArticleDetails({ articleId, isOpen, onClose }) {
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && articleId) {
      fetchArticleDetails();
    }
  }, [isOpen, articleId]);

  const fetchArticleDetails = async () => {
    if (!articleDetailsCache[articleId]) {
      articleDetailsCache[articleId] = createCache();
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await cachedFetch(
        articleDetailsCache[articleId],
        async () => {
          const { data, error: apiError } = await articleApi.getAnalysis(articleId);
          if (apiError) {
            throw new Error(apiError);
          }
          return data?.data || data;
        },
        {
          onSuccess: (data) => {
            setArticle(data);
            setIsLoading(false);
          },
          onError: (err) => {
            setError(err.message || 'Failed to load article details');
            setIsLoading(false);
          }
        }
      );
    } catch (err) {
      setError(err.message || 'Failed to load article details');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const aiResult = article?.ai_result?.[0];
  const label = aiResult?.truthness_label?.toLowerCase() || '';
  const truthnessClass = label.includes('reliable') && !label.includes('unreliable') ? 'reliable' : 
                         label.includes('unreliable') ? 'unreliable' : 
                         'unknown';
  
  const score = aiResult?.truthness_score ? aiResult.truthness_score * 100 : null;
  const getConfidenceMessage = () => {
    if (!score && score !== 0) return null;
    if (score < 25) return 'This article is very likely fake';
    if (score < 40) return 'This article is likely fake';
    if (score < 50) return 'This article may be fake';
    if (score === 50) return 'This article\'s authenticity is uncertain';
    if (score < 60) return 'This article may be real';
    if (score < 75) return 'This article is likely real';
    if (score < 90) return 'This article is very likely real';
    return 'This article is almost certainly real';
  };  
  
  return (
    <div className="article-details-overlay" onClick={handleOverlayClick}>
      <div className="article-details-modal">
        <button className="close-button" onClick={onClose} aria-label="Close article details">
          <HiX size={20} />
        </button>

        {isLoading ? (
          <div className="article-loading-state">
            <Loading inline />
          </div>
        ) : error ? (
          <div className="article-details-error">
            <p className="error-title">Failed to load article details</p>
            <p className="error-message">{error}</p>
            <button onClick={fetchArticleDetails} className="retry-button">
              Try Again
            </button>
          </div>
        ) : article ? (
          <div className="article-details-content">
            <div className={`score-header ${truthnessClass}`}>
              <TruthnessGauge 
                score={score}
                label={aiResult?.truthness_label}
              />
              {getConfidenceMessage() && (
                <div className="confidence-message">{getConfidenceMessage()}</div>
              )}
            </div>

            <div className="article-body">
              {article.url && (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="article-link"
                >
                  <HiExternalLink size={20} />
                  <span className="link-text">{article.url}</span>
                </a>
              )}

              <h1 className="article-title">{article.title || 'Untitled Article'}</h1>

              <div className="info-grid">
                {article.source && (
                  <div className="info-item">
                    <div className="info-content">
                      <div className="info-label">Source</div>
                      <div className="info-value">{article.source}</div>
                    </div>
                  </div>
                )}
                
                {article.collected_date && (
                  <div className="info-item">
                    <div className="info-content">
                      <div className="info-label">Analyzed</div>
                      <div className="info-value">
                        {new Date(article.collected_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {aiResult?.genre && (
                  <div className="info-item">
                    <div className="info-content">
                      <div className="info-label">Category</div>
                      <div className="info-value">{aiResult.genre}</div>
                    </div>
                  </div>
                )}
              </div>

              {aiResult?.related_articles && aiResult.related_articles.length > 0 && (
                <div className="related-section">
                  <h3 className="section-title">Related Articles</h3>
                  <div className="related-list">
                    {aiResult.related_articles.map((related, index) => (
                      <a 
                        key={index}
                        href={related.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="related-item"
                      >
                        <span className="related-title">{related.title || 'Related Article'}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="footnotes-section">
                {aiResult?.is_satire && (
                  <div className="footnote satire-warning">
                    <strong>Satirical Content Detected</strong> This source is known for its satirical content, which is intended as parody and not factual reporting.
                  </div>
                )}
                
                <div className="footnote ai-disclaimer">
                  <strong>AI Analysis Disclaimer:</strong> This result was generated by artificial intelligence. AI can make mistakes, and you should verify important information from trusted sources.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="article-details-empty">
            <p>No article data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
