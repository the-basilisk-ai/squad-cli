/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type ActionCategory =
  | 'comms'
  | 'operational'
  | 'product'
  | 'strategic'
  | 'workspace';

export type ActionEffort =
  | 'high'
  | 'low'
  | 'medium';

export type ActionLinkTargetInput = {
  insightId?: string | null | undefined;
  onePagerId?: string | null | undefined;
};

export type ActionPriority =
  | 'P0'
  | 'P1'
  | 'P2';

export type ActionStatus =
  | 'completed'
  | 'dismissed'
  | 'in_progress'
  | 'suggested';

export type CreateDocumentInput = {
  blockNoteJson?: string | null | undefined;
  content: string;
  /** Optional directory ID to place the document in */
  directoryId?: string | null | undefined;
  icon?: string | null | undefined;
  title: string;
};

export type CreateGoalInput = {
  blockNoteJson?: string | null | undefined;
  content: string;
  importance: number;
  title: string;
};

export type DateTimeSet = {
  set?: string | null | undefined;
};

export type DecisionRecommendation =
  | 'build'
  | 'defer'
  | 'research';

export type DocumentKind =
  | 'knowledge'
  | 'one_pager';

export type EdgeLabel =
  | 'BELONGS_TO'
  | 'CITES'
  | 'DERIVED_FROM'
  | 'INFORMS'
  | 'RELATED_TO'
  | 'SUPPORTS_GOAL';

export type EntityType =
  | 'Action'
  | 'Document'
  | 'Goal'
  | 'Insight';

export type LinkEntitiesInput = {
  edgeLabel: EdgeLabel;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
};

export type OnePagerListFilters = {
  createdAfter?: string | null | undefined;
  createdBefore?: string | null | undefined;
  onePagerStatus?: Array<OnePagerStatus> | null | undefined;
  onePagerType?: OnePagerType | null | undefined;
  sourceInsightId?: string | null | undefined;
};

export type OnePagerStatus =
  | 'building'
  | 'draft'
  | 'failed'
  | 'finalised'
  | 'in_review';

export type OnePagerType =
  | 'decision'
  | 'prd';

export type SignalSentiment =
  | 'mixed'
  | 'negative'
  | 'neutral'
  | 'positive';

export type SignalSentimentFilter =
  | 'mixed'
  | 'negative'
  | 'neutral'
  | 'positive';

export type SignalSource =
  | 'agent'
  | 'amplitude'
  | 'api'
  | 'app_store'
  | 'capterra'
  | 'document'
  | 'file_upload'
  | 'g2'
  | 'github'
  | 'gong'
  | 'google_play'
  | 'google_reviews'
  | 'intercom'
  | 'jira'
  | 'linear'
  | 'manual'
  | 'notion'
  | 'posthog'
  | 'research'
  | 'salesforce'
  | 'slack'
  | 'trustpilot'
  | 'typeform'
  | 'webhook'
  | 'website'
  | 'zendesk';

export type SignalStatus =
  | 'active'
  | 'stale'
  | 'tombstoned';

export type SignalType =
  | 'agent_insight'
  | 'bug_report'
  | 'churn_risk'
  | 'competitive_intel'
  | 'feature_request'
  | 'pain_point'
  | 'praise';

export type StringFilter = {
  eq?: string | null | undefined;
};

export type UnlinkEntitiesInput = {
  edgeLabel: EdgeLabel;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
};

export type UpdateActionInput = {
  category?: ActionCategory | null | undefined;
  effort?: ActionEffort | null | undefined;
  priority?: ActionPriority | null | undefined;
  status?: ActionStatus | null | undefined;
};

export type UpdateDocumentInput = {
  blockNoteJson?: string | null | undefined;
  content?: string | null | undefined;
  /** Create a version snapshot before updating */
  createVersion?: boolean | null | undefined;
  /** Move document to this directory (null for root) */
  directoryId?: string | null | undefined;
  icon?: string | null | undefined;
  title?: string | null | undefined;
};

export type UpdateGoalInput = {
  blockNoteJson?: string | null | undefined;
  content?: string | null | undefined;
  /** Create a version snapshot before updating */
  createVersion?: boolean | null | undefined;
  importance?: number | null | undefined;
  title?: string | null | undefined;
};

export type UpdateInsightInput = {
  category?: string | null | undefined;
  status?: string | null | undefined;
};

export type WorkspaceUpdateInput = {
  deletedAt?: DateTimeSet | null | undefined;
  description?: string | null | undefined;
  isDefault?: boolean | null | undefined;
  /** An https:// URL or a `data:image/...;base64,...` data URL. Pass null to clear. */
  logoUrl?: string | null | undefined;
  missionStatement?: string | null | undefined;
  name?: string | null | undefined;
  onboardingStatus?: string | null | undefined;
  settings?: string | null | undefined;
  slug?: string | null | undefined;
};

export type WorkspaceWhere = {
  id?: StringFilter | null | undefined;
  organisationId?: StringFilter | null | undefined;
  slug?: StringFilter | null | undefined;
};

