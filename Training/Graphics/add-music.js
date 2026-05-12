const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const FFMPEG = path.join(
  process.env.LOCALAPPDATA,
  'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe'
);
const FFPROBE = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
const VIDEO_DIR = path.join(__dirname, '..', 'Exports', 'Videos');
const MUSIC_DIR = path.join(__dirname, '..', 'Exports', 'Music');

// Each video gets a different music track for variety
const VIDEOS = [
  {
    video: 'Video-1_General-Orientation.mp4',
    music: 'track1-warm.mp3',       // Warm serene for orientation
    output: 'Video-1_General-Orientation_FINAL.mp4'
  },
  {
    video: 'Video-2_Server-Cashier-Training.mp4',
    music: 'track2-discover.mp3',   // Discover - upbeat for server training
    output: 'Video-2_Server-Cashier-Training_FINAL.mp4'
  },
  {
    video: 'Video-3_Line-Cook-Training.mp4',
    music: 'track3-deep-urban.mp3', // Deep urban - steady for kitchen training
    output: 'Video-3_Line-Cook-Training_FINAL.mp4'
  }
];

function getDuration(filePath) {
  const result = execSync(
    `"${FFPROBE}" -v error -show_entries format=duration -of csv=p=0 "${filePath}"`,
    { encoding: 'utf-8', timeout: 10000 }
  ).trim();
  return parseFloat(result);
}

/*
  Strategy: Use FFmpeg's sidechaincompress filter.
  - The narration audio acts as the sidechain (detector)
  - When narration is playing, music volume ducks down
  - When narration pauses (between sections), music comes up
  - Music loops if shorter than video
  - Music has a 3-second fade-in at start and 4-second fade-out at end
  - Overall music volume set low (0.12) so it's subtle background
*/

for (const item of VIDEOS) {
  const videoPath = path.join(VIDEO_DIR, item.video);
  const musicPath = path.join(MUSIC_DIR, item.music);
  const outputPath = path.join(VIDEO_DIR, item.output);

  const videoDuration = getDuration(videoPath);
  console.log(`\nProcessing: ${item.video} (${videoDuration.toFixed(1)}s)`);
  console.log(`  Music: ${item.music}`);

  // Complex filter:
  // 1. Take video's audio as [narration]
  // 2. Take music, loop it to cover full video, set low volume, fade in/out
  // 3. Use sidechaincompress: music ducks when narration is detected
  // 4. Mix narration (full volume) + ducked music together
  const filterComplex = [
    // Extract narration audio from video
    `[0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo[narration]`,
    // Loop music to cover video duration, set volume low, add fade in/out
    `[1:a]aloop=loop=-1:size=2e+09,atrim=0:${videoDuration},` +
    `aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,` +
    `volume=0.12,` +
    `afade=t=in:st=0:d=3,` +
    `afade=t=out:st=${(videoDuration - 4).toFixed(1)}:d=4` +
    `[music_prepared]`,
    // Sidechain compress: when narration is loud, duck the music further
    `[music_prepared][narration]sidechaincompress=threshold=0.015:ratio=6:attack=200:release=1000:level_in=1:level_sc=1[music_ducked]`,
    // Mix narration at full volume + ducked music
    `[narration][music_ducked]amix=inputs=2:weights=1 0.8:duration=first[audio_out]`
  ].join(';');

  const cmd = `"${FFMPEG}" -y -i "${videoPath}" -i "${musicPath}" ` +
    `-filter_complex "${filterComplex}" ` +
    `-map 0:v -map "[audio_out]" ` +
    `-c:v copy -c:a aac -b:a 192k ` +
    `-shortest "${outputPath}"`;

  console.log('  Mixing audio...');
  try {
    execSync(cmd, { stdio: 'pipe', timeout: 300000 });
    const finalSize = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);
    console.log(`  DONE: ${item.output} (${finalSize} MB)`);
  } catch (err) {
    console.error(`  ERROR: ${err.stderr?.toString().slice(-500) || err.message}`);
  }
}

console.log('\n' + '═'.repeat(60));
console.log('  All videos mixed with background music!');
console.log('  Final videos (with _FINAL suffix) in:');
console.log(`  ${VIDEO_DIR}`);
console.log('═'.repeat(60));
