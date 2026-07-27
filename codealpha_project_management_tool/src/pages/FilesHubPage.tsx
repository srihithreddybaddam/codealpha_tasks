import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  FileText, 
  Image as ImageIcon, 
  FileCode, 
  Paperclip, 
  Search, 
  Download, 
  Eye, 
  UploadCloud, 
  FolderCheck,
  Trash2,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface HubFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'code' | 'file';
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
}

export const FilesHubPage: React.FC = () => {
  const { currentProject } = useApp();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'image' | 'pdf' | 'code' | 'file'>('all');

  const [filesList, setFilesList] = useState<HubFile[]>([]);

  // Load per-user files from localStorage
  useEffect(() => {
    if (!user) return;
    const storageKey = `aether_user_files_${user.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setFilesList(JSON.parse(saved));
      } else {
        setFilesList([]);
      }
    } catch {
      setFilesList([]);
    }
  }, [user]);

  // Persist files
  useEffect(() => {
    if (!user) return;
    const storageKey = `aether_user_files_${user.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(filesList));
    } catch {
      // Storage safety
    }
  }, [filesList, user]);

  // Modal / Inline Editing
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'image' | 'pdf' | 'code' | 'file'>('pdf');
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingFileName, setEditingFileName] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-5 h-5 text-pink-400" />;
      case 'pdf': return <FileText className="w-5 h-5 text-rose-400" />;
      case 'code': return <FileCode className="w-5 h-5 text-cyan-400" />;
      default: return <Paperclip className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    const newFile: HubFile = {
      id: `f-${Date.now()}`,
      name: newFileName.trim(),
      type: newFileType,
      size: '1.5 MB',
      uploadedBy: user?.name || 'Workspace Owner',
      date: new Date().toISOString().split('T')[0],
      url: '#'
    };
    setFilesList((prev) => [newFile, ...prev]);
    setNewFileName('');
    setIsUploadOpen(false);
    showToast('success', 'File Uploaded', `${newFile.name} was added to ${currentProject?.name || 'Workspace'} Files Hub.`);
  };

  const handleDelete = (id: string, name: string) => {
    setFilesList((prev) => prev.filter((f) => f.id !== id));
    showToast('info', 'File Removed', `${name} deleted from workspace.`);
  };

  const handleStartRename = (file: HubFile) => {
    setEditingFileId(file.id);
    setEditingFileName(file.name);
  };

  const handleSaveRename = (id: string) => {
    if (!editingFileName.trim()) return;
    setFilesList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: editingFileName.trim() } : f))
    );
    setEditingFileId(null);
    showToast('success', 'File Renamed', `Updated filename to ${editingFileName.trim()}.`);
  };

  const filteredFiles = filesList.filter((f) => {
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeCategory !== 'all' && f.type !== activeCategory) return false;
    return true;
  });

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <FolderCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-100">{currentProject?.name || 'Workspace'}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                Files Hub ({filesList.length})
              </span>
            </div>
            <p className="text-xs text-slate-400">Centralized repository for design specs, code snippets, PDFs, and media assets</p>
          </div>
        </div>

        <button onClick={() => setIsUploadOpen(true)} className="glass-button-primary text-xs">
          <UploadCloud className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-9 w-full text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'image', label: 'Images' },
            { id: 'pdf', label: 'PDF Specs' },
            { id: 'code', label: 'Code Assets' },
            { id: 'file', label: 'Documents' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveCategory(chip.id as typeof activeCategory)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === chip.id
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredFiles.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 space-y-3 border border-white/10 hover:border-purple-500/40 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                {getFileIcon(file.type)}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  {file.type}
                </span>
                <button
                  onClick={() => handleDelete(file.id, file.name)}
                  className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {editingFileId === file.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editingFileName}
                    onChange={(e) => setEditingFileName(e.target.value)}
                    className="glass-input text-xs py-1 px-2 w-full"
                  />
                  <button onClick={() => handleSaveRename(file.id)} className="p-1 text-emerald-400">
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <h4 className="font-bold text-xs text-slate-100 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <button onClick={() => handleStartRename(file)} className="p-1 text-slate-500 hover:text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
              )}
              <p className="text-[10px] text-slate-400">{file.size} • Uploaded by {file.uploadedBy}</p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono">{file.date}</span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => showToast('info', 'File Preview', `Opening ${file.name} preview viewer.`)} 
                  className="p-1 rounded hover:bg-white/10 text-slate-300"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => showToast('success', 'Download Started', `Downloading ${file.name}`)}
                  className="p-1 rounded hover:bg-white/10 text-purple-300"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload File Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <div className="glass-modal w-full max-w-md p-6 space-y-4 border border-white/20 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-base text-slate-100">Upload New File</h3>
              <button onClick={() => setIsUploadOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter file name"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="glass-input w-full"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">File Category</label>
                <select
                  value={newFileType}
                  onChange={(e) => setNewFileType(e.target.value as any)}
                  className="glass-input w-full bg-slate-900"
                >
                  <option value="pdf">PDF Spec Document</option>
                  <option value="image">Image Mockup / Asset</option>
                  <option value="code">Code Snippet / Script</option>
                  <option value="file">General Document</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-white/20 text-center space-y-2 bg-white/5">
                <UploadCloud className="w-8 h-8 text-purple-400 mx-auto" />
                <p className="text-slate-300 font-semibold">Drag & drop files here or click to browse</p>
                <p className="text-[10px] text-slate-500 font-mono">Supports PDF, PNG, SVG, TS, GLSL, DOCX up to 50MB</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setIsUploadOpen(false)} className="glass-button-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="glass-button-primary text-xs">
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
