import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingGlassPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
  align?: 'center' | 'right' | 'left';
  sideOffset?: number;
  width?: string;
  className?: string;
  arrowPosition?: 'center' | 'right' | 'left' | number;
}

export const FloatingGlassPopover: React.FC<FloatingGlassPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  children,
  align = 'right',
  sideOffset = 12,
  width = 'w-[360px]',
  className = '',
  arrowPosition = 'right',
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose, triggerRef]);

  // Close on ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamic Alignment CSS Classes
  const getAlignmentClasses = () => {
    switch (align) {
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-0';
      case 'right':
      default:
        return 'right-0';
    }
  };

  // Arrow position classes
  const getArrowClasses = () => {
    if (typeof arrowPosition === 'number') {
      return '';
    }
    switch (arrowPosition) {
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'left':
        return 'left-6';
      case 'right':
      default:
        return 'right-6';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.94, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -8 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          style={{ marginTop: `${sideOffset}px` }}
          className={`absolute top-full ${getAlignmentClasses()} ${width} z-50 glass-popover p-4 ${className}`}
        >
          {/* Floating Pointer Arrow pointing toward trigger */}
          <div
            className={`absolute -top-2 w-4 h-4 rotate-45 border-t border-l border-white/20 bg-slate-900/90 dark:bg-slate-900/90 backdrop-blur-xl ${getArrowClasses()}`}
            style={
              typeof arrowPosition === 'number'
                ? { left: `${arrowPosition}px` }
                : undefined
            }
          />

          {/* Top subtle highlight reflection */}
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Popover Content */}
          <div className="relative z-10">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
