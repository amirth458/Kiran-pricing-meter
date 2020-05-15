import { UserAttachmentsPipe } from './user-attachments.pipe';

describe('UserAttachmentsPipe', () => {
  it('create an instance', () => {
    const pipe = new UserAttachmentsPipe();
    expect(pipe).toBeTruthy();
  });
});
