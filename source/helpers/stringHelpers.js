import { charLimit } from 'constants/defaultValues';
/* eslint-disable no-useless-escape */

export function addCommasToNumber(number) {
  const numArray = `${number}`.split('');
  let result = '';
  numArray.reverse();
  for (let i = 0; i < numArray.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      result = numArray[i] + ',' + result;
    } else {
      result = numArray[i] + result;
    }
  }
  return result;
}

export function addTwoLetterEmoji(string) {
  return string
    .replace(/(:\) )/g, '😊 ')
    .replace(/(;\) )/g, '😉 ')
    .replace(/(XD )/g, '😆 ')
    .replace(/(:D )/g, '😄 ')
    .replace(/(:P )/gi, '😛 ')
    .replace(/(:\( )/g, '🙁 ')
    .replace(/(:O )/gi, '😲 ')
    .replace(/(<3 )/g, '❤️ ');
}

export function addThreeLetterEmoji(string) {
  return string
    .replace(/(:-\) )/g, '😊 ')
    .replace(/(;-\) )/g, '😉 ')
    .replace(/(X-D )/g, '😆 ')
    .replace(/(:-D )/g, '😄 ')
    .replace(/(:-P )/gi, '😛 ')
    .replace(/(:-\( )/g, '🙁 ')
    .replace(/(:-O )/gi, '😲 ')
    .replace(/(O_O )/gi, '😳 ');
}

export function addAdvancedEmoji(string) {
  return string
    .replace(/(:\) )/g, '😊 ')
    .replace(/(;\) )/g, '😉 ')
    .replace(/(XD )/g, '😆 ')
    .replace(/(:D )/g, '😄 ')
    .replace(/(:P )/gi, '😛 ')
    .replace(/(:\( )/g, '🙁 ')
    .replace(/(:O )/gi, '😲 ')
    .replace(/(<3 )/g, '❤️ ')
    .replace(/(:-\) )/g, '😊 ')
    .replace(/(;-\) )/g, '😉 ')
    .replace(/(X-D )/g, '😆 ')
    .replace(/(:-D )/g, '😄 ')
    .replace(/(:-P )/gi, '😛 ')
    .replace(/(:-\( )/g, '🙁 ')
    .replace(/(:-O )/gi, '😲 ')
    .replace(/(O_O )/gi, '😳 ')
    .replace(/(\:alien\:)/gi, '👽')
    .replace(/(\:angel\:)/gi, '😇')
    .replace(/(\:angry\:)/gi, '😡')
    .replace(/(\:ant\:)/gi, '🐜')
    .replace(/(\:bee\:)/gi, '🐝')
    .replace(/(\:bunny\:)/gi, '🐰')
    .replace(/(\:burger\:)/gi, '🍔')
    .replace(/(\:bye\:)/gi, '👋')
    .replace(/(\:cash\:)/gi, '💰')
    .replace(/(\:cat\:)/gi, '🐱')
    .replace(/(\:chess\:)/gi, '♟️')
    .replace(/(\:chicken\:)/gi, '🍗')
    .replace(/(\:clap\:)/gi, '👏')
    .replace(/(\:colored pencil\:)/gi, '🖍️')
    .replace(/(\:computer\:)/gi, '🖥')
    .replace(/(\:cow\:)/gi, '🐮')
    .replace(/(\:crayon\:)/gi, '🖍️')
    .replace(/(\:curious\:)/gi, '🤔')
    .replace(/(\:cry\:)/gi, '😭')
    .replace(/(\:degrees\:)/gi, '°')
    .replace(/(\:devil\:)/gi, '😈')
    .replace(/(\:diamond\:)/gi, '💎')
    .replace(/(\:dinosaur\:)/gi, '🦖')
    .replace(/(\:dog\:)/gi, '🐶')
    .replace(/(\:dolphin\:)/gi, '🐬')
    .replace(/(\:elephant\:)/gi, '🐘')
    .replace(/(\:evil\:)/gi, '😈')
    .replace(/(\:fear\:)/gi, '😱')
    .replace(/(\:fox\:)/gi, '🦊')
    .replace(/(\:friend\:)/gi, '👭')
    .replace(/(\:ghost\:)/gi, '👻')
    .replace(/(\:good\:)/gi, '👍')
    .replace(/(\:happy\:)/gi, '😄')
    .replace(/(\:heart\:)/gi, '❤️')
    .replace(/(\:hello\:)/gi, '👋')
    .replace(/(\:hi\:)/gi, '👋')
    .replace(/(\:hen\:)/gi, '🐔')
    .replace(/(\:horror\:)/gi, '😱')
    .replace(/(\:horse\:)/gi, '🐴')
    .replace(/(\:infinity\:)/gi, '∞')
    .replace(/(\:korea\:)/gi, '🇰🇷')
    .replace(/(\:lol\:)/gi, '😂')
    .replace(/(\:mad\:)/gi, '😡')
    .replace(/(\:money\:)/gi, '💰')
    .replace(/(\:monkey\:)/gi, '🐵')
    .replace(/(\:moo\:)/gi, '🐮')
    .replace(/(\:nice\:)/gi, '👍')
    .replace(/(\:ok\:)/gi, '👌')
    .replace(/(\:okay\:)/gi, '👌')
    .replace(/(\:palette\:)/gi, '🎨')
    .replace(/(\:penguin\:)/gi, '🐧')
    .replace(/(\:perfect\:)/gi, '💯')
    .replace(/(\:pi\:)/gi, 'π')
    .replace(/(\:pig\:)/gi, '🐷')
    .replace(/(\:pizza\:)/gi, '🍕')
    .replace(/(\:potato\:)/gi, '🥔')
    .replace(/(\:rabbit\:)/gi, '🐰')
    .replace(/(\:rooster\:)/gi, '🐓')
    .replace(/(\:sad\:)/gi, '😭')
    .replace(/(\:santa\:)/gi, '🎅')
    .replace(/(\:shrug\:)/gi, '🤷')
    .replace(/(\:smile\:)/gi, '😊')
    .replace(/(\:snail\:)/gi, '🐌')
    .replace(/(\:spider\:)/gi, '🕷️')
    .replace(/(\:squared\:)/gi, '²')
    .replace(/(\:star\:)/gi, '⭐')
    .replace(/(\:sunglasses\:)/gi, '😎')
    .replace(/(\:taco\:)/gi, '🌮')
    .replace(/(\:thank you\:)/gi, '🙏')
    .replace(/(\:theta\:)/gi, '⍬')
    .replace(/(\:thumbs\:)/gi, '👍')
    .replace(/(\:turtle\:)/gi, '🐢')
    .replace(/(\:twinkle\:)/gi, '✨')
    .replace(/(\:ufo\:)/gi, '🛸')
    .replace(/(\:volcano\:)/gi, '🌋')
    .replace(/(\:wave\:)/gi, '👋')
    .replace(/(\:yep\:)/gi, '👌')
    .replace(/(\:yes\:)/gi, '👌')
    .replace(/(\:zombie\:)/gi, '🧟')
    .replace(/(\:zzz\:)/gi, '💤');
}

