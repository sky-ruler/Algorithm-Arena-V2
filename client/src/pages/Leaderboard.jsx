import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { api } from '../lib/api';
import { useAuth } from '../context/useAuth';

const Leaderboard = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ window: 'all', page: 1, limit: 20 });

  const leaderboardQuery = useQuery({
    queryKey: ['leaderboard', filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        window: filters.window,
        page: String(filters.page),
        limit: String(filters.limit),
      });
      const res = await api.get(`/api/submissions/leaderboard?${params.toString()}`);
      return {
        data: res.data.data || [],
        meta: res.data.meta || {},
      };
    },
  });

  const meta = leaderboardQuery.data?.meta || {};
  const rows = leaderboardQuery.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3 items-center">
        <h1 className="text-page-title font-extrabold">Leaderboard</h1>
        <div className="flex gap-2">
          <select
            className="field-select"
            value={filters.window}
            onChange={(e) => setFilters((p) => ({ ...p, page: 1, window: e.target.value }))}
            aria-label="Leaderboard timeframe"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <select
            className="field-select"
            value={filters.limit}
            onChange={(e) => setFilters((p) => ({ ...p, page: 1, limit: Number(e.target.value) }))}
            aria-label="Leaderboard page size"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {leaderboardQuery.isLoading ? (
          <div className="p-4 space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : rows.length === 0 ? (
          <div className="p-4">
            <EmptyState title="No rankings yet" description="Accepted submissions will appear here." />
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-auto">
              <table className="responsive-table text-left">
                <thead>
                  <tr className="border-b border-glass-border text-secondary text-xs uppercase tracking-wide">
                    <th className="p-4">Rank</th>
                    <th className="p-4">User</th>
                    <th className="p-4 text-center">Solved</th>
                    <th className="p-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((leader) => {
                    const isMe = leader.username === user?.username;
                    return (
                      <tr
                        key={`${leader._id}-${leader.rank}`}
                        className={`border-b border-glass-border/70 ${isMe ? 'bg-accent/10' : ''}`}
                      >
                        <td className="p-4 font-semibold">#{leader.rank}</td>
                        <td className="p-4 font-semibold">
                          {leader.username}
                          {isMe && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-accent text-white">YOU</span>}
                        </td>
                        <td className="p-4 text-center text-secondary">{leader.solvedCount}</td>
                        <td className="p-4 text-right font-bold text-green-400">{leader.totalPoints}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {rows.map((leader) => {
                const isMe = leader.username === user?.username;
                return (
                  <div key={`${leader._id}-${leader.rank}`} className={`border border-glass-border rounded-xl p-4 ${isMe ? 'bg-accent/10' : ''}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold">#{leader.rank}</span>
                      <span className="font-bold text-green-400">{leader.totalPoints} pts</span>
                    </div>
                    <div className="font-semibold">
                      {leader.username}
                      {isMe && <span className="ml-2 text-xs px-2 py-0.5 rounded bg-accent text-white">YOU</span>}
                    </div>
                    <div className="text-secondary text-sm">Solved: {leader.solvedCount}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <div className="macos-glass p-4 flex items-center justify-between">
        <span className="text-secondary text-sm">
          Page {meta.page || filters.page} of {meta.totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button className="btn-secondary" disabled={(meta.page || filters.page) <= 1} onClick={() => setFilters((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}>
            Prev
          </button>
          <button
            className="btn-secondary"
            disabled={(meta.page || filters.page) >= (meta.totalPages || 1)}
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
