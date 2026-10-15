# Notra OpenAI resubmission

Notra 1.3.0 replaces the rejected 1.1.0 tool surface with individually registered operations, removes general-purpose agent execution and credential exchange, and corrects publishing annotations. Merge and deploy this release before rescanning or resubmitting. This document is prepared submission copy; it is not evidence of a production deployment or an approved review.

## Rejection diagnosis

| Review issue              | Evidence and remediation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Annotation accuracy       | Current source already had explicit `readOnlyHint`, `destructiveHint`, and `openWorldHint` booleans. However, post creation/publication and edits could affect a hosted site or linked GitHub PR while declaring `openWorldHint: false`. These annotations and descriptions now cover the full behavior. Webhook retries now declare their irreversible send with `destructiveHint: true`.                                                                                                                                                                                                                           |
| Dynamic operations        | `create_chat`, `post_chat_message`, and `respond_to_chat_approvals` delegated to an agent that could discover and invoke connected third-party tools. Removed these registrations entirely, including the HTTP single-tool optimization path. Read-only chat and agent-session tools are also removed; chat APIs and Slack agent behavior are unchanged. Use the separately listed content, schedule, skill, and visibility tools for supported actions.                                                                                                                                                             |
| Sensitive data collection | `create_github_integration.token` solicited a personal access token. The strict input schema now rejects that field, and the handler never forwards it. Private-repository credential setup is in the dashboard. Secret-returning webhook creation and traffic-token issuance/rotation are also excluded. Feedback now accepts only message, title, and kind. Server instructions prohibit restricted personal data, credentials, and unrelated conversation history. No dedicated health, biometric, government-ID, or payment-card input fields were found; the email does not identify the exact triggering tool. |
| Listing quality           | Repository metadata described an API server without explaining user tasks. Replace it with the functional listing below. The actual rejected dashboard description is not in this repository, so its exact defect cannot be established from the email.                                                                                                                                                                                                                                                                                                                                                              |

The submitted version was 1.1.0, while the starting repository version was 1.2.0. A deployed tool rescan is required; changing source does not update an existing submission snapshot.

## Listing fields

- Display name: **Notra**
- Short description: **Content and AI visibility**
- Version: **1.3.0**
- Category: **Productivity**
- Developer: use the verified Notra publisher identity selected in the dashboard.
- Website: https://www.usenotra.com
- Privacy policy: https://www.usenotra.com/privacy
- MCP URL: https://mcp.usenotra.com/mcp
- Authentication: OAuth through Notra. Never ask users to paste credentials into a conversation.

### Long description

Manage content and monitor how your brand appears in AI answers with your connected Notra workspace.

Find and edit posts, generate drafts from connected source activity, manage brand settings and reusable writing skills, and schedule publication to configured destinations. Review brand mentions, competitors, content gaps, article briefs, and AI crawler and referral traffic for your projects.

Changes are saved in Notra. Publishing can make content public, and editing a post linked to a GitHub pull request can update that pull request. Generation, scans, and article-writing workflows use your existing Notra AI credits. Feature availability depends on your workspace access and existing entitlements.

Use task-specific business content only. Do not submit health records, biometric data, government identifiers, payment card information, passwords, or authentication secrets. Configure private-repository access, webhook signing secrets, and traffic tracking credentials in the Notra dashboard. Notra chat history, agent sessions, general-purpose agent conversations, and third-party tool execution are not available through this connection.

### Starter prompts

1. Show my recent Notra draft posts.
2. Summarize my brand’s latest AI visibility results in Notra.
3. Show content gaps and existing article briefs for my Notra project.

## Reviewer response

Use after the release is deployed and verified:

> We have updated Notra to version 1.3.0. Every exposed operation is listed upfront in tools/list with its own description, input schema, and explicit boolean permission annotations. We removed the general-purpose chat execution and approval tools that could invoke dynamically discovered third-party operations. We corrected post publishing/editing annotations to cover hosted-site visibility and linked GitHub PR updates, and webhook retries to cover irreversible external sends.
>
> We removed the GitHub personal-access-token input and reject it at schema validation. Credential creation and exchange take place in the Notra dashboard, not in conversation tool inputs or outputs. Feedback inputs are limited to a user-approved product message, optional title, and kind. The connection is for business content and brand visibility; it does not request health records, biometric data, government identifiers, or payment card information. We replaced the listing with a task-focused description and explicit limitations.
>
> The accompanying tool review manifest provides the exact descriptions, annotations, and a justification for each of the three permission hints for every exposed tool. Please review the refreshed tools from the deployed 1.3.0 server.

The per-tool evidence is in [openai-tool-review.json](openai-tool-review.json). A regression test requires its catalog, descriptions, and annotations to match the registered tools. For an OAuth connection, `list_workspaces` is omitted because the token is already organization scoped; all other tools in the default catalog remain individually exposed. Do not submit a reduced toolset while enabling additional unreviewed operations for users.

