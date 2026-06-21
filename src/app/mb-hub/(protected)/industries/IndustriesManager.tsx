'use client';

import { useState, useCallback } from 'react';

interface Industry {
  name: string;
  count: number;
}

type RowMode =
  | { type: 'rename'; value: string }
  | { type: 'merge'; target: string };

async function apiFetch(method: string, body: object) {
  const res = await fetch('/api/industries', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error ?? 'Request failed');
  }
  return res;
}

export function IndustriesManager({ initial }: { initial: Industry[] }) {
  const [industries, setIndustries] = useState<Industry[]>(initial);
  const [modes, setModes] = useState<Record<string, RowMode>>({});
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [newName, setNewName] = useState('');
  const [addBusy, setAddBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/industries');
    const data = await res.json();
    setIndustries(data.industries);
  }, []);

  function clearMode(name: string) {
    setModes((m) => { const n = { ...m }; delete n[name]; return n; });
  }

  async function handleRename(from: string, to: string) {
    const trimmed = to.trim();
    if (!trimmed || trimmed === from) { clearMode(from); return; }
    setError(null);
    setBusy((b) => ({ ...b, [from]: true }));
    try {
      await apiFetch('PATCH', { action: 'rename', from, to: trimmed });
      clearMode(from);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rename failed');
    } finally {
      setBusy((b) => ({ ...b, [from]: false }));
    }
  }

  async function handleMerge(source: string, target: string) {
    if (!target || target === source) return;
    setError(null);
    setBusy((b) => ({ ...b, [source]: true }));
    try {
      await apiFetch('PATCH', { action: 'merge', source, target });
      clearMode(source);
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed');
    } finally {
      setBusy((b) => ({ ...b, [source]: false }));
    }
  }

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setError(null);
    setAddBusy(true);
    try {
      await apiFetch('POST', { name });
      setNewName('');
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Add failed');
    } finally {
      setAddBusy(false);
    }
  }

  const filtered = search
    ? industries.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : industries;

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold" style={{ color: '#1B3A52' }}>Industries</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {industries.length} categories across all companies
          </p>
        </div>

        {/* Add new */}
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="New industry name…"
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-48"
            style={{ borderColor: '#dde8f0' }}
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || addBusy}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: '#3A9E9E' }}
          >
            {addBusy ? 'Adding…' : '+ Add'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search industries…"
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
        style={{ borderColor: '#dde8f0' }}
      />

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#dde8f0' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: '#dde8f0', backgroundColor: '#F4F8FB' }}>
              <th className="px-4 py-3 font-semibold text-gray-600">Industry</th>
              <th className="px-4 py-3 font-semibold text-gray-600 w-28">Companies</th>
              <th className="px-4 py-3 w-64" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((ind) => {
              const mode = modes[ind.name];
              const isBusy = busy[ind.name];

              return (
                <tr
                  key={ind.name}
                  className="border-b last:border-0 transition-colors"
                  style={{ borderColor: '#f0f4f8' }}
                >
                  {/* Name cell */}
                  <td className="px-4 py-3">
                    {mode?.type === 'rename' ? (
                      <input
                        autoFocus
                        value={mode.value}
                        onChange={(e) =>
                          setModes((m) => ({ ...m, [ind.name]: { type: 'rename', value: e.target.value } }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRename(ind.name, mode.value);
                          if (e.key === 'Escape') clearMode(ind.name);
                        }}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 w-full max-w-xs"
                        style={{ borderColor: '#3A9E9E' }}
                      />
                    ) : (
                      <span className="font-medium" style={{ color: '#1B3A52' }}>
                        {ind.name}
                      </span>
                    )}
                  </td>

                  {/* Count cell */}
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      ind.count === 0
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-teal-50 text-teal-700'
                    }`}>
                      {ind.count}
                    </span>
                  </td>

                  {/* Actions cell */}
                  <td className="px-4 py-3">
                    {mode?.type === 'rename' ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleRename(ind.name, mode.value)}
                          disabled={isBusy}
                          className="px-2.5 py-1 rounded text-xs font-semibold text-white disabled:opacity-50"
                          style={{ backgroundColor: '#3A9E9E' }}
                        >
                          {isBusy ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          onClick={() => clearMode(ind.name)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : mode?.type === 'merge' ? (
                      <div className="flex gap-2 justify-end items-center flex-wrap">
                        <span className="text-xs text-gray-400">into →</span>
                        <select
                          value={mode.target}
                          onChange={(e) =>
                            setModes((m) => ({ ...m, [ind.name]: { type: 'merge', target: e.target.value } }))
                          }
                          className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                          style={{ borderColor: '#dde8f0' }}
                        >
                          <option value="">Select target…</option>
                          {industries
                            .filter((i) => i.name !== ind.name)
                            .map((i) => (
                              <option key={i.name} value={i.name}>
                                {i.name} ({i.count})
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleMerge(ind.name, mode.target)}
                          disabled={!mode.target || isBusy}
                          className="px-2.5 py-1 rounded text-xs font-semibold text-white disabled:opacity-40"
                          style={{ backgroundColor: '#F26522' }}
                        >
                          {isBusy ? '…' : 'Merge'}
                        </button>
                        <button
                          onClick={() => clearMode(ind.name)}
                          className="px-2 py-1 rounded text-xs text-gray-400 hover:bg-gray-100 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() =>
                            setModes((m) => ({ ...m, [ind.name]: { type: 'rename', value: ind.name } }))
                          }
                          className="px-2.5 py-1 rounded text-xs font-medium border text-gray-600 hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#dde8f0' }}
                        >
                          Rename
                        </button>
                        <button
                          onClick={() =>
                            setModes((m) => ({ ...m, [ind.name]: { type: 'merge', target: '' } }))
                          }
                          className="px-2.5 py-1 rounded text-xs font-medium border text-gray-600 hover:bg-gray-50 transition-colors"
                          style={{ borderColor: '#dde8f0' }}
                        >
                          Merge
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-400">
                  {search ? `No industries matching "${search}"` : 'No industries yet.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
