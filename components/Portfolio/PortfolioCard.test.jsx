import { render, screen } from '@testing-library/react';
import PortfolioCard from './PortfolioCard';

test('mostra título e descrição', () => {
  render(<PortfolioCard initiative={{ title: 'Teste', description: 'Desc' }} />);
  expect(screen.getByText('Teste')).toBeInTheDocument();
  expect(screen.getByText('Desc')).toBeInTheDocument();
});