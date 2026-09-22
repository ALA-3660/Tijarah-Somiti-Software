import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder, ExternalLink } from 'lucide-react';
import { FLUTTER_FILES } from '../data/dartCodeData';
import { DartFileItem } from '../types';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<DartFileItem>(FLUTTER_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[580px]">
      {/* File Sidebar */}
      <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50/70 p-3 flex flex-col shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          <Folder className="w-4 h-4 text-emerald-700" />
          <span>Flutter ডার্ট ফাইল তালিকা</span>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1 text-xs">
          {FLUTTER_FILES.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center gap-2 transition ${
                  isSelected
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-200' : 'text-slate-400'}`} />
                <span className="truncate">{file.name}</span>
                <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {file.layer}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-200 px-2 text-[11px] text-slate-500">
          মোট ডার্ট কোড ফাইল: <span className="font-bold text-slate-700">২২+ টি</span>
        </div>
      </div>

      {/* Code Editor Preview Area */}
      <div className="flex-1 flex flex-col bg-slate-950 text-slate-200 font-mono text-xs overflow-hidden">
        {/* Editor Top Bar */}
        <div className="h-11 px-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-emerald-400 font-bold">{selectedFile.layer}:</span>
            <span className="text-slate-400">{selectedFile.path}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans">কপি হয়েছে</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-sans">কোড কপি করুন</span>
              </>
            )}
          </button>
        </div>

        {/* File explanation banner */}
        <div className="px-4 py-2 bg-emerald-950/60 border-b border-emerald-900/40 text-emerald-200 font-sans text-xs flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{selectedFile.summary}</span>
        </div>

        {/* Code Content */}
        <div className="flex-1 p-4 overflow-x-auto overflow-y-auto leading-relaxed text-slate-300">
          <pre>
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
