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
    </section>
    <section class="links">
      ${data.sections
        .map(
          (section) => `<div>
            <h2>${section.title}</h2>
            <ul>
            ${section.items
              .map((item) =>
                item.url
                  ? `<li>
                  <a href="${
                    item.url
                  }" target="_blank" rel="noopener noreferrer">${
                      item.title
                    }</a> ${item.extra ? `<small>${item.extra}</small>` : ""}
              </li>`
                  : `<li><span class="no-link">${item.title}</span> ${
                      item.extra ? `<small>${item.extra}</small>` : ""
                    }</li>`
              )
              .join("")}</ul></div>`
        )
        .join("")}</section>
  </div>
</body>

</html>
`;
};
