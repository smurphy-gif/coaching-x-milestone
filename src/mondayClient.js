// ─── Monday.com data layer ───────────────────────────────────────────────────
// Replaces Supabase entirely. Talks directly to Monday's GraphQL API using a
// personal API token (see .env.example). Because this token is embedded in
// the browser bundle, this is meant for a small, trusted internal team only —
// not a public-facing app. See README.md for details.
//
// Everything lives on ONE consolidated Monday board ("Coaching x Milestone"),
// organized into groups (Loan Officers, Coaching Tasks, Daily Tasks,
// Resources, Messages, Daily Log). Several columns are shared across groups
// (e.g. "Description" holds a task's description, a daily task's
// description, a resource's description, AND a message's body — whichever
// applies for that item's group) to keep the column count sane. The "Daily
// Log" group holds three different kinds of rows (Task Completion / Daily
// Check-in / Daily Metric), distinguished by the "Log Type" dropdown.

const API_URL = "https://api.monday.com/v2";
const TOKEN = import.meta.env.VITE_MONDAY_API_TOKEN;

export const BOARD = import.meta.env.VITE_MONDAY_BOARD;

// Group ids — created once when the board was set up.
export const GROUP = {
  officers: "topics",
  tasks: "group_mm5b41rs",
  dailyTasks: "group_mm5bd63",
  resources: "group_mm5b4xaz",
  messages: "group_mm5btr8h",
  dailyLog: "group_mm5br6sj",
  recaps: "group_mm5py6av",
  wins: "group_mm5qpa47",
};

// Column ids — created once when the board was set up. If you rebuild the
// board from scratch these will change; update them here to match.
const COL = {
  email: "email_mm5b23d9", phone: "phone_mm5bmzzf", team: "dropdown_mm5bq96g",
  description: "long_text_mm5bek3k", category: "dropdown_mm5bfwzm", priority: "color_mm5bf2dz",
  date: "date_mm5bq91b", resourceLink: "board_relation_mm5bqwbg", assignedOfficers: "board_relation_mm5bkqn2",
  recurring: "boolean_mm5bzke2", type: "dropdown_mm5bdtg6", fileLink: "link_mm5b3ggw",
  recipients: "board_relation_mm5b10b6", officer: "board_relation_mm5b71hd", relatedItem: "board_relation_mm5bf3ez",
  logType: "dropdown_mm5bkh8a", calls: "numeric_mm5bf85d", meetings: "numeric_mm5bt4a3",
  applications: "numeric_mm5bdg33", preapprovals: "numeric_mm5bte7", closed: "numeric_mm5bkvm6",
  notes: "long_text_mm5bd6ej", goalCalls: "numeric_mm5bwv76", goalMeetings: "numeric_mm5b8w7j",
  goalApplications: "numeric_mm5bgbs9", goalPreapprovals: "numeric_mm5bfbhp", goalClosed: "numeric_mm5bnr79",
  creditPulls: "numeric_mm5pr2q0", faceToFace: "numeric_mm5p658g", followUpCalls: "numeric_mm5p58hf", openHouses: "numeric_mm5pkkpa",
  goalCreditPulls: "numeric_mm5pv5pm", goalFaceToFace: "numeric_mm5pq582", goalFollowUpCalls: "numeric_mm5phv0b", goalOpenHouses: "numeric_mm5pmcnk",
};

