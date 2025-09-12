import { render, screen } from '@testing-library/react';
import Home from './index';

describe('Home page', () => {
  it('muestra el heading Home', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Home');
  });
});
