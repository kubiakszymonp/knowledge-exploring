"use client";

import { KnowledgeNode } from "../model/KnowledgeNode";

interface NodeEditorProps {
  node: KnowledgeNode;
  onClose: () => void;
  onChange: (node: KnowledgeNode) => void;
}

export default function NodeEditor({ node, onClose, onChange }: NodeEditorProps) {
  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Edytor węzła</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ID
          </label>
          <input
            type="text"
            value={node.id}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tytuł
          </label>
          <input
            type="text"
            value={node.title}
            onChange={(e) =>
              onChange({ ...node, title: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Treść
          </label>
          <textarea
            value={node.text}
            onChange={(e) =>
              onChange({ ...node, text: e.target.value })
            }
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagi
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {node.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700"
              >
                {tag}
                <button
                  onClick={() =>
                    onChange({
                      ...node,
                      tags: node.tags.filter((_, i) => i !== index),
                    })
                  }
                  className="ml-2 text-slate-500 hover:text-slate-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Dodaj tag..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                onChange({
                  ...node,
                  tags: [...node.tags, e.currentTarget.value.trim()],
                });
                e.currentTarget.value = "";
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Naciśnij Enter aby dodać tag
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Załączniki
          </label>
          <div className="space-y-2">
            {node.attachments.length === 0 ? (
              <p className="text-sm text-gray-500">Brak załączników</p>
            ) : (
              node.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {attachment.type}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {attachment.url}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

