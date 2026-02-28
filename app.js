const ROUTE_COLORS = {
  A: "#ff9f43",
  B: "#54a0ff",
  C: "#9b59b6",
  D: "#2ecc71",
  E: "#ff6b6b",
  G: "#48dbfb",
  H: "#5f6caf",
  I: "#ff9ff3",
  J: "#1dd1a1",
  K: "#8ddf84"
};

const STOP_META = {
  fcvEast: { label: "FCV East", icon: "🏠" },
  fcvWest: { label: "FCV West", icon: "🏠" },

  superTarget: { label: "Super Target", icon: "🛒" },
  castConnection: { label: "Cast Connection", icon: "🎟️" },
  walmart: { label: "Walmart", icon: "🛍️" },
  target: { label: "Target", icon: "🛒" },

  hollywoodStudios: { label: "Hollywood Studios", icon: "🎬" },
  espnWideWorld: { label: "ESPN Wide World of Sports", icon: "🏟️" },
  blizzardBeach: { label: "Blizzard Beach", icon: "❄️" },
  coronadoSprings: { label: "Coronado Springs", icon: "🏨" },

  epcot: { label: "EPCOT", icon: "🌐" },

  animalKingdom: { label: "Animal Kingdom", icon: "🦁" },
  animalKingdomCostuming: { label: "Animal Kingdom Costuming", icon: "🧵" },
  animalKingdomLodge: { label: "Animal Kingdom Lodge", icon: "🏨" },
  animalKingdomParkCastServices: { label: "Animal Kingdom Park Cast Services", icon: "🚌" },
  allStarSports: { label: "All-Star Sports", icon: "🏈" },
  allStarMusic: { label: "All-Star Music", icon: "🎵" },
  allStarMovies: { label: "All-Star Movies", icon: "🎞️" },

  magicKingdomWestClock: { label: "Magic Kingdom (West Clock)", icon: "🏰" },
  magicKingdomTTC: { label: "Magic Kingdom (TTC)", icon: "🏰" },

  typhoonLagoonCastServices: { label: "Typhoon Lagoon (Cast Services)", icon: "🌊" },
  typhoonLagoonGuestEntrance: { label: "Typhoon Lagoon (Guest Entrance)", icon: "🌊" },
  caribbeanBeachOldPortRoyale: { label: "Caribbean Beach (Old Port Royale)", icon: "🏝️" },
  popCenturyCastServices: { label: "Pop Century (Cast Services)", icon: "🏨" },
  popCenturyPorteCochere: { label: "Pop Century (Porte-cochere)", icon: "🏨" },
  artOfAnimationPorteCochere: { label: "Art of Animation (Porte-cochere)", icon: "🎨" },

  portOrleansFrenchQuarterLoadingDock: { label: "Port Orleans French Quarter (Loading Dock)", icon: "🛶" },
  portOrleansRiversidePorteCochere: { label: "Port Orleans Riverside (Porte-cochere)", icon: "🛶" },
  portOrleansCastServices: { label: "Port Orleans (Cast Services)", icon: "🚌" },

  oldKeyWestHospitalityHouse: { label: "Old Key West (Hospitality House)", icon: "🏨" },
  saratogaSpringsCastServices: { label: "Saratoga Springs (Cast Services)", icon: "🐎" },
  saratogaSpringsTennisCourt: { label: "Saratoga Springs (Tennis Court)", icon: "🎾" },
  disneySpringsCastServices: { label: "Disney Springs (Cast Services)", icon: "🛍️" },

  rivieraBeforeWDWStop: { label: "Riviera (Before WDW Stop)", icon: "🏨" },
  swanAndDolphin: { label: "Swan and Dolphin", icon: "🦢" },
  yachtAndBeachClub: { label: "Yacht & Beach Club", icon: "⛵" },
  boardwalk: { label: "Boardwalk", icon: "🎡" },

  fortWildernessFrontDesk: { label: "Fort Wilderness (Front Desk)", icon: "🌲" },
  wildernessLodgeLynxStop: { label: "Wilderness Lodge (Lynx Stop)", icon: "🪵" },
  contemporaryLynxStop: { label: "Contemporary (Lynx Stop)", icon: "🏨" },
  polynesianLynxStop: { label: "Polynesian (Lynx Stop)", icon: "🌺" },
  grandFloridianCastParking: { label: "Grand Floridian (Cast Parking)", icon: "🏨" }
};

