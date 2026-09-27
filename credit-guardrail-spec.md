# Credit Guardrail Spec: Max 3 Credits per Request

## Objective

Ensure the system never spends more than 3 credits for any single user request while maintaining a total operating budget of approximately 1500 credits.

This spec defines the enforcement policy, billing model, execution flow, rejection conditions, and observability needed to keep each request under the hard cap.

---

## 1. Goal

The application must enforce the following rule:

- Hard cap: 3 credits maximum per request.
- Global cap: total spend must remain within the configured account budget (default: 1500 credits).
- Predictability: each request must be planned and tracked before execution.
- Safe failure: when a request cannot be completed within budget, it must be rejected or downgraded gracefully.

---

## 2. Scope

This guardrail applies to all request types including:

- text generation
- tool calls
- retrieval and search
- code inspection or editing
- multi-step orchestration
- retries and validation steps

It applies to both:

- direct user asks
- agentic multi-step workflows

---

## 3. Definitions

- Request: one user-triggered action from intake to final response.
- Credit: the cost unit assigned to a model call, tool invocation, retrieval step, validation step, or retry.
- Budget: the configured max remaining credits for the account.
- Hard cap: the fixed maximum spend allowed for a single request, set to 3.
- Planned budget: estimated credits before execution begins.
- Actual spend: final credits consumed during execution.

---

## 4. Core Policy

### 4.1 Fixed per-request cap

For every request, the system must authorize spend using this formula:

- authorized_request_budget = min(3, remaining_account_budget)

If remaining_account_budget < 3, then the system must reduce the allowed request budget to remaining_account_budget or reject the request entirely.

### 4.2 No overspend

The system may never exceed 3 credits for a request under any circumstance.

This includes:

- model completion costs
- tool execution costs
- retrieval operations
- retry costs
- validation passes
- follow-up prompts caused by failures

### 4.3 Budget is inclusive

Every step of execution counts against the request budget, even if the step is internal and not visible to the user.

Examples:

- first model call: 1.0 credit
- retrieval call: 0.5 credit
- second model pass: 1.0 credit
- validation tool: 0.5 credit
- retry after failure: 1.0 credit

Total must remain <= 3.0.

---

## 5. Request Execution Rules

### 5.1 Planning phase

Before execution, the orchestrator must estimate the request's cost across the likely workflow.

The planner must classify the request into one of these buckets:

- lightweight: <= 1 credit
- standard: 1-2 credits
- complex: 2-3 credits
- over-budget: > 3 credits

### 5.2 Reject before executing

If the estimated cost is greater than 3, the request must be rejected or reduced in scope.

Example response:

> This request exceeds the current per-request limit of 3 credits. Please narrow the scope or break the task into smaller requests.

### 5.3 Stop at threshold

Once cumulative spend reaches 3 credits, the system immediately stops processing and returns a partial result or a budget-exceeded response.

It must not continue with additional turns, retries, or searches unless the user explicitly approves a new request with a fresh budget.

### 5.4 Retry policy

Retries are allowed only if they remain within the remaining budget and they are directly tied to a recoverable failure.

Rules:

- maximum one retry per request by default
- no retry if remaining budget < 1
- retries must be logged and counted explicitly

### 5.5 Model routing

Use the lowest-cost model suitable for the task when possible. The system should prefer:

- lightweight model for direct Q&A or simple classification
- narrow retrieval before broad reasoning
- single-pass execution over multi-pass loops

---

## 6. Enforcement Architecture

### 6.1 Components

1. Request Intake
   - receives the user task
   - computes metadata like task type, expected steps, and scope

2. Cost Estimator
   - predicts likely credit usage before execution
   - returns an estimated cost range and confidence

3. Budget Ledger
   - tracks remaining account credits
   - tracks request-level credit consumption

4. Execution Guardrail
   - compares estimates and live spend against the hard cap
   - blocks execution when the threshold is reached

5. Response Composer
   - returns either a completed answer, a partial answer, or a rejection with guidance

