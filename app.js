const STORAGE_KEY = "gymtracker:v1";

const seedData = {
  version: 1,
  routines: [
    {
      id: "routine_push",
      name: "Push Routine",
      days: [
        { id: "push_day1", name: "Day 1 – Push", meta: "Chest, Shoulders, Triceps", exercises: [
          { id: "barbell_bench_press_flat", name: "Barbell Bench Press", videoUrl: "" },
          { id: "incline_dumbbell_press", name: "Incline Dumbbell Press", videoUrl: "" },
          { id: "dumbbell_rear_delt_flyes", name: "Rear Delt Flyes", videoUrl: "" },
          { id: "dumbbell_shoulder_press", name: "Dumbbell Shoulder Press", videoUrl: "" },
          { id: "triceps_cable_pushdown", name: "Triceps Pushdown", videoUrl: "" },
          { id: "triceps_overhead_extension", name: "Overhead Triceps Extension", videoUrl: "" }
        ]},
        { id: "push_day2", name: "Day 2 – Push", meta: "Chest, Shoulders, Triceps", exercises: [
          { id: "incline_barbell_press", name: "Incline Barbell Press", videoUrl: "" },
          { id: "dumbbell_bench_press_flat", name: "Dumbbell Bench Press", videoUrl: "" },
          { id: "dumbbell_kickback", name: "Dumbbell Kickback", videoUrl: "" },
          { id: "barbell_skull_crusher", name: "Skull Crusher", videoUrl: "" },
          { id: "dumbbell_upright_row", name: "Upright Row", videoUrl: "" },
          { id: "dumbbell_front_raise", name: "Front Raise", videoUrl: "" }
        ]},
        { id: "push_day3", name: "Day 3 – Push", meta: "Shoulders + Chest + Triceps", exercises: [
          { id: "dumbbell_lateral_raises", name: "Lateral Raises", videoUrl: "" },
          { id: "barbell_military_press", name: "Barbell Military Press", videoUrl: "" },
          { id: "cable_chest_fly_mid_low", name: "Cable Chest Fly", videoUrl: "" },
          { id: "decline_dumbbell_press", name: "Decline Dumbbell Press", videoUrl: "" },
          { id: "cross_body_cable_triceps_extension", name: "Cross-Body Triceps Ext.", videoUrl: "" },
          { id: "cable_overhead_triceps_extension_rope", name: "Overhead Rope Extension", videoUrl: "" }
        ]}
      ]
    },
    {
      id: "routine_pull",
      name: "Pull Routine",
      days: [
        { id: "pull_day1", name: "Day 1 – Pull", meta: "Back, Rear Delts, Biceps", exercises: [
          { id: "barbell_deadlift", name: "Barbell Deadlift", videoUrl: "" },
          { id: "bent_over_rows", name: "Bent Over Rows", videoUrl: "" },
          { id: "dumbbell_shrugs", name: "Dumbbell Shrugs", videoUrl: "" },
          { id: "barbell_curl", name: "Barbell Curl", videoUrl: "" },
          { id: "hammer_curl", name: "Hammer Curl", videoUrl: "" },
          { id: "behind_the_back_cable_wrist_curl", name: "Behind-Back Wrist Curl", videoUrl: "" }
        ]},
        { id: "pull_day2", name: "Day 2 – Pull", meta: "Back + Biceps + Forearms", exercises: [
          { id: "lat_pulldown", name: "Lat Pulldown", videoUrl: "" },
          { id: "barbell_t_bar_row", name: "T-Bar Row", videoUrl: "" },
          { id: "reverse_dumbbell_fly", name: "Reverse Dumbbell Fly", videoUrl: "" },
          { id: "preacher_curl", name: "Preacher Curl", videoUrl: "" },
          { id: "incline_dumbbell_curl", name: "Incline Dumbbell Curl", videoUrl: "" },
          { id: "barbell_reverse_wrist_curl_bench", name: "Reverse Wrist Curl", videoUrl: "" }
        ]},
        { id: "pull_day3", name: "Day 3 – Pull", meta: "Back + Arms", exercises: [
          { id: "seated_cable_rows", name: "Seated Cable Rows", videoUrl: "" },
          { id: "dumbbell_pullover", name: "Dumbbell Pullover", videoUrl: "" },
          { id: "barbell_upright_row_wide_grip", name: "Upright Row (Wide)", videoUrl: "" },
          { id: "reverse_barbell_curl", name: "Reverse Barbell Curl", videoUrl: "" },
          { id: "dumbbell_concentration_curl", name: "Concentration Curl", videoUrl: "" },
          { id: "cable_high_curl_face_away", name: "Cable High Curl", videoUrl: "" }
        ]}
      ]
    },
    {
      id: "routine_legs",
      name: "Leg Routine",
      days: [
        { id: "legs_day", name: "Day – Legs", meta: "Quads, Glutes, Hamstrings", exercises: [
          { id: "barbell_squat", name: "Barbell Squat", videoUrl: "" },
          { id: "leg_press", name: "Leg Press", videoUrl: "" },
          { id: "abductor_extension", name: "Abductor Extension", videoUrl: "" },
          { id: "adductor_clamp", name: "Adductor Clamp", videoUrl: "" },
          { id: "leg_extension", name: "Leg Extension", videoUrl: "" },
          { id: "hamstring_curl", name: "Hamstring Curl", videoUrl: "" },
          { id: "seated_calf_raise", name: "Seated Calf Raise", videoUrl: "" },
          { id: "standing_calf_raise", name: "Standing Calf Raise", videoUrl: "" }
        ]}
      ]
    }
  ]
};

