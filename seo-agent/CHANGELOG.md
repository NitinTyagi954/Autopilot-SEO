# Improvement Changelog

Fill this in as you build and test. Run `npm run eval` after each change
and paste the resulting scores in as evidence.

| Stage | What you tried and why | Evidence | Decision / Learning |
|---|---|---|---|
| Baseline | Single direct prompt, no site context, no verification, no memory | _(paste eval scores)_ | Established the starting point |
| Iteration 1 | Added `tools/siteContent.js` so the agent grounds internal-link suggestions in real site content | _(paste eval scores)_ | |
| Iteration 2 | Added `verification/rules.js` generate → verify → regenerate loop | _(paste eval scores)_ | |
| Iteration 3 | Added `memory/store.js` keyword-cannibalization tracking across runs | _(paste eval scores)_ | |
| Final | Combined all of the above | _(paste eval scores)_ | Identify the change that contributed most |

## Main failure mode observed
_(fill in once you've run the eval a few times — e.g. does the agent
still miss a natural keyword sometimes? does verification loop max out
its attempts on a particular kind of post?)_

## Hot take
_(one practical lesson about building reliable agents, based on what you saw)_
