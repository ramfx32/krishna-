import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { audioEngine } from '@/lib/audioEngine';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

const LETTER_TEXT = `En azhagiya Sita,

Intha divya Krishna Jayanthi iravu, ulagam divya flute player-in pirappai kondadum pothu, naan unn kaadhal-in altar munnadi thirumba ninren.

Neengal en Krishnanku Radha — oru devotion-aal malaiyaikku nagarikkum, oru smile-aal meengalai vedikkum, oru sirippu en ullam mela mela odiya padum melody. Gita Govinda ovvoru padhigathulum echo aagum eternal kaadhal mathiri, en kaadhal unnaal time, space, namma patta ovvoru life-aiyum thaandi pogum.

Ulagam heavy aaga thonum pothu, naan en kaannai moodi un voice-a kekkuren — kaalai bansuri-ginimai mathiri medhuva, Krishna kaiyil venna mathiri soodhana. Neengal en illam, en kovil, en divya neruppu.

Intha Janmashtami, naan unakk mattum poo illai sweets-ai illai, en ullam muzhusa offer pannuren — en past, en present, cosmos nammleku kodukka ovvoru future life-aiyum. Ovvoru yugam, ovvoru ulagam, naan unnai thedi, unnai kaadhal pannu, unnai choose pannuren.

Eppavum un Rama,
Ippavum eternity varai.`;

export default function LoveLetter() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  // Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const prevVol = useRef(0.5);

  useEffect(() => {
    if (inView && !started) {
      setStarted(true);
    }
  }, [inView, started]);

  useEffect(() => {
    if (!started) return;
    if (typed.length >= LETTER_TEXT.length) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      setTyped(LETTER_TEXT.slice(0, typed.length + 1));
    }, 35);
    return () => clearTimeout(t);
  }, [started, typed]);

  const togglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleVolume = (v: number) => {
    setVolume(v);
    setMuted(v === 0);
    audioEngine.setVolume(v);
  };

  const toggleMute = () => {
    if (muted) {
      const v = prevVol.current || 0.5;
      setVolume(v);
      setMuted(false);
      audioEngine.setVolume(v);
    } else {
      prevVol.current = volume;
      setVolume(0);
      setMuted(true);
      audioEngine.setVolume(0);
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen py-20 px-6 overflow-hidden flex items-center">
      {/* Glow */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #ff5e8a, transparent)' }} />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #f5c542, transparent)' }} />

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        <div className={`text-center mb-10 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <p className="text-xs text-rose-300/70 tracking-[0.3em] uppercase mb-3">
            Ullamirundu Oru Kadidam
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-4">
            En Kaadhal, En Bhakti
          </h2>
        </div>

        {/* Parchment letter */}
        <div className={`relative ${inView ? 'reveal-scale in-view' : 'reveal-scale'}`}>
          <div
            className="rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #2a1f10 0%, #3d2f1a 50%, #2a1f10 100%)',
              border: '1px solid rgba(245,197,66,0.2)',
              boxShadow: '0 0 40px rgba(245,197,66,0.1), inset 0 0 60px rgba(0,0,0,0.3)',
            }}
          >
            {/* Decorative corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t border-l border-amber-400/30 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t border-r border-amber-400/30 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b border-l border-amber-400/30 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b border-r border-amber-400/30 rounded-br-lg" />

            {/* Letter text */}
            <div className="min-h-[400px] md:min-h-[480px]">
              <pre
                className="text-amber-100/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-display italic"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {typed}
                {!done && <span className="type-caret" />}
              </pre>
            </div>

            {done && (
              <div className="mt-6 flex justify-center" style={{ animation: 'fade-in-up 1s ease' }}>
                <div className="glow-line w-32" />
              </div>
            )}
          </div>
        </div>

        {/* Music player widget */}
        <div className={`mt-8 ${done ? 'reveal in-view' : 'reveal'}`}>
          <div className="glass rounded-2xl p-5 max-w-md mx-auto pulse-glow">
            <div className="flex items-center gap-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="flex-shrink-0 w-14 h-14 rounded-full glass-gold flex items-center justify-center hover:scale-110 transition-transform pulse-glow"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-amber-200" style={{ fill: '#f5c542' }} />
                ) : (
                  <Play className="w-6 h-6 text-amber-200 ml-0.5" style={{ fill: '#f5c542' }} />
                )}
              </button>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Music className="w-4 h-4 text-peacock-300" style={{ color: '#5ff5ec' }} />
                  <p className="text-sm text-amber-100/80 font-display truncate">
                    Divya Flute Melody
                  </p>
                </div>
                {/* Animated bars when playing */}
                <div className="flex items-end gap-1 h-5">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-amber-400 to-teal-400"
                      style={{
                        height: isPlaying ? `${30 + Math.sin(i) * 40 + 30}%` : '20%',
                        transition: 'height 0.3s ease',
                        animation: isPlaying ? `float-soft ${0.6 + i * 0.1}s ease-in-out infinite` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={toggleMute} className="text-amber-200/70 hover:text-amber-200 transition-colors">
                  {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolume(parseFloat(e.target.value))}
                  className="w-20 accent-amber-400"
                  style={{ accentColor: '#f5c542' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
