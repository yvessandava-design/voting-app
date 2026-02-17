import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateVote from './pages/CreateVote';
import VotePage from './pages/VotePage';
import Results from './pages/Results';
import VoteProgress from './pages/VoteProgress';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/create-vote" element={token ? <CreateVote /> : <Navigate to="/login" />} />
        <Route path="/vote-progress" element={token ? <VoteProgress /> : <Navigate to="/login" />} />
        <Route path="/vote/:voteToken" element={<VotePage />} />
        <Route path="/results/:voteToken" element={<Results />} />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
