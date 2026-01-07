import { ReactFlowProvider } from '@xyflow/react';
import TreeCanvas from './components/TreeCanvas';
import './index.css';
import '@xyflow/react/dist/style.css';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <TreeCanvas />
      </ReactFlowProvider>
    </div>
  );
}

export default App;
