import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';

const MarriageNode = ({ id, data }) => {
    return (
        <div className="marriage-node-container group">
            {/* The main connection point (small visible dot) */}
            <div className="marriage-dot">
                <div className="heart-shape"></div>
            </div>

            {/* Hover Action: Add Child */}
            <div className="add-child-action">
                <button
                    className="action-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (data.onAddChild) data.onAddChild(id);
                    }}
                    title="Add Child"
                >
                    <Plus size={14} strokeWidth={3} />
                </button>
            </div>

            {/* Handles for routing connections */}
            {/* Target: Left (from Husband) */}
            <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
            {/* Source: Right (to Wife) */}
            <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
            {/* Source: Bottom (to Children) */}
            <Handle type="source" position={Position.Bottom} id="bottom" style={{ opacity: 0 }} />


        </div>
    );
};

export default memo(MarriageNode);
