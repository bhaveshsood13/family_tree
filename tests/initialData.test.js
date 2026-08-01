import { describe, it, expect } from 'vitest';
import { initialNodes, initialEdges } from '../src/store/initialData';

describe('Family Tree Dataset Integrity & Rules', () => {
  it('should contain initial nodes and edges', () => {
    expect(initialNodes.length).toBeGreaterThan(150);
    expect(initialEdges.length).toBeGreaterThan(150);
  });

  it('should lock Gautam Sood daughter name as Serena Sood', () => {
    const daughterNode = initialNodes.find(n => n.id === 'sanaya_sood');
    expect(daughterNode).toBeDefined();
    expect(daughterNode.data.name).toBe('Serena Sood');
  });

  it('should preserve pet names for key family members', () => {
    const virendra = initialNodes.find(n => n.id === 'virendra');
    const jatinder = initialNodes.find(n => n.id === 'jatinder');
    const ravinder = initialNodes.find(n => n.id === 'ravinder');

    expect(virendra?.data?.petName).toBe('Guddu');
    expect(jatinder?.data?.petName).toBe('Jiti');
    expect(ravinder?.data?.petName).toBe('Ram / Ramu');
  });

  it('should enforce 850px standardized generation vertical spacing', () => {
    const personYSet = new Set();
    initialNodes.forEach(n => {
      if (n.type === 'person') {
        personYSet.add(n.position.y);
      }
    });

    const sortedY = Array.from(personYSet).sort((a, b) => a - b);
    expect(sortedY.length).toBeGreaterThanOrEqual(7);

    // Verify 850px gaps between successive generation Y positions
    for (let i = 1; i < sortedY.length; i++) {
      const gap = sortedY[i] - sortedY[i - 1];
      expect(gap).toBe(850);
    }
  });

  it('should position all marriage nodes 30px below their husband card Y', () => {
    const marriageNodes = initialNodes.filter(n => n.type === 'marriage');
    expect(marriageNodes.length).toBeGreaterThan(10);

    const nodeMap = new Map(initialNodes.map(n => [n.id, n]));

    initialEdges.forEach(edge => {
      if (edge.sourceHandle === 'right' && edge.targetHandle === 'left') {
        const person = nodeMap.get(edge.source);
        const marriage = nodeMap.get(edge.target);
        if (person?.type === 'person' && marriage?.type === 'marriage') {
          expect(marriage.position.y).toBe(person.position.y + 30);
        }
      }
    });
  });
});
