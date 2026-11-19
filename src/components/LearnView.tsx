import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { usePlatformStore } from '../store/usePlatformStore';

const MONO = "'Atkinson Hyperlegible Mono', 'JetBrains Mono', ui-monospace, monospace";

type Cost = 'Free' | 'Open source' | 'Free to audit' | 'Free + paid' | 'Paid';
type Level = 'beginner' | 'intermediate' | 'advanced';
type TrackKey = 'dsa' | 'system';

interface Source {
  name: string;
  by: string;
  caption: string;
  cost: Cost;
  href: string;
}

interface Track {
  key: TrackKey;
  label: string;
  intro: string;
  levels: Record<Level, Source[]>;
}

const LEVELS: { key: Level; label: string; blurb: string }[] = [
  { key: 'beginner', label: 'Beginner', blurb: 'No background needed.' },
  { key: 'intermediate', label: 'Intermediate', blurb: 'You know the basics and want depth or interview practice.' },
  { key: 'advanced', label: 'Advanced', blurb: 'Graduate courses, proofs and real systems.' },
];

/**
 * Ranked 1 to 5 within each level: how often programming communities
 * (r/learnprogramming, r/leetcode, r/cscareerquestions, r/ExperiencedDevs,
 * Blind) recommend it, weighted towards material that is free to use.
 * Every link was checked on 2026-11-19.
 */
