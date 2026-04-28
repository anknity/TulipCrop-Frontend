import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Pencil, Trash2, LogOut, Package2, Upload, ChevronLeft, Save, Loader2, Image as ImageIcon, Activity
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
  const [imageError, setImageError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [activeTab, setActiveTab] = useState('specs') // specs, advanced

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
      setProducts(data.reverse()) // Show newest first
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
    setImageError('')
    setActiveTab('specs')
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
    setImageError('')
    setActiveTab('specs')
    setShowForm(true)
  }

  const MAX_IMAGE_BYTES = 5 * 1024 * 1024

  const handleFileSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a valid image file.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be 5MB or less.')
      return
    }
    setImageError('')
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageChange = (e) => {
    handleFileSelect(e.target.files[0])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    handleFileSelect(file)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview('')
    setImageError('')
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

  // Analytics Calculations
  const distribution = useMemo(() => {
    if (products.length === 0) return []
    const counts = {}
    products.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    
    const colors = {
      'Herbicide': 'bg-red-500',
      'Fungicide': 'bg-blue-500',
      'Insecticide': 'bg-yellow-500',
      'PGR': 'bg-purple-500',
      'Bio Products': 'bg-green-500',
      'Fertilizers': 'bg-emerald-600',
    }

    const dist = Object.keys(counts).map(cat => ({
      category: cat,
      count: counts[cat],
      percentage: Math.round((counts[cat] / products.length) * 100),
      color: colors[cat] || 'bg-slate-500'
    })).sort((a, b) => b.count - a.count)
    return dist
  }, [products])

  const filteredProducts = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase()
    return products.filter((product) => {
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
      if (!normalized) return matchesCategory
      const haystack = [product.name, product.activeIngredient, product.technicalName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return matchesCategory && haystack.includes(normalized)
    })
  }, [products, searchQuery, categoryFilter])

  const dashboardStats = useMemo(() => {
    const total = products.length
    const categories = new Set(products.map((product) => product.category)).size
    const withImages = products.filter((product) => product.image).length
    const withBadges = products.filter((product) => product.badge).length
    return [
      { label: 'Total Products', value: total },
      { label: 'Active Categories', value: categories },
      { label: 'Products With Images', value: withImages },
      { label: 'Badged Products', value: withBadges },
    ]
  }, [products])

  // Sub-components for Form
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

  if (showForm) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#0d0f13] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowForm(false)} className="p-2 rounded-xl bg-white dark:bg-[#14161a] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {editId ? 'Edit Product' : 'Add New Product'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update product details, inventory, and media.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-xl bg-brand-lime text-brand-dark font-bold flex items-center gap-2 hover:bg-brand-volt disabled:opacity-60 transition-colors text-sm shadow-sm shadow-brand-lime/20">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </div>

          {/* Form Body - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            
            {/* Left Column */}
            <div className="space-y-6">
              {/* General Information Card */}
              <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                  <Package2 className="w-5 h-5 text-slate-400" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Information</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Product Name</label>
                    <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. Hunter Bio-Stimulant" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Hindi Name</label>
                      <input value={form.hindiName} onChange={e => setForm({...form, hindiName: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Hindi name (optional)" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Technical Name</label>
                      <input value={form.technicalName} onChange={e => setForm({...form, technicalName: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Technical name" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Chemical Formula / Active Ingredient</label>
                    <input value={form.activeIngredient} onChange={e => setForm({...form, activeIngredient: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. Pendimethalin 30% EC" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">Specify the active ingredients and concentration.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                    <textarea required rows="5" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Detailed product description..." />
                  </div>
                </div>
              </div>

              {/* Advanced Specs Card (Tabs for Specs / Application) */}
              <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
                 <div className="flex items-center gap-6 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                    {['specs', 'advanced'].map(tab => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-bold capitalize transition-colors ${activeTab === tab ? 'text-brand-lime' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                      >
                        {tab === 'specs' ? 'Specifications' : 'Composition & Application'}
                      </button>
                    ))}
                 </div>

                 {activeTab === 'specs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Formulation</label>
                      <input value={form.formulation} onChange={e => setForm({...form, formulation: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. WP, EC" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Dosage</label>
                      <input value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Dosage" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Target Pests</label>
                      <input value={form.targetPests} onChange={e => setForm({...form, targetPests: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Target Pests" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Crop Type</label>
                      <input value={form.cropType} onChange={e => setForm({...form, cropType: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Crop Type" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Mode of Action</label>
                      <input value={form.modeOfAction} onChange={e => setForm({...form, modeOfAction: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Mode of Action" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Solubility</label>
                      <input value={form.solubility} onChange={e => setForm({...form, solubility: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Solubility" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Manufacturer</label>
                      <input value={form.manufacturer} onChange={e => setForm({...form, manufacturer: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Manufacturer" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase">Toxicity Level</label>
                      <input value={form.toxicityLevel} onChange={e => setForm({...form, toxicityLevel: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="Toxicity Level" />
                    </div>
                  </div>
                 )}

                 {activeTab === 'advanced' && (
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-slate-900 dark:text-white">Chemical Composition</label>
                        <button type="button" onClick={addComp} className="text-xs bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">+ Add Component</button>
                      </div>
                      {form.composition.map((comp, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                          <input value={comp.component} onChange={e => handleCompChange(i, 'component', e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0 py-2" placeholder="Component Name" />
                          <input value={comp.amount} onChange={e => handleCompChange(i, 'amount', e.target.value)} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0 w-24 py-2" placeholder="Amount" />
                          <button type="button" onClick={() => removeComp(i)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {form.composition.length === 0 && <p className="text-xs text-slate-500">No composition added.</p>}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-slate-900 dark:text-white">Application Steps</label>
                        <button type="button" onClick={addApp} className="text-xs bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">+ Add Step</button>
                      </div>
                      {form.applicationMethod.map((app, i) => (
                        <div key={i} className="flex gap-2 mb-3 items-start bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                          <span className="w-6 h-6 rounded-full bg-brand-lime text-black flex items-center justify-center text-xs font-bold shrink-0">{app.step}</span>
                          <div className="flex-1 space-y-2">
                            <input value={app.title} onChange={e => handleAppChange(i, 'title', e.target.value)} className="form-input py-1.5 text-sm bg-white dark:bg-[#14161a]" placeholder="Step Title" />
                            <textarea value={app.instruction} onChange={e => handleAppChange(i, 'instruction', e.target.value)} className="form-input py-1.5 text-sm bg-white dark:bg-[#14161a]" rows="2" placeholder="Step Instructions" />
                          </div>
                          <button type="button" onClick={() => removeApp(i)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      ))}
                      {form.applicationMethod.length === 0 && <p className="text-xs text-slate-500">No application steps added.</p>}
                    </div>
                  </div>
                 )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Image Upload Card */}
              <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Product Image</label>
                <div
                  className={`relative rounded-xl border-2 border-dashed bg-slate-50 dark:bg-[#0d0f13] overflow-hidden group aspect-square flex items-center justify-center mb-3 transition-colors ${isDragging ? 'border-brand-lime' : 'border-slate-200 dark:border-white/10'} hover:border-brand-lime`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4 drop-shadow-xl" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <span className="text-sm font-medium">Drag & drop image here</span>
                      <p className="text-xs text-slate-400 mt-1">or click to upload</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <label className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-brand-lime transition-colors">
                        Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                     </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <Upload className="w-4 h-4" /> Change Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  {imagePreview && (
                    <button type="button" onClick={clearImage} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      Remove
                    </button>
                  )}
                </div>
                {imageError ? (
                  <p className="text-[11px] text-center text-red-500 mt-2">{imageError}</p>
                ) : (
                  <p className="text-[11px] text-center text-slate-400 mt-2">Allowed: .jpg, .png, .webp (max 5MB)</p>
                )}
              </div>

              {/* Organization Card */}
              <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider">Organization</label>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Pack Size</label>
                      <input value={form.packSize} onChange={e => setForm({...form, packSize: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. 1L" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Shelf Life</label>
                      <input value={form.shelfLife} onChange={e => setForm({...form, shelfLife: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. 2 Years" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Badge (Optional)</label>
                    <input value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0" placeholder="e.g. BESTSELLER" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0d0f13] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="TulipCrop Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Panel</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {localStorage.getItem('adminEmail')} • Product Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openAddForm} className="px-5 py-2.5 rounded-xl bg-brand-lime text-brand-dark font-bold flex items-center gap-2 hover:bg-brand-volt transition-colors text-sm shadow-sm shadow-brand-lime/20">
              <Plus className="w-4 h-4" /> Add Product
            </button>
            <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14161a] text-slate-600 dark:text-slate-300 font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-sm shadow-sm">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-4 shadow-sm">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          
          {/* Main Content (Table) */}
          <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
            <div className="flex flex-col gap-4 p-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Product Catalog</h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                  {filteredProducts.length} Items
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0"
                  placeholder="Search by name or ingredient..."
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-52 rounded-xl bg-slate-50 border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-brand-lime dark:bg-[#1a1d24] dark:border-white/10 dark:text-white dark:focus:border-brand-lime placeholder-slate-400 dark:placeholder-slate-500 transition-colors min-w-0"
                >
                  <option value="All">All categories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 flex-1">
                <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
                  <Package2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-1">No products found</p>
                <p className="text-sm text-slate-500 mb-4">Try adjusting your search or filters.</p>
                <button onClick={() => { setSearchQuery(''); setCategoryFilter('All') }} className="px-5 py-2.5 rounded-xl bg-brand-lime text-brand-dark font-bold hover:bg-brand-volt transition-colors text-sm">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
                      <th className="py-3 px-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Product</th>
                      <th className="py-3 px-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Category</th>
                      <th className="py-3 px-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">Status</th>
                      <th className="py-3 px-5 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d0f13] overflow-hidden shrink-0 flex items-center justify-center">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1 drop-shadow-sm" />
                              ) : (
                                <ImageIcon className="w-4 h-4 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{product.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{product.packSize || '1L Bottle'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.category}</p>
                        </td>
                        <td className="py-3 px-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide border border-emerald-200 dark:border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        </td>
                        <td className="py-3 px-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditForm(product)} className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product._id)} disabled={deleting === product._id} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                              {deleting === product._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-lime/20 flex items-center justify-center shrink-0">
                    <Package2 className="w-5 h-5 text-brand-lime" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Total Products</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">{products.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">Active Categories</p>
                    <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                      {new Set(products.map(p => p.category)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Distribution */}
            <div className="bg-white dark:bg-[#14161a] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5">Product Distribution</h3>
              
              {distribution.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No data available</p>
              ) : (
                <div className="space-y-5">
                  {distribution.map((item) => (
                    <div key={item.category}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${item.color.replace('bg-', 'text-').replace('500', '600')} dark:${item.color.replace('bg-', 'text-').replace('500', '400')} ${item.color.replace('bg-', 'bg-').replace('500', '500/10')}`}>
                          {item.category}
                        </span>
                        <span className={`text-xs font-bold ${item.color.replace('bg-', 'text-').replace('500', '600')} dark:${item.color.replace('bg-', 'text-').replace('500', '400')}`}>
                          {item.percentage}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full`} 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      
    </main>
  )
}

export default AdminPanel
