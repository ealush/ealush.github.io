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
    <section id="main" class="main center">
      <div class="face center"></div>
      <h1>HI<span class="paint">,</span> I AM<br>EVYATAR<span class="paint">.</span></h1>
      <p>${data.caption}.</p>
      <span>code<span class="paint">@</span>ealush.com</span>
    </section>
    <section class="grid col-12-xs col-10-md content">
      ${data.sections
        .map(
          (section) => `<div class="col-10-xs col-6-md center">
            <h2 class="center">${section.title}</h2>
            <ul class="center links">
            ${section.items
              .map(
                (item) => `<li>
                  <a href="${
                    item.url
                  }" target="_blank" rel="noopener noreferrer">${
                  item.title
                }</a> ${item.extra ? `<small>${item.extra}</small>` : ""}
              </li>`
              )
              .join("")}</ul></div>`
        )
        .join("")}</section>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/ealush/vent/lib/vent.min.es5.js"></script>
  <script src="./index.js"></script>
</body>

</html>
`;
};
