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
        <strong key={match.index} className="font-semibold text-ink">
          {boldText}
        </strong>
      );
    } else if (codeText !== undefined) {
      elements.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-paper-3 font-mono text-[0.875em] text-ink"
        >
          {codeText}
        </code>
      );
    } else if (mathText !== undefined) {
      elements.push(
        <span
          key={match.index}
          className="px-1.5 py-0.5 rounded-md bg-paper-3 font-mono text-[0.875em] text-ink"
        >
          {mathText}
        </span>
      );
    } else if (italicText !== undefined) {
      elements.push(
        <em key={match.index} className="italic">
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
          <p key={`p-${blocks.length}`} className="text-base leading-7 text-ink-2 my-3">
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
        ? 'list-decimal list-outside pl-5 space-y-1.5 my-3 text-base text-ink-2 leading-7 marker:text-muted'
        : 'list-disc list-outside pl-5 space-y-1.5 my-3 text-base text-ink-2 leading-7 marker:text-muted';

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
        <h4 key={`h-${blocks.length}`} className="pt-4 pb-0.5 text-base font-medium tracking-tight text-ink">
          {renderInline(title)}
        </h4>
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

  return <div className={`${className}`.trim() || undefined}>{blocks}</div>;
};
