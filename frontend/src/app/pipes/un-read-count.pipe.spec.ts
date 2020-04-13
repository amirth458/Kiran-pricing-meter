import { UnReadCountPipe } from './un-read-count.pipe';

describe('UnReadCountPipe', () => {
  it('create an instance', () => {
    const pipe = new UnReadCountPipe();
    expect(pipe).toBeTruthy();
  });
});
