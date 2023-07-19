import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TeamChannelList from './TeamChannelList';

describe('TeamChannelList component', () => {
  test('renders loading message when loading is true', () => {
    const { getByText } = render(
      <TeamChannelList loading={true} type="team" />
    );

    expect(getByText('Channels Webanwendung wird geladen...')).toBeInTheDocument();
  });

  test('renders error message when error is true', () => {
    const { getByText } = render(
      <TeamChannelList error={true} type="team" />
    );

    expect(getByText('Verbindungsfehler')).toBeInTheDocument();
  });

  test('renders "Channels" title for type="team"', () => {
    const { getByText } = render(
      <TeamChannelList type="team" />
    );

    expect(getByText('Channels')).toBeInTheDocument();
  });

  test('renders "private Nachrichten" title for type="messaging"', () => {
    const { getByText } = render(
      <TeamChannelList type="messaging" />
    );

    expect(getByText('private Nachrichten')).toBeInTheDocument();
  });

  test('renders AddChannel component for type="messaging"', () => {
    const { getByText } = render(
      <TeamChannelList type="messaging" />
    );

    expect(getByText('Add Channel')).toBeInTheDocument();
  });

  test('does not render AddChannel component for type="team"', () => {
    const { queryByText } = render(
      <TeamChannelList type="team" />
    );

    expect(queryByText('Add Channel')).toBeNull();
  });
});
