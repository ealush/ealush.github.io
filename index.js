const $repos = document.getElementById('repos');
const $main = document.getElementById('main');

const convert = (oldMin, oldMax, newMin, newMax, oldValue) => (
    (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
);

vent(window).on('scroll', (e) => {
    const mainHeight = $main.clientHeight;
    const posY = convert(0, mainHeight, 0, 100, window.scrollY);
    $main.style.backgroundPositionY = `${posY}%`;
});

vent('h2').on('click', ({ target }) => {
    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
});

const addRepos = (repositories) => {
    const html = [...repositories]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .reduce((markup, repo) => repo.fork ? markup : markup + `
            <li>
                <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}${repo.stargazers_count ? `(🌟 ${repo.stargazers_count})` : ''}</a>
            </li>
        `, '');

    $repos.innerHTML = html;
};


Promise.all([
    fetch('https://api.github.com/repos/fiverr/passable').then(res => res.json()),
    fetch('https://api.github.com/users/ealush/repos').then(res => res.json()),
]).then((res) => {
    addRepos([res[0], ...res[1]])
});
