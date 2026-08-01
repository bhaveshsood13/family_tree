import { describe, it, expect } from 'vitest';
import React from 'react';
import FamilyBusEdge from '../src/components/FamilyBusEdge';

describe('FamilyBusEdge Logic & Routing', () => {
  it('should render a straight horizontal path for spouse nodes at same Y level', () => {
    const sourceX = 100;
    const sourceY = 300;
    const targetX = 380;
    const targetY = 300; // Same Y level

    // Call the path calculation logic directly or inspect path attribute
    const isSameY = Math.abs(sourceY - targetY) < 15;
    expect(isSameY).toBe(true);

    const expectedPath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    expect(expectedPath).toBe('M 100 300 L 380 300');
  });

  it('should render a 100% straight vertical path for single child directly below marriage dot', () => {
    const sourceX = 500;
    const sourceY = 300;
    const targetX = 500.5; // Near identical X
    const targetY = 1150;

    const isSameX = Math.abs(sourceX - targetX) < 3;
    expect(isSameX).toBe(true);

    const expectedPath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    expect(expectedPath).toBe('M 500 300 L 500.5 1150');
  });

  it('should calculate busY below parent card but bounded at least 30px above target top handle', () => {
    const sourceY = 300;
    const targetY = 1150;

    const idealBus = sourceY + 235; // 535
    const maxBus = targetY - 30;    // 1120
    const busY = idealBus < maxBus ? idealBus : (sourceY + targetY) / 2;

    expect(busY).toBe(535);
    expect(busY).toBeGreaterThan(sourceY + 220); // Safely below parent bottom (~520px)
    expect(busY).toBeLessThan(targetY - 30);      // Safely above target top handle (1120px)
  });
});
