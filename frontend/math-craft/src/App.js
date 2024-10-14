import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Question from './pages/Question';  // Make sure this import is correct
import ProtectedRoute from './components/ProtectedRoute';
import Chat from './components/Chat';

function App() {
  return (
    <Router>
      <Routes>
      <Route index element={<Home />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="chats" element={<Chat/>}/>
          <Route path="questions" element={<Question />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;