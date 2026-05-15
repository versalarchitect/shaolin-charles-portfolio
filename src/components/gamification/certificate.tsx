import { motion } from 'motion/react';
import { Award, Download, Lock, Share2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ALL_LESSONS } from '@/data/curriculum';
import { useAuth } from '@/hooks/use-auth';
import {
  type CertificateData,
  downloadCertificate,
  generateCertificate,
} from '@/lib/certificate-generator';
import { getLevel, getOverallProgress, useProgress } from '@/stores/progress';

export function Certificate() {
  const { t } = useTranslation();
  const progress = useProgress();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const [previewRendered, setPreviewRendered] = useState(false);

  const overall = getOverallProgress();
  const isComplete = overall.percent === 100;
  const remaining = overall.total - overall.completed;

  const getCertificateData = useCallback((): CertificateData => {
    const level = getLevel();

    // Find the latest completion date
    const completionDates = Object.values(progress.lessonProgress)
      .map((p) => p.completedAt)
      .filter(Boolean)
      .sort();
    const lastDate = completionDates[completionDates.length - 1];
    const formattedDate = lastDate
      ? new Date(lastDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    const displayName =
      user?.user_metadata?.display_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Student';

    return {
      displayName,
      completionDate: formattedDate,
      totalXp: progress.totalXp,
      rank: level.name,
      lessonsCompleted: ALL_LESSONS.length,
      achievementsEarned: progress.unlockedAchievements.length,
    };
  }, [progress, user]);

  // Render preview to visible canvas
  useEffect(() => {
    if (!isComplete || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = getCertificateData();

    // Generate full-size offscreen, then draw scaled onto preview
    generateCertificate(data).then((blob) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        canvas.width = canvas.offsetWidth * window.devicePixelRatio;
        canvas.height = canvas.offsetHeight * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight);
        URL.revokeObjectURL(url);
        setPreviewRendered(true);
      };
      img.src = url;
    });
  }, [isComplete, getCertificateData]);

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const data = getCertificateData();
      const blob = await generateCertificate(data);
      downloadCertificate(blob);
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    setGenerating(true);
    try {
      const data = getCertificateData();
      const blob = await generateCertificate(data);
      const file = new File([blob], 'certificate.png', { type: 'image/png' });
      const shareData = {
        title: t('certificate.pdfTitle'),
        text: `I completed The Agentic SaaS Course with ${data.totalXp.toLocaleString()} XP!`,
        files: [file],
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        } catch {
          // Final fallback: download
          downloadCertificate(blob);
        }
      }
    } finally {
      setGenerating(false);
    }
  };

  // Locked state
  if (!isComplete) {
    return (
      <motion.div
        className="rounded-2xl border border-foreground/[0.08] bg-foreground/[0.02] p-8 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Lock className="w-10 h-10 mx-auto mb-4 text-foreground/20" />
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/30 mb-2">
          {t('certificate.locked')}
        </p>
        <p className="text-sm text-foreground/50 mb-4">
          {t('certificate.completeToUnlock', { remaining })}
        </p>
        <div className="relative h-1.5 rounded-full bg-foreground/[0.05] overflow-hidden max-w-xs mx-auto">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-foreground/15"
            initial={{ width: 0 }}
            animate={{ width: `${overall.percent}%` }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          />
        </div>
        <p className="text-[10px] font-mono text-foreground/25 mt-2">{overall.percent}% complete</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rounded-2xl border-2 border-foreground/10 bg-foreground/[0.02] p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
    >
      {/* Decorative corners */}
      <motion.div
        className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-foreground/10 rounded-tl-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-foreground/10 rounded-tr-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      />
      <motion.div
        className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-foreground/10 rounded-bl-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-foreground/10 rounded-br-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />

      {/* Header */}
      <div className="text-center mb-4">
        <Award className="w-8 h-8 mx-auto mb-2 text-foreground/60" />
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40">
          {t('certificate.title')}
        </p>
      </div>

      {/* Canvas preview */}
      <motion.div
        className="relative rounded-lg overflow-hidden border border-foreground/[0.08] mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: previewRendered ? 1 : 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <canvas
          ref={canvasRef}
          className="w-full"
          style={{ aspectRatio: '1600 / 1000', display: 'block' }}
        />
        {!previewRendered && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.02]">
            <p className="text-xs font-mono text-foreground/30">{t('certificate.generating')}</p>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground/10 hover:bg-foreground/15 border border-foreground/10 hover:border-foreground/20 text-sm font-mono text-foreground/80 hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {t('certificate.download')}
        </button>
        <button
          onClick={handleShare}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground/[0.05] hover:bg-foreground/10 border border-foreground/[0.08] hover:border-foreground/15 text-sm font-mono text-foreground/60 hover:text-foreground/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          {t('certificate.share')}
        </button>
      </div>
    </motion.div>
  );
}
