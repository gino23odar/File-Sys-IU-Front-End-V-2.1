import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Axios from 'axios';
import { DataGrid } from '@mui/x-data-grid'; // Mock DataGrid
import { useChatContext } from 'stream-chat-react'; // MockuseChatContext
import RegisterTable from './RegisterTable';

// Mock useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
}));

// Mock Axios functions
jest.mock('axios');

// Mock DataGrid
jest.mock('@mui/x-data-grid', () => ({
  DataGrid: jest.fn(() => null),
}));

// Mock anmeldungenList
const mockAnmeldungenListData = [
  {
    id: 1,
    Student: 'Mock Student 1',
    Fach: 'Fach 1',
    Datum: '2023-07-20',
    DateiName: 'Test Datei 1',
    Seite: 5,
    Beschreibung: 'Test Beschreibung 1',
    Status: 'NEU',
  },
  {
    id: 2,
    Student: 'Mock Student 2',
    Fach: 'Fach 2',
    Datum: '2023-07-21',
    DateiName: 'Test Datei 2',
    Seite: 10,
    Beschreibung: 'Test Beschreibung 2',
    Status: 'NEU',
  },
];

describe('RegisterTable component', () => {
  beforeEach(() => {
    // Reset mock implementations and mock hook data before each test
    useChatContext.mockReturnValue({
      client: { userID: '40a45ef8f30fc503feb5fd1b2ef620e6' },
    });

    // Mock Axios get
    Axios.get.mockResolvedValue({ data: mockAnmeldungenListData });
  });

  test('renders RegisterTable correctly with data', async () => {
    const { findByText } = render(<RegisterTable />);

    // DataGrid rendered
    await findByText('Mock Student 1');
    await findByText('Mock Student 2');
    expect(DataGrid).toHaveBeenCalledTimes(1);
  });

  test('displays "Anmeldungen" and "Ablehnen" buttons for admin', async () => {
    // Mock adminList
    const adminList = [
      '40a45ef8f30fc503feb5fd1b2ef620e6',
      '2f12af19cd8f1275c98f2b7acf6f2a41',
    ];

    // Render as admin
    useChatContext.mockReturnValue({
      client: { userID: '40a45ef8f30fc503feb5fd1b2ef620e6' },
    });
    const { findByText } = render(<RegisterTable />);
    const anmeldungenText = await findByText('Anmeldungen');
    const ablehnenButton = await findByText('Ablehnen');
    expect(anmeldungenText).toBeInTheDocument();
    expect(ablehnenButton).toBeInTheDocument();

    // Render as non-admin
    useChatContext.mockReturnValue({
      client: { userID: 'mockUserID' },
    });
    const { queryByText } = render(<RegisterTable />);
    const anmeldungenTextAdmin = queryByText('Anmeldungen');
    const ablehnenButtonAdmin = queryByText('Ablehnen');
    expect(anmeldungenTextAdmin).not.toBeInTheDocument();
    expect(ablehnenButtonAdmin).not.toBeInTheDocument();
  });

  test('selects rows and displays selected rows and statuses', async () => {
    // Mock DataGrid
    const mockDataGrid = {
      onSelectionModelChange: jest.fn(),
    };
    DataGrid.mockImplementation(({ onSelectionModelChange }) => {
      mockDataGrid.onSelectionModelChange = onSelectionModelChange;
      return null;
    });

    // Render component
    const { findByText, getByRole } = render(<RegisterTable />);
    await findByText('Mock Student 1');
    const checkBox = getByRole('checkbox', { name: 'Select Row 1' });

    fireEvent.click(checkBox);

    // Expect onRowsSelectionHandler to have triggered once
    expect(mockDataGrid.onSelectionModelChange).toHaveBeenCalledTimes(1);

    const selectedRows = [1];
    const selectedRowStat = ['NEU'];
    expect(console.log).toHaveBeenCalledWith(`this is : ${selectedRows}`);
    expect(console.log).toHaveBeenCalledWith(`this statuses : ${selectedRowStat}`);
    expect(console.log).toHaveBeenCalledWith('40a45ef8f30fc503feb5fd1b2ef620e6');
  });

  test('deletes registrations and shows success message', async () => {
    // Mock Axios delete
    Axios.delete.mockResolvedValue({ data: 'success message' });

    // Render selected rows
    useChatContext.mockReturnValue({
      client: { userID: '40a45ef8f30fc503feb5fd1b2ef620e6' },
    });
    const { findByText, getByText } = render(<RegisterTable />);
    await findByText('Mock Student 1');
    fireEvent.click(getByText('Ablehnen'));

    await waitFor(() => {
      expect(Axios.delete).toHaveBeenCalledWith(
        'https://file-iu-sys.herokuapp.com/api/delete/1'
      );
    });

    const successMessage = await findByText('Zeilen mit ID: 1 entfernt');
    expect(successMessage).toBeInTheDocument();
  });
});
