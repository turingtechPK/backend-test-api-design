const GithubData = require('../src/Models/githubModel').default;
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const githubService = require('../src/Services/githubService').default;
jest.mock('../src/Models/githubModel');

const mockAxios = new MockAdapter(axios);

describe('githubService', () => {
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });

  it('should handle successful API response and save data to MongoDB', async () => {
    // Mock GitHub API response
    const mockResponse = [
      {
        login: 'gaearon',
        id: 810438,
        node_id: 'MDQ6VXNlcjgxMDQzOA==',
        avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/gaearon',
        html_url: 'https://github.com/gaearon',
        followers_url: 'https://api.github.com/users/gaearon/followers',
        following_url:
          'https://api.github.com/users/gaearon/following{/other_user}',
        gists_url: 'https://api.github.com/users/gaearon/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/gaearon/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/gaearon/subscriptions',
        organizations_url: 'https://api.github.com/users/gaearon/orgs',
        repos_url: 'https://api.github.com/users/gaearon/repos',
        events_url: 'https://api.github.com/users/gaearon/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/gaearon/received_events',
        type: 'User',
        site_admin: false,
        contributions: 1667,
      },
      {
        login: 'acdlite',
        id: 3624098,
        node_id: 'MDQ6VXNlcjM2MjQwOTg=',
        avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/acdlite',
        html_url: 'https://github.com/acdlite',
        followers_url: 'https://api.github.com/users/acdlite/followers',
        following_url:
          'https://api.github.com/users/acdlite/following{/other_user}',
        gists_url: 'https://api.github.com/users/acdlite/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/acdlite/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/acdlite/subscriptions',
        organizations_url: 'https://api.github.com/users/acdlite/orgs',
        repos_url: 'https://api.github.com/users/acdlite/repos',
        events_url: 'https://api.github.com/users/acdlite/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/acdlite/received_events',
        type: 'User',
        site_admin: false,
        contributions: 1342,
      },
    ];

    // Mock axios.get method
    mockAxios
      .onGet('https://api.github.com/repos/org/repo/contributors')
      .reply(200, mockResponse);

    // Creating an instance of GithubData
    const mockInstance = new GithubData();

    // Mocking the instance method 'save'
    const mockMongoSave = jest.spyOn(mockInstance, 'save');
    mockMongoSave.mockResolvedValue(); // You might need to adjust this based on your MongoDB save method

    GithubData.find.mockResolvedValue([]);

    // Calling the function with sample parameters
    const result = await githubService.computeNewContributors(
      'org',
      'repo',
      '2022',
      '01'
    );

    // Checking if MongoDB save method was called
    expect(result).toEqual(mockResponse);
    expect(mockMongoSave).toHaveBeenCalledTimes(1);
  });

  it('should handle GitHub API error and log it', async () => {
    // Mock GitHub API response with a 404 Not Found status
    mockAxios
      .onGet('https://api.github.com/repos/org/repo/contributors')
      .reply(404);

    // Using Spy on console.error to check if the error is logged
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Calling the function with sample parameters
    const result = await githubService.computeNewContributors(
      'org',
      'repo',
      '2022',
      '01'
    );

    // Asserting that the function returns an empty array
    expect(result).toEqual([]);

    // Asserting that console.error was called with the expected error message
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'GitHub repository not found: org/repo'
    );

    // Restoring the original console.error implementation
    consoleErrorSpy.mockRestore();
  });
});
