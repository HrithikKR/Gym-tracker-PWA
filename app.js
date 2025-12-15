const STORAGE_KEY = "gymtracker:v1";

const seedData = {
  "version": 1,
  "routines": [
    {
      "id": "routine_push",
      "name": "Push Routine",
      "days": [
        {
          "id": "push_day1",
          "name": "Day 1",
          "exercises": [
            {"id":"barbell_bench_press_flat","name":"Barbell Bench Press (Flat)","videoUrl":""},
            {"id":"incline_dumbbell_press","name":"Incline Dumbbell Press","videoUrl":""},
            {"id":"dumbbell_rear_delt_flyes","name":"Dumbbell Rear Delt Flyes","videoUrl":""},
            {"id":"dumbbell_shoulder_press","name":"Dumbbell Shoulder Press","videoUrl":""},
            {"id":"triceps_cable_pushdown","name":"Triceps Cable Pushdown","videoUrl":""},
            {"id":"triceps_overhead_extension","name":"Triceps Overhead Extension","videoUrl":""}
          ]
        },
        {
          "id":"push_day2",
          "name":"Day 2",
          "exercises":[
            {"id":"incline_barbell_press","name":"Incline Barbell Press","videoUrl":""},
            {"id":"dumbbell_bench_press_flat","name":"Dumbbell Bench Press (Flat)","videoUrl":""},
            {"id":"dumbbell_kickback","name":"Dumbbell Kickback","videoUrl":""},
            {"id":"barbell_skull_crusher","name":"Barbell Skull Crusher","videoUrl":""},
            {"id":"dumbbell_upright_row","name":"Dumbbell Upright Row","videoUrl":""},
            {"id":"dumbbell_front_raise","name":"Dumbbell Front Raise","videoUrl":""}
          ]
        },
        {
          "id":"push_day3",
          "name":"Day 3",
          "exercises":[
            {"id":"dumbbell_lateral_raises","name":"Dumbbell Lateral Raises","videoUrl":""},
            {"id":"barbell_military_press","name":"Barbell Military Press","videoUrl":""},
            {"id":"cable_chest_fly_mid_low","name":"Cable Chest Fly (Mid / Low Pulley)","videoUrl":""},
            {"id":"decline_dumbbell_press","name":"Decline Dumbbell Press","videoUrl":""},
            {"id":"cross_body_cable_triceps_extension","name":"Cross-Body Cable Triceps Extension","videoUrl":""},
            {"id":"cable_overhead_triceps_extension_rope","name":"Cable Overhead Triceps Extension (Rope)","videoUrl":""}
          ]
        }
      ]
    },
    {
      "id":"routine_pull",
      "name":"Pull Routine",
      "days":[
        {
          "id":"pull_day1",
          "name":"Day 1",
          "exercises":[
            {"id":"barbell_curl","name":"Barbell Curl","videoUrl":""},
            {"id":"hammer_curl","name":"Hammer Curl","videoUrl":""},
            {"id":"behind_the_back_cable_wrist_curl","name":"Behind-The-Back Cable Wrist Curl","videoUrl":""},
            {"id":"barbell_deadlift","name":"Barbell Deadlift","videoUrl":""},
            {"id":"bent_over_rows","name":"Bent Over Rows","videoUrl":""},
            {"id":"dumbbell_shrugs","name":"Dumbbell Shrugs","videoUrl":""}
          ]
        },
        {
          "id":"pull_day2",
          "name":"Day 2",
          "exercises":[
            {"id":"preacher_curl","name":"Preacher Curl","videoUrl":""},
            {"id":"incline_dumbbell_curl","name":"Incline Dumbbell Curl","videoUrl":""},
            {"id":"barbell_reverse_wrist_curl_bench","name":"Barbell Reverse Wrist Curl (Bench)","videoUrl":""},
            {"id":"lat_pulldown","name":"Lat Pulldown","videoUrl":""},
            {"id":"barbell_t_bar_row","name":"Barbell T-Bar Row","videoUrl":""},
            {"id":"reverse_dumbbell_fly","name":"Reverse Dumbbell Fly","videoUrl":""}
          ]
        },
        {
          "id":"pull_day3",
          "name":"Day 3",
          "exercises":[
            {"id":"reverse_barbell_curl","name":"Reverse Barbell Curl","videoUrl":""},
            {"id":"seated_cable_rows","name":"Seated Cable Rows","videoUrl":""},
            {"id":"dumbbell_pullover","name":"Dumbbell Pullover","videoUrl":""},
            {"id":"dumbbell_concentration_curl","name":"Dumbbell Concentration Curl","videoUrl":""},
            {"id":"barbell_upright_row_wide_grip","name":"Barbell Upright Row (Wide Grip)","videoUrl":""},
            {"id":"cable_high_curl_face_away","name":"Cable High Curl (Face-Away)","videoUrl":""}
          ]
        }
      ]
    },
    {
      "id":"routine_legs",
      "name":"Leg Routine",
      "days":[
        {
          "id":"legs_day",
          "name":"Leg Day",
          "exercises":[
            {"id":"barbell_squat","name":"Barbell Squat","videoUrl":""},
            {"id":"leg_press","name":"Leg Press","videoUrl":""},
            {"id":"abductor_extension","name":"Abductor Extension","videoUrl":""},
            {"id":"adductor_clamp","name":"Adductor Clamp","videoUrl":""},
            {"id":"leg_extension","name":"Leg Extension","videoUrl":""},
            {"id":"hamstring_curl","name":"Hamstring Curl","videoUrl":""},
            {"id":"seated_calf_raise","name":"Seated Calf Raise","videoUrl":""},
            {"id":"standing_calf_raise","name":"Standing Calf Raise","videoUrl":""}
          ]
        }
      ]
    }
  ]
};

