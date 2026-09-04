import { useRef, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { audioEngine } from '@/lib/audioEngine';

interface Props {
  onYes: () => void;
}

export default function ProposalHero({ onYes }: Props) {
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const heartId = useRef(0);

  const moveNo = () => {
    const maxX = 200;
    const maxY = 120;
    const x = (Math.random() - 0.5) * 2 * maxX;
    const y = (Math.random() - 0.5) * 2 * maxY;
    setNoPos({ x, y });
  };

  const handleYes = () => {
    if (yesClicked) return;
    setYesClicked(true);
    audioEngine.play();
    // Burst hearts
    const newHearts = Array.from({ length: 24 }, (_, i) => ({
      id: heartId.current++,
      x: (Math.random() - 0.5) * 400,
      y: -(Math.random() * 300 + 50),
      size: 20 + Math.random() * 30,
    }));
    setHearts(newHearts);
    setTimeout(() => onYes(), 2800);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Glow orbs */}
      <div className="absolute top-20 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #ff5e8a, transparent)' }} />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #00d4c8, transparent)' }} />

      {/* Floating hearts when yes clicked */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{
            transform: `translate(${h.x}px, ${h.y}px)`,
            transition: 'transform 2.5s cubic-bezier(0.16,1,0.3,1), opacity 2.5s ease-out',
            opacity: 0,
            animation: 'none',
          }}
        >
          <Heart
            className="text-rose-400"
            style={{
              width: h.size,
              height: h.size,
              fill: '#ff5e8a',
              filter: 'drop-shadow(0 0 10px rgba(255,94,138,0.8))',
            }}
          />
        </div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Small icon */}
        <div className="flex justify-center mb-6 float-soft">
          <div className="w-16 h-16 rounded-full glass-rose flex items-center justify-center pulse-glow-rose">
            <Heart className="w-7 h-7 text-rose-300" style={{ fill: '#ff5e8a' }} />
          </div>
        </div>

        <p className="text-amber-200/70 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-display">
          Krishna Janmashtami
        </p>

        <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 shimmer-text leading-tight">
          En Sita
          <br />Vaasiya?
        </h1>

        <p className="text-indigo-200/60 text-lg md:text-xl mb-10 italic font-display max-w-lg mx-auto">
          Rama avann Sita-a thedikitta mathiri, Krishna avann Radha-a theditta mathiri —
          naan unnai thedikitten. Ovvoru janmam, ovvoru yugam,
          en heart unnai mattum thaan choose pannum.
        </p>

        {!yesClicked ? (
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button
              onClick={handleYes}
              className="relative px-12 py-4 rounded-full font-display font-bold text-lg text-midnight bg-gradient-to-r from-amber-400 via-amber-300 to-rose-300 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,197,66,0.5)] overflow-hidden btn-shine"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ fill: '#060a1f' }} />
                Aam, en kaadhal
              </span>
            </button>
            <button
              ref={noBtnRef}
              onMouseEnter={moveNo}
              onTouchStart={moveNo}
              onClick={moveNo}
              style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
              className="no-btn-transition px-10 py-4 rounded-full font-display font-semibold text-lg text-indigo-200/70 glass border border-indigo-400/20 hover:text-rose-300 hover:border-rose-400/40"
            >
              Illa
            </button>
          </div>
        ) : (
          <div className="animate-[fade-in-up_1s_ease_forwards]">
            <p className="text-3xl md:text-4xl font-display glow-rose mb-4">
              En kaadhal, en ullam, en ellam.
            </p>
            <p className="text-amber-200/70 text-lg italic">
              Divya flute melody nambleya intha payanathula guide pannattum...
            </p>
            <div className="flex justify-center mt-6">
              <Sparkles className="w-8 h-8 text-amber-300 float-soft" style={{ filter: 'drop-shadow(0 0 10px rgba(245,197,66,0.7))' }} />
            </div>
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
        <span className="text-xs text-indigo-300/50 tracking-widest uppercase">Sroll panni thodangu</span>
        <div className="w-px h-12 bg-gradient-to-b from-amber-400/50 to-transparent" />
      </div>
    </section>
  );
}
