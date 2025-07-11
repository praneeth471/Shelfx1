import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginBuyer from '../components/LoginBuyer';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock useNavigate
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock global fetch
global.fetch = jest.fn();

describe('LoginBuyer Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockedUsedNavigate.mockClear();
  });

  test('renders login form inputs', () => {
    render(<LoginBuyer onToggle={() => {}} />, { wrapper: MemoryRouter });

    expect(screen.getByLabelText(/Your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument(); // Updated query
  });

  test('shows error for invalid email format', () => {
    render(<LoginBuyer onToggle={() => {}} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'invalidemail', name: 'email' },
    });

    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  test('navigates on successful login', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<LoginBuyer onToggle={() => {}} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'test@example.com', name: 'email' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'Test@123', name: 'password' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/BookGrid');
    });
  });

  test('shows alert on failed login', async () => {
    window.alert = jest.fn();
    fetch.mockResolvedValueOnce({ ok: false });

    render(<LoginBuyer onToggle={() => {}} />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByLabelText(/Your email/i), {
      target: { value: 'test@example.com', name: 'email' },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpass', name: 'password' },
    });

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Invalid email or password');
    });
  });
});
