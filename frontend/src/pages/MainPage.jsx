import ArticleInput from '../components/layout/ArticleInput';
import Sidebar from '../components/layout/Sidebar';
import '../styles/MainPage.css';

export default function MainPage() {
  return (
    <div className="main-page">
      <Sidebar />
      <div className="content-wrapper">
        <ArticleInput />
      </div>
    </div>
  );
}