import React from 'react';
import { BaseEdge } from '@xyflow/react';

const FamilyBusEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}) => {
  // 1. Spouse edges (horizontal straight line between husband / marriage / wife)
  if (Math.abs(sourceY - targetY) < 15) {
    const path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
    return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
  }

  // 2. Vertical bus calculation:
  // Must drop safely below source node, but stay at least 30px above target node's top handle (targetY)
  let busY;
  if (targetY > sourceY) {
    const idealBus = sourceY + 235;
    const maxBus = targetY - 30;
    if (idealBus < maxBus) {
      busY = idealBus;
    } else {
      busY = (sourceY + targetY) / 2;
    }
  } else {
    busY = (sourceY + targetY) / 2;
  }

  let path = '';
  if (Math.abs(sourceX - targetX) < 3) {
    // 100% Straight vertical line for single child directly below
    path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  } else {
    const r = 12; // Smooth corner radius
    const dirX = targetX > sourceX ? 1 : -1;
    path = [
      `M ${sourceX} ${sourceY}`,
      `L ${sourceX} ${busY - r}`,
      `Q ${sourceX} ${busY}, ${sourceX + dirX * r} ${busY}`,
      `L ${targetX - dirX * r} ${busY}`,
      `Q ${targetX} ${busY}, ${targetX} ${busY + r}`,
      `L ${targetX} ${targetY}`
    ].join(' ');
  }

  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
};

export default FamilyBusEdge;
