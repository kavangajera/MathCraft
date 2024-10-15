// import React, { useState, useEffect } from 'react';
// import Navbar from '../components/Navbar';
// import './Question.css';

// export default function MathCommunityQuestions() {
//   const [isPageLoading, setIsPageLoading] = useState(true);
//   const [questions, setQuestions] = useState([]);
//   const [newQuestion, setNewQuestion] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [groups, setGroups] = useState({});
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [message, setMessage] = useState('');
//   const [isAddingQuestion, setIsAddingQuestion] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsPageLoading(false);
//     }, 1000);

//     fetchQuestions();
//     fetchCurrentUser();

//     return () => clearTimeout(timer);
//   }, []);

//   const fetchQuestions = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('http://localhost:5000/api/question', {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       if (data && Array.isArray(data.questions)) {
//         const fetchedQuestions = data.questions;
//         setQuestions(fetchedQuestions);
//         organizeQuestionsByGroup(fetchedQuestions);
//       } else {
//         throw new Error('Unexpected response format from server');
//       }
//     } catch (err) {
//       setError(`Failed to load questions: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const organizeQuestionsByGroup = (questions) => {
//     const groupedQuestions = questions.reduce((acc, question) => {
//       const group = question.category;
//       if (!acc[group]) {
//         acc[group] = [];
//       }
//       acc[group].push(question);
//       return acc;
//     }, {});
//     setGroups(groupedQuestions);
//   };

//   const fetchCurrentUser = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/user/current", {
//         credentials: 'include'
//       });
//       const data = await response.json();
//       setCurrentUser(data.user);
//     } catch (err) {
//       setError(`Failed to load user: ${err.message}`);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!currentUser) {
//       setError('User not authenticated');
//       return;
//     }

//     if (!newQuestion.trim()) {
//       setError('Question is required');
//       return;
//     }

//     setIsAddingQuestion(true);

//     try {
//       await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay

//       const categoryResponse = await fetch('http://localhost:5001/classify', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ question: newQuestion }),
//       });
//       const categoryData = await categoryResponse.json();
//       const category = categoryData.category;

//       const response = await fetch(`http://localhost:5000/api/question/${currentUser.username}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           question: newQuestion,
//           category: category
//         }),
//         credentials: 'include'
//       });
//       if (!response.ok) {
//         throw new Error('Failed to add question');
//       }
//       setNewQuestion('');
//       fetchQuestions();
//       setMessage(`Your question is added to ${category}`);
//     } catch (err) {
//       setError(`Failed to add question: ${err.message}`);
//     } finally {
//       setIsAddingQuestion(false);
//     }
//   };

//   const filteredQuestions = selectedGroup ? groups[selectedGroup] || [] : questions;

//   if (isPageLoading) {
//     return (
//       <div className="loading-container">
//         <div className="math-loading">
//           <span>∫</span>
//           <span>∑</span>
//           <span>∏</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="question-page">
//       <Navbar />
//       <div className="math-community">
//         <h1 className="page-title">Math Community Questions</h1>

//         <div className="question-form">
//           <h2>Ask a Question</h2>
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               value={newQuestion}
//               onChange={(e) => setNewQuestion(e.target.value)}
//               placeholder="Enter your math question"
//               required
//               className="question-input"
//             />
//             <button type="submit" disabled={isAddingQuestion} className="submit-button">
//               {isAddingQuestion ? (
//                 <>
//                   <span>Adding Question</span>
//                   <span className="math-loading">∑</span>
//                 </>
//               ) : (
//                 'Add Question'
//               )}
//             </button>
//           </form>
//         </div>

//         {error && <p className="error-message">{error}</p>}
//         {message && <p className="success-message">{message}</p>}

//         <div className="content-container">
//           <div className="sidebar">
//             <h2>Question Categories</h2>
//             <button 
//               onClick={() => setSelectedGroup(null)}
//               className={`category-button ${selectedGroup === null ? 'active' : ''}`}
//             >
//               All Questions
//             </button>
//             {Object.keys(groups).map((group) => (
//               <button
//                 key={group}
//                 onClick={() => setSelectedGroup(group)}
//                 className={`category-button ${selectedGroup === group ? 'active' : ''}`}
//               >
//                 {group} ({groups[group].length})
//               </button>
//             ))}
//           </div>

//           <div className="main-content">
//             <h2>{selectedGroup ? `${selectedGroup} Questions` : 'All Questions'}</h2>
//             {filteredQuestions.length === 0 ? (
//               <p>No questions found</p>
//             ) : (
//               <div className="questions-list">
//                 {filteredQuestions.map((question) => (
//                   <div key={question._id} className="question-card">
//                     <h3>{question.question}</h3>
//                     <p>Category: {question.category}</p>
//                     <p>Posted by: {question.userId}</p>
//                     <p>Date: {new Date(question.createdAt).toLocaleDateString()}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Question.css';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    fetchQuestions();
    fetchCurrentUser();

    return () => clearTimeout(timer);
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/question', {
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
      const response = await fetch("http://localhost:5000/api/user/current", {
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

      const response = await fetch(`http://localhost:5000/api/question/${currentUser.username}`, {
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
      setNewQuestion('');
      fetchQuestions();
      setMessage(`Your question is added to ${category}`);
    } catch (err) {
      setError(`Failed to add question: ${err.message}`);
    } finally {
      setIsAddingQuestion(false);
    }
  };

  const filteredQuestions = selectedGroup ? groups[selectedGroup] || [] : questions;

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
      <Navbar />
      <div className="math-community">
        <h1 className="page-title">Math Community Questions</h1>

        <div className="question-form">
          <h2>Ask a Question</h2>
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
                <>
                  <span>Adding Question</span>
                  <span className="math-loading">∑</span>
                </>
              ) : (
                'Add Question'
              )}
            </button>
          </form>
        </div>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

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