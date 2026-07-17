import { resourcesApp } from './resources/app';

describe('resourcesApp', () => {
  it('should work', () => {
    expect(resourcesApp()).toEqual('resources/app');
  });
});
