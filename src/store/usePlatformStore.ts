import { create } from 'zustand';
import { PROBLEMS } from '../data/problems';
import { evaluateAlgoEnglish } from '../services/algoEvaluator';
import { evaluateArchitecture } from '../services/systemDesignEvaluator';
import {
  AlgoEvaluationResult,
  ArchitectureEvaluationResult,
  Difficulty,
  ProblemCategory,
  SystemNodeData
} from '../types';

const STORAGE_KEY = 'algo_system_design_store_v2';
const LEGACY_STORAGE_KEY = 'algo_system_design_store_v1';

export type AppView = 'landing' | 'dashboard' | 'algo_workspace' | 'system_design_workspace' | 'auth';

interface PlatformState {
  activeView: AppView;
  activeProblemId: string;
  authenticatedUser: { email: string; handle: string; name?: string; role?: string } | null;
  authMode: 'login' | 'register';
  isAuthModalOpen: boolean;
  algoCodes: Record<string, string>;
  canvasData: Record<string, { nodes: any[]; edges: any[] }>;
  solvedProblemIds: string[];
  algoEvaluations: Record<string, AlgoEvaluationResult>;
  archEvaluations: Record<string, ArchitectureEvaluationResult>;
  isEvaluating: boolean;
  activeConsoleTab: 'matrix' | 'testcases' | 'notes';
  isConsoleExpanded: boolean;
  filterCategory: 'all' | ProblemCategory;
  filterDifficulty: 'all' | Difficulty;
  searchQuery: string;
  selectedNodeId: string | null;
  isTestRunnerOpen: boolean;
  isDarkMode: boolean;
  streakCount: number;
  bestStreak: number;
  lastActiveDate: string | null;
  activityDates: string[];

  // Actions
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
  recordActivity: (customDateStr?: string) => void;
  syncUserStreak: () => Promise<void>;
  setActiveView: (view: AppView) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setAuthModalOpen: (open: boolean) => void;
  openAuth: (mode?: 'login' | 'register') => void;
  authenticateUser: (email: string, handle?: string, name?: string, role?: string) => void;
  logoutUser: () => void;
  setActiveProblem: (id: string) => void;
  setAlgoCode: (problemId: string, code: string) => void;
  setCanvasData: (problemId: string, nodes: any[], edges: any[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (problemId: string, nodeId: string, patch: Partial<SystemNodeData>) => void;
  setFilterCategory: (category: 'all' | ProblemCategory) => void;
  setFilterDifficulty: (difficulty: 'all' | Difficulty) => void;
  setSearchQuery: (query: string) => void;
  setConsoleExpanded: (expanded: boolean) => void;
  setActiveConsoleTab: (tab: 'matrix' | 'testcases' | 'notes') => void;
  runAlgoEvaluation: (problemId: string) => Promise<AlgoEvaluationResult>;
  runArchEvaluation: (problemId: string) => Promise<ArchitectureEvaluationResult>;
  resetProblem: (problemId: string) => void;
  loadSolution: (problemId: string) => void;
  setTestRunnerOpen: (open: boolean) => void;
}

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Load initial state from local storage or defaults
function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    // Backward compatibility: load preferences from legacy key without legacy code
    const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacySaved) {
      const parsed = JSON.parse(legacySaved);
      return {
        ...parsed,
        algoCodes: {} // purge old spoiled templates
      };
    }
  } catch (e) {
    console.error('Error loading stored state:', e);
  }
  return null;
}

const savedData = loadInitialState();

