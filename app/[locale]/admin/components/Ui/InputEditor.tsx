"use client";

import React, { useEffect, useRef } from 'react';
import EditorJS, { OutputData, API, LogLevels } from '@editorjs/editorjs';
import { EDITOR_JS_TOOLS } from '@/lib/config/editor.config';

interface EditorJSConfig {
    holder: string | HTMLElement;
    tools?: any;
    data?: OutputData;
    placeholder?: string;
    onChange?: (api: API, event: CustomEvent) => void;
    onReady?: () => void;
    logLevel?: LogLevels;
    inlineToolbar?: boolean | string[];
    autofocus?: boolean;
    readOnly?: boolean;
}

interface InputEditorProps {
    title: string;
    value: string;
    onChange: (data: string) => void;
    language?: string;
    editorConfig?: Partial<EditorJSConfig>;
    placeholder?: string;
    name?: string;
}

// Utility function to convert EditorJS blocks to HTML
const convertBlocksToHtml = (blocks: any[]): string => {
    return blocks.map(block => {
        switch (block.type) {
            case 'paragraph':
                return `<p>${block.data.text}</p>`;
            case 'header':
                return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            case 'list':
                const listType = block.data.style === 'ordered' ? 'ol' : 'ul';
                const listItems = block.data.items
                    .map((item: string) => `<li>${item}</li>`)
                    .join('');
                return `<${listType}>${listItems}</${listType}>`;
            case 'image':
                const caption = block.data.caption ? `<figcaption>${block.data.caption}</figcaption>` : '';
                return `<figure><img src="${block.data.file.url}" alt="${block.data.caption || ''}">${caption}</figure>`;
            case 'quote':
                return `<blockquote>${block.data.text}</blockquote>`;
            case 'delimiter':
                return '<hr>';
            case 'code':
                return `<pre><code>${block.data.code}</code></pre>`;
            default:
                return '';
        }
    }).join('');
};

// Utility function to convert HTML to EditorJS blocks
const convertHtmlToBlocks = (html: string): OutputData => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const blocks: any[] = [];

    doc.body.childNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            switch (element.tagName.toLowerCase()) {
                case 'p':
                    blocks.push({
                        type: 'paragraph',
                        data: {
                            text: element.innerHTML
                        }
                    });
                    break;
                // Add more cases for other HTML elements as needed
            }
        }
    });

    return {
        blocks,
        time: Date.now(),
        version: '2.30.7'
    };
};

const InputEditor: React.FC<InputEditorProps> = ({
    title,
    value,
    onChange,
    language,
    editorConfig,
    placeholder,
    name,
}) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!holderRef.current) return;

        let initialData: OutputData;

        // Check if value is HTML or EditorJS JSON
        if (value.trim().startsWith('<')) {
            // Convert HTML to EditorJS blocks
            initialData = convertHtmlToBlocks(value);
        } else {
            try {
                initialData = JSON.parse(value);
            } catch {
                initialData = { blocks: [] };
            }
        }

        if (!editorRef.current) {
            const editor = new EditorJS({
                holder: holderRef.current,
                tools: EDITOR_JS_TOOLS,
                data: initialData,
                placeholder: placeholder || 'Start writing...',
                onChange: async () => {
                    try {
                        const outputData = await editorRef.current?.save();
                        if (outputData) {
                            // Convert EditorJS blocks to HTML before saving
                            const htmlOutput = convertBlocksToHtml(outputData.blocks);
                            onChange(htmlOutput);
                        }
                    } catch (error) {
                        console.error('Error saving editor data:', error);
                    }
                },
                onReady: () => {
                    console.log('Editor.js is ready to work!');
                },
                autofocus: true,
                ...editorConfig,
            });

            editorRef.current = editor;
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy) {
                try {
                    editorRef.current.destroy();
                    editorRef.current = null;
                } catch (error) {
                    console.error('Error destroying editor:', error);
                }
            }
        };
    }, [editorConfig, onChange, placeholder, value]);

    return (
        <div className="w-full">
            <label 
                htmlFor={name} 
                className="block text-sm font-medium mb-1"
            >
                {title} {language && `(${language})`}
            </label>
            <div 
                id={name}
                ref={holderRef}
                className="border border-gray-300 rounded-md p-4 min-h-[300px] dark:bg-white dark:text-gray-900"
            />
        </div>
    );
};

export default InputEditor;