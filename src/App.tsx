import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import ProfileWithdraw from "./pages/Profile/ProfileWithdraw";
import EventParticipants from "./pages/EventParticipants/EventParticipants";
import EventCreate from "./pages/EventCreate/EventCreate";
import EventPreview from "./pages/EventCreate/EventPreview";
import Analysis from "./pages/Analysis/Analysis";
import TestPage from "./pages/TestPage_kaya";
import TestPageOther from "./pages/TestPage";
import EventPost from "./pages/EventPost/EventPost";

function HomeOrRedirectToLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return <Home />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/profile/withdraw" element={<ProfileWithdraw />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<HomeOrRedirectToLogin />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="event-participants" element={<EventParticipants />} />
        <Route path="event-create" element={<EventCreate />} />
        <Route path="event-create/preview" element={<EventPreview />} />
        <Route path="event-post/:eventId" element={<EventPost />} />
        <Route path="eventposttest" element={<EventPost />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="test" element={<TestPage />} />
        <Route path="test-other" element={<TestPageOther />} />
      </Route>
    </Routes>
  );
}

export default App;
