export const hudTemplate = `
<div class="hud" id="hud">
  <div class="row"><span id="mode"></span><span id="lap"></span><span id="time"></span><button id="restartBtn">Restart</button></div>
  <div class="row"><span id="speed"></span><span id="drift"></span><span id="best"></span></div>
  <div class="row">
    <div style="flex:1"><small>Nitro</small><div class="bar"><div id="nitroBar"></div></div></div>
    <div style="flex:1"><small>Drift</small><div class="bar"><div id="driftBar"></div></div></div>
  </div>
</div>`;
