<script id="video-data" type="application/json">
[
  {
    "id": "lamemecouleurdecoeur-official",
    "platform": "youtube",
    "embedUrl": "https://www.youtube.com/embed/cFqMX5_plfQ?enablejsapi=1&origin=https://www.vanuella.com&rel=0",
    "watchUrl": "https://youtu.be/cFqMX5_plfQ",
    "title": "La même couleur de cœur – Official Clip",
    "description": "Ballade cinématographique engagée par Vanuella Watt; cri de compassion et d’unité. Sortie digitale: 1 août 2025.",
    "thumbnail": "https://i.ytimg.com/vi/cFqMX5_plfQ/hqdefault.jpg",
    "badges": ["ChansonEngagée","VanuellaWatt","LaMemeCouleurDeCoeur","Humanité"],
    "instagram": "https://instagram.com/vanuella.watt",
    "facebook": "https://www.facebook.com/vanuellawatt",
    "publisher": "Vanuella Watt",
    "uploadDate": "2025-08-01T00:00:00+00:00"
  },
  {
    "id": "respire-official",
    "platform": "youtube",
    "embedUrl": "https://www.youtube.com/embed/egYImqLiopw?enablejsapi=1&origin=https://www.vanuella.com&rel=0",
    "watchUrl": "https://youtu.be/egYImqLiopw",
    "title": "Respire – Official",
    "description": "Hymne de résilience: 'Résiste, respire…'. Composition: Vanuella · Paroles: Stéphanie Watt · Arrangements: Philippe Léger.",
    "thumbnail": "https://i.ytimg.com/vi/egYImqLiopw/hqdefault.jpg",
    "badges": ["Respire","Résilience","Hymne"],
    "instagram": "https://instagram.com/vanuella.watt",
    "facebook": "https://www.facebook.com/vanuellawatt",
    "publisher": "Vanuella Watt",
    "uploadDate": "2025-08-15T00:00:00+00:00"
  }
]

(function(){
  document.addEventListener('DOMContentLoaded', function(){
    renderVideoCards('#video-grid', '#video-data');
});

/**
* Render cards from JSON placed in a <script type="application/json" id="video-data"> tag.
* @param {string} containerSel - CSS selector for the card grid container
* @param {string} dataSel - CSS selector for the JSON script element
*/

function renderVideoCards(containerSel, dataSel){
    const container = document.querySelector(containerSel);
    if(!container) return;

    const dataEl = document.querySelector(dataSel);
    let videos = [];
    try { videos = JSON.parse((dataEl && dataEl.textContent) || '[]'); } catch(e) { console.warn('Invalid video JSON', e); }

    videos.forEach(v => container.appendChild(buildVideoCard(v)));
}

function buildVideoCard(v){
    const card = el('div','video-card',{id: v.id || undefined});

    // Embed
    const embed = el('div','video-embed');
    const iframe = el('iframe', null, {
      src: v.embedUrl,
      title: v.title || 'Video',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      referrerpolicy: 'strict-origin-when-cross-origin',
      allowfullscreen: '',
      loading: 'lazy'
    });
    embed.appendChild(iframe);
    card.appendChild(embed);

    // Body
    const body = el('div','video-body');
    body.appendChild(textEl('p','video-title', v.title || 'Untitled Video'));
    body.appendChild(textEl('p','video-desc', v.description || ''));

    if (Array.isArray(v.badges) && v.badges.length){
      const badges = el('div','badges');
      v.badges.forEach(b => badges.appendChild(textEl('span','badge', '#'+b)));
      body.appendChild(badges);
    }

    const cta = el('div','cta');
    if (v.watchUrl) cta.appendChild(linkBtn('btn btn-youtube', v.watchUrl, 'Watch on YouTube'));
    if (v.instagram) cta.appendChild(linkBtn('btn btn-instagram', v.instagram, 'Instagram'));
    if (v.facebook) cta.appendChild(linkBtn('btn btn-facebook', v.facebook, 'Facebook'));
    body.appendChild(cta);

    if (v.credit) body.appendChild(textEl('p','small', v.credit));

    card.appendChild(body);

    // SEO: JSON-LD per video
    appendJsonLd(v);

    return card;
}

function appendJsonLd(v){
    if(!v || !v.title || !v.embedUrl) return;
    const normalizedUploadDate = normalizeUploadDate(v.uploadDate);
    const obj = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.title,
      description: v.description || '',
      thumbnailUrl: v.thumbnail ? [v.thumbnail] : undefined,
      embedUrl: v.embedUrl,
      url: v.watchUrl || v.embedUrl,
      publisher: v.publisher ? {"@type":"Organization","name": v.publisher} : undefined,
      uploadDate: normalizedUploadDate
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(obj, null, 2);
    document.body.appendChild(script);
}

function normalizeUploadDate(value){
    if(!value || typeof value !== 'string') return undefined;

    // Accept full datetime with timezone as-is.
    if(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)){
      return value;
    }

    // Normalize date-only values to midnight UTC for rich result compatibility.
    if(/^\d{4}-\d{2}-\d{2}$/.test(value)){
      return value + 'T00:00:00+00:00';
    }

    return undefined;
}

// helpers
function el(tag, className, attrs){
    const e = document.createElement(tag);
    if(className) e.className = className;
    if(attrs) for(const [k,val] of Object.entries(attrs)){
      if(val === undefined || val === null) continue;
      e.setAttribute(k, String(val));
    }
    return e;
  }
  function textEl(tag, className, text){ const e = el(tag, className); if(text) e.textContent = text; return e; }
  function linkBtn(cls, href, label){ const a = el('a', cls, {href, target:'_blank', rel:'noopener'}); a.textContent = label; return a; }
})
();


// Add expand/collapse functionality for descriptions

document.addEventListener('DOMContentLoaded', function() {
const descriptions = document.querySelectorAll('.video-description');

descriptions.forEach(desc => {
if (desc.scrollHeight > desc.clientHeight) {
const expandBtn = document.createElement('button');
expandBtn.className = 'expand-btn';
expandBtn.textContent = 'Read more...';

expandBtn.addEventListener('click', function() {
if (desc.classList.contains('expanded')) {
desc.classList.remove('expanded');
this.textContent = 'Read more...';
} else {
desc.classList.add('expanded');
this.textContent = 'Read less...';
}
});

desc.parentNode.insertBefore(expandBtn, desc.nextSibling);
}
});
});

// Add smooth scroll animations

const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0)';
}
});
}, observerOptions);

document.querySelectorAll('.video-card').forEach(card => {
card.style.opacity = '0';
card.style.transform = 'translateY(20px)';
card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
observer.observe(card);
});
</script>
