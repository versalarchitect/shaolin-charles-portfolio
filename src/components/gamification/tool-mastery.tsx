import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Wrench } from 'lucide-react';
import { getToolMastery, useProgress } from '@/stores/progress';

const LEVEL_COLORS: Record<string, string> = {
  Expert: 'text-foreground/90',
  Proficient: 'text-foreground/70',
  Intermediate: 'text-foreground/50',
  Beginner: 'text-foreground/30',
};

export function ToolMastery() {
  useProgress();
  const { t } = useTranslation();
  const tools = getToolMastery();

  if (tools.length === 0) {
    return (
      <div className="space-y-3">
        <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
          {t('toolMastery.title')}
        </h2>
        <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] p-6 text-center">
          <Wrench className="w-6 h-6 mx-auto mb-2 text-foreground/15" />
          <p className="text-xs text-foreground/30 font-mono">
            {t('toolMastery.empty')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-mono uppercase tracking-wider text-foreground/40">
        {t('toolMastery.title')}
      </h2>
      <div className="rounded-xl border border-foreground/[0.08] bg-foreground/[0.02] overflow-hidden">
        {tools.slice(0, 8).map((t, i) => (
          <div
            key={t.tool}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-foreground/[0.04] last:border-b-0"
          >
            <span className="text-xs font-mono text-foreground/30 w-4">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground/80 truncate">{t.tool}</span>
                <span className={`text-[10px] font-mono ${LEVEL_COLORS[t.level]}`}>{t.level}</span>
              </div>
              <div className="h-1 rounded-full bg-foreground/[0.06] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-foreground/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (t.xp / 200) * 100)}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-foreground/30 shrink-0">{t.xp} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}
