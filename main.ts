import { App, staticFiles } from "fresh";

export const app = new App()
  .use(staticFiles())
  .get(
    "/S/:digits",
    (ctx) => ctx.redirect(`/s/${ctx.params.digits}`, 301),
  )
  .fsRoutes();

if (import.meta.main) {
  await app.listen();
}
