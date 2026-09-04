import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { Heart, Send, BookOpen, Lock } from 'lucide-react';
import { supabase, supabaseOwner, GUESTBOOK_KEY } from '@/lib/supabase';

interface GuestEntry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function EternalFooter() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const [showOwnerLogin, setShowOwnerLogin] = useState(false);
  const [ownerKey, setOwnerKey] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [ownerError, setOwnerError] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const heartId = useRef(0);

  // When owner logs in, fetch entries from Supabase
  const fetchEntries = async () => {
    setLoadingEntries(true);
    try {
      const { data, error } = await supabaseOwner
        .from('guestbook_entries')
        .select('id, name, message, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch {
      setEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  };

  useEffect(() => {
    if (isOwner) fetchEntries();
  }, [isOwner]);

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerKey.trim().toLowerCase() === GUESTBOOK_KEY.toLowerCase()) {
      setIsOwner(true);
      setOwnerError(false);
      setShowOwnerLogin(false);
      setOwnerKey('');
    } else {
      setOwnerError(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    try {
      const { error } = await supabase
        .from('guestbook_entries')
        .insert({ name: name.trim(), message: message.trim() });

      if (error) throw error;

      setName('');
      setMessage('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);

      // If owner is logged in, refresh entries
      if (isOwner) fetchEntries();

      // Floating hearts
      const hearts = Array.from({ length: 8 }, () => ({
        id: heartId.current++,
        x: Math.random() * 100,
      }));
      setFloatingHearts(hearts);
      setTimeout(() => setFloatingHearts([]), 3000);
    } catch {
      setSubmitted(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen py-20 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #ff5e8a, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-full h-32" style={{ background: 'linear-gradient(to top, #060a1f, transparent)' }} />

      {/* Floating hearts */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-20 pointer-events-none"
          style={{
            left: `${h.x}%`,
            animation: 'note-float 3s ease-out forwards',
            ['--nx' as string]: `${(Math.random() - 0.5) * 80}px`,
            ['--nr' as string]: `${(Math.random() - 0.5) * 60}deg`,
          }}
        >
          <Heart className="w-6 h-6 text-rose-400" style={{ fill: '#ff5e8a', filter: 'drop-shadow(0 0 8px rgba(255,94,138,0.7))' }} />
        </div>
      ))}

      <div className="relative z-10 max-w-3xl mx-auto w-full text-center">
        <div className={`mb-10 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full glass-rose flex items-center justify-center heartbeat pulse-glow-rose">
              <Heart className="w-10 h-10 text-rose-300" style={{ fill: '#ff5e8a' }} />
            </div>
          </div>

          <p className="text-xs text-rose-300/70 tracking-[0.3em] uppercase mb-3">
            Eternal Vaaippukal
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-4">
            Namba Kaadhal Forever
          </h2>
          <p className="text-indigo-200/60 italic max-w-lg mx-auto">
            Radha Krishnanku eternal bandham mathiri, namba kaadhal time-a thaandi pogum.
            Namba divya guestbook-la oru note ezhuthu — oru vaazhthu, oru vaaippu, oru memory.
          </p>
        </div>

        {/* Guestbook form */}
        <div className={`glass-rose rounded-3xl p-6 md:p-8 mb-8 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-rose-300" />
            <h3 className="text-lg font-display font-semibold text-rose-200">Divya Guestbook</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Un peyar..."
              maxLength={50}
              className="w-full px-4 py-3 rounded-xl bg-midnight/50 border border-rose-400/20 text-amber-100 placeholder-indigo-300/40 outline-none focus:border-rose-400/50 focus:shadow-[0_0_15px_rgba(255,94,138,0.2)] transition-all font-display"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Un vaazhthu, vaaippu, illai memory ezhuthu..."
              rows={3}
              maxLength={300}
              className="w-full px-4 py-3 rounded-xl bg-midnight/50 border border-rose-400/20 text-amber-100 placeholder-indigo-300/40 outline-none focus:border-rose-400/50 focus:shadow-[0_0_15px_rgba(255,94,138,0.2)] transition-all font-display resize-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-display font-semibold text-midnight bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 hover:scale-[1.02] transition-transform shadow-[0_0_25px_rgba(255,94,138,0.35)] relative overflow-hidden btn-shine flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Kaadhalooda seal pannu
            </button>
            {submitted && (
              <p className="text-rose-200 text-sm glow-rose" style={{ animation: 'fade-in-up 0.4s ease' }}>
                Un note eternal-a save aagittu. 💖
              </p>
            )}
          </form>

          <p className="mt-4 text-xs text-indigo-300/40 italic">
            Un note safe-a save aagum. Owner mattum thaan padhippa mudiyum.
          </p>
        </div>

        {/* Owner login toggle */}
        {!isOwner && (
          <div className="mb-8">
            <button
              onClick={() => setShowOwnerLogin(!showOwnerLogin)}
              className="text-xs text-indigo-300/50 hover:text-amber-200/70 transition-colors flex items-center gap-1.5 mx-auto"
            >
              <Lock className="w-3.5 h-3.5" />
              Owner login (notes padha)
            </button>

            {showOwnerLogin && (
              <form onSubmit={handleOwnerLogin} className="mt-4 max-w-sm mx-auto">
                <input
                  type="password"
                  value={ownerKey}
                  onChange={(e) => { setOwnerKey(e.target.value); setOwnerError(false); }}
                  placeholder="Owner key..."
                  className="w-full px-4 py-2.5 rounded-xl bg-midnight/60 border border-amber-400/30 text-amber-200 placeholder-amber-200/30 outline-none focus:border-amber-400/60 transition-all text-center text-sm font-display"
                  style={{ color: '#ffe082' }}
                />
                {ownerError && (
                  <p className="text-rose-300 text-xs mt-2">Wrong key. Try again.</p>
                )}
                <button
                  type="submit"
                  className="mt-3 w-full py-2 rounded-xl glass-gold text-amber-200 text-sm font-display hover:scale-[1.02] transition-transform"
                >
                  Login
                </button>
              </form>
            )}
          </div>
        )}

        {/* Guestbook entries — only visible to owner */}
        {isOwner && (
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-xs text-amber-200/60 tracking-widest uppercase">Owner View — All Notes</span>
            </div>

            {loadingEntries && (
              <p className="text-indigo-200/50 text-sm italic">Loading...</p>
            )}

            {!loadingEntries && entries.length === 0 && (
              <p className="text-indigo-200/40 text-sm italic">Inga notes illai.</p>
            )}

            {entries.length > 0 && (
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <div
                    key={entry.id}
                    className="glass rounded-2xl p-5 text-left"
                    style={{ animation: `fade-in-up 0.5s ease ${i * 0.1}s both` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-display font-semibold text-amber-200">{entry.name}</p>
                      <span className="text-xs text-indigo-300/40">{formatDate(entry.created_at)}</span>
                    </div>
                    <p className="text-indigo-100/70 text-sm italic">{entry.message}</p>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setIsOwner(false)}
              className="mt-6 text-xs text-indigo-300/40 hover:text-rose-300/60 transition-colors"
            >
              Owner view exit pannu
            </button>
          </div>
        )}

        {/* Final footer */}
        <div className="glow-line mb-8" />
        <div className="text-center py-8">
          <p className="text-2xl md:text-3xl font-display shimmer-text mb-4">
            Happy Krishna Jayanthi
          </p>
          <p className="text-amber-200/60 italic mb-2">
            "Neengal enga irukka, angu en illam. Neengal sirippa, angu en vizha."
          </p>
          <p className="text-rose-200/50 text-sm">
            Eternal kaadhal-a seythathu — en Sita-kku, un Rama-vilirundu.
          </p>
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className="w-5 h-5 text-rose-400/60 heartbeat"
                style={{ fill: '#ff5e8a', animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
