import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CategoryMetadata, TicketCategory } from '../../types';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  ShieldCheck,
  X,
  Layers,
} from 'lucide-react';

export const AdminCategoriesView: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, tickets } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryMetadata | null>(null);

  const [name, setName] = useState<TicketCategory>('Network');
  const [description, setDescription] = useState('');
  const [defaultSlaHours, setDefaultSlaHours] = useState(4);
  const [assignedTeam, setAssignedTeam] = useState('Network Infrastructure Team');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('Network');
    setDescription('High speed intranet and campus connectivity routing');
    setDefaultSlaHours(4);
    setAssignedTeam('Network Support Specialist');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryMetadata) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setDefaultSlaHours(cat.defaultSlaHours);
    setAssignedTeam(cat.assignedTeam);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        description,
        defaultSlaHours: Number(defaultSlaHours),
        assignedTeam,
      });
    } else {
      addCategory({
        name,
        description,
        defaultSlaHours: Number(defaultSlaHours),
        assignedTeam,
        iconName: 'Folder',
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Category & Routing Taxonomy
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated routing rules, team assignments, and SLA resolution benchmarks.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const activeCount = tickets.filter(
            t => t.category === cat.name && t.status !== 'Resolved' && t.status !== 'Closed'
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-base text-slate-900">{cat.name}</span>
                  <span className="text-xs font-mono tabular-nums text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80 font-semibold">
                    {activeCount} active
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed min-h-[2.5rem]">
                  {cat.description}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>SLA Target:</span>
                  </span>
                  <span className="font-semibold text-slate-800 font-mono tabular-nums">
                    {cat.defaultSlaHours} Hours
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1 text-slate-500">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned Team:</span>
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                    {cat.assignedTeam}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 text-xs flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value as TicketCategory)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    SLA Target (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={72}
                    value={defaultSlaHours}
                    onChange={e => setDefaultSlaHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Assigned Team
                  </label>
                  <input
                    type="text"
                    value={assignedTeam}
                    onChange={e => setAssignedTeam(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
