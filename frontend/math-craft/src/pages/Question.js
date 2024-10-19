import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Question.css';
import { baseUrl } from '../Urls';


export default function Question() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [groups, setGroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [message, setMessage] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [badgeMessage, setBadgeMessage] = useState(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('badgeMessage') || 'No changes';
  });


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    fetchBadgeUpdate();
    fetchQuestions();
    fetchCurrentUser();

    if (!localStorage.getItem('badgeMessage')) {
      fetchBadgeUpdate();
    }

    return () => clearTimeout(timer);
  }, []);


  const fetchBadgeUpdate = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/answer/count-votes`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.message) {
        setBadgeMessage(data.message); // Set badge update message
      }
      localStorage.setItem('badgeMessage', data.message);
    } catch (err) {
      console.error('Failed to fetch badge update:', err);
    }
  };

  const clearBadgeMessage = () => {
    setBadgeMessage('No changes');
    localStorage.setItem('badgeMessage', 'No changes');
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/question`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data && Array.isArray(data.questions)) {
        const fetchedQuestions = data.questions;
        setQuestions(fetchedQuestions);
        organizeQuestionsByGroup(fetchedQuestions);
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const organizeQuestionsByGroup = (questions) => {
    const groupedQuestions = questions.reduce((acc, question) => {
      const group = question.category;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(question);
      return acc;
    }, {});
    setGroups(groupedQuestions);
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include'
      });
      const data = await response.json();
      setCurrentUser(data.user);
    } catch (err) {
      setError(`Failed to load user: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    if (!newQuestion.trim()) {
      setError('Question is required');
      return;
    }

    setIsAddingQuestion(true);
    setError('');
    setMessage('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

      const categoryResponse = await fetch('http://localhost:5001/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion }),
      });
      const categoryData = await categoryResponse.json();
      const category = categoryData.category;

      const response = await fetch(`${baseUrl}/api/question/${currentUser.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: newQuestion,
          category: category
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to add question');
      }
      if(category==="Error"){
        throw new Error('Enter valid mathematics question!')
      }
      setNewQuestion('');
      fetchQuestions();
      setMessage(`Your question has been added to ${category}`);
    } catch (err) {
      setError(`Failed to add question: ${err.message}`);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  // Filter questions by search query
  const filteredQuestions = selectedGroup
    ? (groups[selectedGroup] || []).filter(question =>
        question.question.toLowerCase().includes(searchQuery.toLowerCase()))
    : questions.filter(question =>
        question.question.toLowerCase().includes(searchQuery.toLowerCase()));

  if (isPageLoading) {
    return (
      <div className="loading-container">
        <div className="math-loading">
          <span>∫</span>
          <span>∑</span>
          <span>∏</span>
        </div>
      </div>
    );
  }

  return (
    <div className="question-page">
      <Navbar badgeMessage={badgeMessage} 
        onProfileClick={clearBadgeMessage} />
      <div className="math-community">
        <h1 className="page-title">Math Community Questions</h1>

        <div className="question-form">
          <h2>Ask a Question</h2>
          {/* <h4>{badgeMessage}</h4> */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your math question"
              required
              className="question-input"
            />
            <button type="submit" disabled={isAddingQuestion} className="submit-button">
              {isAddingQuestion ? (
                <span className="math-loading">
                  <span>+</span>
                  <span>=</span>
                  <span>×</span>
                </span>
              ) : (
                'Ask Question'
              )}
            </button>
          </form>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a question"
            className="search-input"
          />
        </div>

        <div className="content-container">
          <div className="sidebar">
            <h2>Question Categories</h2>
            <button 
              onClick={() => setSelectedGroup(null)}
              className={`category-button ${selectedGroup === null ? 'active' : ''}`}
            >
              All Questions
            </button>
            {Object.keys(groups).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`category-button ${selectedGroup === group ? 'active' : ''}`}
              >
                {group} ({groups[group].length})
              </button>
            ))}
          </div>

          <div className="main-content">
            <h2>{selectedGroup ? `${selectedGroup} Questions` : 'All Questions'}</h2>
            {isLoading ? (
              <div className="loading-spinner">Loading...</div>
            ) : filteredQuestions.length === 0 ? (
              <p>No questions found</p>
            ) : (
              <div className="questions-list">
                {filteredQuestions.map((question) => (
                  <div key={question._id} className="question-card">
                    <h3>{question.question}</h3>
                    <p>Category: {question.category}</p>
                    <p>Posted by: {question.userId}</p>
                    <p>Date: {new Date(question.createdAt).toLocaleDateString()}</p>
                    <Link to={`/answer/${question._id}`} className="answers-button">
                      Answers ({question.answerCount})
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