export type CliListActionsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  statuses?: Array<ActionStatus> | ActionStatus | null | undefined;
  assigneeUserId?: string | null | undefined;
  includeSnoozed?: boolean | null | undefined;
  priority?: Array<string> | string | null | undefined;
}>;


export type CliListActionsQuery = { actions: Array<{ id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, dueAt: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null, insight: { id: string | null, displayId: number | null, title: string | null } | null }> | null };

export type CliListActionsForInsightQueryVariables = Exact<{
  insightId?: string | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  status?: Array<ActionStatus> | ActionStatus | null | undefined;
  includeSnoozed?: boolean | null | undefined;
}>;


export type CliListActionsForInsightQuery = { actionList: Array<{ id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, dueAt: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null, insight: { id: string | null, displayId: number | null, title: string | null } | null }> | null };

export type CliActionContextQueryVariables = Exact<{
  id: string;
}>;


export type CliActionContextQuery = { action: { id: string | null, displayId: number | null, title: string | null, body: string | null, rationale: string | null, notes: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, dueAt: string | null, createdAt: string | null, assignee: { userId: string | null, displayName: string | null } | null, outputDocument: { id: string | null, displayId: number | null, title: string | null } | null, insight: { id: string | null, displayId: number | null, title: string | null, description: string | null, category: string | null, combinedScore: number | null, evidenceCount: number | null, goals: Array<{ id: string | null, displayId: number | null, title: string | null, importance: number | null }> | null, signals: Array<{ id: string | null, displayId: number | null, contentSummary: string | null, content: string | null, source: SignalSource | null, createdAt: string | null, externalSource: { sourceUri: string | null } | null }> | null } | null } | null };

export type CliSignalListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  source?: SignalSource | null | undefined;
  signalType?: SignalType | null | undefined;
  clusterId?: string | null | undefined;
  createdAfter?: string | null | undefined;
  createdBefore?: string | null | undefined;
  status?: Array<SignalStatus> | SignalStatus | null | undefined;
  sentiment?: SignalSentimentFilter | null | undefined;
}>;


export type CliSignalListQuery = { signalList: Array<{ id: string | null, displayId: number | null, contentSummary: string | null, source: SignalSource | null, signalType: SignalType | null, sentiment: SignalSentiment | null, strength: number | null, occurrenceCount: number | null, status: string | null, createdAt: string | null, cluster: { id: string | null, displayId: number | null, label: string | null } | null }> | null };

export type CliClusterListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  signalType?: SignalType | null | undefined;
  requireLabel?: boolean | null | undefined;
}>;


export type CliClusterListQuery = { clusterList: Array<{ id: string | null, displayId: number | null, label: string | null, labelConfidence: number | null, memberCount: number | null, cohesionScore: number | null, signalType: SignalType | null, status: string | null, updatedAt: string | null }> | null };

export type CliGetClusterQueryVariables = Exact<{
  id: string;
}>;


export type CliGetClusterQuery = { cluster: { id: string | null, displayId: number | null, label: string | null, labelConfidence: number | null, memberCount: number | null, cohesionScore: number | null, signalType: SignalType | null, status: string | null, createdAt: string | null, updatedAt: string | null, signals: Array<{ id: string | null, displayId: number | null, contentSummary: string | null, source: SignalSource | null, strength: number | null, createdAt: string | null }> | null, linkedInsights: Array<{ id: string | null, displayId: number | null, title: string | null, combinedScore: number | null }> | null } | null };

export type CliInsightListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  category?: string | null | undefined;
  excludeCategories?: Array<string> | string | null | undefined;
  minCombinedScore?: number | null | undefined;
  status?: string | null | undefined;
  sortBy?: string | null | undefined;
}>;


export type CliInsightListQuery = { insightList: Array<{ id: string | null, displayId: number | null, title: string | null, category: string | null, status: string | null, combinedScore: number | null, evidenceCount: number | null, signalCount: number | null, goalCount: number | null, updatedAt: string | null }> | null };

export type CliGoalInsightsQueryVariables = Exact<{
  goalId: string;
}>;


export type CliGoalInsightsQuery = { goal: { id: string | null, displayId: number | null, insights: Array<{ id: string | null, displayId: number | null, title: string | null, category: string | null, status: string | null, combinedScore: number | null, evidenceCount: number | null, updatedAt: string | null }> | null } | null };

export type CliGetSignalQueryVariables = Exact<{
  id: string;
}>;


export type CliGetSignalQuery = { signal: { id: string | null, displayId: number | null, content: string | null, contentSummary: string | null, source: SignalSource | null, derivedSource: string | null, signalType: SignalType | null, sentiment: SignalSentiment | null, strength: number | null, occurrenceCount: number | null, status: string | null, createdAt: string | null, lastSeenAt: string | null, externalSource: { sourceUri: string | null } | null, cluster: { id: string | null, displayId: number | null, label: string | null } | null, insights: Array<{ id: string | null, displayId: number | null, title: string | null }> | null } | null };