const TRACKS: Track[] = [
  {
    key: 'dsa',
    label: 'Data structures & algorithms',
    intro: 'From your first linked list to graduate algorithms and contest problems.',
    levels: {
      beginner: [
        {
          name: 'Algorithms lectures',
          by: 'Abdul Bari',
          caption: 'Slow, clear whiteboard lectures on complexity, recursion, sorting, greedy and DP. The usual first answer on Reddit.',
          cost: 'Free',
          href: 'https://www.youtube.com/playlist?list=PLDN4rrl48XKpZkf03iYFl-O29szjTrs_O',
        },
        {
          name: 'CS50x: Introduction to Computer Science',
          by: 'Harvard University',
          caption: 'The best-known intro course. Its memory and data structures weeks build arrays, linked lists, trees and hash tables from scratch.',
          cost: 'Free',
          href: 'https://cs50.harvard.edu/x/',
        },
        {
          name: 'Problem Solving with Algorithms and Data Structures using Python',
          by: 'Brad Miller & David Ranum',
          caption: 'An open interactive textbook: read a section, run the code in the page, answer the check questions.',
          cost: 'Open source',
          href: 'https://runestone.academy/ns/books/published/pythonds/index.html',
        },
        {
          name: 'VisuAlgo',
          by: 'National University of Singapore',
          caption: 'Step through animations of sorting, trees, heaps and graph algorithms on your own input.',
          cost: 'Free',
          href: 'https://visualgo.net/en',
        },
        {
          name: 'Open Data Structures',
          by: 'Pat Morin',
          caption: 'A short textbook under a Creative Commons licence, with matching Java, C++ and Python code.',
          cost: 'Open source',
          href: 'https://opendatastructures.org/',
        },
      ],
      intermediate: [
        {
          name: '6.006 Introduction to Algorithms',
          by: 'MIT OpenCourseWare',
          caption: 'Full lectures, notes, problem sets and exams from MIT. The standard step after an intro course.',
          cost: 'Free',
          href: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        },
        {
          name: 'NeetCode 150 roadmap',
          by: 'NeetCode',
          caption: 'Interview problems grouped by pattern, each with a free video solution. The roadmap and videos cost nothing.',
          cost: 'Free + paid',
          href: 'https://neetcode.io/roadmap',
        },
        {
          name: 'Algorithms, 4th edition booksite',
          by: 'Sedgewick & Wayne, Princeton',
          caption: 'Lecture slides, code and exercises behind the Princeton Algorithms course, which is free to audit on Coursera.',
          cost: 'Free',
          href: 'https://algs4.cs.princeton.edu/home/',
        },
        {
          name: 'Tech Interview Handbook and Grind 75',
          by: 'Yangshun Tay',
          caption: 'Open-source study guide plus a problem plan sized to the weeks you have, by the author of Blind 75.',
          cost: 'Open source',
          href: 'https://www.techinterviewhandbook.org/grind75/',
        },
        {
          name: 'A2Z DSA sheet',
          by: 'Striver, takeUforward',
          caption: 'A long ordered sheet from basics to DP and graphs, each problem with an article and video.',
          cost: 'Free',
          href: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
        },
      ],
      advanced: [
        {
          name: '6.046J Design and Analysis of Algorithms',
          by: 'MIT OpenCourseWare',
          caption: 'Divide and conquer, randomised algorithms, network flow, NP-completeness and more, with recorded lectures.',
          cost: 'Free',
          href: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/',
        },
        {
          name: 'Algorithms',
          by: 'Jeff Erickson, UIUC',
          caption: 'A full textbook released free under Creative Commons. Strong on recursion, DP and proofs.',
          cost: 'Open source',
          href: 'https://jeffe.cs.illinois.edu/teaching/algorithms/',
        },
        {
          name: 'CSES Problem Set',
          by: 'University of Helsinki',
          caption: 'About 400 classic problems by topic with an online judge. Hard ones teach techniques interviews rarely reach.',
          cost: 'Free',
          href: 'https://cses.fi/problemset/',
        },
        {
          name: "Competitive Programmer's Handbook",
          by: 'Antti Laaksonen',
          caption: 'The free book written alongside CSES: segment trees, string algorithms, flows and geometry.',
          cost: 'Free',
          href: 'https://cses.fi/book/book.pdf',
        },
        {
          name: 'Algorithms for Competitive Programming',
          by: 'cp-algorithms',
          caption: 'Open-source write-ups of advanced algorithms with proofs, code and practice links.',
          cost: 'Open source',
          href: 'https://cp-algorithms.com/',
        },
      ],
    },
  },
  {
    key: 'system',
    label: 'System design',
    intro: 'From what a load balancer is to consensus, storage engines and real outages.',
    levels: {
      beginner: [
        {
          name: 'The System Design Primer',
          by: 'Donne Martin',
          caption: 'The most-starred open guide: core concepts, trade-offs, worked designs and Anki cards.',
          cost: 'Open source',
          href: 'https://github.com/donnemartin/system-design-primer',
        },
        {
          name: 'System Design in a Hurry',
          by: 'Hello Interview',
          caption: 'A short free course on core concepts, key technologies and a framework for answering design questions.',
          cost: 'Free + paid',
          href: 'https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction',
        },
        {
          name: 'System Design 101',
          by: 'ByteByteGo',
          caption: "Alex Xu's diagrams explaining protocols, caching, databases and architecture patterns, as an open repo.",
          cost: 'Open source',
          href: 'https://github.com/ByteByteGoHq/system-design-101',
        },
        {
          name: 'System Design course',
          by: 'Karan Pratap Singh',
          caption: 'A free course in one repo, from IP and DNS through databases and messaging to worked interview designs.',
          cost: 'Open source',
          href: 'https://github.com/karanpratapsingh/system-design',
        },
        {
          name: 'Hussein Nasser',
          by: 'YouTube',
          caption: 'Backend fundamentals explained from the wire up: HTTP, TCP, proxies, connection pools and databases.',
          cost: 'Free',
          href: 'https://www.youtube.com/@hnasr',
        },
      ],
      intermediate: [
        {
          name: 'Distributed Systems lectures and notes',
          by: 'Martin Kleppmann, Cambridge',
          caption: 'A free lecture series with full notes on time, replication, consistency and consensus, by the author of DDIA.',
          cost: 'Free',
          href: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB',
        },
        {
          name: 'Designing Data-Intensive Applications',
          by: 'Martin Kleppmann',
          caption: 'The book most often called essential. Storage, replication, partitioning and transactions from first principles.',
          cost: 'Paid',
          href: 'https://dataintensive.net/',
        },
        {
          name: 'Site Reliability Engineering books',
          by: 'Google',
          caption: 'How Google runs production systems: SLOs, monitoring, incidents and capacity. Free to read online.',
          cost: 'Free',
          href: 'https://sre.google/books/',
        },
        {
          name: "The Amazon Builders' Library",
          by: 'Amazon Web Services',
          caption: 'Engineers explain how Amazon handles timeouts, retries, caching, load shedding and safe deploys.',
          cost: 'Free',
          href: 'https://aws.amazon.com/builders-library/',
        },
        {
          name: 'Awesome Scalability',
          by: 'Binh Nguyen',
          caption: 'An open reading list of engineering blog posts on how large companies scaled real systems.',
          cost: 'Open source',
          href: 'https://github.com/binhnguyennus/awesome-scalability',
        },
      ],
      advanced: [
        {
          name: '6.5840 Distributed Systems',
          by: 'MIT',
          caption: 'Graduate course with paper readings and labs where you build MapReduce, Raft and a sharded key-value store.',
          cost: 'Free',
          href: 'https://pdos.csail.mit.edu/6.824/',
        },
        {
          name: '15-445 Database Systems',
          by: 'Andy Pavlo, Carnegie Mellon',
          caption: 'How databases work inside: storage, indexes, query execution, concurrency control and recovery. Lectures are public.',
          cost: 'Free',
          href: 'https://15445.courses.cs.cmu.edu/',
        },
        {
          name: 'Distributed Systems, 4th edition',
          by: 'Maarten van Steen & Andrew Tanenbaum',
          caption: 'A full textbook whose authors give out a free personal digital copy.',
          cost: 'Free',
          href: 'https://www.distributed-systems.net/index.php/books/ds4/',
        },
        {
          name: 'Patterns of Distributed Systems',
          by: 'Unmesh Joshi, martinfowler.com',
          caption: 'Write-ahead logs, leases, quorums and more, each shown as it appears in Kafka, etcd and Cassandra.',
          cost: 'Free',
          href: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
        },
        {
          name: 'Jepsen analyses',
          by: 'Kyle Kingsbury',
          caption: 'Reports on how real databases break under partitions and what their consistency claims really mean.',
          cost: 'Free',
          href: 'https://jepsen.io/analyses',
        },
      ],
    },
  },
];

