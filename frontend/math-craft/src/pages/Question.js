import React, { useState, useEffect } from 'react'

export default function Component() {
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [groups, setGroups] = useState({})
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [message, setMessage] = useState('')
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)

  useEffect(() => {
    fetchQuestions()
    fetchCurrentUser()
  }, [])

  const fetchQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/question', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data && Array.isArray(data.questions)) {
        const fetchedQuestions = data.questions
        setQuestions(fetchedQuestions)
        organizeQuestionsByGroup(fetchedQuestions)
      } else {
        throw new Error('Unexpected response format from server')
      }
    } catch (err) {
      setError(`Failed to load questions: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const organizeQuestionsByGroup = (questions) => {
    const groupedQuestions = questions.reduce((acc, question) => {
      const group = question.category
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(question)
      return acc
    }, {})
    setGroups(groupedQuestions)
  }

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/current", {
        credentials: 'include'
      })
      const data = await response.json()
      setCurrentUser(data.user)
    } catch (err) {
      setError(`Failed to load user: ${err.message}`)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      setError('User not authenticated')
      return
    }

    if (!newQuestion.trim()) {
      setError('Question is required')
      return
    }

    setIsAddingQuestion(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2-second delay

      const categoryResponse = await fetch('http://localhost:5001/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion }),
      })
      const categoryData = await categoryResponse.json()
      const category = categoryData.category

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
      })
      if (!response.ok) {
        throw new Error('Failed to add question')
      }
      setNewQuestion('')
      fetchQuestions()
      setMessage(`Your question is added to ${category}`)
    } catch (err) {
      setError(`Failed to add question: ${err.message}`)
    } finally {
      setIsAddingQuestion(false)
    }
  }

  const filteredQuestions = selectedGroup ? groups[selectedGroup] || [] : questions

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }
  
  return (
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
          {filteredQuestions.length === 0 ? (
            <p>No questions found</p>
          ) : (
            <div className="questions-list">
              {filteredQuestions.map((question) => (
                <div key={question._id} className="question-card">
                  <h3>{question.question}</h3>
                  <p>Category: {question.category}</p>
                  <p>Posted by: {question.userId}</p>
                  <p>Date: {new Date(question.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .math-community {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f0f4f8;
          min-height: 100vh;
        }
        .page-title {
          text-align: center;
          color: #2c3e50;
          font-size: 2.5em;
          margin-bottom: 30px;
        }
        .question-form {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }
        .question-input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .submit-button {
          background-color: #3498db;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-button:hover {
          background-color: #2980b9;
        }
        .submit-button:disabled {
          background-color: #bdc3c7;
          cursor: not-allowed;
        }
        .math-loading {
          display: inline-block;
          animation: bounce 0.6s infinite alternate;
          margin-left: 10px;
        }
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
        .error-message {
          color: #e74c3c;
          margin-bottom: 10px;
        }
        .success-message {
          color: #2ecc71;
          margin-bottom: 10px;
        }
        .content-container {
          display: flex;
          gap: 30px;
        }
        .sidebar {
          flex: 1;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .main-content {
          flex: 3;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .category-button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px;
          margin-bottom: 5px;
          background-color: #ecf0f1;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .category-button:hover, .category-button.active {
          background-color: #3498db;
          color: white;
        }
        .questions-list {
          display: grid;
          gap: 20px;
        }
        .question-card {
          background-color: #f9f9f9;
          padding: 15px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .question-card h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .question-card p {
          margin: 5px 0;
          color: #7f8c8d;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}