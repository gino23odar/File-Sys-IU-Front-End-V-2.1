import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Axios from 'axios';
import { useChatContext } from 'stream-chat-react'; // Mock useChatContext
import RegisterForm from './RegisterForm';

// Mock useChatContext hook
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
}));

jest.mock('axios');

// Mock cookies for the student name
jest.mock('universal-cookie', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    get: jest.fn(() => 'Mock Student'),
  })),
}));

// Mock teamChannel
const mockTeamChannelData = [
  { data: { id: 'Fach 1' } },
  { data: { id: 'Fach 2' } },
  { data: { id: 'Fach 3' } },
];

describe('RegisterForm component', () => {
  beforeEach(() => {
    // Reset mock implementations and mock hook data before each test
    useChatContext.mockReturnValue({
      client: { userID: 'mockUserID' },
    });

    // Mock Axios post
    Axios.post.mockResolvedValue({ data: 'success message' });
  });

  test('renders RegisterForm correctly', () => {
    const { getByLabelText, getByText } = render(<RegisterForm />);
    expect(getByLabelText('Fach')).toBeInTheDocument();
    expect(getByLabelText('Datei Name')).toBeInTheDocument();
    expect(getByLabelText('Seite')).toBeInTheDocument();
    expect(getByLabelText('Beschreibung')).toBeInTheDocument();
    expect(getByText('Deine Name: Mock Student')).toBeInTheDocument();
    expect(getByText('Fach wählen')).toBeInTheDocument();
    expect(getByText('Einreichen')).toBeInTheDocument();
  });

  test('submits the registration form and shows success message', async () => {
    const { getByLabelText, getByText, findByText } = render(<RegisterForm />);
    fireEvent.change(getByLabelText('ISEF01'), { target: { value: 'Fach 1' } });
    fireEvent.change(getByLabelText('Datei Name'), { target: { value: 'Test Datei' } });
    fireEvent.change(getByLabelText('Seite'), { target: { value: '5' } });
    fireEvent.change(getByLabelText('Beschreibung'), { target: { value: 'Test Beschreibung' } });
    fireEvent.click(getByText('Einreichen'));

    // Expect Axios.post to have been called with the correct data
    await waitFor(() => {
      expect(Axios.post).toHaveBeenCalledWith('https://file-iu-sys.herokuapp.com/api/insert', {
        Student: 'Mock Student',
        Fach: 'Fach 1',
        DateiName: 'Test Datei',
        Seite: '5',
        Beschreibung: 'Test Beschreibung',
      });
    });

    // succsess message should be displayed
    const successMessage = await findByText('register made, please check in the list');
    expect(successMessage).toBeInTheDocument();
  });

  test('toggles setIsRegis when "Anmeldungen" button is clicked', () => {
    const setIsRegisMock = jest.fn();
    const { getByText } = render(<RegisterForm setIsRegis={setIsRegisMock} />);
    fireEvent.click(getByText('Anmeldungen'));
    expect(setIsRegisMock).toHaveBeenCalledTimes(1);
  });

  test('toggles setIsVis when "Liste" button is clicked', () => {
    const setIsVisMock = jest.fn();
    const { getByText } = render(<RegisterForm setIsVis={setIsVisMock} />);
    fireEvent.click(getByText('Liste'));
    expect(setIsVisMock).toHaveBeenCalledTimes(1);
  });

  test('displays the list of available Fach options', async () => {
    Axios.post.mockResolvedValueOnce({ data: mockTeamChannelData }); // Mock the teamChannel data response

    const { findByText, queryByText } = render(<RegisterForm />);
    const fachSelect = await findByText('Fach wählen');
    expect(fachSelect).toBeInTheDocument();

    // Click on the Fach select
    act(() => {
      fireEvent.click(fachSelect);
    });

    await waitFor(() => {
      //ISEF01 is the only Fach every user has
      expect(queryByText('Fach 1')).toBeInTheDocument();
      expect(queryByText('Fach 2')).toBeInTheDocument();
      expect(queryByText('Fach 2')).toBeInTheDocument();
    });
  });
});