export type CliGetSignalRelatedQueryVariables = Exact<{
  id: string;
  limit?: number | null | undefined;
}>;


export type CliGetSignalRelatedQuery = { signal: { id: string | null, displayId: number | null, relatedSignals: Array<{ id: string | null, displayId: number | null, contentSummary: string | null, source: SignalSource | null, signalType: SignalType | null, strength: number | null, createdAt: string | null }> | null } | null };

export type CliGetInsightQueryVariables = Exact<{
  id: string;
  withEvidence: boolean;
}>;


export type CliGetInsightQuery = { insight: { id: string | null, displayId: number | null, title: string | null, description: string | null, category: string | null, status: string | null, combinedScore: number | null, strengthScore: number | null, momentumScore: number | null, evidenceCount: number | null, signalCount: number | null, goalCount: number | null, createdAt: string | null, updatedAt: string | null, lastEvidenceAt: string | null, goals: Array<{ id: string | null, displayId: number | null, title: string | null, importance: number | null }> | null, suggestedActions: Array<{ id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null }> | null, signals?: Array<{ id: string | null, displayId: number | null, contentSummary: string | null, source: SignalSource | null, createdAt: string | null, externalSource: { sourceUri: string | null } | null }> | null } | null };

export type CliGetActionQueryVariables = Exact<{
  id: string;
}>;


export type CliGetActionQuery = { action: { id: string | null, displayId: number | null, title: string | null, body: string | null, rationale: string | null, notes: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, dueAt: string | null, snoozedUntil: string | null, createdAt: string | null, statusChangedAt: string | null, assignee: { userId: string | null, displayName: string | null } | null, insight: { id: string | null, displayId: number | null, title: string | null } | null, outputDocument: { id: string | null, displayId: number | null, title: string | null } | null } | null };

export type CliGetGoalQueryVariables = Exact<{
  id: string;
}>;


export type CliGetGoalQuery = { goal: { id: string | null, displayId: number | null, title: string | null, content: string | null, importance: number | null, createdAt: string | null, updatedAt: string | null, insights: Array<{ id: string | null, displayId: number | null, title: string | null, combinedScore: number | null }> | null, researchQuestions: Array<{ id: string | null, displayId: number | null, question: string | null, sufficiencyStatus: string | null }> | null } | null };

export type CliGetDocumentMetaQueryVariables = Exact<{
  id: string;
}>;


export type CliGetDocumentMetaQuery = { document: { id: string | null, displayId: number | null, title: string | null, kind: DocumentKind | null, path: string | null, tags: Array<string> | null, updatedAt: string | null, directoryId: string | null, onePagerStatus: OnePagerStatus | null, onePagerType: OnePagerType | null, sourceAction: { id: string | null, displayId: number | null, title: string | null } | null, sourceInsight: { id: string | null, displayId: number | null, title: string | null } | null } | null };

export type CliGetDocumentMarkdownQueryVariables = Exact<{
  documentId: string;
}>;


export type CliGetDocumentMarkdownQuery = { documentMarkdownExport: string | null };

export type CliGetOnePagerQueryVariables = Exact<{
  displayId: string;
}>;


export type CliGetOnePagerQuery = { onePager: { id: string | null, displayId: number | null, title: string | null, onePagerStatus: OnePagerStatus | null, onePagerType: OnePagerType | null, decisionRecommendation: DecisionRecommendation | null, failureReason: string | null, updatedAt: string | null, sourceAction: { id: string | null, displayId: number | null, title: string | null } | null, sourceInsight: { id: string | null, displayId: number | null, title: string | null } | null } | null };

export type CliIntegrationListQueryVariables = Exact<{ [key: string]: never; }>;


export type CliIntegrationListQuery = { integrationList: Array<{ id: string | null, name: string | null, provider: string | null, status: string | null, updatedAt: string | null, triggers: Array<{ id: string | null, sourceName: string | null, status: string | null, lastSyncedAt: string | null, syncTotal: number | null }> | null }> | null };

export type CliDocumentListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type CliDocumentListQuery = { documentList: Array<{ id: string | null, displayId: number | null, title: string | null, kind: DocumentKind | null, path: string | null, tags: Array<string> | null, updatedAt: string | null, onePagerStatus: OnePagerStatus | null, onePagerType: OnePagerType | null }> | null };

export type CliOnePagerListQueryVariables = Exact<{
  filters?: OnePagerListFilters | null | undefined;
  limit?: number | null | undefined;
  offset?: number | null | undefined;
}>;


export type CliOnePagerListQuery = { onePagerList: Array<{ id: string | null, displayId: number | null, title: string | null, onePagerStatus: OnePagerStatus | null, onePagerType: OnePagerType | null, decisionRecommendation: DecisionRecommendation | null, updatedAt: string | null, sourceInsight: { id: string | null, displayId: number | null, title: string | null } | null, sourceAction: { id: string | null, displayId: number | null, title: string | null } | null }> | null };

export type CliCreateDocumentMutationVariables = Exact<{
  input: CreateDocumentInput;
}>;


