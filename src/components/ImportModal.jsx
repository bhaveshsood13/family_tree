import React, { useState } from 'react';
import { Upload, Sparkles, Check, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImportModal = ({ isOpen, onClose, onImport }) => {
    const [step, setStep] = useState('upload'); // 'upload', 'scanning', 'review'
    const [extractedData, setExtractedData] = useState([]);

    const handleFileUpload = (e) => {
        setStep('scanning');
        // Simulate AI extraction delay
        setTimeout(() => {
            // Mock data based on the family_tree image
            const mockExtracted = [
                { name: 'Pran Nath Sood', birthYear: '1911', gender: 'male' },
                { name: 'Gyanwati Sood', birthYear: '1915', gender: 'female' },
                { name: 'Saroj Sood Kashyap', birthYear: '1937', gender: 'female' },
                { name: 'Vinod Sood Gopal', birthYear: '1939', gender: 'male' },
                { name: 'Indu Nath Sood', birthYear: '1942', gender: 'male' },
                { name: 'Virendra Mohan Sood', birthYear: '1944', gender: 'male' },
            ];
            setExtractedData(mockExtracted);
            setStep('review');
        }, 2500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="modal-content glass-panel import-modal"
            >
                <div className="modal-header">
                    <div className="title-group">
                        <Sparkles className="ai-icon" size={20} />
                        <h2>AI Family Import</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <AnimatePresence mode="wait">
                    {step === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="upload-step"
                        >
                            <div className="upload-zone">
                                <Upload size={48} className="upload-icon" />
                                <p>Upload a photo of your hand-drawn or printed family tree</p>
                                <input type="file" accept="image/*" onChange={handleFileUpload} />
                                <button className="btn-primary">Select Image</button>
                            </div>
                            <div className="tips">
                                <AlertCircle size={14} />
                                <span>AI will extract names, dates, and relationships automatically.</span>
                            </div>
                        </motion.div>
                    )}

                    {step === 'scanning' && (
                        <motion.div
                            key="scanning"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="scanning-step"
                        >
                            <div className="scanner-container">
                                <div className="scan-line"></div>
                                <div className="mock-tree-outline"></div>
                            </div>
                            <h3>Analyzing Family Tree...</h3>
                            <p>Our AI is identifying people and relationships</p>
                        </motion.div>
                    )}

                    {step === 'review' && (
                        <motion.div
                            key="review"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="review-step"
                        >
                            <p className="step-desc">We've extracted {extractedData.length} people. Please review and confirm.</p>
                            <div className="extraction-list">
                                {extractedData.map((person, i) => (
                                    <div key={i} className="extraction-item">
                                        <div className={`gender-dot ${person.gender}`}></div>
                                        <div className="item-info">
                                            <span className="name">{person.name}</span>
                                            <span className="year">{person.birthYear}</span>
                                        </div>
                                        <Check size={16} className="check-icon" />
                                    </div>
                                ))}
                            </div>
                            <div className="modal-footer">
                                <button className="cancel-btn" onClick={() => setStep('upload')}>Retry</button>
                                <button className="save-btn btn-primary" onClick={() => onImport(extractedData)}>
                                    Import Tree
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style jsx>{`
        .import-modal { max-width: 450px; }
        .title-group { display: flex; align-items: center; gap: 8px; }
        .ai-icon { color: var(--primary); }
        
        .upload-zone {
          border: 2px dashed #e2e8f0;
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          position: relative;
          cursor: pointer;
          transition: all 0.2s;
        }
        .upload-zone:hover { border-color: var(--primary); background: #f8fafc; }
        .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .upload-icon { color: var(--text-muted); margin-bottom: 16px; }
        
        .tips {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          background: #f0f9ff;
          border-radius: 8px;
          color: #0369a1;
          font-size: 12px;
        }

        .scanning-step {
          text-align: center;
          padding: 20px 0;
        }

        .scanner-container {
          width: 200px;
          height: 200px;
          background: #f1f5f9;
          margin: 0 auto 24px;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          top: 0;
          animation: scan 2s linear infinite;
        }

        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }

        .extraction-list {
          margin: 16px 0;
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .extraction-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .gender-dot { width: 8px; height: 8px; border-radius: 50%; }
        .gender-dot.male { background: var(--male); }
        .gender-dot.female { background: var(--female); }
        
        .item-info { flex: 1; display: flex; flex-direction: column; }
        .item-info .name { font-size: 14px; font-weight: 600; }
        .item-info .year { font-size: 12px; color: var(--text-muted); }
        .check-icon { color: #10b981; }

        .step-desc { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
      `}</style>
        </div>
    );
};

export default ImportModal;