const PREFERRED_STOP_ORDER = [
  "fcvEast", "fcvWest",
  "superTarget", "target", "walmart", "castConnection",
  "hollywoodStudios", "espnWideWorld", "blizzardBeach", "coronadoSprings",
  "epcot",
  "animalKingdom", "animalKingdomCostuming", "animalKingdomLodge", "animalKingdomParkCastServices",
  "allStarSports", "allStarMusic", "allStarMovies",
  "magicKingdomWestClock", "magicKingdomTTC",
  "typhoonLagoonCastServices", "typhoonLagoonGuestEntrance", "caribbeanBeachOldPortRoyale",
  "popCenturyCastServices", "popCenturyPorteCochere", "artOfAnimationPorteCochere",
  "portOrleansFrenchQuarterLoadingDock", "portOrleansRiversidePorteCochere", "portOrleansCastServices",
  "oldKeyWestHospitalityHouse", "saratogaSpringsCastServices", "saratogaSpringsTennisCourt", "disneySpringsCastServices",
  "rivieraBeforeWDWStop", "swanAndDolphin", "yachtAndBeachClub", "boardwalk",
  "fortWildernessFrontDesk", "wildernessLodgeLynxStop", "contemporaryLynxStop", "polynesianLynxStop", "grandFloridianCastParking"
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MINUTES_PER_DAY = 1440;
const MIN_TRANSFER_MINUTES = 3;
const MAX_LAYOVER_MINUTES = 120;
const MAX_TOTAL_MINUTES = 280;
const PAST_SELECTION_GRACE_MINUTES = 2;
const PLANNER_TIMEZONE = "America/New_York";

const RAW_RUNS = Array.isArray(window.FCV_SCHEDULE_RUNS) ? window.FCV_SCHEDULE_RUNS : [];

let selectedMode = "arriveBy";
let countdownInterval = null;
let timezoneClockInterval = null;

const modeArriveButton = document.getElementById("mode-arrive");
const modeLeaveButton = document.getElementById("mode-leave");
const originSelect = document.getElementById("originSelect");
const destinationSelect = document.getElementById("destinationSelect");
const timeInput = document.getElementById("timeInput");
const timeLabel = document.getElementById("timeLabel");
const timezoneClock = document.getElementById("timezoneClock");
const searchButton = document.getElementById("searchButton");
const resultSection = document.getElementById("resultSection");
const routeScheduleSelect = document.getElementById("routeScheduleSelect");
const routeScheduleMeta = document.getElementById("routeScheduleMeta");
const routeScheduleList = document.getElementById("routeScheduleList");

function parseClockToMinutes(clock) {
  const [hour, minute] = clock.split(":").map(Number);
  return (hour * 60) + minute;
}

function formatClockFromMinutes(totalMinutes) {
  const wrapped = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour24 = Math.floor(wrapped / 60);
  const minute = wrapped % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = ((hour24 + 11) % 12) + 1;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function getPlannerTimeParts(date = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: PLANNER_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(date);
  const map = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      map[part.type] = Number(part.value);
    }
  });

  return {
    year: map.year,
    month: map.month,
    day: map.day,
    hour: map.hour,
    minute: map.minute,
    second: map.second
  };
}

function plannerDateFromParts(parts) {
  return new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour ?? 0,
    parts.minute ?? 0,
    parts.second ?? 0,
    0
  ));
}

function getPlannerNow() {
  return plannerDateFromParts(getPlannerTimeParts());
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + (minutes * 60 * 1000));
}

