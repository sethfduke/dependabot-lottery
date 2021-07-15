# Expand Teams Action
This action will expand any organization teams assigned to the current pull request by adding all members of the team.  This exists to get around an issue where the team will be removed and the individual that performed the review will be the only person left on the review, thus removing the PR from all other users' dashboards.

## Usage
---
**NOTE**

Because this is a private repository, you must clone it into your working directory and use it from there.

---

```
name: "Expand Teams"

on:
  pull_request:
    types: [opened, ready_for_review]

jobs:
  assign-reviewers:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
      with:
        repository: HylandSoftware/expand-teams-action
        ref: v1
        path: ./.github/actions/expand-teams-action
        token: ${{ secrets.EXPAND_TEAMS_PAT }}
    - name: Expand Teams to Individual Reviewers
      uses: ./.github/actions/expand-teams-action
      with:
        token: ${{ secrets.EXPAND_TEAMS_PAT }}
```

## Options
| Field | Required | Description |
| ----- | -------- | ----------- |
| token | true | The GitHub token to use to read and update the PR.  This token must have the `repo`, `read:user` and `read:org` scopes. |
| remove-teams | false | If set to 'true', the teams will be removed after expanding to individual members. |
