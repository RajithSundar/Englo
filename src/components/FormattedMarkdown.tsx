import React from 'react';

interface FormattedMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Parses inline formatting:
 * - **bold text**
 * - `code pills`
 * - $O(N)$ math complexity
 * - *italic text*
 */
function renderInline(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  // Tokenizer regex matching bold, code, math ($...$), and italic
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`|\$([^$]+)\$|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    const boldText = match[2];
    const codeText = match[3];
    const mathText = match[4];
    const italicText = match[5];

    if (boldText !== undefined) {
      elements.push(
        <strong key={match.index} className="font-bold text-[#2F3E46] dark:text-white">
          {boldText}
        </strong>
      );
    } else if (codeText !== undefined) {
      elements.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-[#CAD2C5]/30 dark:bg-[#1E272C] font-mono text-[11px] text-[#52796F] dark:text-[#84A98C] font-semibold border border-[#CAD2C5]/60 dark:border-[#52796F]/30"
        >
          {codeText}
        </code>
      );
    } else if (mathText !== undefined) {
      elements.push(
        <span
          key={match.index}
          className="inline-flex items-center px-1.5 py-0.2 rounded font-mono text-[11px] font-semibold bg-[#CAD2C5]/20 dark:bg-[#354F52] text-[#354F52] dark:text-[#CAD2C5] border border-[#CAD2C5] dark:border-[#52796F]/50"
        >
          {mathText}
        </span>
      );
    } else if (italicText !== undefined) {
      elements.push(
        <em key={match.index} className="italic text-[#52796F] dark:text-[#CAD2C5]/90">
          {italicText}
        </em>
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
}

export const FormattedMarkdown: React.FC<FormattedMarkdownProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Split content by lines and group into blocks
  const rawLines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let currentList: { type: 'ol' | 'ul'; items: string[] } | null = null;
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    if (paragraphBuffer.length > 0) {
      const text = paragraphBuffer.join(' ').trim();
      if (text) {
        blocks.push(
          <p key={`p-${blocks.length}`} className="leading-relaxed text-xs text-[#2F3E46] dark:text-[#CAD2C5]/90 my-2">
            {renderInline(text)}
          </p>
        );
      }
      paragraphBuffer = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      const isOrdered = currentList.type === 'ol';
      const ListTag = isOrdered ? 'ol' : 'ul';
      const listClass = isOrdered
        ? 'list-decimal list-outside pl-5 space-y-1.5 my-2.5 text-xs text-[#2F3E46] dark:text-[#CAD2C5]/90 leading-relaxed'
        : 'list-disc list-outside pl-5 space-y-1.5 my-2.5 text-xs text-[#2F3E46] dark:text-[#CAD2C5]/90 leading-relaxed';

      blocks.push(
        <ListTag key={`list-${blocks.length}`} className={listClass}>
          {currentList.items.map((item, idx) => (
            <li key={idx} className="pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ListTag>
      );
      currentList = null;
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Check for Headings: ### or ## or #
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const title = headingMatch[2];

      blocks.push(
        <div key={`h-${blocks.length}`} className="pt-3 pb-1">
          <h4 className="text-[13px] font-bold tracking-tight text-[#2F3E46] dark:text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84A98C] inline-block" />
            {renderInline(title)}
          </h4>
        </div>
      );
      continue;
    }

    // Check for Ordered list item: "1. ", "2. ", etc.
    const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(orderedMatch[2]);
      continue;
    }

    // Check for Unordered list item: "- ", "* ", "• "
    const unorderedMatch = line.match(/^[-*•]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(unorderedMatch[1]);
      continue;
    }

    // Regular line inside a paragraph
    if (currentList) {
      flushList();
    }
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushList();

  return <div className={`space-y-1 ${className}`}>{blocks}</div>;
};
