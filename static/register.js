if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./sw.js")
    .then((_) => {
      console.log(
        "%cSW registered",
        "color: cyan; font-weight: medium; font-size: 1.2rem;",
      );
    })
    .catch(console.error);
}