function nowISODate(){
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0,10);
}
function uid(prefix="id"){ return prefix+"_"+Math.random().toString(16).slice(2)+"_"+Date.now().toString(16); }
function safeNum(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function ytSearchUrl(name){
  const q = encodeURIComponent(name + " proper form tutorial");
  return "https://www.youtube.com/results?search_query=" + q;
}
function setStatus(msg){
  const el = document.getElementById("statusText");
  if(el) el.textContent = msg;
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return {routines: seedData.routines, logs: [], sessions: []};
    const st = JSON.parse(raw);
    if(!Array.isArray(st.routines) || st.routines.length===0) st.routines = seedData.routines;
    if(!Array.isArray(st.logs)) st.logs = [];
    if(!Array.isArray(st.sessions)) st.sessions = [];
    return st;
  }catch{
    return {routines: seedData.routines, logs: [], sessions: []};
  }
}
function saveState(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

let state = loadState();

// UI refs
const els = {
  tabs: Array.from(document.querySelectorAll(".tab")),
  panels: {
    workout: document.getElementById("panel-workout"),
    history: document.getElementById("panel-history"),
    stats: document.getElementById("panel-stats")
  },
  routineSelect: document.getElementById("routineSelect"),
  dayList: document.getElementById("dayList"),
  activeWorkout: document.getElementById("activeWorkout"),
  activeTitle: document.getElementById("activeTitle"),
  activeMeta: document.getElementById("activeMeta"),
  exerciseList: document.getElementById("exerciseList"),
  searchBox: document.getElementById("searchBox"),
  workoutDate: document.getElementById("workoutDate"),
  btnAddExercise: document.getElementById("btnAddExercise"),
  btnFinishWorkout: document.getElementById("btnFinishWorkout"),
  btnExport: document.getElementById("btnExport"),
  fileImport: document.getElementById("fileImport"),
  btnInstall: document.getElementById("btnInstall"),
  timerCard: document.getElementById("timerCard"),
  timerValue: document.getElementById("timerValue"),

  historyView: document.getElementById("historyView"),
  historyList: document.getElementById("historyList"),
  historyDetail: document.getElementById("historyDetail"),
  btnBackHistory: document.getElementById("btnBackHistory"),
  historyDetailTitle: document.getElementById("historyDetailTitle"),
  historyDetailSub: document.getElementById("historyDetailSub"),
  historyDetailDayName: document.getElementById("historyDetailDayName"),
  historyDetailSummary: document.getElementById("historyDetailSummary"),
  historyDetailExercises: document.getElementById("historyDetailExercises"),

  statWorkouts: document.getElementById("statWorkouts"),
  statSets: document.getElementById("statSets"),
  statVolume: document.getElementById("statVolume"),
  statHours: document.getElementById("statHours"),
  recentActivity: document.getElementById("recentActivity")
};

let currentDate = nowISODate();
if(els.workoutDate) els.workoutDate.value = currentDate;

let currentRoutineId = state.routines[0]?.id || "";
let active = { isRunning:false, routineId:"", dayId:"", startedAt:0 };
let filterText = "";

// -------- Tabs ----------
els.tabs.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    els.tabs.forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    const t = btn.dataset.tab;
    Object.values(els.panels).forEach(p=>p.classList.remove("active"));
    els.panels[t].classList.add("active");
    if(t==="history"){ showHistoryList(); renderHistory(); }
    if(t==="stats") renderStats();
  });
});

