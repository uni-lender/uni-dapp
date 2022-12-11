export const truncateTextMid = (text: string, start = 4, end = 4) =>
  text.length > start + end
    ? text.replace(text.substring(start, text.length - end), '...')
    : text;
