/**
 * ProvadorVirtualAI Widget v1.0
 * Embed: <div id="provador-virtual" data-store="ABC123"></div>
 *        <script src="https://provadorvirtual.ai/widget.js" defer></script>
 */
(function () {
  'use strict';

  var API_URL = 'https://provadorvirtual.ai';
  var SESSION_ID = 'pvai_' + Math.random().toString(36).slice(2, 10);

  // ─── Estilos do Widget ────────────────────────────────────────────────────────
  var CSS = `
    #pvai-trigger {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 999998;
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 12px 18px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(219,39,119,0.35), 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
      letter-spacing: -0.2px;
      user-select: none;
    }
    #pvai-trigger:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 32px rgba(219,39,119,0.45), 0 4px 12px rgba(0,0,0,0.15);
    }
    #pvai-trigger:active { transform: scale(0.97); }
    #pvai-trigger svg { width: 16px; height: 16px; flex-shrink: 0; }
    #pvai-trigger .pvai-badge {
      background: rgba(255,255,255,0.25);
      font-size: 9px;
      padding: 2px 6px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    #pvai-overlay {
      position: fixed;
      inset: 0;
      z-index: 999999;
      display: none;
      align-items: flex-end;
      justify-content: center;
      background: rgba(0,0,0,0.55);
      backdrop-filter: blur(4px);
      padding: 0;
    }
    #pvai-overlay.pvai-open { display: flex; }

    @media (min-width: 640px) {
      #pvai-overlay { align-items: center; }
    }

    #pvai-modal {
      background: white;
      border-radius: 24px 24px 0 0;
      width: 100%;
      max-width: 420px;
      max-height: 92vh;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      animation: pvai-slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      padding: 0 0 24px;
      position: relative;
    }
    @media (min-width: 640px) {
      #pvai-modal {
        border-radius: 24px;
        max-height: 85vh;
      }
    }
    @keyframes pvai-slide-up {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    .pvai-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 20px 16px;
      border-bottom: 1px solid #f1f5f9;
      position: sticky;
      top: 0;
      background: white;
      z-index: 10;
      border-radius: 24px 24px 0 0;
    }
    .pvai-logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pvai-logo-icon {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, #db2777, #be185d);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pvai-logo-text {
      font-size: 14px;
      font-weight: 700;
      color: #111;
    }
    .pvai-logo-text span { color: #db2777; }
    .pvai-close {
      width: 32px; height: 32px;
      border: none;
      background: #f1f5f9;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: background 0.15s;
    }
    .pvai-close:hover { background: #e2e8f0; }

    .pvai-body { padding: 20px; }

    .pvai-step {
      display: none;
    }
    .pvai-step.pvai-active { display: block; }

    /* Step 1: Garment preview + Upload */
    .pvai-garment-preview {
      background: #f8fafc;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
      text-align: center;
    }
    .pvai-garment-preview img {
      max-height: 160px;
      max-width: 100%;
      object-fit: contain;
      border-radius: 8px;
    }
    .pvai-garment-preview .pvai-garment-name {
      margin-top: 8px;
      font-size: 13px;
      color: #475569;
      font-weight: 500;
    }

    .pvai-upload-area {
      border: 2px dashed #e2e8f0;
      border-radius: 16px;
      padding: 24px 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    .pvai-upload-area:hover, .pvai-upload-area.pvai-drag-over {
      border-color: #db2777;
      background: #fdf2f8;
    }
    .pvai-upload-area input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
      width: 100%;
      height: 100%;
    }
    .pvai-upload-icon {
      width: 48px; height: 48px;
      background: #fce7f3;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 12px;
    }
    .pvai-upload-title {
      font-size: 15px;
      font-weight: 600;
      color: #111;
      margin-bottom: 4px;
    }
    .pvai-upload-sub {
      font-size: 12px;
      color: #94a3b8;
    }
    .pvai-camera-btn {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #475569;
      cursor: pointer;
      transition: all 0.15s;
    }
    .pvai-camera-btn:hover { border-color: #db2777; color: #db2777; }

    .pvai-photo-preview {
      position: relative;
      margin-bottom: 16px;
    }
    .pvai-photo-preview img {
      width: 100%;
      border-radius: 16px;
      max-height: 240px;
      object-fit: cover;
    }
    .pvai-photo-preview .pvai-change-photo {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.6);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 11px;
      cursor: pointer;
      font-weight: 500;
    }

    /* Step 2: Processing */
    .pvai-processing {
      text-align: center;
      padding: 40px 20px;
    }
    .pvai-spinner-wrap {
      width: 80px; height: 80px;
      margin: 0 auto 20px;
      position: relative;
    }
    .pvai-spinner {
      width: 80px; height: 80px;
      border: 3px solid #fce7f3;
      border-top-color: #db2777;
      border-radius: 50%;
      animation: pvai-spin 0.8s linear infinite;
    }
    .pvai-spinner-icon {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
    }
    @keyframes pvai-spin {
      to { transform: rotate(360deg); }
    }
    .pvai-processing-title {
      font-size: 17px;
      font-weight: 700;
      color: #111;
      margin-bottom: 8px;
    }
    .pvai-processing-sub {
      font-size: 13px;
      color: #94a3b8;
    }
    .pvai-progress-bar {
      width: 100%;
      height: 4px;
      background: #f1f5f9;
      border-radius: 99px;
      margin-top: 20px;
      overflow: hidden;
    }
    .pvai-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #db2777, #f472b6);
      border-radius: 99px;
      animation: pvai-progress 8s ease-in-out forwards;
      width: 0%;
    }
    @keyframes pvai-progress {
      0%   { width: 0%; }
      30%  { width: 35%; }
      60%  { width: 65%; }
      90%  { width: 88%; }
      100% { width: 95%; }
    }

    /* Step 3: Result */
    .pvai-result-compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    .pvai-compare-item {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      background: #f8fafc;
    }
    .pvai-compare-item img {
      width: 100%;
      aspect-ratio: 3/4;
      object-fit: cover;
    }
    .pvai-compare-label {
      position: absolute;
      bottom: 6px;
      left: 6px;
      background: rgba(0,0,0,0.65);
      color: white;
      font-size: 10px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 6px;
    }
    .pvai-ai-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background: #db2777;
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 6px;
      letter-spacing: 0.5px;
    }

    .pvai-result-image-full {
      width: 100%;
      border-radius: 16px;
      margin-bottom: 16px;
      max-height: 360px;
      object-fit: contain;
      background: #f8fafc;
    }

    /* Buttons */
    .pvai-btn-primary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: linear-gradient(135deg, #db2777, #be185d);
      color: white;
      border: none;
      border-radius: 14px;
      padding: 15px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(219,39,119,0.3);
      text-decoration: none;
    }
    .pvai-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(219,39,119,0.4);
    }
    .pvai-btn-secondary {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      background: white;
      color: #475569;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      margin-top: 8px;
    }
    .pvai-btn-secondary:hover { border-color: #cbd5e1; background: #f8fafc; }

    .pvai-submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      background: linear-gradient(135deg, #db2777, #be185d);
      color: white;
      border: none;
      border-radius: 14px;
      padding: 15px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(219,39,119,0.3);
      margin-top: 16px;
    }
    .pvai-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .pvai-submit-btn:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(219,39,119,0.4);
    }

    /* Error */
    .pvai-error {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 13px;
      color: #dc2626;
      margin-bottom: 12px;
    }

    /* Tips */
    .pvai-tips {
      display: flex;
      gap: 6px;
      margin-top: 12px;
    }
    .pvai-tip {
      flex: 1;
      background: #f8fafc;
      border-radius: 10px;
      padding: 8px;
      text-align: center;
      font-size: 10px;
      color: #64748b;
    }
    .pvai-tip-icon { font-size: 18px; display: block; margin-bottom: 3px; }

    /* Footer */
    .pvai-footer {
      text-align: center;
      font-size: 10px;
      color: #cbd5e1;
      margin-top: 14px;
    }
    .pvai-footer a {
      color: #db2777;
      text-decoration: none;
    }

    /* Dark overlay click */
    #pvai-overlay-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }
    #pvai-modal { position: relative; z-index: 1; }

    /* ── Banner trigger (modo fixo) ──────────────────────────────── */
    #pvai-banner-trigger { cursor: pointer; display: block; }
    .pvai-banner-default {
      display: flex;
      align-items: center;
      gap: 14px;
      background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
      color: white;
      padding: 16px 20px;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(219,39,119,0.25);
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      user-select: none;
    }
    .pvai-banner-default:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(219,39,119,0.35);
    }
    .pvai-banner-icon {
      width: 44px; height: 44px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .pvai-banner-icon svg { width: 20px; height: 20px; }
    .pvai-banner-text { flex: 1; }
    .pvai-banner-title { font-size: 15px; font-weight: 700; line-height: 1.2; }
    .pvai-banner-sub { font-size: 12px; opacity: 0.85; margin-top: 2px; }
    .pvai-banner-arrow {
      width: 32px; height: 32px;
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .pvai-banner-img-wrap { display: block; cursor: pointer; transition: opacity 0.15s; }
    .pvai-banner-img-wrap:hover { opacity: 0.9; }
    .pvai-banner-img-wrap img { display: block; max-width: 100%; height: auto; }
  `;

  // ─── SVGs ─────────────────────────────────────────────────────────────────────
  var ICON_SPARKLES = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.88 5.78L20 12l-6.12 3.22L12 21l-1.88-5.78L4 12l6.12-3.22z"/></svg>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var ICON_UPLOAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  var ICON_CAMERA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>';
  var ICON_CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.61L23 6H6"/></svg>';
  var ICON_RETRY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 101.85-8.73L1 10"/></svg>';
  var ICON_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';

  // ─── State ────────────────────────────────────────────────────────────────────
  var state = {
    storeId: null,
    step: 1, // 1=upload, 2=processing, 3=result
    userPhotoFile: null,
    userPhotoUrl: null,
    garmentUrl: null,
    garmentName: null,
    resultUrl: null,
    productUrl: null,
    buyUrl: null,
    error: null,
    cameraStream: null,
  };

  // ─── Init ─────────────────────────────────────────────────────────────────────
  function init() {
    var container = document.getElementById('provador-virtual');
    if (!container) return;

    state.storeId = container.dataset.store;
    if (!state.storeId) {
      console.warn('[ProvadorVirtualAI] data-store attribute is required');
      return;
    }

    // Detect API URL from script src
    var scripts = document.querySelectorAll('script[src*="widget.js"]');
    if (scripts.length) {
      var src = scripts[scripts.length - 1].src;
      var match = src.match(/^(https?:\/\/[^/]+)/);
      if (match) API_URL = match[1];
    }

    var mode      = container.dataset.mode   || 'float'; // 'float' | 'banner'
    var bannerSrc = container.dataset.banner || 'default';
    var color     = container.dataset.color  || '#db2777';

    // Detect garment from page
    state.garmentUrl = detectGarmentImage();
    state.garmentName = detectProductName();
    state.productUrl = window.location.href;
    state.buyUrl = detectBuyUrl();

    injectStyles();
    if (color !== '#db2777') injectColorOverride(color);

    if (mode === 'banner') {
      createBannerTrigger(container, bannerSrc);
    } else {
      createTriggerButton();
    }
    createModal();
  }

  // ─── Personalização de cor ────────────────────────────────────────────────────
  function injectColorOverride(hex) {
    var r = parseInt(hex.slice(1, 3), 16) || 219;
    var g = parseInt(hex.slice(3, 5), 16) || 39;
    var b = parseInt(hex.slice(5, 7), 16) || 119;
    var rgb  = r + ',' + g + ',' + b;
    var dark = '#' + [r * 0.78, g * 0.78, b * 0.78].map(function(v) {
      return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
    }).join('');
    var light = '#' + [r + (255-r)*0.45, g + (255-g)*0.45, b + (255-b)*0.45].map(function(v) {
      return Math.min(255, Math.round(v)).toString(16).padStart(2, '0');
    }).join('');
    var s = document.createElement('style');
    s.textContent = [
      '#pvai-trigger{background:linear-gradient(135deg,'+hex+' 0%,'+dark+' 100%)!important;box-shadow:0 8px 24px rgba('+rgb+',0.35),0 2px 8px rgba(0,0,0,0.1)!important}',
      '#pvai-trigger:hover{box-shadow:0 12px 32px rgba('+rgb+',0.45),0 4px 12px rgba(0,0,0,0.15)!important}',
      '.pvai-logo-icon{background:linear-gradient(135deg,'+hex+','+dark+')!important}',
      '.pvai-logo-text span{color:'+hex+'!important}',
      '.pvai-footer a{color:'+hex+'!important}',
      '.pvai-badge{background:rgba('+rgb+',0.25)!important}',
      '.pvai-upload-area:hover,.pvai-upload-area.pvai-drag-over{border-color:'+hex+'!important}',
      '.pvai-camera-btn:hover{border-color:'+hex+'!important;color:'+hex+'!important}',
      '.pvai-spinner{border-top-color:'+hex+'!important;border-color:rgba('+rgb+',0.15)!important}',
      '.pvai-progress-fill{background:linear-gradient(90deg,'+hex+','+light+')!important}',
      '.pvai-ai-badge{background:'+hex+'!important}',
      '.pvai-btn-primary,.pvai-submit-btn{background:linear-gradient(135deg,'+hex+','+dark+')!important;box-shadow:0 4px 12px rgba('+rgb+',0.3)!important}',
      '.pvai-btn-primary:hover,.pvai-submit-btn:not(:disabled):hover{box-shadow:0 6px 16px rgba('+rgb+',0.4)!important}',
      '.pvai-banner-default{background:linear-gradient(135deg,'+hex+' 0%,'+dark+' 100%)!important;box-shadow:0 4px 16px rgba('+rgb+',0.25)!important}',
      '.pvai-banner-default:hover{box-shadow:0 8px 24px rgba('+rgb+',0.35)!important}',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ─── Banner trigger (modo fixo) ───────────────────────────────────────────────
  function createBannerTrigger(container, bannerSrc) {
    var wrap = document.createElement('div');
    wrap.id = 'pvai-banner-trigger';
    if (bannerSrc && bannerSrc !== 'default') {
      wrap.innerHTML = '<div class="pvai-banner-img-wrap"><img src="' + bannerSrc + '" alt="Experimentar virtualmente com IA" /></div>';
    } else {
      wrap.innerHTML = '<div class="pvai-banner-default">' +
        '<div class="pvai-banner-icon">' + ICON_SPARKLES.replace('stroke="currentColor"', 'stroke="white"') + '</div>' +
        '<div class="pvai-banner-text">' +
          '<div class="pvai-banner-title">Experimentar Virtualmente</div>' +
          '<div class="pvai-banner-sub">Veja como fica antes de comprar · IA</div>' +
        '</div>' +
        '<div class="pvai-banner-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" width="14" height="14"><polyline points="9 18 15 12 9 6"/></svg></div>' +
        '</div>';
    }
    wrap.onclick = openModal;
    container.appendChild(wrap);
  }

  function detectGarmentImage() {
    // Tenta encontrar imagem do produto via seletores comuns
    var selectors = [
      '[data-pvai-garment]',
      '.product-featured-image img',
      '.product__image img',
      '.product-single__photo img',
      '.woocommerce-product-gallery__image img',
      '.product-image img',
      '#product-image img',
      '[class*="product-image"] img',
      '[class*="ProductImage"] img',
      'figure.product img',
      '.gallery-image img',
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.src) return el.src;
    }
    // Fallback: maior imagem da página
    var imgs = document.querySelectorAll('img');
    var largest = null, largestArea = 0;
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      var area = img.naturalWidth * img.naturalHeight;
      if (area > largestArea && img.naturalWidth > 200) {
        largestArea = area;
        largest = img;
      }
    }
    return largest ? largest.src : null;
  }

  function detectProductName() {
    var selectors = [
      '[data-pvai-product-name]',
      'h1.product-title',
      'h1.product_title',
      '.product-name h1',
      '.product-single__title',
      'h1[class*="product"]',
      'h1[class*="Product"]',
      'h1',
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el && el.textContent.trim()) return el.textContent.trim().slice(0, 80);
    }
    return document.title.slice(0, 80);
  }

  function detectBuyUrl() {
    var cartSelectors = [
      '[data-pvai-buy-url]',
      'a[href*="cart"]',
      'a[href*="checkout"]',
      'button[name="add"]',
      '.btn-add-to-cart',
      '#add-to-cart',
    ];
    for (var i = 0; i < cartSelectors.length; i++) {
      var el = document.querySelector(cartSelectors[i]);
      if (el) return el.href || state.productUrl;
    }
    return state.productUrl;
  }

  // ─── Styles ───────────────────────────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('pvai-styles')) return;
    var style = document.createElement('style');
    style.id = 'pvai-styles';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // ─── Trigger Button ───────────────────────────────────────────────────────────
  function createTriggerButton() {
    var btn = document.createElement('button');
    btn.id = 'pvai-trigger';
    btn.innerHTML = ICON_SPARKLES + '<span>Experimentar Virtual</span><span class="pvai-badge">IA</span>';
    btn.onclick = openModal;
    document.body.appendChild(btn);
  }

  // ─── Modal ────────────────────────────────────────────────────────────────────
  function createModal() {
    var overlay = document.createElement('div');
    overlay.id = 'pvai-overlay';

    var bg = document.createElement('div');
    bg.id = 'pvai-overlay-bg';
    bg.onclick = closeModal;

    var modal = document.createElement('div');
    modal.id = 'pvai-modal';
    modal.innerHTML = renderModal();

    overlay.appendChild(bg);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    bindModalEvents();
  }

  function renderModal() {
    return `
      <div class="pvai-header">
        <div class="pvai-logo">
          <div class="pvai-logo-icon">${ICON_SPARKLES.replace('stroke="currentColor"', 'stroke="white"')}</div>
          <div class="pvai-logo-text">Provador<span>Virtual</span>AI</div>
        </div>
        <button class="pvai-close" id="pvai-close-btn">${ICON_CLOSE}</button>
      </div>
      <div class="pvai-body">
        ${renderStep1()}
        ${renderStep2()}
        ${renderStep3()}
      </div>
    `;
  }

  function renderStep1() {
    var garmentHtml = state.garmentUrl
      ? `<div class="pvai-garment-preview">
           <img src="${state.garmentUrl}" alt="Produto" />
           <div class="pvai-garment-name">${state.garmentName || 'Produto'}</div>
         </div>`
      : `<div class="pvai-garment-preview" style="background:#fdf2f8;border:1px dashed #fbcfe8;">
           <div style="padding:16px;color:#db2777;font-size:13px;">
             Imagem do produto não detectada automaticamente.<br>
             Adicione <code>data-pvai-garment</code> à imagem do produto.
           </div>
         </div>`;

    return `<div class="pvai-step pvai-active" id="pvai-step-1">
      <p style="font-size:14px;color:#475569;margin-bottom:12px;font-weight:500;">
        Tire ou envie uma foto sua para experimentar virtualmente:
      </p>
      ${garmentHtml}
      <div id="pvai-upload-area" class="pvai-upload-area">
        <input type="file" id="pvai-file-input" accept="image/*" capture="user" />
        <div class="pvai-upload-icon">${ICON_UPLOAD.replace('stroke="currentColor"', 'stroke="#db2777"')}</div>
        <div class="pvai-upload-title">Envie sua foto</div>
        <div class="pvai-upload-sub">JPG, PNG ou WEBP · Frente · Boa iluminação</div>
        <button type="button" class="pvai-camera-btn" id="pvai-camera-btn">
          ${ICON_CAMERA.replace('stroke="currentColor"', 'stroke="currentColor"')} Usar câmera
        </button>
      </div>
      <div class="pvai-tips">
        <div class="pvai-tip"><span class="pvai-tip-icon">🧍</span>Foto de frente</div>
        <div class="pvai-tip"><span class="pvai-tip-icon">☀️</span>Boa iluminação</div>
        <div class="pvai-tip"><span class="pvai-tip-icon">👕</span>Roupa simples</div>
      </div>
      <div id="pvai-step1-error" class="pvai-error" style="display:none;margin-top:12px;"></div>
      <div class="pvai-footer">
        Alimentado por IA · Foto processada e descartada após uso ·
        <a href="https://provadorvirtual.ai" target="_blank">ProvadorVirtualAI</a>
      </div>
    </div>`;
  }

  function renderStep2() {
    return `<div class="pvai-step" id="pvai-step-2">
      <div class="pvai-processing">
        <div class="pvai-spinner-wrap">
          <div class="pvai-spinner"></div>
          <div class="pvai-spinner-icon">✨</div>
        </div>
        <div class="pvai-processing-title">Gerando seu look...</div>
        <div class="pvai-processing-sub">Nossa IA está combinando a roupa no seu corpo.<br>Isso leva alguns segundos.</div>
        <div class="pvai-progress-bar">
          <div class="pvai-progress-fill" id="pvai-progress-fill"></div>
        </div>
      </div>
      <div class="pvai-footer">
        ProvadorVirtualAI · Tecnologia de Virtual Try-On
      </div>
    </div>`;
  }

  function renderStep3() {
    return `<div class="pvai-step" id="pvai-step-3">
      <div id="pvai-result-content"></div>
      <div class="pvai-footer" style="margin-top:8px;">
        Imagem gerada por IA · Resultado pode variar · <a href="https://provadorvirtual.ai" target="_blank">ProvadorVirtualAI</a>
      </div>
    </div>`;
  }

  function bindModalEvents() {
    document.getElementById('pvai-close-btn').onclick = closeModal;

    var fileInput = document.getElementById('pvai-file-input');
    fileInput.onchange = function (e) {
      var file = e.target.files[0];
      if (file) handlePhotoSelected(file);
    };

    var uploadArea = document.getElementById('pvai-upload-area');
    uploadArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      uploadArea.classList.add('pvai-drag-over');
    });
    uploadArea.addEventListener('dragleave', function () {
      uploadArea.classList.remove('pvai-drag-over');
    });
    uploadArea.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadArea.classList.remove('pvai-drag-over');
      var file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) handlePhotoSelected(file);
    });

    document.getElementById('pvai-camera-btn').onclick = function (e) {
      e.stopPropagation();
      openCamera();
    };
  }

  // Reduz a imagem para max 1024px e JPEG 75% antes de enviar (evita body > 4.5MB)
  function compressImage(dataUrl, callback) {
    var img = new Image();
    img.onload = function () {
      var MAX = 1024;
      var w = img.width, h = img.height;
      if (w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      if (h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', 0.75));
    };
    img.src = dataUrl;
  }

  function handlePhotoSelected(file) {
    state.userPhotoFile = file;
    var reader = new FileReader();
    reader.onload = function (e) {
      compressImage(e.target.result, function (compressed) {
        state.userPhotoUrl = compressed;
        showPhotoPreview();
      });
    };
    reader.readAsDataURL(file);
  }

  function showPhotoPreview() {
    var step1 = document.getElementById('pvai-step-1');
    step1.innerHTML = `
      <p style="font-size:14px;color:#475569;margin-bottom:12px;font-weight:500;">
        Sua foto está pronta! Clique em experimentar para continuar:
      </p>
      <div class="pvai-photo-preview">
        <img src="${state.userPhotoUrl}" alt="Sua foto" />
        <button class="pvai-change-photo" id="pvai-change-photo">🔄 Trocar foto</button>
      </div>
      <div id="pvai-step1-error" class="pvai-error" style="display:none;"></div>
      <button class="pvai-submit-btn" id="pvai-submit-btn">
        ${ICON_SPARKLES.replace('stroke="currentColor"', 'stroke="white"')} Experimentar agora!
      </button>
      <div class="pvai-footer" style="margin-top:12px;">
        Foto processada com segurança e descartada · <a href="https://provadorvirtual.ai" target="_blank">ProvadorVirtualAI</a>
      </div>
    `;

    document.getElementById('pvai-change-photo').onclick = function () {
      state.userPhotoFile = null;
      state.userPhotoUrl = null;
      rebuildStep1();
    };

    document.getElementById('pvai-submit-btn').onclick = submitTryOn;
  }

  function rebuildStep1() {
    var step1 = document.getElementById('pvai-step-1');
    step1.innerHTML = renderStep1().match(/<div class="pvai-step pvai-active"[^>]+>([\s\S]*)<\/div>\s*$/)[1] || '';
    // Re-create fresh step1
    var newStep1 = document.createElement('div');
    newStep1.innerHTML = renderStep1();
    var content = newStep1.querySelector('#pvai-step-1').innerHTML;
    document.getElementById('pvai-step-1').innerHTML = content;

    var fileInput = document.getElementById('pvai-file-input');
    if (fileInput) {
      fileInput.onchange = function (e) {
        var file = e.target.files[0];
        if (file) handlePhotoSelected(file);
      };
    }
    var cameraBtn = document.getElementById('pvai-camera-btn');
    if (cameraBtn) {
      cameraBtn.onclick = function (e) { e.stopPropagation(); openCamera(); };
    }
    var uploadArea = document.getElementById('pvai-upload-area');
    if (uploadArea) {
      uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault(); uploadArea.classList.add('pvai-drag-over');
      });
      uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('pvai-drag-over');
      });
      uploadArea.addEventListener('drop', function (e) {
        e.preventDefault(); uploadArea.classList.remove('pvai-drag-over');
        var file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) handlePhotoSelected(file);
      });
    }
  }

  function openCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      document.getElementById('pvai-file-input').click();
      return;
    }
    var video = document.createElement('video');
    var canvas = document.createElement('canvas');
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999999;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;';
    var snap = document.createElement('button');
    snap.textContent = '📷 Capturar foto';
    snap.style.cssText = 'margin-top:16px;padding:14px 28px;background:#db2777;color:white;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;';
    var cancel = document.createElement('button');
    cancel.textContent = 'Cancelar';
    cancel.style.cssText = 'margin-top:8px;padding:10px 20px;background:rgba(255,255,255,0.1);color:white;border:none;border-radius:10px;font-size:14px;cursor:pointer;';

    video.style.cssText = 'max-width:100%;max-height:60vh;border-radius:12px;';
    video.autoplay = true;
    video.playsinline = true;

    overlay.appendChild(video);
    overlay.appendChild(snap);
    overlay.appendChild(cancel);
    document.body.appendChild(overlay);

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }).then(function (stream) {
      state.cameraStream = stream;
      video.srcObject = stream;

      snap.onclick = function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(function (blob) {
          var file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
          stopCamera(stream, overlay);
          handlePhotoSelected(file);
        }, 'image/jpeg', 0.92);
      };
    }).catch(function () {
      stopCamera(null, overlay);
      document.getElementById('pvai-file-input').click();
    });

    cancel.onclick = function () { stopCamera(stream, overlay); };
  }

  function stopCamera(stream, overlay) {
    if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
    state.cameraStream = null;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  // ─── TryOn Submit ─────────────────────────────────────────────────────────────
  var pollAttempts = 0;

  function submitTryOn() {
    if (!state.userPhotoUrl) {
      showStep1Error('Por favor, envie ou tire uma foto primeiro.');
      return;
    }
    if (!state.garmentUrl) {
      showStep1Error('Não foi possível detectar a imagem do produto. Tente atualizar a página.');
      return;
    }

    pollAttempts = 0;
    goToStep(2);

    // 1. Cria a predição (rápido, retorna predictionId)
    fetch(API_URL + '/api/tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: state.storeId,
        userPhotoUrl: state.userPhotoUrl,
        garmentUrl: state.garmentUrl,
        productUrl: state.productUrl,
        productName: state.garmentName,
        sessionId: SESSION_ID,
      }),
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.error) throw new Error(data.error);
        // 2. Aguarda resultado via polling
        pollPrediction(data.predictionId);
      })
      .catch(function (err) {
        goToStep(1);
        showStep1Error(err.message || 'Erro ao iniciar. Tente novamente.');
      });
  }

  // Consulta o status a cada 3s até concluir (máx. 2 minutos)
  function pollPrediction(predictionId) {
    if (pollAttempts >= 40) {
      goToStep(1);
      pollAttempts = 0;
      showStep1Error('Tempo esgotado. Tente novamente.');
      return;
    }
    pollAttempts++;

    setTimeout(function () {
      fetch(API_URL + '/api/tryon?id=' + predictionId)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.status === 'succeeded') {
            state.resultUrl = data.imageUrl;
            pollAttempts = 0;
            showResult();
          } else if (data.status === 'failed') {
            goToStep(1);
            pollAttempts = 0;
            showStep1Error(data.error || 'Erro ao gerar imagem. Tente novamente.');
          } else {
            // starting | processing — continua aguardando
            pollPrediction(predictionId);
          }
        })
        .catch(function () {
          // Erro de rede — tenta novamente
          pollPrediction(predictionId);
        });
    }, 3000);
  }

  function showResult() {
    goToStep(3);
    var container = document.getElementById('pvai-result-content');
    container.innerHTML = `
      <p style="font-size:14px;font-weight:600;color:#111;margin-bottom:12px;">
        ✨ Seu look virtual está pronto!
      </p>
      <div class="pvai-result-compare">
        <div class="pvai-compare-item">
          <img src="${state.userPhotoUrl}" alt="Você" />
          <span class="pvai-compare-label">Você</span>
        </div>
        <div class="pvai-compare-item">
          <img src="${state.resultUrl}" alt="Com a peça" />
          <span class="pvai-compare-label">Com a peça</span>
          <span class="pvai-ai-badge">IA</span>
        </div>
      </div>
      <a href="${state.buyUrl || state.productUrl}" class="pvai-btn-primary" id="pvai-buy-btn" target="_blank">
        ${ICON_CART.replace('stroke="currentColor"', 'stroke="white"')} Comprar agora
      </a>
      <button class="pvai-btn-secondary" id="pvai-retry-btn">
        ${ICON_RETRY} Tentar com outra foto
      </button>
      <button class="pvai-btn-secondary" id="pvai-share-btn" style="margin-top:4px;">
        ${ICON_SHARE} Compartilhar look
      </button>
    `;

    document.getElementById('pvai-buy-btn').onclick = trackConversion;
    document.getElementById('pvai-retry-btn').onclick = function () {
      state.userPhotoFile = null;
      state.userPhotoUrl = null;
      state.resultUrl = null;
      goToStep(1);
      rebuildStep1();
    };
    document.getElementById('pvai-share-btn').onclick = shareResult;
  }

  function trackConversion() {
    fetch(API_URL + '/api/tryon', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: SESSION_ID,
        storeId: state.storeId,
        revenue: 0,
      }),
    }).catch(function () {});
  }

  function shareResult() {
    if (navigator.share) {
      navigator.share({
        title: 'Veja como ficou!',
        text: 'Experimentei ' + (state.garmentName || 'essa roupa') + ' virtualmente com IA!',
        url: state.productUrl,
      }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(state.productUrl);
      alert('Link copiado!');
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  function goToStep(n) {
    state.step = n;
    for (var i = 1; i <= 3; i++) {
      var el = document.getElementById('pvai-step-' + i);
      if (el) el.classList.toggle('pvai-active', i === n);
    }
    if (n === 2) {
      // Reset progress bar
      var fill = document.getElementById('pvai-progress-fill');
      if (fill) {
        fill.style.animation = 'none';
        fill.offsetHeight;
        fill.style.animation = '';
      }
    }
  }

  function showStep1Error(msg) {
    var el = document.getElementById('pvai-step1-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function openModal() {
    var overlay = document.getElementById('pvai-overlay');
    if (overlay) overlay.classList.add('pvai-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    var overlay = document.getElementById('pvai-overlay');
    if (overlay) overlay.classList.remove('pvai-open');
    document.body.style.overflow = '';
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(function (t) { t.stop(); });
      state.cameraStream = null;
    }
  }

  // ─── Keyboard ─────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  // ─── Bootstrap ────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
