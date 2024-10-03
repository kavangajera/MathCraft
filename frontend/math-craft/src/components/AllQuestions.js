import React, { useEffect, useState } from "react";
import axios from "axios";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/question");
        setQuestions(response.data.questions);
      } catch (err) {
        setError("Failed to load questions.");
      }
    };
    fetchAllQuestions();
  }, []);

  return (
    <div>
      <h2>All Questions</h2>
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

export default AllQuestions;