export type CliCreateDocumentMutation = { createDocument: { id: string | null, displayId: number | null, title: string | null, path: string | null } | null };

export type CliUpdateDocumentMutationVariables = Exact<{
  id: string;
  input: UpdateDocumentInput;
}>;


export type CliUpdateDocumentMutation = { updateDocument: { id: string | null, displayId: number | null, title: string | null, updatedAt: string | null } | null };

export type CliAddDocumentTagMutationVariables = Exact<{
  id: string;
  tag: string;
}>;


export type CliAddDocumentTagMutation = { addDocumentTag: { id: string | null, tags: Array<string> | null } | null };

export type CliRemoveDocumentTagMutationVariables = Exact<{
  id: string;
  tag: string;
}>;


export type CliRemoveDocumentTagMutation = { removeDocumentTag: { id: string | null, tags: Array<string> | null } | null };

export type CliGenerateOnePagerFromActionMutationVariables = Exact<{
  actionId: string;
  type?: OnePagerType | null | undefined;
}>;


export type CliGenerateOnePagerFromActionMutation = { generateOnePagerFromAction: { onePagerId: string | null, onePagerDisplayId: string | null } | null };

export type CliGenerateOnePagerFromInsightMutationVariables = Exact<{
  insightId: string;
  type?: OnePagerType | null | undefined;
}>;


export type CliGenerateOnePagerFromInsightMutation = { generateOnePagerFromInsight: { id: string | null, displayId: number | null, title: string | null, onePagerStatus: OnePagerStatus | null } | null };

export type CliRetryOnePagerGenerationMutationVariables = Exact<{
  onePagerId: string;
}>;


export type CliRetryOnePagerGenerationMutation = { retryOnePagerGeneration: { id: string | null, displayId: number | null, onePagerStatus: OnePagerStatus | null } | null };

export type CliSetOnePagerStatusMutationVariables = Exact<{
  onePagerId: string;
  status: OnePagerStatus;
}>;


export type CliSetOnePagerStatusMutation = { setOnePagerStatus: { id: string | null, displayId: number | null, title: string | null, onePagerStatus: OnePagerStatus | null } | null };

export type CliGoalListQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  minImportance?: number | null | undefined;
}>;


export type CliGoalListQuery = { goalList: Array<{ id: string | null, displayId: number | null, title: string | null, importance: number | null, updatedAt: string | null }> | null };

export type CliResearchQuestionListQueryVariables = Exact<{
  limit?: number | null | undefined;
  sufficiencyStatus?: string | null | undefined;
}>;


export type CliResearchQuestionListQuery = { researchQuestionList: Array<{ id: string | null, displayId: number | null, question: string | null, category: string | null, rationale: string | null, sufficiencyStatus: string | null, signalCount: number | null, sourceTypeCount: number | null, createdAt: string | null }> | null };

export type CliResearchQuestionsByGoalQueryVariables = Exact<{
  goalId: string;
}>;


export type CliResearchQuestionsByGoalQuery = { researchQuestionsByGoal: Array<{ id: string | null, displayId: number | null, question: string | null, category: string | null, rationale: string | null, sufficiencyStatus: string | null, signalCount: number | null, sourceTypeCount: number | null, createdAt: string | null }> | null };

export type CliActivityStreamQueryVariables = Exact<{
  first?: number | null | undefined;
  after?: string | null | undefined;
  entityType?: Array<string> | string | null | undefined;
  actorType?: Array<string> | string | null | undefined;
  agentId?: string | null | undefined;
  action?: Array<string> | string | null | undefined;
}>;


export type CliActivityStreamQuery = { activityStream: { endCursor: string | null, hasNextPage: boolean | null, events: Array<{ id: string | null, action: string | null, actorType: string | null, agentName: string | null, entityType: string | null, entityId: string | null, createdAt: string | null, actorUser: { userId: string | null, displayName: string | null } | null }> | null } | null };

export type CliCommandSearchQueryVariables = Exact<{
  search: string;
  limitPerType?: number | null | undefined;
}>;


export type CliCommandSearchQuery = { commandSearchEntities: Array<{ id: string, displayId: number | null, title: string, type: string }> };

export type CliDocumentTextSearchQueryVariables = Exact<{
  search?: string | null | undefined;
  limit?: number | null | undefined;
}>;


export type CliDocumentTextSearchQuery = { documentSearch: Array<{ id: string | null, displayId: number | null, title: string | null, kind: DocumentKind | null, updatedAt: string | null }> };

export type CliUpdateWorkspaceMutationVariables = Exact<{
  where: WorkspaceWhere;
  update: WorkspaceUpdateInput;
}>;


export type CliUpdateWorkspaceMutation = { updateWorkspaces: { workspaces: Array<{ id: string | null, name: string | null, description: string | null, missionStatement: string | null, logoUrl: string | null, slug: string | null }> | null } | null };

export type CliWorkspaceDirectoryQueryVariables = Exact<{ [key: string]: never; }>;


