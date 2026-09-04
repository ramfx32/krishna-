import { useInView } from '@/hooks/useInView';
import { Heart, Star } from 'lucide-react';

const MILESTONES = [
  {
    title: 'Mudhalaai Parvai',
    text: 'Namba kaadchal serndha nodikkum, divya naan ketkatha prarthanai pathil kuduthutta mathiri therinjthu. Krishna Radha-vai Yamuna kadaikku pakka mathiri, en ullam unnai arinjthu ketta.',
    icon: '✨',
    color: 'gold',
  },
  {
    title: 'Mudhalaai Vaarthai',
    text: 'Un voice flute vida inimaiyana melody. Un solla ovvoru vaarthaium, naan en ullathil life time-kku sumandhu kolpa padhigam aachu.',
    icon: '🎵',
    color: 'peacock',
  },
  {
    title: 'Mudhalaai Vaaippu',
    text: 'Natchathiram niramayana vanathil, namble ovvoru mugathaiyum ovvoru pagalaiyum saerndu kolpom nu vaaippu koduthom. Rama Sita mathiri, namba bandham destiny-aale seal pannappattu.',
    icon: '🤝',
    color: 'rose',
  },
  {
    title: 'Mudhalaai Vizha',
    text: 'Namble mudhalaai Krishna Jayanthi saerndu kondom — kaiyil venna, manathil sirippu, ovvoru nodiyum thangaadha sothi mathiri kaadhal nirmitha.',
    icon: '🪈',
    color: 'gold',
  },
  {
    title: 'Appuram Ovvoru Naalum',
    text: 'Unudan ovvoru naalum oru vizha. Neengal en Janmashtami, en kaadhal vizha, en divya aasirvadam. Ovvoru naalaiyum, naan unnai thirumbavum choose pannuren.',
    icon: '💜',
    color: 'rose',
  },
];

export default function MemoryTimeline() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section ref={ref} className="relative min-h-screen py-20 px-6 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, #2a4ab8, transparent)' }} />

      <div className="relative z-10 max-w-3xl mx-auto">
        <div className={`text-center mb-16 ${inView ? 'reveal in-view' : 'reveal'}`}>
          <p className="text-xs text-peacock-300/70 tracking-[0.3em] uppercase mb-3" style={{ color: '#5ff5ec' }}>
            Namba Divya Payanam
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold shimmer-text mb-4">
            Memory Timeline
          </h2>
          <p className="text-indigo-200/60 italic">
            Ovvoru milestone, namba kathaikkul oru padhigam.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-400/40 to-transparent" />

          {MILESTONES.map((m, i) => (
            <TimelineItem key={i} milestone={m} index={i} />
          ))}
        </div>

        {/* End cap */}
        <div className="flex justify-center mt-12">
          <div className="w-14 h-14 rounded-full glass-gold flex items-center justify-center pulse-glow">
            <Heart className="w-6 h-6 text-amber-300" style={{ fill: '#f5c542' }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineItem({
  milestone,
  index,
}: {
  milestone: { title: string; text: string; icon: string; color: string };
  index: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const isLeft = index % 2 === 0;

  const colorMap: Record<string, { glow: string; border: string; text: string }> = {
    gold: { glow: 'rgba(245,197,66,', border: 'border-amber-400/30', text: 'text-amber-200' },
    peacock: { glow: 'rgba(0,212,200,', border: 'border-teal-400/30', text: 'text-teal-200' },
    rose: { glow: 'rgba(255,94,138,', border: 'border-rose-400/30', text: 'text-rose-200' },
  };
  const c = colorMap[milestone.color] || colorMap.gold;

  return (
    <div
      ref={ref}
      className={`relative flex items-center mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
    >
      {/* Dot on the line */}
      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
        <div
          className="w-8 h-8 rounded-full glass flex items-center justify-center transition-all hover:scale-125"
          style={{ boxShadow: `0 0 15px ${c.glow}0.5)` }}
        >
          <Star className="w-4 h-4" style={{ color: c.glow + '1)' }} />
        </div>
      </div>

      {/* Card */}
      <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
        <div
          className={`glass rounded-2xl p-6 transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 ' + (isLeft ? 'md:-translate-x-8' : 'md:translate-x-8') + ' translate-y-4'} hover:scale-[1.03]`}
          style={{ border: `1px solid ${c.glow}0.15)` }}
        >
          {/* hover glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
            style={{ boxShadow: `0 0 30px ${c.glow}0.2)` }}
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{milestone.icon}</span>
            <h3 className={`text-xl font-display font-bold ${c.text}`}>{milestone.title}</h3>
          </div>
          <p className="text-indigo-100/70 text-sm md:text-base leading-relaxed italic">
            {milestone.text}
          </p>
        </div>
      </div>
      {/* Spacer for the other half */}
      <div className="hidden md:block w-1/2" />
    </div>
  );
}
