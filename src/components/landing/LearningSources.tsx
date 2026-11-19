import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const MONO = "'Atkinson Hyperlegible Mono', 'JetBrains Mono', ui-monospace, monospace";

type Cost = 'Free' | 'Paid' | 'Free + paid';

interface Source {
  name: string;
  by: string;
  note: string;
  cost: Cost;
  href: string;
}

interface Track {
  key: 'dsa' | 'system';
  label: string;
  groups: { title: string; items: Source[] }[];
}

/**
 * Resources that programming communities (r/leetcode, r/cscareerquestions,
 * r/learnprogramming, r/ExperiencedDevs) recommend again and again.
 * Every link was checked on 2026-11-19.
 */
const TRACKS: Track[] = [
  {
    key: 'dsa',
    label: 'Data structures & algorithms',
    groups: [
      {
        title: 'Start here',
        items: [
          {
            name: 'NeetCode 150 roadmap',
            by: 'NeetCode',
            note: 'Problems grouped by pattern, each with a video walkthrough.',
            cost: 'Free + paid',
            href: 'https://neetcode.io/roadmap',
          },
          {
            name: 'Grind 75',
            by: 'Tech Interview Handbook',
            note: 'A study plan sized to the weeks you have, from the author of Blind 75.',
            cost: 'Free',
            href: 'https://www.techinterviewhandbook.org/grind75/',
          },
          {
            name: 'Algorithms lectures',
            by: 'Abdul Bari',
            note: 'Whiteboard lectures on recursion, complexity, greedy, DP and graphs.',
            cost: 'Free',
            href: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
          },
          {
            name: 'A2Z DSA sheet',
            by: 'Striver, takeUforward',
            note: 'A step-by-step sheet from basics to advanced topics, with explanations.',
            cost: 'Free',
            href: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
          },
        ],
      },
      {
        title: 'Courses and books',
        items: [
          {
            name: '6.006 Introduction to Algorithms',
            by: 'MIT OpenCourseWare',
            note: 'Full lectures, notes and problem sets.',
            cost: 'Free',
            href: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
          },
          {
            name: 'Algorithms, Part I',
            by: 'Sedgewick & Wayne, Princeton',
            note: 'Sorting, searching and core data structures, with graded exercises.',
            cost: 'Free',
            href: 'https://www.coursera.org/learn/algorithms-part1',
          },
          {
            name: 'The Algorithm Design Manual',
            by: 'Steven Skiena',
            note: 'Practical guide to choosing and designing algorithms.',
            cost: 'Paid',
            href: 'https://www.algorist.com/',
          },
          {
            name: 'Introduction to Algorithms (CLRS)',
            by: 'Cormen, Leiserson, Rivest & Stein',
            note: 'The standard reference text. Dense, best used alongside a course.',
            cost: 'Paid',
            href: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/',
          },
        ],
      },
      {
        title: 'Practice and reference',
        items: [
          {
            name: 'CSES Problem Set',
            by: 'University of Helsinki',
            note: 'Classic problems ordered by topic, with an online judge.',
            cost: 'Free',
            href: 'https://cses.fi/problemset/',
          },
          {
            name: 'VisuAlgo',
            by: 'National University of Singapore',
            note: 'Animations of data structures and algorithms, step by step.',
            cost: 'Free',
            href: 'https://visualgo.net/en',
          },
          {
            name: 'Algorithms for Competitive Programming',
            by: 'cp-algorithms',
            note: 'Clear write-ups of standard algorithms, with code.',
            cost: 'Free',
            href: 'https://cp-algorithms.com/',
          },
        ],
      },
    ],
  },
  {
    key: 'system',
    label: 'System design',
    groups: [
      {
        title: 'Start here',
        items: [
          {
            name: 'System Design in a Hurry',
            by: 'Hello Interview',
            note: 'Core concepts, key technologies and an answer framework.',
            cost: 'Free + paid',
            href: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction',
          },
          {
            name: 'The System Design Primer',
            by: 'Donne Martin',
            note: 'The most-starred open guide: concepts, trade-offs and worked designs.',
            cost: 'Free',
            href: 'https://github.com/donnemartin/system-design-primer',
          },
          {
            name: 'System Design Interview, Vol. 1 & 2',
            by: 'Alex Xu, ByteByteGo',
            note: 'Worked designs of real products, step by step, with diagrams.',
            cost: 'Paid',
            href: 'https://bytebytego.com/',
          },
        ],
      },
      {
        title: 'Go deeper',
        items: [
          {
            name: 'Designing Data-Intensive Applications',
            by: 'Martin Kleppmann',
            note: 'Storage, replication, partitioning and consistency, explained from first principles.',
            cost: 'Paid',
            href: 'https://dataintensive.net/',
          },
          {
            name: 'Distributed Systems lectures',
            by: 'Martin Kleppmann, Cambridge',
            note: 'A short lecture series on time, replication and consensus.',
            cost: 'Free',
            href: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB',
          },
          {
            name: '6.5840 Distributed Systems',
            by: 'MIT',
            note: 'Graduate course with readings and labs where you build Raft.',
            cost: 'Free',
            href: 'https://pdos.csail.mit.edu/6.824/',
          },
        ],
      },
      {
        title: 'From production teams',
        items: [
          {
            name: 'Site Reliability Engineering books',
            by: 'Google',
            note: 'How Google runs large systems, free to read online.',
            cost: 'Free',
            href: 'https://sre.google/books/',
          },
          {
            name: "The Amazon Builders' Library",
            by: 'Amazon Web Services',
            note: 'Articles on timeouts, retries, load shedding and deployments.',
            cost: 'Free',
            href: 'https://aws.amazon.com/builders-library/',
          },
        ],
      },
    ],
  },
];

