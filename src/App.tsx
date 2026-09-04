import { useState, useEffect } from 'react';
import FloatingParticles from '@/components/FloatingParticles';
import PasswordGate from '@/components/modules/PasswordGate';
import ProposalHero from '@/components/modules/ProposalHero';
import KrishnaWelcome from '@/components/modules/KrishnaWelcome';
import MemoryTimeline from '@/components/modules/MemoryTimeline';
import DahiHandiGame from '@/components/modules/DahiHandiGame';
import PujaAltar from '@/components/modules/PujaAltar';
import LoveLetter from '@/components/modules/LoveLetter';
import EternalFooter from '@/components/modules/EternalFooter';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [proposalAccepted, setProposalAccepted] = useState(false);

  // Lock body scroll until unlocked
  useEffect(() => {
    document.body.style.overflow = unlocked ? 'auto' : 'hidden';
  }, [unlocked]);

  return (
    <div className="relative min-h-screen animated-bg overflow-x-hidden">
      {/* Password gate */}
      {!unlocked && <PasswordGate onUnlock={() => setUnlocked(true)} />}

      {/* Main content */}
      {unlocked && (
        <>
          <FloatingParticles count={20} />

          {/* Module 2: Proposal Hero */}
          <ProposalHero onYes={() => setProposalAccepted(true)} />

          {/* Glow divider */}
          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 3: Krishna Welcome */}
          <KrishnaWelcome />

          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 4: Memory Timeline */}
          <MemoryTimeline />

          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 5: Dahi Handi Game */}
          <DahiHandiGame />

          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 6: Puja Altar */}
          <PujaAltar />

          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 7: Love Letter + Music Player */}
          <LoveLetter />

          <div className="glow-line max-w-2xl mx-auto" />

          {/* Module 8: Eternal Footer + Guestbook */}
          <EternalFooter />
        </>
      )}
    </div>
  );
}
