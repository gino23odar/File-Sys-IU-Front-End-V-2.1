import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Cookies from 'universal-cookie'; // Mockimport
import { ChannelList, useChatContext } from 'stream-chat-react'; // Mock import
import ChannelListContainer from './ChannelListContainer';

// Mock Components ./
jest.mock('./ChannelSearch', () => () => <div data-testid="channel-search">ChannelSearch Mock</div>);
jest.mock('./TeamChannelList', () => () => <div data-testid="team-channel-list">TeamChannelList Mock</div>);
jest.mock('./TeamChannelPreview', () => () => <div data-testid="team-channel-preview">TeamChannelPreview Mock</div>);

// Mock cookie 
jest.mock('universal-cookie', () => {
  return jest.fn(() => ({
    remove: jest.fn(),
  }));
});

// Mock useChatContext
jest.mock('stream-chat-react', () => ({
  useChatContext: jest.fn(),
  ChannelList: jest.fn(() => <div data-testid="channel-list">ChannelList Mock</div>),
}));

describe('ChannelListContainer component', () => {
  const setCreateTpMock = jest.fn();
  const setIsCrtMock = jest.fn();
  const setIsRegisMock = jest.fn();
  const setIsVisMock = jest.fn();
  const setToggleContainerMock = jest.fn();

  beforeEach(() => {
    // Reset the mock implementation before each test
    setCreateTpMock.mockReset();
    setIsCrtMock.mockReset();
    setIsRegisMock.mockReset();
    setIsVisMock.mockReset();
    setToggleContainerMock.mockReset();
    useChatContext.mockReturnValue({
      client: {
        userID: 'mockUserID',
      },
    });
  });

  test('renders ChannelListContent and SideBar correctly', () => {
    const { getByTestId } = render(
      <ChannelListContainer
        setCreateTp={setCreateTpMock}
        setIsCrt={setIsCrtMock}
        setIsRegis={setIsRegisMock}
        setIsVis={setIsVisMock}
      />
    );
    const channelListContent = getByTestId('channel-list');
    const channelSearch = getByTestId('channel-search');

    expect(channelListContent).toBeInTheDocument();
    expect(channelSearch).toBeInTheDocument();
  });

  test('calls logout when logout is clicked', () => {
    const { getByAltText } = render(
      <ChannelListContainer
        setCreateTp={setCreateTpMock}
        setIsCrt={setIsCrtMock}
        setIsRegis={setIsRegisMock}
        setIsVis={setIsVisMock}
      />
    );
    const logoutIcon = getByAltText('Settings');

    fireEvent.click(logoutIcon);
    expect(Cookies).toHaveBeenCalledTimes(1);
    expect(Cookies().remove).toHaveBeenCalledTimes(6);
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  test('renders responsive channel list on toggle click', () => {
    const { getByTestId } = render(
      <ChannelListContainer
        setCreateTp={setCreateTpMock}
        setIsCrt={setIsCrtMock}
        setIsRegis={setIsRegisMock}
        setIsVis={setIsVisMock}
      />
    );
    const toggleElement = getByTestId('channel-list-cont-toggle');

    fireEvent.click(toggleElement);

    const responsiveChannelList = getByTestId('channel-list');
    const sideBar = getByTestId('channel-list-sidebar-icon2');
    expect(responsiveChannelList).toBeInTheDocument();
    expect(sideBar).toBeInTheDocument();
  });
});
