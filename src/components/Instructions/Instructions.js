import { Link } from "react-router-dom";
import "./Instructions.scss";

const steps = [
  "A random song will play for only 5 seconds.",
  "Type your guess — song title or artist name.",
  "Hit REVEAL to check your answer and earn a point!",
];

function Instructions() {
  return (
    <section className="instructions">
      <h2>How to Play</h2>
      <div className="instructions__all">
        {steps.map((step, index) => (
          <div key={index} className="instructions__individual">
            <p>{step}</p>
          </div>
        ))}
      </div>
      <Link to="/sonicwave">
        <button>START</button>
      </Link>
    </section>
  );
}

export default Instructions;
