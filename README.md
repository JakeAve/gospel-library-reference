# Gospel Library Reference

Webapp to create Gospel Library compatible links

## Setup

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then configure the git hooks:

```
deno task setup
```

This points git at `.githooks/` and marks the hooks executable. The repo ships
pre-commit and pre-push hooks that run `deno task check` (and `deno task test`
on push) before each commit/push.

Then start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.
