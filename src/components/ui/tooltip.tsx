import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  sideOffset?: number;
}

export function Tooltip({ 
  content, 
  children, 
  side = 'right', 
  sideOffset = 12,
  className 
}: TooltipProps) {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (show && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      switch (side) {
        case 'right':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + sideOffset;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left - tooltipRect.width - sideOffset;
          break;
        case 'top':
          top = triggerRect.top - tooltipRect.height - sideOffset;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + sideOffset;
          left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          break;
      }

      // Prevent tooltip from going off screen
      const padding = 12;
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

      setPosition({ top, left });
    }
  }, [show, side, sideOffset]);

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-block"
      >
        {children}
      </div>
      {show && createPortal(
        <div
          ref={tooltipRef}
          className={cn(
            'fixed z-[9999] p-3',
            'bg-white shadow-lg',
            'rounded-lg border border-black/[0.08]',
            'animate-in fade-in-0 zoom-in-95 duration-100',
            className
          )}
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <div className="relative">
            {side === 'right' && (
              <div className="absolute left-0 top-1/2 -translate-x-[6px] -translate-y-1/2 -rotate-90">
                <div className="w-2 h-2 rotate-45 bg-white border-l border-t border-black/[0.08]" />
              </div>
            )}
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
