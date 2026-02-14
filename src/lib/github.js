// Basic GitHub API wrapper
export async function fetchGitHubProfile(username) {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) {
        throw new Error('User not found');
    }
    const user = await response.json();

    // Fetch repos for languages
    const reposRes = await fetch(user.repos_url);
    const repos = await reposRes.json();

    // Extract languages and topics
    const languages = new Set();
    const topics = new Set();

    repos.forEach(repo => {
        if (repo.language) languages.add(repo.language);
        repo.topics?.forEach(t => topics.add(t));
    });

    return {
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        languages: Array.from(languages),
        topics: Array.from(topics)
    };
}
