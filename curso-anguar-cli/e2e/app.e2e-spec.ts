import { CursoAnguarCliPage } from './app.po';

describe('curso-anguar-cli App', () => {
  let page: CursoAnguarCliPage;

  beforeEach(() => {
    page = new CursoAnguarCliPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
