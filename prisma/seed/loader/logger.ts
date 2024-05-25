/* eslint-disable no-console */
export class SeedLog {
  initial(message: string) {
    console.log();
    console.log(message);
  }

  partial(message: string) {
    console.log(`    ${message}`);
  }

  done(message?: string) {
    if (message) {
      console.log(`    Done! ${message}`);
    } else {
      console.log('    Done!');
    }
  }
}
