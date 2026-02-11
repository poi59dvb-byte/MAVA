export const touchTemplate = `
<div class="touch touchA hidden" id="touchA">
  <div class="pad-left">
    <button data-key="left">◀</button>
    <button data-key="right">▶</button>
  </div>
  <div class="pad-right">
    <button data-key="throttle">▲</button>
    <button data-key="brake">▼</button>
    <button data-key="drift">DRIFT</button>
    <button data-key="nitro">NITRO</button>
  </div>
</div>
<div class="touch touchB hidden" id="touchB">
  <div id="dragArea">Arraste para virar</div>
  <div class="touch-actions">
    <button data-key="throttle">▲</button>
    <button data-key="brake">▼</button>
    <button data-key="drift">DRIFT</button>
    <button data-key="nitro">NITRO</button>
  </div>
</div>`;
