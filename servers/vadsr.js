import cheerio from 'cheerio';
import fetch from 'node-fetch';
async function getVideo(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch the page: ${response.status} ${response.statusText}`);
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const jwplayerScript = $('script').filter(function () {
      return /jwplayer\("vplayer"\)\.setup/.test($(this).html());
    });
    if (jwplayerScript.length > 0) {
      const jwplayerContent = jwplayerScript.html();
      var regex = /file\s*:\s*"(.*?)"/;
      var match = jwplayerContent.match(regex);
      if (match && match[1]) {
        return match[1];
      } else {
        return null;
      }
    } else {

    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export default getVideo;