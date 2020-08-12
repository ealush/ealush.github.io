const $repos = document.getElementById("repos");
const $main = document.getElementById("main");

const convert = (oldMin, oldMax, newMin, newMax, oldValue) =>
  ((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;

vent(window).on("scroll", (e) => {
  const mainHeight = $main.clientHeight;
  const posY = convert(0, mainHeight, 0, 100, window.scrollY);
  $main.style.backgroundPositionY = `${posY}%`;
});

vent("h2").on("click", ({ target }) => {
  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});
