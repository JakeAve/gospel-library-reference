import config from "../deno.json" with { type: "json" };

const CONFIG_PATH = "./deno.json";
const UI_PATH = "./routes/index.tsx";

const currentVersion = config.version;

const newVersion = currentVersion.split(".").map((n, i, a) => {
  if (i === a.length - 1) {
    return Number(n) + 1;
  } else return n;
}).join(".");

Promise.all([
  Deno.readTextFile(CONFIG_PATH)
    .then((configContents) => {
      const updatedConfig = configContents.replace(
        /"version":.*,/,
        `"version": "${newVersion}",`,
      );
      return Deno.writeTextFile(CONFIG_PATH, updatedConfig);
    }),

  Deno.readTextFile(UI_PATH)
    .then((uiContents) => {
      const updatedUI = uiContents.replace(
        /<span id="version">.*<\/span>/,
        `<span id="version">v${newVersion}</span>`,
      );
      return Deno.writeTextFile(UI_PATH, updatedUI);
    }),
])
  .then(() => Deno.stdout.write(new TextEncoder().encode(newVersion))).then(
    () => {
      Deno.exit(0);
    },
  )
  .catch((error) => {
    console.error("An error occurred:", error);
    Deno.exit(1);
  });
