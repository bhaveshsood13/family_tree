import React from 'react';
import { Layers, Globe } from 'lucide-react';

const GenerationNavigator = ({
  generations = [],
  activeGen = null,
  onSelectGen,
}) => {
  return (
    <div className="generation-navigator">
      <div className="gen-nav-header">
        <Layers className="gen-nav-icon" size={16} />
        <span className="gen-nav-title">Generations</span>
      </div>

      <div className="gen-nav-list">
        {/* Top Button: Entire Tree */}
        <button
          className={`gen-nav-item entire-tree-item ${activeGen === null ? 'active' : ''}`}
          onClick={() => onSelectGen(null)}
          title="View entire family tree"
        >
          <Globe size={15} />
          <span>Entire Tree</span>
        </button>

        <div className="gen-elevator-shaft">
          <div className="gen-elevator-line" />
          {generations.map((g) => {
            const isActive = activeGen === g.gen;
            return (
              <button
                key={g.gen}
                className={`gen-nav-item gen-floor-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectGen(g.gen, g.y)}
                title={`Highlight Generation ${g.gen}`}
              >
                <div className="floor-badge">{g.gen}</div>
                <span className="floor-label">Gen {g.gen}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GenerationNavigator;
