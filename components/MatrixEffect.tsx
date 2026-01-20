
import React, { useEffect, useRef } from 'react';

const MatrixEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resize);
    resize();

    // Characters - Katakana + Latin + Numerals
    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = (katakana + latin + nums).split('');

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Matrix Green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        // Randomly render some characters brighter/white for the "glint" effect
        if (Math.random() > 0.98) {
            ctx.fillStyle = '#FFF';
        } else {
            ctx.fillStyle = '#0F0';
        }
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it has crossed the screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      
      // Control speed
      setTimeout(() => {
          animationId = requestAnimationFrame(draw);
      }, 35); 
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9990] pointer-events-auto bg-black"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default MatrixEffect;
