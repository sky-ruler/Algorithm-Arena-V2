import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';

const buildChallengeQuery = ({ page, limit, search, difficulty, category, sortBy, sortDir }) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  params.set('sortBy', sortBy);
  params.set('sortDir', sortDir);
  if (search) params.set('search', search);
  if (difficulty) params.set('difficulty', difficulty);
  if (category) params.set('category', category);
  return params.toString();
};

const Dashboard = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 6,
    search: '',
    difficulty: '',
    category: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
  });

  const queryKey = useMemo(() => ['challenges', filters], [filters]);

  const challengesQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const qs = buildChallengeQuery(filters);
      const res = await api.get(`/api/challenges?${qs}`);
      return {
        data: res.data.data || [],
        meta: res.data.meta || {},
      };
    },
  });

  const summaryQuery = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/summary');
      return res.data.data;
    },
  });

  const challenges = challengesQuery.data?.data || [];
  const meta = challengesQuery.data?.meta || {};

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (direction) => {
    setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page + direction) }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-page-title font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent to-purple-500">
            Mission Control
          </h1>
          <p className="text-secondary mt-2">Welcome back. Filter challenges and track your progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Total Challenges</h3>
          <p className="text-3xl font-bold mt-1">{summaryQuery.data?.totalChallenges ?? '-'}</p>
        </div>
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Solved</h3>
          <p className="text-3xl font-bold mt-1 text-green-500">{summaryQuery.data?.solved ?? '-'}</p>
        </div>
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Pending Reviews</h3>
          <p className="text-3xl font-bold mt-1 text-yellow-500">{summaryQuery.data?.pending ?? '-'}</p>
        </div>
        <div className="macos-glass p-6">
          <h3 className="text-secondary text-sm font-semibold uppercase">Global Rank</h3>
          <p className="text-3xl font-bold mt-1 text-accent">{summaryQuery.data?.rank ? `#${summaryQuery.data.rank}` : '-'}</p>
        </div>
      </div>

      <div className="macos-glass p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input
          className="field-input"
          placeholder="Search title/description"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select className="field-select" value={filters.difficulty} onChange={(e) => handleFilterChange('difficulty', e.target.value)}>
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input
          className="field-input"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        />
        <select className="field-select" value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
          <option value="createdAt">Newest</option>
          <option value="points">Points</option>
          <option value="difficulty">Difficulty</option>
          <option value="title">Title</option>
        </select>
        <select className="field-select" value={filters.sortDir} onChange={(e) => handleFilterChange('sortDir', e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      <h2 className="text-section-title font-semibold">Available Missions</h2>

      {challengesQuery.isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : challengesQuery.isError ? (
        <div className="macos-glass p-6 text-red-400">{challengesQuery.error?.userMessage || 'Failed to fetch challenges.'}</div>
      ) : challenges.length === 0 ? (
        <EmptyState
          title="No challenges found"
          description="Try changing filters, or ask admin to publish new challenges."
          actionLabel="Reset Filters"
          onAction={() =>
            setFilters({ page: 1, limit: 6, search: '', difficulty: '', category: '', sortBy: 'createdAt', sortDir: 'desc' })
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <Link key={challenge._id} to={`/challenge/${challenge._id}`} className="group">
                <div className="macos-glass p-6 hover:border-accent transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        challenge.difficulty === 'Easy'
                          ? 'bg-green-500/20 text-green-500'
                          : challenge.difficulty === 'Medium'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="text-secondary text-sm">{challenge.points} XP</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-accent transition-colors">{challenge.title}</h3>
                  <p
                    className="text-secondary text-sm mt-2"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {challenge.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between macos-glass p-4">
            <span className="text-secondary text-sm">
              Page {meta.page || filters.page} of {meta.totalPages || 1} ({meta.total || challenges.length} total)
            </span>
            <div className="flex gap-2">
              <button className="btn-secondary" onClick={() => handlePageChange(-1)} disabled={(meta.page || filters.page) <= 1}>
                Previous
              </button>
              <button
                className="btn-secondary"
                onClick={() => handlePageChange(1)}
                disabled={(meta.page || filters.page) >= (meta.totalPages || 1)}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;

