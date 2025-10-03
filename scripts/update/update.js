const fs = require("fs");
const { graphql } = require("@octokit/graphql");

const template = require("./template");
const data = require("../../data.json");

const authQuery = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GIT_TOKEN}`,
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
  console.log("Fetching repos...");
  try {
    const res = await authQuery(repoQuery);
    console.log(res);
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

  console.log(npm);

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
  if (!Array.isArray(repos)) {
    return;
  }

  const repositories = repos
    .map(parseRepo)
    .filter(({ stars }) => !!stars)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map((repo) => ({
      url: repo.url,
      title: repo.name + `(🌟 ${repo.stars})`,
      npm: repo.npm,
      website: repo.website,
    }));

  data.sections.unshift({
    title: "Code",
    items: repositories,
  });

  const out = template(data);

  fs.writeFileSync("./index.html", out, "utf8");
};

prepareTemplate();