const costClass = (c: Cost) => (c === 'Paid' ? 'text-muted' : 'text-accent');

export const LearnView: React.FC = () => {
  const setActiveView = usePlatformStore((s) => s.setActiveView);
  const [track, setTrack] = React.useState<TrackKey>('dsa');
  const current = TRACKS.find((t) => t.key === track) ?? TRACKS[0];

  return (
    <div id="learn-scroll-container" className="flex-1 overflow-y-auto w-full h-full bg-paper text-ink">
      <div className="mx-auto max-w-[1320px] px-5 py-14 md:px-10 md:py-20">
        <header className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[640px]">
            <span aria-hidden className="mb-6 block h-[3px] w-10 rounded-full bg-accent shadow-glow-1" />
            <h1 className="text-[34px] font-medium leading-[1.05] tracking-[-0.025em] md:text-[48px]">Sources to learn from</h1>
            <p className="mt-5 text-[16px] leading-[1.6] text-muted">
              The courses, books and guides programmers recommend most on Reddit and other forums, nearly all free or
              open source. Each level is ranked 1 to 5 by how widely it's recommended. Englo doesn't run any of them.
            </p>
          </div>
          <div role="tablist" aria-label="Topic" className="seg">
            {TRACKS.map((t) => (
              <button
                key={t.key}
                id={`learn-tab-${t.key}`}
                type="button"
                role="tab"
                aria-selected={track === t.key}
                aria-controls="learn-panel"
                onClick={() => setTrack(t.key)}
                className="seg-item"
              >
                {t.key === 'dsa' ? 'DSA' : t.label}
              </button>
            ))}
          </div>
        </header>

        <div id="learn-panel" role="tabpanel" aria-labelledby={`learn-tab-${track}`} className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-4">
            <h2 className="text-[22px] font-medium tracking-[-0.01em]">{current.label}</h2>
            <p className="text-[14px] text-muted">{current.intro}</p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-3 lg:gap-8">
            {LEVELS.map((level) => (
              <section key={level.key} aria-labelledby={`learn-${track}-${level.key}`}>
                <h3 id={`learn-${track}-${level.key}`} className="flex items-baseline gap-3">
                  <span className="text-[18px] font-medium">{level.label}</span>
                  <span className="text-[12px] text-muted" style={{ fontFamily: MONO }}>
                    5 picks
                  </span>
                </h3>
                <p className="mt-1 text-[13.5px] text-muted">{level.blurb}</p>

                <ol className="mt-5 space-y-3">
                  {current.levels[level.key].map((s, i) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass group grid grid-cols-[2rem_1fr] gap-x-3 rounded-xl p-4 transition hover:border-accent hover:shadow-glow-1"
                      >
                        <span
                          aria-label={`Rank ${i + 1}`}
                          className={`text-[22px] leading-none ${i === 0 ? 'text-accent' : 'text-muted'}`}
                          style={{ fontFamily: MONO }}
                        >
                          {i + 1}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-[15px] font-medium leading-snug text-ink">{s.name}</span>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                          </span>
                          <span className="mt-0.5 block text-[12.5px] text-ink-2">{s.by}</span>
                          <span className="mt-2 block text-[13.5px] leading-[1.55] text-muted">{s.caption}</span>
                          <span
                            className={`mt-3 block text-[11px] uppercase tracking-[0.08em] ${costClass(s.cost)}`}
                            style={{ fontFamily: MONO }}
                          >
                            {s.cost}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-rule pt-8">
          <p className="max-w-[560px] text-[14px] leading-[1.6] text-muted">
            Learned a pattern? Practise it here: write the approach in plain steps and get feedback on the logic.
          </p>
          <button type="button" onClick={() => setActiveView('dashboard')} className="btn-primary">
            Browse the problems
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
