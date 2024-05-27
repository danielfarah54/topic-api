/* eslint-disable no-console */
export class SeedLog {
  initial(message: string): void {
    console.log();
    console.log(message);
  }

  partial(message: string): void {
    console.log(`    ${message}`);
  }

  done(message?: string): void {
    if (message) {
      console.log(`    Done! ${message}`);
    } else {
      console.log('    Done!');
    }
  }
}
