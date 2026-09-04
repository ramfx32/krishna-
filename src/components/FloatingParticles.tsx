import { useMemo } from 'react';

/**
 * FloatingParticles — floating butterflies & flute musical notes.
 * Pure CSS animation, no JS per-frame work.
 */
export default function FloatingParticles({ count = 18 }: { count?: number }) {
  const particles = useMemo(() => {
    const types = ['🦋', '🎵', '🎶', '🪷', '✨'];
    return Array.from({ length: count }, (_, i) => {
      const type = types[i % types.length];
      const left = Math.random() * 100;
      const duration = 14 + Math.random() * 16;
      const delay = Math.random() * 12;
      const size = 16 + Math.random() * 22;
      const drift = (Math.random() - 0.5) * 120;
      const spin = (Math.random() - 0.5) * 540;
      const opacity = 0.4 + Math.random() * 0.4;
      return { type, left, duration, delay, size, drift, spin, opacity, id: i };
    });
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="float-particle"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            ['--drift' as string]: `${p.drift}px`,
            ['--spin' as string]: `${p.spin}deg`,
          }}
        >
          {p.type}
        </div>
      ))}
    </div>
  );
}
