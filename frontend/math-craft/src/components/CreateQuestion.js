import React, { useState } from "react";
import axios from "axios";

const CreateQuestion = ({ username }) => {
  const [question, setQuestion] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/question/${username}`,
        { question }
      );
      setMessage("Question created successfully!");
      setQuestion("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create question.");
    }
  };

  return (
    <div>
      <h2>Create a Question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question here..."
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateQuestion;
