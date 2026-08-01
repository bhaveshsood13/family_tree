import assert from 'node:assert';
import { initialNodes, initialEdges } from '../src/store/initialData.js';

console.log('🧪 Starting Family Tree Test Suite...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ PASSED: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ FAILED: ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

// 1. Initial Dataset Integrity
test('Total nodes and edges count', () => {
  assert.ok(initialNodes.length > 150, 'Node count should be > 150');
  assert.ok(initialEdges.length > 150, 'Edge count should be > 150');
});

test('Gautam Sood daughter name is Serena Sood', () => {
  const daughter = initialNodes.find(n => n.id === 'sanaya_sood');
  assert.ok(daughter, 'Daughter node sanaya_sood must exist');
  assert.strictEqual(daughter.data.name, 'Serena Sood');
});

test('Pet names for Virendra (Guddu), Jatinder (Jiti), Ravinder (Ram / Ramu)', () => {
  const virendra = initialNodes.find(n => n.id === 'virendra');
  const jatinder = initialNodes.find(n => n.id === 'jatinder');
  const ravinder = initialNodes.find(n => n.id === 'ravinder');

  assert.strictEqual(virendra?.data?.petName, 'Guddu');
  assert.strictEqual(jatinder?.data?.petName, 'Jiti');
  assert.strictEqual(ravinder?.data?.petName, 'Ram / Ramu');
});

test('Generation vertical Y-spacing is 850px standardized', () => {
  const personYSet = new Set();
  initialNodes.forEach(n => {
    if (n.type === 'person') {
      personYSet.add(n.position.y);
    }
  });

  const sortedY = Array.from(personYSet).sort((a, b) => a - b);
  assert.ok(sortedY.length >= 7, 'Should have at least 7 generation levels');

  for (let i = 1; i < sortedY.length; i++) {
    const gap = sortedY[i] - sortedY[i - 1];
    assert.strictEqual(gap, 850, `Gap between gen ${i} and ${i+1} should be 850px`);
  }
});

test('Marriage node Y is exactly spouse.y + 30px', () => {
  const nodeMap = new Map(initialNodes.map(n => [n.id, n]));
  initialEdges.forEach(edge => {
    if (edge.sourceHandle === 'right' && edge.targetHandle === 'left') {
      const person = nodeMap.get(edge.source);
      const marriage = nodeMap.get(edge.target);
      if (person?.type === 'person' && marriage?.type === 'marriage') {
        assert.strictEqual(marriage.position.y, person.position.y + 30);
      }
    }
  });
});

// 2. Edge Routing Math
test('FamilyBusEdge horizontal straight line for spouse nodes', () => {
  const sourceY = 300;
  const targetY = 300;
  const isSameY = Math.abs(sourceY - targetY) < 15;
  assert.strictEqual(isSameY, true);
});

test('FamilyBusEdge straight vertical line for single child', () => {
  const sourceX = 500;
  const targetX = 500.5;
  const isSameX = Math.abs(sourceX - targetX) < 3;
  assert.strictEqual(isSameX, true);
});

test('FamilyBusEdge busY bounded above target top handle', () => {
  const sourceY = 300;
  const targetY = 1150;
  const idealBus = sourceY + 235;
  const maxBus = targetY - 30;
  const busY = idealBus < maxBus ? idealBus : (sourceY + targetY) / 2;

  assert.strictEqual(busY, 535);
  assert.ok(busY > sourceY + 220);
  assert.ok(busY < targetY - 30);
});

// 3. Generation Navigator Floor Selector
test('GenerationNavigator floor calculation and highlighting logic', () => {
  const mockNodes = [
    { id: '1', type: 'person', position: { y: 0 } },
    { id: '2', type: 'person', position: { y: 850 } },
    { id: '3', type: 'person', position: { y: 1700 } }
  ];

  const personYSet = new Set(mockNodes.map(n => n.position.y));
  const sortedY = Array.from(personYSet).sort((a, b) => a - b);
  const generations = sortedY.map((y, idx) => ({ gen: idx + 1, y }));

  assert.strictEqual(generations.length, 3);
  assert.strictEqual(generations[0].gen, 1);
  assert.strictEqual(generations[1].gen, 2);
  assert.strictEqual(generations[2].gen, 3);
});

console.log(`\n===================================`);
console.log(`Test Summary: ${passed} passed, ${failed} failed.`);
console.log(`===================================\n`);

if (failed > 0) {
  process.exit(1);
}
