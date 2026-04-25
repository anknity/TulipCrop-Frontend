import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Pencil, Trash2, LogOut, Package2, Upload, X, Save, Loader2, Image as ImageIcon,
} from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const CATEGORIES = [
  'Herbicide', 'Fungicide', 'Insecticide', 'PGR', 'Bio Products', 'Fertilizers',
]

const emptyProduct = {
  name: '', hindiName: '', technicalName: '', category: 'Herbicide', badge: '', activeIngredient: '',
  description: '', formulation: '', packSize: '', dosage: '', solubility: '', cropType: '',
  targetPests: '', modeOfAction: '', toxicityLevel: '', shelfLife: '', manufacturer: '',
  composition: [], applicationMethod: []
}

const AdminPanel = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ ...emptyProduct })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [activeTab, setActiveTab] = useState('basic') // basic, specs, advanced

  const token = localStorage.getItem('adminToken')

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/products`)
      setProducts(data)
    } catch (err) {
      console.error('Failed to fetch products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminEmail')
    navigate('/admin/login')
  }

  const openAddForm = () => {
    setEditId(null)
    setForm({ ...emptyProduct })
    setImageFile(null)
    setImagePreview('')
    setActiveTab('basic')
    setShowForm(true)
  }

  const openEditForm = (product) => {
    setEditId(product._id)
    setForm({
      name: product.name || '',
      hindiName: product.hindiName || '',
      technicalName: product.technicalName || '',
      category: product.category || 'Herbicide',
      badge: product.badge || '',
      activeIngredient: product.activeIngredient || '',
      description: product.description || '',
      formulation: product.formulation || '',
      packSize: product.packSize || '',
      dosage: product.dosage || '',
      solubility: product.solubility || '',
      cropType: product.cropType || '',
      targetPests: product.targetPests || '',
      modeOfAction: product.modeOfAction || '',
      toxicityLevel: product.toxicityLevel || '',
      shelfLife: product.shelfLife || '',
      manufacturer: product.manufacturer || '',
      composition: product.composition || [],
      applicationMethod: product.applicationMethod || []
    })
    setImageFile(null)
    setImagePreview(product.image || '')
    setActiveTab('basic')
    setShowForm(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleCompChange = (index, field, value) => {
    const newComp = [...form.composition]
    newComp[index][field] = value
    setForm({ ...form, composition: newComp })
  }
  const addComp = () => setForm({ ...form, composition: [...form.composition, { component: '', amount: '' }] })
  const removeComp = (index) => setForm({ ...form, composition: form.composition.filter((_, i) => i !== index) })

  const handleAppChange = (index, field, value) => {
    const newApp = [...form.applicationMethod]
    newApp[index][field] = value
    setForm({ ...form, applicationMethod: newApp })
  }
  const addApp = () => setForm({ ...form, applicationMethod: [...form.applicationMethod, { step: form.applicationMethod.length + 1, title: '', instruction: '' }] })
  const removeApp = (index) => {
    const newApp = form.applicationMethod.filter((_, i) => i !== index).map((a, i) => ({ ...a, step: i + 1 }))
    setForm({ ...form, applicationMethod: newApp })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'composition' || key === 'applicationMethod') {
          formData.append(key, JSON.stringify(val))
        } else {
          formData.append(key, val)
        }
      })
      if (imageFile) formData.append('image', imageFile)

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }

      if (editId) {
        await axios.put(`${API}/api/products/${editId}`, formData, { headers })
      } else {
        await axios.post(`${API}/api/products`, formData, { headers })
      }

      setShowForm(false)
      fetchProducts()
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout()
      }
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    setDeleting(id)
    try {
      await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchProducts()
    } catch (err) {
      if (err.response?.status === 401) handleLogout()
      console.error('Delete failed:', err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TulipCrop Logo" className="w-11 h-11 object-contain" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {localStorage.getItem('adminEmail')} • Product Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAddForm} className="px-5 py-2.5 rounded-xl bg-brand-lime text-brand-dark font-semibold flex items-center gap-2 hover:bg-brand-volt transition-colors text-sm">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2 hover:border-red-300 hover:text-red-500 transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-5">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{products.length}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">Total Products</p>
          </div>
          {['Herbicide', 'Fungicide', 'Insecticide'].map((cat) => (
            <div key={cat} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] p-5">
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {products.filter((p) => p.category === cat).length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{cat}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
            <Package2 className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-slate-500 dark:text-slate-400 mb-2">No products yet</p>
            <button onClick={openAddForm} className="px-6 py-3 rounded-xl bg-brand-lime text-brand-dark font-semibold hover:bg-brand-volt mt-4 transition-colors">
              <Plus className="w-4 h-4 inline mr-2" />Add Product
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
            <div className="hidden md:grid md:grid-cols-[80px_1fr_150px_120px_100px_120px] gap-4 px-6 py-3 bg-slate-50 dark:bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-white/10">
              <span>Image</span><span>Product</span><span>Category</span><span>Formulation</span><span>Pack</span><span className="text-right">Actions</span>
            </div>
            {products.map((product) => (
              <div key={product._id} className="grid grid-cols-1 md:grid-cols-[80px_1fr_150px_120px_100px_120px] gap-4 px-6 py-4 items-center border-b border-slate-100 dark:border-white/5 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{product.activeIngredient}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{product.category}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{product.formulation || '—'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{product.packSize || '—'}</p>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => openEditForm(product)} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 hover:text-blue-600 transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 hover:text-red-600 transition-colors">
                    {deleting === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-white dark:bg-[#14161a] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex px-6 pt-4 border-b border-slate-200 dark:border-white/10 gap-6">
              {['basic', 'specs', 'advanced'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-semibold capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-brand-lime text-brand-lime' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                >
                  {tab} Details
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'basic' && (
                <div className="space-y-5">
                  <div>
                    <label className="text-xs uppercase text-slate-500 font-semibold">Product Image</label>
                    <div className="mt-2 flex items-center gap-4">
                      <label className="flex-1 flex flex-col items-center justify-center h-40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0d0f13] cursor-pointer hover:border-brand-lime transition-colors">
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-contain p-2" /> : <div className="text-slate-400 text-center"><Upload className="w-8 h-8 mx-auto mb-2"/><span className="text-sm">Upload Image</span></div>}
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" placeholder="Name *" />
                    <input value={form.hindiName} onChange={e => setForm({...form, hindiName: e.target.value})} className="input-field" placeholder="Hindi Name" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.technicalName} onChange={e => setForm({...form, technicalName: e.target.value})} className="input-field" placeholder="Technical Name" />
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field text-black dark:text-white">
                      {CATEGORIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="input-field" placeholder="Badge (e.g., SYSTEMIC)" />
                    <input value={form.activeIngredient} onChange={e => setForm({...form, activeIngredient: e.target.value})} className="input-field" placeholder="Active Ingredient Summary" />
                  </div>
                  <textarea required rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field" placeholder="Description *" />
                </div>
              )}

              {activeTab === 'specs' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.formulation} onChange={e => setForm({...form, formulation: e.target.value})} className="input-field" placeholder="Formulation (e.g. WP, EC)" />
                    <input value={form.packSize} onChange={e => setForm({...form, packSize: e.target.value})} className="input-field" placeholder="Pack Size (e.g. 500ml)" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="input-field" placeholder="Dosage" />
                    <input value={form.solubility} onChange={e => setForm({...form, solubility: e.target.value})} className="input-field" placeholder="Solubility" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.cropType} onChange={e => setForm({...form, cropType: e.target.value})} className="input-field" placeholder="Crop Type" />
                    <input value={form.targetPests} onChange={e => setForm({...form, targetPests: e.target.value})} className="input-field" placeholder="Target Pests (comma separated)" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.modeOfAction} onChange={e => setForm({...form, modeOfAction: e.target.value})} className="input-field" placeholder="Mode of Action" />
                    <input value={form.toxicityLevel} onChange={e => setForm({...form, toxicityLevel: e.target.value})} className="input-field" placeholder="Toxicity Level" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input value={form.shelfLife} onChange={e => setForm({...form, shelfLife: e.target.value})} className="input-field" placeholder="Shelf Life" />
                    <input value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} className="input-field" placeholder="Manufacturer" />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-8">
                  {/* Composition */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white">Chemical Composition</label>
                      <button type="button" onClick={addComp} className="text-xs bg-brand-lime text-black px-3 py-1 rounded-full font-bold">+ Add Component</button>
                    </div>
                    {form.composition.map((comp, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input value={comp.component} onChange={e => handleCompChange(i, 'component', e.target.value)} className="input-field flex-1 py-2 text-sm" placeholder="Component Name" />
                        <input value={comp.amount} onChange={e => handleCompChange(i, 'amount', e.target.value)} className="input-field w-32 py-2 text-sm" placeholder="Amount (e.g. 5%)" />
                        <button type="button" onClick={() => removeComp(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {form.composition.length === 0 && <p className="text-xs text-slate-500">No composition details added.</p>}
                  </div>

                  {/* Application Method */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white">Application Steps</label>
                      <button type="button" onClick={addApp} className="text-xs bg-brand-lime text-black px-3 py-1 rounded-full font-bold">+ Add Step</button>
                    </div>
                    {form.applicationMethod.map((app, i) => (
                      <div key={i} className="flex gap-2 mb-2 items-start">
                        <span className="p-2 text-slate-500 font-bold">{app.step}.</span>
                        <div className="flex-1 space-y-2">
                          <input value={app.title} onChange={e => handleAppChange(i, 'title', e.target.value)} className="input-field py-2 text-sm" placeholder="Step Title" />
                          <textarea value={app.instruction} onChange={e => handleAppChange(i, 'instruction', e.target.value)} className="input-field py-2 text-sm" rows="2" placeholder="Step Instructions" />
                        </div>
                        <button type="button" onClick={() => removeApp(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl mt-1"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {form.applicationMethod.length === 0 && <p className="text-xs text-slate-500">No application steps added.</p>}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-white/10 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-6 py-3 rounded-xl bg-brand-lime text-brand-dark font-bold flex items-center gap-2 hover:bg-brand-volt disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global styles for inputs injected safely */}
      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          background-color: rgb(248 250 252);
          border: 1px solid rgb(226 232 240);
          padding: 0.75rem 1rem;
          color: rgb(15 23 42);
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .dark .input-field {
          background-color: #0d0f13;
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .input-field:focus {
          outline: none;
          border-color: #84cc16;
        }
        .input-field::placeholder {
          color: rgb(148 163 184);
        }
        .dark .input-field::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </main>
  )
}

export default AdminPanel
