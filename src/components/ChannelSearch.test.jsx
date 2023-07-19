import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useChatContext } from 'stream-chat-react'; // Mock import
import ChannelSearch from './ChannelSearch';

// Mock Components ./
jest.mock('./ResultsDropdown', () => () => <div data-testid="results-dropdown">ResultsDropdown Mock</div>);

// Mock useChatContext 
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
}));

describe('ChannelSearch component', () => {
  const setActiveChannelMock = jest.fn();
  const queryChannelsMock = jest.fn(() => []);
  const queryUsersMock = jest.fn(() => ({ users: [] }));

  beforeEach(() => {
    // reset the mocks before each test
    useChatContext.mockReturnValue({
      client: {
        userID: 'mockUserID',
        queryChannels: queryChannelsMock,
        queryUsers: queryUsersMock,
      },
      setActiveChannel: setActiveChannelMock,
    });
  });

  test('renders input field correctly', () => {
    const { getByPlaceholderText } = render(<ChannelSearch />);
    const inputElement = getByPlaceholderText('Look Up teams or users');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
  });

  test('updates query and fetches channels on input change', () => {
    const { getByPlaceholderText } = render(<ChannelSearch />);
    const inputElement = getByPlaceholderText('Look Up teams or users');

    fireEvent.change(inputElement, { target: { value: 'search text' } });
    expect(inputElement).toHaveValue('search text');
    expect(queryChannelsMock).toHaveBeenCalledWith({
      name: { $autocomplete: 'search text' },
      members: { $in: ['mockUserID'] },
      type: 'team',
    });
    expect(queryUsersMock).toHaveBeenCalledWith({
      id: { $ne: 'mockUserID' },
      name: { $autocomplete: 'search text' },
    });
  });

  test('displays ResultsDropdown when query is not empty', () => {
    const { getByPlaceholderText, getByTestId } = render(<ChannelSearch />);
    const inputElement = getByPlaceholderText('Look Up teams or users');

    fireEvent.change(inputElement, { target: { value: 'search text' } });

    const resultsDropdown = getByTestId('results-dropdown');
    expect(resultsDropdown).toBeInTheDocument();
  });

  test('clears query and channels when input is cleared', () => {
    const { getByPlaceholderText, queryByTestId } = render(<ChannelSearch />);
    const inputElement = getByPlaceholderText('Look Up teams or users');

    fireEvent.change(inputElement, { target: { value: 'search text' } });

    fireEvent.change(inputElement, { target: { value: '' } });

    const resultsDropdown = queryByTestId('results-dropdown');
    expect(inputElement).toHaveValue('');
    expect(resultsDropdown).not.toBeInTheDocument();
  });

  test('sets active channel when a channel is clicked', () => {
    const { getByPlaceholderText, getByTestId } = render(<ChannelSearch />);
    const inputElement = getByPlaceholderText('Look Up teams or users');

    fireEvent.change(inputElement, { target: { value: 'search text' } });

    const resultsDropdown = getByTestId('results-dropdown');
    fireEvent.click(resultsDropdown); // mock click on the results dropdown

    expect(setActiveChannelMock).toHaveBeenCalledTimes(1);
  });

});
