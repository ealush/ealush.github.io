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
      }
    }
  }
}
`;

const fetchRepos = async () => {
  try {
    const res = await authQuery(repoQuery);
    return res?.user?.repositories?.nodes ?? null;
  } catch {
    return null;
  }
};

const parseRepo = (repo) => {
  const { url, name, updatedAt, stars } = repo;

  return {
    url,
    name,
    updatedAt: new Date(updatedAt).getTime(),
    stars: stars.totalCount,
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
    }));

  data.sections.unshift({
    title: "Code",
    items: repositories,
  });

  const out = template(data);

  fs.writeFileSync("./index.html", out, "utf8");
};

prepareTemplate();
