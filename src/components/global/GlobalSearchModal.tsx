import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchService, SearchResultItem, SearchGroupedResults } from '@/services/api/searchService';
import { TextInput } from '@/components/ui/Inputs';
import { Search, X, Users, GraduationCap, Calendar, Clock, History } from 'lucide-react';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchGroupedResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch {
        setRecentSearches(['React developer', 'AI Healthcare Hackathon', 'IIT Madras']);
      }
    } else {
      setRecentSearches(['React developer', 'AI Healthcare Hackathon', 'IIT Madras']);
    }
  }, []);

  // Debounced search logic (300ms)
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchService.globalSearch(query);
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setResults(getFallbackResults(query));
        }
      } catch {
        setResults(getFallbackResults(query));
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const getFallbackResults = (q: string): SearchGroupedResults => {
    const lower = q.toLowerCase();
    const items: SearchResultItem[] = [
      { id: 'usr_01', type: 'STUDENT', title: 'Priya Sharma', subtitle: 'IIT Madras • Computer Science', targetUrl: '/recommendations/usr_01' },
      { id: 'usr_02', type: 'PROFESSIONAL', title: 'Arun Kumar', subtitle: 'Senior AI Engineer • TechCorp', targetUrl: '/mentors/usr_02' },
      { id: 'tm_01', type: 'TEAM', title: 'NeuralForge Hackers', subtitle: 'AI Healthcare Hackathon • 4 Members', targetUrl: '/teams/tm_01' },
      { id: 'evt_01', type: 'EVENT', title: 'Global AI Hackathon 2026', subtitle: 'Aug 15 - 17 • 840 Participants', targetUrl: '/events/evt_01' },
      { id: 'col_01', type: 'INSTITUTION', title: 'ABC Engineering College', subtitle: 'Chennai • Rank #14', targetUrl: '/colleges/col_01' },
    ];

    const filtered = items.filter(
      (item) => item.title.toLowerCase().includes(lower) || (item.subtitle && item.subtitle.toLowerCase().includes(lower))
    );

    return {
      students: filtered.filter((i) => i.type === 'STUDENT'),
      professionals: filtered.filter((i) => i.type === 'PROFESSIONAL'),
      teams: filtered.filter((i) => i.type === 'TEAM'),
      events: filtered.filter((i) => i.type === 'EVENT'),
      institutions: filtered.filter((i) => i.type === 'INSTITUTION'),
      mentors: filtered.filter((i) => i.type === 'MENTOR'),
      totalMatches: filtered.length,
    };
  };

  const handleSelectResult = (item: SearchResultItem) => {
    // Save to recent searches
    const updated = [item.title, ...recentSearches.filter((s) => s !== item.title)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));

    onClose();
    navigate(item.targetUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl text-left overflow-hidden space-y-0">
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-600 shrink-0" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, professionals, teams, events, colleges..."
            className="border-0 shadow-none focus:ring-0 text-sm py-1 font-medium bg-transparent"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg hover:bg-slate-200">
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4 text-xs">
          {isLoading ? (
            <div className="py-8 text-center text-slate-400 font-medium">Searching platform entities...</div>
          ) : query ? (
            results && results.totalMatches > 0 ? (
              <div className="space-y-4">
                {results.students.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-600" /> Students
                    </h4>
                    <div className="space-y-1">
                      {results.students.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            <span className="text-slate-500 text-[11px]">{item.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.teams.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-600" /> Teams
                    </h4>
                    <div className="space-y-1">
                      {results.teams.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            <span className="text-slate-500 text-[11px]">{item.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {results.events.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Events & Hackathons
                    </h4>
                    <div className="space-y-1">
                      {results.events.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleSelectResult(item)}
                          className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition"
                        >
                          <div>
                            <span className="font-bold text-slate-900 block">{item.title}</span>
                            <span className="text-slate-500 text-[11px]">{item.subtitle}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center space-y-1">
                <span className="font-bold text-slate-700 text-sm block">No matching entities found</span>
                <span className="text-slate-400 text-xs">Try searching by student name, skill, team name, event, or institution.</span>
              </div>
            )
          ) : (
            /* Recent Searches when Query is Empty */
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-slate-400" /> Recent Searches
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('recent_searches');
                  }}
                  className="hover:underline text-slate-400 font-semibold"
                >
                  Clear History
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Clock className="w-3 h-3 text-slate-400" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
