import React, { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditModal = ({ person, isOpen, onClose, onSave, onDelete }) => {
    const [formData, setFormData] = useState(person || {});

    useEffect(() => {
        if (person) setFormData(person);
    }, [person]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-content glass-panel"
                >
                    <div className="modal-header">
                        <h2>Edit Person</h2>
                        <button className="close-btn" onClick={onClose}><X size={20} /></button>
                    </div>

                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="photo-upload-section">
                            <div className="photo-preview-large">
                                {formData.photo ? (
                                    <img src={formData.photo} alt="Preview" />
                                ) : (
                                    <div className="photo-placeholder-large"><Upload size={32} /></div>
                                )}
                                <label className="upload-label">
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                    Change Photo
                                </label>
                            </div>
                        </div>

                        <div className="form-grid">
                            <div className="field">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="field">
                                <label>Gender</label>
                                <select
                                    value={formData.gender || 'male'}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="field">
                                <label>Birth Year</label>
                                <input
                                    type="text"
                                    value={formData.birthYear || ''}
                                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                                    placeholder="e.g. 1950"
                                />
                            </div>
                            <div className="field">
                                <label>Death Year (if applicable)</label>
                                <input
                                    type="text"
                                    value={formData.deathYear || ''}
                                    onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                                    placeholder="e.g. 2020 or leave blank"
                                />
                            </div>
                            <div className="field full">
                                <label>Occupation</label>
                                <input
                                    type="text"
                                    value={formData.occupation || ''}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    placeholder="Worked as..."
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="delete-btn" onClick={() => onDelete(formData.id)}>
                                <Trash2 size={16} /> Delete
                            </button>
                            <div className="main-actions">
                                <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                                <button type="submit" className="save-btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>

            <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }

        .modal-content {
          width: 90%;
          max-width: 500px;
          border-radius: 24px;
          padding: 24px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-header h2 { font-size: 20px; font-weight: 700; color: var(--text-main); }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); }

        .photo-upload-section {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .photo-preview-large {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          border: 4px solid white;
          box-shadow: var(--shadow-md);
        }

        .photo-preview-large img { width: 100%; height: 100%; object-fit: cover; }
        .upload-label {
          position: absolute;
          bottom: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          font-size: 10px;
          padding: 4px 0;
          text-align: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .photo-preview-large:hover .upload-label { opacity: 1; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field.full { grid-column: span 2; }
        .field label { font-size: 12px; font-weight: 600; color: var(--text-muted); }
        .field input, .field select {
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .field input:focus { border-color: var(--primary); }

        .modal-footer {
          margin-top: 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .main-actions { display: flex; gap: 12px; }
        .cancel-btn { background: none; border: none; font-weight: 600; color: var(--text-muted); cursor: pointer; }
        .delete-btn { background: none; border: none; color: #ef4444; font-weight: 600; display: flex; align-items: center; gap: 6px; cursor: pointer; }
      `}</style>
        </AnimatePresence>
    );
};

export default EditModal;
