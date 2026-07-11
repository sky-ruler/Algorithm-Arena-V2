import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiEdit3, FiXCircle, FiCircle } from "react-icons/fi";
import { clsx } from "clsx";
import { getDifficultyRGB } from "../../constants/difficulty";

const STATUS_META = {
  solved: { icon: FiCheckCircle, className: "text-green-500", label: "Solved" },
  pending: { icon: FiClock, className: "text-yellow-500", label: "In review" },
  attempted: { icon: FiEdit3, className: "text-blue-400", label: "Draft saved" },
  rejected: { icon: FiXCircle, className: "text-red-500", label: "Rejected" },
};

const ChallengeRow = ({ challenge, status, onHover }) => {
  const meta = STATUS_META[status];
  const StatusIcon = meta?.icon || FiCircle;
  const rgb = getDifficultyRGB(challenge.difficulty);

  return (
    <Link
      to={`/challenge/${challenge._id}`}
      onPointerEnter={onHover}
      onFocus={onHover}
      data-spotlight=""
      style={{ "--card-accent-rgb": rgb }}
      className="surface-card flex items-center gap-3 px-4 py-3 min-h-[56px] group"
    >
      <StatusIcon
        size={18}
        className={clsx("shrink-0", meta ? meta.className : "text-tertiary")}
        title={meta?.label || "Not attempted"}
        aria-label={meta?.label || "Not attempted"}
      />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-primary truncate group-hover:text-accent transition-colors">
          {challenge.title}
        </p>
        {challenge.category && (
          <p className="text-caption text-tertiary truncate md:hidden">{challenge.category}</p>
        )}
      </div>
      {challenge.category && (
        <span className="hidden md:inline-block text-caption text-tertiary surface-inset px-2 py-0.5 rounded-sm">
          {challenge.category}
        </span>
      )}
      <span
        className="shrink-0 text-caption font-bold px-2.5 py-0.5 rounded-full"
        style={{ color: `rgb(${rgb})`, background: `rgba(${rgb}, 0.12)` }}
      >
        {challenge.difficulty}
      </span>
      <span className="shrink-0 w-14 text-right font-mono text-caption text-secondary">
        {challenge.points} XP
      </span>
    </Link>
  );
};

export default ChallengeRow;
