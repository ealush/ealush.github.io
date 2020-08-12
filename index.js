const fs = require("fs");
const phrase = require("paraphrase/double");
const { graphql } = require("@octokit/graphql");

const template = fs.readFileSync("./index.tmpl", "utf8");

const authQuery = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
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

const genMarkup = (repo) =>
  `<a href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}(🌟 ${repo.stars})</a>`;

const prepareTemplate = async () => {
  const repos = await fetchRepos();
  if (!Array.isArray(repos)) {
    return;
  }

  const REPOSITEORIES = repos
    .map(parseRepo)
    .filter(({ stars }) => !!stars)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .map(genMarkup)
    .join("");

  const out = phrase(template, { REPOSITEORIES });

  fs.writeFileSync("./ealush/index.html", out, "utf8");
};

prepareTemplate();
