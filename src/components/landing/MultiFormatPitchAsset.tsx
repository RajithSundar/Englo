import React, { useState } from 'react';
import { 
  FileText, 
  ListOrdered, 
  List, 
  CheckCircle2, 
  Cpu, 
  Check, 
  Terminal,
  Code2
} from 'lucide-react';

interface FormatSample {
  id: 'paragraph' | 'bullets' | 'steps' | 'prose';
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  code: string;
  wordCount: number;
  extractedInvariants: {
    dataStructure: string;
    loopCondition: string;
    lookupLogic: string;
    complexity: string;
    edgeCase: string;
  };
}

const FORMAT_SAMPLES: FormatSample[] = [
  {
    id: 'paragraph',
    title: 'Flowing Paragraph',
    badge: 'Natural Prose',
    icon: FileText,
    code: `We can solve this problem in O(N) linear time using an auxiliary hash map named "seen" to store visited numbers and their 0-based indices. As we iterate through each element in the array, we compute the target complement (target - current_number). If this complement already exists as a key in our map, we immediately terminate and return the pair consisting of the stored complement index and our current index. Otherwise, we record the current number and index into the map and continue. If the traversal finishes with no valid pair, we return an empty array.`,
    wordCount: 96,
    extractedInvariants: {
      dataStructure: 'Hash Table: seen { value -> index }',
      loopCondition: 'Single pass [0 .. N-1]',
      lookupLogic: 'complement = target - current_number',
      complexity: 'O(N) Time • O(N) Space',
      edgeCase: 'Distinct indices preserved, empty return on miss'
    }
  },
  {
    id: 'bullets',
    title: 'Bullet Points',
    badge: 'Concise Invariants',
    icon: List,
    code: `• Data Structure: Initialize an empty hash map 'seen' (keys: number values, values: array indices).
• Traversal: Loop through array 'nums' tracking element 'x' at index 'i'.
• Lookup Invariant:
  - Calculate complement = target - x.
  - If complement in 'seen': return [seen[complement], i].
  - Else: insert seen[x] = i.
• Boundary Condition: Return [] if no matching pair adds to target.
• Complexity: O(N) time single-pass lookup, O(N) space for hash map.`,
    wordCount: 72,
    extractedInvariants: {
      dataStructure: 'Hash Table: seen { value -> index }',
      loopCondition: 'Single pass [0 .. N-1]',
      lookupLogic: 'complement = target - current_number',
      complexity: 'O(N) Time • O(N) Space',
      edgeCase: 'Distinct indices preserved, empty return on miss'
    }
  },
  {
    id: 'steps',
    title: 'Numbered Steps',
    badge: 'Sequential Logic',
    icon: ListOrdered,
    code: `1. Initialize an empty hash map named "seen" to store array values and their indices.
2. Iterate through "nums" with index "i" and current element "num":
   a. Compute complement = target - num.
   b. If complement exists in "seen", return [seen[complement], i].
   c. Otherwise, set seen[num] = i.
3. If loop finishes without finding a pair, return an empty array.
4. Time Complexity: O(N) with O(1) average map operations. Space Complexity: O(N).`,
    wordCount: 70,
    extractedInvariants: {
      dataStructure: 'Hash Table: seen { value -> index }',
      loopCondition: 'Single pass [0 .. N-1]',
      lookupLogic: 'complement = target - current_number',
      complexity: 'O(N) Time • O(N) Space',
      edgeCase: 'Distinct indices preserved, empty return on miss'
    }
  },
  {
    id: 'prose',
    title: 'Architectural Notes',
    badge: 'High-Signal Summary',
    icon: Code2,
    code: `Trade auxiliary O(N) memory for O(N) linear time via hash-inversion.
Maintain a hash map mapping each integer to its original index.
For every x in nums:
  check if (target - x) was previously seen.
  Yes -> return index pair [seen[target - x], current_index].
  No  -> register seen[x] = current_index.
Terminates in a single scan with guaranteed O(1) lookups.`,
    wordCount: 56,
    extractedInvariants: {
      dataStructure: 'Hash Table: seen { value -> index }',
      loopCondition: 'Single pass [0 .. N-1]',
      lookupLogic: 'complement = target - current_number',
      complexity: 'O(N) Time • O(N) Space',
      edgeCase: 'Distinct indices preserved, empty return on miss'
    }
  }
];