if (typeof document !== 'undefined') {
  const initialDark = savedData?.isDarkMode ?? false;
  if (initialDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Initialize default algo code map
const initialAlgoCodes: Record<string, string> = {};
const initialCanvasData: Record<string, { nodes: any[]; edges: any[] }> = {};

PROBLEMS.forEach((p) => {
  if (p.category === 'algorithm') {
    const starter = p.starterTemplate || p.defaultAlgoEnglish || '';
    const saved = savedData?.algoCodes?.[p.id];
    
    // Check if saved code is missing, matches reference solution, or contains old legacy spoiled scaffolding
    const isSpoiledScaffold = saved && (
      saved.includes('Initialize an empty hash map to store numbers') ||
      saved.includes('Describe retrieval logic, cache hit recency promotion') ||
      saved.includes('Initialize left and right window pointers') ||
      saved.includes('Compare height[left] and height[right] to decide') ||
      saved.includes('Initialize a Min-Heap and insert the head node') ||
      (p.solutionAlgoEnglish && saved.trim() === p.solutionAlgoEnglish.trim())
    );

    if (!saved || isSpoiledScaffold) {
      initialAlgoCodes[p.id] = starter;
    } else {
      initialAlgoCodes[p.id] = saved;
    }
  }
  if (p.category === 'system_design') {
    const starterNodes = p.defaultArchNodes || [];
    const starterEdges = p.defaultArchEdges || [];
    const saved = savedData?.canvasData?.[p.id];
    const isSavedSolution = Boolean(
      saved && p.solutionArchNodes && saved.nodes?.length >= p.solutionArchNodes.length
    );
    if (!saved || isSavedSolution) {
      initialCanvasData[p.id] = {
        nodes: starterNodes,
        edges: starterEdges
      };
    } else {
      initialCanvasData[p.id] = saved;
    }
  }
});

export const usePlatformStore = create<PlatformState>((set, get) => ({
  activeView: savedData?.activeView || 'landing',
  activeProblemId: savedData?.activeProblemId || 'algo-1',
  authenticatedUser: savedData?.authenticatedUser || null,
  authMode: 'login',
  isAuthModalOpen: false,
  algoCodes: initialAlgoCodes,
  canvasData: initialCanvasData,
  solvedProblemIds: savedData?.solvedProblemIds || ['algo-1'],
  algoEvaluations: savedData?.algoEvaluations || {},
  archEvaluations: savedData?.archEvaluations || {},
  isEvaluating: false,
  activeConsoleTab: 'matrix',
  isConsoleExpanded: false,
  filterCategory: 'all',
  filterDifficulty: 'all',
  searchQuery: '',
  selectedNodeId: null,
  isTestRunnerOpen: false,
  isDarkMode: savedData?.isDarkMode ?? false,
  streakCount: savedData?.streakCount ?? 1,
  bestStreak: savedData?.bestStreak ?? 1,
  lastActiveDate: savedData?.lastActiveDate ?? getTodayDateStr(),
  activityDates: savedData?.activityDates ?? [getTodayDateStr()],

  recordActivity: (customDateStr) => {
    const today = customDateStr || getTodayDateStr();
    const yesterday = getYesterdayDateStr();
    const state = get();
    const lastActive = state.lastActiveDate;

    let newStreak = state.streakCount;
    if (!lastActive) {
      newStreak = 1;
    } else if (lastActive === today) {
      newStreak = Math.max(state.streakCount, 1);
    } else if (lastActive === yesterday) {
      newStreak = state.streakCount + 1;
    } else {
      newStreak = 1;
    }

    const updatedActivityDates = Array.from(new Set([...(state.activityDates || []), today]));
    const updatedBest = Math.max(state.bestStreak || 1, newStreak);

    set({
      streakCount: newStreak,
      bestStreak: updatedBest,
      lastActiveDate: today,
      activityDates: updatedActivityDates
    });
    persist(get());

    if (state.authenticatedUser) {
      fetch('/api/user/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.authenticatedUser.email,
          date: today,
          streakCount: newStreak
        })
      }).catch((err) => console.warn('Could not sync streak with backend:', err));
    }
  },

  syncUserStreak: async () => {
    const user = get().authenticatedUser;
    if (!user) return;
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          set({
            streakCount: data.profile.streakCount ?? get().streakCount,
            bestStreak: data.profile.bestStreak ?? get().bestStreak,
            lastActiveDate: data.profile.lastActiveDate ?? get().lastActiveDate,
            activityDates: data.profile.activityDates ?? get().activityDates
          });
          persist(get());
        }
      }
    } catch (e) {
      console.warn('Failed to sync streak from server:', e);
    }
  },

  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    set({ isDarkMode: next });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', next);
    }
    persist(get());
  },
  setDarkMode: (dark) => {
    set({ isDarkMode: dark });
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', dark);
    }
    persist(get());
  },

  setActiveView: (view) => {
    set({ activeView: view });
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    persist(get());
  },

  setAuthMode: (mode) => set({ authMode: mode }),
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
  openAuth: (mode = 'login') => set({ isAuthModalOpen: true, authMode: mode }),

  authenticateUser: (email, handle, name, role) => {
    const defaultHandle = email.split('@')[0] || 'ENGINEER_01';
    const user = {
      email,
      handle: handle || defaultHandle,
      name: name || defaultHandle,
      role: role || 'Staff Software Engineer'
    };
    set({ authenticatedUser: user, isAuthModalOpen: false, activeView: 'dashboard' });
    get().recordActivity();
    get().syncUserStreak();
    persist(get());
  },

  logoutUser: () => {
    set({ authenticatedUser: null, activeView: 'landing' });
    persist(get());
  },

  setActiveProblem: (id) => {
    const prob = PROBLEMS.find((p) => p.id === id);
    if (!prob) return;

    const nextView: AppView = prob.category === 'algorithm' ? 'algo_workspace' : 'system_design_workspace';

    // ensure canvas data exists
    const currentCanvas = get().canvasData;
    if (!currentCanvas[id] && prob.category === 'system_design') {
      currentCanvas[id] = {
        nodes: prob.defaultArchNodes || [],
        edges: prob.defaultArchEdges || []
      };
    }

    set({
      activeProblemId: id,
      activeView: nextView,
      selectedNodeId: null,
      isConsoleExpanded: true
    });
    persist(get());
  },

  setAlgoCode: (problemId, code) => {
    set((state) => ({
      algoCodes: { ...state.algoCodes, [problemId]: code }
    }));
    persist(get());
  },

  setCanvasData: (problemId, nodes, edges) => {
    set((state) => ({
      canvasData: {
        ...state.canvasData,
        [problemId]: { nodes, edges }
      }
    }));
    persist(get());
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  updateNodeData: (problemId, nodeId, patch) => {
    set((state) => {
      const current = state.canvasData[problemId];
      if (!current) return state;

      const updatedNodes = current.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...patch,
              config: {
                ...node.data.config,
                ...patch.config
              }
            }
          };
        }
        return node;
      });

      return {
        canvasData: {
          ...state.canvasData,
          [problemId]: {
            ...current,
            nodes: updatedNodes
          }
        }
      };
    });
    persist(get());
  },

  setFilterCategory: (category) => set({ filterCategory: category }),
  setFilterDifficulty: (difficulty) => set({ filterDifficulty: difficulty }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setConsoleExpanded: (expanded) => set({ isConsoleExpanded: expanded }),
  setActiveConsoleTab: (tab) => set({ activeConsoleTab: tab }),

  runAlgoEvaluation: async (problemId) => {
    const prob = PROBLEMS.find((p) => p.id === problemId);
    if (!prob) throw new Error('Problem not found');

    set({ isEvaluating: true, isConsoleExpanded: true });

    const code = get().algoCodes[problemId] || '';
    let result: AlgoEvaluationResult;

    try {
      const response = await fetch('/api/evaluate-algo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: prob, codeText: code })
      });

      if (!response.ok) {
        throw new Error(`Vertex AI Server responded with status ${response.status}`);
      }

      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      result = json;
    } catch (err) {
      console.warn('Vertex AI evaluation unavailable or failed, falling back to local heuristic evaluator:', err);
      // Fallback to local heuristic evaluator
      result = evaluateAlgoEnglish(prob, code);
    }

    set((state) => {
      const nextSolved = result.passed && !state.solvedProblemIds.includes(problemId)
        ? [...state.solvedProblemIds, problemId]
        : state.solvedProblemIds;

      return {
        isEvaluating: false,
        algoEvaluations: {
          ...state.algoEvaluations,
          [problemId]: result
        },
        solvedProblemIds: nextSolved
      };
    });

    get().recordActivity();
    persist(get());
    return result;
  },

  runArchEvaluation: async (problemId) => {
    const prob = PROBLEMS.find((p) => p.id === problemId);
    if (!prob) throw new Error('Problem not found');

    set({ isEvaluating: true, isConsoleExpanded: true });

    const data = get().canvasData[problemId] || { nodes: [], edges: [] };
    let result: ArchitectureEvaluationResult;

    try {
      const response = await fetch('/api/evaluate-arch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: prob, nodes: data.nodes, edges: data.edges })
      });

      if (!response.ok) {
        throw new Error(`Vertex AI Server responded with status ${response.status}`);
      }

      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
      result = json;
    } catch (err) {
      console.warn('Vertex AI architecture evaluation unavailable or failed, falling back to local heuristic evaluator:', err);
      // Fallback to local heuristic evaluator
      result = evaluateArchitecture(prob, data.nodes, data.edges);
    }

    set((state) => {
      const nextSolved = result.passed && !state.solvedProblemIds.includes(problemId)
        ? [...state.solvedProblemIds, problemId]
        : state.solvedProblemIds;

      return {
        isEvaluating: false,
        archEvaluations: {
          ...state.archEvaluations,
          [problemId]: result
        },
        solvedProblemIds: nextSolved
      };
    });

    get().recordActivity();
    persist(get());
    return result;
  },

  resetProblem: (problemId) => {
    const prob = PROBLEMS.find((p) => p.id === problemId);
    if (!prob) return;

    set((state) => {
      const nextCodes = { ...state.algoCodes };
      const nextCanvas = { ...state.canvasData };

      if (prob.category === 'algorithm') {
        nextCodes[problemId] = prob.starterTemplate || prob.defaultAlgoEnglish || '';
      }
      if (prob.category === 'system_design') {
        nextCanvas[problemId] = {
          nodes: prob.defaultArchNodes || [],
          edges: prob.defaultArchEdges || []
        };
      }

      return {
        algoCodes: nextCodes,
        canvasData: nextCanvas,
        selectedNodeId: null
      };
    });
    persist(get());
  },

  loadSolution: (problemId) => {
    const prob = PROBLEMS.find((p) => p.id === problemId);
    if (!prob) return;

    set((state) => {
      if (prob.category === 'algorithm' && prob.solutionAlgoEnglish) {
        return {
          algoCodes: {
            ...state.algoCodes,
            [problemId]: prob.solutionAlgoEnglish
          }
        };
      }
      if (prob.category === 'system_design' && prob.solutionArchNodes) {
        return {
          canvasData: {
            ...state.canvasData,
            [problemId]: {
              nodes: prob.solutionArchNodes,
              edges: prob.solutionArchEdges || []
            }
          }
        };
      }
      return state;
    });
    persist(get());
  },

  setTestRunnerOpen: (open) => set({ isTestRunnerOpen: open })
}));

function persist(state: PlatformState) {
  try {
    const payload = {
      activeView: state.activeView,
      activeProblemId: state.activeProblemId,
      authenticatedUser: state.authenticatedUser,
      algoCodes: state.algoCodes,
      canvasData: state.canvasData,
      solvedProblemIds: state.solvedProblemIds,
      algoEvaluations: state.algoEvaluations,
      archEvaluations: state.archEvaluations,
      isDarkMode: state.isDarkMode,
      streakCount: state.streakCount,
      bestStreak: state.bestStreak,
      lastActiveDate: state.lastActiveDate,
      activityDates: state.activityDates
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Failed to persist to localStorage', e);
  }
}
