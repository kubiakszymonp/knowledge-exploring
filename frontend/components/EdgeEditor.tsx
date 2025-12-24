"use client";

import { Edge } from "../model/Edge";

interface EdgeEditorProps {
  edge: Edge;
  onClose: () => void;
  onChange: (edge: Edge) => void;
}

export default function EdgeEditor({ edge, onClose, onChange }: EdgeEditorProps) {
  return (
    <div className="absolute right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Edytor krawędzi</h2>
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
            Źródło
          </label>
          <input
            type="text"
            value={edge.from}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div className="flex items-center justify-center py-2">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cel
          </label>
          <input
            type="text"
            value={edge.to}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etykieta
          </label>
          <input
            type="text"
            value={edge.label || ""}
            onChange={(e) =>
              onChange({ ...edge, label: e.target.value })
            }
            placeholder="Opisz relację..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Np. "prowadzi do", "część", "następuje po"
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Krawędź łączy dwa węzły w grafie wiedzy. Etykieta opisuje charakter relacji między nimi.
          </p>
        </div>
      </div>
    </div>
  );
}