// -------- Data helpers ----------
function getRoutine(rid){ return state.routines.find(r=>r.id===rid); }
function getDay(r, did){ return r.days.find(d=>d.id===did); }

function logsFor(date, routineId, dayId, exerciseId){
  return state.logs
    .filter(l => l.date===date && l.routineId===routineId && l.dayId===dayId && l.exerciseId===exerciseId)
    .sort((a,b)=> (a.setNo||0)-(b.setNo||0) || (a.createdAt||0)-(b.createdAt||0));
}
function logsForSession(date, routineId, dayId){
  return state.logs
    .filter(l => l.date===date && l.routineId===routineId && l.dayId===dayId)
    .slice()
    .sort((a,b)=> (a.createdAt||0)-(b.createdAt||0));
}
function totalVolumeForSession(date, routineId, dayId){
  return logsForSession(date, routineId, dayId)
    .reduce((s,l)=> s + (Number(l.reps||0)*Number(l.weight||0)), 0);
}
function totalSetsForSession(date, routineId, dayId){
  return logsForSession(date, routineId, dayId).length;
}

// -------- Timer ----------
let timerTick = null;
function fmtTime(ms){
  const s = Math.floor(ms/1000);
  const hh = String(Math.floor(s/3600)).padStart(2,"0");
  const mm = String(Math.floor((s%3600)/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${hh}:${mm}:${ss}`;
}
function startTimer(){
  els.timerCard.hidden = false;
  if(timerTick) clearInterval(timerTick);
  timerTick = setInterval(()=>{ els.timerValue.textContent = fmtTime(Date.now() - active.startedAt); }, 250);
}
function stopTimer(){
  if(timerTick) clearInterval(timerTick);
  timerTick = null;
  els.timerCard.hidden = true;
}

// -------- Routine selector ----------
function renderRoutineSelect(){
  els.routineSelect.innerHTML = "";
  state.routines.forEach(r=>{
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = r.name;
    els.routineSelect.appendChild(opt);
  });

  // fallback if currentRoutineId missing
  if(!currentRoutineId || !state.routines.some(r=>r.id===currentRoutineId)){
    currentRoutineId = state.routines[0]?.id || "";
  }
  els.routineSelect.value = currentRoutineId;

  // CHANGE handler
  els.routineSelect.onchange = ()=>{
    currentRoutineId = els.routineSelect.value;
    renderDayCards();
  };

  // ✅ FORCE open dropdown on Chrome Android
  els.routineSelect.onclick = ()=>{
    if (typeof els.routineSelect.showPicker === "function") {
      els.routineSelect.showPicker();
    }
  };

  // Optional: show count so we know dropdown has items
  setStatus(`Routines: ${els.routineSelect.options.length}`);
}

// -------- Day cards ----------
function renderDayCards(){
  const r = getRoutine(currentRoutineId);
  if(!r) return;

  els.dayList.innerHTML = "";
  r.days.forEach(d=>{
    const card = document.createElement("div");
    card.className = "dayCard";

    const top = document.createElement("div");
    top.className = "dayTop";

    const left = document.createElement("div");
    const title = document.createElement("div");
    title.className = "dayTitle";
    title.textContent = d.name;

    const meta = document.createElement("div");
    meta.className = "dayMeta";
    const exCount = d.exercises?.length || 0;
    meta.textContent = `${d.meta || "Workout"} • ${exCount} exercises`;

    left.appendChild(title);
    left.appendChild(meta);

    const arrow = document.createElement("div");
    arrow.className = "dayArrow";
    arrow.textContent = "▼";

    top.appendChild(left);
    top.appendChild(arrow);

    const btn = document.createElement("button");
    btn.className = "startBtn";
    btn.innerHTML = "▶ Start Workout";
    btn.addEventListener("click", ()=> beginWorkout(currentRoutineId, d.id));

    card.appendChild(top);
    card.appendChild(btn);
    els.dayList.appendChild(card);
  });
}

// -------- Begin/Finish workout ----------
function beginWorkout(routineId, dayId){
  active.isRunning = true;
  active.routineId = routineId;
  active.dayId = dayId;
  active.startedAt = Date.now();

  state.sessions.push({
    id: uid("sess"),
    date: currentDate,
    routineId,
    dayId,
    startedAt: active.startedAt,
    endedAt: 0
  });
  saveState();

  els.activeWorkout.hidden = false;
  renderActiveWorkout();
  startTimer();
  setStatus("Workout started.");
}

function finishWorkout(){
  if(!active.isRunning) return;
  active.isRunning = false;

  for(let i=state.sessions.length-1; i>=0; i--){
    const s = state.sessions[i];
    if(s.date===currentDate && s.routineId===active.routineId && s.dayId===active.dayId && !s.endedAt){
      s.endedAt = Date.now();
      break;
    }
  }
  saveState();

  stopTimer();
  els.activeWorkout.hidden = true;

  setStatus("Workout finished.");
  renderHistory();
  renderStats();
}
els.btnFinishWorkout.addEventListener("click", finishWorkout);

// -------- Active workout render ----------
function renderActiveWorkout(){
  const r = getRoutine(active.routineId);
  const d = r ? getDay(r, active.dayId) : null;
  if(!d) return;

  els.activeTitle.textContent = d.name;
  els.activeMeta.textContent = `${d.meta || "Workout"} • ${(d.exercises?.length||0)} exercises`;
  renderExercises(d);
}

function renderExercises(day){
  const q = (filterText||"").toLowerCase();
  const exs = (day.exercises||[]).filter(ex=> ex.name.toLowerCase().includes(q));

  els.exerciseList.innerHTML = "";

  exs.forEach(ex=>{
    const card = document.createElement("div");
    card.className = "exerciseCard";

    const head = document.createElement("div");
    head.className = "exerciseHead";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "exerciseName";
    name.textContent = ex.name;

    const sub = document.createElement("div");
    sub.className = "exerciseSub";
    sub.textContent = "Target: — (log sets below)";

    left.appendChild(name);
    left.appendChild(sub);

    const tut = document.createElement("button");
    tut.className = "tutorialBtn";
    tut.innerHTML = "📹 <span>Tutorial</span>";
    tut.addEventListener("click", ()=>{
      const url = (ex.videoUrl && ex.videoUrl.trim()) ? ex.videoUrl.trim() : ytSearchUrl(ex.name);
      window.open(url, "_blank", "noreferrer");
    });

    head.appendChild(left);
    head.appendChild(tut);
    card.appendChild(head);

    const existing = logsFor(currentDate, active.routineId, active.dayId, ex.id);
    const rowsToShow = Math.max(4, existing.length);

    for(let i=0;i<rowsToShow;i++){
      const log = existing[i] || null;

      const row = document.createElement("div");
      row.className = "setGrid";

      const num = document.createElement("div");
      num.className = "setNum";
      num.textContent = String(i+1);

      const wWrap = document.createElement("div");
      const wLab = document.createElement("div");
      wLab.className = "smallLabel";
      wLab.textContent = "Weight (kg)";
      const w = document.createElement("input");
      w.className = "smallInput";
      w.type = "number"; w.step = "0.5"; w.min = "0";
      w.value = log ? String(log.weight ?? 0) : "0";
      wWrap.appendChild(wLab); wWrap.appendChild(w);

      const rWrap = document.createElement("div");
      const rLab = document.createElement("div");
      rLab.className = "smallLabel";
      rLab.textContent = "Reps";
      const reps = document.createElement("input");
      reps.className = "smallInput";
      reps.type = "number"; reps.min = "0";
      reps.value = log ? String(log.reps ?? 0) : "0";
      rWrap.appendChild(rLab); rWrap.appendChild(reps);

      const del = document.createElement("button");
      del.className = "trashMini";
      del.textContent = "🗑";
      del.disabled = !log;

      function ensureLog(){
        if(log) return log;
        const newLog = {
          id: uid("log"),
          date: currentDate,
          routineId: active.routineId,
          dayId: active.dayId,
          exerciseId: ex.id,
          setNo: i+1,
          reps: 0,
          weight: 0,
          seconds: 0,
          createdAt: Date.now()
        };
        state.logs.push(newLog);
        saveState();
        del.disabled = false;
        return newLog;
      }

      w.addEventListener("change", ()=>{
        const L = ensureLog();
        L.weight = Math.max(0, safeNum(w.value));
        saveState();
        setStatus("Saved.");
      });
      reps.addEventListener("change", ()=>{
        const L = ensureLog();
        L.reps = Math.max(0, Math.floor(safeNum(reps.value)));
        saveState();
        setStatus("Saved.");
      });

      del.addEventListener("click", ()=>{
        if(!log) return;
        state.logs = state.logs.filter(x=>x.id !== log.id);
        saveState();
        renderActiveWorkout();
        setStatus("Deleted set.");
      });

      row.appendChild(num);
      row.appendChild(wWrap);
      row.appendChild(rWrap);
      row.appendChild(del);
      card.appendChild(row);
    }

    const addBtn = document.createElement("button");
    addBtn.className = "addSetBtn";
    addBtn.textContent = "+ Add Set";
    addBtn.addEventListener("click", ()=>{
      const nextNo = logsFor(currentDate, active.routineId, active.dayId, ex.id).length + 1;
      state.logs.push({
        id: uid("log"),
        date: currentDate,
        routineId: active.routineId,
        dayId: active.dayId,
        exerciseId: ex.id,
        setNo: nextNo,
        reps: 0,
        weight: 0,
        seconds: 0,
        createdAt: Date.now()
      });
      saveState();
      renderActiveWorkout();
      setStatus("Added set.");
    });
    card.appendChild(addBtn);

    els.exerciseList.appendChild(card);
  });

  if(exs.length===0){
    const empty = document.createElement("div");
    empty.className = "dayCard";
    empty.textContent = "No matching exercises.";
    els.exerciseList.appendChild(empty);
  }
}

// Search
els.searchBox.addEventListener("input", ()=>{
  filterText = els.searchBox.value || "";
  if(active.isRunning) renderActiveWorkout();
});

els.workoutDate.onclick = ()=>{
  if (typeof els.workoutDate.showPicker === "function") {
    els.workoutDate.showPicker();
  }
};
// Date change
els.workoutDate.addEventListener("change", ()=>{
  currentDate = els.workoutDate.value || nowISODate();
  setStatus("Date changed.");
  if(active.isRunning) renderActiveWorkout();
  renderHistory();
  renderStats();
});

// Add exercise
els.btnAddExercise.addEventListener("click", ()=>{
  if(!active.isRunning){ alert("Start a workout first."); return; }
  const r = getRoutine(active.routineId);
  const d = r ? getDay(r, active.dayId) : null;
  if(!d) return;

  const name = prompt("Exercise name:");
  if(!name) return;

  const videoUrl = prompt("Video link (optional). Leave empty for YouTube search:") || "";
  d.exercises.unshift({ id: uid("ex"), name: name.trim(), videoUrl: videoUrl.trim() });
  saveState();

  renderActiveWorkout();
  renderDayCards();
  setStatus("Exercise added.");
});

// -------- CSV Export ----------
function csvEscape(value){
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
  return s;
}
function exportCSV(){
  const header = ["Date","Routine","Day","Exercise","SetNo","Reps","Weight","TimeSec","Volume","CreatedAtISO"];
  const rows = state.logs
    .slice()
    .sort((a,b)=> (a.date||"").localeCompare(b.date||"") || (a.createdAt||0)-(b.createdAt||0))
    .map(l=>{
      const r = getRoutine(l.routineId);
      const d = r?.days?.find(x=>x.id===l.dayId);
      const ex = d?.exercises?.find(x=>x.id===l.exerciseId);
      const reps = Number(l.reps||0);
      const wt = Number(l.weight||0);
      const vol = reps * wt;
      return [
        l.date || "",
        r?.name || "",
        d?.name || "",
        ex?.name || l.exerciseId || "",
        l.setNo ?? "",
        l.reps ?? "",
        l.weight ?? "",
        l.seconds ?? "",
        vol || "",
        l.createdAt ? new Date(l.createdAt).toISOString() : ""
      ];
    });

  const csv = header.map(csvEscape).join(",") + "\r\n" +
              rows.map(r=>r.map(csvEscape).join(",")).join("\r\n") + "\r\n";

  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `gymtracker-export-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus("Exported CSV.");
}
els.btnExport.addEventListener("click", exportCSV);

// -------- Import JSON ----------
function importData(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const obj = JSON.parse(String(reader.result));
      if(!obj?.routines || !obj?.logs) throw new Error("invalid");
      state = obj;
      if(!Array.isArray(state.routines) || state.routines.length===0) state.routines = seedData.routines;
      if(!Array.isArray(state.logs)) state.logs = [];
      if(!Array.isArray(state.sessions)) state.sessions = [];
      saveState();

      currentRoutineId = state.routines[0]?.id || "";
      active.isRunning = false;
      stopTimer();
      els.activeWorkout.hidden = true;

      renderRoutineSelect();
      renderDayCards();
      showHistoryList();
      renderHistory();
      renderStats();
      setStatus("Imported.");
    }catch{
      alert("Import failed. Please choose a valid backup JSON file.");
    }
  };
  reader.readAsText(file);
}
els.fileImport.addEventListener("change", (e)=>{
  const f = e.target.files?.[0];
  if(f) importData(f);
  e.target.value = "";
});