export function expandShortcut(string) {
  return string
    .replace(/(\(brb\))/gi, 'be right back')
    .replace(/(\(gtg\))/gi, 'got to go')
    .replace(/(\(tbh\))/gi, 'to be honest')
    .replace(/(\(nvm\))/gi, 'never mind')
    .replace(
      /(\(verylongword\))/gi,
      'pneumonoultramicroscopicsilicovolcanoconiosis'
    );
}

export function addEmoji(string) {
  let firstPart = string.substring(0, string.length - 3);
  let lastPart = addTwoLetterEmoji(string.slice(-3));
  let firstResult = `${firstPart}${lastPart}`;

  firstPart = firstResult.substring(0, firstResult.length - 4);
  lastPart = addThreeLetterEmoji(firstResult.slice(-4));
  return `${firstPart}${lastPart}`;
}

export function capitalize(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function cleanString(string) {
  return string
    ? string
        .replace(/<br\s*[\/]?>/gi, '\n')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
    : '';
}

export function exceedsCharLimit({ inputType, contentType, text }) {
  const targetText = text || '';
  const limit =
    contentType === 'comment' ||
    contentType === 'rewardComment' ||
    contentType === 'statusMsg'
      ? charLimit[contentType]
      : charLimit[contentType][inputType];
  return targetText.length > limit
    ? {
        style: {
          color: 'red',
          borderColor: 'red'
        },
        message: `${targetText.length}/${limit} Characters`
      }
    : undefined;
}

export function fetchURLFromText(text) {
  const regex = /(\b(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-.,;:?@%_\+~#=\/()])+(\.[A-Z])?([^\s-.,;:?'"])+)/gi;
  let url = text.match(regex)?.[0] || '';
  if (url && !url.includes('http://') && !url.includes('https://')) {
    url = 'http://' + url;
  }
  return url;
}

export function fetchedVideoCodeFromURL(url) {
  let videoCode = '';
  if (typeof url.split('v=')[1] !== 'undefined') {
    let trimmedUrl = url.split('v=')[1].split('#')[0];
    videoCode = trimmedUrl.split('&')[0];
  } else {
    let trimmedUrl = url.split('youtu.be/')[1].split('#')[0];
    videoCode = trimmedUrl.split('&')[0].split('?')[0];
  }
  return videoCode;
}

export function getFileInfoFromFileName(fileName) {
  const fileNameArray = fileName.split('.');
  const extension =
    fileNameArray[fileNameArray.length - 1]?.toLowerCase() || '';
  return { extension, fileType: getFileType(extension) };

  function getFileType(extension) {
    const audioExt = ['wav', 'aif', 'mp3', 'mid', 'm4a'];
    const imageExt = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'webp'];
    const movieExt = ['avi', 'wmv', 'mov', 'mp4', '3gp', 'ogg', 'm4v'];
    const compressedExt = ['zip', 'rar', 'arj', 'tar', 'gz', 'tgz'];
    const wordExt = ['docx', 'docm', 'dotx', 'dotm', 'docb'];
    if (audioExt.includes(extension)) {
      return 'audio';
    }
    if (imageExt.includes(extension)) {
      return 'image';
    }
    if (movieExt.includes(extension)) {
      return 'video';
    }
    if (compressedExt.includes(extension)) {
      return 'archive';
    }
    if (wordExt.includes(extension)) {
      return 'word';
    }
    if (extension === 'pdf') {
      return 'pdf';
    }
    return 'other';
  }
}

export function limitBrs(string) {
  return string.replace(
    /(<br ?\/?>){11,}/gi,
    '<br><br><br><br><br><br><br><br><br><br>'
  );
}

export function finalizeEmoji(string) {
  return addAdvancedEmoji(addEmoji(expandShortcut(string)));
}

export function hashify(string) {
  const stringArray = string.split(' ');
  const hashedString =
    '#' + stringArray.map(string => capitalize(string)).join('');
  return hashedString;
}

export function isValidEmail(email = '') {
  const regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g;
  return regex.test(email);
}

export function isValidUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  if (!url.includes('://') && !url.includes('www.')) {
    url = 'www.' + url;
  }
  return regex.test(url);
}

export function isValidYoutubeUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  if (!url.includes('://') && !url.includes('www.')) {
    url = 'www.' + url;
  }
  let trimOne = url.split('v=')[1];
  let trimTwo = url.split('youtu.be/')[1];
  return (
    regex.test(url) &&
    (typeof trimOne !== 'undefined' || typeof trimTwo !== 'undefined')
  );
}