const LOG_TYPE = { completion: "Task Completion", checkin: "Daily Check-in", metric: "Daily Metric" };
const DEFAULT_TEAMS = ["Purchase", "Refinance", "FHA/VA", "Jumbo", "USDA"];
const DEFAULT_GOALS = { calls: 5, meetings: 3, applications: 7, preapprovals: 2, closed: 1, creditPulls: 0, faceToFace: 1, followUpCalls: 1, openHouses: 1 };

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
query FetchAll($board:[ID!]) {
  boards(ids:$board) { items_page(limit:500) { items { id name created_at group { id }
    column_values {
      id type
      ... on EmailValue { email }
      ... on PhoneValue { phone }
      ... on DropdownValue { values { label } }
      ... on StatusValue { label }
      ... on DateValue { date }
      ... on BoardRelationValue { linked_item_ids }
      ... on CheckboxValue { checked }
      ... on LinkValue { url url_text }
      ... on LongTextValue { text }
      ... on NumbersValue { number }
    }
  } } }
}`;

export async function fetchAllData() {
  const d = await gql(FETCH_ALL_QUERY, { board: [BOARD] });
  const allItems = d.boards[0]?.items_page.items || [];
  const inGroup = (gid) => allItems.filter((it) => it.group?.id === gid);

  const officers = inGroup(GROUP.officers).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, name: it.name, avatar: mkA(it.name),
      email: c[COL.email]?.email || "",
      phone: c[COL.phone]?.phone || "",
      team: dropdownLabel(c[COL.team]) || DEFAULT_TEAMS[0],
      joinedDate: (it.created_at || "").slice(0, 10),
    };
  });

  const resources = inGroup(GROUP.resources).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      type: (dropdownLabel(c[COL.type]) || "doc").toLowerCase(),
      category: dropdownLabel(c[COL.category]) || "Sales",
      description: c[COL.description]?.text || "",
      createdAt: (it.created_at || "").slice(0, 10),
      url: c[COL.fileLink]?.url || "",
    };
  });

  const tasks = inGroup(GROUP.tasks).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      description: c[COL.description]?.text || "",
      resourceId: linkedIds(c[COL.resourceLink])[0] || "",
      assignedTo: linkedIds(c[COL.assignedOfficers]),
      dueDate: c[COL.date]?.date || "",
      priority: (c[COL.priority]?.label || "Medium").toLowerCase(),
      category: dropdownLabel(c[COL.category]) || "Sales",
    };
  });

  const dailyTasks = inGroup(GROUP.dailyTasks).map((it) => {
    const c = colMap(it);
    return {
      id: it.id, title: it.name,
      description: c[COL.description]?.text || "",
      assignedTo: linkedIds(c[COL.assignedOfficers]),
      recurring: isChecked(c[COL.recurring]),
      category: dropdownLabel(c[COL.category]) || "Sales",
      createdAt: (it.created_at || "").slice(0, 10),
    };
  });

  const messages = inGroup(GROUP.messages)
    .map((it) => {
      const c = colMap(it);
      const type = dropdownLabel(c[COL.type]) || "announcement";
      return {
        id: it.id, type, from: "Coach",
        to: linkedIds(c[COL.recipients]),
        title: type === "announcement" ? it.name : "",
        body: c[COL.description]?.text || "",
        date: c[COL.date]?.date || "",
        read: ["coach"],
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // The Daily Log group holds three kinds of rows in one place — split them
  // out by the Log Type dropdown.
  const completions = {};
  const dailyCompletions = {};
  const metricItems = [];
  for (const it of inGroup(GROUP.dailyLog)) {
    const c = colMap(it);
    const logType = dropdownLabel(c[COL.logType]);
    if (logType === LOG_TYPE.completion) {
      const officerId = linkedIds(c[COL.officer])[0];
      const taskId = linkedIds(c[COL.relatedItem])[0];
      if (!officerId || !taskId) continue;
      completions[`${officerId}-${taskId}`] = { completedAt: c[COL.date]?.date || "", notes: c[COL.notes]?.text || "", _id: it.id };
    } else if (logType === LOG_TYPE.checkin) {
      const officerId = linkedIds(c[COL.officer])[0];
      const dailyTaskId = linkedIds(c[COL.relatedItem])[0];
      const date = c[COL.date]?.date;
      if (!officerId || !dailyTaskId || !date) continue;
      dailyCompletions[`${officerId}-${dailyTaskId}-${date}`] = { done: true, notes: c[COL.notes]?.text || "", _id: it.id };
    } else if (logType === LOG_TYPE.metric) {
      metricItems.push(it);
    }
  }

  // The team-wide daily goals live on a single special "TEAM GOALS (do not
  // delete)" item within the Daily Metric rows, with Officer/Date left blank
  // so it's automatically excluded from the real metrics list below.
  const teamGoalsItem = metricItems.find((it) => /team goals/i.test(it.name));
  const gc = teamGoalsItem ? colMap(teamGoalsItem) : {};
  const goals = {
    _itemId: teamGoalsItem?.id || null,
    calls: Number(gc[COL.goalCalls]?.number ?? DEFAULT_GOALS.calls),
    meetings: Number(gc[COL.goalMeetings]?.number ?? DEFAULT_GOALS.meetings),
    applications: Number(gc[COL.goalApplications]?.number ?? DEFAULT_GOALS.applications),
    preapprovals: Number(gc[COL.goalPreapprovals]?.number ?? DEFAULT_GOALS.preapprovals),
    closed: Number(gc[COL.goalClosed]?.number ?? DEFAULT_GOALS.closed),
    creditPulls: Number(gc[COL.goalCreditPulls]?.number ?? DEFAULT_GOALS.creditPulls),
    faceToFace: Number(gc[COL.goalFaceToFace]?.number ?? DEFAULT_GOALS.faceToFace),
    followUpCalls: Number(gc[COL.goalFollowUpCalls]?.number ?? DEFAULT_GOALS.followUpCalls),
    openHouses: Number(gc[COL.goalOpenHouses]?.number ?? DEFAULT_GOALS.openHouses),
  };

  const metrics = metricItems
    .filter((it) => it.id !== teamGoalsItem?.id)
    .map((it) => {
      const c = colMap(it);
      return {
        id: it.id,
        officerId: linkedIds(c[COL.officer])[0] || "",
        date: c[COL.date]?.date || "",
        calls: Number(c[COL.calls]?.number || 0),
        meetings: Number(c[COL.meetings]?.number || 0),
        applications: Number(c[COL.applications]?.number || 0),
        preapprovals: Number(c[COL.preapprovals]?.number || 0),
        closed: Number(c[COL.closed]?.number || 0),
        creditPulls: Number(c[COL.creditPulls]?.number || 0),
        faceToFace: Number(c[COL.faceToFace]?.number || 0),
        followUpCalls: Number(c[COL.followUpCalls]?.number || 0),
        openHouses: Number(c[COL.openHouses]?.number || 0),
        notes: c[COL.notes]?.text || "",
      };
    })
    .filter((m) => m.officerId && m.date);

  const teams = Array.from(new Set([...DEFAULT_TEAMS, ...officers.map((o) => o.team)]));

  const recaps = inGroup(GROUP.recaps)
    .map((it) => {
      const c = colMap(it);
      return {
        id: it.id, title: it.name,
        officerId: linkedIds(c[COL.officer])[0] || "",
        date: c[COL.date]?.date || "",
        text: c[COL.description]?.text || "",
        meetingUrl: c[COL.fileLink]?.url || "",
        createdAt: (it.created_at || "").slice(0, 10),
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  const wins = inGroup(GROUP.wins)
    .map((it) => {
      const c = colMap(it);
      return {
        id: it.id, title: it.name,
        officerId: linkedIds(c[COL.officer])[0] || "",
        date: c[COL.date]?.date || "",
        text: c[COL.description]?.text || "",
        createdAt: (it.created_at || "").slice(0, 10),
      };
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return { officers, resources, tasks, completions, teams, dailyTasks, dailyCompletions, messages, metrics, goals, recaps, wins };
}

// ─── Mutations ────────────────────────────────────────────────────────────

async function createItem(groupId, name, columnValues, createLabelsIfMissing = false) {
  const data = await gql(
    `mutation($boardId:ID!,$groupId:String,$name:String!,$cv:JSON!,$cl:Boolean){ create_item(board_id:$boardId,group_id:$groupId,item_name:$name,column_values:$cv,create_labels_if_missing:$cl){ id } }`,
    { boardId: BOARD, groupId, name, cv: JSON.stringify(columnValues), cl: createLabelsIfMissing }
  );
  return data.create_item.id;
}

async function updateItem(itemId, columnValues, createLabelsIfMissing = false) {
  await gql(
    `mutation($boardId:ID!,$itemId:ID!,$cv:JSON!,$cl:Boolean){ change_multiple_column_values(board_id:$boardId,item_id:$itemId,column_values:$cv,create_labels_if_missing:$cl){ id } }`,
    { boardId: BOARD, itemId, cv: JSON.stringify(columnValues), cl: createLabelsIfMissing }
  );
}

async function renameItem(itemId, name) {
  await gql(
    `mutation($boardId:ID!,$itemId:ID!,$name:String!){ change_simple_column_value(board_id:$boardId,item_id:$itemId,column_id:"name",value:$name){ id } }`,
    { boardId: BOARD, itemId, name }
  );
}

async function deleteItem(itemId) {
  await gql(`mutation($itemId:ID!){ delete_item(item_id:$itemId){ id } }`, { itemId });
}

export const monday = {
  async toggleTaskCompletion(officerId, taskId, existingId) {
    if (existingId) { await deleteItem(existingId); return null; }
    return createItem(GROUP.dailyLog, `Completion — ${officerId}-${taskId}`, {
      [COL.logType]: { labels: [LOG_TYPE.completion] },
      [COL.officer]: { item_ids: [Number(officerId)] },
      [COL.relatedItem]: { item_ids: [Number(taskId)] },
      [COL.date]: { date: new Date().toISOString().slice(0, 10) },
    }, true);
  },
  async setTaskCompletionNotes(completionId, notes) {
    await updateItem(completionId, { [COL.notes]: notes });
  },
  async createTask(t) {
    return createItem(GROUP.tasks, t.title, {
      [COL.description]: t.description || "",
      [COL.category]: { labels: [t.category] },
      [COL.priority]: { label: t.priority.charAt(0).toUpperCase() + t.priority.slice(1) },
      [COL.date]: { date: t.dueDate },
      ...(t.resourceId ? { [COL.resourceLink]: { item_ids: [Number(t.resourceId)] } } : {}),
      [COL.assignedOfficers]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async updateTask(id, t) {
    await renameItem(id, t.title);
    await updateItem(id, {
      [COL.description]: t.description || "",
      [COL.category]: { labels: [t.category] },
      [COL.priority]: { label: t.priority.charAt(0).toUpperCase() + t.priority.slice(1) },
      [COL.date]: { date: t.dueDate },
      [COL.resourceLink]: { item_ids: t.resourceId ? [Number(t.resourceId)] : [] },
      [COL.assignedOfficers]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async deleteTask(id) { await deleteItem(id); },
  async createResource(r) {
    return createItem(GROUP.resources, r.title, {
      [COL.type]: { labels: [r.type] },
      [COL.category]: { labels: [r.category] },
      [COL.description]: r.description || "",
      ...(r.url ? { [COL.fileLink]: { url: r.url, text: r.url } } : {}),
    }, true);
  },
  async updateResource(id, r) {
    await renameItem(id, r.title);
    await updateItem(id, {
      [COL.type]: { labels: [r.type] },
      [COL.category]: { labels: [r.category] },
      [COL.description]: r.description || "",
      [COL.fileLink]: r.url ? { url: r.url, text: r.url } : { url: "", text: "" },
    }, true);
  },
  async deleteResource(id) { await deleteItem(id); },
  async createOfficer(o) {
    return createItem(GROUP.officers, o.name, {
      [COL.email]: { email: o.email, text: o.email },
      [COL.phone]: o.phone || "",
      [COL.team]: { labels: [o.team] },
    }, true);
  },
  async updateOfficer(id, u) {
    await renameItem(id, u.name);
    await updateItem(id, {
      [COL.email]: { email: u.email, text: u.email },
      [COL.phone]: u.phone || "",
      [COL.team]: { labels: [u.team] },
    }, true);
  },
  async deleteOfficer(id) { await deleteItem(id); },
  async createDailyTask(t) {
    return createItem(GROUP.dailyTasks, t.title, {
      [COL.description]: t.description || "",
      [COL.category]: { labels: [t.category] },
      [COL.recurring]: { checked: t.recurring ? "true" : "false" },
      [COL.assignedOfficers]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  async deleteDailyTask(id) { await deleteItem(id); },
  async updateDailyTask(id, t) {
    await renameItem(id, t.title);
    await updateItem(id, {
      [COL.description]: t.description || "",
      [COL.category]: { labels: [t.category] },
      [COL.recurring]: { checked: t.recurring ? "true" : "false" },
      [COL.assignedOfficers]: { item_ids: t.assignedTo.map(Number) },
    }, true);
  },
  // Adds a newly-created officer to every recurring daily task's assignee
  // list, so they automatically get today's (and every future day's)
  // recurring check-ins without anyone having to edit each task by hand.
  async addOfficerToRecurringDailyTasks(officerId, recurringDailyTasks) {
    await Promise.all(recurringDailyTasks.map(t =>
      updateItem(t.id, {
        [COL.assignedOfficers]: { item_ids: [...t.assignedTo.map(Number), Number(officerId)] },
      })
    ));
  },
  async toggleDailyCheckin(officerId, dailyTaskId, date, existingId) {
    if (existingId) { await deleteItem(existingId); return null; }
    return createItem(GROUP.dailyLog, `Checkin — ${officerId}-${dailyTaskId}-${date}`, {
      [COL.logType]: { labels: [LOG_TYPE.checkin] },
      [COL.officer]: { item_ids: [Number(officerId)] },
      [COL.relatedItem]: { item_ids: [Number(dailyTaskId)] },
      [COL.date]: { date },
    }, true);
  },
  async setDailyCheckinNotes(checkinId, notes) {
    await updateItem(checkinId, { [COL.notes]: notes });
  },
  async createMessage(m) {
    return createItem(GROUP.messages, m.title || (m.type === "dm" ? "Direct message" : "Announcement"), {
      [COL.type]: { labels: [m.type] },
      [COL.description]: m.body,
      [COL.date]: { date: new Date().toISOString().slice(0, 10) },
      ...(m.to?.length ? { [COL.recipients]: { item_ids: m.to.map(Number) } } : {}),
    }, true);
  },
  async createRecap(r) {
    return createItem(GROUP.recaps, r.title, {
      ...(r.officerId ? { [COL.officer]: { item_ids: [Number(r.officerId)] } } : {}),
      [COL.date]: { date: r.date },
      [COL.description]: r.text || "",
      ...(r.meetingUrl ? { [COL.fileLink]: { url: r.meetingUrl, text: r.meetingUrl } } : {}),
    }, true);
  },
  async deleteRecap(id) { await deleteItem(id); },
  async createWin(w) {
    return createItem(GROUP.wins, w.title, {
      ...(w.officerId ? { [COL.officer]: { item_ids: [Number(w.officerId)] } } : {}),
      [COL.date]: { date: w.date },
      [COL.description]: w.text || "",
    }, true);
  },
  async deleteWin(id) { await deleteItem(id); },
  // Upsert-style: pass existingId if a metrics row already exists for this
  // officer+date (caller looks this up locally), otherwise a new row is made.
  async logMetrics(existingId, officerId, date, m) {
    const cv = {
      [COL.calls]: Number(m.calls) || 0,
      [COL.meetings]: Number(m.meetings) || 0,
      [COL.applications]: Number(m.applications) || 0,
      [COL.preapprovals]: Number(m.preapprovals) || 0,
      [COL.closed]: Number(m.closed) || 0,
      [COL.creditPulls]: Number(m.creditPulls) || 0,
      [COL.faceToFace]: Number(m.faceToFace) || 0,
      [COL.followUpCalls]: Number(m.followUpCalls) || 0,
      [COL.openHouses]: Number(m.openHouses) || 0,
      [COL.notes]: m.notes || "",
    };
    if (existingId) {
      await updateItem(existingId, cv);
      return existingId;
    }
    return createItem(GROUP.dailyLog, `Metrics — ${officerId}-${date}`, {
      [COL.logType]: { labels: [LOG_TYPE.metric] },
      [COL.officer]: { item_ids: [Number(officerId)] },
      [COL.date]: { date },
      ...cv,
    }, true);
  },
  // Team-wide daily goals, stored as a single special item ("TEAM GOALS (do
  // not delete)") in the Daily Log group. Upsert-style like logMetrics: pass
  // the existing item id if there is one.
  async updateGoals(itemId, goals) {
    const cv = {
      [COL.goalCalls]: Number(goals.calls) || 0,
      [COL.goalMeetings]: Number(goals.meetings) || 0,
      [COL.goalApplications]: Number(goals.applications) || 0,
      [COL.goalPreapprovals]: Number(goals.preapprovals) || 0,
      [COL.goalClosed]: Number(goals.closed) || 0,
      [COL.goalCreditPulls]: Number(goals.creditPulls) || 0,
      [COL.goalFaceToFace]: Number(goals.faceToFace) || 0,
      [COL.goalFollowUpCalls]: Number(goals.followUpCalls) || 0,
      [COL.goalOpenHouses]: Number(goals.openHouses) || 0,
    };
    if (itemId) {
      await updateItem(itemId, cv);
      return itemId;
    }
    return createItem(GROUP.dailyLog, "TEAM GOALS (do not delete)", {
      [COL.logType]: { labels: [LOG_TYPE.metric] },
      ...cv,
    }, true);
  },
};
