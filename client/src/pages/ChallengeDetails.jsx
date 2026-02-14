import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import SkeletonCard from '../components/SkeletonCard';
import { api } from '../lib/api';

const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [repoUrl, setRepoUrl] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);

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
      const res = await api.get(`/api/submissions/my-submissions?challengeId=${id}&limit=5`);
      return res.data.data || [];
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['my-submissions', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-summary'] });
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mobile-stack">
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-page-title font-extrabold">{challenge.title}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold border border-accent text-accent">{challenge.difficulty}</span>
          </div>
          <div className="text-body leading-relaxed whitespace-pre-wrap text-primary">{challenge.description}</div>
        </Card>

        <Card>
          <h2 className="text-section-title font-bold mb-4">Your Recent Submissions</h2>
          {historyQuery.isLoading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : historyQuery.data?.length ? (
            <div className="space-y-3">
              {historyQuery.data.map((sub) => (
                <div key={sub._id} className="border border-glass-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{new Date(sub.submittedAt).toLocaleString()}</p>
                    <p className="text-secondary text-sm">{sub.language || 'javascript'}</p>
                  </div>
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

          <label className="field-label">Or Paste Code</label>
          <textarea
            rows="10"
            placeholder="// Write your solution here..."
            className="field-textarea mb-4"
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
          />

          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ChallengeDetails;

