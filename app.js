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
  walmart: { label: "Walmart", icon: "🛍️" },
  hollywoodStudios: { label: "Hollywood Studios", icon: "🎬" },
  epcot: { label: "EPCOT", icon: "🌐" },
  animalKingdom: { label: "Animal Kingdom", icon: "🦁" },
  magicKingdom: { label: "Magic Kingdom", icon: "🏰" },
  typhoonLagoon: { label: "Typhoon Lagoon", icon: "🌊" },
  portOrleans: { label: "Port Orleans", icon: "🛶" },
  disneySprings: { label: "Disney Springs", icon: "🛍️" },
  rivieraBoardwalk: { label: "Riviera / Boardwalk", icon: "🚎" },
  monorailResorts: { label: "Monorail Resorts", icon: "🚝" }
};

const STOP_ORDER = [
  "fcvEast",
  "fcvWest",
  "superTarget",
  "walmart",
  "hollywoodStudios",
  "epcot",
  "animalKingdom",
  "magicKingdom",
  "typhoonLagoon",
  "portOrleans",
  "disneySprings",
  "rivieraBoardwalk",
  "monorailResorts"
];

const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];
const MON_TUE = [1, 2];
const WED_SUN = [0, 3, 4, 5, 6];
const MIN_TRANSFER_MINUTES = 3;
const MAX_LAYOVER_MINUTES = 120;
const MAX_TOTAL_MINUTES = 280;
const MINUTES_PER_DAY = 1440;

let selectedMode = "arriveBy";
let countdownInterval = null;

const modeArriveButton = document.getElementById("mode-arrive");
const modeLeaveButton = document.getElementById("mode-leave");
const originSelect = document.getElementById("originSelect");
const destinationSelect = document.getElementById("destinationSelect");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const timeLabel = document.getElementById("timeLabel");
const searchButton = document.getElementById("searchButton");
const resultSection = document.getElementById("resultSection");

const SCHEDULE_TRIPS = buildScheduleTrips();

function parseClockToMinutes(clock) {
  const [hour, minute] = clock.split(":").map(Number);
  return (hour * 60) + minute;
}

