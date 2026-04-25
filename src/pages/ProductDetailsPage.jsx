import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Loader2, Droplet, Sprout, Download, MessageCircle, Shield, Beaker, Clock, Target, Leaf, Package } from 'lucide-react';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/* ── PDF datasheet generator (no external lib needed) ── */
const generateDatasheetPDF = (product) => {
  // Create a printable HTML window and trigger print/save as PDF
  const win = window.open('', '_blank', 'width=800,height=1000');
  if (!win) {
    alert('Please allow popups to download the datasheet.');
    return;
  }

  const compositionRows = (product.composition || [])
    .map(c => `<tr><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;">${c.component}</td><td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:600;">${c.amount}</td></tr>`)
    .join('');

  const applicationSteps = (product.applicationMethod || [])
    .map(s => `<div style="margin-bottom:8px;"><strong>Step ${s.step}: ${s.title}</strong> — ${s.instruction}</div>`)
    .join('');

  win.document.write(`<!DOCTYPE html><html><head><title>${product.name} - Technical Datasheet</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; color:#1e293b; padding:40px; max-width:800px; margin:0 auto; }
  .header { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #84cc16; padding-bottom:20px; margin-bottom:30px; }
  .logo { font-size:24px; font-weight:900; color:#84cc16; }
  .subtitle { font-size:11px; color:#64748b; margin-top:4px; }
  h1 { font-size:28px; font-weight:900; margin-bottom:4px; }
  h2 { font-size:16px; font-weight:700; color:#84cc16; margin:24px 0 12px; text-transform:uppercase; letter-spacing:0.05em; border-bottom:1px solid #e2e8f0; padding-bottom:6px; }
  .tech { font-size:12px; color:#64748b; margin-bottom:8px; }
  .desc { font-size:13px; line-height:1.6; color:#475569; margin-bottom:16px; }
  table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  th { background:#f1f5f9; padding:8px 12px; text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:0.05em; color:#64748b; }
  .specs-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .spec-item { padding:10px; background:#f8fafc; border-radius:8px; }
  .spec-label { font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; }
  .spec-value { font-size:14px; font-weight:600; color:#1e293b; margin-top:2px; }
  .footer { margin-top:40px; padding-top:16px; border-top:2px solid #e2e8f0; font-size:10px; color:#94a3b8; text-align:center; }
  .caution { background:#fef3c7; border:1px solid #fbbf24; border-radius:8px; padding:12px; font-size:12px; color:#92400e; margin-top:16px; }
  @media print { body { padding:20px; } }
</style></head><body>
<div class="header">
  <div><div class="logo">TulipCrop</div><div class="subtitle">Product Technical Datasheet</div></div>
  <div style="text-align:right;font-size:11px;color:#94a3b8;">Generated: ${new Date().toLocaleDateString()}<br/>Ref: TC-${product._id?.slice(-6)?.toUpperCase() || '000000'}</div>
</div>
<h1>${product.name}</h1>
${product.hindiName ? `<p style="font-size:16px;color:#84cc16;font-weight:700;margin-bottom:4px;">${product.hindiName}</p>` : ''}
<p class="tech">${product.technicalName || product.category}</p>
<p class="desc">${product.description}</p>

<h2>Chemical Composition</h2>
<table><thead><tr><th>Component</th><th style="text-align:right;">Amount</th></tr></thead><tbody>${compositionRows || '<tr><td colspan="2" style="padding:8px;color:#94a3b8;">Not available</td></tr>'}</tbody></table>

<h2>Technical Specifications</h2>
<div class="specs-grid">
  <div class="spec-item"><div class="spec-label">Category</div><div class="spec-value">${product.category || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Formulation</div><div class="spec-value">${product.formulation || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Pack Size</div><div class="spec-value">${product.packSize || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Mode of Action</div><div class="spec-value">${product.modeOfAction || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Dosage</div><div class="spec-value">${product.dosage || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Solubility</div><div class="spec-value">${product.solubility || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Target Pests</div><div class="spec-value">${product.targetPests || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Crop Type</div><div class="spec-value">${product.cropType || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Toxicity Level</div><div class="spec-value">${product.toxicityLevel || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Shelf Life</div><div class="spec-value">${product.shelfLife || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Active Ingredient</div><div class="spec-value">${product.activeIngredient || 'N/A'}</div></div>
  <div class="spec-item"><div class="spec-label">Manufacturer</div><div class="spec-value">${product.manufacturer || 'TulipCrop (India) Pvt. Ltd.'}</div></div>
</div>

${applicationSteps ? `<h2>Application Guide</h2>${applicationSteps}` : ''}
${product.dosage ? `<div style="margin-top:12px;padding:10px;background:#f0fdf4;border-radius:8px;font-size:13px;"><strong>Recommended Dosage:</strong> ${product.dosage}</div>` : ''}

<div class="caution">⚠️ <strong>Caution:</strong> Read the label carefully before use. Keep away from children, foodstuffs, and animal feed. Use protective clothing while spraying. Dispose of empty container safely.</div>

<div class="footer">
  <p><strong>TulipCrop (India) Pvt. Ltd.</strong></p>
  <p>This datasheet is for informational purposes. Always refer to product label for complete instructions.</p>
</div>
</body></html>`);

  win.document.close();
  setTimeout(() => { win.print(); }, 500);
};

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Composition');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/products/${id}`);
        setProduct(data);
        
        // Fetch similar products
        const { data: similar } = await axios.get(`${API}/api/products/${id}/similar`);
        setSimilarProducts(similar);
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
    // Scroll to top when product changes
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-lime animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Product not found</h2>
        <Link to="/products" className="text-brand-lime hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const imageSrc = typeof product.image === 'string' ? product.image.trim() : '';

  return (
    <div className="min-h-screen pt-24 pb-16 bg-slate-50 dark:bg-brand-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/products" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-lime transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Products</span>
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            
            {/* Left: Product Image with background */}
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-auto lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden flex items-center justify-center p-8 group shadow-2xl">
              {/* Farm background image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="/product-bg.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-lime/10 to-transparent" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-lime/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
              <div className="absolute inset-0 z-10 pointer-events-none opacity-60">
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-24 w-64 rounded-full bg-black/35 blur-3xl" />
              </div>
              {imageSrc ? (
                <img 
                  src={imageSrc} 
                  alt={product.name} 
                  className="relative z-20 max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  style={{
                    transform: 'translateY(10%)',
                    filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.42)) drop-shadow(0 28px 44px rgba(0,0,0,0.34))',
                  }}
                />
              ) : (
                <div className="relative z-20 flex flex-col items-center gap-3 text-white/80">
                  <Package className="w-14 h-14" />
                  <p className="text-sm font-semibold">Image will be updated from admin panel</p>
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  {product.technicalName || product.category}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-4 flex items-end gap-3 flex-wrap">
                  {product.name} 
                  {product.hindiName && <span className="text-3xl sm:text-4xl text-brand-lime font-bold tracking-normal leading-tight">({product.hindiName})</span>}
                </h1>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quick Badges */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Droplet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solubility</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{product.solubility || 'Water Soluble'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/80 shadow-sm border border-slate-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Crop Type</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{product.cropType || 'Universal'}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto scrollbar-hide">
                  {['Composition', 'Specs', 'Usage'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        activeTab === tab 
                          ? 'bg-brand-lime text-slate-900' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[200px]">
                  {activeTab === 'Composition' && (
                    <div className="animate-fade-in-up">
                      <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Chemical Composition</h3>
                      <div className="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-800/50">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                              <th className="px-5 py-3">Component</th>
                              <th className="px-5 py-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.composition && product.composition.length > 0 ? (
                              product.composition.map((item, idx) => (
                                <tr key={idx} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">{item.component}</td>
                                  <td className="px-5 py-3 text-right font-bold text-slate-900 dark:text-white font-mono">{item.amount}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="2" className="px-5 py-4 text-center text-slate-500">Composition details not available</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Specs' && (
                    <div className="animate-fade-in-up">
                      <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Specifications</h3>
                      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        {[
                          { label: 'Formulation', value: product.formulation, icon: Beaker },
                          { label: 'Pack Size', value: product.packSize, icon: Package },
                          { label: 'Mode of Action', value: product.modeOfAction, icon: Target },
                          { label: 'Toxicity Level', value: product.toxicityLevel, icon: Shield },
                          { label: 'Shelf Life', value: product.shelfLife, icon: Clock },
                          { label: 'Target Pests', value: product.targetPests, icon: Leaf },
                        ].map((spec, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-brand-lime flex-shrink-0 mt-0.5">
                              <spec.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">{spec.label}</p>
                              <p className="text-sm font-bold text-slate-900 dark:text-white">{spec.value || 'N/A'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'Usage' && (
                    <div className="animate-fade-in-up">
                      <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Application Guide</h3>
                      <div className="space-y-4">
                        {product.applicationMethod && product.applicationMethod.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {product.applicationMethod.map((step, idx) => (
                              <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10">
                                <div className="w-8 h-8 rounded-full bg-brand-lime flex items-center justify-center text-slate-900 font-black text-sm mb-3">
                                  {step.step}
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{step.title}</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400">{step.instruction}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-500 text-sm">Application details not available. Please refer to product packaging.</p>
                        )}
                        
                        {product.dosage && (
                          <div className="mt-6 p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Recommended Dosage</span>
                            <span className="text-base font-bold text-slate-900 dark:text-white">{product.dosage}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
                <Link to="/contact" className="w-full sm:w-auto px-8 py-4 bg-brand-lime text-slate-900 font-bold rounded-full hover:bg-brand-volt transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Enquire Now
                </Link>
                <button 
                  onClick={() => generateDatasheetPDF(product)}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Datasheet
                </button>
              </div>
            </div>
        </div>

        {/* Similar Products */}
        {similarProducts && similarProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
