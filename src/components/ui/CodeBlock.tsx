import { Fragment, type ReactNode } from "react";
import { Terminal } from "lucide-react";
import CopyButton from "@/components/ui/CopyButton";

/**
 * Shell code block with lightweight syntax highlighting.
 *
 * Highlighting is done here rather than with a client-side library so the
 * coloured markup ships in the server-rendered HTML — no extra bundle, and no
 * flash of unhighlighted code.
 *
 * A line beginning with "$ " is treated as a command; anything else is output.
 */

const STRING = /^(['"]).*\1$/;
const NUMBERISH = /^[\d./:]+$/;

function highlightCommand(command: string): ReactNode[] {
  // Split on whitespace but keep the separators so spacing is preserved exactly.
  const parts = command.split(/(\s+)/);
  let seenCommand = false;

  return parts.map((part, i) => {
    if (/^\s+$/.test(part) || part === "") return <Fragment key={i}>{part}</Fragment>;

    // Inline comment tail.
    if (part.startsWith("#")) {
      return (
        <span key={i} className="hl-comment">
          {part}
        </span>
      );
    }
    if (part.startsWith("-")) {
      return (
        <span key={i} className="hl-flag">
          {part}
        </span>
      );
    }
    if (STRING.test(part)) {
      return (
        <span key={i} className="hl-str">
          {part}
        </span>
      );
    }
    if (part.startsWith("/") || part.startsWith("./") || part.startsWith("~/")) {
      return (
        <span key={i} className="hl-path">
          {part}
        </span>
      );
    }
    if (NUMBERISH.test(part)) {
      return (
        <span key={i} className="hl-num">
          {part}
        </span>
      );
    }
    if (!seenCommand && !part.includes("=")) {
      seenCommand = true;
      return (
        <span key={i} className="hl-cmd">
          {part}
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function Line({ raw }: { raw: string }) {
  if (raw.trim() === "") return <span>{" "}</span>;

  if (raw.startsWith("# ") || raw.startsWith("#!")) {
    return <span className="hl-comment">{raw}</span>;
  }

  if (raw.startsWith("$ ")) {
    return (
      <span>
        <span className="hl-prompt">$</span> {highlightCommand(raw.slice(2))}
      </span>
    );
  }

  return <span className="hl-out">{raw}</span>;
}

interface CodeBlockProps {
  /** Raw shell transcript. Lines starting with "$ " render as commands. */
  code: string;
  /** Optional caption shown in the header bar. */
  title?: string;
}

export default function CodeBlock({ code, title }: CodeBlockProps) {
  const lines = code.replace(/\s+$/, "").split("\n");

  // Only the commands are worth copying; prompts and output are not.
  const copyText = lines
    .filter((l) => l.startsWith("$ "))
    .map((l) => l.slice(2))
    .join("\n");

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-[var(--bg-2)] my-4">
      <div className="flex items-center gap-2 px-3.5 py-2 border-b border-border bg-surface/50">
        <Terminal size={12} className="text-primary shrink-0" />
        <span className="text-[11px] font-mono text-muted flex-1 truncate">{title ?? "shell"}</span>
        <CopyButton text={copyText || code} />
      </div>
      <pre className="p-4 overflow-x-auto font-mono text-[12.5px] leading-[1.65]">
        <code>
          {lines.map((l, i) => (
            <Fragment key={i}>
              <Line raw={l} />
              {i < lines.length - 1 && "\n"}
            </Fragment>
          ))}
        </code>
      </pre>
    </div>
  );
}
