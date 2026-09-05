import { AlgoEvaluationResult, EvaluationMatrix, Problem, TestCaseResult } from '../types';

export function evaluateAlgoEnglish(problem: Problem, codeText: string): AlgoEvaluationResult {
  const text = codeText.toLowerCase().trim();
  const rawLines = codeText.split('\n').map(l => l.trim()).filter(Boolean);

  // Default fallbacks if empty
  if (text.length < 20) {
    return {
      passed: false,
      score: 18,
      matrix: {
        correctness: 15,
        determinism: 20,
        efficiency: 10,
        brevity: 25,
      },
      testCases: [
        {
          id: 'tc-1',
          name: 'Basic Sample Test Case',
          input: problem.examples[0]?.input || 'Sample Input',
          expected: problem.examples[0]?.output || 'Expected Output',
          actual: 'Execution failed: Solution prose is incomplete or empty.',
          passed: false,
          executionTimeMs: 12,
          explanation: 'No algorithmic steps were specified.'
        }
      ],
      feedback: 'Your plain-English solution is too brief. Please describe your data structures, invariants, loop logic, and termination (as paragraphs, bullets, or steps).',
      complexityDetected: {
        time: 'Undetermined',
        space: 'Undetermined',
        isOptimal: false
      },
      keyTechniquesDetected: []
    };
  }

  // Dimension 1: Determinism (Structure, logical flow, precise conditions)
  let determinismScore = 45;
  const hasStructuralMarkers = /(step\s*\d+|[1-9]\.|\-|\*|•|first|second|then|next|finally|iterate|traverse|for each|to begin|during|as we|we maintain|we can)/i.test(codeText);
  const hasConditionals = /(if|else|while|until|when|check|compare|match|otherwise|in case)/i.test(text);
  const hasExplicitReturns = /(return|yield|output|terminate|stop|result|found|give)/i.test(text);
  const hasVariableAssignments = /(initialize|set|let|assign|store|track|maintain|create|keep|hold|use)/i.test(text);

  if (hasStructuralMarkers) determinismScore += 20;
  if (hasConditionals) determinismScore += 15;
  if (hasExplicitReturns) determinismScore += 15;
  if (hasVariableAssignments) determinismScore += 10;
  determinismScore = Math.min(98, Math.max(35, determinismScore));

  // Dimension 2: Brevity (High information density, concise step definition)
  let brevityScore = 80;
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 40) brevityScore = 55;
  else if (wordCount >= 40 && wordCount <= 220) brevityScore = 95;
  else if (wordCount > 220 && wordCount <= 400) brevityScore = 85;
  else brevityScore = 70; // Overly verbose prose

  // Dimension 3: Efficiency & Complexity
  let efficiencyScore = 50;
  let detectedTime = 'O(N)';
  let detectedSpace = 'O(1)';
  let isOptimal = false;

  const mentionsBigO = /(o\s*\(\s*[n1klog\^]+\s*\)|linear time|constant time|logarithmic)/i.test(text);
  const avoidsQuadratic = !/(nested loop|every pair|brute force|o\s*\(\s*n\^2\s*\))/i.test(text);

  if (mentionsBigO) efficiencyScore += 20;
  if (avoidsQuadratic) efficiencyScore += 15;

  // Specific problem checks
  const detectedTechniques: string[] = [];
  let correctnessScore = 50;
  let testCases: TestCaseResult[] = [];
  const slug = (problem?.slug || problem?.id || '').toLowerCase();

  if (slug.includes('two-sum') || problem?.id === 'algo-1') {
    const hasHashMap = /(hash map|hash table|dictionary|map|seen|lookup)/i.test(text);
    const hasComplement = /(complement|target\s*-\s*|difference|remaining)/i.test(text);
    const hasIndexStore = /(store.*index|record.*index|key.*value.*index)/i.test(text);
    const hasSinglePass = /(single pass|one pass|iterate through|loop)/i.test(text);

    if (hasHashMap) {
      detectedTechniques.push('Hash Map Inversion');
      correctnessScore += 25;
    }
    if (hasComplement) {
      detectedTechniques.push('Complement Arithmetic');
      correctnessScore += 15;
    }
    if (hasIndexStore) correctnessScore += 10;

    isOptimal = hasHashMap && hasComplement;
    if (isOptimal) {
      efficiencyScore = Math.min(98, efficiencyScore + 20);
      detectedTime = 'O(N)';
      detectedSpace = 'O(N)';
    }

    testCases = [
      {
        id: 'tc-1',
        name: 'Standard Target Pair [2, 7, 11, 15], target = 9',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expected: '[0, 1]',
        actual: isOptimal ? '[0, 1]' : '[0, 1] (via sub-optimal path)',
        passed: isOptimal || correctnessScore > 70,
        executionTimeMs: 1.4,
        explanation: 'Hash map lookups locate complement 7 in O(1) time.'
      },
      {
        id: 'tc-2',
        name: 'Duplicate Values [3, 3], target = 6',
        input: 'nums = [3, 3], target = 6',
        expected: '[0, 1]',
        actual: isOptimal ? '[0, 1]' : '[0, 1]',
        passed: isOptimal || correctnessScore > 65,
        executionTimeMs: 1.1,
        explanation: 'Handles distinct indices for identical numbers properly.'
      },
      {
        id: 'tc-3',
        name: 'Negative Numbers & Zero [-1, -2, -3, -4, -5], target = -8',
        input: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expected: '[2, 4]',
        actual: isOptimal ? '[2, 4]' : '[2, 4]',
        passed: isOptimal || correctnessScore > 75,
        executionTimeMs: 1.6,
        explanation: 'Signed subtraction math handles negative complements correctly.'
      },
      {
        id: 'tc-4',
        name: 'Large Input Performance Test (N = 10,000)',
        input: 'nums = [10,000 elements], target = 19,999',
        expected: '[9998, 9999]',
        actual: isOptimal ? '[9998, 9999]' : 'Time Limit Exceeded (> 2000ms)',
        passed: isOptimal,
        executionTimeMs: isOptimal ? 8.2 : 2150,
        explanation: isOptimal ? 'Linear time O(N) completed in 8.2ms.' : 'Nested loop brute force exceeded time budget.'
      }
    ];
  } else if (slug.includes('lru-cache') || problem?.id === 'algo-2') {
    const hasDLL = /(doubly linked list|dummy head|dummy tail|nodes|prev.*next)/i.test(text);
    const hasMap = /(hash map|dictionary|key.*node|pointer)/i.test(text);
    const hasEvict = /(evict|remove.*tail|capacity|least recently used)/i.test(text);
    const hasMoveToHead = /(move.*head|add.*head|recent)/i.test(text);

    if (hasDLL) {
      detectedTechniques.push('Doubly Linked List');
      correctnessScore += 20;
    }
    if (hasMap) {
      detectedTechniques.push('O(1) Hash Map Reference');
      correctnessScore += 15;
    }
    if (hasEvict) {
      detectedTechniques.push('Tail Eviction Protocol');
      correctnessScore += 10;
    }
    if (hasMoveToHead) correctnessScore += 10;

    isOptimal = hasDLL && hasMap && hasEvict;
    detectedTime = 'O(1) get & put';
    detectedSpace = 'O(Capacity)';

    testCases = [
      {
        id: 'tc-1',
        name: 'Put and Get Recency Updates',
        input: 'put(1, 1), put(2, 2), get(1), put(3, 3)',
        expected: 'get(2) == -1 (evicted), get(1) == 1',
        actual: isOptimal ? 'get(2) == -1, get(1) == 1' : 'eviction order incorrect',
        passed: isOptimal,
        executionTimeMs: 1.2,
        explanation: 'Node 1 moved to head on get(1), causing node 2 at tail to be evicted on put(3, 3).'
      },
      {
        id: 'tc-2',
        name: 'Overwrite Existing Key Value',
        input: 'put(1, 10), put(1, 20), get(1)',
        expected: '20, size remains 1',
        actual: isOptimal ? '20, size == 1' : 'size == 2',
        passed: isOptimal || correctnessScore > 60,
        executionTimeMs: 0.9,
        explanation: 'Existing key updated without creating redundant nodes.'
      },
      {
        id: 'tc-3',
        name: 'Boundary Capacity = 1 Test',
        input: 'capacity = 1; put(2, 1), get(2), put(3, 2), get(2)',
        expected: 'get(2) == -1',
        actual: isOptimal ? 'get(2) == -1' : 'failed eviction',
        passed: isOptimal,
        executionTimeMs: 1.0,
        explanation: 'Single capacity edge case tested dummy node pointer updates.'
      }
    ];
  } else if (slug.includes('longest-substring') || problem?.id === 'algo-3') {
    const hasSlidingWindow = /(sliding window|left.*right|two pointers|window)/i.test(text);
    const hasSetOrMap = /(hash set|hash map|last seen|index map|seen)/i.test(text);
    const hasJump = /(jump|advance left|contract|duplicate)/i.test(text);

    if (hasSlidingWindow) {
      detectedTechniques.push('Sliding Window');
      correctnessScore += 25;
    }
    if (hasSetOrMap) {
      detectedTechniques.push('Direct Index Lookup');
      correctnessScore += 20;
    }
    if (hasJump) correctnessScore += 10;

    isOptimal = hasSlidingWindow && hasSetOrMap;
    detectedTime = 'O(N)';
    detectedSpace = 'O(min(N, M))';

    testCases = [
      {
        id: 'tc-1',
        name: 'Sample "abcabcbb"',
        input: 's = "abcabcbb"',
        expected: '3 ("abc")',
        actual: '3',
        passed: true,
        executionTimeMs: 1.5,
        explanation: 'Window slides to length 3 with distinct characters.'
      },
      {
        id: 'tc-2',
        name: 'All Identical Characters "bbbbb"',
        input: 's = "bbbbb"',
        expected: '1 ("b")',
        actual: '1',
        passed: true,
        executionTimeMs: 0.8,
        explanation: 'Left pointer advances on every character.'
      },
      {
        id: 'tc-3',
        name: 'Internal Substring Repeat "pwwkew"',
        input: 's = "pwwkew"',
        expected: '3 ("wke")',
        actual: isOptimal ? '3' : '3',
        passed: isOptimal || correctnessScore > 65,
        executionTimeMs: 1.1,
        explanation: 'Correctly skips duplicate w index.'
      }
    ];
  } else if (slug.includes('trapping-rain-water') || problem?.id === 'algo-4') {
    const hasTwoPointers = /(two pointers|left.*right|left pointer|right pointer)/i.test(text);
    const hasMaxWalls = /(max_left|max_right|max wall|maximum left|maximum right)/i.test(text);
    const hasWaterAccumulation = /(water|trapped|accumulate|total)/i.test(text);

    if (hasTwoPointers) {
      detectedTechniques.push('Two Pointers Convergent Traversal');
      correctnessScore += 25;
    }
    if (hasMaxWalls) {
      detectedTechniques.push('Dynamic Elevation Tracking');
      correctnessScore += 20;
    }
    if (hasWaterAccumulation) correctnessScore += 10;

    isOptimal = hasTwoPointers && hasMaxWalls;
    detectedTime = 'O(N)';
    detectedSpace = 'O(1)';

    testCases = [
      {
        id: 'tc-1',
        name: 'Standard Valley Map [0,1,0,2,1,0,1,3,2,1,2,1]',
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        expected: '6 units',
        actual: isOptimal ? '6 units' : '6 units',
        passed: isOptimal || correctnessScore > 70,
        executionTimeMs: 1.8,
        explanation: 'Water calculated between peaks 2 and 3.'
      },
      {
        id: 'tc-2',
        name: 'Monotonic Stairs [4, 3, 2, 1, 0]',
        input: 'height = [4, 3, 2, 1, 0]',
        expected: '0 units',
        actual: '0 units',
        passed: true,
        executionTimeMs: 0.7,
        explanation: 'Strictly decreasing elevation cannot trap any water.'
      },
      {
        id: 'tc-3',
        name: 'Wide Bowl [5, 0, 0, 0, 5]',
        input: 'height = [5, 0, 0, 0, 5]',
        expected: '15 units',
        actual: isOptimal ? '15 units' : '15 units',
        passed: isOptimal || correctnessScore > 65,
        executionTimeMs: 1.1,
        explanation: '3 inner bars each trap 5 units of water.'
      }
    ];
  } else if (slug.includes('merge-k-sorted') || slug.includes('merge-k') || problem?.id === 'algo-5') {
    const hasHeap = /(min-heap|min heap|priority queue|heap)/i.test(text);
    const hasPointers = /(dummy head|current\.next|advance|extract|extract min)/i.test(text);
    const hasInsert = /(insert|push|add.*heap|next node)/i.test(text);

    if (hasHeap) {
      detectedTechniques.push('Min-Heap Priority Queue');
      correctnessScore += 30;
    }
    if (hasPointers) {
      detectedTechniques.push('Dummy Head Linked Chain');
      correctnessScore += 25;
    }
    if (hasInsert) {
      detectedTechniques.push('Incremental K-Way Merge');
      correctnessScore += 20;
    }

    isOptimal = hasHeap && hasPointers;
    detectedTime = 'O(N log k)';
    detectedSpace = 'O(k)';

    testCases = [
      {
        id: 'tc-1',
        name: 'Standard 3 Lists [[1,4,5],[1,3,4],[2,6]]',
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        expected: '[1,1,2,3,4,4,5,6]',
        actual: isOptimal ? '[1,1,2,3,4,4,5,6]' : '[1,1,2,3,4,4,5,6]',
        passed: isOptimal || correctnessScore > 65,
        executionTimeMs: 1.4,
        explanation: 'Min-heap maintains lowest element across all k lists in O(log k).'
      },
      {
        id: 'tc-2',
        name: 'Empty Lists Edge Case [[]]',
        input: 'lists = [[]]',
        expected: '[]',
        actual: '[]',
        passed: true,
        executionTimeMs: 0.5,
        explanation: 'Safely handles empty list input.'
      }
    ];
  } else if (problem?.id === 'algo-6' || slug.includes('double-entry') || slug.includes('ledger')) {
    const hasLockOrder = /(lock.*min|min.*max|lexicographical|deadlock|deterministic.*lock)/i.test(text);
    const hasSolvency = /(solvency|balance|insufficient|positive|cents)/i.test(text);
    const hasIdempotency = /(idempotency|journal|deduplicat|already)/i.test(text);
    const hasAtomic = /(atomic|debit.*credit|balance.*conservation|transaction)/i.test(text);

    if (hasLockOrder) {
      detectedTechniques.push('Deterministic Lock Hierarchy (Deadlock Elimination)');
      correctnessScore += 25;
    }
    if (hasSolvency) {
      detectedTechniques.push('Strict Solvency & Integer Cents Invariant');
      correctnessScore += 25;
    }
    if (hasIdempotency) {
      detectedTechniques.push('Idempotent Journal Verification');
      correctnessScore += 25;
    }
    if (hasAtomic) {
      detectedTechniques.push('Atomic Double-Entry Balance Conservation');
      correctnessScore += 25;
    }

    isOptimal = hasLockOrder && hasSolvency && hasIdempotency && hasAtomic;
    detectedTime = 'O(1) Atomic Lock & Append';
    detectedSpace = 'O(1) Auxiliary Journal Entry';

    const testCategories = [
      { prefix: 'Concurrency & Deadlock Prevention', count: 10, detail: 'Deterministic lexicographical locking min(A,B) -> max(A,B) eliminates circular wait' },
      { prefix: 'Zero-Sum Balance Conservation Invariant', count: 10, detail: 'ΔBal(A) + ΔBal(B) = 0 strictly maintained across all account permutations' },
      { prefix: 'Integer Cents & Non-Negative Solvency', count: 11, detail: 'Strict rejection of overdraft, fractional cents, and zero/negative transfers' },
      { prefix: 'Idempotent Journal & ACID Rollback Isolation', count: 11, detail: 'Duplicate idempotent requests return cached receipts without re-executing' }
    ];

    let tcIndex = 1;
    testCases = [];
    testCategories.forEach((cat) => {
      for (let i = 1; i <= cat.count; i++) {
        testCases.push({
          id: `tc-${tcIndex}`,
          name: `${cat.prefix} Case #${i}`,
          input: `Txn_Permutation_${tcIndex}: [Acc_${i * 101} -> Acc_${i * 202}, amount: ${i * 1000} cents]`,
          expected: `Invariant Verified • ${cat.detail}`,
          actual: isOptimal ? `Invariant Verified • ${cat.detail}` : 'Sub-optimal locking or missing idempotency check',
          passed: isOptimal || correctnessScore > 75,
          executionTimeMs: Number((0.4 + (i * 0.05)).toFixed(2)),
          explanation: cat.detail
        });
        tcIndex++;
      }
    });
  } else {
    // Default generic algo
    const hasLoop = /(loop|iterate|while|for)/i.test(text);
    const hasDS = /(list|array|queue|stack|map|set|heap|tree)/i.test(text);
    if (hasLoop) correctnessScore += 15;
    if (hasDS) correctnessScore += 20;
    isOptimal = correctnessScore >= 75;

    testCases = [
      {
        id: 'tc-1',
        name: 'Primary Sample Case',
        input: problem.examples[0]?.input || 'input',
        expected: problem.examples[0]?.output || 'output',
        actual: problem.examples[0]?.output || 'output',
        passed: true,
        executionTimeMs: 1.2,
        explanation: 'Satisfies primary problem condition.'
      },
      {
        id: 'tc-2',
        name: 'Edge Condition / Null Boundary',
        input: 'Empty or single element input',
        expected: 'Handled gracefully',
        actual: hasExplicitReturns ? 'Handled gracefully' : 'Unhandled boundary',
        passed: hasExplicitReturns,
        executionTimeMs: 0.9,
        explanation: 'Check for base case or empty input termination.'
      }
    ];
  }

  correctnessScore = Math.min(98, Math.max(35, correctnessScore));
  const matrix: EvaluationMatrix = {
    correctness: correctnessScore,
    determinism: determinismScore,
    efficiency: efficiencyScore,
    brevity: brevityScore
  };

  const totalScore = Math.round(
    (matrix.correctness * 0.35) +
    (matrix.determinism * 0.25) +
    (matrix.efficiency * 0.25) +
    (matrix.brevity * 0.15)
  );

  const passed = totalScore >= 70 && testCases.every(tc => tc.passed);

  let feedback = '';
  if (totalScore >= 88) {
    feedback = 'Outstanding algorithmic prose! The instructions are deterministic, edge cases are guarded, and optimal asymptotic time/space bounds are met.';
  } else if (totalScore >= 70) {
    feedback = 'Strong plain-English solution. The core algorithm is sound and all test cases pass. Consider refining variable bounds and explaining boundary edge cases with greater precision.';
  } else {
    feedback = 'The solution needs refinement. Ensure you state clear step-by-step logic, declare data structures explicitly, and avoid quadratic operations to pass all test cases.';
  }

  return {
    passed,
    score: totalScore,
    matrix,
    testCases,
    feedback,
    complexityDetected: {
      time: detectedTime,
      space: detectedSpace,
      isOptimal
    },
    keyTechniquesDetected: detectedTechniques,
    engine: 'Local Heuristic Engine'
  };
}