export function isValidGipfyGifUrl(url = '') {
  const regex = /((https:\/\/www.)?giphy.com\/gifs\/[\w,-]*)/g;
  return regex.test(url);
}

export function toValidGipfyGifUrl(url = '') {
  const splitUrl = url.split('/');
  const splitUrl1 = url.includes('https://')
    ? splitUrl[4].split('-')
    : splitUrl[2].split('-');
  const id = splitUrl1[splitUrl1.length - 1];
  url = 'https://media.giphy.com/media/' + id + '/giphy.gif';
  return url;
}

export function isValidYoutubeChannelUrl(url = '') {
  const regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
  const trim = url.split('youtube.com/')[1];
  if (!url.includes('://') && !url.includes('www.')) {
    url = 'www.' + url;
  }
  return regex.test(url) && typeof trim !== 'undefined';
}

export function processedQueryString(string) {
  return string
    ? string
        .replace(/\r?\n/g, '<br>')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\r?\n/g, '<br>')
    : null;
}

export function processedString(string) {
  return string
    ? string
        .replace(/~/g, '&tilde;')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    : null;
}

export function processedStringWithURL(string) {
  if (typeof string !== 'string') return string || null;
  const maxChar = 100;
  const trimmedString = string =>
    string.length > maxChar ? `${string.substring(0, maxChar)}...` : string;
  const urlRegex = /(\b(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-.,;:?&@%_\+~#=\/()])+([0-9A-Za-z/])+(\.[A-Za-z])?)/gi;
  const boldRegex = /\*([^\s*]+)\*/gi;
  const italicRegex = /\*\*([^\s*]+)\*\*/gi;
  const boldItalicRegex = /\*\*\*([^\s*]+)\*\*\*/gi;
  const underlineRegex = /__([^\s*]+)__/gi;
  const linethroughRegex = /--([^\s*]+)--/gi;
  let tempString = string
    .replace(/&/g, '&amp')
    .replace(/</g, '&lt')
    .replace(/>/g, '&gt')
    .replace(urlRegex, `<a href=\"$1\" target=\"_blank\">$1</a>`)
    .replace(
      boldItalicRegex,
      `<span style="font-style: italic; font-weight: bold;">$1</span>`
    )
    .replace(italicRegex, `<span style="font-style: italic;">$1</span>`)
    .replace(boldRegex, `<span style="font-weight: bold;">$1</span>`)
    .replace(
      underlineRegex,
      `<span style="text-decoration: underline;">$1</span>`
    )
    .replace(
      linethroughRegex,
      `<span style="text-decoration: line-through;">$1</span>`
    )
    .replace(/\r?\n/g, '<br>');
  let newString = '';
  while (tempString.length > 0) {
    const hrefPos = tempString.indexOf('href="');
    if (hrefPos === -1) {
      const headPos = tempString.indexOf('target="_blank">');
      const tailPos = tempString.indexOf('</a>');
      if (headPos !== -1) {
        const wrapperHead = tempString
          .substring(0, headPos + 16)
          .replace(/&amp/g, '&')
          .replace(/&lt/g, '<')
          .replace(/&gt/g, '>');
        const url = tempString.substring(headPos + 16, tailPos);
        const wrapperTail = tempString.substring(tailPos, tempString.length);
        newString += `${wrapperHead}${trimmedString(url)}${wrapperTail}`;
      } else {
        newString += tempString;
      }
      break;
    }
    newString += tempString.substring(0, hrefPos + 6);
    tempString = tempString.substring(hrefPos + 6, tempString.length);
    if (tempString.indexOf('://') > 8 || !tempString.includes('://')) {
      newString += 'http://';
    }
  }
  return newString;
}

export function processedURL(url) {
  if (!url.includes('://')) {
    url = 'http://' + url;
  }
  return url;
}

export function queryStringForArray({ array, originVar, destinationVar }) {
  return `${array
    .map(elem => `${destinationVar}[]=${originVar ? elem[originVar] : elem}`)
    .join('&')}`;
}

export function removeLineBreaks(string) {
  return string.replace(/\n/gi, ' ').replace(/ {2,}/gi, ' ');
}

export function renderFileSize(fileSize) {
  if (fileSize > 1000000) {
    return `(${(fileSize / 1000000).toFixed(2)} MB)`;
  }
  if (fileSize > 1000) {
    return `(${(fileSize / 1000).toFixed(2)} KB)`;
  }
  return null;
}

export function renderText(text) {
  let newText = text;
  while (
    newText !== '' &&
    (newText[0] === ' ' ||
      (newText[newText.length - 1] === ' ' &&
        newText[newText.length - 2] === ' '))
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1);
    }
    if (
      newText[newText.length - 1] === ' ' &&
      newText[newText.length - 2] === ' '
    ) {
      newText = newText.slice(0, -1);
    }
  }
  return newText;
}

export function stringIsEmpty(string) {
  const checkedString = string
    ? string.replace(/\s/g, '').replace(/\r?\n/g, '')
    : '';
  return checkedString === '';
}

export function trimUrl(url) {
  const trimHttp = url?.split('//')[1] || url?.split('//')[0];
  const trimWWW = trimHttp?.split('www.')[1] || trimHttp?.split('www.')[0];
  return trimWWW;
}

export function trimWhiteSpaces(text) {
  let newText = text;
  while (
    newText !== '' &&
    (newText[0] === ' ' || newText[newText.length - 1] === ' ')
  ) {
    if (newText[0] === ' ') {
      newText = newText.substring(1);
    }
    if (newText[newText.length - 1] === ' ') {
      newText = newText.slice(0, -1);
    }
  }
  return newText;
}

export function truncateText({ text, limit }) {
  if (text.length > limit) {
    return text.substring(0, limit) + '...';
  }
  return text;
}

export function turnStringIntoQuestion(string) {
  const toDelete = ['?', ' '];
  while (toDelete.indexOf(string.charAt(string.length - 1)) !== -1) {
    string = string.slice(0, -1);
  }
  return string + '?';
}

/* eslint-enable no-useless-escape */
