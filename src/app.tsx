import { useState, useRef, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import confetti from "canvas-confetti";

const noMessages = [
  "Are you sure? 🥺",
  "Think again 💭",
  "Don't do this 💔",
  "Pleaseeee 😭",
  "I’ll cry...",
  "Last chance 😢"
];

const aiLoveLines = [
  "Even the stars paused when you clicked Yes ✨",
  "This moment is now my favorite memory 💞",
  "The universe just shipped us together 🌌",
  "Plot twist: This was destiny all along 💘"
];

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [noIndex, setNoIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [loveMsg, setLoveMsg] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const particlesInit = async (main: any) => {
    await loadFull(main);
  };

  const moveNoButton = () => {
    const x = Math.random() * 300 - 150;
    const y = Math.random() * 200 - 100;
    setNoPos({ x, y });
    setNoIndex((prev) => (prev + 1) % noMessages.length);
  };

  const fireEffects = () => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
  };

  const handleYes = () => {
    setAccepted(true);
    audioRef.current?.play();
    fireEffects();

    const line =
      aiLoveLines[Math.floor(Math.random() * aiLoveLines.length)];
    setLoveMsg(`Parie, ${line}`);
  };

  useEffect(() => {
    let lastX: number | null = null;

    const handleMotion = (e: DeviceMotionEvent) => {
      if (!e.accelerationIncludingGravity) return;
      const x = e.accelerationIncludingGravity.x;
      if (lastX !== null && Math.abs(x! - lastX) > 15) {
        confetti({ particleCount: 80, spread: 70 });
      }
      lastX = x;
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, []);

  if (accepted) {
    return (
      <div className="container">
        <Particles
          init={particlesInit}
          options={{
            particles: {
              number: { value: 40 },
              shape: { type: "heart" },
              size: { value: 8 },
              move: { enable: true, speed: 2 }
            }
          }}
        />
        <h1 className="yes-text">YAY Parie!! 💖</h1>
        <img
          src="https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif"
          className="gif"
        />
        <p className="love-msg">{loveMsg}</p>
        <audio ref={audioRef} src="/love.mp3" />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Parie, will you be my Valentine? 💘</h1>
      <div className="buttons">
        <button className="yes-btn" onClick={handleYes}>Yes 😍</button>
        <button
          className="no-btn"
          onMouseEnter={moveNoButton}
          style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
        >
          {noMessages[noIndex]}
        </button>
      </div>
    </div>
  );
}