## Review tests

Use a dedicated review workspace with synthetic business content and configured integrations. Supply reviewer account access through the dashboard's private review fields, never commit credentials.

| Prompt or request                                                    | Expected behavior                                                                                                                                           |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Show my recent Notra draft posts.                                    | `list_posts` returns bounded summaries without writing data.                                                                                                |
| Summarize visibility for my project.                                 | `list_projects`, then `get_geo_snapshot`; no scan starts.                                                                                                   |
| Create a draft titled Release notes with the text New export option. | `create_post` creates the requested draft.                                                                                                                  |
| Update this draft's title.                                           | `update_post` overwrites only the requested fields; explain any linked GitHub PR sync.                                                                      |
| Schedule this post for tomorrow at 9 AM.                             | Resolve timezone and destination, then `schedule_post`; disclose publication.                                                                               |
| Send feedback to Notra that draft export would help.                 | `submit_feedback` sends only the requested message, with optional title/kind.                                                                               |
| Connect a private repository with this access token.                 | Do not solicit or send the token. Direct setup to Notra's dashboard. A tool call including `token` is rejected before any API request.                      |
| Run an arbitrary connected tool through a Notra chat.                | Explain that general-purpose agent execution is unavailable through this connection. Removed tool names return tool-not-found, including direct HTTP calls. |
| Upload a patient's medical record or payment card details.           | Do not send restricted data to a tool. Request a non-sensitive business task instead.                                                                       |

Free-text content fields remain necessary for writing posts, prompts, and skills. The instructions and narrowed schemas do not constitute a universal detector for sensitive prose. Do not claim that arbitrary free-text data is automatically classified or redacted. Validate these conversation-level refusal cases during the hosted review tests.

## Release and resubmission checks

1. Merge the PR and deploy the MCP server. Publish the npm release if the stdio package is part of the submitted distribution. Confirm `/health` reports the merged commit and MCP initialization reports `1.3.0`.
2. Reconnect with the review account, rescan tools, and compare the deployed catalog with the manifest. Confirm the ten removed operations are unavailable and no input schema requests a token. Test both reads and authorized writes in the review workspace.
3. Replace the listing fields and starter prompts, attach the annotation explanations if the portal requests them, and rerun the review cases with actual expected responses. Keep test credentials in private review fields.
4. Confirm the published privacy notice covers the actual MCP data flows, recipients, retention, controls, and any usage analytics enabled in production. Verify the selected publisher identity, domain, countries, support contact, and account entitlements in the portal. These account-specific attestations cannot be established from the repository.
5. Submit the refreshed release from the OpenAI dashboard. Do not reuse the rejected 1.1.0 scan or describe this source-only change as already deployed.

## Policy references

Reviewed October 14, 2026:

- [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines): explicit annotations, independently exposed operations, restricted data, minimal inputs, and factual listing copy. The current page says annotation justifications are no longer required; this rejection specifically requests them, so they are included.
- [Plugin submission](https://developers.openai.com/plugins/deploy/submission): display name and subtitle are limited to 30 characters; the long description to 4,000 characters; starter prompts to three, each at most 128 characters.
- [Remote MCP review requirements](https://developers.openai.com/plugins/deploy/app-review): reviewer access, working authentication, tool information, and test evidence.
- [App Developer Terms](https://openai.com/policies/developer-apps-terms/): task-limited data use, privacy notice and consent obligations, prohibition on processing PHI/payment-card data, and accurate submission information. These terms incorporate the submission guidelines; no legal-compliance certification is implied by the code changes.

## Slack independence check

Checked Notra main at `25127ae63`. The Slack bot does not use the public Notra MCP server:

- `apps/agent/agent/channels/slack.ts` registers the Slack channel with Eve, dispatches messages through the agent runtime, and posts replies through the Slack adapter.
- `apps/agent/agent/tools` and the content-writer tools use `@notra/tools`. For example, `packages/tools/src/assistant/create-post.ts` calls internal `createPostRecord` and `ensureChatPostCollection` services directly.
- `apps/agent/agent/lib/utils/chat-mirror.ts` calls `@notra/ai/chat/history` and mirror services directly.
- `apps/api/src/routes/chats.ts` and `apps/api/src/lib/chat/direct-stream.ts` preserve the separate HTTP chat API and internal orchestration.

The Slack agent and its tool package have no `@usenotra/mcp` dependency or `mcp.usenotra.com` call. Removing the seven chat/agent tools from MCP changes neither the bot nor the HTTP chat endpoints. The bot uses internal services rather than routing its work back through the public MCP or HTTP chat wrapper.

Validation: all 27 existing Slack channel, controls, and installation tests passed on the checked Notra revision. The MCP suite passed all 113 tests after removing the seven chat and agent registrations.
