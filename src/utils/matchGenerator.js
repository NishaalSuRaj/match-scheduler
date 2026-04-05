const normalizeTeams = (teams) => {
  const sanitized = teams
    .map(team => team.trim())
    .filter(team => team.length > 0);

  return [...new Set(sanitized)];
};

const createRounds = (teams) => {
  const workingTeams = [...teams];

  if (workingTeams.length % 2 !== 0) {
    workingTeams.push('BYE');
  }

  const rounds = [];
  const totalRounds = workingTeams.length - 1;
  const half = workingTeams.length / 2;

  for (let roundIndex = 0; roundIndex < totalRounds; roundIndex++) {
    const roundPairs = [];

    for (let i = 0; i < half; i++) {
      const home = workingTeams[i];
      const away = workingTeams[workingTeams.length - 1 - i];

      if (home !== 'BYE' && away !== 'BYE') {
        roundPairs.push({ home, away });
      }
    }

    rounds.push(roundPairs);

    const pivot = workingTeams.pop();
    workingTeams.splice(1, 0, pivot);
  }

  return rounds;
};

const orderRoundMatches = (matches, previousMatch) => {
  if (!previousMatch || matches.length <= 1) {
    return [...matches];
  }

  const prevTeams = new Set([previousMatch.team1, previousMatch.team2]);
  const ordered = [...matches];

  const nonConflictIndex = ordered.findIndex(
    match => !prevTeams.has(match.home) && !prevTeams.has(match.away)
  );

  if (nonConflictIndex > 0) {
    const [match] = ordered.splice(nonConflictIndex, 1);
    ordered.unshift(match);
  }

  return ordered;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

export const generateRoundRobinMatches = (
  teams,
  options = {
    startDate: null,
    daysBetweenRounds: 1,
    timeSlots: ['19:00']
  }
) => {
  const normalizedTeams = normalizeTeams(teams);
  if (normalizedTeams.length < 2) {
    return [];
  }

  const firstLeg = createRounds(normalizedTeams);
  const secondLeg = firstLeg.map(round =>
    round.map(match => ({ home: match.away, away: match.home }))
  );

  const allRounds = [...firstLeg, ...secondLeg];
  const start = options.startDate ? new Date(options.startDate) : new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  const orderedMatches = [];
  let previousMatch = null;

  for (let roundIndex = 0; roundIndex < allRounds.length; roundIndex++) {
    const roundMatches = allRounds[roundIndex].map(match => ({ ...match }));
    const orderedRound = orderRoundMatches(roundMatches, previousMatch);

    for (let index = 0; index < orderedRound.length; index++) {
      const match = orderedRound[index];
      const roundDate = new Date(start);
      roundDate.setDate(start.getDate() + roundIndex * options.daysBetweenRounds);

      orderedMatches.push({
        id: `${roundIndex}-${index}-${Date.now() + Math.random()}`,
        team1: match.home,
        team2: match.away,
        location: `${match.home}'s Home Ground`,
        date: formatDate(roundDate),
        time: options.timeSlots[index % options.timeSlots.length],
        status: 'scheduled'
      });
      previousMatch = { team1: match.home, team2: match.away };
    }
  }

  return orderedMatches;
};

// New function to generate matches with weekday/weekend scheduling
export const generateScheduledMatches = (teams, options = {}) => {
  const {
    startDate = new Date(),
    numDays = 10,
    weekdayTime = '19:30',
    weekendTimes = ['14:30', '19:30']
  } = options;

  const normalizedTeams = normalizeTeams(teams);
  if (normalizedTeams.length < 2) {
    return [];
  }

  const matches = [];
  let matchId = 1;
  const currentDate = new Date(startDate);

  // IPL stadium mapping for authenticity
  const stadiums = {
    "Chennai Super Kings": "M.A. Chidambaram Stadium, Chennai",
    "Mumbai Indians": "Wankhede Stadium, Mumbai",
    "Royal Challengers Bangalore": "M. Chinnaswamy Stadium, Bangalore",
    "Kolkata Knight Riders": "Eden Gardens, Kolkata",
    "Delhi Capitals": "Arun Jaitley Stadium, Delhi",
    "Punjab Kings": "Punjab Cricket Association IS Bindra Stadium, Mohali",
    "Rajasthan Royals": "Sawai Mansingh Stadium, Jaipur",
    "Sunrisers Hyderabad": "Rajiv Gandhi International Cricket Stadium, Hyderabad",
    "Lucknow Super Giants": "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
    "Gujarat Titans": "Narendra Modi Stadium, Ahmedabad"
  };

  for (let day = 0; day < numDays; day++) {
    const matchDate = new Date(currentDate);
    matchDate.setDate(currentDate.getDate() + day);
    const dateString = formatDate(matchDate);

    // Check if it's weekend (Saturday = 6, Sunday = 0)
    const isWeekend = matchDate.getDay() === 0 || matchDate.getDay() === 6;
    const times = isWeekend ? weekendTimes : [weekdayTime];
    const numMatches = isWeekend ? 2 : 1;

    for (let matchIndex = 0; matchIndex < numMatches; matchIndex++) {
      // Random team selection (ensure no team plays twice in same day)
      const availableTeams = [...normalizedTeams];
      const team1Index = Math.floor(Math.random() * availableTeams.length);
      const team1 = availableTeams.splice(team1Index, 1)[0];

      const team2Index = Math.floor(Math.random() * availableTeams.length);
      const team2 = availableTeams[team2Index];

      // Determine status based on current date
      let status = 'scheduled';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const matchDateOnly = new Date(matchDate);
      matchDateOnly.setHours(0, 0, 0, 0);

      if (matchDateOnly.getTime() < today.getTime()) {
        status = 'completed';
      } else if (matchDateOnly.getTime() === today.getTime()) {
        status = 'ongoing';
      }

      matches.push({
        id: `match-${matchId}`,
        team1: team1,
        team2: team2,
        date: dateString,
        time: times[matchIndex],
        location: stadiums[team1] || `${team1}'s Home Ground`,
        status: status
      });

      matchId++;
    }
  }

  return matches;
};

export const getMatchStats = (matches) => {
  return {
    total: matches.length,
    scheduled: matches.filter(m => m.status === 'scheduled').length,
    ongoing: matches.filter(m => m.status === 'ongoing').length,
    completed: matches.filter(m => m.status === 'completed').length,
    cancelled: matches.filter(m => m.status === 'cancelled').length
  };
};
