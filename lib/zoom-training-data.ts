import { TrainingPart } from "@/components/Training/types";

const IMG = {
  desktop: "/training/zoom/zoom-home-screen.png",
  toolbar: "/training/zoom/zoom-screenshare-toolbar.png",
  video: "/training/zoom/zoom-settings-video.png",
  audio: "/training/zoom/zoom-settings-audio.png",
  gallery: "/training/zoom/zoom-gallery-view.png",
  breakout: "/training/zoom/zoom-breakout-rooms.png",
  chat: "/training/zoom/zoom-chat-panel.png",
  recording: "/training/zoom/zoom-recording.png",
  hostControls: "/training/zoom/zoom-host-controls.png",
  whiteboard: "/training/zoom/zoom-whiteboard.png",
  security: "/training/zoom/zoom-security.png",
};

export const ZOOM_PARTS: TrainingPart[] = [
  {
    number: 1,
    title: "Getting Started with Zoom",
    subtitle: "Install, sign in, and navigate your new digital meeting room",
    whatYouWillLearn: [
      "What Zoom is and why so many organisations use it",
      "How to download and install the Zoom desktop app",
      "How to sign in with your work or personal account",
      "How to navigate the Zoom home screen",
      "The difference between the free and paid plans",
    ],
    sections: [
      {
        id: "p1-what-is-zoom",
        title: "What is Zoom?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom is a video conferencing platform that lets you meet face-to-face with anyone in the world — from your laptop, tablet, or phone.",
          },
          {
            type: "body",
            text: "Think of Zoom as a virtual meeting room. Instead of everyone travelling to the same physical location, you each open Zoom on your own device and appear in each other's screens via your webcam. You can see and hear each other in real time, share documents on screen, and collaborate — all without leaving your home or office.",
          },
          {
            type: "body",
            text: "It is used by millions of organisations worldwide for team meetings, training sessions, webinars, and one-on-one conversations. If you are leading a team across cultures or locations, Zoom is one of the most important tools in your toolkit.",
          },
          {
            type: "tip",
            text: "You do not need a paid account to join a Zoom meeting. The free plan is sufficient for most participants. Only the person hosting (running) the meeting needs to consider upgrading.",
          },
        ],
      },
      {
        id: "p1-install",
        title: "Installing Zoom",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "To use Zoom on your computer, you need to install the Zoom desktop app. This is a small programme you download once and it stays on your computer. The steps below walk you through it.",
          },
          {
            type: "url",
            url: "https://zoom.us/download",
            label: "Zoom Download Page",
          },
          {
            type: "bullet",
            bold: "Go to zoom.us/download",
            text: "Go to zoom.us/download — open the link above in your web browser (Chrome, Edge, or Safari).",
          },
          {
            type: "bullet",
            bold: "Click 'Download'",
            text: "Click 'Download' under the section labelled 'Zoom Desktop Client'. This is the main version for your computer.",
          },
          {
            type: "bullet",
            bold: "Run the installer",
            text: "Run the installer file that downloads to your computer. On Windows it is a .exe file; on Mac it is a .pkg file. Double-click it to begin.",
          },
          {
            type: "bullet",
            bold: "Follow the on-screen prompts",
            text: "Follow the on-screen prompts to complete installation. You may be asked to allow the app to make changes to your computer — click Yes or Allow.",
          },
          {
            type: "bullet",
            bold: "Launch Zoom",
            text: "Launch Zoom from your desktop or applications folder. You will see the sign-in screen.",
          },
          {
            type: "screenshot",
            description: "The Zoom desktop app home screen after signing in — 2026 redesign",
            imageUrl: IMG.desktop,
          },
        ],
      },
      {
        id: "p1-signin",
        title: "Signing In",
        blocks: [
          {
            type: "body",
            text: "Once Zoom is installed, you need to sign in to identify yourself. This is like logging in to your email — you use a username (your email address) and a password.",
          },
          {
            type: "body",
            text: "Open Zoom and click 'Sign In'. You have three options: sign in with your Zoom account, sign in with Google, or use SSO (Single Sign-On) if your organisation provides it.",
          },
          {
            type: "note",
            text: "If your organisation uses SSO, ask your IT department for your company domain. It will look something like 'yourcompany.zoom.us'. If you are not sure, use your regular work email and password first.",
          },
          {
            type: "tip",
            text: "If you have never used Zoom before, click 'Sign Up Free' on the Zoom website to create a free account using your email address. The whole process takes about two minutes.",
          },
        ],
      },
      {
        id: "p1-plans",
        title: "Free vs Paid Plans",
        blocks: [
          {
            type: "body",
            text: "Zoom offers both a free plan and several paid options. For most people joining or hosting small meetings, the free plan is more than enough. Here is what you need to know:",
          },
          {
            type: "bullet",
            text: "The free plan allows unlimited one-on-one meetings with no time limit.",
          },
          {
            type: "bullet",
            text: "Group meetings (3 or more people) on the free plan are limited to 40 minutes. After 40 minutes, the meeting ends automatically.",
          },
          {
            type: "bullet",
            text: "Paid plans (from approximately $15/month) remove the 40-minute limit and add features like cloud recording and webinars.",
          },
          {
            type: "tip",
            text: "If you are a participant joining someone else's meeting, you do not need to worry about their plan — just join. The time limit only matters for the host.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p1-c1", text: "I have installed the Zoom desktop app on my computer", type: "implemented" },
      { id: "p1-c2", text: "I can sign in and see the Zoom home screen", type: "implemented" },
      { id: "p1-c3", text: "I understand what Zoom is and why it is used", type: "understood" },
      { id: "p1-c4", text: "I understand the difference between free and paid Zoom plans", type: "understood" },
    ],
  },

  {
    number: 2,
    title: "Joining a Meeting",
    subtitle: "Enter any meeting confidently — with audio, video, and the right etiquette",
    whatYouWillLearn: [
      "What a meeting link is and where to find it",
      "How to join a meeting via a link or Meeting ID",
      "How to set up your audio and video before entering",
      "What the waiting room is and how it works",
      "Basic meeting etiquette for participants",
    ],
    sections: [
      {
        id: "p2-what-is-link",
        title: "What is a Meeting Link?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "When someone organises a Zoom meeting, Zoom automatically generates a unique link for that meeting. This link is how you 'enter' the virtual room.",
          },
          {
            type: "body",
            text: "The host (the person running the meeting) will send you this link in advance — usually by email or as part of a calendar invitation. It looks something like this:",
          },
          {
            type: "note",
            text: "Example meeting link: https://zoom.us/j/98765432100?pwd=abc123XYZ — You will receive this in an email or calendar invite. Simply click it and Zoom will open automatically.",
          },
          {
            type: "body",
            text: "You do not need to remember or type the link — just click it when the time comes. Keep the email or calendar invite open before the meeting so you can find the link quickly.",
          },
        ],
      },
      {
        id: "p2-join-link",
        title: "Joining via a Link",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "This is the most common way to join a Zoom meeting. Your host will send you a link — usually in an email or calendar invite — and you simply click it.",
          },
          {
            type: "bullet",
            bold: "Click the meeting link",
            text: "Click the meeting link sent to you by email or calendar invite. Your web browser will open.",
          },
          {
            type: "bullet",
            bold: "Open with Zoom",
            text: "Open with Zoom — your browser will display a pop-up asking how to open the link. Click 'Open Zoom' or 'Launch Meeting'. If you do not see this pop-up, look for a small grey message at the top or bottom of your browser.",
          },
          {
            type: "bullet",
            bold: "Test your audio and video",
            text: "Test your audio and video — a preview screen appears before you enter. You will see yourself on camera and can check that your microphone works. Click 'Join' when you are ready.",
          },
          {
            type: "bullet",
            bold: "Enter the waiting room",
            text: "Enter the waiting room — you may see a screen that says 'Please wait, the meeting host will let you in soon.' This is normal. The host will admit you when ready.",
          },
          {
            type: "screenshot",
            description: "Zoom Gallery View — what a meeting looks like once you are inside",
            imageUrl: IMG.gallery,
          },
        ],
      },
      {
        id: "p2-join-id",
        title: "Joining via Meeting ID",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Sometimes instead of a link, you will receive a Meeting ID — a 9 or 11-digit number. You can use this to join directly from inside the Zoom app.",
          },
          {
            type: "bullet",
            bold: "Open Zoom",
            text: "Open Zoom on your computer and click the 'Join' button on the home screen.",
          },
          {
            type: "bullet",
            bold: "Enter the Meeting ID",
            text: "Enter the Meeting ID — type in the 9 or 11-digit number from your invitation, and type your display name (the name others will see in the meeting).",
          },
          {
            type: "bullet",
            bold: "Enter the passcode",
            text: "Enter the passcode if required — some meetings have a passcode for security. It will be included in the same invitation as the Meeting ID.",
          },
          {
            type: "bullet",
            bold: "Click Join",
            text: "Click Join and wait to be admitted by the host.",
          },
        ],
      },
      {
        id: "p2-etiquette",
        title: "Meeting Etiquette",
        blocks: [
          {
            type: "body",
            text: "Joining a Zoom meeting is a bit like walking into a professional meeting room — the way you show up matters. Here are a few simple habits that will make a good impression and help the meeting run smoothly.",
          },
          { type: "bullet", text: "Join a few minutes early to test your connection and make sure your audio and video are working." },
          { type: "bullet", text: "Mute yourself on entry — unless you are the only speaker. Background noise (traffic, children, fans) is very distracting for others." },
          { type: "bullet", text: "Use a neutral, tidy background or set a virtual background if your environment is messy or distracting." },
          { type: "bullet", text: "Look at the camera when speaking, not at your own image on screen. This creates better eye contact with others." },
          {
            type: "tip",
            text: "If you have a noisy environment, keep yourself muted and use the chat to contribute to the conversation. Type your question or comment there and the host can read it aloud.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p2-c1", text: "I understand what a meeting link is and where to find it", type: "understood" },
      { id: "p2-c2", text: "I know how to join a meeting using a link", type: "understood" },
      { id: "p2-c3", text: "I know how to join using a Meeting ID", type: "understood" },
      { id: "p2-c4", text: "I have joined at least one Zoom meeting successfully", type: "implemented" },
      { id: "p2-c5", text: "I understand basic meeting etiquette as a participant", type: "understood" },
    ],
  },

  {
    number: 3,
    title: "Hosting Your First Meeting",
    subtitle: "Go from attendee to host — schedule, start, and run a meeting with confidence",
    whatYouWillLearn: [
      "The difference between joining and hosting a meeting",
      "How to start an instant meeting right now",
      "How to schedule a meeting in advance and share the link",
      "How to use the main host controls during a meeting",
    ],
    sections: [
      {
        id: "p3-host-vs-participant",
        title: "What Does It Mean to Be the Host?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "When you host a meeting, you are in charge. You create the meeting room, invite others, and control what happens inside it.",
          },
          {
            type: "body",
            text: "As a host you have special powers that participants do not have: you can mute others, remove people from the meeting, admit participants from the waiting room, lock the meeting once everyone is in, and end the meeting for everyone. This is different from being a participant, where you can only control your own audio and video.",
          },
          {
            type: "tip",
            text: "You need a Zoom account to host a meeting. You do not need one to join a meeting someone else is hosting.",
          },
        ],
      },
      {
        id: "p3-instant",
        title: "Starting an Instant Meeting",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "An instant meeting starts immediately — useful when you want to jump on a quick call without scheduling anything in advance.",
          },
          {
            type: "bullet",
            bold: "Open Zoom",
            text: "Open Zoom and click the large orange 'New Meeting' button on the home screen.",
          },
          {
            type: "bullet",
            bold: "Choose your video setting",
            text: "Choose your video setting — decide whether to start with your camera on or off.",
          },
          {
            type: "bullet",
            bold: "Start the meeting",
            text: "Start the meeting by clicking 'Start with Video' or 'Start without Video'. You are now the host inside an empty meeting room.",
          },
          {
            type: "bullet",
            bold: "Invite participants",
            text: "Invite participants by clicking 'Participants' in the toolbar, then 'Invite'. You can copy the meeting link and send it by email, WhatsApp, or any other way.",
          },
          {
            type: "screenshot",
            description: "Zoom Participants panel — host controls including admit, mute, and remove",
            imageUrl: IMG.hostControls,
          },
        ],
      },
      {
        id: "p3-schedule",
        title: "Scheduling a Meeting in Advance",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "For planned meetings, it is better to schedule in advance. This gives participants a calendar invitation with the meeting link included, so no one has to chase you for the details on the day.",
          },
          {
            type: "bullet",
            bold: "Click 'Schedule'",
            text: "Click 'Schedule' on the Zoom home screen. A scheduling window opens.",
          },
          {
            type: "bullet",
            bold: "Set the details",
            text: "Set the details — give the meeting a topic, choose the date, start time, and expected duration.",
          },
          {
            type: "bullet",
            bold: "Enable waiting room",
            text: "Enable waiting room — this is recommended. It lets you control who enters rather than having everyone appear at once.",
          },
          {
            type: "bullet",
            bold: "Save and share",
            text: "Save and share — click 'Save'. Zoom creates a calendar event. Copy the meeting link from there and send it to your participants.",
          },
        ],
      },
      {
        id: "p3-controls",
        title: "Host Controls During the Meeting",
        blocks: [
          {
            type: "body",
            text: "As the host, you will see a toolbar at the bottom of your screen during the meeting. In addition to your own audio and video controls, you have a set of host-only tools to manage the room.",
          },
          {
            type: "table",
            headers: ["Control", "What it does"],
            rows: [
              ["Mute All", "Mutes every participant at once — useful at the start of a training"],
              ["Manage Participants", "See who is in the meeting; mute or remove individuals"],
              ["Admit from Waiting Room", "Let in participants who are waiting outside"],
              ["Lock Meeting", "Prevent anyone new from joining once your group is complete"],
              ["End Meeting", "End for everyone, or leave the meeting while keeping it running"],
            ],
          },
          {
            type: "tip",
            text: "Lock the meeting once all expected participants have joined. This prevents uninvited guests from entering and protects the privacy of your session.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p3-c1", text: "I understand the difference between hosting and joining a meeting", type: "understood" },
      { id: "p3-c2", text: "I have started an instant meeting successfully", type: "implemented" },
      { id: "p3-c3", text: "I have scheduled a meeting and shared the link with someone", type: "implemented" },
      { id: "p3-c4", text: "I know how to use the main host controls", type: "understood" },
    ],
  },

  {
    number: 4,
    title: "Audio and Video Settings",
    subtitle: "Sound great and look professional — every time you appear on screen",
    whatYouWillLearn: [
      "How to select the right microphone and speakers",
      "How to test your audio before a meeting",
      "How to use virtual backgrounds",
      "How to adjust your video quality and appearance",
    ],
    sections: [
      {
        id: "p4-why-settings",
        title: "Why Audio and Video Settings Matter",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Poor audio is the number one reason Zoom meetings feel frustrating. If others cannot hear you clearly — or if background noise is distracting — it affects the whole group.",
          },
          {
            type: "body",
            text: "Taking 5 minutes to configure your settings before your first meeting will save you from awkward moments mid-call. You only need to do this once, and Zoom will remember your choices.",
          },
        ],
      },
      {
        id: "p4-audio",
        title: "Configuring Your Microphone and Speakers",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Zoom's audio settings let you choose which microphone and speakers it uses, and test that they are working correctly. Access them via the gear icon on the Zoom home screen.",
          },
          {
            type: "bullet",
            bold: "Open Settings",
            text: "Open Settings by clicking the gear icon in the top-right corner of the Zoom home screen.",
          },
          {
            type: "bullet",
            bold: "Go to Audio",
            text: "Go to Audio by selecting 'Audio' from the left menu.",
          },
          {
            type: "bullet",
            bold: "Select your microphone",
            text: "Select your microphone from the 'Microphone' dropdown. If you use a headset or external USB microphone, choose it here. If nothing is listed, your built-in mic will be used.",
          },
          {
            type: "bullet",
            bold: "Select your speakers",
            text: "Select your speakers from the 'Speaker' dropdown. Choose your headphones, speaker, or built-in speakers depending on what you are using.",
          },
          {
            type: "bullet",
            bold: "Test both",
            text: "Test both by clicking 'Test Speaker' and 'Test Mic'. For the speaker test, you should hear a short tune. For the mic test, speak and watch the input level bar move.",
          },
          {
            type: "screenshot",
            description: "Zoom Settings: Audio tab — microphone, speaker, and test buttons",
            imageUrl: IMG.audio,
          },
        ],
      },
      {
        id: "p4-video",
        title: "Video Settings",
        blocks: [
          {
            type: "body",
            text: "Good video quality starts with your environment — the single biggest improvement you can make is your lighting. Position yourself so light falls on your face from in front of you, not from behind (which makes you look like a silhouette).",
          },
          {
            type: "screenshot",
            description: "Zoom Settings: Video tab — HD, touch up appearance, and low light options",
            imageUrl: IMG.video,
          },
          { type: "bullet", text: "Enable 'HD' video in Settings → Video for a sharper, clearer image." },
          { type: "bullet", text: "'Touch up my appearance' adds a subtle softening filter — useful in bright or harsh lighting." },
          { type: "bullet", text: "'Adjust for low light' is helpful if your room is dim. It brightens the image automatically." },
          {
            type: "tip",
            text: "The best lighting is a window or desk lamp directly in front of you. Even an inexpensive ring light (available for under $20) makes a significant difference to how professional you appear on camera.",
          },
        ],
      },
      {
        id: "p4-backgrounds",
        title: "Virtual Backgrounds",
        blocks: [
          {
            type: "body",
            text: "A virtual background replaces your real background with an image or video of your choice. This is very useful when you are working from a messy room, a busy café, or anywhere you do not want others to see.",
          },
          {
            type: "body",
            text: "To set a virtual background: go to Settings → Background & Effects. You can choose from Zoom's built-in options (blurred background, office scenes) or upload your own image — for example, your organisation's branding or a simple neutral colour.",
          },
          {
            type: "note",
            text: "Virtual backgrounds work best when there is good lighting and a plain wall behind you. In poor lighting, Zoom's edge detection becomes unreliable — your head may appear to float or disappear at the edges. A green screen (a simple green piece of fabric hung behind you) solves this problem completely.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p4-c1", text: "I have selected and tested my microphone and speakers in Zoom Settings", type: "implemented" },
      { id: "p4-c2", text: "I have configured my video settings for good quality", type: "implemented" },
      { id: "p4-c3", text: "I understand how lighting affects my video quality", type: "understood" },
      { id: "p4-c4", text: "I know how to set a virtual background", type: "understood" },
    ],
  },

  {
    number: 5,
    title: "Screen Sharing",
    subtitle: "Show your screen, a specific window, or a presentation — without confusion",
    whatYouWillLearn: [
      "What screen sharing is and when to use it",
      "How to share your entire screen or a single window",
      "How to share a presentation in slideshow mode",
      "How to annotate while sharing",
      "How to stop sharing cleanly",
    ],
    sections: [
      {
        id: "p5-what-is-sharing",
        title: "What is Screen Sharing?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Screen sharing lets you show what is on your computer screen to everyone else in the meeting — in real time.",
          },
          {
            type: "body",
            text: "This is one of the most powerful features in Zoom. Instead of trying to describe something verbally, you can show a document, a website, a spreadsheet, or a presentation. Everyone sees your screen as if they were looking over your shoulder.",
          },
          {
            type: "tip",
            text: "Before sharing your screen, close any private browser tabs, emails, or documents you do not want others to see. It is very easy to accidentally reveal something you did not intend to share.",
          },
        ],
      },
      {
        id: "p5-start-share",
        title: "Starting a Screen Share",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Click 'Share Screen'",
            text: "Click 'Share Screen' — the green button in the bottom toolbar during a meeting.",
          },
          {
            type: "bullet",
            bold: "Choose what to share",
            text: "Choose what to share — a window will appear showing your options: your entire screen, a specific open application window, or a whiteboard.",
          },
          {
            type: "bullet",
            bold: "Check 'Share sound'",
            text: "Check 'Share sound' if you are sharing a video or audio clip. Look for the 'Share computer sound' checkbox at the bottom of the sharing window and tick it.",
          },
          {
            type: "bullet",
            bold: "Click Share",
            text: "Click Share to begin. A green border appears around your screen to confirm you are sharing. Others can now see everything you see.",
          },
          {
            type: "screenshot",
            description: "Zoom screen share in progress — green border visible, floating toolbar at top",
            imageUrl: IMG.toolbar,
          },
        ],
      },
      {
        id: "p5-present",
        title: "Sharing a Presentation",
        blocks: [
          {
            type: "body",
            text: "To share a PowerPoint or Keynote presentation: open the file on your computer first, then start sharing. In the sharing window, select the specific presentation window (not your whole screen). This way, participants only see your slides and not the rest of your desktop.",
          },
          {
            type: "body",
            text: "Start your slideshow as normal from inside PowerPoint or Keynote — participants will see your slides full-screen. You control the slides from your keyboard or mouse as usual.",
          },
          {
            type: "tip",
            text: "Always share a specific window rather than your entire screen. This protects your privacy and prevents distractions — participants do not need to see your taskbar, notifications, or other open tabs.",
          },
        ],
      },
      {
        id: "p5-annotate",
        title: "Annotating While Sharing",
        blocks: [
          {
            type: "body",
            text: "While sharing your screen, you can draw directly on top of what you are showing — useful for highlighting key information or walking participants through a document step by step.",
          },
          {
            type: "body",
            text: "To access annotation tools: hover your mouse near the top of your screen while sharing. A floating toolbar appears. Click 'Annotate' to open the drawing panel.",
          },
          { type: "bullet", text: "Pen tool — draw or underline directly on your screen." },
          { type: "bullet", text: "Spotlight — shows a circle that follows your cursor, pointing to what you are looking at." },
          { type: "bullet", text: "Clear — removes all annotations at once." },
          {
            type: "note",
            text: "Participants can also annotate if you allow it. To prevent others from drawing on your screen, click 'Annotate' in the toolbar, then 'Disable Participant Annotation'.",
          },
        ],
      },
      {
        id: "p5-stop",
        title: "Stopping the Share",
        blocks: [
          {
            type: "body",
            text: "To stop sharing, click the red 'Stop Share' button in the green toolbar at the top of your screen. The green border disappears and participants return to seeing your webcam view.",
          },
          {
            type: "tip",
            text: "Get into the habit of stopping your share as soon as you are done. It is easy to forget you are still sharing while you switch to a private window.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p5-c1", text: "I can share my screen during a Zoom meeting", type: "implemented" },
      { id: "p5-c2", text: "I know how to share a specific window rather than my entire screen", type: "understood" },
      { id: "p5-c3", text: "I can use the annotation tools while sharing", type: "understood" },
      { id: "p5-c4", text: "I always stop sharing when I am done", type: "understood" },
    ],
  },

  {
    number: 6,
    title: "Chat, Reactions, and Polls",
    subtitle: "Engage your participants — keep the conversation alive beyond the microphone",
    whatYouWillLearn: [
      "How to use the in-meeting chat panel",
      "How to use emoji reactions without interrupting",
      "How to create and launch a poll",
      "How to save the chat after a meeting",
    ],
    sections: [
      {
        id: "p6-chat",
        title: "In-Meeting Chat",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "The chat panel is a text box on the side of your Zoom screen where participants can type messages during the meeting — without interrupting whoever is speaking.",
          },
          {
            type: "body",
            text: "It is especially useful for sharing links, asking questions when the mic is busy, and letting quieter participants contribute. Participants can send messages to 'Everyone' (visible to all) or privately to one person.",
          },
          {
            type: "body",
            text: "To open the chat: click 'Chat' in the bottom toolbar during a meeting. A panel slides open on the right side of your screen.",
          },
          {
            type: "screenshot",
            description: "Zoom Chat panel — messages from participants and a reply being typed",
            imageUrl: IMG.chat,
          },
          {
            type: "tip",
            text: "If you are the host and also presenting, designate a co-host to watch the chat while you speak. It is very difficult to present and monitor chat at the same time.",
          },
        ],
      },
      {
        id: "p6-reactions",
        title: "Reactions",
        blocks: [
          {
            type: "body",
            text: "Zoom reactions let participants respond in real time without unmuting or interrupting the flow of conversation. They are small emoji that appear briefly on the participant's video tile.",
          },
          {
            type: "body",
            text: "To send a reaction: click 'Reactions' in the toolbar. You will see a selection of emoji: thumbs up, clap, heart, surprised, and more. There is also a 'Raise Hand' button.",
          },
          { type: "bullet", text: "Raised hand — signals the participant wants to speak. As the host, you can see raised hands in the Participants panel and call on them in order." },
          { type: "bullet", text: "Thumbs up or clap — quick agreement or acknowledgement, without interrupting the speaker." },
          { type: "bullet", text: "Reactions disappear after a few seconds, but the raised hand stays until the host lowers it or the participant lowers it themselves." },
          {
            type: "note",
            text: "Encourage participants to use 'Raise Hand' instead of unmuting themselves to speak. This keeps meetings orderly, especially in larger groups.",
          },
        ],
      },
      {
        id: "p6-polls",
        title: "Polls",
        blocks: [
          {
            type: "body",
            text: "Polls allow you to ask your participants a question and collect their answers instantly — with results displayed live on screen. They are excellent for quick decisions, checking understanding, or opening a discussion topic.",
          },
          {
            type: "body",
            text: "To launch a poll during a meeting: click 'Polls/Quizzes' in the toolbar. Select a prepared poll and click 'Launch'. Participants see the question and answer options on their screen. Results appear in real time.",
          },
          {
            type: "url",
            url: "https://zoom.us/meeting",
            label: "Zoom Web Portal — create polls before your meeting",
          },
          {
            type: "tip",
            text: "Create your polls in advance through the Zoom web portal (link above), under your meeting's settings. Trying to create a poll live during a meeting while participants are waiting is stressful — prepare them beforehand.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p6-c1", text: "I know how to open the in-meeting chat panel", type: "understood" },
      { id: "p6-c2", text: "I can use reactions and understand the Raise Hand feature", type: "understood" },
      { id: "p6-c3", text: "I have created or used a poll in a Zoom meeting", type: "implemented" },
    ],
  },

  {
    number: 7,
    title: "Breakout Rooms",
    subtitle: "Split your group into smaller conversations — and bring them back together",
    whatYouWillLearn: [
      "What breakout rooms are and when to use them",
      "How to create and assign participants to rooms",
      "How to send a message to all rooms at once",
      "How to close rooms and bring everyone back",
    ],
    sections: [
      {
        id: "p7-what",
        title: "What are Breakout Rooms?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Breakout rooms allow you to split your meeting participants into smaller, separate groups — each in their own private video session — and then bring everyone back to the main meeting when the group work is done.",
          },
          {
            type: "body",
            text: "Think of it like a classroom exercise: the teacher (host) keeps the whole group together for the lesson, then sends them into smaller discussion groups, then calls everyone back to report what they found. This all happens inside Zoom without anyone needing to leave or rejoin.",
          },
          {
            type: "body",
            text: "Breakout rooms are ideal for: small group discussions, workshop activities, training exercises, team brainstorming, and any time you want people to interact in smaller numbers before reporting back to the full group.",
          },
          {
            type: "url",
            url: "https://zoom.us/profile/setting",
            label: "Zoom Account Settings — enable breakout rooms here",
          },
          {
            type: "tip",
            text: "Breakout rooms must be enabled in your Zoom account settings before your first use (link above → In Meeting (Advanced) → Breakout room). You only need to do this once.",
          },
        ],
      },
      {
        id: "p7-create",
        title: "Creating and Opening Breakout Rooms",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Click 'Breakout Rooms'",
            text: "Click 'Breakout Rooms' in the meeting toolbar at the bottom of your screen. You must be the host to see this option.",
          },
          {
            type: "bullet",
            bold: "Set the number of rooms",
            text: "Set the number of rooms — decide how many groups you want to create. Zoom supports up to 50 rooms.",
          },
          {
            type: "bullet",
            bold: "Assign participants",
            text: "Assign participants — choose how Zoom should distribute people: Automatically (random), Manually (you pick who goes where), or Let participants choose their own room.",
          },
          {
            type: "bullet",
            bold: "Click Create",
            text: "Click Create — the rooms are prepared but not yet open. You can review who is in each room and adjust if needed.",
          },
          {
            type: "bullet",
            bold: "Click Open All Rooms",
            text: "Click Open All Rooms to send participants in. Each person receives an invitation on their screen to join their assigned room.",
          },
          {
            type: "screenshot",
            description: "Zoom Breakout Rooms panel — rooms created with participants assigned",
            imageUrl: IMG.breakout,
          },
        ],
      },
      {
        id: "p7-manage",
        title: "Managing Breakout Rooms",
        blocks: [
          {
            type: "body",
            text: "While rooms are open, you — as the host — remain in the main session. You can visit any room, send a message to all groups, or set a timer.",
          },
          { type: "bullet", text: "Click 'Broadcast a message' to type a text that appears in all rooms simultaneously — useful for warnings like '5 minutes remaining'." },
          { type: "bullet", text: "Click 'Join' next to any room name to visit that group and check how they are progressing." },
          { type: "bullet", text: "Set a countdown timer — when the time runs out, rooms close automatically and participants return to the main session." },
          {
            type: "bullet",
            text: "Click 'Close All Rooms' to give participants a 60-second warning before they are returned to the main meeting.",
          },
          {
            type: "note",
            text: "Participants can leave a breakout room and return to the main session at any time by clicking 'Leave Breakout Room' in their toolbar. They do not need to wait for you to close the rooms.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p7-c1", text: "I understand what breakout rooms are and when to use them", type: "understood" },
      { id: "p7-c2", text: "I have created and opened breakout rooms in a meeting", type: "implemented" },
      { id: "p7-c3", text: "I know how to broadcast a message to all rooms and close them", type: "understood" },
    ],
  },

  {
    number: 8,
    title: "Recording Meetings",
    subtitle: "Capture your sessions so nothing is lost — and protect everyone's privacy",
    whatYouWillLearn: [
      "How to start and stop a recording",
      "The difference between local and cloud recording",
      "How to find and share your recording after the meeting",
      "Your legal and ethical responsibilities when recording",
    ],
    sections: [
      {
        id: "p8-why-record",
        title: "Why Record a Meeting?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Recording a Zoom meeting creates a video file of everything that happened — the video, audio, screen shares, and chat — so participants can review it later.",
          },
          {
            type: "body",
            text: "This is especially valuable for training sessions (participants can rewatch at their own pace), important decisions (you have a record of who agreed to what), and team members who could not attend live.",
          },
        ],
      },
      {
        id: "p8-record",
        title: "Starting a Recording",
        procedural: true,
        blocks: [
          {
            type: "bullet",
            bold: "Click 'Record'",
            text: "Click 'Record' in the bottom toolbar during the meeting. Only the host (or a participant the host has given permission to) can start a recording.",
          },
          {
            type: "bullet",
            bold: "Choose where to save",
            text: "Choose where to save — click 'Record on this Computer' to save the file to your hard drive (available on all plans), or 'Record to the Cloud' to save online (requires a paid plan).",
          },
          {
            type: "bullet",
            bold: "Check the REC indicator",
            text: "Check the REC indicator — a red 'REC' dot appears in the top-left corner of the meeting for everyone. This confirms the recording is active and lets all participants know they are being recorded.",
          },
          {
            type: "bullet",
            bold: "Pause or stop at any time",
            text: "Pause or stop at any time using the recording controls in the toolbar. Pausing keeps the recording file open; stopping closes it.",
          },
          {
            type: "screenshot",
            description: "Zoom meeting with active recording — red REC indicator and recording notification",
            imageUrl: IMG.recording,
          },
        ],
      },
      {
        id: "p8-after",
        title: "Finding Your Recording After the Meeting",
        blocks: [
          {
            type: "body",
            text: "After the meeting ends, Zoom processes the recording and converts it to an MP4 video file. This processing may take a few minutes — do not close Zoom immediately after the meeting ends or the processing may be interrupted.",
          },
          {
            type: "body",
            text: "Local recordings are saved by default to your Documents/Zoom folder. You can open this folder directly from Zoom: click 'Meetings' in the left navigation, then the 'Recorded' tab.",
          },
          {
            type: "url",
            url: "https://zoom.us/recording",
            label: "Zoom Cloud Recordings — access your cloud-saved recordings here",
          },
          {
            type: "body",
            text: "Cloud recordings (paid plans) are available at the link above. You can share a direct viewing link from there without needing to send a large video file.",
          },
          {
            type: "tip",
            text: "For training sessions, recording to the cloud and sharing the link is the most convenient option. Participants can re-watch specific sections at their own pace without you needing to send a large video file.",
          },
        ],
      },
      {
        id: "p8-consent",
        title: "Recording Consent — Your Responsibility",
        blocks: [
          {
            type: "body",
            text: "Before you record any meeting, you must inform all participants. This is both a legal requirement in many countries and a matter of basic respect.",
          },
          {
            type: "warning",
            text: "In many countries and regions, recording a conversation without the consent of all participants is illegal. Always announce the recording verbally at the start of the meeting. Zoom does display an automatic notification when recording begins, but a verbal announcement is also expected.",
          },
          { type: "bullet", text: "Announce at the start: 'I will be recording this session.' Give people a moment to acknowledge this." },
          { type: "bullet", text: "Offer participants the option to turn off their camera if they prefer not to appear in the recording." },
          { type: "bullet", text: "Do not share recordings publicly or with third parties without the knowledge and consent of all participants." },
        ],
      },
    ],
    endChecklist: [
      { id: "p8-c1", text: "I know how to start and stop a local recording", type: "understood" },
      { id: "p8-c2", text: "I know where to find my recordings after the meeting ends", type: "implemented" },
      { id: "p8-c3", text: "I understand my responsibility to inform participants before recording", type: "understood" },
    ],
  },

  {
    number: 9,
    title: "Zoom for Training and Webinars",
    subtitle: "Lead learning experiences that engage, inspire, and stick",
    whatYouWillLearn: [
      "The key difference between a Zoom meeting and a webinar",
      "How to structure a Zoom training session",
      "How to use Zoom Whiteboard for collaborative learning",
      "How to manage a large group without losing control",
    ],
    sections: [
      {
        id: "p9-meeting-vs-webinar",
        title: "Meeting vs. Webinar — Which One Do You Need?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom offers two different formats for bringing people together: a Meeting and a Webinar. They look similar but work very differently — understanding the distinction will help you choose the right tool.",
          },
          {
            type: "body",
            text: "In a Meeting, every participant can see and hear each other, interact freely, and turn on their camera. In a Webinar, only the host and designated panellists are visible — the audience watches and listens, but cannot turn on cameras or speak unless given permission.",
          },
          {
            type: "table",
            headers: ["Feature", "Meeting", "Webinar"],
            rows: [
              ["Participants can use video/audio", "Yes", "Host and panellists only"],
              ["Attendees can see each other", "Yes", "No"],
              ["Maximum attendees", "Up to 1,000", "Up to 50,000"],
              ["Best for", "Team calls, training sessions", "Large presentations, broadcasts"],
              ["Pricing", "Included in all plans", "Paid add-on only"],
            ],
          },
          {
            type: "tip",
            text: "For most leadership training sessions (under 100 people), a standard Zoom meeting works better than a webinar. It feels more personal and participatory — people can ask questions verbally, interact with each other, and use breakout rooms.",
          },
        ],
      },
      {
        id: "p9-structure",
        title: "Structuring a Training Session",
        blocks: [
          {
            type: "body",
            text: "Running a training session on Zoom requires more deliberate structuring than an in-person session. Without physical cues (raised hands, side conversations), you need to build in explicit engagement moments.",
          },
          { type: "bullet", bold: "Open 5 minutes early", text: "Open 5 minutes early — start the meeting before participants arrive. Welcome people as they join and do a quick tech check." },
          { type: "bullet", bold: "Set expectations upfront", text: "Set expectations upfront — tell people when to use chat, when to ask questions, whether you will use breakout rooms, and whether the session is being recorded." },
          { type: "bullet", bold: "Vary the format", text: "Vary the format every 15–20 minutes — mix presentation with discussion, polls, and breakout rooms. Passive listening for more than 20 minutes leads to disengagement." },
          { type: "bullet", bold: "Use names", text: "Use names when calling on participants. 'Aisha, what did you think of that point?' creates connection and helps people feel seen in a large group." },
          { type: "bullet", bold: "End with clear next steps", text: "End with clear next steps — what should participants do before the next session? Write it in the chat and share it as a summary after the call." },
        ],
      },
      {
        id: "p9-whiteboard",
        title: "Using Zoom Whiteboard",
        blocks: [
          {
            type: "body",
            text: "Zoom Whiteboard is a shared digital canvas that all participants can draw on together in real time. It is ideal for brainstorming sessions, mind maps, visual exercises, and any activity where you want the group to contribute ideas visually.",
          },
          {
            type: "body",
            text: "To open a whiteboard: click 'Share Screen' in the toolbar → select 'Whiteboard'. The canvas appears for everyone. Participants can add sticky notes, draw shapes, write text, and connect ideas — all at the same time.",
          },
          {
            type: "screenshot",
            description: "Zoom Whiteboard — collaborative mind map on Cross-Cultural Leadership with annotation tools",
            imageUrl: IMG.whiteboard,
          },
          {
            type: "url",
            url: "https://whiteboard.zoom.us",
            label: "Zoom Whiteboard — access saved whiteboards and templates",
          },
          {
            type: "note",
            text: "The enhanced Zoom Whiteboard (link above) includes ready-made templates for retrospectives, mind maps, and planning boards — available on paid plans. After a session, the whiteboard can be exported as an image or PDF and shared with participants.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p9-c1", text: "I understand when to use a Meeting versus a Webinar", type: "understood" },
      { id: "p9-c2", text: "I can structure a Zoom training session effectively", type: "understood" },
      { id: "p9-c3", text: "I have used Zoom Whiteboard in a session", type: "implemented" },
    ],
  },

  {
    number: 10,
    title: "Security and Privacy",
    subtitle: "Keep your meetings safe — no uninvited guests, no surprises",
    whatYouWillLearn: [
      "What 'Zoom-bombing' is and how to prevent it",
      "How to use passcodes and waiting rooms together",
      "How to manage what participants are allowed to do",
      "What to do if a meeting is disrupted",
    ],
    sections: [
      {
        id: "p10-zoombombing",
        title: "What is Zoom-Bombing?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "'Zoom-bombing' refers to uninvited people joining a Zoom meeting and disrupting it — sometimes with offensive or inappropriate content.",
          },
          {
            type: "body",
            text: "It became a widespread problem when people shared Zoom meeting links publicly on social media. Zoom has since added strong security features to prevent this, but you need to turn them on — they are not all active by default.",
          },
        ],
      },
      {
        id: "p10-prevent",
        title: "Preventing Uninvited Guests",
        blocks: [
          {
            type: "body",
            text: "These are the most important security habits every host should follow. Set them before your first public meeting and you will be protected.",
          },
          { type: "bullet", text: "Always enable a meeting passcode. Set this when scheduling the meeting — it is included automatically in the meeting link you share." },
          { type: "bullet", text: "Enable the waiting room so you can see and approve each participant before they enter." },
          { type: "bullet", text: "Never post your meeting link publicly on social media or in public forums. Share it only with people you have directly invited." },
          { type: "bullet", text: "Lock the meeting once all expected participants have joined (Security → Lock Meeting). New participants will be turned away." },
          {
            type: "warning",
            text: "Do not use your Personal Meeting ID (PMI) for public or large meetings. Your PMI is a permanent, unchanging link — if it has ever been shared widely, anyone with that link can try to join your meeting at any time.",
          },
          {
            type: "screenshot",
            description: "Zoom Security panel — waiting room, lock meeting, and participant permission controls",
            imageUrl: IMG.security,
          },
        ],
      },
      {
        id: "p10-permissions",
        title: "Managing What Participants Can Do",
        blocks: [
          {
            type: "body",
            text: "As the host, you decide what participants are allowed to do during the meeting. Click 'Security' in the toolbar during a meeting to toggle these permissions on or off at any time.",
          },
          {
            type: "table",
            headers: ["Permission", "Default", "Recommended for training"],
            rows: [
              ["Share Screen", "Hosts only", "Hosts only — prevent accidental sharing"],
              ["Chat", "Everyone", "Everyone — essential for questions"],
              ["Rename themselves", "On", "Off — prevents confusion with anonymous names"],
              ["Unmute themselves", "On", "Off — use Raise Hand instead"],
              ["Start Video", "On", "On — encourage camera use"],
            ],
          },
        ],
      },
      {
        id: "p10-disruption",
        title: "If a Meeting is Disrupted",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "If someone enters your meeting and starts causing disruption, act quickly and calmly. These steps will stop the problem within seconds.",
          },
          {
            type: "bullet",
            bold: "Mute all participants immediately",
            text: "Mute all participants immediately — go to Participants → Mute All. This silences the disruptor and everyone else.",
          },
          {
            type: "bullet",
            bold: "Remove the disruptor",
            text: "Remove the disruptor by right-clicking on their name in the Participants panel → Remove. A removed participant cannot rejoin the same meeting.",
          },
          {
            type: "bullet",
            bold: "Lock the meeting",
            text: "Lock the meeting immediately — click Security → Lock Meeting. No further uninvited people can enter.",
          },
          {
            type: "bullet",
            bold: "Report if necessary",
            text: "Report if necessary — use Security → Report to flag the user to Zoom's Trust & Safety team, especially if the behaviour was abusive or illegal.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p10-c1", text: "I always use a passcode and waiting room for my meetings", type: "implemented" },
      { id: "p10-c2", text: "I understand what participant permissions I can control", type: "understood" },
      { id: "p10-c3", text: "I know what to do if a meeting is disrupted", type: "understood" },
      { id: "p10-c4", text: "I never share my PMI for public meetings", type: "understood" },
    ],
  },

  {
    number: 11,
    title: "Zoom Settings and Productivity Tips",
    subtitle: "Fine-tune your setup and work smarter — not just connected",
    whatYouWillLearn: [
      "The key Zoom settings worth configuring once",
      "Essential keyboard shortcuts to move faster",
      "Tips for managing multiple Zoom calls in a work day",
      "How to connect Zoom with your calendar",
    ],
    sections: [
      {
        id: "p11-settings",
        title: "Key Settings to Configure Once",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Zoom has many settings, but a few simple changes — done once — will make every future meeting smoother. These are the settings experienced Zoom users configure on day one.",
          },
          { type: "bullet", bold: "Mute mic on entry", text: "Mute mic on entry — go to Settings → Audio → tick 'Mute my microphone when joining a meeting'. This prevents you from accidentally broadcasting background noise when you first join." },
          { type: "bullet", bold: "Join with video off", text: "Join with video off — go to Settings → Video → tick 'Turn off my video when joining a meeting'. This gives you a moment to check your appearance before going live." },
          { type: "bullet", bold: "Enable automatic updates", text: "Enable automatic updates — keep Zoom updated automatically. Security patches and new features arrive regularly and an outdated app can cause connection problems." },
          { type: "bullet", bold: "Set your display name", text: "Set your display name to 'First Last' or 'First Last | Role' (e.g., 'Ana Lima | Project Manager') for professional clarity in larger meetings." },
          {
            type: "screenshot",
            description: "Zoom Settings panel — audio defaults configured for professional use",
            imageUrl: IMG.audio,
          },
        ],
      },
      {
        id: "p11-shortcuts",
        title: "Keyboard Shortcuts",
        blocks: [
          {
            type: "body",
            text: "Keyboard shortcuts let you control Zoom without taking your hands off the keyboard or hunting for buttons — useful when you are in the middle of speaking or presenting.",
          },
          {
            type: "table",
            headers: ["Shortcut (Mac / Windows)", "Action"],
            rows: [
              ["Cmd+Shift+A / Alt+A", "Mute or unmute your microphone"],
              ["Cmd+Shift+V / Alt+V", "Start or stop your video"],
              ["Cmd+Shift+S / Alt+S", "Start or stop screen sharing"],
              ["Cmd+Shift+H / Alt+H", "Show or hide the chat panel"],
              ["Cmd+Shift+M / Alt+M", "Mute all participants (host only)"],
              ["Space (hold)", "Temporarily unmute yourself — release to re-mute"],
            ],
          },
          {
            type: "tip",
            text: "The Space bar shortcut (push-to-talk) is one of the most useful in Zoom. Hold Space to unmute yourself, say a quick comment, then release to mute again. Much faster than clicking the microphone button.",
          },
        ],
      },
      {
        id: "p11-calendar",
        title: "Connecting Zoom to Your Calendar",
        blocks: [
          {
            type: "body",
            text: "Zoom can connect directly to Google Calendar, Outlook, or Apple Calendar. Once connected, you can schedule Zoom meetings from inside your calendar app and join meetings with one click directly from calendar events.",
          },
          {
            type: "body",
            text: "To set up the integration: for Google Calendar, install the Zoom add-on from the Google Workspace Marketplace. For Outlook, install the Zoom plug-in from the Microsoft AppSource store.",
          },
          {
            type: "note",
            text: "The Zoom Outlook plug-in adds a 'Schedule a Meeting' button directly inside Outlook — the most efficient workflow if Outlook is your primary tool. A single click creates a calendar event with the Zoom meeting link pre-filled.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "p11-c1", text: "I have set my Zoom audio and video defaults (mute on entry, video off on entry)", type: "implemented" },
      { id: "p11-c2", text: "I know at least 3 Zoom keyboard shortcuts I will use regularly", type: "understood" },
      { id: "p11-c3", text: "I have connected Zoom to my calendar", type: "implemented" },
      { id: "p11-c4", text: "I feel confident using Zoom for professional meetings and training sessions", type: "understood" },
    ],
  },
];
