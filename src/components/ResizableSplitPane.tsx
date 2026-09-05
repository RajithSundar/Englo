import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizableSplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  initialSplitPercentage?: number; // e.g. 35
  minPercentage?: number;          // e.g. 25
  maxPercentage?: number;          // e.g. 55
}

export const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  leftPane,
  rightPane,
  initialSplitPercentage = 35,
  minPercentage = 25,
  maxPercentage = 55
}) => {
  const [splitPercentage, setSplitPercentage] = useState<number>(initialSplitPercentage);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const newPercent = ((clientX - rect.left) / rect.width) * 100;

    const clamped = Math.max(minPercentage, Math.min(maxPercentage, newPercent));
    setSplitPercentage(clamped);
  }, [isDragging, minPercentage, maxPercentage]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // no-op if pointer already lost
      }
    }
  }, [isDragging]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      id="workspace-split-container"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] w-full overflow-hidden relative bg-[#FBFBFD] dark:bg-[#090A0E]"
    >
      {/* Left Pane (Problem Description) */}
      <div
        id="workspace-left-pane"
        style={{ width: `${splitPercentage}%` }}
        className="h-full flex-shrink-0 hidden md:flex flex-col border-r border-black/[0.06] dark:border-white/10 bg-white dark:bg-[#0D1117] overflow-hidden"
      >
        {leftPane}
      </div>

      {/* Resizable Divider (iPad Pro Touch Optimized with 44px hit area) */}
      <div
        id="workspace-resize-handle"
        onPointerDown={handlePointerDown}
        role="separator"
        aria-valuenow={splitPercentage}
        aria-valuemin={minPercentage}
        aria-valuemax={maxPercentage}
        tabIndex={0}
        title="Drag to resize problem description and workspace panes"
        className="hidden md:flex relative items-center justify-center cursor-col-resize group z-20 flex-shrink-0"
        style={{ width: '12px', marginLeft: '-6px', marginRight: '-6px' }}
      >
        {/* Generous touch target area (>= 44px width for iPad Apple Pencil / touch) */}
        <div className="absolute inset-y-0 -left-4 -right-4 w-[48px] h-full cursor-col-resize" />

        {/* Visual divider line */}
        <div
          className={`w-[2px] h-full transition-colors ${
            isDragging
              ? 'bg-[#84A98C]'
              : 'bg-neutral-200 dark:bg-white/10 group-hover:bg-[#84A98C]/70'
          }`}
        />

        {/* Center tactile pill indicator */}
        <div
          className={`absolute w-3.5 h-7 rounded-full flex flex-col items-center justify-center gap-0.5 border shadow-2xs transition-all ${
            isDragging
              ? 'bg-white dark:bg-[#2F3E46] border-[#84A98C] scale-110 shadow-sm'
              : 'bg-white dark:bg-[#2F3E46] border-neutral-300 dark:border-white/20 group-hover:border-[#84A98C]'
          }`}
        >
          <div className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-[#84A98C]" />
          <div className="w-1 h-1 rounded-full bg-neutral-400 group-hover:bg-[#84A98C]" />
        </div>
      </div>

      {/* Right Pane (Interactive Workspace) */}
      <div
        id="workspace-right-pane"
        className="flex-1 h-full min-w-0 flex flex-col bg-[#F4F6F4] dark:bg-[#1E272C] overflow-hidden relative"
      >
        {rightPane}
      </div>
    </div>
  );
};
