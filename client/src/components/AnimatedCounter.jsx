import { useState, useEffect, useRef, useMemo } from 'react';

const AnimatedCounter = ({ value, duration = 2.5 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  const { prefix, endValue, suffix, hasNumber } = useMemo(() => {
    const strVal = String(value);
    const match = strVal.match(/(\D*)(\d+)(\D*)/);
    if (!match) return { prefix: '', endValue: 0, suffix: '', hasNumber: false };
    return {
      prefix: match[1] || '',
      endValue: parseInt(match[2], 10),
      suffix: match[3] || '',
      hasNumber: true,
    };
  }, [value]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setCount(0);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !hasNumber) return;

    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);

      if (progress < 1) {
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(endValue * easeOut));
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, endValue, duration, hasNumber]);

  if (!hasNumber) return <span>{value}</span>;

  return <span ref={elementRef}>{prefix}{count}{suffix}</span>;
};

export default AnimatedCounter;
