export const defaultChatSubject = 'Introduce yourself!';
export const rewardValue = {
  star: 200
};
export const cloudFrontURL = 'https://d3jvoamd2k4p0s.cloudfront.net';
export const clientVersion = '1.1.76';
export const charLimit = {
  chat: {
    subject: 200,
    message: 5000
  },
  comment: 10000,
  playlist: {
    title: 200,
    description: 5000
  },
  videoQuestion: {
    title: 2000,
    choice: 2000
  },
  subject: {
    title: 300,
    description: 20000
  },
  rewardComment: 5000,
  statusMsg: 500,
  url: {
    title: 300,
    description: 20000,
    url: 1000
  },
  video: {
    title: 200,
    description: 10000,
    url: 300
  }
};
export const rewardHash = {
  1: {
    label: 'basic',
    rewardAmount: 100,
    color: 'logoBlue'
  },
  2: {
    label: 'elementary',
    rewardAmount: 200,
    color: 'pink'
  },
  3: {
    label: 'intermediate',
    rewardAmount: 300,
    color: 'orange'
  },
  4: {
    label: 'advanced',
    rewardAmount: 500,
    color: 'red'
  },
  5: {
    label: 'epic',
    rewardAmount: 1000,
    color: 'gold'
  }
};
export const LAST_ONLINE_FILTER_LABEL = 'Last Online';
export const RANKING_FILTER_LABEL = 'Ranking';
export const MAX_PROFILE_PIC_SIZE = 5000;

export const returnMaxStars = ({ rewardLevel }) => {
  let maxStars = 5;
  if (rewardLevel > 0) {
    maxStars = 10 * rewardLevel;
  }
  return maxStars;
};

const intermediateWordFrequency = 4;
const advancedWordFrequency = 2.5;
const epicWordFrequency = 1.6;

export function returnWordLevel({ frequency, word }) {
  if (!frequency) return 3;
  if (frequency > intermediateWordFrequency) {
    if (word.length < 7) return 1;
    return 2;
  }
  if (word.slice(-2) === 'ly') return 3;
  if (frequency > advancedWordFrequency) return 3;
  if (frequency > epicWordFrequency) return 4;
  if (frequency <= epicWordFrequency) return 5;
  return 3;
}
