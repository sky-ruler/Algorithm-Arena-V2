import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiClipboard, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import Card from '../components/Card';
import SkeletonCard from '../components/SkeletonCard';
import PageHeader from '../components/PageHeader';
import { api } from '../lib/api';

const starterByLanguage = {
  javascript: 'function solve(input) {\n  // TODO: implement\n  return input;\n}\n',
  python: 'def solve(data):\n    # TODO: implement\n    return data\n',
  java: 'class Solution {\n    public static void solve() {\n        // TODO: implement\n    }\n}\n',
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // TODO: implement\n    return 0;\n}\n',
};

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const draftKey = `challenge-draft:${id}`;

  const [repoUrl, setRepoUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(draftKey);
    if (!raw) return;
    try {
      const draft = JSON.parse(raw);
      setRepoUrl(draft.repoUrl || '');
      setCodeSnippet(draft.codeSnippet || '');
      setLanguage(draft.language || 'javascript');
    } catch {
      localStorage.removeItem(draftKey);
    }
  }, [draftKey]);

  useEffect(() => {
    const hasDraft = repoUrl.trim() || codeSnippet.trim();
    if (!hasDraft) {
      localStorage.removeItem(draftKey);
      return;
    }

    localStorage.setItem(
      draftKey,
      JSON.stringify({
        repoUrl,
        codeSnippet,
        language,
      })
    );
  }, [draftKey, repoUrl, codeSnippet, language]);

  const challengeQuery = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      const res = await api.get(`/api/challenges/${id}`);
      return res.data.data;
    },
  });

  const historyQuery = useQuery({
    queryKey: ['my-submissions', id],
    queryFn: async () => {
      const res = await api.get(`/api/submissions/my-submissions?challengeId=${id}&limit=8`);
      return res.data.data || [];
    },
  });

  const codeStats = useMemo(() => {
    const lines = codeSnippet ? codeSnippet.split('\n').length : 0;
    const characters = codeSnippet.length;
    return { lines, characters };
  }, [codeSnippet]);

  const handleInsertStarter = () => {
    const starter = starterByLanguage[language] || starterByLanguage.javascript;
    setCodeSnippet((prev) => (prev.trim() ? `${prev}\n${starter}` : starter));
  };

  const handleCopyCode = async () => {
    if (!codeSnippet.trim()) {
      toast.error('No code to copy yet');
      return;
    }
    try {
      await navigator.clipboard.writeText(codeSnippet);
      toast.success('Code copied');
    } catch {
      toast.error('Unable to copy code');
    }
  };

  const handleClearDraft = () => {
    setRepoUrl('');
    setCodeSnippet('');
    localStorage.removeItem(draftKey);
    toast.success('Draft cleared');
  };

  const handleSubmit = async () => {
    if (!repoUrl && !codeSnippet.trim()) {
      toast.error('Please provide code or a GitHub repository link.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/api/submissions', {
        challengeId: id,
        repositoryUrl: repoUrl.trim() || undefined,
        code: codeSnippet.trim() || undefined,
        language,
      });

      toast.success('Solution submitted successfully.');
      setRepoUrl('');
      setCodeSnippet('');
      localStorage.removeItem(draftKey);
      queryClient.invalidateQueries({ queryKey: ['my-submissions', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
      queryClient.invalidateQueries({ queryKey: ['profile-stats'] });
    } catch (err) {
      toast.error(err.userMessage || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (challengeQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mobile-stack">
        <SkeletonCard className="xl:col-span-2" />
        <SkeletonCard />
      </div>
    );
  }

  if (challengeQuery.isError || !challengeQuery.data) {
    return (
      <Card>
        <h2 className="text-xl font-bold mb-3">Challenge Not Available</h2>
        <p className="text-secondary mb-4">{challengeQuery.error?.userMessage || 'Failed to load challenge details.'}</p>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </Card>
    );
  }

  const challenge = challengeQuery.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={challenge.title}
        subtitle={`Difficulty: ${challenge.difficulty}   |   ${challenge.points} XP   |   ${challenge.category || 'General'}`}
        actions={
          <Link to="/dashboard" className="btn-secondary">
            Back to Missions
          </Link>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mobile-stack">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <h2 className="text-section-title font-bold mb-4">Problem Statement</h2>
            <div className="text-body leading-relaxed whitespace-pre-wrap text-primary">{challenge.description}</div>
          </Card>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h2 className="text-section-title font-bold">Your Recent Submissions</h2>
              <span className="text-secondary text-sm">{historyQuery.data?.length || 0} recent</span>
            </div>

            {historyQuery.isLoading ? (
              <div className="space-y-3">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : historyQuery.data?.length ? (
              <div className="space-y-3">
                {historyQuery.data.map((sub) => (
                  <div key={sub._id} className="border border-glass-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{new Date(sub.submittedAt).toLocaleString()}</p>
                      <p className="text-secondary text-sm">{sub.language || 'javascript'}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'Accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : sub.status === 'Rejected'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {sub.status}
                      </span>
                      <Link to={`/submission/${sub._id}`} className="block text-sm text-accent underline mt-2">
                        Open details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary">No submissions yet for this challenge.</p>
            )}
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-section-title font-bold mb-4">Submit Solution</h2>

            <label className="field-label">Language</label>
            <select className="field-select mb-4" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>

            <label className="field-label">GitHub Repository URL</label>
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              className="field-input mb-4"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />

            <div className="flex items-center justify-between mb-2">
              <label className="field-label m-0">Or Paste Code</label>
              <div className="text-secondary text-xs">
                {codeStats.lines} lines   |   {codeStats.characters} chars
              </div>
            </div>
            <textarea
              rows="12"
              placeholder="// Write your solution here..."
              className="field-textarea mb-4 font-mono text-sm"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="btn-secondary text-sm" onClick={handleInsertStarter}>
                <FiRefreshCw className="inline mr-1" />
                Starter
              </button>
              <button className="btn-secondary text-sm" onClick={handleCopyCode}>
                <FiClipboard className="inline mr-1" />
                Copy
              </button>
              <button className="btn-secondary text-sm" onClick={handleClearDraft}>
                <FiTrash2 className="inline mr-1" />
                Clear
              </button>
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Submitting...' : 'Submit Solution'}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
