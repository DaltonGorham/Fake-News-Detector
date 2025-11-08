import ArticleInput from '../components/layout/ArticleInput';
import Sidebar from '../components/layout/Sidebar';
import AiDisclaimer from '../components/layout/AiDisclaimer';
import '../styles/MainPage.css';
import { useArticleHistory } from '../hooks/article/useArticleHistory';

export default function MainPage() {
  const { history, isLoading, error, refreshHistory } = useArticleHistory();
  return (
    <div className="main-page">
      <Sidebar
        history={history}
        isLoading={isLoading}
        error={error}
        onHistoryChange={refreshHistory}
      />
      <div className="content-wrapper">
        <ArticleInput onArticleSubmitted={refreshHistory} history={history} />
        <AiDisclaimer />
      </div>
    </div>
  );
}