### 6.2 Required behavior

The system must maintain a request-scoped ledger like:

- request_id
- user_id
- initial_budget
- remaining_budget
- spent_credits
- step_log
- status: allowed | rejected | completed | partial | budget_exceeded

---

## 7. Credit Accounting Rules

Every cost item must be assigned to a request and written to the ledger.

Suggested default weights:

- simple model generation: 1.0
- structured tool call: 0.5
- retrieval/search: 0.5 to 1.0
- code read or inspection: 0.5
- validation or verification: 0.5
- retry after failure: 0.5 to 1.0

The system may use fine-grained weights, but the total must always be constrained by the hard cap.

---

## 8. Hard Rejection Scenarios

The system must reject a request when:

- estimated cost > 3
- remaining account budget < 1
- request requires unlimited or unbounded exploration
- repeated retries would exceed the cap
- the task is ambiguous and would require more than one round of clarification to complete

The rejection flow should be deterministic and user-friendly.

---

## 9. Example Decision Matrix

| Request Type | Estimated Cost | Decision |
| --- | ---: | --- |
| simple factual question | 0.5 - 1.0 | allow |
| summarization of one document | 1.0 - 2.0 | allow |
| code fix with 2 reads and 1 validation | 2.0 - 3.0 | allow if within cap |
| large multi-file refactor | > 3.0 | reject or split into smaller tasks |
| request requiring multiple retries | > 3.0 | reject or require fresh request |

---

## 10. User Experience Rules

The system should communicate budget status early and clearly.

Examples:

- at 2.0 credits: “This request is approaching budget limits.”
- at 2.5 credits: “Only 0.5 credits remain.”
- at 3.0 credits: “Budget reached; finalizing without additional processing.”

When a request is rejected due to cap limits, the response should recommend one of the following:

- narrow the task
- split into smaller requests
- ask for a lower-scope answer

---

## 11. Acceptance Criteria

The implementation is acceptable only if all of the following are true:

1. No request can exceed 3 credits.
2. All credits are logged per request and per step.
3. The system blocks or rejects over-budget requests before execution begins.
4. The system stops processing as soon as the cap is reached.
5. Retry behavior is bounded and does not exceed the allowed budget.
6. User-facing responses explain the budget limit and next steps when rejected.
7. Remaining account budget is checked before execution and before each additional step.

---

## 12. Minimal Pseudocode

```pseudo
function handleRequest(request):
    remaining = getRemainingAccountBudget()
    if remaining <= 0:
        return reject("Account budget exhausted")

    maxRequestBudget = min(3, remaining)
    estimate = estimateRequestCost(request)

    if estimate > maxRequestBudget:
        return reject("This request exceeds the 3-credit per-request cap")

    ledger = createRequestLedger(request.id, maxRequestBudget)
    while true:
        stepCost = getStepCostEstimate()
        if ledger.spent + stepCost > maxRequestBudget:
            ledger.status = "budget_exceeded"
            return partialOrReject(ledger)

        executeStep(request)
        ledger.spent += stepCost
        ledger.logStep(stepCost)

        if taskComplete(request):
            ledger.status = "completed"
            return respond(ledger)

        if stepLimitReached(request):
            ledger.status = "partial"
            return respondWithPartialResult(ledger)
```

---

## 13. Operational Notes

- This guardrail should be enforced at both the orchestration layer and the execution layer.
- The client-facing logic should not rely only on model behavior; it must be enforced programmatically.
- The system should emit telemetry for:
  - rejected requests
  - near-limit requests
  - partial completions from budget exhaustion
  - retry usage

---

## 14. Recommended Policy Summary

Use this as the final production rule:

- Max request spend: 3 credits
- Max retry spend: only if remaining budget allows it
- Avoid broad tasks without a scoped estimate
- Reject over-budget requests before execution
- Always enforce the cap at runtime, not just in planning

This is the simplest and safest guardrail for a limited credit budget such as 1500 total credits.
