// ── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL  = 'https://srprgtciqzxqzwaammvg.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNycHJndGNpcXp4cXp3YWFtbXZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MDM0MjIsImV4cCI6MjA5NDQ3OTQyMn0.oVd6pHepTUN8UDPK8GtTi4KiQCXmB4R3oJYuTER8tY8';

// ── Seed data (Updated to match your actual profile/projects) ────────────────
const SEED = [
  { title:'TalkEng', featured:true, live_url:'#', github_url:null, short_description:'An English-learning platform offering 1-on-1 coaching, personality development, and random voice calling for co-learners.', tech_stack:['Flutter','Dart','WebRTC'] },
  { title:'Hero11 / KhiladiLive', featured:true, live_url:'https://khiladilive.in/', github_url:null, short_description:'A fantasy sports application featuring refined app UI/UX, seamless transitions, and real-time updates.', tech_stack:['Flutter','Firebase'] },
  { title:'RentMate', featured:false, live_url:'#', github_url:null, short_description:'A decentralized and AI-powered renting solution app. Currently developing the landing experience and core app architecture.', tech_stack:['Flutter','Node.js'] },
  { title:'Realtime P2P Chat', featured:false, live_url:null, github_url:'https://github.com/nandaydas/chat_app', short_description:'A peer-to-peer real-time communication application built with low-latency WebSockets and WebRTC.', tech_stack:['Flutter','WebSocket','Firebase'] },
  { title:'Social Auto-Poster', featured:false, live_url:null, github_url:null, short_description:'Automated workflows for social media management and API integrations utilizing n8n and AI agents.', tech_stack:['n8n','Automation','API'] },
  { title:"99INN's Hotels", featured:false, live_url:'https://play.google.com/store/apps/details?id=com.nintynineinns.hotels', github_url:null, short_description:'A mobile hotel booking application integrated with dynamic pricing APIs and seamless payment gateways.', tech_stack:['Flutter','REST API'] },
];

const SEED_TESTIMONIALS = [
  { message: "Nanday's mastery of Flutter is evident. He delivered a complex fintech app in half the time we expected.", client_name: "Rahul Mehta", client_role: "Product Head, Finly" },
  { message: "The animations are buttery smooth. He truly understands the 'UX' in mobile development.", client_name: "Sarah Drasner", client_role: "Startup Founder" },
  { message: "Reliable, communicative, and technically brilliant. Nanday is our go-to for all things mobile.", client_name: "Kevin Grant", client_role: "CTO, Modus" }
];

// ── Fetch live data, fall back to seed ──────────────────────────────────────
async function getProjects() {
  try {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/projects?select=title,short_description,tech_stack,live_url,github_url&order=featured.desc,created_at.desc',
      { headers:{ apikey:SUPABASE_ANON, Authorization:'Bearer ' + SUPABASE_ANON } }
    );
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    return (Array.isArray(d) && d.length) ? d : SEED;
  } catch(e) {
    console.warn('Live fetch failed, using seed fallback.');
    return SEED;
  }
}

// ── Build clean uniform card (matching reference) ────────────────────────────
function buildCard(project) {
  const title = project.title || 'Untitled';
  const desc  = project.short_description || 'A cross-platform mobile application.';
  const tags  = (project.tech_stack || []).slice(0, 4);
  const href  = project.live_url || project.github_url || '#';
  const target = href !== '#' ? 'target="_blank" rel="noopener"' : '';

  const pills = tags.map(t => '<span class="tech-pill-clean">' + t + '</span>').join('');
  
  // Clean SVG Icon Placeholder (can be dynamic if needed)
  const iconSvg = `<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`;

  return `
    <a href="${href}" ${target} class="bento-card p-8 flex flex-col h-full group" style="text-decoration:none;">
       <div class="flex items-center gap-4 mb-6">
           <div class="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
               ${iconSvg}
           </div>
           <h3 class="text-xl font-bold font-outfit text-white tracking-wide">${title}</h3>
       </div>
       <p class="text-[0.95rem] leading-relaxed mb-8 flex-grow" style="color:var(--muted)">${desc}</p>
       <div class="flex flex-wrap gap-2">
           ${pills}
       </div>
    </a>
  `;
}

// ── Fetch live testimonials, fall back to seed ─────────────────────────────
async function getTestimonials() {
  try {
    const r = await fetch(
      SUPABASE_URL + '/rest/v1/testimonials?select=message,client_name,client_role,client_image&order=created_at.desc',
      { headers:{ apikey:SUPABASE_ANON, Authorization:'Bearer ' + SUPABASE_ANON } }
    );
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const d = await r.json();
    return (Array.isArray(d) && d.length) ? d : SEED_TESTIMONIALS;
  } catch(e) {
    console.warn('Live fetch for testimonials failed, using seed fallback.');
    return SEED_TESTIMONIALS;
  }
}

function buildTestimonialCard(t, index) {
  const borderClass = index === 0 ? 'border-t-2 border-t-blue-500/20' : '';
  const avatar = t.client_image ? `<img src="${t.client_image}" alt="${t.client_name}" class="w-12 h-12 rounded-full object-cover">` : `<div class="w-12 h-12 rounded-full bg-zinc-800"></div>`;
  
  return `
    <div class="bento-card p-10 ${borderClass} !rounded-3xl">
        <p class="text-lg leading-relaxed text-slate-200">"${t.message}"</p>
        <div class="mt-10 flex items-center gap-4">
            ${avatar}
            <div>
                <p class="font-bold">${t.client_name}</p>
                <p class="text-xs" style="color:var(--muted)">${t.client_role || ''}</p>
            </div>
        </div>
    </div>
  `;
}

// ── Render grid ──────────────────────────────────────────────────────────────
async function render() {
  const grid = document.getElementById('projects-grid');
  const projects = await getProjects();
  let html = '';
  
  for (const p of projects) {
     html += buildCard(p);
  }
  
  grid.innerHTML = html;

  const tGrid = document.getElementById('testimonials-grid');
  if (tGrid) {
    const testimonials = await getTestimonials();
    let tHtml = '';
    testimonials.forEach((t, i) => {
      tHtml += buildTestimonialCard(t, i);
    });
    tGrid.innerHTML = tHtml;
  }

  // Re-bind cursor hover to new elements
  grid.querySelectorAll('.bento-card').forEach(el => {
    el.addEventListener('mouseenter', typeof cursorEnter !== 'undefined' ? cursorEnter : () => {});
    el.addEventListener('mouseleave', typeof cursorLeave !== 'undefined' ? cursorLeave : () => {});
  });
  
  if (tGrid) {
    tGrid.querySelectorAll('.bento-card').forEach(el => {
      el.addEventListener('mouseenter', typeof cursorEnter !== 'undefined' ? cursorEnter : () => {});
      el.addEventListener('mouseleave', typeof cursorLeave !== 'undefined' ? cursorLeave : () => {});
    });
  }
}

render();
