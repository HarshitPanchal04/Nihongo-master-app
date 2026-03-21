import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const HolographicCard = ({ children, className = '', glowColor = 'rgba(189, 0, 44, 0.4)' }: HolographicCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [0, 1], [10, -10]);
  const rotateY = useTransform(springX, [0, 1], [-10, 10]);

  const xPercentage = useTransform(springX, (v) => v * 100);
  const yPercentage = useTransform(springY, (v) => v * 100);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${xPercentage}% ${yPercentage}%, rgba(255,255,255,0.15) 0%, transparent 50%)`;
  const holographicBackground = useMotionTemplate`linear-gradient(${useTransform(springX, v => v * 360)}deg, transparent, ${glowColor}, rgba(139, 92, 246, 0.4), transparent)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: glareBackground,
        }}
      />
      <motion.div
        className="pointer-events-none absolute inset-0 z-40 rounded-2xl mix-blend-overlay opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: holographicBackground,
        }}
      />
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full">
         {children}
      </div>
    </motion.div>
  );
};
