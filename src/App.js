import './main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Subscription from './pages/Subscription';
import Calendar from './pages/Calendar';
import Songs from './pages/Songs';
import Articles from './pages/Articles';
import News from './pages/News';
import AjouterNews from './pages/AjouterNews';
import AjouterArticle from './pages/AjouterArticle';
import Events from './pages/Events';
import AjouterChant from './pages/AjouterChant';
import ArticleDetail from './pages/ArticleDetail';
import NewsDetail from './pages/NewsDetail';



function App() {
  return (
    <Router>
    <div className="App">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Subscription />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/ajouternews" element={<AjouterNews />} />
          <Route path="/ajouterarticle" element={<AjouterArticle />} />
          <Route path="/ajouterchant" element={<AjouterChant />} />
          <Route path="/article/:articleId" element={<ArticleDetail />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
        </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;
