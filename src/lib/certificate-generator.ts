export interface CertificateData {
  displayName: string;
  completionDate: string;
  totalXp: number;
  rank: string;
  lessonsCompleted: number;
  achievementsEarned: number;
}

const CERT_WIDTH = 1600;
const CERT_HEIGHT = 1000;

const COLORS = {
  bg: '#0a0a0a',
  frame: 'rgba(255, 255, 255, 0.12)',
  accent: 'rgba(255, 255, 255, 0.06)',
  muted: 'rgba(255, 255, 255, 0.4)',
  subtle: 'rgba(255, 255, 255, 0.6)',
  text: 'rgba(255, 255, 255, 0.9)',
  white: '#ffffff',
};

function drawFrame(ctx: CanvasRenderingContext2D) {
  const margin = 40;
  const cornerLen = 60;

  // Outer border rectangle
  ctx.strokeStyle = COLORS.frame;
  ctx.lineWidth = 1;
  ctx.strokeRect(margin, margin, CERT_WIDTH - margin * 2, CERT_HEIGHT - margin * 2);

  // Inner border rectangle (subtle double-line effect)
  ctx.strokeStyle = COLORS.accent;
  ctx.strokeRect(
    margin + 8,
    margin + 8,
    CERT_WIDTH - (margin + 8) * 2,
    CERT_HEIGHT - (margin + 8) * 2,
  );

  // Corner accents (L-shaped lines)
  ctx.strokeStyle = COLORS.muted;
  ctx.lineWidth = 2;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(margin - 4, margin + cornerLen);
  ctx.lineTo(margin - 4, margin - 4);
  ctx.lineTo(margin + cornerLen, margin - 4);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(CERT_WIDTH - margin - cornerLen, margin - 4);
  ctx.lineTo(CERT_WIDTH - margin + 4, margin - 4);
  ctx.lineTo(CERT_WIDTH - margin + 4, margin + cornerLen);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(margin - 4, CERT_HEIGHT - margin - cornerLen);
  ctx.lineTo(margin - 4, CERT_HEIGHT - margin + 4);
  ctx.lineTo(margin + cornerLen, CERT_HEIGHT - margin + 4);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(CERT_WIDTH - margin - cornerLen, CERT_HEIGHT - margin + 4);
  ctx.lineTo(CERT_WIDTH - margin + 4, CERT_HEIGHT - margin + 4);
  ctx.lineTo(CERT_WIDTH - margin + 4, CERT_HEIGHT - margin - cornerLen);
  ctx.stroke();
}

function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
  ctx.lineWidth = 1;

  const spacing = 100;
  for (let x = spacing; x < CERT_WIDTH; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CERT_HEIGHT);
    ctx.stroke();
  }
  for (let y = spacing; y < CERT_HEIGHT; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CERT_WIDTH, y);
    ctx.stroke();
  }
}

export async function generateCertificate(data: CertificateData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = CERT_WIDTH;
  canvas.height = CERT_HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, CERT_WIDTH, CERT_HEIGHT);

  // Subtle grid
  drawGrid(ctx);

  // Frame
  drawFrame(ctx);

  // "CERTIFICATE OF COMPLETION" - top center
  ctx.font = '13px "Geist Mono", "SF Mono", "Fira Code", monospace';
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '4px';
  ctx.fillText('CERTIFICATE OF COMPLETION', CERT_WIDTH / 2, 100);
  ctx.letterSpacing = '0px';

  // Decorative line under header
  const headerLineY = 130;
  const lineGradient = ctx.createLinearGradient(
    CERT_WIDTH / 2 - 200,
    headerLineY,
    CERT_WIDTH / 2 + 200,
    headerLineY,
  );
  lineGradient.addColorStop(0, 'transparent');
  lineGradient.addColorStop(0.3, COLORS.frame);
  lineGradient.addColorStop(0.7, COLORS.frame);
  lineGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = lineGradient;
  ctx.fillRect(CERT_WIDTH / 2 - 200, headerLineY, 400, 1);

  // User's display name - large serif-style
  ctx.font = 'bold 72px Georgia, "Times New Roman", serif';
  ctx.fillStyle = COLORS.white;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.displayName, CERT_WIDTH / 2, 280);

  // "has successfully completed"
  ctx.font = '18px "Geist", system-ui, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.fillText('has successfully completed', CERT_WIDTH / 2, 350);

  // Course title
  ctx.font = 'bold 36px "Geist", system-ui, sans-serif';
  ctx.fillStyle = COLORS.text;
  ctx.fillText('The Agentic SaaS Course', CERT_WIDTH / 2, 430);

  // Subtitle
  ctx.font = '20px "Geist", system-ui, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.fillText('Multi-Agent Orchestration from First Principles', CERT_WIDTH / 2, 480);

  // Decorative separator
  const sepY = 540;
  const sepGradient = ctx.createLinearGradient(
    CERT_WIDTH / 2 - 300,
    sepY,
    CERT_WIDTH / 2 + 300,
    sepY,
  );
  sepGradient.addColorStop(0, 'transparent');
  sepGradient.addColorStop(0.2, COLORS.accent);
  sepGradient.addColorStop(0.8, COLORS.accent);
  sepGradient.addColorStop(1, 'transparent');
  ctx.fillStyle = sepGradient;
  ctx.fillRect(CERT_WIDTH / 2 - 300, sepY, 600, 1);

  // Stats line
  ctx.font = '16px "Geist Mono", "SF Mono", "Fira Code", monospace';
  ctx.fillStyle = COLORS.muted;
  ctx.fillText(
    `${data.lessonsCompleted} Lessons  ·  ${data.totalXp.toLocaleString()} XP  ·  ${data.rank} Rank`,
    CERT_WIDTH / 2,
    600,
  );

  // Completion date
  ctx.font = '16px "Geist", system-ui, sans-serif';
  ctx.fillStyle = COLORS.subtle;
  ctx.fillText(`Completed on ${data.completionDate}`, CERT_WIDTH / 2, 650);

  // Bottom-left: site URL
  ctx.font = '14px "Geist Mono", "SF Mono", "Fira Code", monospace';
  ctx.fillStyle = COLORS.muted;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('charlesjackson.dev', 80, CERT_HEIGHT - 70);

  // Bottom-right: instructor
  ctx.textAlign = 'right';
  ctx.fillText('Charles Jackson, Instructor', CERT_WIDTH - 80, CERT_HEIGHT - 70);

  // Bottom center: achievements note
  ctx.textAlign = 'center';
  ctx.font = '13px "Geist Mono", "SF Mono", "Fira Code", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.fillText(`${data.achievementsEarned} achievements earned`, CERT_WIDTH / 2, CERT_HEIGHT - 70);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to generate certificate image'));
    }, 'image/png');
  });
}

export function downloadCertificate(blob: Blob): void {
  const date = new Date().toISOString().split('T')[0];
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `agentic-saas-certificate-${date}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
