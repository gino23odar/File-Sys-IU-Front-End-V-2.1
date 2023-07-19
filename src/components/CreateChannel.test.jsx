import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useChatContext } from 'stream-chat-react'; // Mock import
import CreateChannel from './CreateChannel';

// Mock Comps ./
jest.mock('./UserList', () => () => <div data-testid="user-list">UserList Mock</div>);

// Mock useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
}));

describe('CreateChannel component', () => {
  const setActiveChannelMock = jest.fn();
  const channelMock = { watch: jest.fn() };
  const clientMock = { userID: 'mockUserID', channel: jest.fn(() => channelMock) };

  beforeEach(() => {
    // Reset mock implementation before each test
    setActiveChannelMock.mockReset();
    channelMock.watch.mockReset();
    useChatContext.mockReturnValue({
      client: clientMock,
      setActiveChannel: setActiveChannelMock,
    });
  });

  test('renders UserList and "Nachrichtengruppe erstellen" button correctly', () => {
    const { getByTestId, getByText } = render(<CreateChannel createTp="messaging" setIsCrt={jest.fn()} />);
    const userList = getByTestId('user-list');
    const createButton = getByText('Nachrichtengruppe erstellen');

    expect(userList).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  test('creates a new chat channel on button click', () => {
    const setIsCrtMock = jest.fn();
    const { getByText } = render(<CreateChannel createTp="messaging" setIsCrt={setIsCrtMock} />);
    const createButton = getByText('Nachrichtengruppe erstellen');

    fireEvent.click(createButton);

    expect(clientMock.channel).toHaveBeenCalledTimes(1);
    expect(clientMock.channel).toHaveBeenCalledWith('messaging', '', { name: '', members: [clientMock.userID] });
    expect(channelMock.watch).toHaveBeenCalledTimes(1);
    expect(setIsCrtMock).toHaveBeenCalledTimes(1);
    expect(setActiveChannelMock).toHaveBeenCalledTimes(1);
    expect(setActiveChannelMock).toHaveBeenCalledWith(channelMock);
  });
});
