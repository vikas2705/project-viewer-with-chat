import React, { useMemo, useState, useCallback } from 'react';
import { fileTree, type FileNode } from './fileDefinitions';

/**
 * FileViewer component displays a file tree and code preview
 * Allows navigation through project files with syntax highlighting support
 */
const FileViewer: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ src: true });
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(() => 
    fileTree[0]?.children?.[0] ?? null
  );

  const flattenFiles = useMemo(() => {
    const files: Record<string, FileNode> = {}
    const walk = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'file') {
          files[node.id] = node
        } else if (node.children) {
          walk(node.children)
        }
      })
    }
    walk(fileTree)
    return files
  }, [])

  const toggleFolder = useCallback((id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleSelectFile = useCallback((node: FileNode) => {
    if (node.type === 'file') {
      setSelectedFile(node);
    }
  }, []);

  const renderTree = useCallback((nodes: FileNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      const paddingLeft = depth * 16;
      if (node.type === 'folder') {
        const isOpen = expanded[node.id];
        return (
          <div key={node.id} className="text-sm">
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              style={{ paddingLeft }}
              onClick={() => toggleFolder(node.id)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} folder ${node.name}`}
            >
              <span className="text-slate-400" aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
              <span>{node.name}</span>
            </button>
            {isOpen && node.children && (
              <div className="ml-3 border-l border-slate-200">
                {renderTree(node.children, depth + 1)}
              </div>
            )}
          </div>
        );
      }

      const isActive = selectedFile?.id === node.id;
      return (
        <button
          key={node.id}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
            isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-100'
          }`}
          style={{ paddingLeft: paddingLeft + 16 }}
          onClick={() => handleSelectFile(node)}
          aria-current={isActive ? 'true' : undefined}
          aria-label={`Select file ${node.name}`}
        >
          <span>{node.name}</span>
          {node.language && (
            <span className="text-xs uppercase tracking-wide text-slate-400">{node.language}</span>
          )}
        </button>
      );
    });
  }, [expanded, selectedFile, toggleFolder, handleSelectFile]);

  // const CodeBlock = ({ file }: { file: FileNode }) => {
  //   const code = file.content ?? '// No preview available'
  //   return (
  //     <pre className="h-full w-full overflow-auto rounded-2xl bg-slate-900 p-6 text-sm text-emerald-100 shadow-inner">
  //       <code>{code}</code>
  //     </pre>
  //   )
  // }


  const fileList = useMemo(() => Object.values(flattenFiles), [flattenFiles]);

  const handleRandomFile = useCallback(() => {
    if (fileList.length > 0) {
      const randomFile = fileList[Math.floor(Math.random() * fileList.length)];
      setSelectedFile(randomFile);
    }
  }, [fileList]);

  return (
    <div className="flex h-full w-full">
      
      <div className="w-72 flex-shrink-0 flex flex-col border-r border-gray-200 bg-slate-50/50">
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700">Project Files</h2>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-600">
              {fileList.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-2">{renderTree(fileTree)}</div>
        <div className="border-t border-gray-200 p-4">
          <button
            className="w-full rounded-lg border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 hover:shadow-sm transition-all"
            onClick={handleRandomFile}
            aria-label="Select a random file"
          >
            Random file
          </button>
        </div>
      </div>

     
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3 bg-white">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-slate-800">{selectedFile.name}</span>
                {selectedFile.language && (
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600 uppercase tracking-wide">
                    {selectedFile.language}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <pre 
                className="absolute inset-0 overflow-auto p-6 text-sm font-mono leading-relaxed text-slate-800 bg-slate-50"
                aria-label={`Content of ${selectedFile.name}`}
              >
                <code>{selectedFile.content ?? '// No preview available'}</code>
              </pre>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-slate-50 p-4 mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No file selected</h3>
            <p className="text-sm text-slate-500 max-w-xs">Select a file from the sidebar to view its contents.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileViewer;

