import type { ColorTheme } from './types/ColorTheme';
import { Particle } from './particle';

export class ParticleManager {
  private _particles: Particle[] = [];

  update(deltaTime: number) {
    this._particles.forEach((particle) => {
      particle.update(deltaTime);
    });
    this._particles = this._particles.filter((particle) => !particle.isDestroy);
  }

  render(ctx: CanvasRenderingContext2D) {
    this._particles.forEach((particle) => particle.render(ctx));
  }

  /** (x, y) = 화면 오른쪽 아래 구석. 양쪽 아래 구석에서 60개씩 쏜다 */
  shot(x: number, y: number, theme: ColorTheme) {
    const scale = y / 450;
    for (let i = 0; i < 60; i++) {
      this._particles.push(new Particle(0, y, 1, scale, theme));
      this._particles.push(new Particle(x, y, -1, scale, theme));
    }
  }
}
