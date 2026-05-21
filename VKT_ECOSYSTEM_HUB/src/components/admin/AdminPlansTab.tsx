import { useState } from 'react';
import { Plus, Save, Trash2, Loader2, Package } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import type { Plan } from '../../data/apps';

export const AdminPlansTab = () => {
  const { plans, apps, addPlan, updatePlan, deletePlan, siteConfig, updateSiteConfig } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Plan>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleEdit = (plan: Plan) => {
    setFormData(plan);
    setEditingId(plan.id);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setFormData({
      type: 'single',
      name: '',
      description: '',
      appIds: [],
      durationDays: 30,
      price: 0,
      currency: 'VND',
      isActive: true,
    });
    setIsAdding(true);
    setEditingId('new');
  };

  const handleSave = async () => {
    if (!formData.name) return alert('Vui lòng nhập tên gói');
    setSaving(true);
    try {
      if (isAdding) {
        await addPlan(formData as any);
      } else if (editingId) {
        await updatePlan({ ...formData, id: editingId } as Plan);
      }
      setEditingId(null);
      setIsAdding(false);
    } catch (e) {
      alert('Lỗi lưu gói');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa gói này?')) {
      await deletePlan(id);
    }
  };

  const toggleAppId = (appId: string) => {
    const current = formData.appIds || [];
    if (current.includes(appId)) {
      setFormData({ ...formData, appIds: current.filter(id => id !== appId) });
    } else {
      setFormData({ ...formData, appIds: [...current, appId] });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Quản Lý Gói Dịch Vụ</h2>
          <p className="text-slate-400 text-sm">Tạo và cấu hình các gói truy cập ứng dụng (Plans)</p>
        </div>
        
        {/* Toggle Thanh toán */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">Tính Năng Thanh Toán</p>
            <p className="text-[10px] text-slate-500">{siteConfig?.paymentEnabled ? 'Đang hiển thị giá & nút mua' : 'Đang ẩn giá (Chế độ nội bộ)'}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={!!siteConfig?.paymentEnabled}
              onChange={(e) => updateSiteConfig({ ...siteConfig, paymentEnabled: e.target.checked })}
            />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Plans */}
        <div className="lg:col-span-1 space-y-3">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${editingId === plan.id ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
              onClick={() => handleEdit(plan)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium flex items-center gap-2">
                    <Package size={14} className="text-indigo-400" /> {plan.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">{plan.durationDays} ngày • {(!plan.appIds || plan.appIds.length === 0) ? 'Tất cả app' : `${plan.appIds.length} app`}</p>
                  {siteConfig?.paymentEnabled && (
                    <p className="text-emerald-400 text-sm font-semibold mt-2">{(plan.price || 0).toLocaleString()}đ</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={!!plan.isActive}
                      onChange={async (e) => {
                        const newActive = e.target.checked;
                        try {
                          await updatePlan({ ...plan, isActive: newActive });
                          if (editingId === plan.id) {
                            setFormData(prev => ({ ...prev, isActive: newActive }));
                          }
                        } catch (err) {
                          alert('Không thể thay đổi trạng thái gói');
                        }
                      }}
                    />
                    <div className="w-8 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className={`text-[9px] font-semibold uppercase tracking-wider ${plan.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {plan.isActive ? 'Đang bật' : 'Đã tắt'}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          <button 
            onClick={handleAdd}
            className="w-full p-4 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all flex flex-col items-center justify-center gap-2"
          >
            <Plus size={20} />
            <span className="text-sm font-medium">Tạo Gói Mới</span>
          </button>
        </div>

        {/* Form Editor */}
        <div className="lg:col-span-2">
          {editingId ? (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">{isAdding ? 'Tạo Gói Mới' : 'Chỉnh Sửa Gói'}</h3>
                {!isAdding && (
                  <button onClick={() => handleDelete(formData.id!)} className="text-red-400 hover:text-red-300 p-2 bg-red-500/10 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Tên gói</label>
                    <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Loại gói</label>
                    <select value={formData.type || 'single'} onChange={e => setFormData({...formData, type: e.target.value as any})}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none">
                      <option value="single">Gói Lẻ (1 App)</option>
                      <option value="bundle">Gói Combo (Nhiều App)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Mô tả ngắn</label>
                  <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Số ngày sử dụng</label>
                    <input type="number" value={formData.durationDays || 30} onChange={e => setFormData({...formData, durationDays: Number(e.target.value)})} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Giá tiền (VND) {siteConfig?.paymentEnabled ? '' : '- Đang ẩn'}</label>
                    <input type="number" value={formData.price || 0} onChange={e => setFormData({...formData, price: Number(e.target.value)})} 
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Các ứng dụng trong gói</label>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.appIds?.length === 0} 
                        onChange={() => setFormData({...formData, appIds: (formData.appIds?.length === 0 && apps.length > 0) ? [apps[0].id] : []})} 
                        className="w-4 h-4 text-indigo-600 rounded border-slate-700 bg-slate-800" />
                      <span className="text-slate-300 text-sm">Tất cả ứng dụng (Hiện tại & Tương lai)</span>
                    </label>
                    
                    <div className="col-span-2 border-t border-slate-800 my-2"></div>
                    
                    {apps.map(app => (
                      <label key={app.id} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" 
                          checked={formData.appIds?.includes(app.id)} 
                          onChange={() => toggleAppId(app.id)}
                          disabled={formData.appIds?.length === 0}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-700 bg-slate-800 disabled:opacity-50" />
                        <span className={`text-sm ${formData.appIds?.length === 0 ? 'text-slate-600' : 'text-slate-300'}`}>{app.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                      className="w-4 h-4 text-indigo-600 rounded border-slate-700 bg-slate-800" />
                    <span className="text-slate-300">Kích hoạt gói này</span>
                  </label>
                  
                  <div className="flex gap-3">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                      Hủy
                    </button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center gap-2">
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu Gói
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <Package size={48} className="text-slate-700 mb-4" />
              <h3 className="text-xl font-medium text-slate-400 mb-2">Chọn một gói để chỉnh sửa</h3>
              <p className="text-slate-500 text-sm max-w-sm">Hoặc tạo gói mới để quy định quyền truy cập ứng dụng cho người dùng.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