function addDays(date, days) {
  return addMinutes(date, days * MINUTES_PER_DAY);
}

function startOfDay(date) {
  const day = new Date(date);
  day.setUTCHours(0, 0, 0, 0);
  return day;
}

function minutesBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

function normalizeRuns(rawRuns) {
  return rawRuns
    .filter((run) => run && run.routeCode && Array.isArray(run.stops) && run.stops.length >= 2)
    .map((run, index) => ({
      runId: `${run.routeCode}-${run.tripCode}-${index}`,
      routeCode: run.routeCode,
      tripCode: run.tripCode,
      serviceDays: Array.isArray(run.serviceDays) ? run.serviceDays : [0, 1, 2, 3, 4, 5, 6],
      stops: run.stops
        .filter((stop) => stop && stop.stopId && typeof stop.time === "string")
        .map((stop) => ({
          stopId: stop.stopId,
          time: stop.time,
          minutes: parseClockToMinutes(stop.time)
        }))
    }))
    .filter((run) => run.stops.length >= 2);
}

const SCHEDULE_RUNS = normalizeRuns(RAW_RUNS);

function stopLabel(stopId) {
  if (STOP_META[stopId]) {
    return STOP_META[stopId].label;
  }
  return stopId.replace(/([A-Z])/g, " $1").replace(/^./, (ch) => ch.toUpperCase()).trim();
}

function stopIcon(stopId) {
  return STOP_META[stopId]?.icon || "🚌";
}

function orderedStopIds() {
  const seen = new Set();
  const inData = [];

  for (const run of SCHEDULE_RUNS) {
    for (const stop of run.stops) {
      if (!seen.has(stop.stopId)) {
        seen.add(stop.stopId);
        inData.push(stop.stopId);
      }
    }
  }

  const rank = new Map(PREFERRED_STOP_ORDER.map((id, index) => [id, index]));
  return inData.sort((a, b) => {
    const ar = rank.has(a) ? rank.get(a) : 9999;
    const br = rank.has(b) ? rank.get(b) : 9999;
    if (ar !== br) {
      return ar - br;
    }
    return stopLabel(a).localeCompare(stopLabel(b));
  });
}

const PLANNER_STOP_IDS = orderedStopIds();

function buildRunTimeline(run, serviceDate) {
  let previousMinutes = -1;
  let dayOffset = 0;

  return run.stops.map((stop, index) => {
    if (index > 0 && stop.minutes < previousMinutes) {
      dayOffset += MINUTES_PER_DAY;
    }
    previousMinutes = stop.minutes;

    const absoluteMinutes = stop.minutes + dayOffset;
    return {
      ...stop,
      absoluteMinutes,
      date: addMinutes(serviceDate, absoluteMinutes)
    };
  });
}

function expandEdgeInstances(targetDate) {
  const dayStart = startOfDay(targetDate);
  const lowerBound = addMinutes(targetDate, -36 * 60);
  const upperBound = addMinutes(targetDate, 48 * 60);
  const edges = [];

  for (let dayOffset = -1; dayOffset <= 2; dayOffset += 1) {
    const serviceDate = addDays(dayStart, dayOffset);
    const weekday = serviceDate.getUTCDay();

    for (const run of SCHEDULE_RUNS) {
      if (!run.serviceDays.includes(weekday)) {
        continue;
      }

      const timeline = buildRunTimeline(run, serviceDate);
      for (let i = 0; i < timeline.length - 1; i += 1) {
        for (let j = i + 1; j < timeline.length; j += 1) {
          const departure = timeline[i].date;
          if (departure < lowerBound || departure > upperBound) {
            continue;
          }

          edges.push({
            runId: run.runId,
            routeCode: run.routeCode,
            tripCode: run.tripCode,
            from: timeline[i].stopId,
            to: timeline[j].stopId,
            departure,
            arrival: timeline[j].date,
            path: timeline.slice(i, j + 1).map((node) => ({
              stopId: node.stopId,
              date: node.date
            }))
          });
        }
      }
    }
  }

  return edges;
}