export type CliWorkspaceDirectoryQuery = { organisations: Array<{ id: string | null, name: string | null, slug: string | null, propelAuthOrgId: string | null }> | null, workspaces: Array<{ id: string | null, name: string | null, slug: string | null, organisationId: string | null, isDefault: boolean | null }> | null };

export type CliOrgMemberListQueryVariables = Exact<{ [key: string]: never; }>;


export type CliOrgMemberListQuery = { orgMemberList: Array<{ userId: string | null, displayName: string | null, email: string | null }> | null };

export type CliWorkspaceOverviewQueryVariables = Exact<{
  workspaceId: string;
  days?: number | null | undefined;
}>;


export type CliWorkspaceOverviewQuery = { workspaces: Array<{ id: string | null, name: string | null, description: string | null, missionStatement: string | null, slug: string | null, organisationId: string | null, onboardingStatus: string | null }> | null, goalList: Array<{ id: string | null, displayId: number | null, title: string | null, importance: number | null }> | null, signalActivitySummary: Array<{ source: string | null, count: number | null }> | null, chainHealth: { signalCount: number | null, activeSignalCount: number | null, staleSignalCount: number | null, insightCount: number | null, sourceCount: number | null, signalHealthPercent: number | null } | null, openActions: Array<{ id: string | null }> | null, pendingBriefs: Array<{ id: string | null }> | null };

export type ActionEchoFragment = { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null };

export type CliStartActionMutationVariables = Exact<{
  id: string;
}>;


