import * as github from "@actions/github";
import { Constants } from "../Constants";
import { IssueBotUtils } from "../IssueBotUtils";

export class IssueComments {
    private issueBotUtils: IssueBotUtils

    constructor(issueBotUtils: IssueBotUtils) {
        this.issueBotUtils = issueBotUtils;
    }

    async getLastCommentId(baseComment?: string): Promise<number|null> {
        const request = this.issueBotUtils.addRepoParams({
            issue_number: this.issueBotUtils.issueNo
        });
        const comments = await this.issueBotUtils.octokit.issues.listComments(request);

        let comment = comments.data.pop();
        while(comment) {
            if (comment.user.login === Constants.GITHUB_BOT_USERNAME && (!baseComment || comment.body.includes(baseComment))) {
                return comment.id;
            }
            comment = comments.data.pop();
        }

        return null;
    }

    async addComment(comment: string) {
        const request = this.issueBotUtils.addRepoParams({
            issue_number: this.issueBotUtils.issueNo,
            body: comment
        });
        await this.issueBotUtils.octokit.issues.createComment(request);
    }

    async updateComment(commentId: number, comment: string) {
        const request = this.issueBotUtils.addRepoParams({
            comment_id: commentId,
            body: comment
        });
        await this.issueBotUtils.octokit.issues.updateComment(request);
    }

    async removeComment(commentId: number) {
        const request = this.issueBotUtils.addRepoParams({
            comment_id: commentId
        });
        await this.issueBotUtils.octokit.issues.deleteComment(request);
    }
}