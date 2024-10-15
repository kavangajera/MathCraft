import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Question from './pages/Question';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Chat from './components/Chat';
import { Helmet } from "react-helmet";
import Layout from './components/Layout';  // Creating a layout component
import Answer from './pages/Answer'
function App() {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>MathCraft</title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
      
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes with Layout (Navbar + content) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="answer/:questionId" element={<Answer />}/>
              <Route path="questions" element={<Question />} />
              <Route path="chats" element={<Chat />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