export const MultiFormatPitchAsset: React.FC<{ isDarkMode?: boolean }> = ({ isDarkMode = false }) => {
  const [activeFormatId, setActiveFormatId] = useState<'paragraph' | 'bullets' | 'steps' | 'prose'>('paragraph');
  const [isParsing, setIsParsing] = useState<boolean>(false);

  const activeFormat = FORMAT_SAMPLES.find((f) => f.id === activeFormatId) || FORMAT_SAMPLES[0];

  const handleSelectFormat = (id: 'paragraph' | 'bullets' | 'steps' | 'prose') => {
    setActiveFormatId(id);
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
    }, 380);
  };

  return (
    <div className={`w-full rounded-3xl border shadow-xl transition-all duration-500 overflow-hidden relative ${
      isDarkMode 
        ? 'bg-[#0E111A] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
        : 'bg-white border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.06)]'
    }`}>
      {/* Top Banner with Pitch Statement */}
      <div className={`px-6 sm:px-8 py-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
        isDarkMode ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-[#F9FAFC] border-black/[0.06]'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-[#84A98C]/15 text-[#52796F] dark:text-[#84A98C] border border-[#84A98C]/30">
              Format Independent AI
            </span>
            <span className="flex h-2 w-2 rounded-full bg-[#84A98C] animate-pulse" />
            <span className={`text-xs font-mono font-semibold ${isDarkMode ? 'text-neutral-400' : 'text-[#52796F]'}`}>
              Zero Syntax Rigidity
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
            Express Your Algorithm Your Way
          </h3>
          <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDarkMode ? 'text-neutral-400' : 'text-[#52796F]'}`}>
            Write a continuous paragraph, crisp bullet points, or sequential steps. Englo parses your underlying mathematical logic and invariant proofs — never your formatting style.
          </p>
        </div>

        {/* Live Format Selector Tabs */}
        <div className={`flex items-center p-1 rounded-2xl border shadow-2xs self-start md:self-auto flex-wrap gap-1 ${
          isDarkMode ? 'bg-[#2F3E46] border-white/10' : 'bg-white border-black/[0.08]'
        }`}>
          {FORMAT_SAMPLES.map((sample) => {
            const Icon = sample.icon;
            const isSelected = activeFormatId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectFormat(sample.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-[#84A98C] text-white shadow-xs scale-[1.02]'
                    : isDarkMode
                    ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                    : 'text-[#52796F] hover:text-[#2F3E46] hover:bg-black/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sample.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.06] dark:divide-white/[0.08]">
        {/* Left Side: Candidate's Freeform Expression */}
        <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#84A98C]" />
                <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                  Candidate Input ({activeFormat.title})
                </span>
                <span className="text-[11px] font-mono text-[#84A98C] dark:text-[#CAD2C5]">
                  • {activeFormat.wordCount} words
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isDarkMode 
                  ? 'bg-[#354F52] text-[#CAD2C5] border-white/10' 
                  : 'bg-[#84A98C]/15 text-[#52796F] border-[#84A98C]/30'
              }`}>
                {activeFormat.badge}
              </span>
            </div>

            {/* Code / Text Presentation Box */}
            <div className={`rounded-2xl border p-4 sm:p-5 font-mono text-[12px] sm:text-[13px] leading-6 sm:leading-7 transition-all duration-300 relative overflow-hidden ${
              isDarkMode 
                ? 'bg-[#1E272C] border-white/10 text-neutral-200 shadow-inner' 
                : 'bg-[#F4F6F4] border-black/[0.06] text-[#2F3E46] shadow-inner'
            }`}>
              {/* Animated Parsing Shimmer Beam */}
              {isParsing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#84A98C]/20 to-transparent animate-pulse pointer-events-none" />
              )}
              
              <div className="whitespace-pre-wrap select-text">
                {activeFormat.code}
              </div>
            </div>
          </div>

          {/* Under-editor format acceptance note */}
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#84A98C] dark:text-[#CAD2C5] font-mono">
            <span className="flex items-center gap-1.5 text-[#84A98C] font-semibold">
              <Check className="w-3.5 h-3.5" />
              No "Step 1" required — write how you naturally explain logic
            </span>
            <button
              onClick={() => handleSelectFormat(activeFormatId)}
              className="text-[#84A98C] hover:underline cursor-pointer font-bold"
            >
              Re-scan logic ↺
            </button>
          </div>
        </div>

        {/* Right Side: Englo Universal Logic Verification Output */}
        <div className={`lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#1E272C]' : 'bg-[#FAFBFC]'
        }`}>
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Cpu className={`w-4 h-4 text-[#84A98C] ${isParsing ? 'animate-spin' : ''}`} />
                <span className={`text-xs font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2F3E46]'}`}>
                  Universal Logic Matrix
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#84A98C]/15 text-[#52796F] dark:text-[#84A98C] border border-[#84A98C]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                100% Invariant Verified
              </span>
            </div>

            {/* Extracted Invariant Badges */}
            <div className="space-y-2.5 font-sans">
              <div className={`p-3 rounded-xl border transition-all ${
                isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/[0.06]'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#84A98C] dark:text-[#CAD2C5] font-bold">
                  Extracted Data Structure
                </div>
                <div className={`text-xs font-bold mt-0.5 flex items-center justify-between ${
                  isDarkMode ? 'text-white' : 'text-[#2F3E46]'
                }`}>
                  <span>{activeFormat.extractedInvariants.dataStructure}</span>
                  <Check className="w-3.5 h-3.5 text-[#84A98C]" />
                </div>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${
                isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/[0.06]'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#84A98C] dark:text-[#CAD2C5] font-bold">
                  Lookup &amp; Invariant Logic
                </div>
                <div className={`text-xs font-bold mt-0.5 flex items-center justify-between ${
                  isDarkMode ? 'text-white' : 'text-[#2F3E46]'
                }`}>
                  <span className="font-mono text-[11px] text-[#84A98C]">{activeFormat.extractedInvariants.lookupLogic}</span>
                  <Check className="w-3.5 h-3.5 text-[#84A98C]" />
                </div>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${
                isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/[0.06]'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#86868B] font-bold">
                  Complexity Detected
                </div>
                <div className={`text-xs font-bold mt-0.5 flex items-center justify-between ${
                  isDarkMode ? 'text-white' : 'text-[#1D1D1F]'
                }`}>
                  <span>{activeFormat.extractedInvariants.complexity}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#34C759] font-bold">
                    Optimal
                  </span>
                </div>
              </div>

              <div className={`p-3 rounded-xl border transition-all ${
                isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/[0.06]'
              }`}>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#86868B] font-bold">
                  Edge Case Invariant
                </div>
                <div className={`text-xs font-medium mt-0.5 text-neutral-600 dark:text-neutral-300 flex items-center justify-between`}>
                  <span>{activeFormat.extractedInvariants.edgeCase}</span>
                  <Check className="w-3.5 h-3.5 text-[#34C759]" />
                </div>
              </div>
            </div>
          </div>

          {/* Unified Outcome Banner */}
          <div className="mt-5 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-xs flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#34C759] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                100
              </div>
              <div>
                <div className="font-bold text-[#34C759] leading-tight">
                  Identical Logic Score Across All Formats
                </div>
                <div className={`text-[11px] font-mono ${isDarkMode ? 'text-neutral-400' : 'text-[#6E6E73]'}`}>
                  Paragraph = Bullets = Steps
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded bg-white dark:bg-black/30 border border-emerald-500/30 text-[#34C759]">
              Passed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
