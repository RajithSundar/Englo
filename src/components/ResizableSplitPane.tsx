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
      className="flex-1 flex flex-col md:flex-row h-[calc(100vh-3.5rem)] w-full overflow-hidden relative bg-paper"
    >
      {/* Left Pane (Problem Description) */}
      <div
        id="workspace-left-pane"
        style={{ width: `${splitPercentage}%` }}
        className="h-full flex-shrink-0 hidden md:flex flex-col bg-paper overflow-hidden"
      >
        {leftPane}
      </div>

      {/* Resizable divider */}
      <div
        id="workspace-resize-handle"
        onPointerDown={handlePointerDown}
        role="separator"
        aria-valuenow={splitPercentage}
        aria-valuemin={minPercentage}
        aria-valuemax={maxPercentage}
        tabIndex={0}
        title="Drag to resize"
        aria-label="Resize panes"
        aria-orientation="vertical"
        className="hidden md:flex relative items-center justify-center cursor-col-resize group z-20 flex-shrink-0"
        style={{ width: '12px', marginLeft: '-6px', marginRight: '-6px' }}
      >
        {/* Wide invisible hit area for touch and pen */}
        <div className="absolute inset-y-0 -left-4 -right-4 cursor-col-resize" />

        {/* Hairline */}
        <div
          className={`w-px h-full transition-colors ${
            isDragging ? 'bg-accent' : 'bg-rule group-hover:bg-accent/60'
          }`}
        />

        {/* Grip */}
        <div
          className={`absolute w-1 h-8 rounded-none transition-colors ${
            isDragging ? 'bg-accent' : 'bg-rule-2 group-hover:bg-accent/70'
          }`}
        />
      </div>

      {/* Right Pane (Interactive Workspace) */}
      <div
        id="workspace-right-pane"
        className="flex-1 h-full min-w-0 flex flex-col bg-paper overflow-hidden relative"
      >
        {rightPane}
      </div>
    </div>
  );
};
