/**
 * Pure helpers for the reviewer "queue" — the ordered list of submissions
 * (each paired with its challenge) a reviewer is stepping through after
 * clicking in from a review list. Encoded into a URL param so Prev/Next
 * survives navigation between challenges and page refreshes.
 */

export const encodeReviewQueue = (items) => {
  if (!Array.isArray(items) || items.length === 0) return "";
  return items
    .filter((it) => it && it.submissionId && it.challengeId)
    .map((it) => `${it.submissionId}:${it.challengeId}`)
    .join(",");
};

export const decodeReviewQueue = (str) => {
  if (!str) return [];
  return str
    .split(",")
    .map((pair) => {
      const [submissionId, challengeId] = pair.split(":");
      return submissionId && challengeId ? { submissionId, challengeId } : null;
    })
    .filter(Boolean);
};

export const getQueueNav = (queue, currentSubmissionId) => {
  const list = Array.isArray(queue) ? queue : [];
  const index = list.findIndex((it) => it.submissionId === currentSubmissionId);
  if (index === -1) {
    return { index: -1, total: list.length, prev: null, next: null };
  }
  return {
    index,
    total: list.length,
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
};

export const buildReviewUrl = (item, queueStr) => {
  if (!item) return null;
  const params = new URLSearchParams();
  params.set("review", item.submissionId);
  if (queueStr) params.set("queue", queueStr);
  return `/challenge/${item.challengeId}?${params.toString()}`;
};