function buildItineraries(origin, destination, targetDate) {
  const edges = expandEdgeInstances(targetDate);
  const byFrom = new Map();
  const itineraries = [];

  for (const edge of edges) {
    if (!byFrom.has(edge.from)) {
      byFrom.set(edge.from, []);
    }
    byFrom.get(edge.from).push(edge);

    if (edge.from === origin && edge.to === destination) {
      itineraries.push({
        legs: [edge],
        departure: edge.departure,
        arrival: edge.arrival,
        transferStop: null
      });
    }
  }

  const firstLegs = byFrom.get(origin) || [];
  for (const leg1 of firstLegs) {
    if (leg1.to === destination) {
      continue;
    }
    const secondLegs = byFrom.get(leg1.to) || [];
    for (const leg2 of secondLegs) {
      if (leg2.to !== destination) {
        continue;
      }

      const layover = minutesBetween(leg1.arrival, leg2.departure);
      if (layover < MIN_TRANSFER_MINUTES || layover > MAX_LAYOVER_MINUTES) {
        continue;
      }

      const totalDuration = minutesBetween(leg1.departure, leg2.arrival);
      if (totalDuration > MAX_TOTAL_MINUTES) {
        continue;
      }

      itineraries.push({
        legs: [leg1, leg2],
        departure: leg1.departure,
        arrival: leg2.arrival,
        transferStop: leg1.to
      });
    }
  }

  const seen = new Set();
  return itineraries
    .filter((itinerary) => {
      const key = itinerary.legs
        .map((leg) => `${leg.runId}-${leg.from}-${leg.to}-${leg.departure.getTime()}`)
        .join("|");
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .sort((a, b) => {
      if (a.departure.getTime() !== b.departure.getTime()) {
        return a.departure - b.departure;
      }
      return a.arrival - b.arrival;
    });
}

function selectPlan(itineraries, targetDate, mode) {
  if (itineraries.length === 0) {
    return {
      best: null,
      alternatives: [],
      advisory: "No route option found in this time window."
    };
  }

  if (mode === "leaveAt") {
    const upcoming = itineraries.filter((item) => item.departure >= targetDate);
    if (upcoming.length > 0) {
      return { best: upcoming[0], alternatives: upcoming.slice(1, 4), advisory: null };
    }
    return {
      best: itineraries[0],
      alternatives: itineraries.slice(1, 4),
      advisory: "No more trips after that time. Showing the next available option."
    };
  }

  const onOrBefore = itineraries
    .filter((item) => item.arrival <= targetDate)
    .sort((a, b) => b.departure - a.departure);

  if (onOrBefore.length > 0) {
    return { best: onOrBefore[0], alternatives: onOrBefore.slice(1, 4), advisory: null };
  }

  const after = [...itineraries].sort((a, b) => a.arrival - b.arrival);
  return {
    best: after[0],
    alternatives: after.slice(1, 4),
    advisory: "Nothing arrives by that time. Showing the soonest arrival after it."
  };
}

function formatTime(date) {
  return formatClockFromMinutes((date.getUTCHours() * 60) + date.getUTCMinutes());
}

function formatDay(date) {
  return WEEKDAY_LABELS[date.getUTCDay()];
}

function routeBadge(routeCode) {
  const color = ROUTE_COLORS[routeCode] || "#a4b0be";
  return `<span class="route-badge" style="background:${color}">Route ${routeCode}</span>`;
}

function itineraryTimingMessage(itinerary, targetDate, mode) {
  if (mode === "leaveAt") {
    const wait = minutesBetween(targetDate, itinerary.departure);
    if (wait <= 0) {
      return { text: "Board now", level: "good" };
    }
    return { text: `Departs in ${wait} min`, level: "good" };
  }
  const diff = minutesBetween(targetDate, itinerary.arrival);
  if (diff <= 0) {
    return { text: `Arrives ${Math.abs(diff)} min early`, level: "good" };
  }
  return { text: `Arrives ${diff} min after target`, level: "warning" };
}

function summarizeViaStops(path) {
  const middle = path.slice(1, -1).map((node) => stopLabel(node.stopId));
  if (middle.length === 0) {
    return "";
  }
  if (middle.length <= 2) {
    return `via ${middle.join(" • ")}`;
  }
  return `via ${middle.slice(0, 2).join(" • ")} +${middle.length - 2} more`;
}

function renderLeg(leg, index) {
  const viaSummary = summarizeViaStops(leg.path);
  return `
    <div class="leg-row">
      <strong>Leg ${index + 1}:</strong>
      Route ${leg.routeCode} (${leg.tripCode}) ·
      ${stopLabel(leg.from)} ${formatTime(leg.departure)} → ${stopLabel(leg.to)} ${formatTime(leg.arrival)}
      ${viaSummary ? `<br><span class="leg-via">${viaSummary}</span>` : ""}
    </div>
  `;
}

function renderItineraryCard(itinerary, title, mode, targetDate, isBest) {
  const timing = itineraryTimingMessage(itinerary, targetDate, mode);
  const totalMinutes = minutesBetween(itinerary.departure, itinerary.arrival);
  const routeCodes = [...new Set(itinerary.legs.map((leg) => leg.routeCode))];
  const badges = routeCodes.map((code) => routeBadge(code)).join("");
  const transferText = itinerary.transferStop ? `Transfer at ${stopLabel(itinerary.transferStop)}` : "No transfer";

  return `
    <article class="result-card">
      <header class="result-header">
        <h3 class="result-title">${title}</h3>
        <div class="route-badges">${badges}</div>
      </header>
      <div class="trip-grid">
        <div class="label">Depart</div>
        <div class="value">${stopLabel(itinerary.legs[0].from)} · ${formatTime(itinerary.departure)} (${formatDay(itinerary.departure)})</div>
        <div class="label">Arrive</div>
        <div class="value">${stopLabel(itinerary.legs[itinerary.legs.length - 1].to)} · ${formatTime(itinerary.arrival)} (${formatDay(itinerary.arrival)})</div>
        <div class="label">Trip time</div>
        <div class="value">${totalMinutes} min</div>
        <div class="label">Routing</div>
        <div class="value">${transferText}</div>
      </div>
      <div class="timing ${timing.level}">${timing.text}</div>
      ${isBest ? `<div class="legs">${itinerary.legs.map((leg, idx) => renderLeg(leg, idx)).join("")}</div>` : ""}
    </article>
  `;
}

function clearCountdownTimer() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

function startCountdownForBest(bestItinerary) {
  clearCountdownTimer();
  if (!bestItinerary || selectedMode !== "leaveAt") {
    return;
  }

  const update = () => {
    const now = getPlannerNow();
    const remaining = minutesBetween(now, bestItinerary.departure);
    const el = document.getElementById("liveCountdown");
    if (!el) {
      clearCountdownTimer();
      return;
    }
    if (remaining <= 0) {
      el.textContent = "Board now";
      return;
    }
    el.textContent = `Live countdown: ${remaining} min until departure`;
  };

  update();
  countdownInterval = setInterval(update, 15000);
}

function renderResults(plan, targetDate) {
  if (!plan.best) {
    resultSection.innerHTML = `<div class="empty">No route found for that request. Try another time or stop.</div>`;
    clearCountdownTimer();
    return;
  }

  let html = "";
  if (plan.advisory) {
    html += `<div class="result-card"><p class="advisory">${plan.advisory}</p></div>`;
  }

  html += renderItineraryCard(plan.best, "Best Option", selectedMode, targetDate, true);
  if (selectedMode === "leaveAt") {
    html += `<div class="result-card"><div id="liveCountdown" class="timing good"></div></div>`;
  }

  if (plan.alternatives.length > 0) {
    plan.alternatives.forEach((alt, index) => {
      html += renderItineraryCard(alt, `Alternative ${index + 1}`, selectedMode, targetDate, false);
    });
  }

  resultSection.innerHTML = html;
  startCountdownForBest(plan.best);
}

function parseTargetDateTime() {
  const timeValue = timeInput.value;
  if (!timeValue) {
    return null;
  }

  const [hour, minute] = timeValue.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  const now = getPlannerNow();
  let target = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    hour,
    minute,
    0,
    0
  ));

  if (target < addMinutes(now, -PAST_SELECTION_GRACE_MINUTES)) {
    target = addDays(target, 1);
  }
  return target;
}

