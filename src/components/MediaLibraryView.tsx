import React, { useState } from 'react';
import { MEDIA_RESOURCES, MediaItem } from '../data/mediaCatalog.ts';
import { Video, BookOpen, Code2, GraduationCap, ExternalLink, Filter } from 'lucide-react';

export const MediaLibraryView: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedProvider, setSelectedProvider] = useState<string>('ALL');

  const filteredItems = MEDIA_RESOURCES.filter((item) => {
    if (selectedType !== 'ALL' && item.type !== selectedType) return false;
    if (selectedProvider !== 'ALL' && item.provider !== selectedProvider) return false;
    return true;
  });

  const getTypeIcon = (type: MediaItem['type']) => {
    switch (type) {
      case 'video_lecture':
        return <Video className="w-4 h-4 text-sky-400" />;
      case 'textbook':
        return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'interactive_course':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'code_lab':
        return <Code2 className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-lg space-y-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-400">
          <GraduationCap className="w-4 h-4" />
          <span>CANONICAL MEDIA &amp; FOUNDATIONAL LECTURES</span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Ivy League Lectures, Textbooks &amp; Karpathy Master Builds
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Verified academic companions supporting the 7,200-hour journey. Includes MIT and Stanford semester courses, interactive open-access textbooks, and the complete series of Andrej Karpathy minimal reference codebases.
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/50 border border-slate-800 rounded-lg text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Media Type:</span>
          {['ALL', 'video_lecture', 'textbook', 'interactive_course', 'code_lab'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded transition capitalize ${
                selectedType === t
                  ? 'bg-slate-800 text-white font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'ALL' ? 'All Formats' : t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-400">Provider:</span>
          {['ALL', 'MIT', 'Stanford', 'Karpathy', 'Fast.ai', 'Independent'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedProvider(p)}
              className={`px-2.5 py-1 rounded transition ${
                selectedProvider === p
                  ? 'bg-slate-800 text-white font-medium border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-4 bg-slate-900/70 border border-slate-800 rounded-lg hover:border-slate-700 transition flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-400">
                  [{item.moduleId}]
                </span>
                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400">
                  {getTypeIcon(item.type)}
                  <span>{item.durationOrLength}</span>
                </div>
              </div>

              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-white hover:text-sky-400 transition flex items-start justify-between gap-1 group"
              >
                <span className="line-clamp-2">{item.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 shrink-0 mt-0.5" />
              </a>

              {/* Zero-pill metadata text */}
              <div className="text-xs font-mono text-slate-400">
                <span>{item.provider}</span>
                <span className="mx-1.5 text-slate-600">·</span>
                <span className="capitalize">{item.type.replace('_', ' ')}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Key Curricular Topics</div>
              <div className="text-[11px] font-mono text-slate-400 line-clamp-2">
                {item.highlights.join(' · ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