// -------- History (List + Detail drill-down) ----------
function synthSessionsFromLogs(){
  const map = new Map();
  state.logs.forEach(l=>{
    const k = `${l.date}||${l.routineId}||${l.dayId}`;
    if(!map.has(k)){
      map.set(k, {
        id: uid("sess"),
        date: l.date,
        routineId: l.routineId,
        dayId: l.dayId,
        startedAt: l.createdAt || 0,
        endedAt: l.createdAt || 0
      });
    }else{
      const s = map.get(k);
      s.startedAt = Math.min(s.startedAt, l.createdAt||s.startedAt);
      s.endedAt = Math.max(s.endedAt, l.createdAt||s.endedAt);
    }
  });
  return Array.from(map.values());
}
function getAllSessions(){
  return (state.sessions && state.sessions.length) ? state.sessions.slice() : synthSessionsFromLogs();
}
function showHistoryList(){
  els.historyDetail.hidden = true;
  els.historyView.hidden = false;
}
function showHistoryDetail(){
  els.historyView.hidden = true;
  els.historyDetail.hidden = false;
}
els.btnBackHistory.addEventListener("click", showHistoryList);

function renderHistory(){
  if(!els.historyList) return;
  els.historyList.innerHTML = "";

  const sessions = getAllSessions()
    .slice()
    .sort((a,b)=> (b.startedAt||0)-(a.startedAt||0));

  sessions.forEach(s=>{
    const r = getRoutine(s.routineId);
    const d = r?.days?.find(x=>x.id===s.dayId);
    const sets = totalSetsForSession(s.date, s.routineId, s.dayId);
    const vol = Math.round(totalVolumeForSession(s.date, s.routineId, s.dayId));
    const dur = (s.endedAt && s.startedAt && s.endedAt>s.startedAt) ? fmtTime(s.endedAt - s.startedAt) : "—";

    const card = document.createElement("div");
    card.className = "dayCard";
    card.style.cursor = "pointer";

    const title = document.createElement("div");
    title.className = "dayTitle";
    title.textContent = new Date(s.date + "T00:00:00").toDateString();

    const main = document.createElement("div");
    main.className = "recentMain";
    main.style.marginTop = "8px";
    main.style.color = "rgba(16,185,129,.95)";
    main.textContent = d?.name || "Workout";

    const sub = document.createElement("div");
    sub.className = "recentSub";
    sub.textContent = `⏱ ${dur} • 🏋️ ${sets} sets • 📦 ${vol} kg`;

    card.appendChild(title);
    card.appendChild(main);
    card.appendChild(sub);

    card.addEventListener("click", ()=>{
      renderHistoryDetail(s);
      showHistoryDetail();
    });

    els.historyList.appendChild(card);
  });

  if(els.historyList.children.length===0){
    const empty = document.createElement("div");
    empty.className = "dayCard";
    empty.textContent = "No history yet. Start and finish a workout to see it here.";
    els.historyList.appendChild(empty);
  }
}

