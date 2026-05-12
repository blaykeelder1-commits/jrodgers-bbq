const { execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// ─── Config ───
const FFMPEG = path.join(
  process.env.LOCALAPPDATA,
  'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin/ffmpeg.exe'
);
const SLIDES_DIR = path.join(__dirname, '..', 'Exports', 'Slides');
const AUDIO_DIR = path.join(__dirname, '..', 'Exports', 'Audio');
const VIDEO_DIR = path.join(__dirname, '..', 'Exports', 'Videos');
const VOICE = 'en-US-BrianNeural'; // approachable, casual, sincere — perfect for training
const RATE = '+5%'; // just enough to keep it moving without sounding rushed

// ─── NARRATION — Rewritten for natural flow, fewer pauses ───
// Sentences joined with commas where natural, short sentences combined,
// "It's All Good" replaced with "Welcome Home" throughout

const VIDEO_1_NARRATION = [
  {
    slide: 'V1_01_TITLE-CARD.png',
    text: 'Welcome to J Rodgers BBQ and Soul Food, new associate orientation.',
    duration: 5
  },
  {
    slide: 'V1_02_OUR-STORY.png',
    text: 'Section one, our story.',
    duration: 3
  },
  {
    slide: 'V1_03_WHAT-WE-STAND-FOR.png',
    text: `J Rodgers BBQ and Soul Food has been a Saraland landmark since 1992, that's over 30 years of smoking ribs, pulling pork, and feeding families in this community. It all started with Josephine Rodgers, known to everyone as Ms. J She took the recipes her grandmother had passed down to her, recipes for real soul food cooked with care and seasoned with love, and she opened her own place right here on Industrial Parkway. What started as a small carry-out operation grew into the full restaurant and soul food buffet you see today, built one plate at a time by earning the trust of this community through consistency, quality, and genuine hospitality. Over the years, J Rodgers has become more than a local favorite. Every year during the NFL Senior Bowl in Mobile, scouts, coaches, and players make their way to Saraland to eat at Ms. J's table. They've been coming back for over 20 years, and they call Ms. J "Mom." That's the kind of reputation you're now a part of. It wasn't built overnight and it can't be replaced, so every shift you work, you're either adding to that legacy or taking away from it. Choose to add to it.`
  },
  {
    slide: 'V1_04_PILLAR-1-COMMUNITY-FIRST.png',
    text: `At J Rodgers, everything we do is built on three pillars, and these aren't just words on a wall, they guide every decision we make. Pillar one, community first. This restaurant exists because this community supported it for over 30 years. The people who walk through that door aren't just customers, many of them have been eating here since before you were born. They chose us, and we owe them our best every single time.`
  },
  {
    slide: 'V1_05_PILLAR-2-GRANDMOTHERS-LEGACY.png',
    text: `Pillar two, grandmother's legacy. The recipes we use were passed down through generations, and that means something. You don't get to cut corners on a recipe that someone's grandmother perfected. Every dish that leaves this kitchen should taste the same today as it did 30 years ago, because consistency isn't boring, it's respect.`
  },
  {
    slide: 'V1_06_PILLAR-3-HOSPITALITY-AS-IDENTITY.png',
    text: `Pillar three, hospitality as identity. We don't just serve food, we make people feel at home. Hospitality isn't a department here and it's not someone else's job, it's who we are. Whether you're working the register, running the buffet line, or pulling pork in the back, you are responsible for how people feel when they're here.`
  },
  {
    slide: 'V1_07_WHAT-MAKES-US-DIFFERENT.png',
    text: `Section three, what makes us different. There are a lot of places to eat in Saraland and Mobile, so why do people drive past all of them to come here? Three reasons. First, the food is the star. We smoke our meats low and slow with hickory, oak, and pecan wood, and our ribs are so well-seasoned they don't even need sauce. Our fried ribs are a fan favorite you won't find anywhere else. Our Yo-Jo Beans, named after Yolanda and Josephine, are made with ground beef and vegetables. And our banana pudding and peach cobbler, people come from all over for these. The food does the talking, your job is to make sure it arrives the way it's supposed to. Second, our customers are family. Many of them are regulars who've been coming here for years, even decades. They know Ms. J by name, they expect to be recognized and treated like they belong here, because they do. And third, you are family too. Ms. J treats her staff like her own, and if you show up, work hard, and respect the culture, you'll have a home here.`
  },
  {
    slide: 'V1_08_POLICIES-&-EXPECTATIONS.png',
    text: `Section four, policies and expectations. Now let's talk about what's expected of you every time you walk through that door. These aren't suggestions, they're requirements.`
  },
  {
    slide: 'V1_09_POLICY-ATTENDANCE.png',
    text: `Attendance and punctuality. When you're scheduled, you show up, and on time means early. If you're walking in at your start time, you're already behind. If you need to call out, contact your manager as far in advance as possible, not 10 minutes before your shift. This is a small team, and when one person doesn't show up, everyone else feels it.`
  },
  {
    slide: 'V1_10_POLICY-DRESS-CODE.png',
    text: `Dress code and hygiene. You will be told what to wear, so wear it. Your uniform should be clean, pressed, and complete every shift, no exceptions. Personal hygiene is non-negotiable in food service, that means clean hands, clean nails, and hair pulled back or covered. If you're working the front, you are the first thing customers see, so look the part.`
  },
  {
    slide: 'V1_11_POLICY-PHONE.png',
    text: `Phone policy. Your phone goes away when you clock in, not in your back pocket, not face-down on the counter, put away. If you need to make an emergency call, step away and let your manager know. Customers should never see you on your phone because your attention belongs to the people in this restaurant.`
  },
  {
    slide: 'V1_12_POLICY-ATTITUDE.png',
    text: `Attitude and conduct. You represent J Rodgers every second you're on this property, and that means no gossiping in front of customers, no arguing with coworkers where anyone can hear, and absolutely no disrespectful behavior. If you have a problem, bring it to your manager privately. Drama stays outside, and when you walk through that door, our customers deserve your full positive energy.`
  },
  {
    slide: 'V1_13_REMEMBER-THIS-UNIFORM.png',
    text: `Remember this: when you wear this uniform, you represent over 30 years of reputation. Act like it.`,
    duration: 7
  },
  {
    slide: 'V1_14_THE-WELCOME-HOME-STANDARD.png',
    text: `Section five, the welcome home standard. At J Rodgers, we don't just greet people, we welcome them home. This is our service standard, and every associate in this building follows it regardless of your role.`
  },
  {
    slide: 'V1_15_STANDARD-1-EYE-CONTACT.png',
    text: `Standard one, eye contact and a real smile within 30 seconds. When someone walks through that door, they should feel seen immediately, and not with a fake customer-service smile, but a real one. You're glad they're here, so show it.`
  },
  {
    slide: 'V1_16_STANDARD-2-LEARN-NAMES.png',
    text: `Standard two, learn their name. Our regulars expect to be recognized, and new faces become regulars when you remember them. Use their name when you can, because it costs you nothing and it means everything to them.`
  },
  {
    slide: 'V1_17_STANDARD-3-THANK-EVERY-CUSTOMER.png',
    text: `Standard three, thank every customer. Before they leave, every customer hears a genuine thank-you, not a robotic "have a nice day" while you're looking at something else. Look at them and mean it, because they chose to spend their money here, and that deserves to be acknowledged.`
  },
  {
    slide: 'V1_18_QUOTE-HOSPITALITY.png',
    text: `We don't just serve food, we make people feel at home.`,
    duration: 6
  },
  {
    slide: 'V1_19_WELCOME-TO-THE-FAMILY.png',
    text: `You now have the foundation. You know our story, our values, and what's expected of you. From here, you'll receive specific training for your role, whether that's front of house or kitchen. But no matter what position you're in, remember this: at J Rodgers BBQ and Soul Food, you're not just an employee, you're part of a family and a legacy that's been building for over 30 years. Show up, work hard, and take care of people.`
  },
  {
    slide: 'V1_20_OUTRO-WELCOME-HOME.png',
    text: `Welcome home. Please proceed to your role-specific training video.`,
    duration: 6
  }
];

const VIDEO_2_NARRATION = [
  {
    slide: 'V2_01_TITLE-CARD.png',
    text: 'J Rodgers BBQ and Soul Food, server and cashier training, front of house.',
    duration: 5
  },
  {
    slide: 'V2_02_INTRO.png',
    text: `Section one, you are the face of this restaurant. Every interaction you have either builds or chips away at our reputation. You're the first person customers see and the last person they remember, and that makes you the most important part of their experience.`
  },
  {
    slide: 'V2_03_THE-J-RODGERS-GREETING.png',
    text: `Section two, the J Rodgers greeting. Eye contact before they reach you, and a warm greeting before they ask.`,
    duration: 5
  },
  {
    slide: 'V2_04_THE-RIGHT-WAY.png',
    text: `The right way: greet with purpose. Make eye contact before they reach you, give a real smile, and say "Welcome home to J Rodgers, good to see you!" Then direct them clearly, whether it's the buffet, the menu, or a wait time. This is also the time to get their drink order, don't wait until they're seated or at the register. This takes five seconds and sets the tone for their entire visit.`
  },
  {
    slide: 'V2_05_THE-WRONG-WAY.png',
    text: `The wrong way: looking at your phone, talking to a coworker, facing the other direction, giving a flat "hey" without looking up, or waiting until the guest gets to the cash register to greet them. That first impression is almost impossible to undo, so don't be this person.`
  },
  {
    slide: 'V2_06_MENU-KNOWLEDGE.png',
    text: `Section three, menu knowledge. Know it, love it, and recommend it with confidence. If a customer asks "what's good here?", never answer "everything" because that's lazy. Have real recommendations ready and know the signature items so you can describe them.`
  },
  {
    slide: 'V2_07_SIGNATURE-ITEMS.png',
    text: `Know these by heart. Ribs, we offer dry rub, wet, and fried. Pulled pork, slow-smoked all day. Smoked chicken, slow-smoked, and smoked sausage with country links. For sides, our Yo-Jo Beans are the signature. Collard greens, fresh from the farm and cooked right here. Candied yams, from the local farm. Mac and cheese, made from scratch daily. For dessert, banana pudding is the fan favorite, and peach cobbler is warm and flaky. You should be able to describe every one of these with confidence.`
  },
  {
    slide: 'V2_08_BUFFET-MANAGEMENT.png',
    text: `Section four, buffet management. The buffet should always look full, clean, labeled, and hot.`,
    duration: 5
  },
  {
    slide: 'V2_09_THE-HALF-FULL-RULE.png',
    text: `The half-full rule. No pan should ever drop below half full during service, and when you see it getting low, communicate with the kitchen immediately. Don't wait for empty, be proactive. Servers and cashiers should make rounds every 15 minutes to stir the buffet and sides so they look fresh. Check the pans to make sure they are full and look full. If the crust on any item looks dull, flaky, or dried out, request that someone from the kitchen come out and flip the item into a clean pan. The buffet should always look like it was just put out.`
  },
  {
    slide: 'V2_10_CASH-HANDLING.png',
    text: `Section five, cash handling. Count it, say it aloud, close the drawer, and get a manager for voids. When making change, count the money back to the customer out loud and never leave the cash drawer open. If a card is declined, handle it discreetly and respectfully, and all voids require manager approval with no exceptions.`
  },
  {
    slide: 'V2_11_SPEED-OF-SERVICE.png',
    text: `Section six, speed of service. Drinks come out first, always keep your promises, and get ahead of frustration. If you told a customer you'd bring something, bring it. If there's a delay, let them know before they have to ask, because people can handle waiting, but they can't handle being forgotten.`
  },
  {
    slide: 'V2_12_HANDLING-COMPLAINTS.png',
    text: `Section seven, handling complaints. Listen fully, acknowledge with empathy, and solve it immediately.`,
    duration: 5
  },
  {
    slide: 'V2_13_COMPLAINT-3-STEPS.png',
    text: `When a customer has a complaint, follow three steps. Step one, listen fully, let them finish talking without interrupting or getting defensive. Step two, acknowledge with empathy, say something like "I'm sorry about that, let me fix it right now." And step three, solve it immediately by replacing the item, getting a manager, or doing whatever it takes to make it right before they leave.`
  },
  {
    slide: 'V2_14_NEVER.png',
    text: `Never argue with a customer, never roll your eyes, and never make excuses. If you can't resolve it, get your manager, but never make a customer feel like their concern doesn't matter.`,
    duration: 9
  },
  {
    slide: 'V2_15_UPSELLING.png',
    text: `Section eight, upselling. Mention dessert before the check, recommend a side the customer didn't order, and always be genuine, not pushy.`,
    duration: 5
  },
  {
    slide: 'V2_16_REMEMBER-THIS-UPSELLING.png',
    text: `Remember this: you're not selling, you're making sure they don't miss the best part. A simple "have you tried our banana pudding?" or "our peach cobbler is still warm" goes a long way.`,
    duration: 9
  },
  {
    slide: 'V2_17_TABLE-&-DINING-CLEANLINESS.png',
    text: `Section nine, table and dining area cleanliness. Clear, wipe, and reset every table before new guests sit down, because the dining area is a direct reflection of our standards.`
  },
  {
    slide: 'V2_18_RESTROOM-CHECK-POLICY.png',
    text: `Restroom checks happen every 30 minutes. Check for toilet paper, paper towels, soap, and general cleanliness. A dirty restroom is one of the fastest ways to lose a customer permanently.`
  },
  {
    slide: 'V2_19_CLOSING-YOU-ARE-THE-EXPERIENCE.png',
    text: `The kitchen creates the food, but you create the moment around it. Every customer who walks through that door deserves to feel welcome, served with care, and sent home happy. That's on you, so own it.`
  },
  {
    slide: 'V2_20_OUTRO.png',
    text: `J Rodgers BBQ and Soul Food, server and cashier training complete. Welcome home.`,
    duration: 6
  }
];

const VIDEO_3_NARRATION = [
  {
    slide: 'V3_01_TITLE-CARD.png',
    text: 'J Rodgers BBQ and Soul Food, line cook training, back of house.',
    duration: 5
  },
  {
    slide: 'V3_02_INTRO-THE-KITCHEN-IS-WHERE-THE-LEGACY-LIVES.png',
    text: `Section one, the kitchen is where the legacy lives. Every plate that leaves this kitchen carries over 30 years of reputation. The food is the reason people come back, and that food starts with you.`
  },
  {
    slide: 'V3_03_FOOD-SAFETY-&-HYGIENE.png',
    text: `Section two, food safety and hygiene. This is the most important section of your training, and there is zero tolerance for food safety violations.`,
    duration: 6
  },
  {
    slide: 'V3_04_POLICY-HANDWASHING.png',
    text: `Handwashing, 20 seconds minimum with soap and warm water. That means before starting work, after touching raw meat, after using the restroom, after touching your face, hair, or phone, and after handling trash. This is non-negotiable, and if you're not sure whether you need to wash your hands, the answer is yes.`
  },
  {
    slide: 'V3_05_CRITICAL-TEMPERATURES.png',
    text: `Critical temperatures, know these by heart. Chicken and poultry need an internal temperature of 165 degrees Fahrenheit. Pork needs 145 degrees with a 3-minute rest. Hot holding for the buffet is 135 degrees minimum, and cold holding is 41 degrees or below. Use a thermometer every single time, and don't guess.`
  },
  {
    slide: 'V3_06_POLICY-CROSS-CONTAMINATION.png',
    text: `Cross-contamination prevention. Use separate cutting boards for raw meat and ready-to-eat food, and never place cooked food on a surface that held raw meat. Change gloves between tasks and sanitize surfaces between different protein types, because one mistake here can send a customer to the hospital.`
  },
  {
    slide: 'V3_07_POLICY-FIFO.png',
    text: `FIFO, first in, first out. Every item in storage gets a date label when it arrives. Older product goes in front, new product goes in back, and you always use the oldest product first with no exceptions. Check labels every shift, and if something smells off, looks wrong, or is past date, throw it away and tell your manager.`
  },
  {
    slide: 'V3_08_POLICY-SICK.png',
    text: `The sick policy. If you're vomiting, have diarrhea, or have been diagnosed with a contagious illness, do not come to work. Call your manager immediately. This isn't about being tough, because a sick cook can shut down an entire restaurant.`
  },
  {
    slide: 'V3_09_REMEMBER-THIS-FOOD-SAFETY.png',
    text: `Remember this: food safety isn't a checklist, it's a mindset. Every shortcut you skip protects someone's family.`,
    duration: 7
  },
  {
    slide: 'V3_10_SMOKER-&-GRILL-BASICS.png',
    text: `Section three, smoker and grill basics. This is the heart of what we do. Our meats are smoked low and slow with hickory, oak, and pecan wood, and temperature management is everything.`,
    duration: 7
  },
  {
    slide: 'V3_11_THE-SWEET-SPOT-225-250.png',
    text: `The sweet spot is 225 to 250 degrees Fahrenheit, and this is where the magic happens. Maintain this range consistently. Know which meats get dry rub versus wet rub versus fried designation, and that's always determined before the cook, not after. Time your cooks backward from the buffet schedule so food arrives fresh instead of sitting, and remember the golden rule: never rush the smoke. If it's not ready, it's not ready.`
  },
  {
    slide: 'V3_12_REMEMBER-THIS-SMOKER.png',
    text: `Remember this: Ms. J's customers can taste the difference between rushed and right. Don't guess, use the thermometer.`,
    duration: 7
  },
  {
    slide: 'V3_13_PREP-STANDARDS-&-CONSISTENCY.png',
    text: `Section four, prep standards and consistency. Mise en place before service, which means everything in its place before the first customer walks in. Use the correct portioning tools for every dish, and follow the recipes exactly as written with no substitutions unless a manager authorizes it.`
  },
  {
    slide: 'V3_14_POLICY-NO-SUBSTITUTIONS.png',
    text: `No substitutions without manager authorization. These recipes have been perfected over decades, and if you think something should change, bring it up with your manager, but never make changes on your own. Consistency is what brings customers back.`
  },
  {
    slide: 'V3_15_BUFFET-REPLENISHMENT.png',
    text: `Section five, buffet replenishment. When the front of house calls for a refill, respond immediately. Plan your production timing so you're ahead of demand, not behind it. Every pan must be verified at 135 degrees or above before it goes to the buffet, and if there's a delay, communicate it to the front of house so they can manage customer expectations.`
  },
  {
    slide: 'V3_16_REMEMBER-THIS-BUFFET.png',
    text: `Remember this: the buffet is a promise to every customer, and when it's empty, the promise is broken.`,
    duration: 7
  },
  {
    slide: 'V3_17_LINE-CLEANLINESS.png',
    text: `Section six, line cleanliness. A clean kitchen is a safe kitchen, so clean as you go, every single time.`,
    duration: 5
  },
  {
    slide: 'V3_18_POLICY-CLEAN-AS-YOU-GO.png',
    text: `Clean as you go. Keep sanitizer buckets at every station and change them every two hours. Wipe down surfaces between tasks, clean up spills immediately because no one should slip on your watch, and complete the end-of-shift cleaning checklist every night with no shortcuts.`
  },
  {
    slide: 'V3_19_COMMUNICATION-WITH-FRONT-OF-HOUSE.png',
    text: `Section seven, communication with front of house. Be vocal about timing, so if an item is 10 minutes out, say so. If something's running behind, communicate that early because the servers need accurate information to take care of customers.`
  },
  {
    slide: 'V3_20_WE-DONT-DO-THAT-HERE.png',
    text: `We don't do that here. No yelling, no attitude, and no disrespect toward servers. The kitchen and front of house are one team, and when we fight, customers lose. Treat your coworkers the way Ms. J treats her customers.`,
    duration: 9
  },
  {
    slide: 'V3_21_WASTE-REDUCTION.png',
    text: `Section eight, waste reduction. Rotate stock using FIFO, store everything properly with covers, labels, and dates. Use accurate portioning so we're not throwing away food, flag expiring product to your manager before it goes bad, and report any equipment issues immediately because a broken cooler can cost thousands.`
  },
  {
    slide: 'V3_22_REMEMBER-THIS-WASTE.png',
    text: `Remember this: every dollar wasted on spoiled food is a dollar that could have gone to this team.`,
    duration: 7
  },
  {
    slide: 'V3_23_CLOSING-YOU-ARE-THE-LEGACY.png',
    text: `You're not just cooking food, you're delivering someone's memory of home. Every plate you send out is a reflection of Ms. J, of this restaurant, and of you. Take pride in every single one.`
  },
  {
    slide: 'V3_24_QUOTE-MEMORY-OF-HOME.png',
    text: `The kitchen is where the legacy lives. Make it count.`,
    duration: 6
  },
  {
    slide: 'V3_25_OUTRO.png',
    text: `J Rodgers BBQ and Soul Food, line cook training complete. Welcome home.`,
    duration: 6
  }
];

const VIDEOS = [
  { name: 'Video-1_General-Orientation', narration: VIDEO_1_NARRATION },
  { name: 'Video-2_Server-Cashier-Training', narration: VIDEO_2_NARRATION },
  { name: 'Video-3_Line-Cook-Training', narration: VIDEO_3_NARRATION },
];

// ─── Helper: generate TTS audio for a text ───
function generateAudio(text, outputPath) {
  // Write text to a temp file to avoid command-line escaping issues
  const tempFile = outputPath + '.txt';
  fs.writeFileSync(tempFile, text);
  const cmd = `python -m edge_tts --voice "${VOICE}" --rate="${RATE}" --file "${tempFile}" --write-media "${outputPath}"`;
  execSync(cmd, { stdio: 'pipe', timeout: 120000 });
  try { fs.unlinkSync(tempFile); } catch(e) {}
}

// ─── Helper: get audio duration using ffprobe ───
function getAudioDuration(filePath) {
  const ffprobe = FFMPEG.replace('ffmpeg.exe', 'ffprobe.exe');
  const result = execSync(
    `"${ffprobe}" -v error -show_entries format=duration -of csv=p=0 "${filePath}"`,
    { encoding: 'utf-8', timeout: 10000 }
  ).trim();
  return parseFloat(result);
}

// ─── Helper: create a video segment from image + audio ───
function createSegment(imagePath, audioPath, outputPath, duration) {
  // Reduced padding: 0.5s after narration for tighter flow
  const totalDuration = duration + 0.5;
  const cmd = `"${FFMPEG}" -y -loop 1 -i "${imagePath}" -i "${audioPath}" -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -t ${totalDuration} -vf "scale=1920:1080" -r 24 "${outputPath}"`;
  execSync(cmd, { stdio: 'pipe', timeout: 120000 });
}

// ─── Main ───
(async () => {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(VIDEO_DIR, { recursive: true });

  for (const video of VIDEOS) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`  Building: ${video.name}`);
    console.log(`${'═'.repeat(60)}`);

    const segmentDir = path.join(AUDIO_DIR, video.name);
    const segmentVideoDir = path.join(VIDEO_DIR, 'segments', video.name);
    fs.mkdirSync(segmentDir, { recursive: true });
    fs.mkdirSync(segmentVideoDir, { recursive: true });

    const segmentFiles = [];

    for (let i = 0; i < video.narration.length; i++) {
      const scene = video.narration[i];
      const slideFile = path.join(SLIDES_DIR, scene.slide);
      const audioFile = path.join(segmentDir, `${String(i).padStart(2, '0')}.mp3`);
      const segmentFile = path.join(segmentVideoDir, `${String(i).padStart(2, '0')}.mp4`);

      if (!fs.existsSync(slideFile)) {
        console.error(`  MISSING SLIDE: ${scene.slide}`);
        continue;
      }

      // Generate narration audio (skip if already exists)
      console.log(`  [${i + 1}/${video.narration.length}] Generating audio: ${scene.slide}`);
      if (!fs.existsSync(audioFile) || fs.statSync(audioFile).size < 100) {
        generateAudio(scene.text, audioFile);
      } else {
        console.log(`    (reusing cached audio)`);
      }

      // Get audio duration
      const audioDuration = getAudioDuration(audioFile);
      const finalDuration = scene.duration
        ? Math.max(scene.duration, audioDuration + 0.5)
        : audioDuration;

      // Create video segment
      console.log(`    Creating segment (${finalDuration.toFixed(1)}s)...`);
      createSegment(slideFile, audioFile, segmentFile, finalDuration);
      segmentFiles.push(segmentFile);
    }

    // Concatenate all segments into final video
    console.log(`\n  Concatenating ${segmentFiles.length} segments...`);
    const concatListFile = path.join(segmentVideoDir, 'concat.txt');
    const concatContent = segmentFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatListFile, concatContent);

    const finalOutput = path.join(VIDEO_DIR, `${video.name}.mp4`);
    execSync(
      `"${FFMPEG}" -y -f concat -safe 0 -i "${concatListFile}" -c copy "${finalOutput}"`,
      { stdio: 'pipe', timeout: 300000 }
    );

    console.log(`  DONE: ${finalOutput}`);
  }

  console.log(`\n${'═'.repeat(60)}`);
  console.log('  All videos assembled!');
  console.log(`  Output: ${VIDEO_DIR}`);
  console.log(`${'═'.repeat(60)}`);
})();
