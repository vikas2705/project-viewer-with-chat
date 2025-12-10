import { useState, useRef, useEffect } from 'react';
import Chat from './components/chat/Chat';
import FileViewer from './components/file-viewer/FileViewer';

function App() {
  const [leftWidth, setLeftWidth] = useState(50); // Default 50%
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const newLeftWidth = (e.clientX / containerWidth) * 100;
      
      // Constrain between 20% and 80% to prevent sections from becoming too small
      const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth));
      setLeftWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Left Section: Chat */}
      <div 
        className="h-full bg-white flex-shrink-0"
        style={{ width: `${leftWidth}%` }}
      >
        <Chat className="h-full w-full" />
      </div>
      
      {/* Draggable Divider */}
      <button
        type="button"
        aria-label="Resize panels"
        className="w-1 bg-black cursor-col-resize hover:bg-gray-800 transition-colors flex-shrink-0 relative group border-0 p-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onMouseDown={handleMouseDown}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            const delta = e.key === 'ArrowLeft' ? -5 : 5;
            setLeftWidth((prev) => Math.max(20, Math.min(80, prev + delta)));
          }
        }}
      >
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-transparent group-hover:bg-gray-600 transition-colors" />
      </button>
      
      {/* Right Section: File Viewer */}
      <div 
        className="h-full bg-white flex-shrink-0"
        style={{ width: `${100 - leftWidth}%` }}
      >
        <FileViewer />
      </div>
    </div>
  );
}

export default App;
