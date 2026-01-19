import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import EventParticipants from './pages/EventParticipants/EventParticipants';
import EventCreate from './pages/EventCreate/EventCreate';
import Analysis from './pages/Analysis/Analysis';

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
      </Route>
    </Routes>
  );
}

export default App;
