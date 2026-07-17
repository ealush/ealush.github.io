const fs = require("fs");
const { graphql } = require("@octokit/graphql");

const template = require("./template");
const data = require("../../data.json");

const token = process.env.GIT_TOKEN || process.env.GITHUB_TOKEN;

const authQuery = graphql.defaults({
  headers: {
    authorization: `token ${token}`,
  },
});

const repoQuery = `{
  user(login: "ealush") {
    repositories(first: 100, isFork: false, privacy: PUBLIC, affiliations: [OWNER]) {
      nodes {
        url
        name
        updatedAt
        stars: stargazers {
          totalCount
        }
        object(expression: "HEAD:package.json") {
          ... on Blob {
            text
          }
        }
      }
    }
  }
}
`;

const fetchRepos = async () => {
  console.log("Fetching repos from GitHub API...");
  if (!token) {
    console.log("Neither GIT_TOKEN nor GITHUB_TOKEN is set, bypassing live stars query.");
    return null;
  }
  try {
    const res = await authQuery(repoQuery);
    return res?.user?.repositories?.nodes ?? null;
  } catch (e) {
    console.log("Failed to fetch repos", e);
    return null;
  }
};

const parseRepo = (repo) => {
  const { url, name, updatedAt, stars, object } = repo;
  let npm, website;

  if (object && object.text) {
    try {
      const pkg = JSON.parse(object.text);
      if (pkg.name) {
        npm = `https://www.npmjs.com/package/${pkg.name}`;
      }
      if (pkg.homepage) {
        website = pkg.homepage;
      }
    } catch (e) {
      // ignore
    }
  }

  return {
    url,
    name,
    updatedAt: new Date(updatedAt).getTime(),
    stars: stars.totalCount,
    npm,
    website,
  };
};

const prepareTemplate = async () => {
  const repos = await fetchRepos();
  
  if (Array.isArray(repos)) {
    console.log(`Successfully fetched ${repos.length} repositories. Mapping stars...`);
    const parsedRepos = repos.map(parseRepo);
    
    data.resources.projects = data.resources.projects.map(project => {
      const parts = project.canonical_title.split("/");
      const repoName = parts[1] || parts[0];
      const matched = parsedRepos.find(r => r.name.toLowerCase() === repoName.toLowerCase());
      if (matched) {
        console.log(`Matched ${project.canonical_title} -> ${matched.stars} stars, updated ${matched.updatedAt}`);
        return {
          ...project,
          stars: matched.stars,
          updatedAt: matched.updatedAt
        };
      }
      return project;
    });

    // Sort projects by most recently updated first
    data.resources.projects.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } else {
    console.log("Using cached/default resource data without live stars update.");
  }

  console.log("Generating index.html...");
  const out = template(data);
  fs.writeFileSync("./index.html", out, "utf8");
  console.log("Generation complete!");
};

prepareTemplate();
