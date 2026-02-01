import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import EventParticipants from './pages/EventParticipants/EventParticipants';
import EventCreate from './pages/EventCreate/EventCreate_sample';
import Analysis from './pages/Analysis/Analysis';
import TestPage from './pages/TestPage_kaya';
import TestPageOther from './pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="event-participants" element={<EventParticipants />} />
        <Route path="event-create" element={<EventCreate />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="test" element={<TestPage />} />
        <Route path="test-other" element={<TestPageOther />} />
      </Route>
    </Routes>
  );
}

export default App;
