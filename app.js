/* =============================
   Workout Tracker Pro - app.js
   Full replacement (Set dropdown UI + fixes)
   ============================= */

const STORAGE_KEY = "gymtracker:v2";

/* ---------------- Seed routines (Set 1/2/3 naming) ---------------- */
const seedData = {
  version: 2,
  routines: [
    {
      id: "routine_push",
      name: "Push Routine",
      sets: [
        { id: "push_set1", name: "Set 1", meta: "Chest, Shoulders, Triceps", exercises: [
          { id: "barbell_bench_press", name: "Barbell Bench Press", videoUrl: "" },
          { id: "incline_dumbbell_press", name: "Incline Dumbbell Press", videoUrl: "" },
          { id: "rear_delt_flyes", name: "Rear Delt Flyes", videoUrl: "" },
          { id: "dumbbell_shoulder_press", name: "Dumbbell Shoulder Press", videoUrl: "" },
          { id: "triceps_pushdown", name: "Triceps Pushdown", videoUrl: "" },
          { id: "overhead_triceps_ext", name: "Overhead Triceps Extension", videoUrl: "" }
        ]},
        { id: "push_set2", name: "Set 2", meta: "Chest, Shoulders, Triceps", exercises: [
          { id: "incline_barbell_press", name: "Incline Barbell Press", videoUrl: "" },
          { id: "dumbbell_bench_press", name: "Dumbbell Bench Press", videoUrl: "" },
          { id: "dumbbell_kickback", name: "Dumbbell Kickback", videoUrl: "" },
          { id: "skull_crusher", name: "Skull Crusher", videoUrl: "" },
          { id: "upright_row", name: "Upright Row", videoUrl: "" },
          { id: "front_raise", name: "Front Raise", videoUrl: "" }
        ]},
        { id: "push_set3", name: "Set 3", meta: "Shoulders + Chest + Triceps", exercises: [
          { id: "lateral_raises", name: "Lateral Raises", videoUrl: "" },
          { id: "military_press", name: "Barbell Military Press", videoUrl: "" },
          { id: "cable_chest_fly", name: "Cable Chest Fly", videoUrl: "" },
          { id: "decline_dumbbell_press", name: "Decline Dumbbell Press", videoUrl: "" },
          { id: "cross_body_triceps", name: "Cross-Body Triceps Ext.", videoUrl: "" },
          { id: "overhead_rope_ext", name: "Overhead Rope Extension", videoUrl: "" }
        ]}
      ]
    },
    {
      id: "routine_pull",
      name: "Pull Routine",
      sets: [
        { id: "pull_set1", name: "Set 1", meta: "Back, Rear Delts, Biceps", exercises: [
          { id: "deadlift", name: "Barbell Deadlift", videoUrl: "" },
          { id: "bent_over_row", name: "Bent Over Rows", videoUrl: "" },
          { id: "shrugs", name: "Dumbbell Shrugs", videoUrl: "" },
          { id: "barbell_curl", name: "Barbell Curl", videoUrl: "" },
          { id: "hammer_curl", name: "Hammer Curl", videoUrl: "" },
          { id: "behind_back_wrist_curl", name: "Behind-Back Wrist Curl", videoUrl: "" }
        ]},
        { id: "pull_set2", name: "Set 2", meta: "Back + Biceps + Forearms", exercises: [
          { id: "lat_pulldown", name: "Lat Pulldown", videoUrl: "" },
          { id: "tbar_row", name: "T-Bar Row", videoUrl: "" },
          { id: "reverse_fly", name: "Reverse Dumbbell Fly", videoUrl: "" },
          { id: "preacher_curl", name: "Preacher Curl", videoUrl: "" },
          { id: "incline_db_curl", name: "Incline Dumbbell Curl", videoUrl: "" },
          { id: "reverse_wrist_curl", name: "Reverse Wrist Curl", videoUrl: "" }
        ]},
        { id: "pull_set3", name: "Set 3", meta: "Back + Arms", exercises: [
          { id: "seated_cable_row", name: "Seated Cable Rows", videoUrl: "" },
          { id: "db_pullover", name: "Dumbbell Pullover", videoUrl: "" },
          { id: "upright_row_wide", name: "Upright Row (Wide)", videoUrl: "" },
          { id: "reverse_barbell_curl", name: "Reverse Barbell Curl", videoUrl: "" },
          { id: "concentration_curl", name: "Concentration Curl", videoUrl: "" },
          { id: "cable_high_curl", name: "Cable High Curl", videoUrl: "" }
        ]}
      ]
    },
    {
      id: "routine_legs",
      name: "Leg Routine",
      sets: [
        { id: "legs_set1", name: "Set 1", meta: "Quads, Glutes, Hamstrings", exercises: [
          { id: "squat", name: "Barbell Squat", videoUrl: "" },
          { id: "leg_press", name: "Leg Press", videoUrl: "" },
          { id: "abductor", name: "Abductor Extension", videoUrl: "" },
          { id: "adductor", name: "Adductor Clamp", videoUrl: "" },
          { id: "leg_extension", name: "Leg Extension", videoUrl: "" },
          { id: "hamstring_curl", name: "Hamstring Curl", videoUrl: "" },
          { id: "seated_calf", name: "Seated Calf Raise", videoUrl: "" },
          { id: "standing_calf", name: "Standing Calf Raise", videoUrl: "" }
        ]}
      ]
    }
  ]
};

