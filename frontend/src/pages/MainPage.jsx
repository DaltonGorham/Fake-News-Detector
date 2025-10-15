import ArticleInput from '../components/ArticleInput';
import Sidebar from '../components/Sidebar';
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