export enum ApiUrls {
  //Common URLS
  // BaseURL = 'http://localhost:50223/api',
  BaseURL = 'http://goalccapi.sixlogics.com/result-center/api', //stagging
  // BaseURL = 'https://goalccapi.sixlogics.com/result-center/api', //Live

  NavbarLiveSports = '/live-match-for-sport',

  FootballCountryList = '/football-countries',
  FootballContestGroup = '/football-contestgroups-by-country',
  FootBallMatchResult = '/football-matches-by-date-group-by-contest',
  FootBallMatchesByLeagueRound = '/football-matches-by-league-round',
  FootBallLeagueTable = '/football-league-table',
  FootballCompetitorHead2Head = '/football-competitor-head2head',
  FootballContestGroupStats = '/football-contestgroup-stats',
  FootballMatchDetailBetway = '/football-match-detail-by-matchid',
  FootballLeaguesList = '/betway-leagues-by-country',
  FootballContestGroupsByLeague = '/betway-contestgroups-by-leagues',
  FootballContestTeams = '/football-contest-teams',
  FootballContestRounds = '/football-contest-rounds-by-id',

  // Tennis Urls
  TennisOrgsList = '/tennis-sport-organizations',
  TennisResultList = '/tennis-matches-by-date',
  TennisLeagueList = '/tennis-contestgroups-by-type',
  TennisLeagueResultList = '/tennis-matches-by-contestgroup-id',
  TennisMatchInfo = '/tennis-matchinfo',
  TennisContestGroupStats = '/tennis-stats',
  TennisHeadToHead = '/tennis-head-to-head',
  TennisDrawResult = '/tennis-draw-by-round-id',
  TennisContestGroupRounds = '/tennis-rounds-by-contest-group-id',
  TennisPlayers = '/tennis-players-by-sport-organization-id',


  //IceHockey Urls
  IceHockeyCountryList = '/icehockey-countries',
  IceHockeyContestList = '/icehockey-contest-groups',
  IceHockeyMatchList = '/icehockey-matches-by-date',
  IceHockeyStats = '/icehockey-stats',
  IceHockeyStandings = '/icehockey-standing',
  IceHockeyRounds = '/icehockey-rounds',
  IceHockeyMatchesbyRound = '/icehockey-matches-by-round-id',
  IceHockeyContestTeams = '/icehockey-contest-teams',
  IceHockeyHeadToHead = '/icehockey-head-to-head',


  //Basketball Urls
  BasketballCountryList = '/basketball-countries',
  BasketballContestList = '/basketball-contest-groups',
  BasketballMatchList = '/basketball-matches-by-date',
  BasketballRounds = '/basketball-rounds',
  BasketballMatchinfo = '/basketball-match-info',
  BasketballMatchesByRoundId = '/basketball-matches-by-round-id',
  BasketballStandings = '/basketball-standing',
  BasketballStats = '/basketball-stats',
  BasetballContestTeams = '/basketball-teams',
  BasketballHeadtoHead = '/Basketball-head-to-head',


  LanguageKeys = '/language'

}
