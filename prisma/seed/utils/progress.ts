export class ProgressStepper {
  private total: number;
  private readonly every: number;
  private readonly onStep: (step: number) => void;

  constructor(every: number, onStep: (step: number) => void) {
    this.total = 0;
    this.every = every;
    this.onStep = onStep;
  }

  increment(value = 1) {
    if (value === 0) {
      return;
    } else if (value === 1) {
      if (++this.total % this.every === 0) {
        this.onStep(this.total);
      }
      return;
    }

    const lastStep = Math.floor(this.total / this.every);
    this.total += value;
    const newStep = Math.floor(this.total / this.every);
    if (lastStep != newStep) {
      this.onStep(this.total);
    }
  }
}
