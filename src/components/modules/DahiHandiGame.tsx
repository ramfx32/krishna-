import { useRef, useState, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { audioEngine } from '@/lib/audioEngine';
import { Heart } from 'lucide-react';

const MAX_HITS = 8;

interface Burst {
  id: number;
  x: number;
  y: number;
  particles: { dx: number; dy: number; color: string; size: number }[];
}

export default function DahiHandiGame() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hits, setHits] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [broken, setBroken] = useState(false);
  const burstId = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (broken) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const colors = ['#f5c542', '#ffe082', '#00d4c8', '#ff5e8a', '#ffb3c8', '#D4A82C'];
    const particles = Array.from({ length: 14 }, () => ({
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 200 - 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 10,
    }));

    const id = burstId.current++;
    setBursts((prev) => [...prev, { id, x, y, particles }]);
    setTimeout(() => setBursts((prev) => prev.filter((b) => b.id !== id)), 900);

    setShaking(true);
    setTimeout(() => setShaking(false), 400);

    audioEngine.chirp(600 + hits * 60);

    const newHits = hits + 1;
    setHits(newHits);

    if (newHits >= MAX_HITS) {
      setTimeout(() => {
        setBroken(true);
        audioEngine.chirp(1046.5);
      }, 300);
    }
  }, [hits, broken]);

  const reset = () => {
    setHits(0);
    setBroken(false);
    setBursts([]);
  };

  const crackLevel = Math.min(hits / MAX_HITS, 1);

  return (
    <section ref={ref} className="relative min-h-screen py-20 px-6 overflow-hidden flex items-center">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #ff5e8a, transparent)' }} />

      <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
        <div className={`mb-10 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <p className="text-xs text-amber-200/70 tracking-[0.3em] uppercase mb-3">
            Dahi Handi
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-4">
            Divya Chattiya Odaichu
          </h2>
          <p className="text-indigo-200/60 italic">
            Thongum chattiya click panni odaichu, ullirulla hidden message paaru.
          </p>
        </div>

        {/* Game area */}
        <div className="relative h-[420px] flex items-center justify-center glass rounded-3xl overflow-hidden">
          {/* Rope */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-amber-400/60 to-amber-600/40" />

          {!broken ? (
            <div
              onClick={handleClick}
              className={`relative cursor-pointer sway ${shaking ? 'shake' : ''} group`}
              style={{ transformOrigin: 'top center' }}
            >
              {/* Pot SVG */}
              <svg width="140" height="160" viewBox="0 0 140 160" fill="none" className="transition-transform group-hover:scale-105">
                <defs>
                  <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D4A82C" />
                    <stop offset="50%" stopColor="#8B6914" />
                    <stop offset="100%" stopColor="#5C4400" />
                  </linearGradient>
                </defs>
                {/* Pot body */}
                <ellipse cx="70" cy="85" rx="55" ry="65" fill="url(#potGrad)" stroke="#f5c542" strokeWidth="1.5" opacity="0.9" />
                {/* Neck */}
                <rect x="45" y="20" width="50" height="20" rx="4" fill="#8B6914" stroke="#f5c542" strokeWidth="1" opacity="0.9" />
                {/* Rim */}
                <ellipse cx="70" cy="20" rx="28" ry="6" fill="#D4A82C" stroke="#f5c542" strokeWidth="1" />
                {/* Butter/curd inside */}
                <ellipse cx="70" cy="20" rx="24" ry="4" fill="#fff8e7" opacity="0.8" />
                {/* Cracks */}
                {crackLevel > 0 && (
                  <g stroke="#060a1f" strokeWidth="1.5" opacity={0.4 + crackLevel * 0.4} fill="none">
                    {hits >= 2 && <path d="M40 60 L55 80 L45 100" />}
                    {hits >= 3 && <path d="M100 50 L85 75 L95 95" />}
                    {hits >= 4 && <path d="M70 30 L60 60 L75 90 L65 120" />}
                    {hits >= 5 && <path d="M35 90 L60 100 L50 130" />}
                    {hits >= 6 && <path d="M105 80 L85 100 L100 130" />}
                    {hits >= 7 && <path d="M55 50 L70 70 L60 110" />}
                  </g>
                )}
                {/* Glow */}
                <ellipse cx="70" cy="85" rx="55" ry="65" fill="none" stroke="#f5c542" strokeWidth="0.5" opacity="0.3" style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,66,0.4))' }} />
              </svg>

              {/* Burst particles */}
              {bursts.map((b) => (
                <div key={b.id} className="absolute inset-0 pointer-events-none">
                  {b.particles.map((p, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        left: `${b.x}px`,
                        top: `${b.y}px`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        background: p.color,
                        transform: `translate(${p.dx}px, ${p.dy}px)`,
                        opacity: 0,
                        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease-out',
                        boxShadow: `0 0 8px ${p.color}`,
                      }}
                    />
                  ))}
                </div>
              ))}

              {/* Hit counter */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-amber-200/60 whitespace-nowrap">
                {hits} / {MAX_HITS} hits
              </div>
            </div>
          ) : (
            <div className="px-8 max-w-lg" style={{ animation: 'fade-in-up 0.8s ease' }}>
              {/* Broken pot pieces */}
              <div className="flex justify-center gap-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-6 rounded-b-full"
                    style={{
                      background: '#8B6914',
                      opacity: 0.5,
                      transform: `rotate(${(i - 2) * 20}deg) translateY(${Math.abs(i - 2) * 10}px)`,
                    }}
                  />
                ))}
              </div>
              <div className="glass-gold rounded-2xl p-6 md:p-8">
                <Heart className="w-8 h-8 text-rose-300 mx-auto mb-4 heartbeat" style={{ fill: '#ff5e8a' }} />
                <h3 className="text-2xl font-display font-bold glow-gold mb-3">
                  Chatti Odaichu Pochu!
                </h3>
                <p className="text-amber-100/80 text-base md:text-lg italic leading-relaxed">
                  Krishna Dahi Handi-a odaichi sweet butter-a edukka mathiri,
                  nee en heart-ulla irukka ovvoru wall-aiyum odaichitta.
                  Ullirulla tholpam nee mattum thaan — en sweetest reward,
                  en makhan, en kaadhal. Neengal en ullathula ovvoru chattiyum sweetness-a.
                </p>
              </div>
              <button
                onClick={reset}
                className="mt-6 px-6 py-2.5 rounded-full glass border border-amber-400/30 text-amber-200 hover:border-amber-400/60 transition-all text-sm"
              >
                Maatikitta maati parru
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
