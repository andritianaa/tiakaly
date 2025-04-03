"use client";
import { useEffect, useState } from 'react';

export const MouseAnimation = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div
      className="pointer-events-none fixed inset-0 transition-opacity duration-300 max-md:hidden"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(250, 204, 21, 0.15), transparent 80%)`,
      }}
    />
  );
};