export type CliStartActionMutation = { startAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliMarkActionDoneMutationVariables = Exact<{
  id: string;
}>;


export type CliMarkActionDoneMutation = { markActionDone: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliDismissActionMutationVariables = Exact<{
  actionId: string;
}>;


export type CliDismissActionMutation = { dismissAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliSnoozeActionMutationVariables = Exact<{
  actionId: string;
}>;


export type CliSnoozeActionMutation = { snoozeAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliAssignActionMutationVariables = Exact<{
  actionId: string;
  assigneeUserId?: string | null | undefined;
}>;


export type CliAssignActionMutation = { assignAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliUpdateActionNotesMutationVariables = Exact<{
  actionId: string;
  notes: string;
}>;


export type CliUpdateActionNotesMutation = { updateActionNotes: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliUpdateActionMetaMutationVariables = Exact<{
  actionId: string;
  input: UpdateActionInput;
}>;


export type CliUpdateActionMetaMutation = { updateAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliLinkActionMutationVariables = Exact<{
  actionId: string;
  target: ActionLinkTargetInput;
}>;


export type CliLinkActionMutation = { linkAction: { id: string | null, displayId: number | null, title: string | null, status: ActionStatus | null, priority: ActionPriority | null, category: ActionCategory | null, effort: ActionEffort | null, notes: string | null, snoozedUntil: string | null, assignee: { userId: string | null, displayName: string | null } | null } | null };

export type CliCreateGoalMutationVariables = Exact<{
  input: CreateGoalInput;
}>;


export type CliCreateGoalMutation = { createGoal: { id: string | null, displayId: number | null, title: string | null, content: string | null, importance: number | null } | null };

export type CliUpdateGoalMutationVariables = Exact<{
  id: string;
  input: UpdateGoalInput;
}>;


export type CliUpdateGoalMutation = { updateGoal: { id: string | null, displayId: number | null, title: string | null, content: string | null, importance: number | null } | null };

export type CliUpdateInsightMetaMutationVariables = Exact<{
  id: string;
  input: UpdateInsightInput;
}>;


export type CliUpdateInsightMetaMutation = { updateInsight: { id: string | null, displayId: number | null, title: string | null, category: string | null, status: string | null } | null };

export type CliLinkEntitiesMutationVariables = Exact<{
  input: LinkEntitiesInput;
}>;


export type CliLinkEntitiesMutation = { linkEntities: { success: boolean | null, error: string | null } | null };

export type CliUnlinkEntitiesMutationVariables = Exact<{
  input: UnlinkEntitiesInput;
}>;


export type CliUnlinkEntitiesMutation = { unlinkEntities: { success: boolean | null, error: string | null } | null };

export type CliDeleteSignalMutationVariables = Exact<{
  id: string;
}>;


export type CliDeleteSignalMutation = { deleteSignal: boolean | null };

export type CliCreateResearchQuestionMutationVariables = Exact<{
  question: string;
  goalId?: string | null | undefined;
  category?: string | null | undefined;
  rationale?: string | null | undefined;
}>;


export type CliCreateResearchQuestionMutation = { createResearchQuestion: { id: string | null, displayId: number | null, question: string | null, category: string | null, sufficiencyStatus: string | null } | null };

export const ActionEchoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<ActionEchoFragment, unknown>;
export const CliListActionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliListActions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeSnoozed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statuses"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeUserId"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeSnoozed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeSnoozed"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliListActionsQuery, CliListActionsQueryVariables>;
export const CliListActionsForInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliListActionsForInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insightId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"includeSnoozed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actionList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"insightId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insightId"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeSnoozed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"includeSnoozed"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliListActionsForInsightQuery, CliListActionsForInsightQueryVariables>;
export const CliActionContextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliActionContext"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outputDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}},{"kind":"Field","name":{"kind":"Name","value":"evidenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUri"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<CliActionContextQuery, CliActionContextQueryVariables>;
export const CliSignalListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliSignalList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"source"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignalSource"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signalType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignalType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clusterId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdAfter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdBefore"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateTime"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignalStatus"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sentiment"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignalSentimentFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signalList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"source"},"value":{"kind":"Variable","name":{"kind":"Name","value":"source"}}},{"kind":"Argument","name":{"kind":"Name","value":"signalType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signalType"}}},{"kind":"Argument","name":{"kind":"Name","value":"clusterId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clusterId"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdAfter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdAfter"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdBefore"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdBefore"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"sentiment"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sentiment"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"signalType"}},{"kind":"Field","name":{"kind":"Name","value":"sentiment"}},{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"cluster"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}}]}}]}}]} as unknown as DocumentNode<CliSignalListQuery, CliSignalListQueryVariables>;
export const CliClusterListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliClusterList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"signalType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SignalType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"requireLabel"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clusterList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"signalType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"signalType"}}},{"kind":"Argument","name":{"kind":"Name","value":"requireLabel"},"value":{"kind":"Variable","name":{"kind":"Name","value":"requireLabel"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"labelConfidence"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"cohesionScore"}},{"kind":"Field","name":{"kind":"Name","value":"signalType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CliClusterListQuery, CliClusterListQueryVariables>;
export const CliGetClusterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetCluster"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cluster"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"labelConfidence"}},{"kind":"Field","name":{"kind":"Name","value":"memberCount"}},{"kind":"Field","name":{"kind":"Name","value":"cohesionScore"}},{"kind":"Field","name":{"kind":"Name","value":"signalType"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"signals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedInsights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetClusterQuery, CliGetClusterQueryVariables>;
export const CliInsightListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliInsightList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"excludeCategories"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minCombinedScore"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insightList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"excludeCategories"},"value":{"kind":"Variable","name":{"kind":"Name","value":"excludeCategories"}}},{"kind":"Argument","name":{"kind":"Name","value":"minCombinedScore"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minCombinedScore"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"sortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}},{"kind":"Field","name":{"kind":"Name","value":"evidenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"signalCount"}},{"kind":"Field","name":{"kind":"Name","value":"goalCount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CliInsightListQuery, CliInsightListQueryVariables>;
export const CliGoalInsightsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGoalInsights"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}},{"kind":"Field","name":{"kind":"Name","value":"evidenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<CliGoalInsightsQuery, CliGoalInsightsQueryVariables>;
export const CliGetSignalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetSignal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"derivedSource"}},{"kind":"Field","name":{"kind":"Name","value":"signalType"}},{"kind":"Field","name":{"kind":"Name","value":"sentiment"}},{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"occurrenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeenAt"}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUri"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cluster"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"label"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetSignalQuery, CliGetSignalQueryVariables>;
export const CliGetSignalRelatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetSignalRelated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"relatedSignals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"signalType"}},{"kind":"Field","name":{"kind":"Name","value":"strength"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetSignalRelatedQuery, CliGetSignalRelatedQueryVariables>;
export const CliGetInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"withEvidence"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"insight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}},{"kind":"Field","name":{"kind":"Name","value":"strengthScore"}},{"kind":"Field","name":{"kind":"Name","value":"momentumScore"}},{"kind":"Field","name":{"kind":"Name","value":"evidenceCount"}},{"kind":"Field","name":{"kind":"Name","value":"signalCount"}},{"kind":"Field","name":{"kind":"Name","value":"goalCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastEvidenceAt"}},{"kind":"Field","name":{"kind":"Name","value":"goals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"suggestedActions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signals"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"withEvidence"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"contentSummary"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"externalSource"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sourceUri"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CliGetInsightQuery, CliGetInsightQueryVariables>;
export const CliGetActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"action"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"statusChangedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"outputDocument"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetActionQuery, CliGetActionQueryVariables>;
export const CliGetGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"insights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"combinedScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"researchQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"sufficiencyStatus"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetGoalQuery, CliGetGoalQueryVariables>;
export const CliGetDocumentMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetDocumentMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"document"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"directoryId"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerType"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceInsight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetDocumentMetaQuery, CliGetDocumentMetaQueryVariables>;
export const CliGetDocumentMarkdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetDocumentMarkdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentMarkdownExport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"documentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"documentId"}}}]}]}}]} as unknown as DocumentNode<CliGetDocumentMarkdownQuery, CliGetDocumentMarkdownQueryVariables>;
export const CliGetOnePagerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGetOnePager"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"displayId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onePager"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"displayId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"displayId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerType"}},{"kind":"Field","name":{"kind":"Name","value":"decisionRecommendation"}},{"kind":"Field","name":{"kind":"Name","value":"failureReason"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sourceAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceInsight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliGetOnePagerQuery, CliGetOnePagerQueryVariables>;
export const CliIntegrationListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliIntegrationList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrationList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"triggers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sourceName"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"lastSyncedAt"}},{"kind":"Field","name":{"kind":"Name","value":"syncTotal"}}]}}]}}]}}]} as unknown as DocumentNode<CliIntegrationListQuery, CliIntegrationListQueryVariables>;
export const CliDocumentListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliDocumentList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerType"}}]}}]}}]} as unknown as DocumentNode<CliDocumentListQuery, CliDocumentListQueryVariables>;
export const CliOnePagerListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliOnePagerList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OnePagerListFilters"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onePagerList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerType"}},{"kind":"Field","name":{"kind":"Name","value":"decisionRecommendation"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"sourceInsight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sourceAction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CliOnePagerListQuery, CliOnePagerListQueryVariables>;
export const CliCreateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliCreateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"path"}}]}}]}}]} as unknown as DocumentNode<CliCreateDocumentMutation, CliCreateDocumentMutationVariables>;
export const CliUpdateDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDocumentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDocument"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CliUpdateDocumentMutation, CliUpdateDocumentMutationVariables>;
export const CliAddDocumentTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliAddDocumentTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addDocumentTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<CliAddDocumentTagMutation, CliAddDocumentTagMutationVariables>;
export const CliRemoveDocumentTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliRemoveDocumentTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tag"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeDocumentTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"tag"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tag"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}}]}}]}}]} as unknown as DocumentNode<CliRemoveDocumentTagMutation, CliRemoveDocumentTagMutationVariables>;
export const CliGenerateOnePagerFromActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliGenerateOnePagerFromAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OnePagerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateOnePagerFromAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onePagerId"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerDisplayId"}}]}}]}}]} as unknown as DocumentNode<CliGenerateOnePagerFromActionMutation, CliGenerateOnePagerFromActionMutationVariables>;
export const CliGenerateOnePagerFromInsightDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliGenerateOnePagerFromInsight"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"insightId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"OnePagerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateOnePagerFromInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"insightId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"insightId"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}}]}}]}}]} as unknown as DocumentNode<CliGenerateOnePagerFromInsightMutation, CliGenerateOnePagerFromInsightMutationVariables>;
export const CliRetryOnePagerGenerationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliRetryOnePagerGeneration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onePagerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"retryOnePagerGeneration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onePagerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onePagerId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}}]}}]}}]} as unknown as DocumentNode<CliRetryOnePagerGenerationMutation, CliRetryOnePagerGenerationMutationVariables>;
export const CliSetOnePagerStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliSetOnePagerStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"onePagerId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OnePagerStatus"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setOnePagerStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"onePagerId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"onePagerId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"onePagerStatus"}}]}}]}}]} as unknown as DocumentNode<CliSetOnePagerStatusMutation, CliSetOnePagerStatusMutationVariables>;
export const CliGoalListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliGoalList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minImportance"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goalList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}},{"kind":"Argument","name":{"kind":"Name","value":"minImportance"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minImportance"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CliGoalListQuery, CliGoalListQueryVariables>;
export const CliResearchQuestionListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliResearchQuestionList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sufficiencyStatus"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"researchQuestionList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}},{"kind":"Argument","name":{"kind":"Name","value":"sufficiencyStatus"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sufficiencyStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"sufficiencyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signalCount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTypeCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CliResearchQuestionListQuery, CliResearchQuestionListQueryVariables>;
export const CliResearchQuestionsByGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliResearchQuestionsByGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"researchQuestionsByGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"sufficiencyStatus"}},{"kind":"Field","name":{"kind":"Name","value":"signalCount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTypeCount"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CliResearchQuestionsByGoalQuery, CliResearchQuestionsByGoalQueryVariables>;
export const CliActivityStreamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliActivityStream"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actorType"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"action"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityStream"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"Argument","name":{"kind":"Name","value":"actorType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actorType"}}},{"kind":"Argument","name":{"kind":"Name","value":"agentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"agentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"action"},"value":{"kind":"Variable","name":{"kind":"Name","value":"action"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actorType"}},{"kind":"Field","name":{"kind":"Name","value":"actorUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"agentName"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CliActivityStreamQuery, CliActivityStreamQueryVariables>;
export const CliCommandSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliCommandSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limitPerType"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"commandSearchEntities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limitPerType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limitPerType"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<CliCommandSearchQuery, CliCommandSearchQueryVariables>;
export const CliDocumentTextSearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliDocumentTextSearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"documentSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CliDocumentTextSearchQuery, CliDocumentTextSearchQueryVariables>;
export const CliUpdateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"where"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkspaceWhere"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"update"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkspaceUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkspaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"Variable","name":{"kind":"Name","value":"where"}}},{"kind":"Argument","name":{"kind":"Name","value":"update"},"value":{"kind":"Variable","name":{"kind":"Name","value":"update"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"missionStatement"}},{"kind":"Field","name":{"kind":"Name","value":"logoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<CliUpdateWorkspaceMutation, CliUpdateWorkspaceMutationVariables>;
export const CliWorkspaceDirectoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliWorkspaceDirectory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organisations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"propelAuthOrgId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"organisationId"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}}]}}]}}]} as unknown as DocumentNode<CliWorkspaceDirectoryQuery, CliWorkspaceDirectoryQueryVariables>;
export const CliOrgMemberListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliOrgMemberList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"orgMemberList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<CliOrgMemberListQuery, CliOrgMemberListQueryVariables>;
export const CliWorkspaceOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CliWorkspaceOverview"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"days"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"where"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"eq"},"value":{"kind":"Variable","name":{"kind":"Name","value":"workspaceId"}}}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"missionStatement"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"organisationId"}},{"kind":"Field","name":{"kind":"Name","value":"onboardingStatus"}}]}},{"kind":"Field","name":{"kind":"Name","value":"goalList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"5"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}}]}},{"kind":"Field","name":{"kind":"Name","value":"signalActivitySummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"days"},"value":{"kind":"Variable","name":{"kind":"Name","value":"days"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"count"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chainHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signalCount"}},{"kind":"Field","name":{"kind":"Name","value":"activeSignalCount"}},{"kind":"Field","name":{"kind":"Name","value":"staleSignalCount"}},{"kind":"Field","name":{"kind":"Name","value":"insightCount"}},{"kind":"Field","name":{"kind":"Name","value":"sourceCount"}},{"kind":"Field","name":{"kind":"Name","value":"signalHealthPercent"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"openActions"},"name":{"kind":"Name","value":"actions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"statuses"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"suggested"},{"kind":"EnumValue","value":"in_progress"}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"pendingBriefs"},"name":{"kind":"Name","value":"onePagerList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"onePagerStatus"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"building"},{"kind":"EnumValue","value":"draft"},{"kind":"EnumValue","value":"in_review"}]}}]}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"50"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CliWorkspaceOverviewQuery, CliWorkspaceOverviewQueryVariables>;
export const CliStartActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliStartAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliStartActionMutation, CliStartActionMutationVariables>;
export const CliMarkActionDoneDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliMarkActionDone"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markActionDone"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliMarkActionDoneMutation, CliMarkActionDoneMutationVariables>;
export const CliDismissActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliDismissAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dismissAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliDismissActionMutation, CliDismissActionMutationVariables>;
export const CliSnoozeActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliSnoozeAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"snoozeAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliSnoozeActionMutation, CliSnoozeActionMutationVariables>;
export const CliAssignActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliAssignAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assigneeUserId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assigneeUserId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assigneeUserId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliAssignActionMutation, CliAssignActionMutationVariables>;
export const CliUpdateActionNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateActionNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateActionNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliUpdateActionNotesMutation, CliUpdateActionNotesMutationVariables>;
export const CliUpdateActionMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateActionMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateActionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliUpdateActionMetaMutation, CliUpdateActionMetaMutationVariables>;
export const CliLinkActionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliLinkAction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"target"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActionLinkTargetInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkAction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"actionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"actionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"target"},"value":{"kind":"Variable","name":{"kind":"Name","value":"target"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActionEcho"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActionEcho"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Action"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"effort"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"snoozedUntil"}},{"kind":"Field","name":{"kind":"Name","value":"assignee"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<CliLinkActionMutation, CliLinkActionMutationVariables>;
export const CliCreateGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliCreateGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}}]}}]}}]} as unknown as DocumentNode<CliCreateGoalMutation, CliCreateGoalMutationVariables>;
export const CliUpdateGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"importance"}}]}}]}}]} as unknown as DocumentNode<CliUpdateGoalMutation, CliUpdateGoalMutationVariables>;
export const CliUpdateInsightMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUpdateInsightMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateInsightInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateInsight"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<CliUpdateInsightMetaMutation, CliUpdateInsightMetaMutationVariables>;
export const CliLinkEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliLinkEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LinkEntitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linkEntities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CliLinkEntitiesMutation, CliLinkEntitiesMutationVariables>;
export const CliUnlinkEntitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliUnlinkEntities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnlinkEntitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unlinkEntities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CliUnlinkEntitiesMutation, CliUnlinkEntitiesMutationVariables>;
export const CliDeleteSignalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliDeleteSignal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSignal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<CliDeleteSignalMutation, CliDeleteSignalMutationVariables>;
export const CliCreateResearchQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CliCreateResearchQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"question"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"category"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rationale"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createResearchQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"question"},"value":{"kind":"Variable","name":{"kind":"Name","value":"question"}}},{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"category"}}},{"kind":"Argument","name":{"kind":"Name","value":"rationale"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rationale"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayId"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"sufficiencyStatus"}}]}}]}}]} as unknown as DocumentNode<CliCreateResearchQuestionMutation, CliCreateResearchQuestionMutationVariables>;