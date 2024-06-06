import React, {  useState } from 'react';
import './App.css';
import { Avatar, Button, Tab, TabNavigation, Table, TextInput } from 'evergreen-ui';

function App() {
  const [userName, setUseName] = useState('');
  const [profileData, setProfileData] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const tabs = React.useMemo(() => ['Followers', 'Repositories', 'Following'], [])
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const searchProfile = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://api.github.com/search/users?q=' + userName);
      const data = await res?.json();
      setProfileData(data?.items[0]);
      getFollowers(data?.items[0]);
      getRepo(data?.items[0]);
      getFollowing(data?.items[0]);
    } catch (e) {
      console.log(e);
    }
    finally {
      setLoading(false);
    }
  }

  const getFollowers = async (profileData) => {
    try {
      const res = await fetch(profileData?.followers_url);
      const data = await res?.json();
      setFollowers(data);
    } catch (err) {
      console.warn(err)
    }
  }
  const getRepo = async (profileData) => {
    try {
      const res = await fetch(profileData?.repos_url);
      const data = await res?.json();
      setRepo(data);
    } catch (err) {
      console.warn(err);
    }
  }
  const getFollowing = async (profileData) => {
    try {
      const curlyBrace=profileData?.following_url.indexOf('{');
      const filteredUrl = profileData?.following_url.slice(0,curlyBrace);; 
      const res = await fetch(filteredUrl);
      const data = await res?.json();
      setFollowing(data);
    } catch (err) {
      console.warn(err)
    }
  }
  return (
    <div className="App">
      <h1>Search for GitHub profile</h1>
      <TextInput onChange={e => setUseName(e.target.value)} value={userName} placeholder='Search GitHub profile...' />
      <Button marginLeft={16} appearance="primary" onClick={searchProfile} isLoading={loading} disabled={loading}>
        Search
      </Button>
      {profileData?.login && (
        <div>
          <Avatar
            src={profileData?.avatar_url}
            name={profileData?.login}
            size={120}
            marginTop={10}
          />
          <h3>{profileData?.login}</h3>
          <TabNavigation>
            {tabs.map((tab, index) => {
              const id = tab.toLowerCase().replace(' ', '-')
              const hash = `#${id}`
              return (
                <Tab
                  href={hash}
                  is="a"
                  isSelected={selectedIndex === index}
                  key={tab}
                  onSelect={() => setSelectedIndex(index)}
                >
                  {tab}
                </Tab>
              )
            })}
          </TabNavigation>

          {selectedIndex === 0 && (
            <div>
              <h2>Followers : {followers.length}</h2>
              <Table width={'80%'} style={{ margin: '0 auto' }}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>UserName</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Visit</Table.TextHeaderCell>
                </Table.Head>
                <Table.VirtualBody height={240}>
                  {followers.map((follower) => (
                    <Table.Row key={follower.login}>
                      <Table.TextCell>
                        <Avatar
                          src={follower?.avatar_url}
                          name={follower?.login}
                          size={40}
                        />
                      </Table.TextCell>
                      <Table.TextCell>{follower?.login}</Table.TextCell>
                      <Table.TextCell><a href={`https://github.com/${follower?.login}`}>Visit Profile</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.VirtualBody>
              </Table>
            </div>
          )}

          {selectedIndex === 1 && (
            <div>
              <h2>Repositories : {repo.length}</h2>
              <Table width={'80%'} style={{ margin: '0 auto' }}>
                <Table.Head>
                  <Table.TextHeaderCell>Repository</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Description</Table.TextHeaderCell>
                  <Table.TextHeaderCell>View</Table.TextHeaderCell>
                </Table.Head>
                <Table.VirtualBody height={240} >
                  {repo.map((repo) => (
                    <Table.Row key={repo?.login}>
                      <Table.TextCell>{repo?.name}</Table.TextCell>
                      <Table.TextCell>{repo?.description?.length ? repo?.description : 'N/A'}</Table.TextCell>
                      <Table.TextCell><a href={repo?.html_url}>View Repo</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.VirtualBody>
              </Table>
            </div>
          )}

          {selectedIndex === 2 && (
            <div>
              <h2>Following : {following.length}</h2>
              <Table width={'80%'} style={{ margin: '0 auto' }}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>UserName</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Visit</Table.TextHeaderCell>
                </Table.Head>
                <Table.VirtualBody height={240}>
                  {following.map((following) => (
                    <Table.Row key={following?.login}>
                      <Table.TextCell>
                        <Avatar
                          src={following?.avatar_url}
                          name={following?.login}
                          size={40}
                        />
                      </Table.TextCell>
                      <Table.TextCell>{following?.login}</Table.TextCell>
                      <Table.TextCell><a href={`https://github.com/${following?.login}`}>Visit Profile</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.VirtualBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
