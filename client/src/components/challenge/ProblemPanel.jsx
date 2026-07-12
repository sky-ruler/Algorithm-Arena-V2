import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiFileText,
  FiClock,
  FiCode,
  FiXCircle,
  FiClipboard,
} from "react-icons/fi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CodeEditor from "../CodeEditor";
import { LANGUAGE_MAP, LANGUAGE_OPTIONS } from "../../constants/languages";
import { MANUAL_TOPICS } from "../../constants/manualContent";

/**
 * Render-only left pane for the challenge page. All state lives in the page
 * component; this panel receives values + callbacks as props.
 */
const ProblemPanel = ({
  isMaximized,
  mobileTab,
  leftTab,
  setLeftTab,
  handleCloseManual,
  sanitizedDescription,
  historyData,
  solutionEntries,
  solutionLanguage,
  setSolutionLanguage,
  selectedSolution,
  isDark,
  manualTopic,
  setManualTopic,
  language,
}) => {
  return (
    <div
      className={`flex-1 lg:flex-none flex-col min-h-0 macos-glass rounded-xl overflow-hidden w-full lg:w-[var(--left-width)] lg:mb-0 mb-3 h-full panel-slide-left ${isMaximized ? "hidden" : ""} ${mobileTab === "editor" ? "hidden lg:flex" : "flex"}`}
    >
      <div className="flex border-b border-subtle shrink-0 overflow-x-auto">
        <button
          className={`px-4 py-3 text-sm font-semibold relative ${leftTab === "description" ? "text-primary" : "text-secondary"}`}
          onClick={() => setLeftTab("description")}
        >
          <FiFileText className="inline mr-2" />
          Description
          {leftTab === "description" && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
          )}
        </button>
        <button
          className={`px-4 py-3 text-sm font-semibold relative ${leftTab === "submissions" ? "text-primary" : "text-secondary"}`}
          onClick={() => setLeftTab("submissions")}
        >
          <FiClock className="inline mr-2" />
          Submissions
          {leftTab === "submissions" && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
          )}
        </button>
        <button
          className={`px-4 py-3 text-sm font-semibold relative ${leftTab === "solutions" ? "text-primary" : "text-secondary"}`}
          onClick={() => setLeftTab("solutions")}
        >
          <FiCode className="inline mr-2" />
          Solutions
          {leftTab === "solutions" && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
          )}
        </button>
        {leftTab === "manual" && (
          <button
            className="px-4 py-3 text-sm font-semibold relative text-primary flex items-center ml-auto"
            onClick={handleCloseManual}
            title="Close Reference"
          >
            <FiXCircle size={16} className="mr-1" /> Close
            <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {leftTab === "description" ? (
          <div
            className="leetcode-description"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
          />
        ) : leftTab === "submissions" ? (
          <div className="space-y-3">
            {historyData?.map((sub) => (
              <Link
                key={sub._id}
                to={`/submission/${sub._id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-subtle hover:border-accent hover:scale-[99%] transition-all"
              >
                <div>
                  <p
                    className={`text-sm font-semibold ${sub.status === "Accepted" ? "text-green-400" : "text-red-400"}`}
                  >
                    {sub.status}
                  </p>
                  <p className="text-secondary text-xs">
                    {new Date(sub.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md text-secondary">
                  {sub.language}
                </span>
              </Link>
            ))}
          </div>
        ) : leftTab === "solutions" ? (
          <div className="flex flex-col min-h-[520px] space-y-4">
            {solutionEntries.length > 0 ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-primary">Uploaded Solution</p>
                    <p className="text-xs text-secondary">
                      {solutionEntries.length} language{solutionEntries.length === 1 ? "" : "s"} available
                    </p>
                  </div>
                  <div className="w-[150px]">
                    <Select value={solutionLanguage} onValueChange={setSolutionLanguage}>
                      <SelectTrigger className="h-8 text-xs bg-black/5 dark:bg-white/5 border-subtle">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {solutionEntries.map((solution) => (
                          <SelectItem key={solution.langSlug} value={solution.langSlug} className="text-xs">
                            {solution.lang || LANGUAGE_OPTIONS.find((opt) => opt.key === solution.langSlug)?.label || solution.langSlug}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex-1 min-h-[460px] overflow-hidden rounded-lg surface-inset">
                  <CodeEditor
                    value={selectedSolution?.code || "// No solution uploaded for this language."}
                    language={LANGUAGE_MAP[solutionLanguage]?.monacoLang ?? solutionLanguage}
                    isDark={isDark}
                    readOnly={true}
                    height="460px"
                  />
                </div>
              </>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center border border-dashed border-subtle rounded-lg surface-inset p-6">
                <FiCode className="text-tertiary mb-3" size={28} />
                <p className="text-sm font-semibold text-primary">No uploaded solutions yet</p>
                <p className="text-xs text-secondary mt-1">Solutions added by admins will appear here.</p>
              </div>
            )}
          </div>
        ) : leftTab === "manual" ? (
          <div className="flex flex-col h-full space-y-4">
            <div className="flex flex-wrap gap-2">
              {MANUAL_TOPICS.map((topic) => (
                <button
                  key={topic.key}
                  onClick={() => setManualTopic(topic.key)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${manualTopic === topic.key ? "bg-accent border-accent text-white" : "border-subtle text-secondary hover:text-primary hover:border-black/30 dark:hover:border-white/30"}`}
                >
                  {topic.title}
                </button>
              ))}
            </div>
            <div className="flex-1 surface-inset rounded-lg flex flex-col min-h-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-subtle flex items-center justify-between shrink-0 bg-black/5 dark:bg-white/5">
                <span className="text-sm font-bold text-primary">
                  {MANUAL_TOPICS.find((t) => t.key === manualTopic)?.title} ({LANGUAGE_OPTIONS.find((o) => o.key === language)?.label})
                </span>
                <button
                  onClick={async () => {
                    const snippet = MANUAL_TOPICS.find((t) => t.key === manualTopic)?.snippets[language];
                    if (snippet) {
                      await navigator.clipboard.writeText(snippet);
                      toast.success("Snippet copied");
                    } else {
                      toast.error("No snippet to copy");
                    }
                  }}
                  className="p-1.5 text-secondary hover:text-primary transition-colors bg-white/5 rounded-md hover:bg-white/10"
                  title="Copy to clipboard"
                >
                  <FiClipboard size={14} />
                </button>
              </div>
              <div className="flex-1 min-h-0 overflow-hidden">
                <CodeEditor
                  value={MANUAL_TOPICS.find((t) => t.key === manualTopic)?.snippets[language] || "// No implementation provided for this language."}
                  language={LANGUAGE_MAP[language]?.monacoLang ?? language}
                  isDark={isDark}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProblemPanel;
