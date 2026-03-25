'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../lib/store';

/**
 * CustomCursor Component
 * 
 * Renders a stylized custom cursor element that follows the user's mouse pointer using Framer Motion springs.
 * It intelligently enlarges or changes style when hovering over clickable elements or based on global Redux state.
 * Is completely hidden from touch devices to preserve mobile UX.
 */

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    // Optional: Read cursor variant from Redux if you have global hover states
    const cursorVariant = useSelector((state: RootState) => state.ui.cursorVariant);

    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16); // Center the 32px cursor
            cursorY.set(e.clientY - 16);
        };

        // Check if device is touch, we generally hide custom cursors on mobile
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (!isTouchDevice) {
            window.addEventListener('mousemove', mouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', mouseMove);
        };
    }, [cursorX, cursorY]);

    // Handle global hover effects dynamically
    useEffect(() => {
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.classList.contains('hover-target')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mouseover', handleMouseOver);
        return () => window.removeEventListener('mouseover', handleMouseOver);
    }, []);

    const variants = {
        default: {
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            border: '2px solid #08B74F',
            scale: 1,
        },
        hover: {
            width: 64,
            height: 64,
            backgroundColor: 'rgba(8, 183, 79, 0.1)',
            border: '2px solid #08B74F',
            scale: 1.2,
            mixBlendMode: 'difference' as const,
        },
        reduxHover: {
            width: 80,
            height: 80,
            backgroundColor: 'rgba(8, 183, 79, 0.2)',
            border: '2px dotted #08B74F',
            scale: 1.5,
        }
    };

    const activeVariant = cursorVariant === 'hover' ? 'reduxHover' : (isHovering ? 'hover' : 'default');

    // Hide cursor on touch devices entirely
    if (typeof window !== 'undefined') {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return null;
    }

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
            style={{
                x: cursorX,
                y: cursorY,
            }}
            variants={variants}
            animate={activeVariant}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
            <motion.div
                className="w-1.5 h-1.5 bg-[#08B74F] rounded-full"
                animate={{ opacity: isHovering || cursorVariant === 'hover' ? 0 : 1 }}
            />
        </motion.div>
    );
}
