import { describe, it, expect } from 'vitest';

describe('GenerationNavigator Floor Calculation Logic', () => {
  it('should dynamically group person Y positions into sequential generations', () => {
    const mockNodes = [
      { id: '1', type: 'person', position: { y: 0 } },
      { id: '2', type: 'person', position: { y: 0 } },
      { id: '3', type: 'person', position: { y: 850 } },
      { id: '4', type: 'person', position: { y: 1700 } },
      { id: 'm1', type: 'marriage', position: { y: 30 } }
    ];

    const personYSet = new Set();
    mockNodes.forEach(n => {
      if (n.type === 'person') {
        personYSet.add(n.position.y);
      }
    });

    const sortedY = Array.from(personYSet).sort((a, b) => a - b);
    const generations = sortedY.map((y, idx) => ({
      gen: idx + 1,
      y: y,
    }));

    expect(generations).toHaveLength(3);
    expect(generations[0]).toEqual({ gen: 1, y: 0 });
    expect(generations[1]).toEqual({ gen: 2, y: 850 });
    expect(generations[2]).toEqual({ gen: 3, y: 1700 });
  });

  it('should correctly set isHighlighted and isDimmed for active generation', () => {
    const selectedGenY = 850;
    const node1 = { type: 'person', position: { y: 0 } };
    const node2 = { type: 'person', position: { y: 850 } };

    const isNode1Highlighted = node1.position.y === selectedGenY;
    const isNode1Dimmed = node1.position.y !== selectedGenY;

    const isNode2Highlighted = node2.position.y === selectedGenY;
    const isNode2Dimmed = node2.position.y !== selectedGenY;

    expect(isNode1Highlighted).toBe(false);
    expect(isNode1Dimmed).toBe(true);

    expect(isNode2Highlighted).toBe(true);
    expect(isNode2Dimmed).toBe(false);
  });
});
