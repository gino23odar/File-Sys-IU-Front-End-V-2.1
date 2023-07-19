import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import { mount } from 'enzyme';
import Auth from './Auth';

// Mocking axios.post
jest.mock('axios');

describe('Auth component unit tests', () => {
  test('renders without error', () => {
    const {getByTestId} = render(<Auth />);
    
    const authComponent = getByTestId('auth-component');
    expect(authComponent).toBeInTheDocument();
  });

  test('handles form submission correctly', async () => {
    const mockToken = 'mockToken';
    const mockUserId = 'mockUserId';
    const mockHashedPassword = 'mockHashedPassword';
    const mockFullName = 'mockFullName';

    axios.post.mockResolvedValueOnce({
      data: {
        token: mockToken,
        userId: mockUserId,
        hashedPassword: mockHashedPassword,
        fullName: mockFullName,
      },
    });

    render(<Auth />);

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Dorian J.' } });
    fireEvent.change(screen.getByLabelText(/Benutzername/i), { target: { value: 'johnydorian' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'j.dorian@iubh-fernstudium.de' } });
    fireEvent.change(screen.getByLabelText(/Kenntwort/i), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Kennwort bestätigen/i), { target: { value: 'password' } });

    // Submit Form
    fireEvent.click(screen.getByRole('button', { name: /Anmelden/i }));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Perform assertions to check if the form submission logic is correct
    expect(axios.post).toHaveBeenCalledWith('https://file-iu-sys.herokuapp.com/auth/signup', {
      username: 'johnydorian',
      password: 'password',
      fullName: 'Dorian J.',
      phoneNr: 'j.dorian@iubh-fernstudium.de',
      avatarURL: '',
    });
    expect(screen.getByText(/Benutzername nicht gefunden./i)).toBeInTheDocument();
  });

  // Add more test cases to cover different scenarios and edge cases of the component
});

describe('Auth component functional tests', () => {
  describe('Auth component', () => {
    let wrapper;
  
    beforeEach(() => {
      wrapper = mount(<Auth />);
    });
  
    afterEach(() => {
      wrapper.unmount();
    });

    test('should display error messages for incorrect form submission', async () => {
      axios.post.mockRejectedValueOnce({ response: { status: 400 } });
  
      //incorrect user
      wrapper.find('input[name="username"]').simulate('change', { target: { name: 'username', value: 'johndoeriamus' } });
      wrapper.find('input[name="password"]').simulate('change', { target: { name: 'password', value: 'secretWrongPassword' } });
  
      // Submit Form
      wrapper.find('form').simulate('submit');

      await new Promise(setImmediate);
      wrapper.update();

      expect(axios.post).toHaveBeenCalledWith('https://file-iu-sys.herokuapp.com/auth/login', {
        username: 'johndoe',
        password: 'password',
        fullName: '',
        phoneNr: '',
        avatarURL: '',
      });
      expect(wrapper.text()).toContain('Benutzername nicht gefunden.');
    });
  
    test('should toggle between sign-up and sign-in forms', () => {
      // Click on the "Log In" link
      wrapper.find('span').simulate('click');
      expect(wrapper.text()).toContain('Einloggen');
  
      // Click on the "Anmelden" link
      wrapper.find('span').simulate('click');
      expect(wrapper.text()).toContain('Anmelden');
    });

  });
});