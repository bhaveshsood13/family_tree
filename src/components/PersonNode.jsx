import React, { memo, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { UserPlus, PlusSquare, Briefcase, Calendar, Edit3, Trash2, Baby } from 'lucide-react';

const DefaultMaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="profile-photo default-avatar male-avatar">
    <defs>
      <linearGradient id="maleBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dbeafe" />
        <stop offset="100%" stopColor="#93c5fd" />
      </linearGradient>
      <linearGradient id="maleUser" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#maleBg)" />
    <circle cx="50" cy="38" r="18" fill="url(#maleUser)" />
    <path d="M 33 36 C 33 22, 67 22, 67 36 C 63 26, 37 26, 33 36 Z" fill="#1e3a8a" />
    <path d="M 22 85 C 22 60, 34 54, 50 54 C 66 54, 78 60, 78 85 Z" fill="url(#maleUser)" />
    <polygon points="50,65 42,54 58,54" fill="#ffffff" opacity="0.4" />
  </svg>
);

const DefaultFemaleAvatar = () => (
  <svg viewBox="0 0 100 100" className="profile-photo default-avatar female-avatar">
    <defs>
      <linearGradient id="femaleBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fce7f3" />
        <stop offset="100%" stopColor="#fbcfe8" />
      </linearGradient>
      <linearGradient id="femaleUser" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#db2777" />
        <stop offset="100%" stopColor="#be185d" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#femaleBg)" />
    <path d="M 30 38 C 30 18, 70 18, 70 38 C 72 58, 66 68, 66 68 L 34 68 C 34 68, 28 58, 30 38 Z" fill="#9d174d" />
    <circle cx="50" cy="38" r="17" fill="url(#femaleUser)" />
    <path d="M 32 35 C 36 24, 48 24, 50 30 C 52 24, 64 24, 68 35 C 64 27, 52 27, 50 32 C 48 27, 36 27, 32 35 Z" fill="#831843" />
    <path d="M 24 85 C 24 60, 35 54, 50 54 C 65 54, 76 60, 76 85 Z" fill="url(#femaleUser)" />
  </svg>
);

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

  const formatLifespan = () => {
    if (data.deathYear) {
      return `${data.birthYear || ''}${data.birthYear ? ' - ' : ''}${data.deathYear}`;
    }
    if (data.isPresent) {
      return `${data.birthYear || ''}${data.birthYear ? ' - ' : ''}Present`;
    }
    if (data.isUnknownBirth || data.birthYear === 'Unknown') {
      return 'Birth Year Unknown';
    }
    if (data.birthYear) {
      return data.birthYear;
    }
    return '';
  };

  return (
    <div className={`person-node ${selected ? 'selected' : ''} ${data.gender} ${data.isDimmed ? 'dimmed-node' : ''} ${data.isHighlighted ? 'highlighted-gen-node' : ''}`}>
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
          ) : data.gender === 'female' ? (
            <DefaultFemaleAvatar />
          ) : (
            <DefaultMaleAvatar />
          )}
          <div className="photo-hover-overlay">
            <Edit3 size={16} className="pencil-icon" />
            <span className="upload-hint">Upload</span>
          </div>
        </div>

        <div className="info" onClick={(e) => {
          e.stopPropagation();
          console.log('--- Modal Trigger Interaction ---');
          console.log('ID:', id);
          console.log('Callbacks Present:', !!data.onEdit);
          data.onEdit(id);
        }}>
          <h3 className="name">{data.name}</h3>
          {data.petName && <div className="pet-name">({data.petName})</div>}
          <div className="metadata">
            {formatLifespan() && (
              <span className="lifespan">
                {formatLifespan()}
              </span>
            )}
            {data.occupation && (
              <span className="occupation">
                {data.occupation}
              </span>
            )}
          </div>
        </div>

        {/* Floating Actions on Selection/Hover */}
        <div className="actions-layer">
          {/* Top Right: Delete Node */}
          <button
            className="action-item-delete"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Delete this person?')) data.onDelete(id);
            }}
            title="Delete Person"
            aria-label="Delete Person"
          >
            <Trash2 size={16} />
          </button>

          {/* Bottom Actions: Sibling & Child */}
          <div className="node-actions glass-panel">
            <button className="action-item sibling" aria-label="Add Sibling" onClick={(e) => { e.stopPropagation(); data.onAddSibling(id) }}>
              <PlusSquare size={14} />
              <span>Sibling</span>
            </button>
            <div style={{ width: 1, height: 16, background: '#e2e8f0', margin: '0 4px' }} /> {/* Divider */}
            <button className="action-item child" aria-label="Add Child" onClick={(e) => { e.stopPropagation(); data.onAddChild(id) }}>
              <Baby size={14} />
              <span>Child</span>
            </button>
          </div>

          {/* Right Side Action: Add Spouse */}
          <div className="spouse-action-wrapper">
            <button
              className="action-item-spouse"
              onClick={(e) => { e.stopPropagation(); data.onAddSpouse(id) }}
              title="Add Spouse"
              aria-label="Add Spouse"
            >
              <UserPlus size={16} />
            </button>
            <span className="spouse-label">Spouse</span>
          </div>
        </div>
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="source" position={Position.Right} id="right" style={{ background: 'var(--rel-marriage)', top: '40px', right: '-5px', transform: 'translateY(-50%)' }} />
      <Handle type="target" position={Position.Left} id="left" style={{ background: 'var(--rel-marriage)', top: '40px', left: '-5px', transform: 'translateY(-50%)' }} />

    </div>
  );
};

export default memo(PersonNode);
