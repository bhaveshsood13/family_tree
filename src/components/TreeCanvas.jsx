import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    useReactFlow,
    Handle,
    Position
} from '@xyflow/react';
import PersonNode from './PersonNode';
import EditModal from './EditModal';
import ImportModal from './ImportModal';
import { initialNodes, initialEdges } from '../store/initialData';
import { getLayoutedElements } from '../utils/layout';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Plus, Layout, Move, Sparkles, Trash, Trash2, Undo, Redo, Printer, HelpCircle, RotateCcw } from 'lucide-react';

// Specialized Marriage Node (Invisible/Small Dot)
const MarriageNode = memo(() => (
    <div className="marriage-node">
        <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} id="bottom" />
        <style jsx>{`
      .marriage-node {
        width: 30px;
        height: 4px;
        background: #ef4444;
        border-radius: 0;
        position: relative;
        /* box-shadow: 0 0 0 2px white; removed for seamless look */
      }
    `}</style>
    </div>
));

const nodeTypes = {
    person: PersonNode,
    marriage: MarriageNode,
};

const TreeCanvas = () => {
    const [rfInstance, setRfInstance] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [history, setHistory] = useState({ past: [], future: [] });
    const [layoutMode, setLayoutMode] = useState('free');
    const [editingPerson, setEditingPerson] = useState(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const { fitView } = useReactFlow();

    // Load from localStorage on mount
    useEffect(() => {
        const savedNodes = localStorage.getItem('tf-nodes');
        const savedEdges = localStorage.getItem('tf-edges');
        if (savedNodes && savedEdges) {
            setNodes(JSON.parse(savedNodes));
            setEdges(JSON.parse(savedEdges));
        } else {
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [setNodes, setEdges]);

    // Save to localStorage on change
    useEffect(() => {
        if (nodes.length > 0) {
            try {
                localStorage.setItem('tf-nodes', JSON.stringify(nodes));
                localStorage.setItem('tf-edges', JSON.stringify(edges));
            } catch (e) {
                console.error('LocalStorage failed (size limit?):', e);
            }
        }
    }, [nodes, edges]);

    const recordHistory = useCallback(() => {
        setHistory(prev => ({
            past: [...prev.past.slice(-20), { nodes, edges }],
            future: []
        }));
    }, [nodes, edges]);

    const undo = () => {
        if (history.past.length === 0) return;
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, history.past.length - 1);
        setHistory({
            past: newPast,
            future: [{ nodes, edges }, ...history.future]
        });
        setNodes(previous.nodes);
        setEdges(previous.edges);
    };

    const redo = () => {
        if (history.future.length === 0) return;
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        setHistory({
            past: [...history.past, { nodes, edges }],
            future: newFuture
        });
        setNodes(next.nodes);
        setEdges(next.edges);
    };

    const onConnect = useCallback((params) => {
        recordHistory();
        setEdges((eds) => addEdge({ ...params, type: 'smoothstep', animated: true }, eds));
    }, [setEdges, recordHistory]);

    const toggleLayout = useCallback(() => {
        const newMode = layoutMode === 'free' ? 'auto' : 'free';
        setLayoutMode(newMode);
        if (newMode === 'auto') {
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
            setTimeout(() => fitView({ duration: 800 }), 50);
        }
    }, [layoutMode, nodes, edges, setNodes, setEdges, fitView]);

    const onAddChild = useCallback((parentId) => {
        recordHistory();
        const parentNode = nodes.find(n => n.id === parentId) || { position: { x: 500, y: 100 } };

        // Check if parent is part of a marriage (connected to a marriage node)
        const marriageEdge = edges.find(e => (e.source === parentId || e.target === parentId) && (e.target.startsWith('m-') || e.source.startsWith('m-') || e.target.includes('-m-') || e.id.includes('-m-')));
        let connectToId = parentId;
        let sourceHandle = 'bottom';

        if (marriageEdge) {
            // Find the marriage node ID
            const mNodeId = nodes.find(n => n.type === 'marriage' && (edges.some(e => (e.source === n.id && e.target === parentId) || (e.target === n.id && e.source === parentId))))?.id;
            // Simpler check: look for edge connecting parent to marriage node
            const marriageNode = nodes.find(n => n.type === 'marriage' && edges.some(e => (e.source === parentId && e.target === n.id) || (e.target === parentId && e.source === n.id)));
            if (marriageNode) {
                connectToId = marriageNode.id;
                sourceHandle = 'bottom';
            }
        }

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'person',
            position: { x: parentNode.position.x, y: parentNode.position.y + 200 },
            data: { name: 'New Child', gender: 'male' },
        };
        const newEdge = {
            id: `e-${connectToId}-${newNodeId}`,
            source: connectToId,
            target: newNodeId,
            type: 'smoothstep',
            sourceHandle: sourceHandle,
            targetHandle: 'top'
        };
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
    }, [nodes, edges, recordHistory]);

    const onAddSibling = useCallback((nodeId) => {
        recordHistory();
        const node = nodes.find(n => n.id === nodeId);
        const parentEdge = edges.find(e => e.target === nodeId && e.targetHandle === 'top');
        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'person',
            position: { x: node.position.x + 200, y: node.position.y },
            data: { name: 'New Sibling', gender: node.data.gender },
        };

        setNodes((nds) => nds.concat(newNode));

        if (parentEdge) {
            const newEdge = {
                id: `e-${parentEdge.source}-${newNodeId}`,
                source: parentEdge.source,
                target: newNodeId,
                type: 'smoothstep',
                sourceHandle: parentEdge.sourceHandle,
                targetHandle: 'top'
            };
            setEdges((eds) => eds.concat(newEdge));
        }
    }, [nodes, edges, recordHistory]);

    const onAddSpouse = useCallback((nodeId) => {
        recordHistory();
        const node = nodes.find(n => n.id === nodeId);
        const newNodeId = `node-${Date.now()}`;
        const spouseNode = {
            id: newNodeId,
            type: 'person',
            position: { x: node.position.x + 350, y: node.position.y },
            data: {
                name: 'New Spouse',
                gender: (node.data.gender || 'male') === 'male' ? 'female' : 'male'
            },
        };

        // Create Marriage Node at handle height (exactly centered for 4px height)
        // Centerline is roughly at 103. 4px height means y should be 103 - 2 = 101.
        const marriageNodeId = `m-${nodeId}-${newNodeId}`;
        const marriageNode = {
            id: marriageNodeId,
            type: 'marriage',
            position: { x: node.position.x + 240, y: node.position.y + 101 }, // Shifted x slightly back for wider node
            data: {},
        };

        setNodes((nds) => nds.concat(spouseNode, marriageNode));
        setEdges((eds) => eds.concat(
            {
                id: `e-${nodeId}-${marriageNodeId}`,
                source: nodeId,
                target: marriageNodeId,
                targetHandle: 'left',
                sourceHandle: 'right',
                type: 'straight',
                style: { stroke: '#ef4444', strokeWidth: 4 }
            },
            {
                id: `e-${marriageNodeId}-${newNodeId}`,
                source: marriageNodeId,
                target: newNodeId,
                sourceHandle: 'right',
                targetHandle: 'left',
                type: 'straight',
                style: { stroke: '#ef4444', strokeWidth: 4 }
            }
        ));
    }, [nodes, recordHistory]);

    const onEdit = useCallback((id) => {
        console.log('onEdit called for:', id);
        const node = nodes.find(n => n.id === id);
        setEditingPerson({ ...node.data, id });
        setIsEditModalOpen(true);
    }, [nodes]);

    const onPhotoUpload = useCallback((id, photoData) => {
        console.log('onPhotoUpload received data for:', id);
        recordHistory();
        setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, photo: photoData } } : node));
    }, [recordHistory]);

    const savePerson = useCallback((updatedData) => {
        recordHistory();
        setNodes((nds) => nds.map((node) => node.id === updatedData.id ? { ...node, data: { ...node.data, ...updatedData } } : node));
        setEditingPerson(null);
    }, [recordHistory]);

    const deletePerson = useCallback((id) => {
        recordHistory();
        setNodes((nds) => nds.filter(n => n.id !== id));
        setEdges((eds) => eds.filter(e => e.source !== id && e.target !== id));
        setEditingPerson(null);
    }, [recordHistory]);

    const exportImage = () => {
        const element = document.querySelector('.react-flow__viewport');
        toPng(element, { backgroundColor: '#f8fafc' }).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'family-tree.png';
            link.href = dataUrl;
            link.click();
        });
    };

    const handleAIImport = (data) => {
        recordHistory();
        const newNodes = data.map((person, i) => ({
            id: `ai-${i}-${Date.now()}`,
            type: 'person',
            position: { x: i * 250, y: 0 },
            data: { ...person }
        }));
        setNodes(newNodes);
        setEdges([]);
        setIsImportOpen(false);
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => fitView({ duration: 800 }), 100);
    };

    const resetToInitial = (skipConfirm = false) => {
        if (skipConfirm || window.confirm('Reset to the initial hand-drawn tree data? Current changes will be lost.')) {
            // Restore structure/layout but KEEP user edits (photos/names)
            const restoredNodes = initialNodes.map(initNode => {
                const existingNode = nodes.find(n => n.id === initNode.id);
                if (existingNode) {
                    return { ...initNode, data: existingNode.data };
                }
                return initNode;
            });

            setNodes(restoredNodes);
            setEdges(initialEdges);
            setHistory({ past: [], future: [] });
            localStorage.removeItem('tf-nodes');
            localStorage.removeItem('tf-edges');
            // Don't reload, just update state
        }
    };

    const clearTree = () => {
        if (window.confirm('Clear all data?')) {
            recordHistory();
            setNodes([]);
            setEdges([]);
            localStorage.removeItem('tf-nodes');
            localStorage.removeItem('tf-edges');
        }
    };

    const nodesWithCallbacks = useMemo(() => {
        return nodes.map(node => {
            if (node.type === 'marriage') return node;
            return {
                ...node,
                draggable: layoutMode === 'free',
                data: {
                    ...node.data,
                    onAddChild,
                    onAddSibling,
                    onAddSpouse,
                    onEdit,
                    onPhotoUpload
                }
            };
        });
    }, [nodes, layoutMode, onAddChild, onAddSibling, onAddSpouse, onEdit, onPhotoUpload]);

    return (
        <div className="canvas-container">
            <ReactFlow
                nodes={nodesWithCallbacks}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.05}
                maxZoom={1.5}
            >
                <Controls showInteractive={false} />
                <MiniMap zoomable pannable style={{ bottom: 100 }} />
                <Background variant="dots" gap={20} size={1} color="#cbd5e1" />

                <div className="canvas-toolbar glass-panel">
                    <div className="history-group">
                        <button className="icon-btn" onClick={undo} disabled={history.past.length === 0} title="Undo"><Undo size={16} /></button>
                        <button className="icon-btn" onClick={redo} disabled={history.future.length === 0} title="Redo"><Redo size={16} /></button>
                    </div>
                    <div className="divider"></div>
                    <div className="mode-toggle">
                        <button className={`mode-btn ${layoutMode === 'fixed' ? 'active' : ''}`} onClick={() => {
                            setLayoutMode('fixed');
                            resetToInitial(true); // Auto-reset without confirm
                        }}>Fixed</button>
                        <button className={`mode-btn ${layoutMode === 'free' ? 'active' : ''}`} onClick={() => {
                            setLayoutMode('free');
                            setNodes(nds => nds.map(n => ({ ...n, draggable: true })));
                        }}>Free</button>
                    </div>
                    <div className="divider"></div>
                    <button className="tool-btn ai" onClick={() => setIsImportOpen(true)}><Sparkles size={16} /> <span>AI Scan</span></button>
                    <button className="tool-btn" onClick={() => onAddChild('root')}><Plus size={16} /> <span>New</span></button>
                    <button className="tool-btn" onClick={() => {
                        const dataStr = JSON.stringify({ nodes, edges }, null, 2);
                        const blob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'family-tree.json';
                        a.click();
                    }}><Layout size={16} /> <span>Save JSON</span></button>
                    <button className="tool-btn" onClick={exportImage} title="Export Image"><Download size={16} /> <span>Export PNG</span></button>
                    <button className="tool-btn" onClick={() => window.print()} title="Print"><Printer size={16} /> <span>Print</span></button>
                    <button className="tool-btn" onClick={() => resetToInitial()} title="Reset to Initial"><RotateCcw size={16} /> <span>Reset</span></button>
                    <button className="tool-btn delete" onClick={clearTree} title="Clear All"><Trash2 size={16} /> <span>Clear</span></button>
                </div>
            </ReactFlow>

            {/* Title Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                textAlign: 'center',
                pointerEvents: 'none',
                width: '100%',
                maxWidth: '600px',
                padding: '0 20px'
            }}>
                <input
                    defaultValue="The Sood Family"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        fontSize: 'clamp(24px, 5vw, 32px)', // Responsive font size
                        fontWeight: '900',
                        color: '#1e293b',
                        textAlign: 'center',
                        width: '100%',
                        outline: 'none',
                        textShadow: '0 2px 10px rgba(255,255,255,0.8)',
                        pointerEvents: 'auto'
                    }}
                />
            </div>

            {/* Footer Signature */}
            <div style={{
                position: 'absolute',
                bottom: 15,
                right: 20,
                zIndex: 10,
                color: '#64748b',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '8px 16px',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
                pointerEvents: 'none',
                textAlign: 'right',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid rgba(255,255,255,0.5)'
            }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '2px' }}>
                    Made by Bhavesh Sood ❤️
                </div>
                <div style={{ fontSize: '10px', fontWeight: '500', opacity: 0.8 }}>
                    powered by Google AntiGravity AI
                </div>
            </div>

            {isEditModalOpen && (
                <EditModal
                    isOpen={isEditModalOpen}
                    person={editingPerson}
                    onSave={savePerson}
                    onDelete={deletePerson}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingPerson(null);
                    }}
                />
            )}
            <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImport={handleAIImport} />

            <style jsx>{`
        .canvas-container { 
          width: 100%; 
          height: 100%; 
          background: #f1f5f9;
          background-image: 
            radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0);
          background-size: 24px 24px;
        }
        .canvas-toolbar { 
          position: absolute; 
          top: 20px; 
          right: 20px; 
          z-index: 100; 
          padding: 8px; 
          border-radius: 16px; 
          display: flex; 
          align-items: center; 
          gap: 12px;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(20px);
          flex-wrap: wrap; /* Allow wrapping on small screens */
          max-width: 90vw; /* Prevent overflow */
          justify-content: flex-end;
        }
        .history-group { display: flex; gap: 4px; }
        .icon-btn { padding: 8px; border: none; background: transparent; cursor: pointer; color: var(--text-muted); border-radius: 8px; display: flex; align-items: center; justify-content: center;}
        .icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .icon-btn:not(:disabled):hover { background: #f1f5f9; color: var(--primary); }
        .divider { width: 1px; height: 24px; background: #e2e8f0; margin: 0 4px; }
        .mode-toggle { display: flex; background: #f1f5f9; padding: 3px; border-radius: 10px; }
        .mode-toggle button { padding: 6px 14px; border: none; background: transparent; border-radius: 8px; cursor: pointer; color: var(--text-muted); font-size: 13px; font-weight: 600; transition: all 0.2s; }
        .mode-toggle button.active { background: white; color: var(--primary); box-shadow: var(--shadow-sm); }
        .tool-btn { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: none; background: white; border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--text-main); border: 1px solid #e2e8f0; transition: all 0.2s; white-space: nowrap; }
        .tool-btn:hover { background: #f8fafc; transform: translateY(-1px); box-shadow: var(--shadow-sm); }
        .tool-btn.ai { background: var(--primary); color: white; border: none; }
        .tool-btn.delete:hover { border-color: #fee2e2; color: #ef4444; background: #fef2f2; }
        
        @media (max-width: 768px) {
            .canvas-toolbar {
                top: auto;
                bottom: 80px; /* Above signature */
                right: 50%;
                transform: translateX(50%);
                width: 90%;
                justify-content: center;
                gap: 8px;
            }
            .tool-btn span { display: none; } /* Hide text on mobile */
            .tool-btn { padding: 10px; }
            .mode-toggle button { padding: 6px 10px; font-size: 12px; }
        }
      `}</style>
        </div>
    );
};

export default TreeCanvas;
