import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

const SolutionCard = ({ title, score, content }) => {
  return (
    <div className="bg-surface-card rounded-2xl p-6 shadow-[0_12px_40px_rgba(43,52,55,0.06)] flex flex-col gap-4 border border-text-sub/10">
      <div className="flex justify-between items-center border-b border-surface-dim pb-4">
        <h3 className="text-xl font-semibold text-text-main">{title}</h3>
        <span className="bg-surface-dim text-primary font-bold px-3 py-1 rounded-full text-sm">
          Score: {score}/10
        </span>
      </div>
      <div className="prose prose-sm max-w-none text-text-main">
        <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    // 🔥 PARAGRAPH GAP
    p({ children }) {
      return <p className="mb-4 leading-relaxed">{children}</p>;
    },

    // 🔥 HEADINGS GAP
    h1({ children }) {
      return <h1 className="text-xl font-bold mt-6 mb-4">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="text-lg font-semibold mt-5 mb-3">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="text-base font-semibold mt-4 mb-2">{children}</h3>;
    },

    // 🔥 LIST GAP
    ul({ children }) {
      return <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>;
    },

    // 🔥 TABLE GAP (IMPORTANT)
    table({ children }) {
      return (
        <div className="overflow-x-auto hide-scrollbar my-6">
          <table className="w-full border border-surface-dim">
            {children}
          </table>
        </div>
      );
    },

    // 🔥 TABLE CELLS GAP
    th({ children }) {
      return <th className="px-4 py-3 text-left">{children}</th>;
    },
    td({ children }) {
      return <td className="px-4 py-3">{children}</td>;
    },

    // 🔥 CODE BLOCK
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          children={String(children).replace(/\n$/, "")}
          style={oneLight}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4 text-sm"
        />
      ) : (
        <code
          {...props}
          className={
            "bg-surface-dim px-1.5 py-0.5 rounded text-primary " + className
          }
        >
          {children}
        </code>
      );
    },
  }}
>
  {content}
</ReactMarkdown>
      </div>
    </div>
  );
};


export const MessageItem = ({ message }) => {
  const { role, problem, solution_1, solution_2, judge, content, isVision } = message;

  if (role === 'user') {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 flex flex-col items-end">
        <div className="bg-primary/10 rounded-2xl rounded-tr-none px-6 py-4 border border-primary/20 max-w-2xl">
          <p className="text-lg text-text-main leading-relaxed font-medium">
            {content || problem}
          </p>
        </div>
      </div>
    );
  }

  if (isVision) {
    return (
      <div className="w-full max-w-6xl mx-auto py-6 flex flex-col gap-6">
        <div className="bg-surface-card rounded-2xl p-8 border border-text-sub/10 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
            Image Understanding
          </h2>
          <div className="prose prose-sm max-w-none text-text-main whitespace-pre-wrap">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-8 flex flex-col gap-12">

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SolutionCard
          title="Solution 1"
          score={judge.solution_1_score}
          content={solution_1}
        />
        <SolutionCard
          title="Solution 2"
          score={judge.solution_2_score}
          content={solution_2}
        />
      </div>

      {/* Judge Recommendation */}
      <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20 shadow-sm relative overflow-hidden">
        {/* Subtle background glow effect using absolute div */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-300"></div>
        <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gavel"><path d="m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" /><path d="m16 16 6-6" /><path d="m8 8 6-6" /><path d="m9 7 8 8" /><path d="m21 11-8-8" /></svg>
          Judge Recommendation
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-sub uppercase tracking-wider flex gap-2">
              <span>Analysis: Solution 1 </span>
              <span>Score : {judge.solution_1_score}</span>
            </h4>
            <p className="text-text-main leading-relaxed break-words">{judge.solution_1_reasoning}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-text-sub uppercase tracking-wider flex gap-2">
              <span>Analysis: Solution 2 </span>
              <span>Score : {judge.solution_2_score}</span>
            </h4>    
            <p className="text-text-main leading-relaxed break-words">{judge.solution_2_reasoning}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