function nowISODate() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60 * 1000);
  return local.toISOString().slice(0, 10);
}
function uid(prefix="id") {
  return prefix + "_" + Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}
function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function ytSearchUrl(exName){
  const q = encodeURIComponent(exName + " proper form tutorial");
  return "https://www.youtube.com/results?search_query=" + q;
}

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){
      return { routines: seedData.routines, logs: [] };
    }
    const st = JSON.parse(raw);
    if(!st?.routines || !st?.logs) throw new Error("bad state");
    return st;
  }catch(e){
    return { routines: seedData.routines, logs: [] };
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function setStatus(msg){
  const el = document.getElementById("statusText");
  el.textContent = msg;
}

let state = loadState();
let currentRoutineId = state.routines[0]?.id || "";
let currentDayId = state.routines[0]?.days?.[0]?.id || "";
let currentDate = nowISODate();
let filterText = "";

const els = {
  routineList: document.getElementById("routineList"),
  dayTabs: document.getElementById("dayTabs"),
  cards: document.getElementById("exerciseCards"),
  routineTitle: document.getElementById("currentRoutineTitle"),
  date: document.getElementById("workoutDate"),
  search: document.getElementById("searchBox"),
  btnAddRoutine: document.getElementById("btnAddRoutine"),
  btnAddExercise: document.getElementById("btnAddExercise"),
  btnExport: document.getElementById("btnExport"),
  fileImport: document.getElementById("fileImport"),
  btnInstall: document.getElementById("btnInstall"),
};

els.date.value = currentDate;

function getRoutine(rid){ return state.routines.find(r => r.id === rid); }
function getDay(r, did){ return r.days.find(d => d.id === did); }

function getLogsFor(exId){
  return state.logs
    .filter(l => l.date === currentDate && l.routineId === currentRoutineId && l.dayId === currentDayId && l.exerciseId === exId)
    .sort((a,b) => a.createdAt - b.createdAt);
}
function addLogEntry(entry){ state.logs.push(entry); saveState(); }
function deleteLogEntry(entryId){ state.logs = state.logs.filter(l => l.id !== entryId); saveState(); }

function renderRoutines(){
  els.routineList.innerHTML = "";
  state.routines.forEach(r => {
    const div = document.createElement("div");
    div.className = "routine" + (r.id === currentRoutineId ? " active" : "");
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<span>${r.days.length} day(s)</span><span>${r.days.reduce((n,d)=>n+d.exercises.length,0)} exercises</span>`;
    const name = document.createElement("div");
    name.className = "name";
    name.textContent = r.name;

    const delBtn = document.createElement("button");
    delBtn.className = "iconbtn danger";
    delBtn.textContent = "🗑️";
    delBtn.title = "Delete routine";
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if(confirm(`Delete routine "${r.name}"? This will NOT delete your past logs.`)){
        state.routines = state.routines.filter(x => x.id !== r.id);
        if(state.routines.length === 0){
          state.routines = [{id: uid("routine"), name:"My Routine", days:[{id: uid("day"), name:"Day 1", exercises:[]}]}];
        }
        currentRoutineId = state.routines[0].id;
        currentDayId = state.routines[0].days[0].id;
        saveState();
        renderAll();
        setStatus("Routine deleted.");
      }
    });
    meta.appendChild(delBtn);

    div.appendChild(name);
    div.appendChild(meta);
    div.addEventListener("click", () => {
      currentRoutineId = r.id;
      currentDayId = r.days[0]?.id || "";
      renderAll();
    });

    els.routineList.appendChild(div);
  });
}

function renderDays(){
  const r = getRoutine(currentRoutineId);
  if(!r) return;

  els.routineTitle.textContent = r.name;
  els.dayTabs.innerHTML = "";

  r.days.forEach(d => {
    const b = document.createElement("button");
    b.className = "tab" + (d.id === currentDayId ? " active" : "");
    b.textContent = d.name;
    b.addEventListener("click", () => {
      currentDayId = d.id;
      renderExercises();
    });
    els.dayTabs.appendChild(b);
  });

  const add = document.createElement("button");
  add.className = "tab";
  add.textContent = "+ Day";
  add.addEventListener("click", () => {
    const name = prompt("New day name (e.g., Day 4):");
    if(!name) return;
    r.days.push({id: uid("day"), name: name.trim(), exercises: []});
    saveState();
    currentDayId = r.days[r.days.length-1].id;
    renderAll();
    setStatus("Day added.");
  });
  els.dayTabs.appendChild(add);
}

function renderExercises(){
  const r = getRoutine(currentRoutineId);
  if(!r) return;
  const d = getDay(r, currentDayId);
  if(!d) return;

  const tpl = document.getElementById("exerciseCardTpl");
  const rowTpl = document.getElementById("logRowTpl");

  els.cards.innerHTML = "";

  const exList = d.exercises
    .filter(ex => ex.name.toLowerCase().includes(filterText.toLowerCase()));

  exList.forEach(ex => {
    const node = tpl.content.cloneNode(true);

    node.querySelector(".card-title").textContent = ex.name;

    const videoLink = node.querySelector(".videoLink");
    const url = (ex.videoUrl && ex.videoUrl.trim()) ? ex.videoUrl.trim() : ytSearchUrl(ex.name);
    videoLink.href = url;

    node.querySelector(".btnDeleteExercise").addEventListener("click", () => {
      if(confirm(`Remove "${ex.name}" from ${r.name} / ${d.name}?`)){
        d.exercises = d.exercises.filter(x => x.id !== ex.id);
        saveState();
        renderExercises();
        setStatus("Exercise removed.");
      }
    });

    const inpSets = node.querySelector(".inpSets");
    const inpReps = node.querySelector(".inpReps");
    const inpWeight = node.querySelector(".inpWeight");
    const inpTime = node.querySelector(".inpTime");
    node.querySelector(".btnAddSet").addEventListener("click", () => {
      const sets = Math.max(1, Math.floor(safeNum(inpSets.value)));
      const reps = Math.max(0, Math.floor(safeNum(inpReps.value)));
      const weight = Math.max(0, safeNum(inpWeight.value));
      const seconds = Math.max(0, Math.floor(safeNum(inpTime.value)));

      for(let i=0;i<sets;i++){
        addLogEntry({
          id: uid("log"),
          date: currentDate,
          routineId: currentRoutineId,
          dayId: currentDayId,
          exerciseId: ex.id,
          setNo: i+1,
          reps,
          weight,
          seconds,
          createdAt: Date.now()
        });
      }
      renderExercises();
      setStatus(`Saved ${sets} set(s) for "${ex.name}".`);
    });

    const logs = getLogsFor(ex.id);
    const tbody = node.querySelector(".logBody");

    let volume = 0;
    logs.forEach((l, idx) => {
      volume += l.reps * l.weight;
      const row = rowTpl.content.cloneNode(true);
      row.querySelector(".idx").textContent = String(idx+1);
      row.querySelector(".setno").textContent = String(l.setNo);
      row.querySelector(".reps").textContent = String(l.reps);
      row.querySelector(".weight").textContent = l.weight ? String(l.weight) : "—";
      row.querySelector(".time").textContent = l.seconds ? (l.seconds + " s") : "—";
      row.querySelector(".btnDeleteRow").addEventListener("click", () => {
        deleteLogEntry(l.id);
        renderExercises();
        setStatus("Entry deleted.");
      });
      tbody.appendChild(row);
    });

    node.querySelector(".log-meta").textContent = logs.length
      ? `Sets logged: ${logs.length} • Volume: ${Math.round(volume)}`
      : "No entries yet.";

    els.cards.appendChild(node);
  });

  if(exList.length === 0){
    const empty = document.createElement("div");
    empty.className = "status";
    empty.textContent = filterText ? "No matching exercises." : "No exercises yet. Tap “+ Exercise” to add.";
    els.cards.appendChild(empty);
  }
}

function renderAll(){ renderRoutines(); renderDays(); renderExercises(); }

function addRoutine(){
  const name = prompt("Routine name (e.g., Upper Body):");
  if(!name) return;

  const daysStr = prompt("How many days in this routine? (default 1)", "1");
  const n = Math.max(1, Math.min(14, Math.floor(safeNum(daysStr || "1"))));

  const routine = { id: uid("routine"), name: name.trim(), days: [] };
  for(let i=1;i<=n;i++){
    routine.days.push({ id: uid("day"), name: `Day ${i}`, exercises: [] });
  }
  state.routines.unshift(routine);
  currentRoutineId = routine.id;
  currentDayId = routine.days[0].id;
  saveState();
  renderAll();
  setStatus("Routine added.");
}

function addExercise(){
  const r = getRoutine(currentRoutineId);
  if(!r) return;
  const d = getDay(r, currentDayId);
  if(!d) return;

  const name = prompt("Exercise name:");
  if(!name) return;

  const videoUrl = prompt("Video link (optional). Leave empty to use a YouTube search link:") || "";
  d.exercises.unshift({ id: uid("ex"), name: name.trim(), videoUrl: videoUrl.trim() });

  saveState();
  renderExercises();
  setStatus("Exercise added.");
}

function exportData(){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "gymtracker-backup.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setStatus("Exported backup JSON.");
}

function importData(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const obj = JSON.parse(String(reader.result));
      if(!obj?.routines || !obj?.logs) throw new Error("Invalid file");
      state = obj;
      currentRoutineId = state.routines[0]?.id || "";
      currentDayId = state.routines[0]?.days?.[0]?.id || "";
      saveState();
      renderAll();
      setStatus("Imported data.");
    }catch(e){
      alert("Could not import. Please choose a valid gymtracker-backup.json file.");
    }
  };
  reader.readAsText(file);
}

els.btnAddRoutine.addEventListener("click", addRoutine);
els.btnAddExercise.addEventListener("click", addExercise);
els.btnExport.addEventListener("click", exportData);
els.fileImport.addEventListener("change", (e) => {
  const f = e.target.files?.[0];
  if(f) importData(f);
  e.target.value = "";
});

els.date.addEventListener("change", () => {
  currentDate = els.date.value || nowISODate();
  renderExercises();
  setStatus("Date changed.");
});

els.search.addEventListener("input", () => {
  filterText = els.search.value || "";
  renderExercises();
});

// PWA install prompt (Chrome/Android)
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  els.btnInstall.hidden = false;
});
els.btnInstall.addEventListener("click", async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  els.btnInstall.hidden = true;
});

// Service worker registration
if("serviceWorker" in navigator){
  window.addEventListener("load", async () => {
    try{
      await navigator.serviceWorker.register("./sw.js");
      setStatus("Offline ready.");
    }catch(e){
      setStatus("Service worker failed to register (offline may not work).");
    }
  });
}

renderAll();