import { useEffect, useState } from 'react';
import { useInView } from '@/hooks/useInView';

const GREETING_LINES = [
  'Jai Shri Krishna, en kaadhal.',
  'Intha divya Janmashtami naalil,',
  'divya flute unnai peyar solkuthu.',
  'Neengal en Radha, en Sita, en ellam.',
  'Happy Krishna Jayanthi, en azhagi.',
];

export default function KrishnaWelcome() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (lineIdx >= GREETING_LINES.length) {
      setDone(true);
      return;
    }
    const fullLine = GREETING_LINES[lineIdx];
    if (charIdx <= fullLine.length) {
      const t = setTimeout(() => {
        setCurrentLine(fullLine.slice(0, charIdx));
        setCharIdx(charIdx + 1);
      }, 55);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, fullLine]);
        setCurrentLine('');
        setLineIdx(lineIdx + 1);
        setCharIdx(0);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [inView, lineIdx, charIdx]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #00d4c8, transparent)' }} />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />

      <div className="relative z-10 max-w-4xl w-full">
        {/* Animated flute & peacock feather */}
        <div className="flex justify-center items-center gap-8 md:gap-16 mb-12">
          {/* Peacock feather */}
          <div className="float-soft feather-shimmer">
            <PeacockFeather />
          </div>
          {/* Flute */}
          <div className="float-soft flute-wave" style={{ animationDelay: '1s' }}>
            <FluteSVG />
          </div>
        </div>

        {/* Greeting card */}
        <div className={`glass-gold rounded-3xl p-8 md:p-12 text-center ${inView ? 'reveal-scale in-view' : 'reveal-scale'}`}>
          <p className="text-xs md:text-sm text-peacock-300/70 tracking-[0.3em] uppercase mb-4" style={{ color: '#5ff5ec' }}>
            Sri Krishna Jayanthi
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-8">
            Oru Divya Varaverpugal
          </h2>

          <div className="space-y-3 min-h-[200px] md:min-h-[240px]">
            {displayedLines.map((line, i) => (
              <p
                key={i}
                className="text-lg md:text-xl text-amber-100/90 font-display italic"
                style={{ animation: 'fade-in-up 0.6s ease' }}
              >
                {line}
              </p>
            ))}
            {!done && (
              <p className="text-lg md:text-xl text-amber-100/90 font-display italic type-caret">
                {currentLine}
              </p>
            )}
          </div>

          {done && (
            <div className="mt-8" style={{ animation: 'fade-in-up 1s ease' }}>
              <div className="glow-line mx-auto max-w-xs mb-6" />
              <p className="text-sm text-indigo-200/50 italic">
                Namble kaadhalai ovvoru chapteraa pakkalaam...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PeacockFeather() {
  return (
    <svg width="80" height="120" viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Stem */}
      <path d="M40 120 Q40 80 40 40" stroke="#f5c542" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Feather eye */}
      <ellipse cx="40" cy="35" rx="22" ry="32" fill="#0a1130" opacity="0.7" />
      <ellipse cx="40" cy="35" rx="18" ry="28" fill="#00d4c8" opacity="0.5" />
      <ellipse cx="40" cy="35" rx="14" ry="22" fill="#1a2a6c" opacity="0.8" />
      <ellipse cx="40" cy="35" rx="9" ry="15" fill="#f5c542" opacity="0.7" />
      <ellipse cx="40" cy="33" rx="5" ry="9" fill="#060a1f" opacity="0.9" />
      {/* Feather barbs */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 40 + Math.cos(angle) * 22;
        const y1 = 35 + Math.sin(angle) * 30;
        const x2 = 40 + Math.cos(angle) * 35;
        const y2 = 35 + Math.sin(angle) * 45;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00d4c8" strokeWidth="1.5" opacity="0.4" />
        );
      })}
      {/* Side barbs going down the stem */}
      {[...Array(8)].map((_, i) => {
        const y = 55 + i * 7;
        return (
          <g key={i}>
            <path d={`M40 ${y} Q25 ${y + 3} 18 ${y + 8}`} stroke="#00d4c8" strokeWidth="1" opacity="0.3" fill="none" />
            <path d={`M40 ${y} Q55 ${y + 3} 62 ${y + 8}`} stroke="#00d4c8" strokeWidth="1" opacity="0.3" fill="none" />
          </g>
        );
      })}
    </svg>
  );
}

function FluteSVG() {
  return (
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flute body */}
      <rect x="5" y="14" width="110" height="12" rx="6" fill="url(#fluteGrad)" stroke="#f5c542" strokeWidth="1" opacity="0.9" />
      <defs>
        <linearGradient id="fluteGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B6914" />
          <stop offset="50%" stopColor="#D4A82C" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      {/* Holes */}
      {[20, 38, 56, 74, 92].map((x, i) => (
        <circle key={i} cx={x} cy="20" r="3" fill="#060a1f" stroke="#f5c542" strokeWidth="0.5" />
      ))}
      {/* Glow */}
      <rect x="5" y="14" width="110" height="12" rx="6" fill="none" stroke="#f5c542" strokeWidth="0.5" opacity="0.5" style={{ filter: 'drop-shadow(0 0 6px rgba(245,197,66,0.6))' }} />
    </svg>
  );
}
