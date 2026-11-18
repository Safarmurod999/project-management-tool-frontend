import type { WorkflowDetails, WorkflowTransition } from "./types";

export interface TransitionRule {
  fromStatusId: string;
  toStatusId: string;
}

/**
 * A transition as shown to users: a one-way rule, or two opposite rules
 * merged into one two-way transition.
 */
export interface TransitionGroup {
  key: string;
  forward: WorkflowTransition;
  /** The opposite rule; present only for two-way transitions */
  backward?: WorkflowTransition;
}

export const isSameRule = (a: TransitionRule, b: TransitionRule): boolean =>
  a.fromStatusId === b.fromStatusId && a.toStatusId === b.toStatusId;

export const hasRule = (
  transitions: readonly TransitionRule[],
  rule: TransitionRule,
): boolean => transitions.some((transition) => isSameRule(transition, rule));

/** Pairs each rule with its opposite, if any, keeping the original order */
export const groupTransitions = (
  transitions: readonly WorkflowTransition[],
): TransitionGroup[] => {
  const groups: TransitionGroup[] = [];
  const grouped = new Set<string>();

  for (const transition of transitions) {
    if (grouped.has(transition.id)) {
      continue;
    }

    const backward = transitions.find(
      (item) =>
        item.fromStatusId === transition.toStatusId &&
        item.toStatusId === transition.fromStatusId,
    );

    grouped.add(transition.id);
    if (backward) {
      grouped.add(backward.id);
    }

    groups.push({ key: transition.id, forward: transition, backward });
  }

  return groups;
};

/**
 * Mirrors the backend's card status check. Without a workflow the project is
 * unrestricted; otherwise the target status must be part of the workflow, and
 * a status change needs a `fromStatusId -> toStatusId` rule.
 */
export const isTransitionAllowed = (
  workflow: WorkflowDetails | null | undefined,
  fromStatusId: string | undefined,
  toStatusId: string,
): boolean => {
  if (!workflow) {
    return true;
  }

  if (!workflow.statuses.some((status) => status.id === toStatusId)) {
    return false;
  }

  return (
    !fromStatusId ||
    fromStatusId === toStatusId ||
    hasRule(workflow.transitions, { fromStatusId, toStatusId })
  );
};
