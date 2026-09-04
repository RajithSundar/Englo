import { Problem } from '../types';

export const PROBLEMS: Problem[] = [
  // ==================== ALGORITHM PROBLEMS (ALGO-ENGLISH) ====================
  {
    id: 'algo-1',
    title: 'Two Sum (Hash Inversion)',
    slug: 'two-sum',
    category: 'algorithm',
    difficulty: 'Easy',
    acceptanceRate: '54.2%',
    tags: ['Hash Table', 'Two Pointers', 'Array'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, describe an algorithm in **plain English** to return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

### Algo-English Instructions
Describe your approach step-by-step using clear, deterministic instructions. Detail:
1. The data structures you maintain (e.g., hash table mapping values to indices).
2. The lookup conditions (calculating complement \`target - current_number\`).
3. The expected time and space complexity ($O(N)$ time, $O(N)$ space).
4. Edge cases or termination conditions.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return indices [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6, return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
      'Optimal Solution must run in O(N) time without brute force quadratic checks.'
    ],
    hints: [
      'Can you avoid nested loops by trading space for speed with a hash map?',
      'As you iterate, calculate complement = target - num. Check if complement already exists in the map.',
      'If not found, record the current number and its index in the map.'
    ],
    starterTemplate: `Step 1: Data Structures
// Initialize an empty hash map to store numbers and their indices.

Step 2: Traversal & Complement Check
// Iterate through each number in the array.
// Calculate complement = target - current_number.
// If complement exists in map, return the pair of indices.
// Otherwise, insert current_number and index into the map.

Step 3: Edge Case / Termination
// If no valid pair is found after iterating, return an empty array.

Complexity:
// - Time Complexity:
// - Space Complexity:`,
    solutionAlgoEnglish: `Step 1: Initialize an empty hash map named "seen" where keys are array numbers and values are their 0-based indices.

Step 2: Iterate through the input list "nums" from index 0 to the end of the array, tracking the current element "current_num" and its index "i".

Step 3: In each iteration, calculate the required complement:
   complement = target - current_num

Step 4: Check if "complement" already exists as a key in "seen":
   - If YES: We have found our pair! Immediately return the pair of indices: [seen[complement], i].
   - If NO: Insert "current_num" into "seen" with its index "i" as the value, and proceed to the next iteration.

Step 5: If the iteration completes without finding any match, return an empty array or signal no valid pair exists.

Complexity Analysis:
- Time Complexity: O(N) because we traverse the list of N elements once, and hash map lookups take O(1) average time.
- Space Complexity: O(N) in the worst case to store up to N elements in the hash map.`,
    defaultAlgoEnglish: `Step 1: Data Structures
// Initialize an empty hash map to store numbers and their indices.

Step 2: Traversal & Complement Check
// Iterate through each number in the array.
// Calculate complement = target - current_number.
// If complement exists in map, return the pair of indices.
// Otherwise, insert current_number and index into the map.

Step 3: Edge Case / Termination
// If no valid pair is found after iterating, return an empty array.

Complexity:
// - Time Complexity:
// - Space Complexity:`
  },
  {
    id: 'algo-2',
    title: 'LRU Cache Eviction Policy',
    slug: 'lru-cache',
    category: 'algorithm',
    difficulty: 'Medium',
    acceptanceRate: '43.1%',
    tags: ['Hash Table', 'Doubly Linked List', 'Design'],
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) Cache**.

Describe how to implement the \`get\` and \`put\` operations such that both run in $O(1)$ average time complexity.

### Algo-English Instructions
Explain:
1. Why a standard hash map alone is insufficient and how pairing it with a Doubly Linked List solves $O(1)$ reordering.
2. The exact mechanism when reading a key (\`get\`).
3. The exact mechanism when inserting or updating a key (\`put\`), including evicting the node adjacent to the dummy tail when capacity is exceeded.`,
    examples: [
      {
        input: 'LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); cache.put(3, 3); // evicts key 2; cache.get(2); // returns -1',
        output: '[null, null, null, 1, null, -1]',
        explanation: 'Key 2 was evicted because key 1 was accessed by get(1), making key 2 the least recently used.'
      }
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'Both get and put must execute in strict O(1) time complexity.'
    ],
    hints: [
      'A hash map gives O(1) lookups, but does not maintain recency ordering.',
      'A doubly linked list allows removing a node and re-inserting it at the head in O(1) if you hold direct node references.'
    ],
    starterTemplate: `Data Structures:
// 1. Describe the Doubly Linked List nodes and how sentinel dummy head/tail nodes eliminate edge cases.
// 2. Describe the Hash Map mapping keys to Doubly Linked List node pointers.
// 3. Track integer capacity and current size.

Operation 1: Helper Methods
// Define helper operations: remove_node(node), add_to_head(node), move_to_head(node).

Operation 2: get(key)
// Describe retrieval logic, cache hit recency promotion, and handling misses (-1).

Operation 3: put(key, value)
// Describe inserting new keys, updating existing keys, and evicting the least recently used node (tail.prev) when capacity is exceeded.

Complexity:
// - Time Complexity: O(1) for both get and put.
// - Space Complexity: O(capacity).`,
    solutionAlgoEnglish: `Data Structures:
1. Maintain a Doubly Linked List with sentinel dummy "head" and dummy "tail" nodes to eliminate null pointer checks. The most recently used items reside near the head; the least recently used reside near the tail.
2. Maintain a Hash Map mapping each integer key directly to its corresponding Doubly Linked List Node reference.
3. Track an integer "capacity" and current "size".

Operation 1: Helper Methods
- "remove_node(node)": Link node.prev to node.next and node.next to node.prev.
- "add_to_head(node)": Insert node immediately between dummy head and head.next.
- "move_to_head(node)": Call remove_node(node) followed by add_to_head(node).

Operation 2: get(key)
- Check if key exists in the hash map.
- If NOT found: Return -1.
- If FOUND: Retrieve the node reference from the map, call move_to_head(node) to mark it as most recently used, and return node.value.

Operation 3: put(key, value)
- If key already exists in hash map:
    Update the existing node's value and call move_to_head(node).
- If key does NOT exist:
    Create a new node with (key, value).
    Add the key and new node pointer to the hash map.
    Call add_to_head(new_node) and increment size by 1.
    If size exceeds capacity:
        Identify the least recently used node which is tail.prev.
        Remove it from the linked list via remove_node(tail.prev).
        Delete its key from the hash map.
        Decrement size by 1.

Complexity:
- Time: O(1) for both get and put.
- Space: O(capacity) to store entries in the map and list.`,
    defaultAlgoEnglish: `Data Structures:
// 1. Describe the Doubly Linked List nodes and how sentinel dummy head/tail nodes eliminate edge cases.
// 2. Describe the Hash Map mapping keys to Doubly Linked List node pointers.
// 3. Track integer capacity and current size.

Operation 1: Helper Methods
// Define helper operations: remove_node(node), add_to_head(node), move_to_head(node).

Operation 2: get(key)
// Describe retrieval logic, cache hit recency promotion, and handling misses (-1).

Operation 3: put(key, value)
// Describe inserting new keys, updating existing keys, and evicting the least recently used node (tail.prev) when capacity is exceeded.

Complexity:
// - Time Complexity: O(1) for both get and put.
// - Space Complexity: O(capacity).`
  },
  {
    id: 'algo-3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring',
    category: 'algorithm',
    difficulty: 'Medium',
    acceptanceRate: '35.8%',
    tags: ['Sliding Window', 'Hash Set', 'String'],
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters using a plain-English algorithmic explanation.

### Key Aspects to Address
- How the sliding window expands using a right pointer.
- When and how the left pointer contracts to eliminate duplicates.
- Optimal index jumping using a character-to-last-seen-index map.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    hints: [
      'Use a sliding window defined by [left, right].',
      'Store the last seen index of each character in a map.',
      'When you see a duplicate at index right that occurred at or after left, jump left to last_seen[char] + 1.'
    ],
    starterTemplate: `Step 1: Pointers & State
// Initialize left and right window pointers, and a hash map for character positions.

Step 2: Sliding Window Traversal
// Expand the right pointer across string s.
// If the character is already seen and within the current window, jump the left pointer forward.
// Record the latest position of the character and track the maximum window length.

Step 3: Return
// Return the maximum window length observed.

Complexity:
// - Time Complexity:
// - Space Complexity:`,
    solutionAlgoEnglish: `Step 1: Initialize two integer pointers: "left = 0" and "right = 0".
Step 2: Initialize "max_len = 0" and an empty hash map "last_seen" to store each character and its most recent index.

Step 3: Loop "right" from index 0 to length(s) - 1:
   a. Let "char" be the character at s[right].
   b. If "char" is already in "last_seen" AND its recorded index is >= "left":
      Jump "left" forward to last_seen[char] + 1 to exclude the duplicate.
   c. Update last_seen[char] = right.
   d. Compute current window length as (right - left + 1).
   e. Update max_len = max(max_len, right - left + 1).

Step 4: When the loop finishes, return "max_len".

Complexity:
- Time: O(N) since each character is processed at most once by right pointer.
- Space: O(min(N, M)) where M is the character set size.`,
    defaultAlgoEnglish: `Step 1: Pointers & State
// Initialize left and right window pointers, and a hash map for character positions.

Step 2: Sliding Window Traversal
// Expand the right pointer across string s.
// If the character is already seen and within the current window, jump the left pointer forward.
// Record the latest position of the character and track the maximum window length.

Step 3: Return
// Return the maximum window length observed.

Complexity:
// - Time Complexity:
// - Space Complexity:`
  },
  {
    id: 'algo-4',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    category: 'algorithm',
    difficulty: 'Hard',
    acceptanceRate: '61.4%',
    tags: ['Two Pointers', 'Dynamic Programming', 'Monotonic Stack'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

Explain in plain English how the two-pointer approach calculates trapped water in a single pass without extra memory ($O(1)$ auxiliary space).`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The elevation map traps 6 units of rain water.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    hints: [
      'Water trapped above any bar is determined by min(max_left, max_right) - height[i].',
      'Can you advance the pointer that has the smaller maximum wall?'
    ],
    starterTemplate: `Step 1: Base Case & Two Pointers Setup
// Handle edge case where height has fewer than 3 elements.
// Initialize left pointer at 0 and right pointer at length - 1.
// Maintain max_left, max_right, and total_water tracking variables.

Step 2: Two-Pointer Traversal Logic
// While left < right:
// Compare height[left] and height[right] to decide which pointer to advance.
// Accumulate trapped water based on the limiting wall height.

Step 3: Return
// Return total_water trapped.

Complexity:
// - Time Complexity:
// - Space Complexity:`,
    solutionAlgoEnglish: `Step 1: If height array is empty or has length < 3, return 0 because at least 3 bars are needed to form a boundary.

Step 2: Initialize two pointers: "left = 0" and "right = length - 1".
Step 3: Maintain variables "max_left = 0", "max_right = 0", and "total_water = 0".

Step 4: While "left < right":
   - Compare height[left] and height[right]:
     * If height[left] <= height[right]:
         If height[left] >= max_left, update max_left = height[left].
         Else, water trapped is (max_left - height[left]). Add this to total_water.
         Increment left by 1.
     * Else (height[right] < height[left]):
         If height[right] >= max_right, update max_right = height[right].
         Else, water trapped is (max_right - height[right]). Add this to total_water.
         Decrement right by 1.

Step 5: Return total_water.

Complexity:
- Time: O(N) single pass.
- Space: O(1) constant extra variables.`,
    defaultAlgoEnglish: `Step 1: Base Case & Two Pointers Setup
// Handle edge case where height has fewer than 3 elements.
// Initialize left pointer at 0 and right pointer at length - 1.
// Maintain max_left, max_right, and total_water tracking variables.

Step 2: Two-Pointer Traversal Logic
// While left < right:
// Compare height[left] and height[right] to decide which pointer to advance.
// Accumulate trapped water based on the limiting wall height.

Step 3: Return
// Return total_water trapped.

Complexity:
// - Time Complexity:
// - Space Complexity:`
  },
  {
    id: 'algo-5',
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    category: 'algorithm',
    difficulty: 'Hard',
    acceptanceRate: '51.9%',
    tags: ['Min-Heap', 'Divide and Conquer', 'Linked List'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

Describe in plain English how to merge all the linked-lists into one sorted linked-list and return it using an optimal Min-Heap (Priority Queue) or Divide & Conquer strategy.`,
    examples: [
      {
        input: 'lists = [[1,4,5],[1,3,4],[2,6]]',
        output: '[1,1,2,3,4,4,5,6]',
        explanation: 'Merged into one sorted list.'
      }
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      '0 <= lists[i].length <= 500',
      'Total nodes <= 10^5'
    ],
    hints: [
      'A min-heap of size K keeps track of the smallest current element among all K lists in O(log K) time per extraction.',
      'Whenever an element from list i is extracted, push the next node from list i into the heap.'
    ],
    starterTemplate: `Step 1: Base Case
// Handle empty lists or null input array.

Step 2: Priority Queue / Min-Heap Setup
// Initialize a Min-Heap and insert the head node of each non-empty list.

Step 3: Extraction & Linkage
// While heap is not empty:
// Extract the minimum node, link it to the merged list, and push its next node into the heap.

Step 4: Return
// Return the head of the assembled merged list.

Complexity:
// - Time Complexity:
// - Space Complexity:`,
    solutionAlgoEnglish: `Step 1: Handle edge case: if lists is empty or all lists are null, return an empty list.

Step 2: Initialize a Min-Heap (Priority Queue) ordered by node values.
Step 3: Insert the head node of each of the k non-empty linked lists into the min-heap. The heap will contain at most k elements.

Step 4: Create a dummy head node and a "current" pointer initialized to dummy head.

Step 5: While the min-heap is not empty:
   a. Extract the minimum node from the heap (let this be "min_node").
   b. Attach "min_node" to current.next, and advance current = current.next.
   c. If min_node.next is not null, push min_node.next into the min-heap.

Step 6: Return dummy_head.next as the head of the merged sorted list.

Complexity:
- Time: O(N log k) where N is total number of nodes across all lists, and k is number of lists.
- Space: O(k) for the priority queue.`,
    defaultAlgoEnglish: `Step 1: Base Case
// Handle empty lists or null input array.

Step 2: Priority Queue / Min-Heap Setup
// Initialize a Min-Heap and insert the head node of each non-empty list.

Step 3: Extraction & Linkage
// While heap is not empty:
// Extract the minimum node, link it to the merged list, and push its next node into the heap.

Step 4: Return
// Return the head of the assembled merged list.

Complexity:
// - Time Complexity:
// - Space Complexity:`
  },

  // ==================== SYSTEM DESIGN PROBLEMS ====================
  {
    id: 'sys-1',
    title: 'Design a Global URL Shortener (TinyURL)',
    slug: 'tinyurl-system-design',
    category: 'system_design',
    difficulty: 'Easy',
    acceptanceRate: '68.5%',
    tags: ['Distributed Cache', 'Primary-Replica', 'NoSQL', 'Load Balancer'],
    description: `Design a scalable, highly available URL shortening service similar to **TinyURL** or **bit.ly**.

### Functional Requirements
1. **Shorten URL**: Given a long URL, return a unique 7-character short URL.
2. **Redirect URL**: Given a short URL, redirect users to the original URL with sub-15ms latency.
3. **High Availability**: Service must have 99.99% uptime with no single point of failure.

### Architectural Blueprint Requirements
On the canvas, assemble a complete distributed architecture:
- **Clients**: Browser and Mobile Apps.
- **Traffic Routing**: API Gateway and Load Balancer to distribute requests.
- **Compute**: Web Servers for URL generation and redirection logic.
- **Caching Layer**: Redis cache configured with LRU eviction to serve top 20% hot redirect URLs.
- **Persistence**: Relational or NoSQL database configured with Primary-Replica setup to support 100:1 read-to-write ratio.`,
    examples: [
      {
        input: 'User requests redirection for "bit.ly/xyz123"',
        output: '302 Found redirect to "https://verylongurl.com/path"',
        explanation: 'Cache hit in Redis returns destination in ~2ms. Cache miss fetches from Read Replica.'
      }
    ],
    constraints: [
      '500 million new URLs created per month (Write RPS ~200)',
      '50 billion redirections per month (Read RPS ~20,000, 100:1 read-heavy)',
      'Sub-20ms P99 redirect latency',
      'Zero single point of failure (SPOF)'
    ],
    hints: [
      'Add a CDN or API Gateway at the edge, followed by a Load Balancer distributing to redundant Web Servers.',
      'Place a Redis Cache in front of the database to handle the 20,000 read RPS without crashing the DB.',
      'Configure the database with Primary-Replica replication so read queries hit read replicas.'
    ],
    archScenarios: [
      {
        id: 'sc-1',
        name: 'Traffic Spike (50,000 req/s Read Burst)',
        description: 'Verifies that CDN/Cache layer absorbs 90%+ of read requests before hitting the database.',
        criteria: 'Requires Redis Cache or CDN connected to compute.'
      },
      {
        id: 'sc-2',
        name: 'Database Primary Node Failure',
        description: 'Simulates primary DB crash. Verifies Primary-Replica automated failover preserves read operations.',
        criteria: 'Requires SQL or NoSQL database with Primary-Replica mode enabled.'
      },
      {
        id: 'sc-3',
        name: 'Compute Redundancy & Load Balancing',
        description: 'Verifies no single point of failure in compute layer.',
        criteria: 'Requires Load Balancer connected to Web Servers with autoscaling/replicas >= 2.'
      },
      {
        id: 'sc-4',
        name: 'Client Ingress Flow',
        description: 'Ensures clients pass through network routing (Gateway / Load Balancer) before reaching servers.',
        criteria: 'Requires valid client-to-network edge connections.'
      }
    ],
    defaultArchNodes: [
      {
        id: 'node-client-1',
        type: 'systemNode',
        position: { x: 80, y: 160 },
        data: {
          id: 'node-client-1',
          label: 'Mobile App',
          category: 'client',
          subType: 'mobile',
          config: { notes: 'iOS & Android clients' },
          status: 'healthy',
          metrics: { rps: '12k', latency: '45ms' }
        }
      },
      {
        id: 'node-client-2',
        type: 'systemNode',
        position: { x: 80, y: 320 },
        data: {
          id: 'node-client-2',
          label: 'Web Browser',
          category: 'client',
          subType: 'browser',
          config: { notes: 'Desktop & Chrome users' },
          status: 'healthy',
          metrics: { rps: '8k', latency: '40ms' }
        }
      }
    ],
    defaultArchEdges: [],
    solutionArchNodes: [
      {
        id: 'node-client-1',
        type: 'systemNode',
        position: { x: 50, y: 150 },
        data: {
          id: 'node-client-1',
          label: 'Mobile App',
          category: 'client',
          subType: 'mobile',
          config: { notes: 'iOS & Android clients' },
          status: 'healthy',
          metrics: { rps: '12k', latency: '45ms' }
        }
      },
      {
        id: 'node-client-2',
        type: 'systemNode',
        position: { x: 50, y: 320 },
        data: {
          id: 'node-client-2',
          label: 'Web Browser',
          category: 'client',
          subType: 'browser',
          config: { notes: 'Desktop & Chrome users' },
          status: 'healthy',
          metrics: { rps: '8k', latency: '40ms' }
        }
      },
      {
        id: 'node-gateway',
        type: 'systemNode',
        position: { x: 280, y: 220 },
        data: {
          id: 'node-gateway',
          label: 'API Gateway',
          category: 'network',
          subType: 'api_gateway',
          config: { algorithm: 'Round Robin', capacityRps: 50000, notes: 'Rate limiting & SSL termination' },
          status: 'healthy',
          metrics: { rps: '20k', latency: '2ms' }
        }
      },
      {
        id: 'node-lb',
        type: 'systemNode',
        position: { x: 500, y: 220 },
        data: {
          id: 'node-lb',
          label: 'Load Balancer',
          category: 'network',
          subType: 'load_balancer',
          config: { algorithm: 'Least Connections', replicas: 2 },
          status: 'healthy',
          metrics: { rps: '20k', latency: '1ms' }
        }
      },
      {
        id: 'node-server',
        type: 'systemNode',
        position: { x: 730, y: 220 },
        data: {
          id: 'node-server',
          label: 'URL Service (Node/Go)',
          category: 'compute',
          subType: 'web_server',
          config: { replicas: 4, concurrency: 500, mode: 'Autoscaling' },
          status: 'healthy',
          metrics: { rps: '20k', latency: '8ms' }
        }
      },
      {
        id: 'node-cache',
        type: 'systemNode',
        position: { x: 980, y: 130 },
        data: {
          id: 'node-cache',
          label: 'Redis Cluster',
          category: 'storage',
          subType: 'redis_cache',
          config: { cachePolicy: 'LRU', ttlSeconds: 86400, mode: 'Cluster' },
          status: 'healthy',
          metrics: { rps: '16k', latency: '1.2ms' }
        }
      },
      {
        id: 'node-db',
        type: 'systemNode',
        position: { x: 980, y: 320 },
        data: {
          id: 'node-db',
          label: 'PostgreSQL DB',
          category: 'storage',
          subType: 'sql_db',
          config: { mode: 'Primary-Replica', replicas: 3, notes: '1 Primary (writes) + 2 Replicas (reads)' },
          status: 'healthy',
          metrics: { rps: '4k', latency: '6ms' }
        }
      }
    ],
    solutionArchEdges: [
      { id: 'e1', source: 'node-client-1', target: 'node-gateway', animated: true },
      { id: 'e2', source: 'node-client-2', target: 'node-gateway', animated: true },
      { id: 'e3', source: 'node-gateway', target: 'node-lb', animated: true },
      { id: 'e4', source: 'node-lb', target: 'node-server', animated: true },
      { id: 'e5', source: 'node-server', target: 'node-cache', animated: true },
      { id: 'e6', source: 'node-server', target: 'node-db', animated: true }
    ]
  },
  {
    id: 'sys-2',
    title: 'Design Instagram / Twitter Newsfeed',
    slug: 'instagram-newsfeed',
    category: 'system_design',
    difficulty: 'Medium',
    acceptanceRate: '41.2%',
    tags: ['Fan-out', 'Async Workers', 'CDN', 'Blob Storage', 'Cache'],
    description: `Design a scalable architecture for **Instagram Newsfeed** supporting 500 million active users.

### Requirements
- **Feed Generation**: Deliver user timeline feeds in under 200ms.
- **Media Ingestion**: Upload photos and videos securely to object storage via presigned URLs and CDN.
- **Fan-out Architecture**: Push-based feed precomputation for regular users, pull-based for celebrities with millions of followers.
- **Async Processing**: Background workers transcode images and distribute feed items asynchronously.`,
    examples: [
      {
        input: 'User with 500 followers posts a new photo',
        output: 'Photo uploaded to S3, Worker fans out post ID into 500 followers’ Redis feed lists.',
        explanation: 'Feed reads fetch from precomputed Redis lists in <10ms.'
      }
    ],
    constraints: [
      '500M Daily Active Users',
      'Average 50 feed views per user/day',
      'Median feed fetch latency < 150ms',
      'Photo upload and media processing durability'
    ],
    hints: [
      'Store media files in an Object Storage bucket (S3) fronted by a CDN.',
      'Use background Workers connected via queue/events to handle image resizing and fan-out.'
    ],
    archScenarios: [
      {
        id: 'sc-feed-1',
        name: 'Celebrity Fan-out Surge',
        description: 'Tests hybrid fan-out model when a user with 50M followers posts.',
        criteria: 'Requires Async Workers and Redis Cache.'
      },
      {
        id: 'sc-feed-2',
        name: 'Media Delivery Throughput',
        description: 'Tests if media is offloaded from web servers to CDN and S3.',
        criteria: 'Requires CDN connected to S3 Storage.'
      },
      {
        id: 'sc-feed-3',
        name: 'High Availability Feed Storage',
        description: 'Tests NoSQL database sharding and feed cache redundancy.',
        criteria: 'Requires NoSQL DB in Sharded mode and Redis Cache.'
      }
    ]
  },
  {
    id: 'sys-3',
    title: 'Design Real-Time Collaborative Document (Google Docs)',
    slug: 'realtime-google-docs',
    category: 'system_design',
    difficulty: 'Hard',
    acceptanceRate: '32.6%',
    tags: ['WebSockets', 'Operational Transformation', 'Pub/Sub', 'In-Memory'],
    description: `Design a real-time collaborative document editor like **Google Docs** supporting concurrent editing by hundreds of users on the same document.

### Requirements
- Low-latency keystroke synchronization (<50ms).
- Conflict resolution using Operational Transformation (OT) or CRDTs.
- Persistent document snapshotting and changelog replay.
- WebSocket stateful session gateways with Redis Pub/Sub backplane.`,
    examples: [
      {
        input: 'User A and User B type at index 5 simultaneously',
        output: 'OT server transforms operation B against operation A and broadcasts convergent state to all connected peers.',
        explanation: 'Both editors converge to the exact same document state.'
      }
    ],
    constraints: [
      'Sub-50ms sync latency',
      'Up to 100 concurrent collaborators per single document',
      'Zero data loss on server restart'
    ],
    hints: [
      'Use WebSockets at the Gateway layer with sticky sessions or Redis Pub/Sub backplane.',
      'Persist incremental edit operations in append-only storage and periodic snapshots in S3/SQL.'
    ]
  },
  {
    id: 'sys-4',
    title: 'Design a Global Rate Limiter & API Shield',
    slug: 'global-rate-limiter',
    category: 'system_design',
    difficulty: 'Medium',
    acceptanceRate: '49.0%',
    tags: ['Token Bucket', 'Redis', 'API Gateway', 'Security'],
    description: `Design a high-throughput, distributed rate limiter protecting microservices from denial of service attacks, bot scraping, and API quota abuse.

### Requirements
- Process over 1,000,000 requests per second with less than 2ms added latency overhead.
- Support Token Bucket or Leaky Bucket algorithms per client IP / API key.
- Shared state across multiple gateway nodes using Redis with atomic Lua scripts.`,
    examples: [
      {
        input: 'Client makes 101 requests within 60 seconds (Limit: 100/min)',
        output: 'HTTP 429 Too Many Requests with Retry-After header.',
        explanation: 'Redis token bucket decrements to 0, triggering rejection.'
      }
    ],
    constraints: [
      'Over 1M requests/sec capacity',
      '<2ms rate-limiting latency check',
      'High fault tolerance: allow-all on rate-limiter failure to prevent cascading outages'
    ],
    hints: [
      'Position the Rate Limiter inside or right behind the API Gateway.',
      'Use in-memory Redis cluster for atomic token counting.'
    ]
  },
  {
    id: 'sys-5',
    title: 'Design Netflix Global Video Streaming Platform',
    slug: 'netflix-video-streaming',
    category: 'system_design',
    difficulty: 'Hard',
    acceptanceRate: '38.7%',
    tags: ['CDN', 'Smart TV', 'Transcoder Worker', 'S3', 'NoSQL Cassandra'],
    description: `Design Netflix's video streaming architecture handling multi-device video delivery (Smart TV, Mobile, Web Browser) with adaptive bitrate streaming (HLS/DASH).

### Requirements
- Video ingestion, chunking, and distributed transcoding for hundreds of resolutions and codecs.
- Multi-CDN edge delivery (Open Connect) serving petabytes of video traffic directly to ISPs.
- Microservices for user recommendations, playback bookmarks, and user profiles.`,
    examples: [
      {
        input: 'User clicks play on Smart TV in Tokyo',
        output: 'Edge Open Connect CDN delivers 4K HDR chunk in 8ms with adaptive bitrate switching on network dip.',
        explanation: 'Playback state synchronized to NoSQL database.'
      }
    ],
    constraints: [
      '250+ Million subscribers worldwide',
      'Serve over 100M concurrent video streams during peak hours',
      'Zero video buffering / stuttering'
    ],
    hints: [
      'All 3 client types (Smart TV, Mobile, Browser) connect to edge CDNs.',
      'Original videos stored in S3, processed by asynchronous Worker clusters.'
    ]
  }
];
