import React, { useMemo } from "react";
import { View, Text, RichText } from "@tarojs/components";
import { marked } from "marked";
import "./markdown-renderer.scss";

interface MarkdownRendererProps {
  markdown: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const html = useMemo(() => {
    // Configure marked for Taro/WeChat environments
    marked.setOptions({
      gfm: true,
      breaks: true,
    });

    try {
      // Parse markdown to HTML string
      return marked.parse(markdown) as string;
    } catch (error) {
      console.error("Error parsing markdown:", error);
      return markdown;
    }
  }, [markdown]);

  return (
    <View className="markdown-content">
      <RichText nodes={html} />
    </View>
  );
};

export default MarkdownRenderer;
