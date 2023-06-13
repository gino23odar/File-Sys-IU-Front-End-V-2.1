import React from 'react';
import { Avatar } from 'stream-chat-react';

/**
 * This component renders the search result for the dropdown menu.
 */
const SResult = ({ channel, setChannel, queryId, type, toggleDropdownVisibility  }) => {
  /**
   * This function sets a channel and toggles the visibility of a dropdown menu.
   */
  const handleClick = () => {
    setChannel(channel);
    if (toggleDropdownVisibility ) {
      toggleDropdownVisibility ((prevState) => !prevState);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={channel.id === queryId ? 'channel-search-resultCont-focused' : 'channel-search-resultCont'}
    >
      {type === 'channel' ? (
        <>
          <div className="result-sign">O</div>
          <p className="channel-search-result-text">{channel.data.name}</p>
        </>
      ) : (
        <div className="channel-search-result-user">
          <Avatar image={channel.image || undefined} name={channel.name} size={20} />
          <p className="channel-search-result-text">{channel.name}</p>
        </div>
      )}
    </div>
  );
};
const ResultsDropdown = ({ teamChannels, directChannels, setChannel, queryId, loading, toggleDropdownVisibility  }) => {
  return (
    <div className='channel-search-results'>
      <p className='channel-search-resultsHeader'>Channels</p>
      {loading && !teamChannels.length && (
        <p className='channel-search-resultsHeader'>
          <i>Channel ladet noch...</i>
        </p>
      )}
      {!loading && !teamChannels.length ? (
        <p className='channel-search-resultsHeader'>
          <i>Keine Channels gefunden</i>
        </p>
      ) : (
        teamChannels?.map((channel, i) => (
          <SResult
            channel={channel}
            queryId={queryId}
            key={i}
            setChannel={setChannel}
            type='channel'
            toggleDropdownVisibility ={toggleDropdownVisibility }
          />
        ))
      )}
      <p className='channel-search-resultsHeader'>Benutzer</p>
      {loading && !directChannels.length && (
        <p className='channel-search-resultsHeader'>
          <i>Channel ladet noch...</i>
        </p>
      )}
      {!loading && !directChannels.length ? (
        <p className='channel-search-resultsHeader'>
          <i>Keine private Nachrichten gefunden...</i>
        </p>
      ) : (
        directChannels?.map((channel, i) => (
          <SResult
            channel={channel}
            queryId={queryId}
            key={i}
            setChannel={setChannel}
            type='user'
            toggleDropdownVisibility ={toggleDropdownVisibility }
          />
        ))
      )}
    </div>
  );
};
export default ResultsDropdown;
