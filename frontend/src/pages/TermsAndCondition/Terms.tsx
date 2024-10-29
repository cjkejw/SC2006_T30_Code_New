import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import remarkGfm from 'remark-gfm';
import './Terms.css';

const TermsAndCondition: React.FC = () => {
  useEffect(() => {
    document.title = "Terms & Condition";
  }, []);

  const [markdownContent, setMarkdownContent] = useState<string>('');

  useEffect(() => {
    // Load the Markdown file
    const fetchMarkdown = async () => {
      const response = await fetch('/TermsAndCondition.md');
      const text = await response.text();
      setMarkdownContent(text);
    };

    fetchMarkdown();
  }, []);

  return (
    <div className="markdown-wrapper">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default TermsAndCondition;