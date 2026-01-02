import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudLogin from './pages/StudLogin';
import StudSignup from './pages/StudSignup';
import QuizPage from './pages/QuizPage';
import Dashboard from './pages/Dashboard';


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/student-login" element={<StudLogin />} />
          <Route path="/student-signup" element={<StudSignup />} />
          <Route path="/quiz/:subject" element={<QuizPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    
    </div>
  );
}

export default App;
