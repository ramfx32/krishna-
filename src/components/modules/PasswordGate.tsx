import { useEffect, useRef, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';

const PASSWORD = 'Nee ennoda sita na unnoda ram';

interface Props {
  onUnlock: () => void;
}

export default function PasswordGate({ onUnlock }: Props) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; left: number; color: string; delay: number; dur: number }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD.toLowerCase()) {
      setUnlocked(true);
      // Generate confetti
      const colors = ['#f5c542', '#ffe082', '#00d4c8', '#5ff5ec', '#ff5e8a', '#ffb3c8', '#2a4ab8'];
      const pieces = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[i % colors.length],
        delay: Math.random() * 0.5,
        dur: 2.5 + Math.random() * 2,
      }));
      setConfetti(pieces);
      setTimeout(() => onUnlock(), 2200);
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setValue('');
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center animated-bg ${unlocked ? 'fading-out' : ''}`}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="confetti-piece"
          style={{
            left: `${c.left}%`,
            background: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.dur}s`,
            borderRadius: '2px',
          }}
        />
      ))}

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #00d4c8, transparent)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #ff5e8a, transparent)' }} />

      <div className={`relative z-10 w-full max-w-md mx-4 ${shaking ? 'shake' : ''}`}>
        <div className="glass-gold rounded-3xl p-8 md:p-10 text-center pulse-glow" style={{ background: 'rgba(245, 197, 66, 0.12)', border: '2px solid rgba(245, 197, 66, 0.4)' }}>
          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center glow-ring">
              <Lock className="w-9 h-9 text-amber-300" style={{ filter: 'drop-shadow(0 0 8px rgba(245,197,66,0.7))' }} />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold shimmer-text mb-2">
            Oru Divya Vaasal
          </h1>
          <p className="text-sm md:text-base text-indigo-200/70 mb-1 italic">
            Idhu oru divya rahasyam kaappadum idam.
          </p>
          <p className="text-xs text-amber-200/60 mb-6 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Ulle vara secret words solli thaa
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(false); }}
              placeholder="Secret words type pannu..."
              className={`w-full px-5 py-3.5 rounded-xl bg-midnight/80 border-2 text-center placeholder-amber-200/30 outline-none transition-all font-display tracking-wide ${
                error
                  ? 'border-rose-400/60 shadow-[0_0_20px_rgba(255,94,138,0.3)]'
                  : 'border-amber-400/50 focus:border-amber-400/80 focus:shadow-[0_0_20px_rgba(245,197,66,0.25)]'
              }`}
              style={{ color: '#ffe082' }}
              autoComplete="off"
            />
            {error && (
              <p className="text-rose-300 text-sm glow-rose">
                Idhu wrong. Maatikitta, try pannu again.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-display font-semibold text-midnight bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-300 transition-all shadow-[0_0_25px_rgba(245,197,66,0.4)] hover:shadow-[0_0_35px_rgba(245,197,66,0.6)] relative overflow-hidden btn-shine"
            >
              Divya Ulaga Ulle Poo
            </button>
          </form>

          <p className="mt-6 text-xs text-indigo-300/40 italic">
            "Kaadhal irukka idathil, thiravu angu irukku."
          </p>
        </div>
      </div>
    </div>
  );
}