function renderHistoryDetail(s){
  const r = getRoutine(s.routineId);
  const d = r?.days?.find(x=>x.id===s.dayId);
  const dayName = d?.name || "Workout";
  const dateNice = new Date(s.date + "T00:00:00").toDateString();

  const sets = totalSetsForSession(s.date, s.routineId, s.dayId);
  const vol = Math.round(totalVolumeForSession(s.date, s.routineId, s.dayId));
  const dur = (s.endedAt && s.startedAt && s.endedAt>s.startedAt) ? fmtTime(s.endedAt - s.startedAt) : "—";

  els.historyDetailTitle.textContent = dateNice;
  els.historyDetailSub.textContent = r?.name || "Program";
  els.historyDetailDayName.textContent = dayName;
  els.historyDetailSummary.textContent = `⏱ ${dur} • 🏋️ ${sets} sets • 📦 ${vol} kg`;

  const logs = logsForSession(s.date, s.routineId, s.dayId);
  const byExercise = new Map();
  logs.forEach(l=>{
    const arr = byExercise.get(l.exerciseId) || [];
    arr.push(l);
    byExercise.set(l.exerciseId, arr);
  });

  els.historyDetailExercises.innerHTML = "";

  const exerciseIds = Array.from(byExercise.keys());
  if(exerciseIds.length===0){
    const empty = document.createElement("div");
    empty.className = "dayCard";
    empty.textContent = "No sets logged for this workout.";
    els.historyDetailExercises.appendChild(empty);
    return;
  }

  exerciseIds.forEach(exId=>{
    const exName = (d?.exercises || []).find(x=>x.id===exId)?.name || exId;
    const entries = byExercise.get(exId).slice().sort((a,b)=>(a.setNo||0)-(b.setNo||0));

    const card = document.createElement("div");
    card.className = "histExerciseCard";

    const top = document.createElement("div");
    top.className = "histExerciseTop";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "histExerciseName";
    name.textContent = exName;

    const meta = document.createElement("div");
    meta.className = "histExerciseMeta";
    meta.textContent = `${entries.length} set(s) • Volume: ${Math.round(entries.reduce((s2,l)=>s2+(Number(l.reps||0)*Number(l.weight||0)),0))}`;

    left.appendChild(name);
    left.appendChild(meta);

    top.appendChild(left);
    card.appendChild(top);

    entries.forEach((l, idx)=>{
      const row = document.createElement("div");
      row.className = "row2";

      const num = document.createElement("div");
      num.className = "setNum";
      num.textContent = String(l.setNo ?? (idx+1));

      const wWrap = document.createElement("div");
      const wLab = document.createElement("div");
      wLab.className = "smallLabel";
      wLab.textContent = "Weight (kg)";
      const w = document.createElement("input");
      w.className = "smallInput";
      w.type="number"; w.step="0.5"; w.min="0";
      w.value = String(l.weight ?? 0);
      wWrap.appendChild(wLab); wWrap.appendChild(w);

      const rWrap = document.createElement("div");
      const rLab = document.createElement("div");
      rLab.className = "smallLabel";
      rLab.textContent = "Reps";
      const reps = document.createElement("input");
      reps.className = "smallInput";
      reps.type="number"; reps.min="0";
      reps.value = String(l.reps ?? 0);
      rWrap.appendChild(rLab); rWrap.appendChild(reps);

      const del = document.createElement("button");
      del.className = "trashMini";
      del.textContent = "🗑";
      del.title = "Delete set";

      w.addEventListener("change", ()=>{
        l.weight = Math.max(0, safeNum(w.value));
        saveState();
        renderHistoryDetail(s);
        setStatus("Saved.");
      });
      reps.addEventListener("change", ()=>{
        l.reps = Math.max(0, Math.floor(safeNum(reps.value)));
        saveState();
        renderHistoryDetail(s);
        setStatus("Saved.");
      });
      del.addEventListener("click", ()=>{
        state.logs = state.logs.filter(x=>x.id !== l.id);
        saveState();
        renderHistoryDetail(s);
        setStatus("Deleted set.");
      });

      row.appendChild(num);
      row.appendChild(wWrap);
      row.appendChild(rWrap);
      row.appendChild(del);
      card.appendChild(row);
    });

    els.historyDetailExercises.appendChild(card);
  });
}

