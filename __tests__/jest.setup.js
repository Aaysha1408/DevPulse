import '@testing-library/jest-dom';
import { configure } from '@testing-library/dom';

configure({ testIdAttribute: 'data-testid' });

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

global.window = {
  localStorage: global.localStorage,
};