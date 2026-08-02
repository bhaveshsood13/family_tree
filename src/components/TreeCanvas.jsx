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
import MarriageNode from './MarriageNode';
import EditModal from './EditModal';
import ImportModal from './ImportModal';
import FamilyBusEdge from './FamilyBusEdge';
import GenerationNavigator from './GenerationNavigator';
import { initialNodes, initialEdges } from '../store/initialData';
import { fetchTree, saveTree } from '../api';
import { getLayoutedElements } from '../utils/layout';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Plus, Trash2, Undo, Redo, Printer, RotateCcw, LogOut, CloudUpload, Loader2, Sparkles } from 'lucide-react';

const nodeTypes = {
    person: PersonNode,
    marriage: MarriageNode,
};

const edgeTypes = {
    smoothstep: FamilyBusEdge,
    straight: FamilyBusEdge,
    familyBus: FamilyBusEdge,
};

const TreeCanvas = ({ onLogout }) => {
    const [rfInstance, setRfInstance] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [history, setHistory] = useState({ past: [], future: [] });
    const [layoutMode, setLayoutMode] = useState('free');
    const [editingPerson, setEditingPerson] = useState(null);
    const [activeGen, setActiveGen] = useState(null);
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
    const { fitView, fitBounds } = useReactFlow();

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

        let parentNode = nodes.find((n) => n.id === parentId);
        if (!parentNode) {
            // Standalone root node when '+ New' toolbar button is clicked
            const newNodeId = `n-${Date.now()}`;
            const newNode = {
                id: newNodeId,
                type: 'person',
                position: { x: 0, y: nodes.length > 0 ? Math.max(...nodes.map(n => n.position.y)) + 300 : 0 },
                data: { name: 'New Person', gender: 'male', birthYear: '' },
            };
            setNodes((nds) => nds.concat(newNode));
            return;
        }

        // Robust Marriage Detection:
        let marriageNodeId = null;
        const connectedEdges = edges.filter(e => e.source === parentId || e.target === parentId);

        for (const edge of connectedEdges) {
            const otherNodeId = edge.source === parentId ? edge.target : edge.source;
            const otherNode = nodes.find(n => n.id === otherNodeId);
            if (otherNode && otherNode.type === 'marriage') {
                marriageNodeId = otherNode.id;
                break;
            }
        }

        if (marriageNodeId) {
            const marriageNode = nodes.find(n => n.id === marriageNodeId);
            if (marriageNode) {
                parentNode = marriageNode;
            }
        }

        // Avoid overlap by spacing out horizontally if parent already has children
        const existingChildEdges = edges.filter(e => e.source === parentNode.id);
        const existingChildIds = existingChildEdges.map(e => e.target);
        const existingChildren = nodes.filter(n => existingChildIds.includes(n.id));

        let newX = parentNode.type === 'marriage' ? parentNode.position.x - 70 : parentNode.position.x;
        if (existingChildren.length > 0) {
            const maxX = Math.max(...existingChildren.map(n => n.position.x));
            newX = maxX + 250;
        }

        const newNodeId = `n-${Date.now()}`;
        const finalY = parentNode.position.y + 300;

        const newNode = {
            id: newNodeId,
            type: 'person',
            position: { x: newX, y: finalY },
            data: { name: 'New Child', gender: 'male' },
        };

        const newEdge = {
            id: `e-${parentNode.id}-${newNodeId}`,
            source: parentNode.id,
            target: newNodeId,
            sourceHandle: 'bottom',
            targetHandle: 'top',
            type: 'smoothstep',
            style: {
                stroke: '#8b5cf6',
                strokeWidth: 2,
                filter: 'drop-shadow(0 1px 2px rgba(139, 92, 246, 0.5))'
            }
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));

    }, [nodes, edges, recordHistory, setNodes, setEdges]);

    const onAddSibling = useCallback((nodeId) => {
        recordHistory();
        const node = nodes.find(n => n.id === nodeId);
        const parentEdge = edges.find(e => e.target === nodeId && e.targetHandle === 'top');
        const newNodeId = `node-${Date.now()}`;

        const position = node ? { x: node.position.x + 250, y: node.position.y } : { x: 0, y: 0 };

        const newNode = {
            id: newNodeId,
            type: 'person',
            position: position,
            data: { name: 'New Sibling', gender: node ? node.data.gender : 'male' },
        };

        setNodes((nds) => nds.concat(newNode));

        if (parentEdge) {
            const newEdge = {
                id: `e-${parentEdge.source}-${newNodeId}`,
                source: parentEdge.source,
                target: newNodeId,
                type: 'smoothstep',
                sourceHandle: parentEdge.sourceHandle,
                targetHandle: 'top',
                style: {
                    stroke: '#8b5cf6',
                    strokeWidth: 2,
                    filter: 'drop-shadow(0 1px 2px rgba(139, 92, 246, 0.5))'
                }
            };
            setEdges((eds) => eds.concat(newEdge));
        }
    }, [nodes, edges, recordHistory, setNodes, setEdges]);

    const onAddSpouse = useCallback((nodeId) => {
        recordHistory();
        const node = nodes.find((n) => n.id === nodeId);
        const isMale = node.data.gender === 'male';

        const newNodeId = `n-${Date.now()}`;
        const spouseNode = {
            id: newNodeId,
            type: 'person',
            position: { x: node.position.x + 400, y: node.position.y },
            data: { name: 'New Spouse', gender: isMale ? 'female' : 'male' },
        };

        const marriageNodeId = `m-${nodeId}-${newNodeId}`;
        const marriageNode = {
            id: marriageNodeId,
            type: 'marriage',
            position: { x: node.position.x + 200, y: node.position.y + 30 },
            data: {},
        };

        setNodes((nds) => nds.concat(spouseNode, marriageNode));
        setEdges((prev) => [
            ...prev,
            {
                id: `e-${nodeId}-${marriageNodeId}`,
                source: nodeId,
                target: marriageNodeId,
                targetHandle: 'left',
                sourceHandle: 'right',
                type: 'straight',
                style: { stroke: '#ef4444', strokeWidth: 3 }
            },
            {
                id: `e-${marriageNodeId}-${newNodeId}`,
                source: marriageNodeId,
                target: newNodeId,
                sourceHandle: 'right',
                targetHandle: 'left',
                type: 'straight',
                style: { stroke: '#ef4444', strokeWidth: 3 }
            }
        ]);
    }, [nodes, recordHistory, setNodes, setEdges]);

    const loadFromBackend = useCallback(async () => {
        try {
            const data = await fetchTree();
            if (data && data.nodes && data.nodes.length > 0) {
                setNodes(data.nodes);
                setEdges(data.edges);
            } else {
                setNodes(initialNodes);
                setEdges(initialEdges);
            }
        } catch (error) {
            console.error("Failed to load from backend, using initial data:", error);
            setNodes(initialNodes);
            setEdges(initialEdges);
        }
    }, [setNodes, setEdges]);

    useEffect(() => {
        loadFromBackend();
    }, [loadFromBackend]);

    const handleSaveToCloud = async () => {
        setSaveStatus('saving');
        try {
            await saveTree({ nodes, edges });
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);
        } catch (error) {
            console.error('Failed to save:', error);
            alert(`Failed to save to cloud: ${error.message || 'Unknown error'}`);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    const handleImportAI = useCallback((extractedPeople) => {
        recordHistory();
        const startY = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.y)) + 350 : 0;
        
        const newNodes = extractedPeople.map((p, idx) => ({
            id: `ai-${Date.now()}-${idx}`,
            type: 'person',
            position: { x: idx * 250, y: startY },
            data: {
                name: p.name,
                gender: p.gender || 'male',
                birthYear: p.birthYear || '',
            }
        }));

        setNodes((nds) => nds.concat(newNodes));
        setIsImportModalOpen(false);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }, [nodes, recordHistory, setNodes]);

    const onEdit = useCallback((id) => {
        const node = nodes.find(n => n.id === id);
        if (node) {
            setEditingPerson({ ...node.data, id });
            setIsEditModalOpen(true);
        }
    }, [nodes]);

    const onPhotoUpload = useCallback((id, photoData) => {
        recordHistory();
        setNodes((nds) => nds.map((node) => node.id === id ? { ...node, data: { ...node.data, photo: photoData } } : node));
    }, [recordHistory, setNodes]);

    const savePerson = useCallback((updatedData) => {
        recordHistory();
        setNodes((nds) => nds.map((node) => node.id === updatedData.id ? { ...node, data: { ...node.data, ...updatedData } } : node));
        setEditingPerson(null);
    }, [recordHistory, setNodes]);

    const deletePerson = useCallback((id) => {
        recordHistory();
        setNodes((nds) => nds.filter(n => n.id !== id));
        setEdges((eds) => eds.filter(e => e.source !== id && e.target !== id));
        setEditingPerson(null);
    }, [recordHistory, setNodes, setEdges]);

    const exportImage = () => {
        const element = document.querySelector('.react-flow__viewport');
        toPng(element, { backgroundColor: '#f8fafc' }).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'family-tree.png';
            link.href = dataUrl;
            link.click();
        });
    };

    const resetToSaved = useCallback(async (skipConfirm = false) => {
        if (skipConfirm || window.confirm('Reload the last saved version from the cloud? Unsaved changes will be lost.')) {
            await loadFromBackend();
            setHistory({ past: [], future: [] });
        }
    }, [loadFromBackend]);

    const clearTree = () => {
        if (window.confirm('Clear all data?')) {
            recordHistory();
            setNodes([]);
            setEdges([]);
        }
    };

    const generations = useMemo(() => {
        const personYSet = new Set();
        nodes.forEach(n => {
            if (n.type === 'person') {
                personYSet.add(n.position.y);
            }
        });
        const sortedY = Array.from(personYSet).sort((a, b) => a - b);
        return sortedY.map((y, idx) => ({
            gen: idx + 1,
            y: y,
        }));
    }, [nodes]);

    const handleSelectGen = useCallback((gen, genY) => {
        setActiveGen(gen);
        if (gen === null) {
            if (rfInstance && typeof rfInstance.fitView === 'function') {
                rfInstance.fitView({ duration: 800 });
            } else if (typeof fitView === 'function') {
                fitView({ duration: 800 });
            }
        } else {
            const genNodes = nodes.filter(n => n.type === 'person' && n.position.y === genY);
            if (genNodes.length > 0) {
                const xs = genNodes.map(n => n.position.x);
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const bounds = {
                    x: minX - 120,
                    y: genY - 80,
                    width: (maxX - minX) + 400,
                    height: 450
                };
                if (rfInstance && typeof rfInstance.fitBounds === 'function') {
                    rfInstance.fitBounds(bounds, { duration: 800, padding: 0.2 });
                } else if (typeof fitBounds === 'function') {
                    fitBounds(bounds, { duration: 800, padding: 0.2 });
                }
            }
        }
    }, [nodes, fitView, fitBounds, rfInstance]);

    const selectedGenY = useMemo(() => {
        if (activeGen === null) return null;
        const g = generations.find(item => item.gen === activeGen);
        return g ? g.y : null;
    }, [activeGen, generations]);

    const nodesWithCallbacks = useMemo(() => {
        const nodeMap = new Map(nodes.map(n => [n.id, structuredClone(n)]));

        // 1. Guarantee marriage node Y aligns with person side handle at top: 40px (y = person.y + 30)
        edges.forEach(e => {
            const sourceNode = nodeMap.get(e.source);
            const targetNode = nodeMap.get(e.target);
            if (sourceNode && targetNode) {
                if (sourceNode.type === 'person' && targetNode.type === 'marriage') {
                    targetNode.position = {
                        ...targetNode.position,
                        y: sourceNode.position.y + 30
                    };
                } else if (sourceNode.type === 'marriage' && targetNode.type === 'person') {
                    if (e.targetHandle === 'left' || e.targetHandle === 'right') {
                        sourceNode.position = {
                            ...sourceNode.position,
                            y: targetNode.position.y + 30
                        };
                    }
                }
            }
        });

        // 2. Guarantee single child top handle aligns with marriage dot center (child.x = mCenterX - 80)
        const marriageChildrenMap = new Map();
        edges.forEach(e => {
            if (e.sourceHandle === 'bottom') {
                const parent = nodeMap.get(e.source);
                const child = nodeMap.get(e.target);
                if (parent && parent.type === 'marriage' && child && child.type === 'person') {
                    if (!marriageChildrenMap.has(parent.id)) {
                        marriageChildrenMap.set(parent.id, []);
                    }
                    marriageChildrenMap.get(parent.id).push(child);
                }
            }
        });

        marriageChildrenMap.forEach((children, mId) => {
            const mNode = nodeMap.get(mId);
            if (mNode && children.length === 1) {
                const singleChild = children[0];
                const mCenterX = mNode.position.x + 10;
                singleChild.position = {
                    ...singleChild.position,
                    x: mCenterX - 80
                };
            }
        });

        return Array.from(nodeMap.values()).map(node => {
            if (selectedGenY !== null) {
                if (node.type === 'person') {
                    node.data.isHighlighted = node.position.y === selectedGenY;
                    node.data.isDimmed = node.position.y !== selectedGenY;
                } else if (node.type === 'marriage') {
                    node.data.isHighlighted = (node.position.y - 30) === selectedGenY;
                    node.data.isDimmed = (node.position.y - 30) !== selectedGenY;
                }
            } else {
                node.data.isHighlighted = false;
                node.data.isDimmed = false;
            }

            if (node.type === 'marriage') {
                node.data.onAddChild = onAddChild;
            } else {
                node.draggable = layoutMode === 'free';
                node.data.onAddChild = onAddChild;
                node.data.onAddSibling = onAddSibling;
                node.data.onAddSpouse = onAddSpouse;
                node.data.onEdit = onEdit;
                node.data.onPhotoUpload = onPhotoUpload;
                node.data.onDelete = deletePerson;
            }
            return node;
        });
    }, [nodes, edges, layoutMode, selectedGenY, onAddChild, onAddSibling, onAddSpouse, onEdit, onPhotoUpload, deletePerson]);

    return (
        <div className="canvas-container">
            <GenerationNavigator
                generations={generations}
                activeGen={activeGen}
                onSelectGen={handleSelectGen}
            />

            <ReactFlow
                nodes={nodesWithCallbacks}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
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
                            resetToSaved(true);
                        }}>Fixed</button>
                        <button className={`mode-btn ${layoutMode === 'free' ? 'active' : ''}`} onClick={() => {
                            setLayoutMode('free');
                            setNodes(nds => nds.map(n => ({ ...n, draggable: true })));
                        }}>Free</button>
                    </div>
                    <div className="divider"></div>
                    <button className="tool-btn" onClick={() => onAddChild('root')}><Plus size={16} /> <span>New</span></button>
                    <button className="tool-btn ai" onClick={() => setIsImportModalOpen(true)} title="AI Scan Import"><Sparkles size={16} /> <span>AI Scan</span></button>
                    <button className="tool-btn" onClick={handleSaveToCloud} disabled={saveStatus === 'saving'} title="Save to Cloud">
                        {saveStatus === 'saving' ? <Loader2 size={16} className="animate-spin" /> : 
                         saveStatus === 'success' ? <CloudUpload size={16} style={{ color: 'green' }} /> :
                         <CloudUpload size={16} />}
                        <span>{saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved' : saveStatus === 'error' ? 'Error' : 'Save'}</span>
                    </button>
                    <button className="tool-btn" onClick={exportImage} title="Export Image"><Download size={16} /> <span>Export PNG</span></button>
                    <button className="tool-btn" onClick={() => window.print()} title="Print"><Printer size={16} /> <span>Print</span></button>
                    <button className="tool-btn" onClick={() => resetToSaved()} title="Reload from Cloud"><RotateCcw size={16} /> <span>Reset</span></button>
                    <button className="tool-btn delete" onClick={clearTree} title="Clear All"><Trash2 size={16} /> <span>Clear</span></button>
                    <div className="divider"></div>
                    <button className="tool-btn" onClick={onLogout} title="Logout" style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}><LogOut size={16} /> <span>Exit</span></button>
                </div>
            </ReactFlow>

            {/* Title Overlay */}
            <div style={{
                position: 'absolute',
                top: 100,
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
                        fontSize: 'clamp(24px, 5vw, 40px)',
                        fontWeight: '900',
                        textAlign: 'center',
                        width: '100%',
                        outline: 'none',
                        pointerEvents: 'auto',
                        backgroundImage: 'linear-gradient(to right, #2563eb, #db2777, #ea580c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
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

            {isImportModalOpen && (
                <ImportModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImportAI}
                />
            )}
        </div>
    );
};

export default TreeCanvas;