export const LearningSources: React.FC = () => {
  const [track, setTrack] = React.useState<Track['key']>('dsa');
  const current = TRACKS.find((t) => t.key === track) ?? TRACKS[0];

  return (
    <section id="learn" className="border-t border-rule">
      <div className="mx-auto max-w-[1320px] px-5 py-24 md:px-10 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span aria-hidden className="mb-6 block h-[3px] w-10 rounded-full bg-accent shadow-glow-1" />
            <h2 className="text-[32px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[40px]">Sources to learn from.</h2>
            <p className="mt-4 max-w-[560px] text-[16px] leading-[1.6] text-muted">
              Courses, books and guides that programmers recommend again and again on Reddit and other forums. Englo
              doesn't run any of them.
            </p>
          </div>
          <div role="tablist" aria-label="Learning track" className="flex rounded-full border border-rule p-1 text-[13px]">
            {TRACKS.map((t) => (
              <button
                key={t.key}
                id={`learn-tab-${t.key}`}
                role="tab"
                aria-selected={track === t.key}
                aria-controls="learn-panel"
                onClick={() => setTrack(t.key)}
                className={`rounded-full px-4 py-1.5 transition ${
                  track === t.key
                    ? 'bg-accent/15 text-ink shadow-[inset_0_0_0_1px_var(--accent)]'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {t.key === 'dsa' ? 'DSA' : t.label}
              </button>
            ))}
          </div>
        </div>

        <div id="learn-panel" role="tabpanel" aria-labelledby={`learn-tab-${track}`} className="mt-12 space-y-14">
          {current.groups.map((group) => (
            <div key={group.title}>
              <h3 className="label mb-4">{group.title}</h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass group flex h-full flex-col rounded-xl p-5 transition hover:border-accent hover:shadow-glow-1"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="text-[15.5px] font-medium leading-snug text-ink">{s.name}</span>
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </span>
                      <span className="mt-1 text-[13px] text-ink-2">{s.by}</span>
                      <span className="mt-3 flex-1 text-[14px] leading-[1.55] text-muted">{s.note}</span>
                      <span
                        className={`mt-4 self-start text-[11.5px] uppercase tracking-[0.08em] ${
                          s.cost === 'Paid' ? 'text-muted' : 'text-accent'
                        }`}
                        style={{ fontFamily: MONO }}
                      >
                        {s.cost}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
