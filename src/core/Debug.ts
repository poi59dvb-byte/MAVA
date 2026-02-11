export class Debug {
  enabled = false;
  el: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div');
    this.el.className = 'debug hidden';
    parent.appendChild(this.el);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'F3') {
        this.enabled = !this.enabled;
        this.el.classList.toggle('hidden', !this.enabled);
      }
    });
  }

  draw(lines: string[]): void {
    if (!this.enabled) return;
    this.el.innerHTML = lines.join('<br>');
  }
}
