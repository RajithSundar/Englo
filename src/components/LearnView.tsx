import React from 'react';
import { ArrowUpRight, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import { usePlatformStore } from '../store/usePlatformStore';

const MONO = "'Atkinson Hyperlegible Mono', 'JetBrains Mono', ui-monospace, monospace";

type Cost = 'Free' | 'Open source' | 'Free to audit' | 'Free + paid' | 'Paid';
type Level = 'beginner' | 'intermediate' | 'advanced';
type Format = 'video' | 'text';

interface Source {
  name: string;
  by: string;
  caption: string;
  cost: Cost;
  href: string;
}

interface Track {
  key: 'dsa' | 'system';
  label: string;
  intro: string;
  sources: Record<Format, Record<Level, Source[]>>;
}

const LEVELS: { key: Level; label: string; blurb: string }[] = [
  { key: 'beginner', label: 'Beginner', blurb: 'No background needed.' },
  { key: 'intermediate', label: 'Intermediate', blurb: 'You know the basics and want depth or interview practice.' },
  { key: 'advanced', label: 'Advanced', blurb: 'Graduate courses, proofs and real systems.' },
];

const FORMATS: { key: Format; label: string; icon: React.ReactNode }[] = [
  { key: 'video', label: 'Videos', icon: <PlayCircle className="h-4 w-4" /> },
  { key: 'text', label: 'Text', icon: <BookOpen className="h-4 w-4" /> },
];

/**
 * Ranked 1 to 5 within each level and format: how often programming
 * communities (r/learnprogramming, r/leetcode, r/cscareerquestions,
 * r/ExperiencedDevs, Blind) recommend it, weighted towards free material.
 * Every link was checked on 2026-11-19.
 */
const TRACKS: Track[] = [
  {
    key: 'dsa',
    label: 'Data structures & algorithms',
    intro: 'From your first linked list to graduate algorithms and contest problems.',
    sources: {
      video: {
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
            caption: 'The best-known intro course. Its memory and data structures lectures build lists, trees and hash tables from scratch.',
            cost: 'Free',
            href: 'https://cs50.harvard.edu/x/',
          },
          {
            name: 'Data Structures Easy to Advanced',
            by: 'William Fiset, freeCodeCamp',
            caption: 'One long course with animated explanations and code for every core data structure.',
            cost: 'Free',
            href: 'https://www.youtube.com/watch?v=RBSGKlAvoiM',
          },
          {
            name: 'mycodeschool',
            by: 'YouTube',
            caption: 'Short classic videos on pointers, linked lists, stacks, queues, trees and sorting, still widely recommended.',
            cost: 'Free',
            href: 'https://www.youtube.com/@mycodeschool',
          },
          {
            name: 'DSA Bootcamp',
            by: 'Kunal Kushwaha',
            caption: 'A full bootcamp in Java, from complexity and recursion to trees and graphs, with assignments.',
            cost: 'Free',
            href: 'https://www.youtube.com/@KunalKushwaha',
          },
        ],
        intermediate: [
          {
            name: '6.006 Introduction to Algorithms',
            by: 'MIT OpenCourseWare',
            caption: 'Recorded MIT lectures with notes, problem sets and exams. The standard step after an intro course.',
            cost: 'Free',
            href: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
          },
          {
            name: 'NeetCode',
            by: 'YouTube',
            caption: 'Clear walkthroughs of hundreds of interview problems, grouped by pattern on the NeetCode 150 list.',
            cost: 'Free',
            href: 'https://www.youtube.com/@NeetCode',
          },
          {
            name: 'Algorithms Illuminated',
            by: 'Tim Roughgarden, Stanford',
            caption: "Free lecture videos from Roughgarden's Stanford course: divide and conquer, graphs, greedy, DP and NP-hardness.",
            cost: 'Free',
            href: 'https://www.algorithmsilluminated.org/',
          },
          {
            name: 'Algorithms, Part I',
            by: 'Sedgewick & Wayne, Princeton',
            caption: 'Sorting, searching and core data structures with programming assignments. Free to audit on Coursera.',
            cost: 'Free to audit',
            href: 'https://www.coursera.org/learn/algorithms-part1',
          },
          {
            name: 'take U forward',
            by: 'Striver',
            caption: 'Long topic playlists on recursion, DP, graphs and trees that follow the A2Z sheet.',
            cost: 'Free',
            href: 'https://www.youtube.com/@takeUforward',
          },
        ],
        advanced: [
          {
            name: '6.046J Design and Analysis of Algorithms',
            by: 'MIT OpenCourseWare',
            caption: 'Randomised algorithms, network flow, NP-completeness and more, as full recorded lectures.',
            cost: 'Free',
            href: 'https://ocw.mit.edu/courses/6-046j-design-and-analysis-of-algorithms-spring-2015/',
          },
          {
            name: '6.851 Advanced Data Structures',
            by: 'Erik Demaine, MIT',
            caption: 'Persistent, geometric, string and succinct data structures at research level.',
            cost: 'Free',
            href: 'https://ocw.mit.edu/courses/6-851-advanced-data-structures-spring-2012/',
          },
          {
            name: 'Online courses',
            by: 'Tim Roughgarden',
            caption: 'His lecture series, including CS261 on flows, linear programming and online algorithms.',
            cost: 'Free',
            href: 'https://timroughgarden.org/videos.html',
          },
          {
            name: 'Errichto Algorithms',
            by: 'Kamil Dębowski',
            caption: 'A top competitive programmer explains techniques and solves hard problems live.',
            cost: 'Free',
            href: 'https://www.youtube.com/@errichto',
          },
          {
            name: 'SecondThread',
            by: 'YouTube',
            caption: 'Contest problem walkthroughs and algorithm tutorials from a Codeforces grandmaster.',
            cost: 'Free',
            href: 'https://www.youtube.com/@SecondThread',
          },
        ],
      },
      text: {
        beginner: [
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
            caption: 'Step through sorting, trees, heaps and graph algorithms on your own input, with notes for each.',
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
          {
            name: 'Think Data Structures',
            by: 'Allen Downey, Green Tea Press',
            caption: 'A short free book that teaches data structures by building them in Java.',
            cost: 'Free',
            href: 'https://greenteapress.com/wp/think-data-structures/',
          },
          {
            name: 'Algorithms study cheatsheets',
            by: 'Tech Interview Handbook',
            caption: 'One page per topic: what to know, common techniques, edge cases and starter problems.',
            cost: 'Open source',
            href: 'https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/',
          },
        ],
        intermediate: [
          {
            name: 'Algorithms, 4th edition booksite',
            by: 'Sedgewick & Wayne, Princeton',
            caption: 'Summaries, code and exercises for every chapter of the Princeton algorithms book.',
            cost: 'Free',
            href: 'https://algs4.cs.princeton.edu/home/',
          },
          {
            name: 'Grind 75',
            by: 'Yangshun Tay, Tech Interview Handbook',
            caption: 'A problem plan sized to the weeks you have, by the author of Blind 75.',
            cost: 'Open source',
            href: 'https://www.techinterviewhandbook.org/grind75/',
          },
          {
            name: 'A2Z DSA sheet',
            by: 'Striver, takeUforward',
            caption: 'A long ordered sheet from basics to DP and graphs, each problem with a written explanation.',
            cost: 'Free',
            href: 'https://takeuforward.org/dsa/strivers-a2z-sheet-learn-dsa-a-to-z',
          },
          {
            name: 'LeetCode Patterns',
            by: 'Sean Prashad',
            caption: 'An open list of problems tagged by the pattern that solves them, so you learn the pattern, not the answer.',
            cost: 'Open source',
            href: 'https://seanprashad.com/leetcode-patterns/',
          },
          {
            name: 'USACO Guide',
            by: 'Competitive programming community',
            caption: 'An open, community-written curriculum from bronze to platinum, with modules and problem sets.',
            cost: 'Open source',
            href: 'https://usaco.guide/',
          },
        ],
        advanced: [
          {
            name: 'Algorithms',
            by: 'Jeff Erickson, UIUC',
            caption: 'A full textbook released free under Creative Commons. Strong on recursion, DP and proofs.',
            cost: 'Open source',
            href: 'https://jeffe.cs.illinois.edu/teaching/algorithms/',
          },
          {
            name: 'Algorithms for Competitive Programming',
            by: 'cp-algorithms',
            caption: 'Open-source write-ups of advanced algorithms with proofs, code and practice links.',
            cost: 'Open source',
            href: 'https://cp-algorithms.com/',
          },
          {
            name: 'CSES Problem Set',
            by: 'University of Helsinki',
            caption: 'About 400 classic problems by topic with an online judge. The hard ones go past interview level.',
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
            name: 'Mathematics for Computer Science',
            by: 'Lehman, Leighton & Meyer, MIT',
            caption: 'Proofs, graph theory, counting and probability: the maths behind analysing algorithms.',
            cost: 'Free',
            href: 'https://ocw.mit.edu/courses/6-042j-mathematics-for-computer-science-spring-2015/',
          },
        ],
      },
    },
  },
  {
    key: 'system',
    label: 'System design',
    intro: 'From what a load balancer is to consensus, storage engines and real outages.',
    sources: {
      video: {
        beginner: [
          {
            name: 'ByteByteGo',
            by: 'Alex Xu',
            caption: 'Short animated explainers on caching, databases, APIs and architecture, from the System Design Interview author.',
            cost: 'Free',
            href: 'https://www.youtube.com/@ByteByteGo',
          },
          {
            name: 'Hello Interview',
            by: 'YouTube',
            caption: 'Full design walkthroughs by former FAANG interviewers, using one repeatable answer framework.',
            cost: 'Free',
            href: 'https://www.youtube.com/@hello_interview',
          },
          {
            name: 'Gaurav Sen',
            by: 'YouTube',
            caption: 'The channel many people started with: consistent hashing, sharding, messaging and classic design questions.',
            cost: 'Free',
            href: 'https://www.youtube.com/@gkcs',
          },
          {
            name: 'System Design for Beginners',
            by: 'freeCodeCamp',
            caption: 'One long course on the building blocks: servers, databases, caching, load balancing and scaling.',
            cost: 'Free',
            href: 'https://www.youtube.com/watch?v=m8Icp_Cid5o',
          },
          {
            name: 'Hussein Nasser',
            by: 'YouTube',
            caption: 'Backend fundamentals from the wire up: HTTP, TCP, proxies, connection pools and databases.',
            cost: 'Free',
            href: 'https://www.youtube.com/@hnasr',
          },
        ],
        intermediate: [
          {
            name: 'Distributed Systems lectures',
            by: 'Martin Kleppmann, Cambridge',
            caption: 'A short lecture series on time, replication, consistency and consensus, by the author of DDIA.',
            cost: 'Free',
            href: 'https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB',
          },
          {
            name: 'Jordan has no life',
            by: 'YouTube',
            caption: 'Deep, fast design walkthroughs and a concepts series that goes well past interview basics.',
            cost: 'Free',
            href: 'https://www.youtube.com/@jordanhasnolife5163',
          },
          {
            name: 'Arpit Bhayani',
            by: 'YouTube',
            caption: 'How real systems and databases work inside, often explained from engineering blogs and papers.',
            cost: 'Free',
            href: 'https://www.youtube.com/@AsliEngineering',
          },
          {
            name: 'InfoQ',
            by: 'QCon talks',
            caption: 'Conference talks where engineers explain the architecture of systems they run in production.',
            cost: 'Free',
            href: 'https://www.youtube.com/@InfoQ',
          },
          {
            name: 'Strange Loop',
            by: 'Conference talks',
            caption: 'Archived talks on distributed systems, databases and programming from a well-regarded conference.',
            cost: 'Free',
            href: 'https://www.youtube.com/@StrangeLoopConf',
          },
        ],
        advanced: [
          {
            name: '6.824 Distributed Systems lectures',
            by: 'Robert Morris, MIT',
            caption: 'Recorded lectures of the MIT graduate course: MapReduce, Raft, Spanner, Zookeeper and more.',
            cost: 'Free',
            href: 'https://www.youtube.com/@6.824',
          },
          {
            name: 'CMU Database Group',
            by: 'Andy Pavlo, Carnegie Mellon',
            caption: 'Full lectures of 15-445 and 15-721: storage, indexes, query execution, concurrency and recovery.',
            cost: 'Free',
            href: 'https://www.youtube.com/@CMUDatabaseGroup',
          },
          {
            name: 'CSE138 Distributed Systems',
            by: 'Lindsey Kuper, UC Santa Cruz',
            caption: 'An undergraduate course recorded in full: clocks, replication, consistency models and consensus.',
            cost: 'Free',
            href: 'https://www.youtube.com/@lindseykuperwithasharpie',
          },
          {
            name: 'Papers We Love',
            by: 'Community talks',
            caption: 'Speakers walk through landmark computer science papers, many of them on distributed systems.',
            cost: 'Free',
            href: 'https://www.youtube.com/@PapersWeLove',
          },
          {
            name: 'USENIX',
            by: 'Conference talks',
            caption: 'Talks from OSDI, NSDI and SREcon, where many systems papers are first presented.',
            cost: 'Free',
            href: 'https://www.youtube.com/@usenix',
          },
        ],
      },
      text: {
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
            name: 'System Design roadmap',
            by: 'roadmap.sh',
            caption: 'A community-maintained map of what to learn, in order, with a free reading list for each topic.',
            cost: 'Open source',
            href: 'https://roadmap.sh/system-design',
          },
        ],
        intermediate: [
          {
            name: 'Designing Data-Intensive Applications',
            by: 'Martin Kleppmann',
            caption: 'The book most often called essential. Storage, replication, partitioning and transactions from first principles.',
            cost: 'Paid',
            href: 'https://dataintensive.net/',
          },
          {
            name: 'Distributed Systems lecture notes',
            by: 'Martin Kleppmann, Cambridge',
            caption: 'The free written notes behind his Cambridge course: time, broadcast, replication and consensus.',
            cost: 'Free',
            href: 'https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf',
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
            name: 'Readings in Database Systems (the Red Book)',
            by: 'Bailis, Hellerstein & Stonebraker',
            caption: 'The key database papers, each with a short commentary on why it matters.',
            cost: 'Free',
            href: 'http://www.redbook.io/',
          },
          {
            name: 'The Raft consensus algorithm',
            by: 'Diego Ongaro & John Ousterhout',
            caption: 'The Raft paper, an interactive visualisation and a list of real implementations.',
            cost: 'Open source',
            href: 'https://raft.github.io/',
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
  },
];

const costClass = (c: Cost) => (c === 'Paid' ? 'text-muted' : 'text-accent');

const SourceCard: React.FC<{ source: Source; rank: number }> = ({ source: s, rank }) => (
  <a
    href={s.href}
    target="_blank"
    rel="noopener noreferrer"
    className="glass group grid h-full grid-cols-[2rem_1fr] gap-x-3 rounded-xl p-4 transition hover:border-accent hover:shadow-glow-1"
  >
    <span
      aria-label={`Rank ${rank}`}
      className={`text-[22px] leading-none ${rank === 1 ? 'text-accent' : 'text-muted'}`}
      style={{ fontFamily: MONO }}
    >
      {rank}
    </span>
    <span className="min-w-0">
      <span className="flex items-start justify-between gap-2">
        <span className="text-[15px] font-medium leading-snug text-ink">{s.name}</span>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </span>
      <span className="mt-0.5 block text-[12.5px] text-ink-2">{s.by}</span>
      <span className="mt-2 block text-[13.5px] leading-[1.55] text-muted">{s.caption}</span>
      <span className={`mt-3 block text-[11px] uppercase tracking-[0.08em] ${costClass(s.cost)}`} style={{ fontFamily: MONO }}>
        {s.cost}
        <span className="sr-only"> (opens in a new tab)</span>
      </span>
    </span>
  </a>
);

export const LearnView: React.FC = () => {
  const setActiveView = usePlatformStore((s) => s.setActiveView);
  const [format, setFormat] = React.useState<Format>('video');
  const total = TRACKS.length * LEVELS.length * 5 * FORMATS.length;

  return (
    <div id="learn-scroll-container" className="flex-1 overflow-y-auto w-full h-full bg-paper text-ink">
      <div className="mx-auto max-w-[1320px] px-5 pb-14 pt-14 md:px-10 md:pt-20">
        <header className="max-w-[680px]">
          <span aria-hidden className="mb-6 block h-[3px] w-10 rounded-full bg-accent shadow-glow-1" />
          <h1 className="text-[34px] font-medium leading-[1.05] tracking-[-0.025em] md:text-[48px]">Sources to learn from</h1>
          <p className="mt-5 text-[16px] leading-[1.6] text-muted">
            {total} courses, channels, books and guides that programmers recommend most on Reddit and other forums,
            nearly all free or open source. Pick videos or text; each level is ranked 1 to 5 by how widely it's
            recommended. Englo doesn't run any of them.
          </p>
        </header>
      </div>

      {/* Format switch stays in reach while scrolling through both topics */}
      <div className="sticky top-0 z-20 border-y border-rule bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-3 px-5 py-3 md:px-10">
          <div role="tablist" aria-label="Format" className="seg">
            {FORMATS.map((f) => (
              <button
                key={f.key}
                id={`learn-format-${f.key}`}
                type="button"
                role="tab"
                aria-selected={format === f.key}
                aria-controls="learn-panel"
                onClick={() => setFormat(f.key)}
                className="seg-item inline-flex items-center gap-1.5"
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
          <nav aria-label="Topics" className="flex gap-5 text-[13px] text-muted">
            {TRACKS.map((t) => (
              <a key={t.key} href={`#learn-${t.key}`} className="hover:text-ink">
                {t.key === 'dsa' ? 'DSA' : t.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="learn-panel" role="tabpanel" aria-labelledby={`learn-format-${format}`} className="mx-auto max-w-[1320px] px-5 md:px-10">
        {TRACKS.map((track) => (
          <section key={track.key} id={`learn-${track.key}`} aria-labelledby={`learn-${track.key}-title`} className="scroll-mt-20 pt-14">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-4">
              <h2 id={`learn-${track.key}-title`} className="text-[24px] font-medium tracking-[-0.01em] md:text-[28px]">
                {track.label}
              </h2>
              <p className="text-[14px] text-muted">{track.intro}</p>
            </div>

            <div className="mt-8 grid gap-12 lg:grid-cols-3 lg:gap-8">
              {LEVELS.map((level) => (
                <div key={level.key} role="group" aria-labelledby={`learn-${track.key}-${level.key}`}>
                  <h3 id={`learn-${track.key}-${level.key}`} className="text-[18px] font-medium">
                    {level.label}
                  </h3>
                  <p className="mt-1 text-[13.5px] text-muted">{level.blurb}</p>
                  <ol className="mt-5 space-y-3">
                    {track.sources[format][level.key].map((s, i) => (
                      <li key={s.href}>
                        <SourceCard source={s} rank={i + 1} />
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-rule py-10">
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
