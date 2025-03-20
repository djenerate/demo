import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders the header with correct title', () => {
    render(<App />);
    
    expect(screen.getByRole('heading', { name: /contact form app/i })).toBeInTheDocument();
  });

  test('renders the ContactForm component', () => {
    render(<App />);
    
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
  });

  test('renders the footer with current year', () => {
    render(<App />);
    
    const currentYear = new Date().getFullYear().toString();
    const footerText = screen.getByText(new RegExp(`© ${currentYear} Contact Form App`, 'i'));
    
    expect(footerText).toBeInTheDocument();
  });
});