/* ---------------- Helpers ---------------- */
function uid(prefix="id"){ return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`; }
function safeNum(v){ const n = Number(v); return Number.isFinite(n) ? n : 0; }
function nowISODate(){
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off*60*1000);
  return local.toISOString().slice(0,10);
}
function fmtTime(ms){
  const s = Math.floor(ms/1000);
  const hh = String(Math.floor(s/3600)).padStart(2,"0");
  const mm = String(Math.floor((s%3600)/60)).padStart(2,"0");
  const ss = String(s%60).padStart(2,"0");
  return `${hh}:${mm}:${ss}`;
}
function ytSearchUrl(name){
  const q = encodeURIComponent(`${name} proper form tutorial`);
  return `https://www.youtube.com/results?search_query=${q}`;
}
function setStatus(msg){
  const el = document.getElementById("statusText");
  if(el) el.textContent = msg;
}
function niceDateTime(ts){
  try{
    return new Date(ts).toLocaleString();
  }catch{
    return "";
  }
}

/* ---------------- Load/Save ---------------- */
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      return { version: 2, routines: seedData.routines, logs: [], sessions: [], lastCompleted: null };
    }
    const st = JSON.parse(raw);

    // migrate old shape (days -> sets)
    if(Array.isArray(st.routines)){
      st.routines.forEach(r=>{
        if(Array.isArray(r.days) && !Array.isArray(r.sets)){
          r.sets = r.days;
          delete r.days;
        }
      });
    }

    if(!Array.isArray(st.routines) || st.routines.length===0) st.routines = seedData.routines;
    if(!Array.isArray(st.logs)) st.logs = [];
    if(!Array.isArray(st.sessions)) st.sessions = [];
    if(!("lastCompleted" in st)) st.lastCompleted = null;

    return st;
  }catch{
    return { version: 2, routines: seedData.routines, logs: [], sessions: [], lastCompleted: null };
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------------- Deduplicate old bad data ----------------
   keep latest log per (date,routineId,setId,exerciseId,setNo) */
function dedupeLogsKeepLatest(){
  const map = new Map();
  for(const l of state.logs){
    // old data may have dayId; treat it as setId
    const setId = l.setId || l.dayId || "";
    const key = `${l.date}|${l.routineId}|${setId}|${l.exerciseId}|${l.setNo}`;
    const prev = map.get(key);
    if(!prev || (l.createdAt||0) > (prev.createdAt||0)){
      const fixed = { ...l, setId };
      delete fixed.dayId;
      map.set(key, fixed);
    }
  }
  state.logs = Array.from(map.values());
}

/* ---------------- State ---------------- */
let state = loadState();
dedupeLogsKeepLatest();
saveState();

/* ---------------- DOM refs (must match your index.html ids) ---------------- */
const els = {
  tabs: Array.from(document.querySelectorAll(".tab")),
  panels: {
    workout: document.getElementById("panel-workout"),
    history: document.getElementById("panel-history"),
    stats: document.getElementById("panel-stats")
  },

  routineSelect: document.getElementById("routineSelect"),
  dayList: document.getElementById("dayList"),                 // we will render Set dropdown UI inside this container
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

/* ---------------- App UI state ---------------- */
let currentDate = nowISODate();
if(els.workoutDate) els.workoutDate.value = currentDate;

let currentRoutineId = state.routines[0]?.id || "";
let currentSetId = state.routines[0]?.sets?.[0]?.id || "";
let filterText = "";

/* Active workout session */
let active = { isRunning:false, routineId:"", setId:"", startedAt:0 };

/* Timer */
let timerTick = null;
function startTimer(){
  if(!els.timerCard || !els.timerValue) return;
  els.timerCard.hidden = false;
  if(timerTick) clearInterval(timerTick);
  timerTick = setInterval(()=>{
    els.timerValue.textContent = fmtTime(Date.now() - active.startedAt);
  }, 250);
}
function stopTimer(){
  if(timerTick) clearInterval(timerTick);
  timerTick = null;
  if(els.timerCard) els.timerCard.hidden = true;
}

/* ---------------- Data helpers ---------------- */
function getRoutine(rid){ return state.routines.find(r=>r.id===rid); }
function getSet(r, sid){ return (r?.sets||[]).find(s=>s.id===sid); }

function logsFor(date, routineId, setId, exerciseId){
  return state.logs
    .filter(l => l.date===date && l.routineId===routineId && (l.setId||"")===setId && l.exerciseId===exerciseId)
    .sort((a,b)=> (a.setNo||0)-(b.setNo||0) || (a.createdAt||0)-(b.createdAt||0));
}
function logsForSession(date, routineId, setId){
  return state.logs
    .filter(l => l.date===date && l.routineId===routineId && (l.setId||"")===setId)
    .slice()
    .sort((a,b)=> (a.createdAt||0)-(b.createdAt||0));
}
function totalVolumeForSession(date, routineId, setId){
  return logsForSession(date, routineId, setId)
    .reduce((s,l)=> s + (Number(l.reps||0)*Number(l.weight||0)), 0);
}
function totalSetsForSession(date, routineId, setId){
  return logsForSession(date, routineId, setId).length;
}

function getAllSessions(){
  // sessions exist; if empty, synth from logs
  if(state.sessions && state.sessions.length) return state.sessions.slice();

  const map = new Map();
  state.logs.forEach(l=>{
    const k = `${l.date}||${l.routineId}||${l.setId}`;
    if(!map.has(k)){
      map.set(k, { id: uid("sess"), date:l.date, routineId:l.routineId, setId:l.setId, startedAt:l.createdAt||0, endedAt:l.createdAt||0 });
    }else{
      const s = map.get(k);
      s.startedAt = Math.min(s.startedAt, l.createdAt||s.startedAt);
      s.endedAt = Math.max(s.endedAt, l.createdAt||s.endedAt);
    }
  });
  return Array.from(map.values());
}

function latestCompleted(){
  if(state.lastCompleted && state.lastCompleted.endedAt) return state.lastCompleted;
  const sessions = getAllSessions().filter(s=>s.endedAt && s.endedAt>0);
  sessions.sort((a,b)=> (b.endedAt||0)-(a.endedAt||0));
  if(!sessions.length) return null;
  return {
    date: sessions[0].date,
    routineId: sessions[0].routineId,
    setId: sessions[0].setId,
    endedAt: sessions[0].endedAt
  };
}

/* ---------------- Tabs ---------------- */
els.tabs.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    els.tabs.forEach(x=>x.classList.remove("active"));
    btn.classList.add("active");
    const t = btn.dataset.tab;

    Object.values(els.panels).forEach(p=>p?.classList.remove("active"));
    els.panels[t]?.classList.add("active");

    if(t==="history"){ showHistoryList(); renderHistory(); }
    if(t==="stats"){ renderStats(); }
  });
});

