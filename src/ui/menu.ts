export const menuTemplate = `
<div class="panel" id="menuPanel">
  <h2>Neon Rush</h2>
  <p>Arcade futurista leve: drift + nitro + 3 voltas.</p>
  <div class="row"><label>Mode</label><select id="modeSel"><option value="quick">Quick Race</option><option value="timeAttack">Time Attack</option></select></div>
  <div class="row"><label>Track</label><select id="trackSel"><option value="track_01">Neon Loop</option></select></div>
  <div class="row"><label>Sensibilidade</label><input id="sensSel" type="range" min="0.5" max="1.5" step="0.1" value="1"/></div>
  <div class="row"><label>Assistência direção</label><input id="assistSel" type="checkbox" checked /></div>
  <div class="row"><label>Layout touch</label><select id="touchSel"><option value="A">Layout A</option><option value="B">Layout B</option></select></div>
  <div class="row"><label>Áudio</label><input id="muteSel" type="checkbox" /></div>
  <div class="row"><label>Volume</label><input id="volumeSel" type="range" min="0" max="1" step="0.05" value="0.55"/></div>
  <button id="startBtn">Start Race</button>
</div>`;
