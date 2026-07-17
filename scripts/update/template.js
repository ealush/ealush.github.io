module.exports = function (data) {
  // Helper to format dates elegantly (e.g., "2026-04-15" -> "Apr 2026")
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 1) return parts[0];
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[monthIndex];
    return monthName ? `${monthName} ${year}` : year;
  };

  // Helper to identify link type for clean labeling
  const getLinkName = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes("npmjs.com")) return "npm";
    if (lower.includes("github.com")) return "github";
    if (lower.includes("spotify.com")) return "spotify";
    if (lower.includes("podcasts.apple.com")) return "apple podcasts";
    if (lower.includes("youtube.com") || lower.includes("youtu.be")) return "youtube";
    if (lower.includes("smashingmagazine.com")) return "smashing magazine";
    if (lower.includes("dev.to")) return "dev.to";
    if (lower.includes("medium.com")) return "medium";
    return "link";
  };

  // Helper to render a mirror links block
  const renderMirrors = (primaryUrl, relatedUrls = []) => {
    const urls = [primaryUrl, ...relatedUrls].filter(Boolean);
    if (urls.length === 0) return "";
    
    // De-duplicate URLs
    const uniqueUrls = [...new Set(urls)];
    
    return `<span class="utility-links-container">
      ${uniqueUrls.map(url => {
        const name = getLinkName(url);
        return `<a href="${url}" class="utility-link font-mono" target="_blank" rel="noopener noreferrer">${name}</a>`;
      }).join(" ")}
    </span>`;
  };

  // 1. Projects (Code)
  const projectsHtml = (data.resources.projects || [])
    .map(project => {
      const parts = project.canonical_title.split("/");
      const displayName = parts[1] || parts[0];
      const starStr = project.stars ? ` (🌟 ${project.stars})` : "";
      
      return `<li class="link-item">
        <div class="link-content">
          <a href="${project.primary_url}" class="item-title" target="_blank" rel="noopener noreferrer">${displayName}${starStr}</a>
          ${renderMirrors(null, project.related_urls)}
        </div>
        <span class="item-extra font-mono">open source</span>
      </li>`;
    })
    .join("\n");

  // 2. Talks & Workshops
  const talksHtml = (data.resources.talks || [])
    .filter(t => t.verification_status === "confirmed")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(talk => {
      const dateDisplay = formatDate(talk.date);
      const flagMap = {
        "israel": "🇮🇱 ",
        "spain": "🇪🇸 ",
        "greece": "🇬🇷 ",
        "belgium": "🇧🇪 ",
        "uk": "🇬🇧 ",
        "germany": "🇩🇪 ",
        "singapore": "🇸🇬 ",
        "india": "🇮🇱 " // CityJS New Delhi has israel in data? Or let's check flag
      };
      
      let flag = "";
      const lowerEvent = talk.publisher_or_event.toLowerCase();
      if (lowerEvent.includes("israel") || lowerEvent.includes("react il") || lowerEvent.includes("nodetlv") || lowerEvent.includes("reactnext")) flag = "🇮🇱 ";
      else if (lowerEvent.includes("alicante") || lowerEvent.includes("spain")) flag = "🇪🇸 ";
      else if (lowerEvent.includes("athens") || lowerEvent.includes("greece")) flag = "🇬🇷 ";
      else if (lowerEvent.includes("mons") || lowerEvent.includes("belgium") || lowerEvent.includes("devday")) flag = "🇧🇪 ";
      else if (lowerEvent.includes("london") || lowerEvent.includes("uk") || lowerEvent.includes("advanced")) flag = "🇬🇧 ";
      else if (lowerEvent.includes("berlin") || lowerEvent.includes("germany") || lowerEvent.includes("talks")) flag = "🇩🇪 ";
      else if (lowerEvent.includes("singapore")) flag = "🇸🇬 ";
      else if (lowerEvent.includes("delhi") || lowerEvent.includes("india")) flag = "🇮🇳 ";
      
      const titleDisplay = `${flag}${talk.canonical_title}`;
      
      return `<li class="link-item">
        <div class="link-content">
          <a href="${talk.primary_url}" class="item-title" target="_blank" rel="noopener noreferrer">${titleDisplay}</a>
          ${renderMirrors(null, talk.related_urls)}
        </div>
        <span class="item-extra font-mono">${talk.publisher_or_event} | ${dateDisplay}</span>
      </li>`;
    })
    .join("\n");

  // 3. Podcasts & Interviews
  const appearancesHtml = (data.resources.appearances || [])
    .filter(a => a.verification_status === "confirmed")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(app => {
      const dateDisplay = formatDate(app.date);
      return `<li class="link-item">
        <div class="link-content">
          <a href="${app.primary_url}" class="item-title" target="_blank" rel="noopener noreferrer">${app.canonical_title}</a>
          ${renderMirrors(null, app.related_urls)}
        </div>
        <span class="item-extra font-mono">${app.publisher_or_event} | ${dateDisplay}</span>
      </li>`;
    })
    .join("\n");

  // 4. Articles
  const articlesHtml = (data.resources.articles || [])
    .filter(a => a.verification_status === "confirmed")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(art => {
      const dateDisplay = formatDate(art.date);
      return `<li class="link-item">
        <div class="link-content">
          <a href="${art.primary_url}" class="item-title" target="_blank" rel="noopener noreferrer">${art.canonical_title}</a>
          ${renderMirrors(null, art.related_urls)}
        </div>
        <span class="item-extra font-mono">${art.publisher_or_event} | ${dateDisplay}</span>
      </li>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Evyatar Alush - Software Engineer, Open Source Maintainer</title>
  <meta name="description" content="Personal website of Evyatar Alush, creator of Vest validation framework and emoji-picker-react. Software Engineer at Meta.">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="shortcut icon" href="./favicon.ico" />
  <link rel="stylesheet" type="text/css" media="screen" href="./style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700&display=swap" rel="stylesheet">
</head>

<body>
  <div class="app-container">
    <header class="hero-section">
      <div class="face-container">
        <div class="face-glow"></div>
        <img class="face-img" src="./evyatar_profile.png" alt="Evyatar Alush" width="144" height="144" fetchpriority="high">
      </div>
      <h1>HI<span class="paint">,</span> I AM<br>EVYATAR<span class="paint">.</span></h1>
      <p class="tagline">${data.caption}.</p>
      
      <p class="bio">${data.bio}</p>

      <div class="contact-links">
        <a href="mailto:code@ealush.com" class="email-link">code<span class="paint">@</span>ealush.com</a>
        
        <div class="social-links">
          <a href="https://x.com/evyataral" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>@evyataral</span>
          </a>
          <span class="divider">|</span>
          <a href="https://www.linkedin.com/in/evyatar-alush-5b760866/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </header>

    <main class="links-section">
      <section class="links-group">
        <h2>Code</h2>
        <ul class="links-list">
          ${projectsHtml}
        </ul>
      </section>

      <section class="links-group">
        <h2>Talks & Presentations</h2>
        <ul class="links-list">
          ${talksHtml}
        </ul>
      </section>

      <section class="links-group">
        <h2>Podcasts & Interviews</h2>
        <ul class="links-list">
          ${appearancesHtml}
        </ul>
      </section>

      <section class="links-group">
        <h2>Articles & Writing</h2>
        <ul class="links-list">
          ${articlesHtml}
        </ul>
      </section>
    </main>
  </div>
</body>

</html>
`;
};
