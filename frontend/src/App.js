import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import Header from './Components/Header/Header';
import HomePage from './Pages/HomePage/HomePage';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import UserProfilePage from './Pages/UserProfilePage/UserProfilePage';
import UserBooksPage from './Pages/UserBooksPage/UserBooksPage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/user-books" element={<UserBooksPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
