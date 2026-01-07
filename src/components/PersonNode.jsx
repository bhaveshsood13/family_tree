import React, { memo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserPlus, PlusSquare, Briefcase, Calendar, Edit3 } from 'lucide-react';

const PersonNode = ({ id, data, selected }) => {
  const fileInputRef = useRef(null);

  // Debug every render to see if photo data is actually here
  console.log(`[Node: ${data.name}] Photo Status: ${data.photo ? 'VALID (Length: ' + data.photo.length + ')' : 'EMPTY'}`);

  const handlePhotoClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('File read complete, calling onPhotoUpload');
        data.onPhotoUpload(id, reader.result);
      };
      reader.onerror = (error) => console.error('FileReader error:', error);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`person-node ${selected ? 'selected' : ''} ${data.gender}`}>
      <div className="node-content glass-panel">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={onFileChange}
        />

        <div className="photo-container" onClick={handlePhotoClick}>
          {data.photo ? (
            <img src={data.photo} alt={data.name} className="profile-photo" />
          ) : (
            <div className="photo-placeholder">
              <Edit3 size={24} className="pencil-icon" />
              <span className="upload-hint">Upload Photo</span>
            </div>
          )}
        </div>

        <div className="info" onClick={(e) => {
          e.stopPropagation();
          console.log('--- Modal Trigger Interaction ---');
          console.log('ID:', id);
          console.log('Callbacks Present:', !!data.onEdit);
          data.onEdit(id);
        }}>
          <h3 className="name">{data.name}</h3>
          <div className="metadata">
            <span className="lifespan">
              {data.birthYear} - {data.deathYear || 'Present'}
            </span>
            {data.occupation && (
              <span className="occupation">
                {data.occupation}
              </span>
            )}
          </div>
        </div>

        {/* Floating Actions on Selection/Hover */}
        {selected && (
          <div className="node-actions glass-panel">
            <button className="action-item spouse" onClick={(e) => { e.stopPropagation(); data.onAddSpouse(id) }}>
              <UserPlus size={14} />
              <span>Spouse</span>
            </button>
            <button className="action-item sibling" onClick={(e) => { e.stopPropagation(); data.onAddSibling(id) }}>
              <PlusSquare size={14} />
              <span>Sibling</span>
            </button>
            <button className="action-item child" onClick={(e) => { e.stopPropagation(); data.onAddChild(id) }}>
              <PlusSquare size={14} style={{ transform: 'rotate(90deg)' }} />
              <span>Child</span>
            </button>
          </div>
        )}
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" style={{ background: 'var(--rel-marriage)' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: 'var(--rel-marriage)' }} />

      <style jsx>{`
        .person-node {
          padding: 8px;
          min-width: 140px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .node-content {
          padding: 16px 12px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          position: relative;
          transition: transform 0.2s ease;
          border: 3px solid transparent;
          background: white;
          text-align: center;
          box-shadow: var(--shadow-sm);
        }

        .person-node.male .node-content { 
          border-color: #2563eb; 
          background: linear-gradient(135deg, white 0%, #dbeafe 100%);
        }
        .person-node.female .node-content { 
          border-color: #db2777; 
          background: linear-gradient(135deg, white 0%, #fce7f3 100%);
        }
        
        .person-node.selected .node-content {
          transform: scale(1.02);
          box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
        }

        .photo-container {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          background: #f8fafc;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid white;
          box-shadow: var(--shadow-sm);
          position: relative;
          transition: all 0.2s;
        }

        .photo-container:hover {
          transform: scale(1.05);
          box-shadow: var(--shadow-md);
        }

        .photo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
        }

        .pencil-icon { color: var(--primary); }
        .upload-hint { font-size: 10px; font-weight: 600; text-transform: uppercase; }

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .info {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        }

        .name {
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          color: var(--text-main);
        }

        .metadata {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 6px;
        }

        .lifespan, .occupation {
          font-size: 11px;
          color: var(--text-muted);
          font-weight: 500;
        }

        .node-actions {
          position: absolute;
          bottom: -25px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          background: white;
          padding: 8px 16px;
          border-radius: 40px;
          box-shadow: var(--shadow-lg);
          z-index: 100;
          border: 1px solid #e2e8f0;
        }

        .action-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .action-item span {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-item:hover { transform: scale(1.1); background: #f8fafc; }
        .action-item.spouse { color: #ef4444; }
        .action-item.sibling { color: #10b981; }
        .action-item.child { color: #3b82f6; }

        .react-flow__handle {
          width: 10px;
          height: 10px;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default memo(PersonNode);
