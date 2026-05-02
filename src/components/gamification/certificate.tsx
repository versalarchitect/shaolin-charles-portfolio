import { motion } from 'framer-motion';
import { Award, Calendar, Clock, Zap } from 'lucide-react';
import { CURRICULUM } from '@/data/curriculum';
import { useProgress } from '@/stores/progress';

interface CertificateProps {
  tierId: string;
}

export function Certificate({ tierId }: CertificateProps) {
  const progress = useProgress();
  const tier = CURRICULUM.find((t) => t.id === tierId);
  if (!tier) return null;

  const isComplete = tier.lessons.every(
    (l) => progress.lessonProgress[l.id]?.status === 'completed',
  );
  if (!isComplete) return null;

  const completionDate = tier.lessons
    .map((l) => progress.lessonProgress[l.id]?.completedAt)
    .filter(Boolean)
    .sort()
    .pop();

  const totalXp = tier.lessons.reduce(
    (sum, l) => sum + (progress.lessonProgress[l.id]?.xpEarned || 0),
    0,
  );

  return (
    <motion.div
      className="rounded-2xl border-2 border-foreground/10 bg-foreground/[0.02] p-8 text-center relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-foreground/10 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-foreground/10 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-foreground/10 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-foreground/10 rounded-br-lg" />

      <Award className="w-12 h-12 mx-auto mb-4 text-foreground/60" />
      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40 mb-2">
        Certificate of Completion
      </p>
      <h3 className="text-2xl font-bold mb-1">
        {tier.id === 'prework' ? 'Prework' : `Tier ${tier.number}`}
      </h3>
      <p className="text-lg text-foreground/70 mb-6">{tier.name}</p>

      <div className="flex justify-center gap-6 text-xs font-mono text-foreground/40">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {completionDate ? new Date(completionDate).toLocaleDateString() : '--'}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {tier.hours}h course
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          {totalXp} XP earned
        </span>
      </div>

      <div className="mt-6 pt-4 border-t border-foreground/[0.06]">
        <p className="text-[10px] font-mono text-foreground/25">
          The Agentic SaaS Course -- charlesjackson.dev
        </p>
      </div>
    </motion.div>
  );
}
