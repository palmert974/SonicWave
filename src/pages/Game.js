import axios from "axios";
import { useState, useEffect, useRef, useCallback } from "react";
import "./Game.scss";

const ITUNES_API_URL =
  "https://itunes.apple.com/search?term=hip-hop+pop+rnb&media=music&entity=song&limit=50";

const PLAY_DURATION_MS = 5000;

function getRandomTrack(tracks) {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  return tracks[randomIndex];
}

function Game() {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [guess, setGuess] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch tracks on mount
  useEffect(() => {
    axios
      .get(ITUNES_API_URL)
      .then((response) => {
        const validTracks = response.data.results.filter(
          (result) => result.previewUrl
        );
        setTracks(validTracks);
        setCurrentTrack(getRandomTrack(validTracks));
        setIsLoading(false);
      })
      .catch(() => {
        setError("Could not load tracks. Please try again.");
        setIsLoading(false);
      });
  }, []);

  // Play 5-second preview when currentTrack changes
  const playPreview = useCallback(() => {
    if (!currentTrack?.previewUrl || !audioRef.current) return;

    clearTimeout(timerRef.current);
    setIsPlaying(true);
    setIsRevealed(false);
    setGuess("");
    setIsCorrect(null);

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});

    timerRef.current = setTimeout(() => {
      audioRef.current?.pause();
      setIsPlaying(false);
    }, PLAY_DURATION_MS);
  }, [currentTrack]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  function handleReveal() {
    audioRef.current?.pause();
    clearTimeout(timerRef.current);
    setIsPlaying(false);
    setIsRevealed(true);

    const guessNormalized = guess.trim().toLowerCase();
    const songMatch = currentTrack.trackName.toLowerCase().includes(guessNormalized);
    const artistMatch = currentTrack.artistName.toLowerCase().includes(guessNormalized);
    const correct = guessNormalized.length > 0 && (songMatch || artistMatch);

    setIsCorrect(correct);
    if (correct) setScore((prev) => prev + 1);
  }

  function handleNextRound() {
    const nextTrack = getRandomTrack(tracks.filter((t) => t !== currentTrack));
    setCurrentTrack(nextTrack);
    setRound((prev) => prev + 1);
    setIsRevealed(false);
    setIsCorrect(null);
    setGuess("");
  }

  if (isLoading) {
    return (
      <section className="game">
        <p className="game__loading">Loading tracks...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="game">
        <p className="game__error">{error}</p>
      </section>
    );
  }

  return (
    <section className="game">
      <div className="game__header">
        <span className="game__round">Round {round}</span>
        <span className="game__score">Score: {score}</span>
      </div>

      <audio ref={audioRef} src={currentTrack?.previewUrl} preload="auto" />

      {!isPlaying && !isRevealed && (
        <button className="game__btn game__btn--play" onClick={playPreview}>
          ▶ PLAY CLIP
        </button>
      )}

      {isPlaying && (
        <p className="game__status">🎵 Listen carefully... 5 seconds!</p>
      )}

      {!isPlaying && currentTrack && (
        <div className="game__guess">
          <input
            className="game__input"
            type="text"
            placeholder="Song title or artist name..."
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isRevealed && handleReveal()}
            disabled={isRevealed}
          />

          {!isRevealed && (
            <button
              className="game__btn game__btn--reveal"
              onClick={handleReveal}
              disabled={isPlaying}
            >
              REVEAL
            </button>
          )}
        </div>
      )}

      {isRevealed && (
        <div className="game__result">
          <p
            className={`game__verdict ${
              isCorrect ? "game__verdict--correct" : "game__verdict--wrong"
            }`}
          >
            {isCorrect ? "✅ Correct!" : "❌ Not quite..."}
          </p>
          <p className="game__answer">
            <strong>{currentTrack.trackName}</strong> — {currentTrack.artistName}
          </p>
          <button className="game__btn game__btn--next" onClick={handleNextRound}>
            NEXT ROUND →
          </button>
        </div>
      )}
    </section>
  );
}

export default Game;