function clockOffset(clock, minuteOffset) {
  const base = parseClockToMinutes(clock);
  const wrapped = ((base + minuteOffset) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function makeTrip(routeCode, tripCode, from, to, departureClock, arrivalClock, serviceDays = EVERY_DAY) {
  const departureMinutes = parseClockToMinutes(departureClock);
  let arrivalMinutes = parseClockToMinutes(arrivalClock);
  if (arrivalMinutes < departureMinutes) {
    arrivalMinutes += MINUTES_PER_DAY;
  }
  return {
    routeCode,
    tripCode,
    from,
    to,
    departureMinutes,
    arrivalMinutes,
    serviceDays
  };
}

function buildEastOriginRoute(routeCode, destination, rows, serviceDays = EVERY_DAY) {
  const trips = [];
  rows.forEach((row) => {
    const westReturn = clockOffset(row.eastReturn, -8);

    trips.push(makeTrip(routeCode, row.code, "fcvEast", destination, row.east, row.destination, serviceDays));
    trips.push(makeTrip(routeCode, row.code, "fcvWest", destination, row.west, row.destination, serviceDays));
    trips.push(makeTrip(routeCode, row.code, destination, "fcvWest", row.destination, westReturn, serviceDays));
    trips.push(makeTrip(routeCode, row.code, destination, "fcvEast", row.destination, row.eastReturn, serviceDays));
  });
  return trips;
}

function buildWestOriginRoute(routeCode, destination, rows, serviceDays = EVERY_DAY) {
  const trips = [];
  rows.forEach((row) => {
    const eastReturn = clockOffset(row.westReturn, -8);

    trips.push(makeTrip(routeCode, row.code, "fcvWest", destination, row.west, row.destination, serviceDays));
    trips.push(makeTrip(routeCode, row.code, "fcvEast", destination, row.east, row.destination, serviceDays));
    trips.push(makeTrip(routeCode, row.code, destination, "fcvEast", row.destination, eastReturn, serviceDays));
    trips.push(makeTrip(routeCode, row.code, destination, "fcvWest", row.destination, row.westReturn, serviceDays));
  });
  return trips;
}

function buildScheduleTrips() {
  const all = [];

  all.push(
    ...buildEastOriginRoute("A", "superTarget", [
      { code: "A1", east: "10:00", west: "10:08", destination: "10:21", eastReturn: "10:43" },
      { code: "A1", east: "10:50", west: "10:58", destination: "11:11", eastReturn: "11:33" },
      { code: "A1", east: "11:40", west: "11:48", destination: "12:01", eastReturn: "12:23" },
      { code: "A1", east: "12:30", west: "12:38", destination: "12:51", eastReturn: "13:13" },
      { code: "A1", east: "13:20", west: "13:28", destination: "13:41", eastReturn: "14:03" },
      { code: "A1", east: "14:10", west: "14:18", destination: "14:31", eastReturn: "14:53" },
      { code: "A1", east: "15:00", west: "15:08", destination: "15:21", eastReturn: "15:43" },
      { code: "A2", east: "15:50", west: "15:58", destination: "16:11", eastReturn: "16:33" },
      { code: "A2", east: "16:40", west: "16:48", destination: "17:01", eastReturn: "17:23" },
      { code: "A2", east: "17:30", west: "17:38", destination: "17:51", eastReturn: "18:13" },
      { code: "A2", east: "18:20", west: "18:28", destination: "18:41", eastReturn: "19:03" },
      { code: "A2", east: "19:10", west: "19:18", destination: "19:31", eastReturn: "19:53" },
      { code: "A2", east: "20:00", west: "20:08", destination: "20:21", eastReturn: "20:43" }
    ], MON_TUE),
    ...buildEastOriginRoute("A", "walmart", [
      { code: "A1", east: "10:00", west: "10:08", destination: "10:33", eastReturn: "10:53" },
      { code: "A1", east: "11:00", west: "11:08", destination: "11:33", eastReturn: "11:53" },
      { code: "A1", east: "12:00", west: "12:08", destination: "12:33", eastReturn: "12:53" },
      { code: "A1", east: "13:00", west: "13:08", destination: "13:33", eastReturn: "13:53" },
      { code: "A1", east: "14:00", west: "14:08", destination: "14:33", eastReturn: "14:53" },
      { code: "A1", east: "15:00", west: "15:08", destination: "15:33", eastReturn: "15:53" },
      { code: "A2", east: "16:00", west: "16:08", destination: "16:33", eastReturn: "16:53" },
      { code: "A2", east: "17:00", west: "17:08", destination: "17:33", eastReturn: "17:53" },
      { code: "A2", east: "18:00", west: "18:08", destination: "18:33", eastReturn: "18:53" },
      { code: "A2", east: "19:00", west: "19:08", destination: "19:33", eastReturn: "19:53" },
      { code: "A2", east: "20:00", west: "20:08", destination: "20:33", eastReturn: "20:53" }
    ], WED_SUN),
    ...buildEastOriginRoute("B", "hollywoodStudios", [
      { code: "B1", east: "4:00", west: "4:08", destination: "4:24", eastReturn: "4:59" },
      { code: "B1", east: "5:00", west: "5:08", destination: "5:24", eastReturn: "5:59" },
      { code: "B1", east: "6:03", west: "6:11", destination: "6:27", eastReturn: "7:02" },
      { code: "B1", east: "7:06", west: "7:14", destination: "7:30", eastReturn: "8:05" },
      { code: "B1", east: "8:09", west: "8:17", destination: "8:33", eastReturn: "9:08" },
      { code: "B1", east: "9:12", west: "9:20", destination: "9:36", eastReturn: "10:11" },
      { code: "B1", east: "10:15", west: "10:23", destination: "10:39", eastReturn: "11:14" },
      { code: "B1", east: "11:18", west: "11:26", destination: "11:42", eastReturn: "12:17" },
      { code: "B2", east: "12:51", west: "12:59", destination: "13:15", eastReturn: "13:50" },
      { code: "B3", east: "14:27", west: "14:35", destination: "14:51", eastReturn: "15:26" },
      { code: "B3", east: "15:30", west: "15:38", destination: "15:54", eastReturn: "16:29" },
      { code: "B4", east: "16:00", west: "16:08", destination: "16:24", eastReturn: "16:59" },
      { code: "B3", east: "17:36", west: "17:44", destination: "18:00", eastReturn: "18:35" },
      { code: "B4", east: "18:06", west: "18:14", destination: "18:30", eastReturn: "19:05" },
      { code: "B3", east: "19:32", west: "19:50", destination: "20:06", eastReturn: "20:41" },
      { code: "B4", east: "20:02", west: "20:20", destination: "20:36", eastReturn: "21:11" },
      { code: "B3", east: "21:38", west: "21:56", destination: "22:12", eastReturn: "22:47" },
      { code: "B4", east: "22:08", west: "22:26", destination: "22:42", eastReturn: "23:17" },
      { code: "B3", east: "23:44", west: "0:02", destination: "0:18", eastReturn: "0:53" },
      { code: "B5", east: "0:34", west: "0:42", destination: "0:58", eastReturn: "1:33" }
    ]),
    ...buildEastOriginRoute("C", "epcot", [
      { code: "C1", east: "4:15", west: "4:23", destination: "4:40", eastReturn: "4:58" },
      { code: "C1", east: "5:00", west: "5:08", destination: "5:25", eastReturn: "5:43" },
      { code: "C1", east: "5:50", west: "5:58", destination: "6:15", eastReturn: "6:33" },
      { code: "C1", east: "6:40", west: "6:48", destination: "7:05", eastReturn: "7:23" },
      { code: "C1", east: "7:30", west: "7:38", destination: "7:55", eastReturn: "8:13" },
      { code: "C1", east: "8:20", west: "8:28", destination: "8:45", eastReturn: "9:03" },
      { code: "C1", east: "9:10", west: "9:18", destination: "9:35", eastReturn: "9:53" },
      { code: "C1", east: "10:00", west: "10:08", destination: "10:25", eastReturn: "10:43" },
      { code: "C1", east: "10:50", west: "10:58", destination: "11:15", eastReturn: "11:33" },
      { code: "C1", east: "11:40", west: "11:48", destination: "12:05", eastReturn: "12:23" },
      { code: "C1", east: "12:30", west: "12:38", destination: "12:55", eastReturn: "13:13" },
      { code: "C1", east: "13:20", west: "13:28", destination: "13:45", eastReturn: "14:03" },
      { code: "C2", east: "14:25", west: "14:33", destination: "14:50", eastReturn: "15:08" },
      { code: "C3", east: "15:50", west: "15:58", destination: "16:15", eastReturn: "16:33" },
      { code: "C3", east: "16:40", west: "16:48", destination: "17:05", eastReturn: "17:23" },
      { code: "C5", east: "18:00", west: "18:08", destination: "18:25", eastReturn: "18:43" },
      { code: "C3", east: "19:10", west: "19:18", destination: "19:35", eastReturn: "19:53" },
      { code: "C4", east: "20:15", west: "20:23", destination: "20:40", eastReturn: "20:58" },
      { code: "C3", east: "21:30", west: "21:48", destination: "22:05", eastReturn: "22:23" },
      { code: "C5", east: "22:50", west: "23:08", destination: "23:25", eastReturn: "23:43" },
      { code: "C3", east: "23:10", west: "23:28", destination: "23:45", eastReturn: "0:03" },
      { code: "C3", east: "0:00", west: "0:18", destination: "0:35", eastReturn: "0:53" },
      { code: "C4", east: "1:55", west: "2:13", destination: "2:30", eastReturn: "2:48" }
    ]),
    ...buildEastOriginRoute("D", "animalKingdom", [
      { code: "D1", east: "4:45", west: "4:53", destination: "5:05", eastReturn: "5:50" },
      { code: "D1", east: "5:55", west: "6:03", destination: "6:15", eastReturn: "7:00" },
      { code: "D1", east: "7:05", west: "7:13", destination: "7:25", eastReturn: "8:10" },
      { code: "D1", east: "8:15", west: "8:23", destination: "8:35", eastReturn: "9:20" },
      { code: "D1", east: "9:25", west: "9:33", destination: "9:45", eastReturn: "10:30" },
      { code: "D1", east: "10:35", west: "10:43", destination: "10:55", eastReturn: "11:40" },
      { code: "D1", east: "11:45", west: "11:53", destination: "12:05", eastReturn: "12:50" },
      { code: "D1", east: "12:55", west: "13:03", destination: "13:15", eastReturn: "14:00" },
      { code: "D3", east: "14:05", west: "14:13", destination: "14:25", eastReturn: "15:10" },
      { code: "D3", east: "15:15", west: "15:23", destination: "15:35", eastReturn: "16:20" },
      { code: "D3", east: "16:25", west: "16:33", destination: "16:50", eastReturn: "17:35" },
      { code: "D3", east: "17:40", west: "17:48", destination: "18:00", eastReturn: "18:40" },
      { code: "D4", east: "18:20", west: "18:28", destination: "18:40", eastReturn: "19:20" },
      { code: "D3", east: "19:50", west: "19:58", destination: "20:10", eastReturn: "20:50" },
      { code: "D3", east: "20:55", west: "21:03", destination: "21:15", eastReturn: "21:55" },
      { code: "D3", east: "21:50", west: "22:08", destination: "22:20", eastReturn: "23:00" },
      { code: "D4", east: "22:30", west: "22:48", destination: "23:00", eastReturn: "23:40" },
      { code: "D3", east: "22:55", west: "23:13", destination: "23:25", eastReturn: "0:05" },
      { code: "D4", east: "23:35", west: "23:48", destination: "0:00", eastReturn: "0:40" },
      { code: "D4", east: "0:35", west: "0:53", destination: "1:05", eastReturn: "1:45" }
    ]),
    ...buildWestOriginRoute("E", "magicKingdom", [
      { code: "E1", west: "3:20", east: "3:28", destination: "3:45", westReturn: "4:08" },
      { code: "E1", west: "4:15", east: "4:23", destination: "4:40", westReturn: "5:03" },
      { code: "E1", west: "5:10", east: "5:18", destination: "5:35", westReturn: "5:58" },
      { code: "E1", west: "6:05", east: "6:13", destination: "6:30", westReturn: "6:53" },
      { code: "E1", west: "7:00", east: "7:08", destination: "7:25", westReturn: "7:48" },
      { code: "E1", west: "7:55", east: "8:03", destination: "8:20", westReturn: "8:43" },
      { code: "E1", west: "8:50", east: "8:58", destination: "9:15", westReturn: "9:38" },
      { code: "E1", west: "9:45", east: "9:53", destination: "10:10", westReturn: "10:33" },
      { code: "E1", west: "10:40", east: "10:48", destination: "11:05", westReturn: "11:28" },
      { code: "E1", west: "11:35", east: "11:43", destination: "12:00", westReturn: "12:23" },
      { code: "E1", west: "12:30", east: "12:38", destination: "12:55", westReturn: "13:18" },
      { code: "E1", west: "13:25", east: "13:33", destination: "13:50", westReturn: "14:13" },
      { code: "E3", west: "14:20", east: "14:28", destination: "14:45", westReturn: "15:08" },
      { code: "E3", west: "15:15", east: "15:23", destination: "15:40", westReturn: "16:03" },
      { code: "E3", west: "16:10", east: "16:18", destination: "16:35", westReturn: "16:58" },
      { code: "E3", west: "17:05", east: "17:13", destination: "17:30", westReturn: "17:53" },
      { code: "E3", west: "18:00", east: "18:08", destination: "18:25", westReturn: "18:48" },
      { code: "E3", west: "18:55", east: "19:03", destination: "19:20", westReturn: "19:43" },
      { code: "E3", west: "19:50", east: "19:58", destination: "20:15", westReturn: "20:38" },
      { code: "E3", west: "20:45", east: "20:53", destination: "21:10", westReturn: "21:33" },
      { code: "E3", west: "21:30", east: "21:48", destination: "22:05", westReturn: "22:28" },
      { code: "E3", west: "22:25", east: "22:43", destination: "23:00", westReturn: "23:23" },
      { code: "E3", west: "23:20", east: "23:38", destination: "23:55", westReturn: "0:18" },
      { code: "E3", west: "0:15", east: "0:33", destination: "0:50", westReturn: "1:13" },
      { code: "E6", west: "1:05", east: "1:13", destination: "1:30", westReturn: "1:53" },
      { code: "E4", west: "2:30", east: "2:48", destination: "3:05", westReturn: "3:28" }
    ]),
    ...buildWestOriginRoute("G", "typhoonLagoon", [
      { code: "G1", west: "5:00", east: "5:08", destination: "5:25", westReturn: "6:10" },
      { code: "G1", west: "6:20", east: "6:28", destination: "6:45", westReturn: "7:30" },
      { code: "G1", west: "7:40", east: "7:48", destination: "8:05", westReturn: "8:50" },
      { code: "G1", west: "9:00", east: "9:08", destination: "9:25", westReturn: "10:10" },
      { code: "G1", west: "10:20", east: "10:28", destination: "10:45", westReturn: "11:30" },
      { code: "G1", west: "11:40", east: "11:48", destination: "12:05", westReturn: "12:50" },
      { code: "G1", west: "13:00", east: "13:08", destination: "13:25", westReturn: "14:10" },
      { code: "G1", west: "14:20", east: "14:28", destination: "14:45", westReturn: "15:30" },
      { code: "G1", west: "15:40", east: "15:48", destination: "16:05", westReturn: "16:50" },
      { code: "G1", west: "17:00", east: "17:08", destination: "17:25", westReturn: "18:10" },
      { code: "G1", west: "18:20", east: "18:28", destination: "18:45", westReturn: "19:30" },
      { code: "G1", west: "19:40", east: "19:48", destination: "20:05", westReturn: "20:50" },
      { code: "G1", west: "20:50", east: "21:08", destination: "21:25", westReturn: "22:10" },
      { code: "G1", west: "22:10", east: "22:28", destination: "22:45", westReturn: "23:30" },
      { code: "G1", west: "23:30", east: "23:48", destination: "0:05", westReturn: "0:50" },
      { code: "G1", west: "0:50", east: "1:08", destination: "1:25", westReturn: "2:10" }
    ]),
    ...buildWestOriginRoute("H", "portOrleans", [
      { code: "H1", west: "5:00", east: "5:08", destination: "5:28", westReturn: "6:03" },
      { code: "H1", west: "6:10", east: "6:18", destination: "6:38", westReturn: "7:13" },
      { code: "H1", west: "7:20", east: "7:28", destination: "7:48", westReturn: "8:23" },
      { code: "H1", west: "8:30", east: "8:38", destination: "8:58", westReturn: "9:33" },
      { code: "H1", west: "9:40", east: "9:48", destination: "10:08", westReturn: "10:43" },
      { code: "H1", west: "10:50", east: "10:58", destination: "11:18", westReturn: "11:53" },
      { code: "H1", west: "12:00", east: "12:08", destination: "12:28", westReturn: "13:03" },
      { code: "H1", west: "13:10", east: "13:18", destination: "13:38", westReturn: "14:13" },
      { code: "H3", west: "14:20", east: "14:28", destination: "14:48", westReturn: "15:23" },
      { code: "H3", west: "15:30", east: "15:38", destination: "15:58", westReturn: "16:33" },
      { code: "H3", west: "16:40", east: "16:48", destination: "17:08", westReturn: "17:43" },
      { code: "H3", west: "17:50", east: "17:58", destination: "18:18", westReturn: "18:53" },
      { code: "H3", west: "19:00", east: "19:08", destination: "19:28", westReturn: "20:03" },
      { code: "H3", west: "20:10", east: "20:18", destination: "20:38", westReturn: "21:13" },
      { code: "H3", west: "21:10", east: "21:28", destination: "21:48", westReturn: "22:23" },
      { code: "H3", west: "22:20", east: "22:38", destination: "22:58", westReturn: "23:33" },
      { code: "H4", west: "22:55", east: "23:13", destination: "23:33", westReturn: "0:08" },
      { code: "H4", west: "0:05", east: "0:23", destination: "0:43", westReturn: "1:18" },
      { code: "H4", west: "1:15", east: "1:33", destination: "1:53", westReturn: "2:28" }
    ]),
    ...buildWestOriginRoute("I", "disneySprings", [
      { code: "I1", west: "5:00", east: "5:08", destination: "5:46", westReturn: "6:06" },
      { code: "I1", west: "6:15", east: "6:23", destination: "7:01", westReturn: "7:21" },
      { code: "I1", west: "7:30", east: "7:38", destination: "8:16", westReturn: "8:36" },
      { code: "I1", west: "8:45", east: "8:53", destination: "9:31", westReturn: "9:51" },
      { code: "I1", west: "10:00", east: "10:08", destination: "10:46", westReturn: "11:06" },
      { code: "I1", west: "11:15", east: "11:23", destination: "12:01", westReturn: "12:21" },
      { code: "I1", west: "12:30", east: "12:38", destination: "13:16", westReturn: "13:36" },
      { code: "I1", west: "13:45", east: "13:53", destination: "14:31", westReturn: "14:51" },
      { code: "I3", west: "15:00", east: "15:08", destination: "15:46", westReturn: "16:06" },
      { code: "I3", west: "16:15", east: "16:23", destination: "17:01", westReturn: "17:21" },
      { code: "I3", west: "17:30", east: "17:38", destination: "18:16", westReturn: "18:36" },
      { code: "I3", west: "18:45", east: "18:53", destination: "19:31", westReturn: "19:51" },
      { code: "I3", west: "20:00", east: "20:08", destination: "20:46", westReturn: "21:06" },
      { code: "I3", west: "21:10", east: "21:23", destination: "22:01", westReturn: "22:21" },
      { code: "I3", west: "22:25", east: "22:38", destination: "23:16", westReturn: "23:36" },
      { code: "I3", west: "23:40", east: "23:53", destination: "0:31", westReturn: "0:51" },
      { code: "I4", west: "0:20", east: "0:33", destination: "1:15", westReturn: "1:35" }
    ]),
    ...buildWestOriginRoute("J", "rivieraBoardwalk", [
      { code: "J1", west: "4:00", east: "4:08", destination: "4:23", westReturn: "4:55" },
      { code: "J1", west: "5:00", east: "5:08", destination: "5:23", westReturn: "5:55" },
      { code: "J1", west: "6:00", east: "6:08", destination: "6:23", westReturn: "6:55" },
      { code: "J1", west: "7:00", east: "7:08", destination: "7:23", westReturn: "7:55" },
      { code: "J1", west: "8:00", east: "8:08", destination: "8:23", westReturn: "8:55" },
      { code: "J1", west: "9:00", east: "9:08", destination: "9:23", westReturn: "9:55" },
      { code: "J1", west: "10:00", east: "10:08", destination: "10:23", westReturn: "10:55" },
      { code: "J1", west: "11:00", east: "11:08", destination: "11:23", westReturn: "11:55" },
      { code: "J1", west: "12:00", east: "12:08", destination: "12:23", westReturn: "12:55" },
      { code: "J1", west: "13:00", east: "13:08", destination: "13:23", westReturn: "13:55" },
      { code: "J1", west: "14:00", east: "14:08", destination: "14:23", westReturn: "14:55" },
      { code: "J3", west: "15:00", east: "15:08", destination: "15:23", westReturn: "15:55" },
      { code: "J3", west: "16:00", east: "16:08", destination: "16:23", westReturn: "16:55" },
      { code: "J3", west: "17:00", east: "17:08", destination: "17:23", westReturn: "17:55" },
      { code: "J3", west: "18:00", east: "18:08", destination: "18:23", westReturn: "18:55" },
      { code: "J3", west: "19:00", east: "19:08", destination: "19:23", westReturn: "19:55" },
      { code: "J3", west: "20:00", east: "20:08", destination: "20:23", westReturn: "20:55" },
      { code: "J3", west: "20:55", east: "21:08", destination: "21:23", westReturn: "21:55" },
      { code: "J3", west: "21:55", east: "22:08", destination: "22:23", westReturn: "22:55" },
      { code: "J3", west: "22:55", east: "23:08", destination: "23:23", westReturn: "23:55" },
      { code: "J3", west: "23:55", east: "0:08", destination: "0:23", westReturn: "0:55" },
      { code: "J3", west: "0:55", east: "1:08", destination: "1:23", westReturn: "1:55" }
    ]),
    ...buildWestOriginRoute("K", "monorailResorts", [
      { code: "K2", west: "4:25", east: "4:33", destination: "4:52", westReturn: "5:13" },
      { code: "K1", west: "5:00", east: "5:08", destination: "5:27", westReturn: "6:05" },
      { code: "K1", west: "6:10", east: "6:18", destination: "6:37", westReturn: "7:15" },
      { code: "K1", west: "7:20", east: "7:28", destination: "7:47", westReturn: "8:25" },
      { code: "K1", west: "8:30", east: "8:38", destination: "8:57", westReturn: "9:35" },
      { code: "K1", west: "9:40", east: "9:48", destination: "10:07", westReturn: "10:45" },
      { code: "K1", west: "10:50", east: "10:58", destination: "11:17", westReturn: "11:55" },
      { code: "K1", west: "12:00", east: "12:08", destination: "12:27", westReturn: "13:05" },
      { code: "K1", west: "13:10", east: "13:18", destination: "13:37", westReturn: "14:15" },
      { code: "K1", west: "14:20", east: "14:28", destination: "14:47", westReturn: "15:25" },
      { code: "K3", west: "15:30", east: "15:38", destination: "15:57", westReturn: "16:35" },
      { code: "K3", west: "16:40", east: "16:48", destination: "17:07", westReturn: "17:45" },
      { code: "K3", west: "17:50", east: "17:58", destination: "18:17", westReturn: "18:55" },
      { code: "K3", west: "19:00", east: "19:08", destination: "19:27", westReturn: "20:05" },
      { code: "K3", west: "20:10", east: "20:18", destination: "20:37", westReturn: "21:15" },
      { code: "K3", west: "21:15", east: "21:28", destination: "21:47", westReturn: "22:25" },
      { code: "K3", west: "22:25", east: "22:38", destination: "22:57", westReturn: "23:35" },
      { code: "K3", west: "23:35", east: "23:48", destination: "0:07", westReturn: "0:45" },
      { code: "K4", west: "0:20", east: "0:33", destination: "0:52", westReturn: "1:30" }
    ])
  );

  return all;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + (minutes * 60 * 1000));
}

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day;
}