/* ---------------- Routine select ---------------- */
function renderRoutineSelect(){
  if(!els.routineSelect) return;

  els.routineSelect.innerHTML = "";
  state.routines.forEach(r=>{
    const opt = document.createElement("option");
    opt.value = r.id;
    opt.textContent = r.name;
    els.routineSelect.appendChild(opt);
  });

  if(!currentRoutineId || !state.routines.some(r=>r.id===currentRoutineId)){
    currentRoutineId = state.routines[0]?.id || "";
  }
  els.routineSelect.value = currentRoutineId;

  els.routineSelect.onchange = ()=>{
    if(active.isRunning){
      alert("Finish the current workout first.");
      els.routineSelect.value = active.routineId;
      return;
    }
    currentRoutineId = els.routineSelect.value;
    const r = getRoutine(currentRoutineId);
    currentSetId = r?.sets?.[0]?.id || "";
    renderSetHomeUI();
  };

  // lock during workout
  els.routineSelect.disabled = active.isRunning;
}

/* ---------------- Workout home UI (Set dropdown) ---------------- */
function renderSetHomeUI(){
  if(!els.dayList) return;

  const r = getRoutine(currentRoutineId);
  if(!r) return;

  // fallback set
  if(!currentSetId || !(r.sets||[]).some(s=>s.id===currentSetId)){
    currentSetId = r.sets?.[0]?.id || "";
  }
  const setObj = getSet(r, currentSetId);

  els.dayList.innerHTML = "";

  // Last completed banner
  const last = latestCompleted();
  if(last){
    const lr = getRoutine(last.routineId);
    const ls = lr ? getSet(lr, last.setId) : null;
    const banner = document.createElement("div");
    banner.className = "dayCard";
    banner.innerHTML = `
      <div class="dayTitle" style="font-size:18px;">Last completed</div>
      <div class="dayMeta" style="margin-top:6px;color:rgba(16,185,129,.95);font-weight:900;">
        ${lr?.name || "Routine"} • ${ls?.name || "Set"}
      </div>
      <div class="dayMeta" style="margin-top:6px;">${niceDateTime(last.endedAt)}</div>
    `;
    els.dayList.appendChild(banner);
  }

  // Set dropdown card
  const selectorCard = document.createElement("div");
  selectorCard.className = "dayCard";

  const title = document.createElement("div");
  title.className = "sectionTitle";
  title.style.margin = "0 0 10px 0";
  title.textContent = "Choose Set";

  const sel = document.createElement("select");
  sel.className = "select";
  sel.id = "setSelect";

  (r.sets||[]).forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.name}`;
    sel.appendChild(opt);
  });
  sel.value = currentSetId;

  sel.onchange = ()=>{
    if(active.isRunning){
      alert("Finish the current workout first.");
      sel.value = active.setId;
      return;
    }
    currentSetId = sel.value;
    renderSetHomeUI();
  };

  // Show selected set details
  const setTitle = document.createElement("div");
  setTitle.className = "dayTitle";
  setTitle.style.marginTop = "12px";
  setTitle.textContent = setObj?.name || "Set";

  const meta = document.createElement("div");
  meta.className = "dayMeta";
  meta.textContent = `${setObj?.meta || "Workout"} • ${(setObj?.exercises?.length||0)} exercises`;

  const preview = document.createElement("div");
  preview.className = "dayDetails";

  const list = document.createElement("div");
  list.className = "dayExerciseList";

  (setObj?.exercises || []).forEach(ex=>{
    const row = document.createElement("div");
    row.className = "dayExerciseRow";

    const nm = document.createElement("div");
    nm.className = "dayExerciseName";
    nm.textContent = ex.name;

    const tut = document.createElement("button");
    tut.className = "miniBtn";
    tut.textContent = "Tutorial";
    tut.addEventListener("click", ()=>{
      const url = (ex.videoUrl && ex.videoUrl.trim()) ? ex.videoUrl.trim() : ytSearchUrl(ex.name);
      window.open(url, "_blank", "noreferrer");
    });

    row.appendChild(nm);
    row.appendChild(tut);
    list.appendChild(row);
  });

  const startBtn = document.createElement("button");
  startBtn.className = "startBtn";
  startBtn.innerHTML = "▶ Start Workout";
  startBtn.addEventListener("click", ()=>{
    beginWorkout(currentRoutineId, currentSetId);
  });

  selectorCard.appendChild(title);
  selectorCard.appendChild(sel);
  selectorCard.appendChild(setTitle);
  selectorCard.appendChild(meta);
  preview.appendChild(list);
  selectorCard.appendChild(preview);
  selectorCard.appendChild(startBtn);

  // Disable dropdown while workout running
  sel.disabled = active.isRunning;
  startBtn.disabled = active.isRunning;

  els.dayList.appendChild(selectorCard);

  // lock routine select if needed
  renderRoutineSelect();
}

/* ---------------- Begin/Finish workout ---------------- */
function beginWorkout(routineId, setId){
  if(active.isRunning) return;

  active.isRunning = true;
  active.routineId = routineId;
  active.setId = setId;
  active.startedAt = Date.now();

  // persist session
  state.sessions.push({
    id: uid("sess"),
    date: currentDate,
    routineId,
    setId,
    startedAt: active.startedAt,
    endedAt: 0
  });
  saveState();

  if(els.activeWorkout) els.activeWorkout.hidden = false;

  // keep UI aligned
  currentRoutineId = routineId;
  currentSetId = setId;

  renderRoutineSelect();
  renderSetHomeUI();
  renderActiveWorkout();
  startTimer();
  setStatus("Workout started.");
}

function finishWorkout(){
  if(!active.isRunning) return;

  active.isRunning = false;

  // close latest open session
  for(let i=state.sessions.length-1; i>=0; i--){
    const s = state.sessions[i];
    if(s.date===currentDate && s.routineId===active.routineId && s.setId===active.setId && !s.endedAt){
      s.endedAt = Date.now();

      state.lastCompleted = {
        date: s.date,
        routineId: s.routineId,
        setId: s.setId,
        endedAt: s.endedAt
      };
      break;
    }
  }

  saveState();
  stopTimer();

  if(els.activeWorkout) els.activeWorkout.hidden = true;

  renderRoutineSelect();
  renderSetHomeUI();
  renderHistory();
  renderStats();

  setStatus("Workout finished.");
}

if(els.btnFinishWorkout) els.btnFinishWorkout.addEventListener("click", finishWorkout);

/* ---------------- Active workout render ---------------- */
function renderActiveWorkout(){
  const r = getRoutine(active.routineId);
  const s = r ? getSet(r, active.setId) : null;
  if(!s) return;

  // header
  if(els.activeTitle) els.activeTitle.textContent = `${r.name} • ${s.name}`;
  const setsLogged = totalSetsForSession(currentDate, active.routineId, active.setId);
  const vol = Math.round(totalVolumeForSession(currentDate, active.routineId, active.setId));
  if(els.activeMeta) els.activeMeta.textContent = `${s.meta || "Workout"} • ${s.exercises?.length||0} exercises • ${setsLogged} sets • Vol ${vol}`;

  renderExercises(s);
}

/* ---------------- Exercises + Sets (FIXED delete + no duplicates) ---------------- */
function renderExercises(setObj){
  if(!els.exerciseList) return;

  const q = (filterText||"").toLowerCase();
  const exs = (setObj.exercises||[]).filter(ex=> ex.name.toLowerCase().includes(q));

  els.exerciseList.innerHTML = "";

  // Build an index so we NEVER create duplicates for same setNo
  const existingAll = state.logs.filter(l =>
    l.date===currentDate &&
    l.routineId===active.routineId &&
    l.setId===active.setId
  );
  const logMap = new Map(); // key: exerciseId|setNo -> log
  for(const l of existingAll){
    const key = `${l.exerciseId}|${l.setNo}`;
    const prev = logMap.get(key);
    if(!prev || (l.createdAt||0) > (prev.createdAt||0)){
      logMap.set(key, l);
    }
  }

  exs.forEach(ex=>{
    const card = document.createElement("div");
    card.className = "exerciseCard";

    const head = document.createElement("div");
    head.className = "exerciseHead";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "exerciseName";
    name.textContent = ex.name;

    const existingForEx = logsFor(currentDate, active.routineId, active.setId, ex.id);
    const exVol = Math.round(existingForEx.reduce((s,l)=> s + (Number(l.reps||0)*Number(l.weight||0)), 0));

    const sub = document.createElement("div");
    sub.className = "exerciseSub";
    sub.textContent = `${existingForEx.length} set(s) • Volume: ${exVol}`;

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

    const rowsToShow = Math.max(4, existingForEx.length);

    for(let i=0;i<rowsToShow;i++){
      const setNo = i+1;
      const mapKey = `${ex.id}|${setNo}`;
      let logRef = logMap.get(mapKey) || null;

      const row = document.createElement("div");
      row.className = "setGrid";

      const num = document.createElement("div");
      num.className = "setNum";
      num.textContent = String(setNo);

      const wWrap = document.createElement("div");
      const wLab = document.createElement("div");
      wLab.className = "smallLabel";
      wLab.textContent = "Weight (kg)";
      const w = document.createElement("input");
      w.className = "smallInput";
      w.type = "number"; w.step = "0.5"; w.min = "0";
      w.value = logRef ? String(logRef.weight ?? 0) : "0";
      wWrap.appendChild(wLab); wWrap.appendChild(w);

      const rWrap = document.createElement("div");
      const rLab = document.createElement("div");
      rLab.className = "smallLabel";
      rLab.textContent = "Reps";
      const reps = document.createElement("input");
      reps.className = "smallInput";
      reps.type = "number"; reps.min = "0";
      reps.value = logRef ? String(logRef.reps ?? 0) : "0";
      rWrap.appendChild(rLab); rWrap.appendChild(reps);

      const del = document.createElement("button");
      del.className = "trashMini";
      del.textContent = "🗑";
      del.disabled = !logRef;

      function ensureLog(){
        if(logRef) return logRef;

        const newLog = {
          id: uid("log"),
          date: currentDate,
          routineId: active.routineId,
          setId: active.setId,
          exerciseId: ex.id,
          setNo,
          reps: 0,
          weight: 0,
          seconds: 0,
          createdAt: Date.now()
        };
        state.logs.push(newLog);
        logRef = newLog;
        logMap.set(mapKey, newLog);
        del.disabled = false;
        saveState();
        return logRef;
      }

      w.addEventListener("change", ()=>{
        const L = ensureLog();
        L.weight = Math.max(0, safeNum(w.value));
        L.createdAt = Date.now();
        saveState();
        renderActiveWorkout();
        setStatus("Saved.");
      });

      reps.addEventListener("change", ()=>{
        const L = ensureLog();
        L.reps = Math.max(0, Math.floor(safeNum(reps.value)));
        L.createdAt = Date.now();
        saveState();
        renderActiveWorkout();
        setStatus("Saved.");
      });

      del.addEventListener("click", ()=>{
        if(!logRef) return;
        state.logs = state.logs.filter(x=>x.id !== logRef.id);
        logMap.delete(mapKey);
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
      // adds next set number for this exercise
      const existing = logsFor(currentDate, active.routineId, active.setId, ex.id);
      const nextNo = existing.length + 1;
      const newLog = {
        id: uid("log"),
        date: currentDate,
        routineId: active.routineId,
        setId: active.setId,
        exerciseId: ex.id,
        setNo: nextNo,
        reps: 0,
        weight: 0,
        seconds: 0,
        createdAt: Date.now()
      };
      state.logs.push(newLog);
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

/* ---------------- Search + Date ---------------- */
if(els.searchBox){
  els.searchBox.addEventListener("input", ()=>{
    filterText = els.searchBox.value || "";
    if(active.isRunning) renderActiveWorkout();
  });
}
if(els.workoutDate){
  els.workoutDate.addEventListener("change", ()=>{
    currentDate = els.workoutDate.value || nowISODate();
    setStatus("Date changed.");
    if(active.isRunning) renderActiveWorkout();
    renderHistory();
    renderStats();
  });
}

/* ---------------- Add exercise ---------------- */
if(els.btnAddExercise){
  els.btnAddExercise.addEventListener("click", ()=>{
    if(!active.isRunning){
      alert("Start a workout first.");
      return;
    }
    const r = getRoutine(active.routineId);
    const s = r ? getSet(r, active.setId) : null;
    if(!s) return;

    const name = prompt("Exercise name:");
    if(!name) return;

    const videoUrl = prompt("Video link (optional). Leave empty for YouTube search:") || "";
    s.exercises.unshift({ id: uid("ex"), name: name.trim(), videoUrl: videoUrl.trim() });
    saveState();

    renderActiveWorkout();
    renderSetHomeUI();
    setStatus("Exercise added.");
  });
}

/* ---------------- CSV Export ---------------- */
function csvEscape(value){
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g,'""')}"`;
  return s;
}
function exportCSV(){
  const header = ["Date","Routine","Set","Exercise","SetNo","Reps","Weight","TimeSec","Volume","CreatedAtISO"];
  const rows = state.logs
    .slice()
    .sort((a,b)=> (a.date||"").localeCompare(b.date||"") || (a.createdAt||0)-(b.createdAt||0))
    .map(l=>{
      const r = getRoutine(l.routineId);
      const s = r?.sets?.find(x=>x.id===l.setId);
      const ex = s?.exercises?.find(x=>x.id===l.exerciseId);
      const reps = Number(l.reps||0);
      const wt = Number(l.weight||0);
      const vol = reps * wt;
      return [
        l.date || "",
        r?.name || "",
        s?.name || "",
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
  a.download = `workout-export-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus("Exported CSV.");
}
if(els.btnExport) els.btnExport.addEventListener("click", exportCSV);

/* ---------------- Import JSON ---------------- */
function importData(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const obj = JSON.parse(String(reader.result));
      if(!obj?.routines || !obj?.logs) throw new Error("invalid");

      // migrate days->sets
      obj.routines.forEach(r=>{
        if(Array.isArray(r.days) && !Array.isArray(r.sets)){
          r.sets = r.days;
          delete r.days;
        }
      });

      state = obj;
      if(!Array.isArray(state.routines) || state.routines.length===0) state.routines = seedData.routines;
      if(!Array.isArray(state.logs)) state.logs = [];
      if(!Array.isArray(state.sessions)) state.sessions = [];
      if(!("lastCompleted" in state)) state.lastCompleted = null;

      dedupeLogsKeepLatest();
      saveState();

      // reset UI
      currentRoutineId = state.routines[0]?.id || "";
      currentSetId = state.routines[0]?.sets?.[0]?.id || "";
      active.isRunning = false;
      stopTimer();
      if(els.activeWorkout) els.activeWorkout.hidden = true;

      renderRoutineSelect();
      renderSetHomeUI();
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
if(els.fileImport){
  els.fileImport.addEventListener("change", (e)=>{
    const f = e.target.files?.[0];
    if(f) importData(f);
    e.target.value = "";
  });
}

/* ---------------- History ---------------- */
function showHistoryList(){
  if(els.historyDetail) els.historyDetail.hidden = true;
  if(els.historyView) els.historyView.hidden = false;
}
function showHistoryDetail(){
  if(els.historyView) els.historyView.hidden = true;
  if(els.historyDetail) els.historyDetail.hidden = false;
}
if(els.btnBackHistory) els.btnBackHistory.addEventListener("click", showHistoryList);

function renderHistory(){
  if(!els.historyList) return;
  els.historyList.innerHTML = "";

  const sessions = getAllSessions()
    .slice()
    .sort((a,b)=> (b.endedAt||b.startedAt||0)-(a.endedAt||a.startedAt||0));

  sessions.forEach(s=>{
    const r = getRoutine(s.routineId);
    const setObj = r?.sets?.find(x=>x.id===s.setId);

    const sets = totalSetsForSession(s.date, s.routineId, s.setId);
    const vol = Math.round(totalVolumeForSession(s.date, s.routineId, s.setId));
    const dur = (s.endedAt && s.startedAt && s.endedAt>s.startedAt) ? fmtTime(s.endedAt - s.startedAt) : "—";
    const doneAt = s.endedAt ? niceDateTime(s.endedAt) : "Not finished";

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
    main.textContent = `${r?.name || "Routine"} • ${setObj?.name || "Set"}`;

    const sub = document.createElement("div");
    sub.className = "recentSub";
    sub.textContent = `⏱ ${dur} • 🏋️ ${sets} sets • 📦 ${vol} kg • ✅ ${doneAt}`;

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
  const setObj = r?.sets?.find(x=>x.id===s.setId);

  const dateNice = new Date(s.date + "T00:00:00").toDateString();

  const sets = totalSetsForSession(s.date, s.routineId, s.setId);
  const vol = Math.round(totalVolumeForSession(s.date, s.routineId, s.setId));
  const dur = (s.endedAt && s.startedAt && s.endedAt>s.startedAt) ? fmtTime(s.endedAt - s.startedAt) : "—";

  if(els.historyDetailTitle) els.historyDetailTitle.textContent = dateNice;
  if(els.historyDetailSub) els.historyDetailSub.textContent = r?.name || "Program";
  if(els.historyDetailDayName) els.historyDetailDayName.textContent = setObj?.name || "Set";
  if(els.historyDetailSummary) els.historyDetailSummary.textContent = `⏱ ${dur} • 🏋️ ${sets} sets • 📦 ${vol} kg`;

  if(!els.historyDetailExercises) return;

  const logs = logsForSession(s.date, s.routineId, s.setId);
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
    const exName = (setObj?.exercises || []).find(x=>x.id===exId)?.name || exId;
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
        l.createdAt = Date.now();
        saveState();
        renderHistoryDetail(s);
        setStatus("Saved.");
      });
      reps.addEventListener("change", ()=>{
        l.reps = Math.max(0, Math.floor(safeNum(reps.value)));
        l.createdAt = Date.now();
        saveState();
        renderHistoryDetail(s);
        setStatus("Saved.");
      });
      del.addEventListener("click", ()=>{
        state.logs = state.logs.filter(x=>x.id !== l.id);
        saveState();
        renderHistoryDetail(s);
        setStatus("Deleted set.");
        renderStats();
        renderHistory();
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

/* ---------------- Stats ---------------- */
function renderStats(){
  if(!els.statWorkouts) return;

  const sessions = getAllSessions();
  const totalWorkouts = sessions.filter(s=>s.endedAt && s.endedAt>0).length;
  const totalSets = state.logs.length;
  const totalVol = Math.round(state.logs.reduce((s,l)=> s + (Number(l.reps||0)*Number(l.weight||0)), 0));

  const totalMs = sessions.reduce((s,x)=>{
    if(x.startedAt && x.endedAt && x.endedAt>x.startedAt) return s + (x.endedAt - x.startedAt);
    return s;
  }, 0);
  const hours = (totalMs/3600000);
  const hoursTxt = (Math.round(hours*10)/10).toString();

  els.statWorkouts.textContent = String(totalWorkouts);
  if(els.statSets) els.statSets.textContent = String(totalSets);
  if(els.statVolume) els.statVolume.textContent = String(totalVol);
  if(els.statHours) els.statHours.textContent = hoursTxt;

  if(!els.recentActivity) return;
  els.recentActivity.innerHTML = "";

  const latest = sessions
    .filter(s=>s.endedAt && s.endedAt>0)
    .slice()
    .sort((a,b)=> (b.endedAt||0)-(a.endedAt||0))
    .slice(0,5);

  if(latest.length===0){
    const div = document.createElement("div");
    div.className = "recentItem";
    div.textContent = "No activity yet.";
    els.recentActivity.appendChild(div);
    return;
  }

  latest.forEach(s=>{
    const r = getRoutine(s.routineId);
    const setObj = r?.sets?.find(x=>x.id===s.setId);
    const sets = totalSetsForSession(s.date, s.routineId, s.setId);

    const item = document.createElement("div");
    item.className = "recentItem";

    const a = document.createElement("div");
    a.className = "recentMain";
    a.textContent = `${r?.name || "Routine"} • ${setObj?.name || "Set"}`;

    const b = document.createElement("div");
    b.className = "recentSub";
    b.textContent = `${s.date} • ${sets} sets`;

    item.appendChild(a);
    item.appendChild(b);
    els.recentActivity.appendChild(item);
  });
}

/* ---------------- Install prompt ---------------- */
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

/* ---------------- Service worker register ---------------- */
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

/* ---------------- Init ---------------- */
renderRoutineSelect();
renderSetHomeUI();
showHistoryList();
renderHistory();
renderStats();
setStatus("Ready.");