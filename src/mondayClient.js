// ─── Monday.com data layer ───────────────────────────────────────────────────
// Replaces Supabase entirely. Talks directly to Monday's GraphQL API using a
// personal API token (see .env.example). Because this token is embedded in
// the browser bundle, this is meant for a small, trusted internal team only —
// not a public-facing app. See README.md for details.

const API_URL = "https://api.monday.com/v2";
const TOKEN = import.meta.env.VITE_MONDAY_API_TOKEN;

export const BOARDS = {
  officers: import.meta.env.VITE_MONDAY_BOARD_OFFICERS,
  tasks: import.meta.env.VITE_MONDAY_BOARD_TASKS,
  taskCompletions: import.meta.env.VITE_MONDAY_BOARD_TASK_COMPLETIONS,
  dailyTasks: import.meta.env.VITE_MONDAY_BOARD_DAILY_TASKS,
  dailyCheckins: import.meta.env.VITE_MONDAY_BOARD_DAILY_CHECKINS,
  resources: import.meta.env.VITE_MONDAY_BOARD_RESOURCES,
  messages: import.meta.env.VITE_MONDAY_BOARD_MESSAGES,
  metrics: import.meta.env.VITE_MONDAY_BOARD_METRICS,
};

// Column ids — created once when the boards were set up. If you rebuild the
// boards from scratch these will change; update them here to match.
const COL = {
  officer: { email: "email_mm4wq2mq", phone: "phone_mm4w3e1c", team: "dropdown_mm4wp6r6" },
  task: {
    desc: "long_text_mm4wdft9", category: "dropdown_mm4w5s33", priority: "color_mm4wx1nm",
    due: "date_mm4wr0gp", resource: "board_relation_mm4wvbzh", assigned: "board_relation_mm4w7mjd",
  },
  completion: { officer: "board_relation_mm4wn6vc", task: "board_relation_mm4w5ejz", date: "date_mm4we0jx", notes: "long_text_mm4w63kq" },
  dailyTask: { desc: "long_text_mm4wj5a5", category: "dropdown_mm4wwmsf", recurring: "boolean_mm4wvhbv", assigned: "board_relation_mm4wsnd2" },
  checkin: { officer: "board_relation_mm4wvq8k", dailyTask: "board_relation_mm4wcz7g", date: "date_mm4wafqn", notes: "long_text_mm4wkqjd" },
  resource: { type: "dropdown_mm4w29v6", category: "dropdown_mm4wendj", desc: "long_text_mm4wep10", link: "link_mm4w7bmx" },
  message: { type: "dropdown_mm4wz3z0", body: "long_text_mm4wtzqt", date: "date_mm4wk56f", recipients: "board_relation_mm4w5hyb" },
  metric: {
    officer: "board_relation_mm51sfr", date: "date_mm515a0f", calls: "numeric_mm5154m8", meetings: "numeric_mm51j3tz",
    applications: "numeric_mm51nn1r", preapprovals: "numeric_mm515vkn", closed: "numeric_mm51q9kw", notes: "long_text_mm51y86",
  },
};

const DEFAULT_TEAMS = ["Purchase", "Refinance", "FHA/VA", "Jumbo", "USDA"];