// -------- Stats ----------
function renderStats(){
  const sessions = getAllSessions();
  const totalWorkouts = sessions.length;
  const totalSets = state.logs.length;
  const totalVol = Math.round(state.logs.reduce((s,l)=> s + (Number(l.reps||0)*Number(l.weight||0)), 0));

  const totalMs = sessions.reduce((s,x)=>{
    if(x.startedAt && x.endedAt && x.endedAt>x.startedAt) return s + (x.endedAt - x.startedAt);
    return s;
  }, 0);
  const hours = (totalMs/3600000);
  const hoursTxt = (Math.round(hours*10)/10).toString();

  els.statWorkouts.textContent = String(totalWorkouts);
  els.statSets.textContent = String(totalSets);
  els.statVolume.textContent = String(totalVol);
  els.statHours.textContent = hoursTxt;

  els.recentActivity.innerHTML = "";
  const latest = sessions.slice().sort((a,b)=> (b.startedAt||0)-(a.startedAt||0)).slice(0,5);

  if(latest.length===0){
    const div = document.createElement("div");
    div.className = "recentItem";
    div.textContent = "No activity yet.";
    els.recentActivity.appendChild(div);
    return;
  }

  latest.forEach(s=>{
    const r = getRoutine(s.routineId);
    const d = r?.days?.find(x=>x.id===s.dayId);
    const sets = totalSetsForSession(s.date, s.routineId, s.dayId);
    const item = document.createElement("div");
    item.className = "recentItem";
    const a = document.createElement("div");
    a.className = "recentMain";
    a.textContent = d?.name || "Workout";
    const b = document.createElement("div");
    b.className = "recentSub";
    b.textContent = `${s.date} • ${sets} sets`;
    item.appendChild(a);
    item.appendChild(b);
    els.recentActivity.appendChild(item);
  });
}

// -------- Install prompt ----------
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  if(els.btnInstall) els.btnInstall.hidden=false;
});
if(els.btnInstall){
  els.btnInstall.addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt=null;
    els.btnInstall.hidden=true;
  });
}

// -------- Service worker ----------
if("serviceWorker" in navigator){
  window.addEventListener("load", async ()=>{
    try{
      await navigator.serviceWorker.register("./sw.js");
      setStatus("Offline ready.");
    }catch{
      setStatus("Service worker failed.");
    }
  });
}

// Initial render
renderRoutineSelect();
renderDayCards();
showHistoryList();
renderHistory();
renderStats();
setStatus("Ready.");
