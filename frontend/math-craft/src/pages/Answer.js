import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Answer.css'

const Answer = () => {
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const { questionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [questionId]);

  const fetchQuestionAndAnswers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/answer/${questionId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setQuestion(data.question || '');
        setAnswers(data.answers || []);
      } else {
        throw new Error(data.message || 'Failed to fetch question and answers');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('answer', newAnswer);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/answer/${questionId}`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        setNewAnswer('');
        setImageFile(null);
        fetchQuestionAndAnswers();
      } else {
        throw new Error(data.message || 'Failed to submit answer');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleVote = async (answerId, voteType) => {
    try {
      const response = await fetch(`http://localhost:5000/api/answer/${answerId}/${voteType}`, {
        method: 'PATCH',
        credentials: 'include'
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

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="answer-page">
      <Navbar />
      <div className="container">
        <h1 className="question-title">{question || 'Question not found'}</h1>
        
        <div className="answers-list">
          <h2>Answers</h2>
          {answers && answers.length > 0 ? (
            answers.map((answer) => (
              <div key={answer.answerId} className="answer-card">
                <div dangerouslySetInnerHTML={{ __html: answer.answer }} />
                {answer.image && <img src={answer.image} alt="Answer illustration" className="answer-image" />}
                <p>By: {answer.user}</p>
                <p>Posted on: {new Date(answer.createdAt).toLocaleDateString()}</p>
                <div className="vote-buttons">
                  <button onClick={() => handleVote(answer.answerId, 'upvote')}>
                    Upvote ({answer.upvotes})
                  </button>
                  <button onClick={() => handleVote(answer.answerId, 'downvote')}>
                    Downvote ({answer.downvotes})
                  </button>
                </div>
                {answer.verifiedByExpert && <span className="verified-badge">Verified by Expert</span>}
              </div>
            ))
          ) : (
            <p>No answers yet. Be the first to answer!</p>
          )}
        </div>

        <div className="answer-form">
          <h2>Your Answer</h2>
          <form onSubmit={handleSubmit}>
            <ReactQuill 
              theme="snow"
              value={newAnswer}
              onChange={setNewAnswer}
              modules={modules}
              formats={formats}
              placeholder="Type your answer here"
            />
            <div className="image-upload">
              <label htmlFor="image-upload" className="custom-file-upload">
                Upload Image
              </label>
              <input 
                id="image-upload" 
                type="file" 
                onChange={handleImageUpload} 
                accept="image/*"
              />
              {imageFile && <p>Image selected: {imageFile.name}</p>}
            </div>
            <button type="submit" className="submit-button">Post Answer</button>
          </form>
        </div>

        <button onClick={() => navigate(-1)} className="back-button">
          Back to Questions
        </button>

      </div>
    </div>
  );
};

export default Answer;