async function gql(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: TOKEN,
      "API-Version": "2024-10",
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

const mkA = (n) => (n || "").split(" ").map((w) => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2);
const colMap = (item) => { const m = {}; for (const cv of item.column_values) m[cv.id] = cv; return m; };
const dropdownLabel = (cv) => cv?.values?.[0]?.label || "";
const linkedIds = (cv) => (cv?.linked_item_ids || []).map(String);
const isChecked = (cv) => cv?.checked === "true" || cv?.checked === true;

const FETCH_ALL_QUERY = `
query FetchAll($officersBoard:[ID!],$tasksBoard:[ID!],$completionsBoard:[ID!],$dailyTasksBoard:[ID!],$checkinsBoard:[ID!],$resourcesBoard:[ID!],$messagesBoard:[ID!],$metricsBoard:[ID!]) {
  officers: boards(ids:$officersBoard) { items_page(limit:500) { items { id name created_at column_values {
    id type
    ... on EmailValue { email }
    ... on PhoneValue { phone }
    ... on DropdownValue { values { label } }
  } } } }
  resources: boards(ids:$resourcesBoard) { items_page(limit:500) { items { id name created_at column_values {
    id type
    ... on DropdownValue { values { label } }
    ... on LongTextValue { text }
    ... on LinkValue { url url_text }
  } } } }
  tasks: boards(ids:$tasksBoard) { items_page(limit:500) { items { id name created_at column_values {
    id type
    ... on LongTextValue { text }
    ... on DropdownValue { values { label } }
    ... on StatusValue { label }
    ... on DateValue { date }
    ... on BoardRelationValue { linked_item_ids }
  } } } }
  completions: boards(ids:$completionsBoard) { items_page(limit:500) { items { id name column_values {
    id type
    ... on BoardRelationValue { linked_item_ids }
    ... on DateValue { date }
    ... on LongTextValue { text }
  } } } }
  dailyTasks: boards(ids:$dailyTasksBoard) { items_page(limit:500) { items { id name created_at column_values {
    id type
    ... on LongTextValue { text }
    ... on DropdownValue { values { label } }
    ... on CheckboxValue { checked }
    ... on BoardRelationValue { linked_item_ids }
  } } } }
  checkins: boards(ids:$checkinsBoard) { items_page(limit:500) { items { id name column_values {
    id type
    ... on BoardRelationValue { linked_item_ids }
    ... on DateValue { date }
    ... on LongTextValue { text }
  } } } }
  messages: boards(ids:$messagesBoard) { items_page(limit:500) { items { id name column_values {
    id type
    ... on DropdownValue { values { label } }
    ... on LongTextValue { text }
    ... on DateValue { date }
    ... on BoardRelationValue { linked_item_ids }
  } } } }
  metrics: boards(ids:$metricsBoard) { items_page(limit:500) { items { id name column_values {
    id type
    ... on BoardRelationValue { linked_item_ids }
    ... on DateValue { date }
    ... on NumbersValue { number }
    ... on LongTextValue { text }
  } } } }
}`;

export async function fetchAllData() {
  const d = await gql(FETCH_ALL_QUERY, {
    officersBoard: [BOARDS.officers], tasksBoard: [BOARDS.tasks], completionsBoard: [BOARDS.taskCompletions],
    dailyTasksBoard: [BOARDS.dailyTasks], checkinsBoard: [BOARDS.dailyCheckins], resourcesBoard: [BOARDS.resources], messagesBoard: [BOARDS.messages],
    // Falls back to a board we know exists if VITE_MONDAY_BOARD_METRICS isn't
    // set yet (e.g. right after a deploy, before the env var is added) — a
    // missing/null ID here would hard-fail the entire query, breaking every
    // page, not just Activity. The metrics mapping below only keeps rows
    // that actually have an officer + date, so a mismatched fallback board
    // just yields an empty metrics list instead of crashing the app.
    metricsBoard: [BOARDS.metrics || BOARDS.officers],
  });

  const officers = (d.officers[0]?.items_page.items || []).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, name: it.name, avatar: mkA(it.name),
      email: c[COL.officer.email]?.email || "",
      phone: c[COL.officer.phone]?.phone || "",
      team: dropdownLabel(c[COL.officer.team]) || DEFAULT_TEAMS[0],
      joinedDate: (it.created_at || "").slice(0, 10),
    };
  });

  const resources = (d.resources[0]?.items_page.items || []).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      type: (dropdownLabel(c[COL.resource.type]) || "doc").toLowerCase(),
      category: dropdownLabel(c[COL.resource.category]) || "Sales",
      description: c[COL.resource.desc]?.text || "",
      createdAt: (it.created_at || "").slice(0, 10),
      url: c[COL.resource.link]?.url || "",
    };
  });

  const tasks = (d.tasks[0]?.items_page.items || []).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      description: c[COL.task.desc]?.text || "",
      resourceId: linkedIds(c[COL.task.resource])[0] || "",
      assignedTo: linkedIds(c[COL.task.assigned]),
      dueDate: c[COL.task.due]?.date || "",
      priority: (c[COL.task.priority]?.label || "Medium").toLowerCase(),
      category: dropdownLabel(c[COL.task.category]) || "Sales",
    };
  });

  const completions = {};
  for (const it of d.completions[0]?.items_page.items || []) {
    const c = colMap(it);
    const officerId = linkedIds(c[COL.completion.officer])[0];
    const taskId = linkedIds(c[COL.completion.task])[0];
    if (!officerId || !taskId) continue;
    completions[`${officerId}-${taskId}`] = { completedAt: c[COL.completion.date]?.date || "", notes: c[COL.completion.notes]?.text || "", _id: it.id };
  }

  const dailyTasks = (d.dailyTasks[0]?.items_page.items || []).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      description: c[COL.dailyTask.desc]?.text || "",
      assignedTo: linkedIds(c[COL.dailyTask.assigned]),
      recurring: isChecked(c[COL.dailyTask.recurring]),
      category: dropdownLabel(c[COL.dailyTask.category]) || "Sales",
      createdAt: (it.created_at || "").slice(0, 10),
    };
  });

  const dailyCompletions = {};
  for (const it of d.checkins[0]?.items_page.items || []) {
    const c = colMap(it);
    const officerId = linkedIds(c[COL.checkin.officer])[0];
    const dailyTaskId = linkedIds(c[COL.checkin.dailyTask])[0];
    const date = c[COL.checkin.date]?.date;
    if (!officerId || !dailyTaskId || !date) continue;
    dailyCompletions[`${officerId}-${dailyTaskId}-${date}`] = { done: true, notes: c[COL.checkin.notes]?.text || "", _id: it.id };
  }

  const messages = (d.messages[0]?.items_page.items || [])
    .map((it) => {
      const c = colMap(it);
      const type = dropdownLabel(c[COL.message.type]) || "announcement";
      return {
        id: it.id, type, from: "Coach",
        to: linkedIds(c[COL.message.recipients]),
        title: type === "announcement" ? it.name : "",
        body: c[COL.message.body]?.text || "",
        date: c[COL.message.date]?.date || "",
        read: ["coach"],
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const metrics = (d.metrics[0]?.items_page.items || []).map((it) => {
    const c = colMap(it);
    return {
      id: it.id,
      officerId: linkedIds(c[COL.metric.officer])[0] || "",
      date: c[COL.metric.date]?.date || "",
      calls: Number(c[COL.metric.calls]?.number || 0),
      meetings: Number(c[COL.metric.meetings]?.number || 0),
      applications: Number(c[COL.metric.applications]?.number || 0),
      preapprovals: Number(c[COL.metric.preapprovals]?.number || 0),
      closed: Number(c[COL.metric.closed]?.number || 0),
      notes: c[COL.metric.notes]?.text || "",
    };
  }).filter((m) => m.officerId && m.date);

  const teams = Array.from(new Set([...DEFAULT_TEAMS, ...officers.map((o) => o.team)]));

  return { officers, resources, tasks, completions, teams, dailyTasks, dailyCompletions, messages, metrics };
}

// ─── Mutations ────────────────────────────────────────────────────────────

async function createItem(boardId, name, columnValues, createLabelsIfMissing = false) {
  const data = await gql(
    `mutation($boardId:ID!,$name:String!,$cv:JSON!,$cl:Boolean){ create_item(board_id:$boardId,item_name:$name,column_values:$cv,create_labels_if_missing:$cl){ id } }`,
    { boardId, name, cv: JSON.stringify(columnValues), cl: createLabelsIfMissing }
  );
  return data.create_item.id;
}

async function updateItem(boardId, itemId, columnValues, createLabelsIfMissing = false) {
  await gql(
    `mutation($boardId:ID!,$itemId:ID!,$cv:JSON!,$cl:Boolean){ change_multiple_column_values(board_id:$boardId,item_id:$itemId,column_values:$cv,create_labels_if_missing:$cl){ id } }`,
    { boardId, itemId, cv: JSON.stringify(columnValues), cl: createLabelsIfMissing }
  );
}

async function renameItem(boardId, itemId, name) {
  await gql(
    `mutation($boardId:ID!,$itemId:ID!,$name:String!){ change_simple_column_value(board_id:$boardId,item_id:$itemId,column_id:"name",value:$name){ id } }`,
    { boardId, itemId, name }
  );
}

async function deleteItem(itemId) {
  await gql(`mutation($itemId:ID!){ delete_item(item_id:$itemId){ id } }`, { itemId });
}

export const monday = {
  async toggleTaskCompletion(officerId, taskId, existingId) {
    if (existingId) { await deleteItem(existingId); return null; }
    return createItem(BOARDS.taskCompletions, `Completion — ${officerId}-${taskId}`, {
      [COL.completion.officer]: { item_ids: [Number(officerId)] },
      [COL.completion.task]: { item_ids: [Number(taskId)] },
      [COL.completion.date]: { date: new Date().toISOString().slice(0, 10) },
    });
  },
  async setTaskCompletionNotes(completionId, notes) {
    await updateItem(BOARDS.taskCompletions, completionId, { [COL.completion.notes]: notes });
  },
  async createTask(t) {
    return createItem(BOARDS.tasks, t.title, {
      [COL.task.desc]: t.description || "",
      [COL.task.category]: { labels: [t.category] },
      [COL.task.priority]: { label: t.priority.charAt(0).toUpperCase() + t.priority.slice(1) },
      [COL.task.due]: { date: t.dueDate },
      ...(t.resourceId ? { [COL.task.resource]: { item_ids: [Number(t.resourceId)] } } : {}),
      [COL.task.assigned]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async updateTask(id, t) {
    await renameItem(BOARDS.tasks, id, t.title);
    await updateItem(BOARDS.tasks, id, {
      [COL.task.desc]: t.description || "",
      [COL.task.category]: { labels: [t.category] },
      [COL.task.priority]: { label: t.priority.charAt(0).toUpperCase() + t.priority.slice(1) },
      [COL.task.due]: { date: t.dueDate },
      [COL.task.resource]: { item_ids: t.resourceId ? [Number(t.resourceId)] : [] },
      [COL.task.assigned]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async deleteTask(id) { await deleteItem(id); },
  async createResource(r) {
    return createItem(BOARDS.resources, r.title, {
      [COL.resource.type]: { labels: [r.type] },
      [COL.resource.category]: { labels: [r.category] },
      [COL.resource.desc]: r.description || "",
      ...(r.url ? { [COL.resource.link]: { url: r.url, text: r.url } } : {}),
    }, true);
  },
  async createOfficer(o) {
    return createItem(BOARDS.officers, o.name, {
      [COL.officer.email]: { email: o.email, text: o.email },
      [COL.officer.phone]: o.phone || "",
      [COL.officer.team]: { labels: [o.team] },
    }, true);
  },
  async updateOfficer(id, u) {
    await renameItem(BOARDS.officers, id, u.name);
    await updateItem(BOARDS.officers, id, {
      [COL.officer.email]: { email: u.email, text: u.email },
      [COL.officer.phone]: u.phone || "",
      [COL.officer.team]: { labels: [u.team] },
    }, true);
  },
  async deleteOfficer(id) { await deleteItem(id); },
  async createDailyTask(t) {
    return createItem(BOARDS.dailyTasks, t.title, {
      [COL.dailyTask.desc]: t.description || "",
      [COL.dailyTask.category]: { labels: [t.category] },
      [COL.dailyTask.recurring]: { checked: t.recurring ? "true" : "false" },
      [COL.dailyTask.assigned]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async deleteDailyTask(id) { await deleteItem(id); },
  async updateDailyTask(id, t) {
    await renameItem(BOARDS.dailyTasks, id, t.title);
    await updateItem(BOARDS.dailyTasks, id, {
      [COL.dailyTask.desc]: t.description || "",
      [COL.dailyTask.category]: { labels: [t.category] },
      [COL.dailyTask.recurring]: { checked: t.recurring ? "true" : "false" },
      [COL.dailyTask.assigned]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  // Adds a newly-created officer to every recurring daily task's assignee
  // list, so they automatically get today's (and every future day's)
  // recurring check-ins without anyone having to edit each task by hand.
  async addOfficerToRecurringDailyTasks(officerId, recurringDailyTasks) {
    await Promise.all(recurringDailyTasks.map(t =>
      updateItem(BOARDS.dailyTasks, t.id, {
        [COL.dailyTask.assigned]: { item_ids: [...t.assignedTo.map(Number), Number(officerId)] },
      })
    ));
  },
  async toggleDailyCheckin(officerId, dailyTaskId, date, existingId) {
    if (existingId) { await deleteItem(existingId); return null; }
    return createItem(BOARDS.dailyCheckins, `Checkin — ${officerId}-${dailyTaskId}-${date}`, {
      [COL.checkin.officer]: { item_ids: [Number(officerId)] },
      [COL.checkin.dailyTask]: { item_ids: [Number(dailyTaskId)] },
      [COL.checkin.date]: { date },
    });
  },
  async setDailyCheckinNotes(checkinId, notes) {
    await updateItem(BOARDS.dailyCheckins, checkinId, { [COL.checkin.notes]: notes });
  },
  async createMessage(m) {
    return createItem(BOARDS.messages, m.title || (m.type === "dm" ? "Direct message" : "Announcement"), {
      [COL.message.type]: { labels: [m.type] },
      [COL.message.body]: m.body,
      [COL.message.date]: { date: new Date().toISOString().slice(0, 10) },
      ...(m.to?.length ? { [COL.message.recipients]: { item_ids: m.to.map(Number) } } : {}),
    }, true);
  },
  // Upsert-style: pass existingId if a metrics row already exists for this
  // officer+date (caller looks this up locally), otherwise a new row is made.
  async logMetrics(existingId, officerId, date, m) {
    const cv = {
      [COL.metric.calls]: Number(m.calls) || 0,
      [COL.metric.meetings]: Number(m.meetings) || 0,
      [COL.metric.applications]: Number(m.applications) || 0,
      [COL.metric.preapprovals]: Number(m.preapprovals) || 0,
      [COL.metric.closed]: Number(m.closed) || 0,
      [COL.metric.notes]: m.notes || "",
    };
    if (existingId) {
      await updateItem(BOARDS.metrics, existingId, cv);
      return existingId;
    }
    return createItem(BOARDS.metrics, `Metrics — ${officerId}-${date}`, {
      [COL.metric.officer]: { item_ids: [Number(officerId)] },
      [COL.metric.date]: { date },
      ...cv,
    });
  },
};
