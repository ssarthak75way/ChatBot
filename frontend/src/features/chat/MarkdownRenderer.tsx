import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Box, IconButton, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

// ... (languages registration)
import js from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import py from "react-syntax-highlighter/dist/esm/languages/prism/python";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import json from "react-syntax-highlighter/dist/esm/languages/prism/json";
import md from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("typescript", ts);
SyntaxHighlighter.registerLanguage("ts", ts);
SyntaxHighlighter.registerLanguage("python", py);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("json", json);
SyntaxHighlighter.registerLanguage("markdown", md);
SyntaxHighlighter.registerLanguage("css", css);

interface MarkdownRendererProps {
    content: string;
    isUser: boolean;
}

const CodeBlock = ({ children, language, ...props }: any) => {
    const [copied, setCopied] = useState(false);
    const content = String(children).replace(/\n$/, "");

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Box sx={{ position: "relative", group: "code-block" }}>
            <Tooltip title={copied ? "Copied!" : "Copy code"}>
                <IconButton
                    onClick={handleCopy}
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "rgba(255, 255, 255, 0.6)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        zIndex: 1,
                        "&:hover": {
                            color: "#fff",
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                        },
                    }}
                >
                    {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
            </Tooltip>
            <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                {...props}
            >
                {content}
            </SyntaxHighlighter>
        </Box>
    );
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <CodeBlock language={match[1]} {...props}>
                            {children}
                        </CodeBlock>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownRenderer;
