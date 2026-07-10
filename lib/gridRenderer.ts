/* ============================================
   GridRenderer — logica griglia condivisa
   Usata da GridCanvas (sfondo) e CanvasMirror (Hero)
   ============================================ */

export interface GridConfig {
  cellSize: number;
  squareRatio: number;
  maxScale: number;
  minScale: number;
  falloff: number;
  lerpSpeed: number;
  glowRadius: number;
}

export interface Square {
  x: number;
  y: number;
  baseSize: number;
  currentScale: number;
  targetScale: number;
}

export function getConfig(width: number): GridConfig {
  const isMobile = width < 768;
  const isTablet = width < 1024;
  return {
    cellSize: isMobile ? 28 : isTablet ? 20 : 15,
    squareRatio: isMobile ? 0.35 : 0.5,
    maxScale: 1.5,
    minScale: 0,
    falloff: isMobile ? 0.003 : 0.004,
    lerpSpeed: 0.07,
    glowRadius: isMobile ? 80 : 100,
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Costruisce l'array di quadrati per una data area */
export function buildSquares(
  width: number,
  height: number,
  config: GridConfig
): Square[] {
  const { cellSize, squareRatio } = config;
  const squareSize = cellSize * squareRatio;
  const cols = Math.ceil(width / cellSize) + 1;
  const rows = Math.ceil(height / cellSize) + 1;

  const squares: Square[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      squares.push({
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
        baseSize: squareSize,
        currentScale: 0.5,
        targetScale: 0.5,
      });
    }
  }
  return squares;
}

/** Renderizza un frame della griglia sul context dato */
export function renderGridFrame(
  ctx: CanvasRenderingContext2D,
  squares: Square[],
  mouseX: number,
  mouseY: number,
  config: GridConfig
) {
  const { maxScale, minScale, falloff, lerpSpeed, glowRadius } = config;

  // Sfondo nero tra i quadretti (invece di clearRect trasparente)
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const sq of squares) {
    const dx = sq.x - mouseX;
    const dy = sq.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let targetScale = maxScale - distance * falloff;
    targetScale = Math.max(minScale, Math.min(maxScale, targetScale));
    sq.targetScale = targetScale;
    sq.currentScale = lerp(sq.currentScale, sq.targetScale, lerpSpeed);

    const size = sq.baseSize * sq.currentScale;
    const halfSize = size / 2;
    const glowFactor = Math.max(0, 1 - distance / glowRadius);

    const fillAlpha = 0.12 + glowFactor * 0.45;
    ctx.fillStyle = `rgba(173, 40, 49, ${fillAlpha})`;
    ctx.fillRect(sq.x - halfSize, sq.y - halfSize, size, size);

    const borderAlpha = 0.06 + glowFactor * 0.22;
    ctx.strokeStyle = `rgba(173, 40, 49, ${borderAlpha})`;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(sq.x - halfSize, sq.y - halfSize, size, size);
  }
}