function formatTimeInput(date) {
  return `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
}

function setTargetTime(date) {
  timeInput.value = formatTimeInput(date);
}

function updateTimezoneClock() {
  const now = getPlannerNow();
  timezoneClock.textContent = `Current Winter Garden time: ${formatDay(now)} ${formatTime(now)} (ET)`;
}

function setMode(mode) {
  selectedMode = mode;
  modeArriveButton.classList.toggle("active", mode === "arriveBy");
  modeLeaveButton.classList.toggle("active", mode === "leaveAt");
  timeLabel.textContent = mode === "arriveBy" ? "Need to arrive by" : "Plan to leave at";
}

function runPlanner() {
  const origin = originSelect.value;
  const destination = destinationSelect.value;

  if (!origin || !destination) {
    resultSection.innerHTML = `<div class="empty">Choose both origin and destination.</div>`;
    clearCountdownTimer();
    return;
  }
  if (origin === destination) {
    resultSection.innerHTML = `<div class="empty">Origin and destination are the same. Pick a different destination.</div>`;
    clearCountdownTimer();
    return;
  }

  const targetDate = parseTargetDateTime();
  if (!targetDate) {
    resultSection.innerHTML = `<div class="empty">Choose a valid time.</div>`;
    clearCountdownTimer();
    return;
  }

  const itineraries = buildItineraries(origin, destination, targetDate);
  const plan = selectPlan(itineraries, targetDate, selectedMode);
  renderResults(plan, targetDate);
}

function populateOriginOptions() {
  originSelect.innerHTML = PLANNER_STOP_IDS
    .map((stopId) => `<option value="${stopId}">${stopIcon(stopId)} ${stopLabel(stopId)}</option>`)
    .join("");
}

function populateDestinationOptions() {
  const origin = originSelect.value;
  const previous = destinationSelect.value;
  destinationSelect.innerHTML = PLANNER_STOP_IDS
    .filter((stopId) => stopId !== origin)
    .map((stopId) => `<option value="${stopId}">${stopIcon(stopId)} ${stopLabel(stopId)}</option>`)
    .join("");

  if (previous && previous !== origin) {
    destinationSelect.value = previous;
  }
  if (!destinationSelect.value) {
    destinationSelect.value = origin === "fcvEast" ? "epcot" : "fcvEast";
  }
}

function routeCodes() {
  return [...new Set(SCHEDULE_RUNS.map((run) => run.routeCode))].sort();
}

function formatServiceDaySet(days) {
  const sorted = [...days].sort((a, b) => a - b);
  const key = sorted.join(",");
  if (key === "0,1,2,3,4,5,6") {
    return "Daily";
  }
  if (key === "1,2") {
    return "Mon-Tue";
  }
  if (key === "0,3,4,5,6") {
    return "Wed-Sun";
  }
  return sorted.map((day) => WEEKDAY_LABELS[day]).join(",");
}

function populateRouteScheduleOptions() {
  routeScheduleSelect.innerHTML = routeCodes()
    .map((code) => `<option value="${code}">Route ${code}</option>`)
    .join("");
  routeScheduleSelect.value = "C";
}

function renderRouteSchedule() {
  const routeCode = routeScheduleSelect.value;
  const now = getPlannerNow();
  const weekday = now.getUTCDay();

  const runsForRoute = SCHEDULE_RUNS.filter((run) => run.routeCode === routeCode);
  const dayRows = runsForRoute
    .filter((run) => run.serviceDays.includes(weekday))
    .sort((a, b) => {
      if (a.stops[0].minutes !== b.stops[0].minutes) {
        return a.stops[0].minutes - b.stops[0].minutes;
      }
      return a.tripCode.localeCompare(b.tripCode);
    });

  const servicePatterns = [...new Set(runsForRoute.map((run) => formatServiceDaySet(run.serviceDays)))];
  routeScheduleMeta.textContent = `Route ${routeCode} service: ${servicePatterns.join(" / ")} · Showing ${WEEKDAY_LABELS[weekday]} in Winter Garden time (ET).`;

  if (dayRows.length === 0) {
    routeScheduleList.innerHTML = `<div class="empty">No trips on this route for today.</div>`;
    return;
  }

  routeScheduleList.innerHTML = dayRows.map((run) => {
    const first = run.stops[0];
    const last = run.stops[run.stops.length - 1];
    const path = run.stops
      .map((stop) => `<span class="schedule-stop"><strong>${formatClockFromMinutes(stop.minutes)}</strong> ${stopLabel(stop.stopId)}</span>`)
      .join(`<span class="schedule-arrow">→</span>`);

    return `
      <div class="schedule-row">
        <div class="schedule-time">${formatClockFromMinutes(first.minutes)} → ${formatClockFromMinutes(last.minutes)}</div>
        <div class="schedule-main">Trip ${run.tripCode}</div>
        <div class="schedule-sub">${path}</div>
      </div>
    `;
  }).join("");
}

function handleQuickAction(value) {
  const now = getPlannerNow();
  if (value === "now") {
    setMode("leaveAt");
    setTargetTime(now);
    runPlanner();
    return;
  }

  if (value === "tonight") {
    const tonight = new Date(now);
    tonight.setUTCHours(22, 0, 0, 0);
    if (tonight < now) {
      tonight.setUTCDate(tonight.getUTCDate() + 1);
    }
    setTargetTime(tonight);
    runPlanner();
    return;
  }

  const addMinutesValue = Number(value.replace("+", ""));
  if (!Number.isNaN(addMinutesValue)) {
    setMode("leaveAt");
    setTargetTime(addMinutes(now, addMinutesValue));
    runPlanner();
  }
}

function attachEvents() {
  modeArriveButton.addEventListener("click", () => {
    setMode("arriveBy");
    runPlanner();
  });
  modeLeaveButton.addEventListener("click", () => {
    setMode("leaveAt");
    runPlanner();
  });

  originSelect.addEventListener("change", () => {
    populateDestinationOptions();
    runPlanner();
  });
  destinationSelect.addEventListener("change", runPlanner);
  timeInput.addEventListener("change", runPlanner);
  searchButton.addEventListener("click", runPlanner);
  routeScheduleSelect.addEventListener("change", renderRouteSchedule);

  document.querySelectorAll(".quick-btn").forEach((button) => {
    button.addEventListener("click", () => handleQuickAction(button.dataset.quick));
  });
}

function initialize() {
  if (SCHEDULE_RUNS.length === 0) {
    resultSection.innerHTML = `<div class="empty">Schedule data is unavailable. Please refresh.</div>`;
    return;
  }

  populateOriginOptions();
  originSelect.value = PLANNER_STOP_IDS.includes("fcvEast") ? "fcvEast" : PLANNER_STOP_IDS[0];
  populateDestinationOptions();
  if (PLANNER_STOP_IDS.includes("epcot")) {
    destinationSelect.value = "epcot";
  }

  populateRouteScheduleOptions();
  setMode("arriveBy");
  setTargetTime(getPlannerNow());
  updateTimezoneClock();
  renderRouteSchedule();
  attachEvents();
  runPlanner();

  if (timezoneClockInterval) {
    clearInterval(timezoneClockInterval);
  }
  timezoneClockInterval = setInterval(() => {
    updateTimezoneClock();
    renderRouteSchedule();
  }, 30000);
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Service worker registration failure should not block app usage.
    });
  });
}

initialize();
