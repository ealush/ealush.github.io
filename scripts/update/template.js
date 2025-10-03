module.exports = function (data) {
  return `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>ealush</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="./favicon.ico" />
  <link rel="stylesheet" type="text/css" media="screen" href="./style.css">
  <link href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700" rel="stylesheet">
</head>

<body>
  <div class="grid">
    <section id="main" class="main">
      <div class="face"></div>
      <h1>HI<span class="paint">,</span> I AM<br>EVYATAR<span class="paint">.</span></h1>
      <p>${data.caption}.</p>
      <span>code<span class="paint">@</span>ealush.com</span>
      <div class="social-links">
        <a href="https://x.com/evyataral" target="_blank" rel="noopener noreferrer">
          <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          @evyataral
        </a> |
        <a href="https://www.linkedin.com/in/evyatar-alush-5b760866/" target="_blank" rel="noopener noreferrer">
          <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4s1.39.63 1.39 1.4v4.93h2.8zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69.75 1.69 1.69 0 0 0 0 1.88 1.68 1.68 0 0 0 1.69 1.68m-1.39 9.94v-8.37H8.27v8.37H5.49z"/></svg>
          LinkedIn
        </a>
      </div>
    </section>
    <section class="links">
      ${data.sections
        .map(
          (section) => `<div>
            <h2>${section.title}</h2>
            <ul>
            ${section.items
              .map((item) => {
                const links = [];
                if (item.website) {
                  links.push(
                    `<a href="${item.website}" target="_blank" rel="noopener noreferrer">website</a>`
                  );
                }
                if (item.npm) {
                  links.push(
                    `<a href="${item.npm}" target="_blank" rel="noopener noreferrer">npm</a>`
                  );
                }

                const linksStr =
                  links.length > 0
                    ? `<small>(${links.join(" | ")})</small>`
                    : "";

                return item.url
                  ? `<li>
                  <a href="${
                    item.url
                  }" target="_blank" rel="noopener noreferrer">${
                      item.title
                    }</a> ${linksStr} ${
                      item.extra ? `<small>${item.extra}</small>` : ""
                    }
              </li>`
                  : `<li><span class="no-link">${item.title}</span> ${
                      item.extra ? `<small>${item.extra}</small>` : ""
                    }</li>`;
              })
              .join("")}</ul></div>`
        )
        .join("")}</section>
  </div>
</body>

</html>
`;
};
