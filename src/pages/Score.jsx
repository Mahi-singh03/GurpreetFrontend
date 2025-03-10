import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./css/Score.css"; // Importing the external CSS

const Score = () => {
  const { user } = useAuth();
  const [scoreData, setScoreData] = useState(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const res = await axios.get(
          "https://backend-production-e56f.up.railway.app/api/users/score",
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setScoreData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchScore();
  }, []);

  if (!scoreData)
    return <div className="text-center mt-8 exam-message">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="score-container">
        <h2 className="score-title">Your Exam Results</h2>

        <div className="score-details">
          <div className="detail-row">
            <span className="font-medium">Name:</span>
            <span>{scoreData.name}</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Score:</span>
            <span className="text-green-600 font-bold">{scoreData.score}</span>
          </div>

          <div className="detail-row">
            <span className="font-medium">Status:</span>
            <span
              className={`status-badge ${
                scoreData.hasGivenExam ? "status-completed" : "status-pending"
              }`}
            >
              {scoreData.hasGivenExam ? "Exam Completed" : "Exam Pending"}
            </span>
          </div>
        </div>

        {!scoreData.hasGivenExam && (
          <p className="exam-message">
            You haven't taken the exam yet. Go to the dashboard to start!
          </p>
        )}
      </div>
    </div>
  );
};

export default Score;