function addDays(date, days) {
  return addMinutes(date, days * MINUTES_PER_DAY);
}

function minutesBetween(a, b) {
  return Math.round((b.getTime() - a.getTime()) / 60000);
}

function expandTripInstances(targetDate) {
  const dayStart = startOfDay(targetDate);
  const lowerBound = addMinutes(targetDate, -36 * 60);
  const upperBound = addMinutes(targetDate, 48 * 60);
  const instances = [];

  for (let dayOffset = -1; dayOffset <= 2; dayOffset += 1) {
    const serviceDate = addDays(dayStart, dayOffset);
    const weekday = serviceDate.getDay();
    for (const trip of SCHEDULE_TRIPS) {
      if (!trip.serviceDays.includes(weekday)) {
        continue;
      }
      const departure = addMinutes(serviceDate, trip.departureMinutes);
      const arrival = addMinutes(serviceDate, trip.arrivalMinutes);
      if (departure >= lowerBound && departure <= upperBound) {
        instances.push({
          ...trip,
          departure,
          arrival
        });
      }
    }
  }

  return instances;
}

function buildItineraries(origin, destination, targetDate) {
  const instances = expandTripInstances(targetDate);
  const byFrom = new Map();
  const itineraries = [];

  for (const instance of instances) {
    if (!byFrom.has(instance.from)) {
      byFrom.set(instance.from, []);
    }
    byFrom.get(instance.from).push(instance);

    if (instance.from === origin && instance.to === destination) {
      itineraries.push({
        legs: [instance],
        departure: instance.departure,
        arrival: instance.arrival,
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
        .map((leg) => `${leg.routeCode}-${leg.tripCode}-${leg.departure.getTime()}`)
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
      return {
        best: upcoming[0],
        alternatives: upcoming.slice(1, 4),
        advisory: null
      };
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
    return {
      best: onOrBefore[0],
      alternatives: onOrBefore.slice(1, 4),
      advisory: null
    };
  }

  const after = [...itineraries].sort((a, b) => a.arrival - b.arrival);
  return {
    best: after[0],
    alternatives: after.slice(1, 4),
    advisory: "Nothing arrives by that time. Showing the soonest arrival after it."
  };
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDay(date) {
  return date.toLocaleDateString([], { weekday: "short" });
}

function formatStop(stopKey) {
  return STOP_META[stopKey] ? STOP_META[stopKey].label : stopKey;
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

function renderLeg(leg, index) {
  return `
    <div class="leg-row">
      <strong>Leg ${index + 1}:</strong>
      Route ${leg.routeCode} (${leg.tripCode}) ·
      ${formatStop(leg.from)} ${formatTime(leg.departure)} →
      ${formatStop(leg.to)} ${formatTime(leg.arrival)}
    </div>
  `;
}

function renderItineraryCard(itinerary, title, mode, targetDate, isBest) {
  const timing = itineraryTimingMessage(itinerary, targetDate, mode);
  const totalMinutes = minutesBetween(itinerary.departure, itinerary.arrival);
  const badges = itinerary.legs.map((leg) => routeBadge(leg.routeCode)).join("");
  const transferText = itinerary.transferStop
    ? `Transfer at ${formatStop(itinerary.transferStop)}`
    : "No transfer";

  return `
    <article class="result-card">
      <header class="result-header">
        <h3 class="result-title">${title}</h3>
        <div class="route-badges">${badges}</div>
      </header>
      <div class="trip-grid">
        <div class="label">Depart</div>
        <div class="value">${formatStop(itinerary.legs[0].from)} · ${formatTime(itinerary.departure)} (${formatDay(itinerary.departure)})</div>
        <div class="label">Arrive</div>
        <div class="value">${formatStop(itinerary.legs[itinerary.legs.length - 1].to)} · ${formatTime(itinerary.arrival)} (${formatDay(itinerary.arrival)})</div>
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

function startCountdownForBest(bestItinerary, targetDate) {
  clearCountdownTimer();
  if (!bestItinerary || selectedMode !== "leaveAt") {
    return;
  }

  const update = () => {
    const now = new Date();
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
    resultSection.innerHTML = `<div class="empty">No route found for that request. Try changing the time or destination.</div>`;
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
    plan.alternatives.forEach((alt, idx) => {
      html += renderItineraryCard(alt, `Alternative ${idx + 1}`, selectedMode, targetDate, false);
    });
  }

  resultSection.innerHTML = html;
  startCountdownForBest(plan.best, targetDate);
}

function parseTargetDateTime() {
  const dateValue = dateInput.value;
  const timeValue = timeInput.value;
  if (!dateValue || !timeValue) {
    return null;
  }
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function formatDateInput(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTimeInput(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function setTargetDateTime(date) {
  dateInput.value = formatDateInput(date);
  timeInput.value = formatTimeInput(date);
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
  if (!targetDate || Number.isNaN(targetDate.getTime())) {
    resultSection.innerHTML = `<div class="empty">Choose a valid date and time.</div>`;
    clearCountdownTimer();
    return;
  }

  const itineraries = buildItineraries(origin, destination, targetDate);
  const plan = selectPlan(itineraries, targetDate, selectedMode);
  renderResults(plan, targetDate);
}

function populateOriginOptions() {
  originSelect.innerHTML = STOP_ORDER
    .map((stopKey) => `<option value="${stopKey}">${STOP_META[stopKey].icon} ${STOP_META[stopKey].label}</option>`)
    .join("");
}

function populateDestinationOptions() {
  const origin = originSelect.value;
  const destinationBefore = destinationSelect.value;
  const options = STOP_ORDER
    .filter((stopKey) => stopKey !== origin)
    .map((stopKey) => `<option value="${stopKey}">${STOP_META[stopKey].icon} ${STOP_META[stopKey].label}</option>`)
    .join("");
  destinationSelect.innerHTML = options;

  if (destinationBefore && destinationBefore !== origin) {
    destinationSelect.value = destinationBefore;
  }
  if (!destinationSelect.value) {
    destinationSelect.value = origin === "fcvEast" ? "epcot" : "fcvEast";
  }
}

function handleQuickAction(value) {
  const now = new Date();
  if (value === "now") {
    setMode("leaveAt");
    setTargetDateTime(now);
    runPlanner();
    return;
  }

  if (value === "tonight") {
    const tonight = new Date(now);
    tonight.setHours(22, 0, 0, 0);
    if (tonight < now) {
      tonight.setDate(tonight.getDate() + 1);
    }
    setTargetDateTime(tonight);
    runPlanner();
    return;
  }

  const addMinutesValue = Number(value.replace("+", ""));
  if (!Number.isNaN(addMinutesValue)) {
    setMode("leaveAt");
    const shifted = addMinutes(now, addMinutesValue);
    setTargetDateTime(shifted);
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
  dateInput.addEventListener("change", runPlanner);
  timeInput.addEventListener("change", runPlanner);
  searchButton.addEventListener("click", runPlanner);

  document.querySelectorAll(".quick-btn").forEach((button) => {
    button.addEventListener("click", () => handleQuickAction(button.dataset.quick));
  });
}

function initialize() {
  populateOriginOptions();
  originSelect.value = "fcvEast";
  populateDestinationOptions();
  destinationSelect.value = "epcot";
  setMode("arriveBy");
  setTargetDateTime(new Date());
  attachEvents();
  runPlanner();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // Service worker registration failure should not block app usage.
    });
  });
}

initialize();
