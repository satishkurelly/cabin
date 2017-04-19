import { CabinPage } from './app.po';

describe('cabin App', function() {
  let page: CabinPage;

  beforeEach(() => {
    page = new CabinPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
