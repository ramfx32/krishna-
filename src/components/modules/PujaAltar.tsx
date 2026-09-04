import { useRef, useState, useCallback } from 'react';
import { useInView } from '@/hooks/useInView';
import { audioEngine } from '@/lib/audioEngine';

interface Offering {
  id: string;
  emoji: string;
  name: string;
  message: string;
}

const OFFERINGS: Offering[] = [
  { id: 'butter', emoji: '🧈', name: 'Makhan', message: 'Pudhu Makhan kaadhalooda offer pannitten!' },
  { id: 'flower', emoji: '🌸', name: 'Poo', message: 'Oru azhagiya lotus en Krishnanku.' },
  { id: 'sweet', emoji: '🍮', name: 'Sweet', message: 'Sweet peda bhakti-a offer pannitten.' },
  { id: 'garland', emoji: '📿', name: 'Maalai', message: 'Oru manamulla maalai kaadhal-a.' },
  { id: 'flute', emoji: '🪈', name: 'Flute', message: 'Oru divya flute en kaadhalavanku.' },
  { id: 'peacock', emoji: '🦚', name: 'Feather', message: 'Oru peacock feather crown jewel.' },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function PujaAltar() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [offered, setOffered] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const notifTimeout = useRef<number | null>(null);
  const particleId = useRef(0);

  const handleOffer = useCallback((offering: Offering) => {
    if (offered.includes(offering.id)) return;
    setOffered((prev) => [...prev, offering.id]);

    setNotification(offering.message);
    if (notifTimeout.current) clearTimeout(notifTimeout.current);
    notifTimeout.current = window.setTimeout(() => setNotification(null), 3000);

    audioEngine.chirp(700 + Math.random() * 200);

    // Generate particle trail
    const colors = ['#f5c542', '#ffe082', '#00d4c8', '#ff5e8a', '#ffb3c8'];
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: particleId.current++,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 30,
      color: colors[i % colors.length],
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 1500);
  }, [offered]);

  return (
    <section ref={ref} className="relative min-h-screen py-20 px-6 overflow-hidden flex items-center">
      {/* Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #00d4c8, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center">
        <div className={`mb-10 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <p className="text-xs text-peacock-300/70 tracking-[0.3em] uppercase mb-3" style={{ color: '#5ff5ec' }}>
            Virtual Puja
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-4">
            Divyamana Offer Pannu
          </h2>
          <p className="text-indigo-200/60 italic">
            Ovvoru offering-ai click panni Krishnanku kaadhalooda present parru.
          </p>
        </div>

        {/* Altar */}
        <div className="relative glass-gold rounded-3xl p-8 md:p-12 overflow-hidden">
          {/* Krishna illustration area */}
          <div className="relative h-64 md:h-72 flex items-center justify-center mb-8">
            {/* Halo */}
            <div className="absolute w-48 h-48 rounded-full pulse-glow" style={{ background: 'radial-gradient(circle, rgba(245,197,66,0.15), transparent 70%)' }} />

            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: '8px',
                  height: '8px',
                  background: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  transform: `translate(${(Math.random() - 0.5) * 200}px, ${-(Math.random() * 150 + 50)}px)`,
                  opacity: 0,
                  transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1), opacity 1.4s ease-out',
                }}
              />
            ))}

            {/* Krishna SVG */}
            <KrishnaIllustration />

            {/* Offered items floating around */}
            {offered.map((id, i) => {
              const off = OFFERINGS.find((o) => o.id === id);
              if (!off) return null;
              const angle = (i / OFFERINGS.length) * Math.PI * 2;
              const radius = 130;
              return (
                <div
                  key={id}
                  className="absolute text-3xl float-soft"
                  style={{
                    left: `${50 + Math.cos(angle) * (radius / 3)}%`,
                    top: `${50 + Math.sin(angle) * (radius / 4)}%`,
                    animationDelay: `${i * 0.3}s`,
                    transform: 'translate(-50%, -50%)',
                    filter: 'drop-shadow(0 0 8px rgba(245,197,66,0.5))',
                  }}
                >
                  {off.emoji}
                </div>
              );
            })}
          </div>

          {/* Notification */}
          <div className="h-10 mb-6 flex items-center justify-center">
            {notification && (
              <div
                className="glass rounded-full px-6 py-2 text-amber-200 text-sm md:text-base glow-gold"
                style={{ animation: 'fade-in-up 0.4s ease' }}
              >
                {notification}
              </div>
            )}
          </div>

          {/* Offering buttons */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            {OFFERINGS.map((off) => {
              const isOffered = offered.includes(off.id);
              return (
                <button
                  key={off.id}
                  onClick={() => handleOffer(off)}
                  disabled={isOffered}
                  className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-2xl transition-all ${
                    isOffered
                      ? 'glass-gold opacity-60 cursor-default'
                      : 'glass hover:scale-110 hover:border-amber-400/40 cursor-pointer'
                  }`}
                  style={isOffered ? { boxShadow: '0 0 15px rgba(245,197,66,0.3)' } : {}}
                >
                  <span className={`text-3xl md:text-4xl ${isOffered ? '' : 'hover:scale-110'} transition-transform`}>
                    {off.emoji}
                  </span>
                  <span className="text-xs md:text-sm text-amber-100/70 font-display">{off.name}</span>
                </button>
              );
            })}
          </div>

          {offered.length === OFFERINGS.length && (
            <div className="mt-8 glass-rose rounded-2xl p-6" style={{ animation: 'fade-in-up 0.8s ease' }}>
              <p className="text-rose-200 text-lg italic glow-rose">
                Ellaa offerings-um receive aagittu. Krishna namba koodiyum eternal kaadhal-a aasirvikkiraar. 🙏
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function KrishnaIllustration() {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none" className="relative z-10 float-soft" style={{ filter: 'drop-shadow(0 0 20px rgba(245,197,66,0.3))' }}>
      <defs>
        <radialGradient id="haloGrad">
          <stop offset="0%" stopColor="#ffe082" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f5c542" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5fb3d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#2a8ab8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      {/* Halo */}
      <circle cx="80" cy="50" r="45" fill="url(#haloGrad)" />
      {/* Peacock feather crown */}
      <ellipse cx="80" cy="30" rx="30" ry="12" fill="#00d4c8" opacity="0.6" />
      <ellipse cx="65" cy="25" rx="8" ry="14" fill="#00d4c8" opacity="0.5" />
      <ellipse cx="95" cy="25" rx="8" ry="14" fill="#00d4c8" opacity="0.5" />
      <circle cx="65" cy="22" r="4" fill="#f5c542" opacity="0.7" />
      <circle cx="95" cy="22" r="4" fill="#f5c542" opacity="0.7" />
      {/* Face */}
      <ellipse cx="80" cy="55" rx="22" ry="26" fill="url(#skinGrad)" stroke="#f5c542" strokeWidth="0.5" opacity="0.7" />
      {/* Eyes (closed, serene) */}
      <path d="M68 50 Q72 53 76 50" stroke="#060a1f" strokeWidth="1.5" fill="none" />
      <path d="M84 50 Q88 53 92 50" stroke="#060a1f" strokeWidth="1.5" fill="none" />
      {/* Smile */}
      <path d="M72 65 Q80 70 88 65" stroke="#060a1f" strokeWidth="1.5" fill="none" />
      {/* Tilak */}
      <path d="M78 38 L82 38 L80 48 Z" fill="#f5c542" opacity="0.8" />
      {/* Body / dhoti */}
      <path d="M55 85 Q55 140 60 170 L100 170 Q105 140 105 85 Q90 80 80 80 Q70 80 55 85 Z" fill="#2a4ab8" opacity="0.6" stroke="#f5c542" strokeWidth="0.5" />
      {/* Gold belt */}
      <rect x="58" y="120" width="44" height="6" rx="3" fill="#f5c542" opacity="0.5" />
      {/* Flute */}
      <rect x="100" y="95" width="50" height="6" rx="3" fill="#D4A82C" opacity="0.7" stroke="#f5c542" strokeWidth="0.5" />
      <circle cx="110" cy="98" r="1.5" fill="#060a1f" />
      <circle cx="120" cy="98" r="1.5" fill="#060a1f" />
      <circle cx="130" cy="98" r="1.5" fill="#060a1f" />
      <circle cx="140" cy="98" r="1.5" fill="#060a1f" />
    </svg>
  );
}
