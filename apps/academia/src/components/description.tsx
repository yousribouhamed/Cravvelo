"use client";

import React from "react";

interface CourseDescriptionProps {
  description: string;
}

export default function Description({ description }: CourseDescriptionProps) {
  // Remove unwanted wrapping quotes if they exist
  const cleanDescription = description.replace(/^"+|"+$/g, "");

  const styles = {
    container: {
      maxWidth: "none",
      color: "#374151",
      fontSize: "1.125rem",
      lineHeight: "1.75",
    } as React.CSSProperties,
  };

  return (
    <>
      <style jsx>{`
        .description-content {
          max-width: none;
          color: #374151;
          font-size: 1.125rem;
          line-height: 1.75;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .description-content h1 {
          font-size: 3rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 2rem;
          margin-top: 3rem;
          background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #8b5cf6 50%,
            #ef4444 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.02em;
          position: relative;
          animation: fadeInUp 0.8s ease-out;
        }

        .description-content h1:first-child {
          margin-top: 0;
        }

        .description-content h1::after {
          content: "";
          position: absolute;
          bottom: -0.5rem;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ef4444);
          border-radius: 2px;
          opacity: 0.6;
        }

        .description-content h2 {
          font-size: 2.25rem;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          margin-top: 2.5rem;
          color: #1f2937;
          position: relative;
          padding-left: 1.5rem;
          border-left: 5px solid transparent;
          border-image: linear-gradient(135deg, #3b82f6, #8b5cf6) 1;
          transition: all 0.3s ease;
          animation: fadeInLeft 0.8s ease-out;
        }

        .description-content h2:first-child {
          margin-top: 0;
        }

        .description-content h2:hover {
          padding-left: 2rem;
          transform: translateX(4px);
        }

        .description-content h2::before {
          content: "";
          position: absolute;
          left: -5px;
          top: 0;
          bottom: 0;
          width: 5px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 0 3px 3px 0;
        }

        .description-content h3 {
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1.3;
          margin-bottom: 1.25rem;
          margin-top: 2rem;
          color: #374151;
          position: relative;
          padding-left: 2.5rem;
          transition: all 0.3s ease;
          animation: fadeInRight 0.8s ease-out;
        }

        .description-content h3:first-child {
          margin-top: 0;
        }

        .description-content h3::before {
          content: "◆";
          position: absolute;
          left: 0;
          top: 0;
          color: #3b82f6;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .description-content h3:hover {
          color: #3b82f6;
          transform: translateX(6px);
        }

        .description-content h3:hover::before {
          color: #8b5cf6;
          transform: rotate(45deg) scale(1.2);
        }

        .description-content p {
          color: #4b5563;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          text-align: justify;
          transition: color 0.3s ease;
        }

        .description-content p:hover {
          color: #374151;
        }

        .description-content ul,
        .description-content ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
          color: #4b5563;
          line-height: 1.7;
        }

        .description-content li {
          margin-bottom: 0.75rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .description-content li:hover {
          color: #374151;
          transform: translateX(4px);
        }

        .description-content ul li::marker {
          color: #3b82f6;
          font-size: 1.2em;
        }

        .description-content ol li::marker {
          color: #8b5cf6;
          font-weight: bold;
        }

        .description-content strong {
          color: #3b82f6;
          font-weight: 700;
          position: relative;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(59, 130, 246, 0.1) 50%,
            transparent 100%
          );
          padding: 0.1em 0.3em;
          border-radius: 4px;
        }

        .description-content em {
          color: #8b5cf6;
          font-style: italic;
          position: relative;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(139, 92, 246, 0.08) 50%,
            transparent 100%
          );
          padding: 0.1em 0.2em;
          border-radius: 3px;
        }

        .description-content blockquote {
          border-left: 6px solid #e5e7eb;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 1.5rem 2rem;
          margin: 2rem 0;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #64748b;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .description-content blockquote:hover {
          border-left-color: #3b82f6;
          transform: translateX(4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .description-content blockquote::before {
          content: '"';
          position: absolute;
          top: -10px;
          left: 1rem;
          font-size: 4rem;
          color: #3b82f6;
          opacity: 0.3;
          font-family: Georgia, serif;
        }

        .description-content code {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #dc2626;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-family: "Fira Code", "Monaco", "Consolas", monospace;
          font-size: 0.9em;
          font-weight: 600;
          border: 1px solid #fed7aa;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .description-content code:hover {
          background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .description-content a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 600;
          position: relative;
          transition: all 0.3s ease;
          border-bottom: 2px solid transparent;
        }

        .description-content a:hover {
          color: #1d4ed8;
          border-bottom-color: #3b82f6;
          transform: translateY(-1px);
        }

        .description-content img {
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          max-width: 100%;
          height: auto;
        }

        .description-content img:hover {
          transform: translateY(-4px);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 768px) {
          .description-content h1 {
            font-size: 2.5rem;
            line-height: 1.2;
            margin-bottom: 1.5rem;
          }

          .description-content h2 {
            font-size: 2rem;
            margin-bottom: 1.25rem;
            padding-left: 1.25rem;
          }

          .description-content h3 {
            font-size: 1.5rem;
            padding-left: 2rem;
          }

          .description-content {
            font-size: 1rem;
          }
        }

        @media (prefers-color-scheme: dark) {
          .description-content {
            color: #d1d5db;
          }

          .description-content h1 {
            background: linear-gradient(
              135deg,
              #60a5fa 0%,
              #a78bfa 50%,
              #f87171 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .description-content h2 {
            color: #f9fafb;
          }

          .description-content h3 {
            color: #e5e7eb;
          }

          .description-content h3::before {
            color: #60a5fa;
          }

          .description-content p {
            color: #9ca3af;
          }

          .description-content p:hover {
            color: #d1d5db;
          }

          .description-content ul,
          .description-content ol {
            color: #9ca3af;
          }

          .description-content li:hover {
            color: #d1d5db;
          }

          .description-content strong {
            color: #60a5fa;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(96, 165, 250, 0.1) 50%,
              transparent 100%
            );
          }

          .description-content em {
            color: #a78bfa;
            background: linear-gradient(
              120deg,
              transparent 0%,
              rgba(167, 139, 250, 0.08) 50%,
              transparent 100%
            );
          }

          .description-content blockquote {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            border-left-color: #4b5563;
            color: #9ca3af;
          }

          .description-content blockquote:hover {
            border-left-color: #60a5fa;
          }

          .description-content code {
            background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
            color: #fbbf24;
            border-color: #6b7280;
          }

          .description-content code:hover {
            background: linear-gradient(135deg, #4b5563 0%, #6b7280 100%);
          }
        }
      `}</style>

      <div
        className="description-content"
        style={styles.container}
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
    </>
  );
}
