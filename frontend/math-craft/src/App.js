import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AllQuestions from "./components/AllQuestions";
import UserQuestions from "./components/UserQuestions";
import CreateQuestion from "./components/CreateQuestion";

function App() {
  const username = "sampleUser"; // Replace with actual username logic

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Routes for question management */}
        <Route 
          path="/questions" 
          element={
            <div>
              <h1>Question Management</h1>
              <CreateQuestion username={username} />
              <UserQuestions username={username} />
              <AllQuestions />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
