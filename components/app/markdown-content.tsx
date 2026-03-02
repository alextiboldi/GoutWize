"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

const fullComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-lg font-bold text-gw-navy mt-4 mb-2">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-base font-bold text-gw-navy mt-3 mb-1.5">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-bold text-gw-navy mt-3 mb-1">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-gw-navy leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside text-sm text-gw-navy mb-2 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside text-sm text-gw-navy mb-2 space-y-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="text-sm text-gw-navy">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-gw-blue/30 pl-3 my-2 text-sm text-gw-text-gray italic">
      {children}
    </blockquote>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block bg-gw-bg-light text-sm rounded-lg p-3 my-2 overflow-x-auto font-mono">
          {children}
        </code>
      );
    }
    return (
      <code className="bg-gw-bg-light text-gw-navy text-[13px] px-1.5 py-0.5 rounded font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gw-blue underline hover:text-gw-blue-dark transition-colors"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="border-gw-border my-3" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-gw-navy">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through">{children}</del>,
};

const previewAllowed = [
  "p",
  "strong",
  "em",
  "del",
  "code",
  "span",
  "br",
] as const;

const previewComponents: Components = {
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="line-through">{children}</del>,
  code: ({ children }) => (
    <code className="bg-gw-bg-light text-[13px] px-1 py-0.5 rounded font-mono">
      {children}
    </code>
  ),
  a: ({ children }) => (
    <span className="underline">{children}</span>
  ),
};

interface MarkdownContentProps {
  content: string;
  variant?: "full" | "preview";
}

export function MarkdownContent({
  content,
  variant = "full",
}: MarkdownContentProps) {
  if (variant === "preview") {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        allowedElements={[...previewAllowed]}
        unwrapDisallowed
        components={previewComponents}
      >
        {content}
      </ReactMarkdown>
    );
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={fullComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
