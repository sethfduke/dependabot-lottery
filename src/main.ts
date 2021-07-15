import * as core from '@actions/core';
import * as github from '@actions/github';

async function run(): Promise<void> {
  try {
    const githubToken: string = core.getInput('token');
    const reviewers: string = core.getInput('reviewers');
    const context = github.context;
    const octokit = github.getOctokit(githubToken);

    const pr = await octokit.pulls.get({
      owner: context.issue.owner,
      repo: context.issue.repo,
      pull_number: context.issue.number
    });

    var reviewerPool = reviewers.split(',');
    var luckyWinner = reviewerPool[Math.floor(Math.random()*reviewerPool.length)];

    const addMembersResponse = await octokit.pulls.requestReviewers({
      owner: context.issue.owner,
      repo: context.issue.repo,
      pull_number: context.issue.number,
      reviewers: [luckyWinner]
    });

    if (addMembersResponse.status !== 201) {
      core.info(`requestReviewers response: ${addMembersResponse.status}`);
      core.setFailed('Failed to add requested reviewer');
      return;
    }

    core.info(
      `Removing requested team reviewers: ${pr.data.requested_teams?.join(', ')}`
    );

    const teamsToRemove: string[] = [];
    const requestedTeams = (pr.data.requested_teams ?? []).filter(
      t => t != null
    );
    for (const requestedTeam of requestedTeams) {
      if (!requestedTeam) {
        continue;
      }
      teamsToRemove.push(requestedTeam.slug);
    }

    const removeTeamsResponse: any = await octokit.pulls.removeRequestedReviewers(
      {
        owner: context.issue.owner,
        repo: context.issue.repo,
        pull_number: context.issue.number,
        reviewers: [],
        team_reviewers: teamsToRemove
      }
    );

    if (removeTeamsResponse.status !== 200) {
      core.info(
        `removeRequestedReviewers response: ${removeTeamsResponse.status}`
      );
      core.setFailed('Failed to remove teams from requested reviewers');
      return;
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
