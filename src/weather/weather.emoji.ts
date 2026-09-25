export function getWeatherEmoji(code: string) {
  switch (code) {
    case '01':
      return '☀️';
    case '02':
      return '🌤️';
    case '03':
    case '04':
      return '☁️';
    case '09':
      return '🌧️';
    case '10':
      return '🌦️';
    case '11':
      return '🌩️';
    case '13':
      return '🌨️';
    case '50':
      return '🌫️';

    default:
      throw new Error('Weather emoji not found');
  }
}
