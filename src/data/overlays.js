// Static geographic overlay data for theaters, U-boat corridors, convoy routes,
// and timeline milestone events.

export const THEATERS = [
  {
    id: 'north-atlantic',
    label: 'NORTH ATLANTIC',
    coords: [
      [60, -55],
      [60, -10],
      [45, -8],
      [40, -30],
      [42, -60],
    ],
  },
  {
    id: 'pacific',
    label: 'PACIFIC THEATER',
    coords: [
      [40, 130],
      [40, -150],
      [-15, -150],
      [-15, 130],
    ],
  },
  {
    id: 'mediterranean',
    label: 'MEDITERRANEAN',
    coords: [
      [44, 3],
      [46, 16],
      [40, 28],
      [31, 32],
      [31, 10],
      [36, -1],
    ],
  },
  {
    id: 'arctic',
    label: 'ARCTIC CONVOY ROUTE',
    coords: [
      [80, 0],
      [80, 50],
      [68, 45],
      [66, 5],
      [70, -5],
    ],
  },
  {
    id: 'english-channel',
    label: 'ENGLISH CHANNEL',
    coords: [
      [51.2, -5.5],
      [51.5, 1.8],
      [50.0, 1.5],
      [49.5, -5.5],
    ],
  },
  {
    id: 'indian-ocean',
    label: 'INDIAN OCEAN',
    coords: [
      [5, 50],
      [10, 110],
      [-35, 115],
      [-35, 45],
    ],
  },
]

export const UBOAT_CORRIDORS = [
  {
    id: 'wolfpack-greenland',
    label: 'U-BOAT CORRIDOR — GREENLAND GAP',
    coords: [
      [58, -45],
      [55, -35],
      [52, -25],
      [50, -18],
    ],
  },
  {
    id: 'biscay-approach',
    label: 'U-BOAT CORRIDOR — BAY OF BISCAY',
    coords: [
      [48, -8],
      [45, -10],
      [44, -6],
      [43, -2],
    ],
  },
  {
    id: 'us-eastern-seaboard',
    label: 'U-BOAT CORRIDOR — DRUMBEAT (US COAST)',
    coords: [
      [40, -73],
      [35, -75],
      [30, -80],
      [26, -80],
    ],
  },
]

export const CONVOY_ROUTES = [
  {
    id: 'hx',
    label: 'CONVOY HX — HALIFAX TO LIVERPOOL',
    coords: [
      [44.6, -63.6],
      [50, -45],
      [54, -25],
      [55, -10],
      [53.4, -3.0],
    ],
  },
  {
    id: 'pq-qp',
    label: 'CONVOY PQ/QP — ARCTIC TO MURMANSK',
    coords: [
      [64, -22],
      [71, -5],
      [74, 15],
      [71, 33],
      [69, 33],
    ],
  },
  {
    id: 'malta',
    label: 'CONVOY — MALTA (OPERATION PEDESTAL)',
    coords: [
      [36, -5.3],
      [37.5, 4],
      [37.5, 11],
      [35.9, 14.5],
    ],
  },
]

// Timeline milestone events keyed by year-month for callouts.
export const MILESTONES = [
  { date: '1914-08-01', label: 'WAR DECLARED — MOBILIZATION BEGINS' },
  { date: '1915-05-07', label: 'LUSITANIA SUNK — OUTRAGE SPREADS' },
  { date: '1916-05-31', label: 'BATTLE OF JUTLAND — FLEETS CLASH' },
  { date: '1917-02-01', label: 'UNRESTRICTED SUBMARINE WARFARE RESUMES' },
  { date: '1918-11-11', label: 'ARMISTICE — THE GUNS FALL SILENT' },
  { date: '1919-06-21', label: 'SCAPA FLOW — GERMAN FLEET SCUTTLED' },
  { date: '1939-09-01', label: 'GERMANY INVADES POLAND — WW2 BEGINS' },
  { date: '1939-12-13', label: 'BATTLE OF THE RIVER PLATE' },
  { date: '1940-07-03', label: 'MERS-EL-KEBIR — FRENCH FLEET ATTACKED' },
  { date: '1941-05-27', label: 'BISMARCK SUNK — THE CHASE ENDS' },
  { date: '1941-12-07', label: 'PEARL HARBOR — US ENTERS THE WAR' },
  { date: '1942-06-04', label: 'BATTLE OF MIDWAY — THE TIDE TURNS' },
  { date: '1942-11-13', label: 'NAVAL BATTLE OF GUADALCANAL' },
  { date: '1943-12-26', label: 'BATTLE OF THE NORTH CAPE' },
  { date: '1944-10-25', label: 'BATTLE OF LEYTE GULF' },
  { date: '1945-04-07', label: 'YAMATO SUNK — OPERATION TEN-GO' },
  { date: '1945-09-02', label: 'JAPAN SURRENDERS — WAR ENDS' },
]
