import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Answer.css';
import { baseUrl } from '../Urls';
import Comment from '../components/Comment';

const Answer = () => {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [comments, setComments] = useState({});
  const [newAnswer, setNewAnswer] = useState('');
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageBase64, setImageBase64] = useState(null);
  const { questionId } = useParams();
  const [currentUser, setCurrentUser] = useState(null); // Store current user
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestionAndAnswers();
    fetchCurrentUser(); // Fetch the current user when the component mounts
  }, [questionId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/user/current`, {
        credentials: 'include',
      });
      const data = await response.json();
      setCurrentUser(data.user); // Save the current user
    } catch (err) {
      setError(`Failed to load user: ${err.message}`);
    }
  };

  const fetchQuestionAndAnswers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/answer/${questionId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        setQuestion(data.question || null);
        setAnswers(data.answers || []);
        
        const newComments = {};
        for (const answer of data.answers) {
          const answerComments = await fetchCommentsForAnswer(answer.answerId);
          newComments[answer.answerId] = answerComments;
        }
        setComments(newComments);
      } else {
        throw new Error(data.message || 'Failed to fetch question and answers');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAnswer = (answerId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this answer?');
    if (confirmDelete) {
      fetch(`${baseUrl}/api/answer/delete/${answerId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            setAnswers((prevAnswers) => prevAnswers.filter((answer) => answer.answerId !== answerId));
          } else {
            throw new Error('Failed to delete the answer');
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  };

  const handleVote = async (answerId, voteType) => {
    try {
      const response = await fetch(`${baseUrl}/api/answer/${answerId}/${voteType}`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (response.ok) {
        fetchQuestionAndAnswers();
      } else {
        throw new Error(`Failed to ${voteType} answer`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const answerData = {
      answer: newAnswer,
      image: imageBase64 || '',
    };

    try {
      const response = await fetch(`${baseUrl}/api/answer/${questionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
        credentials: 'include',
      });
      if (response.ok) {
        setNewAnswer('');
        setImageBase64(null);
        fetchQuestionAndAnswers();
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmitComment = async (answerId, e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${baseUrl}/api/comment/${answerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        setNewComment('');
        const updatedComments = await fetchCommentsForAnswer(answerId);
        setComments((prevComments) => ({
          ...prevComments,
          [answerId]: updatedComments,
        }));
      } else {
        const data = await response.json();
        console.error('Failed to post comment:', data.message);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const fetchCommentsForAnswer = async (answerId) => {
    try {
      const response = await fetch(`${baseUrl}/api/comment/${answerId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        return data.comments || [];
      } else {
        return [];
      }
    } catch (err) {
      return [];
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image'];

  if (isLoading) {
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

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="answer-page">
      <Navbar />
      <div className="container">
        <h1 className="question-title">{question ? question.title : 'Question not found'}</h1>

        <div className="answers-list">
          <h2>Answers</h2>
          {answers.length > 0 ? (
            answers.map((answer) => (
              <div key={answer.answerId} className="answer-card">
                <div className="answer-content" dangerouslySetInnerHTML={{ __html: answer.answer }} />
                {answer.image && <img src={answer.image} alt="Answer illustration" className="answer-image" />}
                <div className="answer-meta">
                  <p>By: {answer.user}</p>
                  <p>Posted on: {answer.createdAt ? new Date(answer.createdAt).toLocaleDateString() : 'Date not available'}</p>
                </div>
                <div className="vote-buttons">
                  <button onClick={() => handleVote(answer.answerId, 'upvote')} className="vote-button upvote">
                    Upvote ({answer.upvotes})
                  </button>
                  <button onClick={() => handleVote(answer.answerId, 'downvote')} className="vote-button downvote">
                    Downvote ({answer.downvotes})
                  </button>
                </div>
               
                {currentUser && currentUser.username === answer.user && (
                  <div className="delete-section">
                    <button className="delete-button" onClick={() => handleDeleteAnswer(answer.answerId)}>
                      Delete Answer
                    </button>
                  </div>
                )}

                <div className="comments-section">
                  <h3>Comments</h3>
                  {comments[answer.answerId] && comments[answer.answerId].length > 0 ? (
                    comments[answer.answerId].map((comment) => (
                      <Comment key={comment._id} username={comment.username} content={comment.content} createdAt={comment.createdAt} />
                    ))
                  ) : (
                    <p className="no-comments">No comments yet.</p>
                  )}

                  <form onSubmit={(e) => handleSubmitComment(answer.answerId, e)}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment"
                    />
                    <button type="submit">Comment</button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p>No answers yet.</p>
          )}
        </div>

        <div className="submit-answer">
          <h2>Your Answer</h2>
          <form onSubmit={handleSubmit}>
            <ReactQuill value={newAnswer} onChange={setNewAnswer} modules={modules} formats={formats} />
            <button type="submit" className="submit-button">
              Submit Answer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Answer;
