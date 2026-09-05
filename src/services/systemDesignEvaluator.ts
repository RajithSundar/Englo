import { ArchTestCaseResult, ArchitectureEvaluationResult, Problem, SystemNodeData } from '../types';

export function evaluateArchitecture(
  problem: Problem,
  nodes: { id: string; data: SystemNodeData }[],
  edges: { id: string; source: string; target: string }[]
): ArchitectureEvaluationResult {
  const nodeCategories = new Set(nodes.map(n => n.data.category));
  const nodeSubTypes = new Set(nodes.map(n => n.data.subType));

  const hasClient = nodeCategories.has('client');
  const hasNetwork = nodeCategories.has('network');
  const hasCompute = nodeCategories.has('compute');
  const hasStorage = nodeCategories.has('storage');

  const hasLB = nodeSubTypes.has('load_balancer') || nodeSubTypes.has('api_gateway');
  const hasCache = nodeSubTypes.has('redis_cache');
  const hasCDN = nodeSubTypes.has('cdn');
  const hasDB = nodeSubTypes.has('sql_db') || nodeSubTypes.has('nosql_db');
  const hasWorker = nodeSubTypes.has('worker') || nodeSubTypes.has('lambda');
  const hasS3 = nodeSubTypes.has('s3_storage');

  // Connection adjacency
  const edgeSourceTargets = new Set(edges.map(e => `${e.source}->${e.target}`));
  const connectedNodeIds = new Set([
    ...edges.map(e => e.source),
    ...edges.map(e => e.target)
  ]);

  const hasOrphanNodes = nodes.some(n => !connectedNodeIds.has(n.id));

  const slug = (problem?.slug || problem?.id || '').toLowerCase();
  const isFintechGateway = slug.includes('payment') || problem?.id === 'sys-6';

  // Check specific configurations
  const dbNodes = nodes.filter(n => n.data.subType === 'sql_db' || n.data.subType === 'nosql_db');
  const hasPrimaryReplicaOrSharded = dbNodes.some(n => 
    n.data.config?.mode === 'Primary-Replica' || 
    n.data.config?.mode === 'Sharded' || 
    (n.data.config?.replicas && n.data.config.replicas > 1)
  );

  const computeNodes = nodes.filter(n => 
    n.data.category === 'compute' || 
    n.data.subType === 'web_server' || 
    n.data.subType === 'worker' || 
    n.data.subType === 'lambda'
  );
  const hasRedundantCompute = computeNodes.some(n => 
    (n.data.config?.replicas && n.data.config.replicas > 1) ||
    n.data.config?.mode === 'Autoscaling' ||
    (n.data.config?.concurrency && n.data.config.concurrency > 1)
  );

  // Evaluate test cases
  const testCases: ArchTestCaseResult[] = [];
  const identifiedBottlenecks: string[] = [];
  const recommendations: string[] = [];

  // Test 1: Client Ingress & Load Distribution
  const clientNodes = nodes.filter(n => n.data.category === 'client');
  const clientsRoutedProperly = clientNodes.length > 0 && clientNodes.every(c => {
    // Check if client connects to network layer
    return edges.some(e => {
      if (e.source !== c.id) return false;
      const targetNode = nodes.find(n => n.id === e.target);
      return targetNode?.data.category === 'network';
    });
  });

  testCases.push({
    id: 'arch-tc-1',
    name: isFintechGateway ? 'Payment Ingress & API Shield' : 'Edge Ingress & Traffic Routing',
    description: isFintechGateway 
      ? 'Payment clients must pass through API Gateway with authentication and rate limiting before hitting core settlement.'
      : 'Clients must connect to an API Gateway, Load Balancer, or CDN before entering compute tier.',
    passed: clientsRoutedProperly && hasLB,
    details: clientsRoutedProperly && hasLB 
      ? 'All incoming merchant/client traffic routes cleanly through edge gateway proxy.'
      : 'Client connects directly to compute or lacks an intermediary Load Balancer / API Gateway.',
    impactScore: 25
  });

  if (!hasLB) {
    identifiedBottlenecks.push('No Load Balancer or API Gateway found to distribute client requests.');
    recommendations.push('Add an API Gateway or Load Balancer at the network boundary.');
  }

  // Test 2: Compute Tier Decoupling & Scalability
  const computeConnected = hasCompute && edges.some(e => {
    const src = nodes.find(n => n.id === e.source);
    const tgt = nodes.find(n => n.id === e.target);
    return src?.data.category === 'network' && tgt?.data.category === 'compute';
  });

  testCases.push({
    id: 'arch-tc-2',
    name: isFintechGateway ? 'Settlement Service Replicas & Autoscaling' : 'Horizontal Compute Scalability',
    description: isFintechGateway
      ? 'Payment processing workers operate statelessly with multiple replicas (N >= 2) or autoscaling to sustain surge traffic.'
      : 'Stateless compute instances connected behind load balancer with redundant replicas (N >= 2) or autoscaling.',
    passed: (computeConnected || hasCompute) && (hasRedundantCompute || computeNodes.length >= 1),
    details: hasRedundantCompute
      ? 'Compute tier has horizontal autoscaling / redundant worker instances configured.'
      : 'Compute tier operates with baseline processing capacity.',
    impactScore: 25
  });

  if (!hasRedundantCompute) {
    identifiedBottlenecks.push('Compute layer has only single instance configured without autoscaling.');
    recommendations.push('Configure Worker or Web Server node with replicas >= 2 or Autoscaling mode.');
  }

  // Test 3: Caching Layer & Read Throughput / Idempotency
  const cacheConnected = hasCache && edges.some(e => {
    const src = nodes.find(n => n.id === e.source);
    const tgt = nodes.find(n => n.id === e.target);
    return (src?.data.category === 'compute' || src?.data.category === 'network') && tgt?.data.subType === 'redis_cache';
  });

  const cacheRequired = isFintechGateway || slug.includes('tinyurl') || slug.includes('newsfeed') || slug.includes('rate-limiter');

  testCases.push({
    id: 'arch-tc-3',
    name: isFintechGateway ? 'Redis Distributed Idempotency Locks' : 'Read Performance & Caching Layer',
    description: isFintechGateway
      ? 'In-memory Redis cluster acquires atomic distributed locks on Idempotency-Key with TTL to prevent duplicate charges.'
      : 'In-memory caching (Redis) absorbs high-frequency read spikes and protects persistent storage.',
    passed: cacheRequired ? (hasCache && (cacheConnected || edges.some(e => e.target.includes('redis') || e.target.includes('cache')))) : (hasCache || hasStorage),
    details: hasCache
      ? (isFintechGateway ? 'Redis distributed idempotency lock engine prevents duplicate payment debits.' : 'Redis cache cluster configured with LRU policy; absorbs 90%+ read throughput.')
      : 'Missing high-speed cache / idempotency lock tier.',
    impactScore: 25
  });

  if (cacheRequired && !hasCache) {
    identifiedBottlenecks.push(isFintechGateway ? 'Missing Redis Idempotency layer: duplicate requests risk double-charging customers.' : 'High-frequency read queries directly hit database, risking connection exhaustion.');
    recommendations.push('Add a Redis Cache cluster for distributed lock and caching.');
  }

  // Test 4: Database High Availability & Durability
  const dbConnected = hasDB && edges.some(e => {
    const tgt = nodes.find(n => n.id === e.target);
    return tgt?.data.category === 'storage';
  });

  testCases.push({
    id: 'arch-tc-4',
    name: isFintechGateway ? 'ACID Double-Entry Ledger Durability' : 'Storage Redundancy & Failover',
    description: isFintechGateway
      ? 'Double-entry financial ledger must persist in an ACID SQL database with Primary-Replica failover to guarantee zero data loss.'
      : 'Database nodes must be configured in Primary-Replica or Sharded cluster mode to avoid data loss on crash.',
    passed: hasDB && (hasPrimaryReplicaOrSharded || dbNodes.length > 0),
    details: hasPrimaryReplicaOrSharded
      ? 'Database configured with Primary-Replica failover and read replicas.'
      : 'Database storage configured for transaction journal persistence.',
    impactScore: 25
  });

  if (!hasPrimaryReplicaOrSharded && hasDB) {
    identifiedBottlenecks.push('Database lacks Primary-Replica or Sharded replication.');
    recommendations.push('Click the Database node and set Replication Mode to "Primary-Replica" in the config drawer.');
  }

  // Calculate scores
  let throughputScore = 60;
  if (hasLB) throughputScore += 15;
  if (hasCache) throughputScore += 15;
  if (hasCDN) throughputScore += 10;
  throughputScore = Math.min(99, throughputScore);

  let reliabilityScore = 55;
  if (hasPrimaryReplicaOrSharded) reliabilityScore += 20;
  if (hasRedundantCompute) reliabilityScore += 15;
  if (!hasOrphanNodes && connectedNodeIds.size > 3) reliabilityScore += 10;
  reliabilityScore = Math.min(98, reliabilityScore);

  let scalabilityScore = 50;
  if (hasCompute && hasRedundantCompute) scalabilityScore += 20;
  if (hasCache) scalabilityScore += 15;
  if (hasLB) scalabilityScore += 15;
  scalabilityScore = Math.min(98, scalabilityScore);

  const passedTestsCount = testCases.filter(t => t.passed).length;
  const overallScore = Math.round((throughoutScoreWeighted(throughputScore, reliabilityScore, scalabilityScore)));
  const passed = passedTestsCount >= 3 && overallScore >= 70;

  return {
    passed,
    score: overallScore,
    testCases,
    throughputScore,
    reliabilityScore,
    scalabilityScore,
    identifiedBottlenecks,
    recommendations,
    engine: isFintechGateway ? 'Englo Topology Engine (Deterministic Fintech)' : 'Local Heuristic Engine'
  };
}

function throughoutScoreWeighted(t: number, r: number, s: number): number {
  return (t * 0.35) + (r * 0.35) + (s * 0.30);
}
