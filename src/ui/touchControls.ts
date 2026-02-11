export const touchTemplate = `
<div class="touch touchA hidden" id="touchA">
  <button data-key="left">◀</button><button data-key="right">▶</button><button data-key="throttle">▲</button><button data-key="brake">▼</button><button data-key="drift">DRIFT</button><button data-key="nitro">NITRO</button>
</div>
<div class="touch touchB hidden" id="touchB">
  <div id="dragArea">Drag steer</div>
  <div style="display:grid;gap:8px"><button data-key="throttle">▲</button><button data-key="brake">▼</button></div>
  <div style="display:grid;gap:8px"><button data-key="drift">DRIFT</button><button data-key="nitro">NITRO</button></div>
</div>`;
