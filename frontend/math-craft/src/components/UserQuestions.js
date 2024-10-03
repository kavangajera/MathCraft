import React, { useEffect, useState } from "react";
import axios from "axios";

const UserQuestions = ({ username }) => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/question/user/${username}`
        );
        setQuestions(response.data.questions);
      } catch (err) {
        setError("Failed to load user's questions.");
      }
    };
    fetchUserQuestions();
  }, [username]);

  return (
    <div>
      <h2>{username}'s Questions</h2>
      {error && <p>{error}</p>}
      {questions.length === 0 && <p>No questions found.</p>}
      <ul>
        {questions.map((q) => (
          <li key={q.id}>{q.question}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserQuestions;
