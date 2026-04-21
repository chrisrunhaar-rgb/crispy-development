import { TrainingPart } from "@/components/Training/types";

const IMG = {
  chat: "/training/teams/3 — Chat interface (Part 3).png",
  createTeam: "/training/teams/4 — Channels list (Part 4).png",
  instantMeeting: "/training/teams/1 — Home screen (Part 1).png",
  scheduleMeeting: "/training/teams/5 — New Meeting form (Part 5).png",
  joinMeeting: "/training/teams/6 — Pre-join screen (Part 6).png",
  files: "/training/teams/7 — Files tab (Part 7).png",
  unifiedInterface: "/training/teams/2 — Left navigation (Part 2).png",
};

export const TEAMS_PARTS: TrainingPart[] = [
  {
    number: 1,
    title: "Getting Started",
    subtitle: "Installing, signing in, and opening Teams for the first time",
    whatYouWillLearn: [
      "What Microsoft Teams is and how it fits into your work",
      "How to install Teams on your desktop computer and mobile phone",
      "How to sign in with your work account",
      "What to expect the first time you open Teams",
    ],
    sections: [
      {
        id: "t1-what",
        title: "What is Microsoft Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Microsoft Teams is a communication and collaboration platform built into Microsoft 365 — it brings together chat, video meetings, file storage, and app integrations all in one place.",
          },
          {
            type: "body",
            text: "Think of it as a central hub for your team's work. Instead of switching between email, a separate video call app, a file storage system, and a messaging tool, Teams combines all of these into a single application. You can message a colleague, jump on a video call, co-edit a document, and review your calendar — without ever leaving the Teams window.",
          },
          {
            type: "body",
            text: "Teams is used by organisations of all sizes — from small nonprofits to multinational corporations. If your organisation uses Microsoft 365 (formerly Office 365), you almost certainly already have access to Teams.",
          },
          {
            type: "tip",
            text: "Teams is not just for big companies. Many small teams, churches, and ministries use it as their primary communication tool. If your organisation already pays for Microsoft 365, Teams is included at no extra cost.",
          },
        ],
      },
      {
        id: "t1-install",
        title: "Installing Teams",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "To use Teams on your computer, you need to install the desktop app. This is a one-time process that takes about 3 minutes. Follow the steps below.",
          },
          { type: "h3", text: "Desktop (Windows or Mac)" },
          {
            type: "url",
            url: "https://www.microsoft.com/en-us/microsoft-teams/download-app",
            label: "Download Microsoft Teams",
          },
          {
            type: "bullet",
            bold: "Open the download page",
            text: "Open the download page using the link above in your web browser.",
          },
          {
            type: "bullet",
            bold: "Click 'Download for desktop'",
            text: "Click 'Download for desktop' — look for the button that matches your operating system (Windows or Mac).",
          },
          {
            type: "bullet",
            bold: "Run the installer",
            text: "Run the installer file once it finishes downloading. On Windows, double-click the .exe file. On Mac, double-click the .pkg file.",
          },
          {
            type: "bullet",
            bold: "Follow the on-screen steps",
            text: "Follow the on-screen steps to complete the installation. You may be asked to allow the app to make changes to your computer — click Yes or Allow.",
          },
          {
            type: "bullet",
            bold: "Teams opens automatically",
            text: "Teams opens automatically once installation is complete and takes you to the sign-in screen.",
          },
          {
            type: "screenshot",
            description: "Microsoft Teams desktop app — home screen after signing in",
            imageUrl: IMG.instantMeeting,
          },
          { type: "h3", text: "Mobile (iPhone or Android)" },
          {
            type: "body",
            text: "Teams is also available as a mobile app, so you can stay connected when away from your desk. It works on both iPhone and Android.",
          },
          {
            type: "bullet",
            bold: "Open the App Store or Google Play",
            text: "Open the App Store (on iPhone) or Google Play Store (on Android).",
          },
          {
            type: "bullet",
            bold: "Search for 'Microsoft Teams'",
            text: "Search for 'Microsoft Teams' — make sure to install the official app by Microsoft Corporation.",
          },
          {
            type: "bullet",
            bold: "Tap Get or Install",
            text: "Tap Get (iPhone) or Install (Android) and wait for the download to complete.",
          },
        ],
      },
      {
        id: "t1-signin",
        title: "Signing In",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Once Teams is installed, you need to sign in. This links the app to your Microsoft 365 account so Teams knows who you are and which organisation you belong to.",
          },
          {
            type: "bullet",
            bold: "Open Teams",
            text: "Open Teams on your device — you will see the sign-in screen.",
          },
          {
            type: "bullet",
            bold: "Enter your work email address",
            text: "Enter your work email address — this is the email your organisation provided (e.g. yourname@yourorganisation.com).",
          },
          {
            type: "bullet",
            bold: "Click Sign in",
            text: "Click Sign in and enter your password when prompted.",
          },
          {
            type: "bullet",
            bold: "Approve two-factor authentication",
            text: "Approve two-factor authentication if your organisation uses it — you may receive a code by SMS or a prompt on your phone to approve the sign-in.",
          },
          {
            type: "note",
            text: "If you cannot sign in, contact your IT administrator. They need to have created a Teams account for you inside your organisation's Microsoft 365 account. Without this, you cannot sign in.",
          },
          {
            type: "tip",
            text: "Sign in on both your desktop and mobile phone. Messages and meetings sync across all your devices in real time — so you will never miss a notification when away from your desk.",
          },
        ],
      },
      {
        id: "t1-setup",
        title: "First-Time Setup",
        blocks: [
          {
            type: "body",
            text: "The first time you sign in to Teams, it may ask a few setup questions and show you a short introduction. Here is what to expect:",
          },
          {
            type: "bullet",
            text: "Teams may prompt you to download the desktop app if you first signed in via a web browser — do this for the best experience.",
          },
          {
            type: "bullet",
            text: "Click Allow notifications when prompted. Without notifications, you will not know when messages or calls arrive.",
          },
          {
            type: "bullet",
            text: "Teams will display your main workspace — you will see a left sidebar with icons for Activity, Chat, Teams, Calendar, and more.",
          },
          {
            type: "tip",
            text: "Do not be overwhelmed by the interface on first opening. You only need to use a small part of it for most work. This training will take you through each section step by step.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t1-c1", text: "I have installed Microsoft Teams on my desktop computer", type: "implemented" },
      { id: "t1-c2", text: "I have installed Microsoft Teams on my mobile device", type: "implemented" },
      { id: "t1-c3", text: "I can sign in successfully with my work email", type: "implemented" },
      { id: "t1-c4", text: "I understand that Teams is part of Microsoft 365 and requires an organisational account", type: "understood" },
      { id: "t1-c5", text: "I have allowed Teams to send me notifications", type: "implemented" },
    ],
  },

  {
    number: 2,
    title: "The Interface",
    subtitle: "Finding your way around Teams — quickly and confidently",
    whatYouWillLearn: [
      "What each icon in the left navigation bar does",
      "How to use the search bar to find anything fast",
      "How to set your availability status",
      "How the mobile layout differs from the desktop",
    ],
    sections: [
      {
        id: "t2-overview",
        title: "Understanding the Layout",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "When you open Teams, you are looking at a workspace made up of several sections. The most important is the left-hand navigation bar — this is how you move between different parts of Teams.",
          },
          {
            type: "body",
            text: "Think of it like the layout of an office building: the left sidebar is the directory that tells you what is on each floor. Click an icon to go to that section. Everything you need is reachable from this sidebar within one or two clicks.",
          },
        ],
      },
      {
        id: "t2-nav",
        title: "The Left Navigation Bar",
        blocks: [
          {
            type: "screenshot",
            description: "Microsoft Teams — the new unified interface showing the left navigation sidebar",
            imageUrl: IMG.unifiedInterface,
          },
          {
            type: "body",
            text: "Here is what each icon in the left sidebar does:",
          },
          {
            type: "bullet",
            bold: "Activity",
            text: "Activity — your notification feed. Every @mention directed at you, every reply to your messages, and every reaction someone gives your posts appears here. Check this first when you open Teams.",
          },
          {
            type: "bullet",
            bold: "Chat",
            text: "Chat — all your one-on-one and group text conversations. This is where you have private conversations, not in a team channel.",
          },
          {
            type: "bullet",
            bold: "Teams",
            text: "Teams — all the teams and channels you belong to. This is where group collaboration happens.",
          },
          {
            type: "bullet",
            bold: "Calendar",
            text: "Calendar — your meeting schedule, connected directly to your Outlook calendar. Schedule meetings and join calls from here.",
          },
          {
            type: "bullet",
            bold: "Calls",
            text: "Calls — make audio or video calls directly from Teams, and see your call history.",
          },
          {
            type: "bullet",
            bold: "Files",
            text: "Files — access all the files shared with you across Teams and OneDrive in one place.",
          },
          {
            type: "tip",
            text: "The Activity feed (bell icon) is your starting point each day. It shows everything that needs your attention — mentions, replies, and reactions — without you having to check every chat and channel individually.",
          },
        ],
      },
      {
        id: "t2-search",
        title: "The Search Bar",
        blocks: [
          {
            type: "body",
            text: "At the top of the Teams screen, you will find a search bar. This is one of the most useful features in the entire application — use it to find people, past messages, files, and teams.",
          },
          {
            type: "bullet",
            text: "To search for a person: type their name and press Enter. You can then message them or start a call directly from the search result.",
          },
          {
            type: "bullet",
            text: "To search for a past message: type a word or phrase and Teams will show you every conversation where that word appeared.",
          },
          {
            type: "bullet",
            text: "To search for a file: type the file name and Teams shows you where it is stored.",
          },
          {
            type: "tip",
            text: "Press Ctrl+F (Windows) or Cmd+F (Mac) to search within a specific chat or channel conversation rather than searching the whole of Teams.",
          },
        ],
      },
      {
        id: "t2-profile",
        title: "Your Profile and Status",
        blocks: [
          {
            type: "body",
            text: "Your profile picture (or your initials if you have not set a photo) appears in the top-right corner of Teams. Click it to access your settings and set your availability status.",
          },
          {
            type: "body",
            text: "Your status is a small coloured circle next to your profile picture. It tells your colleagues whether you are available to respond. You should keep this updated throughout the day.",
          },
          {
            type: "bullet",
            bold: "Available",
            text: "Available — green circle. You are free to respond to messages and calls.",
          },
          {
            type: "bullet",
            bold: "Busy",
            text: "Busy — red circle. You are in a meeting or focused on work. Messages are received but you may not respond immediately.",
          },
          {
            type: "bullet",
            bold: "Do Not Disturb",
            text: "Do Not Disturb — red circle with a line. Notifications are silenced completely. Use this when you need uninterrupted focus time.",
          },
          {
            type: "bullet",
            bold: "Away",
            text: "Away — yellow clock. Teams sets this automatically when your computer has been idle. You can also set it manually.",
          },
          {
            type: "tip",
            text: "Set a status message to give your colleagues context — for example, 'In training until 3pm' or 'Working on proposal — checking messages at 2pm'. Click your profile picture, then 'Set status message'.",
          },
        ],
      },
      {
        id: "t2-mobile",
        title: "On Mobile — Bottom Navigation Bar",
        blocks: [
          {
            type: "body",
            text: "On the Teams mobile app (iPhone or Android), the navigation works differently. Instead of a left sidebar, you have a row of icons at the bottom of the screen: Activity, Chat, Teams, Calendar, and More.",
          },
          {
            type: "body",
            text: "Tap any icon to switch to that section. The content is the same as on the desktop — your messages, teams, and calendar all sync instantly across devices.",
          },
          {
            type: "note",
            text: "Some features are only available on the desktop app — for example, creating new teams, installing third-party apps, and some meeting management features. The mobile app is best for staying connected on the go, while the desktop app is the full-power tool for leading meetings and managing work.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t2-c1", text: "I can identify what each icon in the left navigation bar does", type: "understood" },
      { id: "t2-c2", text: "I know how to search for a person, message, or file in Teams", type: "understood" },
      { id: "t2-c3", text: "I have set my status to reflect my current availability", type: "implemented" },
      { id: "t2-c4", text: "I understand the difference between the desktop and mobile navigation layout", type: "understood" },
    ],
  },

  {
    number: 3,
    title: "Chats",
    subtitle: "One-on-one and group conversations — quick, professional, and organised",
    whatYouWillLearn: [
      "The difference between chat and team channels",
      "How to start a private chat with one person or a group",
      "How to format messages, share files, and use @mentions",
      "How to react and reply to specific messages",
      "How to edit or delete a message after sending it",
    ],
    sections: [
      {
        id: "t3-what-is-chat",
        title: "What is Chat in Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Chat in Teams is private messaging — conversations between you and one other person, or between you and a small group. Think of it like the messages app on your phone, but inside your work environment.",
          },
          {
            type: "body",
            text: "Chat is different from posting in a team channel (which you will learn about in Part 4). Chats are private — only the people in the conversation can see the messages. Channel posts are visible to everyone in the team.",
          },
          {
            type: "body",
            text: "Use chat for: quick questions to a colleague, private discussions, one-on-one check-ins, and small group conversations. Use channels for information the whole team should see.",
          },
        ],
      },
      {
        id: "t3-new",
        title: "Starting a New Chat",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Starting a chat is straightforward. You can reach anyone in your organisation as long as they have a Teams account.",
          },
          {
            type: "screenshot",
            description: "Teams chat interface — one-on-one and group conversations",
            imageUrl: IMG.chat,
          },
          {
            type: "bullet",
            bold: "Click the Chat icon",
            text: "Click the Chat icon in the left navigation bar to open the chat section.",
          },
          {
            type: "bullet",
            bold: "Click the compose icon",
            text: "Click the compose icon (a pencil or 'New chat' button) at the top of the chat list.",
          },
          {
            type: "bullet",
            bold: "Type a person's name",
            text: "Type a person's name in the 'To' field at the top. Teams will suggest people from your organisation as you type — click the right person from the dropdown.",
          },
          {
            type: "bullet",
            bold: "Type your message and press Enter",
            text: "Type your message in the compose box at the bottom and press Enter to send.",
          },
          {
            type: "tip",
            text: "You can start a voice or video call directly from any chat by clicking the phone or camera icon at the top-right of the conversation. No scheduling required — it starts immediately.",
          },
        ],
      },
      {
        id: "t3-compose",
        title: "What You Can Send in a Chat",
        blocks: [
          {
            type: "body",
            text: "Teams chats support much more than plain text. The compose box at the bottom of every chat has a row of icons that unlock additional features.",
          },
          {
            type: "bullet",
            bold: "Format",
            text: "Format — click the A icon or press Shift+Ctrl+X to expand the formatting toolbar. You can add bold text, italic, bullet lists, headings, and highlighted text — useful for sending structured information.",
          },
          {
            type: "bullet",
            bold: "Attach a file",
            text: "Attach a file — click the paperclip icon to share a document from your computer or OneDrive. The recipient can open it directly in Teams without downloading it.",
          },
          {
            type: "bullet",
            bold: "Emoji",
            text: "Emoji — click the smiley face icon to browse emoji and stickers. These help maintain a warm, human tone in written communication.",
          },
          {
            type: "bullet",
            bold: "@Mention",
            text: "@Mention — type @ followed by a person's name to send them a direct notification, even if they are not actively watching the chat. Their name will appear highlighted in the message.",
          },
          {
            type: "tip",
            text: "Use @mentions when something genuinely needs someone's attention. They receive a notification even if they have muted the conversation. Reserve @mentions for things that truly require a response — not every message.",
          },
        ],
      },
      {
        id: "t3-react",
        title: "Reactions and Replies",
        blocks: [
          {
            type: "body",
            text: "Two features help keep chat conversations organised and avoid clutter: reactions and threaded replies.",
          },
          {
            type: "body",
            text: "Reactions are small emoji you can place on any message — a thumbs up, a heart, a laughing face, or others. They let you acknowledge a message without sending a separate reply. To react: hover over any message (or long-press on mobile) and click the emoji that appears.",
          },
          {
            type: "body",
            text: "Threaded replies allow you to respond to a specific earlier message rather than just typing at the bottom of the chat. This keeps conversations readable. To reply to a specific message: hover over it and click the Reply arrow that appears.",
          },
          {
            type: "note",
            text: "In a busy group chat, always use the Reply function when responding to a specific message. Without it, your response appears at the bottom of the chat with no context, and others may not know what you are responding to.",
          },
        ],
      },
      {
        id: "t3-group",
        title: "Group Chats",
        blocks: [
          {
            type: "body",
            text: "A group chat is a conversation between three or more people. It works exactly like a one-on-one chat but with multiple participants. Group chats can have up to 250 people.",
          },
          {
            type: "body",
            text: "To create a group chat: start a new chat and keep adding names in the 'To' field before you send your first message.",
          },
          {
            type: "bullet",
            text: "Give the group a name — click the pencil icon next to the chat name at the top to add a meaningful title (e.g. 'Budget Planning Q3'). This makes it easy to find later.",
          },
          {
            type: "bullet",
            text: "Add someone to an existing group — click the people icon at the top right of the chat, type the person's name, and click Add.",
          },
          {
            type: "bullet",
            text: "Pin a group chat — right-click the chat in your list and select Pin. Pinned chats appear at the top of your chat list so you can find them quickly.",
          },
        ],
      },
      {
        id: "t3-edit",
        title: "Editing and Deleting Messages",
        blocks: [
          {
            type: "body",
            text: "Unlike email, you can edit or delete a message in Teams after sending it. This is useful if you notice a typo or send something to the wrong person.",
          },
          {
            type: "bullet",
            bold: "Edit a message",
            text: "Edit a message — hover over your message, click the three dots (...), then click Edit. Update the text and press Enter. A small 'Edited' label appears so recipients know it was changed.",
          },
          {
            type: "bullet",
            bold: "Delete a message",
            text: "Delete a message — hover over it, click the three dots (...), then click Delete. The message is replaced with 'This message has been deleted'.",
          },
          {
            type: "note",
            text: "You can only edit or delete your own messages. You cannot edit or delete messages sent by others.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t3-c1", text: "I have started at least one new chat with a colleague", type: "implemented" },
      { id: "t3-c2", text: "I understand the difference between chat and team channels", type: "understood" },
      { id: "t3-c3", text: "I know how to @mention someone to get their attention", type: "understood" },
      { id: "t3-c4", text: "I can reply to a specific message using the threaded reply feature", type: "understood" },
      { id: "t3-c5", text: "I can attach a file in a chat", type: "implemented" },
      { id: "t3-c6", text: "I know how to create a group chat and give it a name", type: "understood" },
    ],
  },

  {
    number: 4,
    title: "Teams and Channels",
    subtitle: "Organising your work so everyone stays on the same page",
    whatYouWillLearn: [
      "The difference between a Team and a Channel — and why it matters",
      "When to use Standard, Private, or Shared channels",
      "How to post in a channel and keep threads organised",
      "How to create a new Team or add a Channel",
    ],
    sections: [
      {
        id: "t4-concepts",
        title: "Understanding Teams and Channels",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "One of the most important concepts in Microsoft Teams is the relationship between Teams and Channels. Understanding this is the key to keeping your work organised.",
          },
          {
            type: "body",
            text: "A Team is a workspace for a defined group of people — a department, a project, a ministry, or any other working group. A Channel is a focused topic space inside that team.",
          },
          {
            type: "body",
            text: "Think of a Team as a building and Channels as the rooms inside it. The building is for a specific group (your team); the rooms each have a specific purpose (a topic to discuss).",
          },
          {
            type: "body",
            text: "Example: Team = 'Leadership Development Programme'. Channels = General, Facilitator Notes, Participant Resources, Prayer & Encouragement, Logistics.",
          },
          {
            type: "screenshot",
            description: "Microsoft Teams section — a team expanded showing its list of channels",
            imageUrl: IMG.createTeam,
          },
        ],
      },
      {
        id: "t4-channel-types",
        title: "Types of Channels",
        blocks: [
          {
            type: "body",
            text: "Not all channels work the same way. Teams offers three types, each serving a different purpose.",
          },
          { type: "h3", text: "Standard Channels" },
          {
            type: "body",
            text: "Standard channels are visible and accessible to every member of the team. All members can read and post. This is the default type — use it for most team conversations, announcements, and shared resources.",
          },
          { type: "h3", text: "Private Channels" },
          {
            type: "body",
            text: "Private channels are only visible to the specific members you invite. They show a small padlock icon next to the channel name. Use private channels for sensitive discussions — for example, HR topics, performance conversations, or confidential planning — that only a subset of the team should see.",
          },
          { type: "h3", text: "Shared Channels" },
          {
            type: "body",
            text: "Shared channels can include people from outside your organisation — useful for external partnerships, joint projects, or working with contractors. External participants join the channel without needing to be full members of your Microsoft 365 organisation.",
          },
          {
            type: "tip",
            text: "Start with a small number of clear, well-named channels. Too many channels overwhelm team members and reduce engagement. A good rule: if you would not check a channel at least once a week, it probably does not need to exist yet.",
          },
        ],
      },
      {
        id: "t4-posting",
        title: "Posting in a Channel",
        blocks: [
          {
            type: "body",
            text: "Channel posts are like digital bulletin board notices — they are visible to everyone in the team, and designed to be read and discussed as a group. They are different from private chat messages.",
          },
          {
            type: "bullet",
            text: "Click on a channel in the left sidebar, then type your message in the compose box at the bottom and press Enter to post.",
          },
          {
            type: "bullet",
            text: "Click Reply under an existing post to add your response in a thread. This keeps the conversation readable — all replies stay grouped together.",
          },
          {
            type: "bullet",
            text: "Click 'New conversation' to start a fresh, separate post that is not a reply to anything existing.",
          },
          {
            type: "tip",
            text: "Keep channels focused on their topic. Use the General channel for broad team announcements. Use specific channels for specific subjects. If a conversation is private or only relevant to one person, use Chat instead.",
          },
        ],
      },
      {
        id: "t4-create",
        title: "Creating a New Team",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "If your organisation does not yet have a team set up, or if you are starting a new project that needs its own workspace, you can create one.",
          },
          {
            type: "bullet",
            bold: "Click the Teams icon",
            text: "Click the Teams icon in the left navigation bar to open the Teams section.",
          },
          {
            type: "bullet",
            bold: "Click 'Join or create a team'",
            text: "Click 'Join or create a team' at the bottom of the team list, then select 'Create team'.",
          },
          {
            type: "bullet",
            bold: "Choose Private or Public",
            text: "Choose Private (only invited people can join) or Public (anyone in your organisation can find and join it).",
          },
          {
            type: "bullet",
            bold: "Give your team a name and description",
            text: "Give your team a name and description — be specific. 'Cross-Cultural Leadership 2026' is better than 'Leadership'.",
          },
          {
            type: "bullet",
            bold: "Add members",
            text: "Add members by typing their names. They will receive a notification that they have been added to the team.",
          },
          {
            type: "note",
            text: "In some organisations, only IT administrators can create new teams. If you get an error when trying to create a team, contact your IT department.",
          },
        ],
      },
      {
        id: "t4-channel",
        title: "Adding a New Channel",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Once a team exists, adding channels is quick and can be done by any team owner.",
          },
          {
            type: "bullet",
            bold: "Hover over the team name",
            text: "Hover over the team name in the Teams list and click the three dots (...) that appear.",
          },
          {
            type: "bullet",
            bold: "Select 'Add channel'",
            text: "Select 'Add channel' from the menu.",
          },
          {
            type: "bullet",
            bold: "Name the channel",
            text: "Name the channel clearly — use a descriptive name that tells members exactly what the channel is for (e.g. 'Session Resources', 'Logistics & Travel').",
          },
          {
            type: "bullet",
            bold: "Choose Standard or Private",
            text: "Choose Standard or Private depending on who should have access, then click Add.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t4-c1", text: "I understand the difference between a Team and a Channel", type: "understood" },
      { id: "t4-c2", text: "I know when to use Standard, Private, and Shared channels", type: "understood" },
      { id: "t4-c3", text: "I can post in a channel and reply to an existing thread", type: "implemented" },
      { id: "t4-c4", text: "I know how to create a new team or add a channel", type: "understood" },
    ],
  },

  {
    number: 5,
    title: "Meetings",
    subtitle: "Scheduling, joining, and participating in Teams meetings",
    whatYouWillLearn: [
      "The three types of Teams meetings and when to use each",
      "How to schedule a meeting from the Calendar",
      "How to join a meeting from a link, calendar, or channel",
      "What every button in the meeting controls bar does",
      "How to share your screen and record a meeting",
    ],
    sections: [
      {
        id: "t5-types",
        title: "Three Types of Teams Meetings",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Teams supports three different ways to start a meeting, each suited to a different situation. Knowing which one to use will save you time and confusion.",
          },
          {
            type: "bullet",
            bold: "Scheduled meeting",
            text: "Scheduled meeting — planned in advance via the Teams Calendar. You set the time, invite attendees, and Teams sends calendar invitations automatically. Best for regular team meetings, training sessions, and anything planned more than a few hours ahead.",
          },
          {
            type: "bullet",
            bold: "Channel meeting",
            text: "Channel meeting — tied to a specific channel and visible to all team members in that channel. Anyone can join without an individual invitation. Best for open team discussions where any team member is welcome.",
          },
          {
            type: "bullet",
            bold: "Meet now",
            text: "Meet now — an instant, unscheduled meeting you start immediately. No invitations sent — you share the link manually with whoever you want to join. Best for spontaneous calls or quick check-ins.",
          },
        ],
      },
      {
        id: "t5-schedule",
        title: "Scheduling a Meeting",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Scheduling in advance is the most professional approach for planned meetings. Attendees receive a calendar invitation with the meeting link included — no one needs to chase you for the details.",
          },
          {
            type: "screenshot",
            description: "Microsoft Teams Calendar — the New Meeting form open",
            imageUrl: IMG.scheduleMeeting,
          },
          {
            type: "bullet",
            bold: "Click Calendar",
            text: "Click Calendar in the left navigation bar to open your calendar view.",
          },
          {
            type: "bullet",
            bold: "Click 'New meeting'",
            text: "Click 'New meeting' in the top-right corner.",
          },
          {
            type: "bullet",
            bold: "Fill in the meeting details",
            text: "Fill in the meeting details — give it a clear title, set the date, start time, and expected end time.",
          },
          {
            type: "bullet",
            bold: "Add attendees",
            text: "Add attendees by typing names or email addresses in the 'Add required attendees' field. Teams will suggest people from your organisation as you type.",
          },
          {
            type: "bullet",
            bold: "Add an agenda",
            text: "Add an agenda in the description box — even a brief bullet list of topics helps attendees prepare and keeps the meeting focused.",
          },
          {
            type: "bullet",
            bold: "Click Save",
            text: "Click Save — a calendar invitation is automatically sent to all attendees, with the meeting link included.",
          },
          {
            type: "tip",
            text: "Include an agenda in every meeting invitation — even a short one. Research consistently shows that meetings with a clear agenda run shorter and produce better outcomes.",
          },
        ],
      },
      {
        id: "t5-join",
        title: "Joining a Meeting",
        blocks: [
          {
            type: "body",
            text: "There are several ways to join a Teams meeting. The most common is from a calendar invitation, but you may also receive a link by email or message.",
          },
          {
            type: "screenshot",
            description: "Joining a Teams meeting — the pre-join screen with audio and video preview",
            imageUrl: IMG.joinMeeting,
          },
          { type: "h3", text: "From a Calendar Invitation" },
          {
            type: "body",
            text: "Open your Teams Calendar, click the meeting entry, and click Join. A pre-join screen appears where you can check your camera and microphone before entering.",
          },
          { type: "h3", text: "From a Meeting Link" },
          {
            type: "body",
            text: "Click the 'Click here to join the meeting' link in your email invitation. Your browser will open and Teams will launch. You will see the same pre-join screen to check your settings.",
          },
          { type: "h3", text: "From a Channel" },
          {
            type: "body",
            text: "If the meeting was posted in a channel, find the meeting post and click Join. This works for channel meetings that are open to all team members.",
          },
          {
            type: "tip",
            text: "The pre-join screen is your opportunity to turn your camera and microphone on or off before anyone else sees or hears you. Use it — do not rush straight in.",
          },
        ],
      },
      {
        id: "t5-controls",
        title: "The Meeting Controls Bar",
        blocks: [
          {
            type: "body",
            text: "Once you are inside a meeting, a toolbar appears at the bottom of your screen. This is your control panel for everything that happens in the meeting.",
          },
          {
            type: "bullet",
            bold: "Microphone",
            text: "Microphone — click to mute or unmute yourself. When muted, the icon turns red. Mute yourself when you are not speaking to reduce background noise.",
          },
          {
            type: "bullet",
            bold: "Camera",
            text: "Camera — click to turn your video on or off. Having your camera on builds connection and trust, especially in cross-cultural settings.",
          },
          {
            type: "bullet",
            bold: "Share content",
            text: "Share content — show your screen, a specific open window, or a PowerPoint presentation to everyone in the meeting.",
          },
          {
            type: "bullet",
            bold: "Reactions",
            text: "Reactions — raise your hand, send applause, a heart, or other emoji reactions without unmuting.",
          },
          {
            type: "bullet",
            bold: "People",
            text: "People — see who is in the meeting, manage participants, and view who is in the waiting lobby.",
          },
          {
            type: "bullet",
            bold: "Chat",
            text: "Chat — open the in-meeting chat panel to send messages, share links, or ask questions without interrupting the speaker.",
          },
          {
            type: "bullet",
            bold: "Leave",
            text: "Leave — click the red phone icon to leave the meeting. If you are the organiser, you will be asked whether to end the meeting for everyone or just leave yourself.",
          },
          {
            type: "tip",
            text: "Before sharing your screen, close any private browser tabs, emails, or personal documents you do not want others to see. Share a specific window whenever possible, rather than your entire desktop.",
          },
        ],
      },
      {
        id: "t5-record",
        title: "Recording a Meeting",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "You can record Teams meetings to create a video that participants can review later. The recording captures the video, audio, and any screen-shared content.",
          },
          {
            type: "bullet",
            bold: "Click More in the controls bar",
            text: "Click More (...) in the controls bar at the bottom of the screen.",
          },
          {
            type: "bullet",
            bold: "Select 'Start recording'",
            text: "Select 'Start recording' from the menu.",
          },
          {
            type: "bullet",
            bold: "All participants are notified",
            text: "All participants are notified automatically that the meeting is being recorded — a banner appears on everyone's screen.",
          },
          {
            type: "bullet",
            bold: "Stop the recording",
            text: "Stop the recording via More (...) → Stop recording. The file is saved automatically.",
          },
          {
            type: "bullet",
            bold: "Find the recording link",
            text: "Find the recording link in the meeting chat after the meeting ends. For channel meetings, it is saved to SharePoint. For personal meetings, it saves to OneDrive.",
          },
          {
            type: "note",
            text: "You may need permission from your IT administrator to record. Some organisations restrict recording to organisers only, or require approval. Check with your IT team if the option is not available.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t5-c1", text: "I understand the three types of Teams meetings and when to use each", type: "understood" },
      { id: "t5-c2", text: "I have scheduled a Teams meeting and sent the invitation", type: "implemented" },
      { id: "t5-c3", text: "I can join a meeting from a calendar entry, a link, and a channel post", type: "understood" },
      { id: "t5-c4", text: "I can identify all the buttons in the meeting controls bar", type: "understood" },
      { id: "t5-c5", text: "I know how to mute myself and turn my camera on or off", type: "implemented" },
    ],
  },

  {
    number: 6,
    title: "Leading a Team Meeting",
    subtitle: "Host with confidence — control the room, engage the group, and honour everyone's time",
    whatYouWillLearn: [
      "The three meeting roles: Organiser, Presenter, and Attendee",
      "How to manage the waiting lobby",
      "How to mute participants and manage permissions",
      "How to use Spotlight and Breakout Rooms",
      "Cross-cultural best practices for inclusive meetings",
    ],
    sections: [
      {
        id: "t6-prep",
        title: "Before the Meeting — Preparation",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "A meeting that runs well is almost always one that was prepared well. The 15 minutes you invest before a meeting often saves 30 minutes during it.",
          },
          {
            type: "bullet",
            text: "Schedule the meeting in Teams and add all required attendees — they receive automatic calendar invitations.",
          },
          {
            type: "bullet",
            text: "Write a clear agenda in the meeting description — at minimum, list the topics and how long you plan to spend on each.",
          },
          {
            type: "bullet",
            text: "Share any documents people need to read in advance by attaching them to the meeting invitation or posting them in the relevant channel.",
          },
          {
            type: "bullet",
            text: "Test your audio and camera 5 minutes before the meeting starts — never discover a technical problem after the meeting has begun.",
          },
          {
            type: "tip",
            text: "Send the agenda at least 24 hours in advance. Meetings with a clear agenda consistently run shorter and produce better decisions — attendees arrive prepared rather than having to orient themselves during the meeting.",
          },
        ],
      },
      {
        id: "t6-roles",
        title: "Meeting Roles — Who Can Do What",
        blocks: [
          {
            type: "body",
            text: "Every Teams meeting has three types of participants, each with different permissions. Understanding these roles helps you run a meeting with the right level of control.",
          },
          { type: "h3", text: "Organiser" },
          {
            type: "body",
            text: "The person who scheduled the meeting. Has full control: can change meeting settings, admit and remove participants, start recordings, and end the meeting for everyone.",
          },
          { type: "h3", text: "Presenter" },
          {
            type: "body",
            text: "Can share content, mute others, and manage participants. The organiser can promote any attendee to Presenter, or restrict Presenter rights to specific people. Use this when you have a co-facilitator who needs to share their screen or manage the room.",
          },
          { type: "h3", text: "Attendee" },
          {
            type: "body",
            text: "Can participate in the meeting, use chat, and react. Cannot share content or manage other participants unless promoted by the organiser.",
          },
          {
            type: "body",
            text: "To change someone's role during the meeting: open the People panel → right-click their name → select 'Make a presenter' or 'Make an attendee'.",
          },
        ],
      },
      {
        id: "t6-lobby",
        title: "Managing the Lobby",
        blocks: [
          {
            type: "body",
            text: "The lobby is a waiting area where participants hold before being admitted to the meeting. This gives you control over who enters and when — similar to a waiting room in Zoom.",
          },
          {
            type: "body",
            text: "You can configure who goes to the lobby and who can bypass it in the meeting settings. As the organiser, you admit (or deny) each person waiting in the lobby.",
          },
          {
            type: "bullet",
            text: "Before the meeting: open the meeting in your Calendar → Edit → Meeting options → set 'Who can bypass the lobby' to your preference (e.g. Only me, People I invite, or Everyone).",
          },
          {
            type: "bullet",
            text: "During the meeting: click People in the controls bar. The lobby section at the top shows who is waiting. Click Admit to let them in, or Deny to turn them away.",
          },
          {
            type: "tip",
            text: "For training sessions with invited participants only, set 'Who can bypass the lobby' to 'People I invite'. This way external participants go to the lobby but your internal colleagues can join straight away.",
          },
        ],
      },
      {
        id: "t6-mute",
        title: "Muting Participants",
        blocks: [
          {
            type: "body",
            text: "As the meeting organiser or presenter, you can mute any participant — useful when background noise is distracting the group, or when you need to take back control of the floor.",
          },
          {
            type: "bullet",
            text: "Mute one person — open People → hover over their name → click the microphone icon → Mute participant.",
          },
          {
            type: "bullet",
            text: "Mute everyone at once — open People → click 'Mute all'. Participants can still unmute themselves unless you disable that permission.",
          },
          {
            type: "bullet",
            text: "Prevent participants from unmuting themselves — click More (...) → Meeting options → toggle off 'Allow mic for attendees'. You now control when each person speaks.",
          },
          {
            type: "note",
            text: "Muting participants without warning can feel abrupt in some cultural contexts. Consider announcing it first: 'To keep background noise down, I'm going to mute everyone. Please use Raise Hand when you want to speak.'",
          },
        ],
      },
      {
        id: "t6-breakout",
        title: "Breakout Rooms",
        blocks: [
          {
            type: "body",
            text: "Breakout rooms in Teams work the same way as in Zoom — you split the main meeting into smaller groups for discussion, then bring everyone back together. Only the meeting organiser can create breakout rooms.",
          },
          {
            type: "bullet",
            text: "Click More (...) in the controls bar → select Breakout rooms.",
          },
          {
            type: "bullet",
            text: "Choose the number of rooms and how to assign participants — automatically (random) or manually (you decide who goes where).",
          },
          {
            type: "bullet",
            text: "Click Open rooms to send everyone into their breakout group. Participants receive an automatic invitation to join their room.",
          },
          {
            type: "bullet",
            text: "Click Close rooms to bring everyone back to the main meeting — participants have 60 seconds to return.",
          },
          {
            type: "tip",
            text: "Give each breakout group a clear task before opening the rooms — a specific question to discuss, a problem to solve, or a short deliverable to produce. Groups without a clear task tend to lose focus quickly.",
          },
        ],
      },
      {
        id: "t6-multicultural",
        title: "Best Practices for Multicultural Meetings",
        blocks: [
          {
            type: "body",
            text: "Leading a meeting with participants from different cultural backgrounds requires extra intentionality. What feels normal in one culture can feel rude or confusing in another.",
          },
          {
            type: "bullet",
            text: "Start on time and keep to the agenda — this communicates respect for everyone's time, regardless of cultural background.",
          },
          {
            type: "bullet",
            text: "Open with a brief check-in — one minute per person: 'How are you this week?' This builds connection and helps people transition from their previous activity.",
          },
          {
            type: "bullet",
            text: "Actively invite quieter participants to share — in some cultures, speaking without being directly invited is considered inappropriate. Use Raise Hand or directly call on people: 'Liu Wei, what do you think?'",
          },
          {
            type: "bullet",
            text: "When screen sharing, narrate what you are doing — not everyone can see your screen clearly due to screen size differences, connection speeds, or visual impairments.",
          },
          {
            type: "bullet",
            text: "End with explicit action items — state who does what by when. Put these in the meeting chat so there is a written record everyone can refer back to.",
          },
          {
            type: "tip",
            text: "For teams that span time zones, rotate meeting times so the same people are not always in the early morning or late evening slot. A simple rotating schedule shows that everyone's time is valued equally.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t6-c1", text: "I understand the difference between Organiser, Presenter, and Attendee roles", type: "understood" },
      { id: "t6-c2", text: "I know how to manage the waiting lobby and admit participants", type: "understood" },
      { id: "t6-c3", text: "I can mute individual participants or everyone at once", type: "implemented" },
      { id: "t6-c4", text: "I know how to create and manage Breakout Rooms", type: "understood" },
      { id: "t6-c5", text: "I have applied at least one multicultural best practice in a meeting", type: "implemented" },
    ],
  },

  {
    number: 7,
    title: "Files",
    subtitle: "Sharing, co-editing, and finding documents — without the email attachments",
    whatYouWillLearn: [
      "How to share files in a chat or channel",
      "Where files are stored and how to find them",
      "How multiple people can edit the same document simultaneously",
      "How to access all your team's files in one place",
    ],
    sections: [
      {
        id: "t7-why",
        title: "Why Files in Teams?",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "One of the most common frustrations in team work is version confusion — multiple copies of the same document circulating by email, nobody sure which is the latest, edits lost when two people save over each other.",
          },
          {
            type: "body",
            text: "Teams solves this by storing all shared files in one central place (SharePoint or OneDrive, integrated into Teams). Everyone works on the same file, all changes save automatically, and you can always see who changed what.",
          },
        ],
      },
      {
        id: "t7-chat",
        title: "Sharing Files in Chat",
        procedural: true,
        blocks: [
          {
            type: "screenshot",
            description: "Uploading and sharing files in Microsoft Teams chat",
            imageUrl: IMG.files,
          },
          {
            type: "bullet",
            bold: "Open a chat or channel",
            text: "Open a chat or channel where you want to share the file.",
          },
          {
            type: "bullet",
            bold: "Click the paperclip (Attach) icon",
            text: "Click the paperclip (Attach) icon in the message compose box.",
          },
          {
            type: "bullet",
            bold: "Choose your source",
            text: "Choose your source — Upload from my computer (choose a file from your hard drive), OneDrive (files already saved in the cloud), or Teams and Channels (files already shared in Teams).",
          },
          {
            type: "bullet",
            bold: "Select the file and send",
            text: "Select the file and send — recipients see it appear in the chat as a preview card. They can click to open it directly in Teams without downloading it.",
          },
          {
            type: "tip",
            text: "When you share a file in Teams, you are sharing a link to the original file — not a copy. This means any changes you make are visible immediately to everyone with access. There is only ever one version.",
          },
        ],
      },
      {
        id: "t7-channel-files",
        title: "Files in Channels — The Files Tab",
        blocks: [
          {
            type: "body",
            text: "Every channel in Teams has a Files tab. This is where all documents shared in that channel's posts are stored, organised, and accessible to every team member. Think of it as a shared folder for that specific channel.",
          },
          {
            type: "bullet",
            text: "Click the Files tab at the top of any channel to browse all shared files — you will see documents sorted by date, with the most recently modified at the top.",
          },
          {
            type: "bullet",
            text: "Click New to create a new Word, Excel, or PowerPoint file directly inside Teams — no need to open the Office application separately.",
          },
          {
            type: "bullet",
            text: "Click Upload to add existing files from your computer directly to the channel's storage.",
          },
          {
            type: "note",
            text: "Files shared in a channel's Posts tab are automatically stored in the Files tab. You do not need to add them twice. The Files tab is just an organised view of everything that has been shared in that channel.",
          },
        ],
      },
      {
        id: "t7-coedit",
        title: "Co-Editing Documents Together",
        blocks: [
          {
            type: "body",
            text: "One of the most powerful features in Teams is the ability for multiple people to edit the same Word, Excel, or PowerPoint file simultaneously — in real time, inside Teams, without emailing the file back and forth.",
          },
          {
            type: "body",
            text: "To co-edit: click any Office file shared in a channel or chat. It opens inside Teams in a built-in editor. You will see other editors' coloured cursors moving through the document as they type. All changes save automatically.",
          },
          {
            type: "tip",
            text: "Real-time co-editing eliminates the 'final_v3_REALLY_FINAL.docx' problem permanently. There is only one file, everyone works on it together, and the version history is automatically maintained — you can always go back to an earlier version if needed.",
          },
        ],
      },
      {
        id: "t7-find-files",
        title: "Finding Files Across All Teams",
        blocks: [
          {
            type: "body",
            text: "If you cannot remember which channel a file was shared in, use the Files section in the left navigation bar. This shows you all files shared across all your teams and chats in one view.",
          },
          {
            type: "body",
            text: "You can also use the search bar at the top of Teams to search for a file by name — Teams will show you the file and which channel or chat it came from.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t7-c1", text: "I have shared a file in a chat or channel", type: "implemented" },
      { id: "t7-c2", text: "I know where to find the Files tab inside a channel", type: "understood" },
      { id: "t7-c3", text: "I understand how co-editing works and why it eliminates version confusion", type: "understood" },
      { id: "t7-c4", text: "I know how to search for a file across all my teams", type: "understood" },
    ],
  },

  {
    number: 8,
    title: "Notifications and Status",
    subtitle: "Stay informed without being overwhelmed — silence the noise, catch what matters",
    whatYouWillLearn: [
      "The four types of notifications in Teams and when each fires",
      "How to configure your notification settings",
      "How to mute a noisy channel without losing access to it",
      "How to use your status to communicate your availability",
    ],
    sections: [
      {
        id: "t8-problem",
        title: "The Notification Problem",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Teams can become overwhelming very quickly if you do not configure your notifications deliberately. By default, every message in every channel will alert you — and if you belong to several active teams, this becomes unmanageable.",
          },
          {
            type: "body",
            text: "The good news is that Teams gives you fine-grained control over what notifies you and how. Spending 5 minutes on your notification settings will make Teams feel calm and manageable rather than like a flood of interruptions.",
          },
        ],
      },
      {
        id: "t8-types",
        title: "Types of Notifications",
        blocks: [
          {
            type: "body",
            text: "Teams uses four different notification methods. Each can be configured independently:",
          },
          {
            type: "bullet",
            bold: "Banner",
            text: "Banner — a pop-up notification that appears in the corner of your screen, even when Teams is in the background. The most intrusive type.",
          },
          {
            type: "bullet",
            bold: "Feed",
            text: "Feed — the notification appears silently in your Activity feed (the bell icon). You see it the next time you open Teams, but it does not interrupt you right now.",
          },
          {
            type: "bullet",
            bold: "Email",
            text: "Email — Teams can send you a digest email summarising missed messages. Useful if you are offline for extended periods.",
          },
          {
            type: "bullet",
            bold: "Badge",
            text: "Badge — a number on the Teams icon in your taskbar showing how many unread items you have.",
          },
        ],
      },
      {
        id: "t8-configure",
        title: "Configuring Your Notifications",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Here is how to access your notification settings and what the recommended configuration looks like for most users.",
          },
          {
            type: "bullet",
            bold: "Open Settings",
            text: "Open Settings by clicking your profile picture in the top-right corner, then select Settings.",
          },
          {
            type: "bullet",
            bold: "Click Notifications",
            text: "Click Notifications in the left menu of the settings panel.",
          },
          {
            type: "bullet",
            bold: "Adjust each notification type",
            text: "Adjust each notification type — you will see sections for @mentions, replies to your messages, channel messages, meetings, and more.",
          },
          {
            type: "tip",
            text: "Recommended starting point: set @mentions and direct messages to Banner (so you don't miss direct contact). Set channel messages to Feed only (no pop-up). This means active conversations don't interrupt you, but anyone who actually needs you can still get through.",
          },
        ],
      },
      {
        id: "t8-mute-channel",
        title: "Muting a Noisy Channel",
        procedural: true,
        blocks: [
          {
            type: "body",
            text: "Some channels generate a lot of messages — general announcements, casual conversation, or updates that are useful but not urgent. You can mute a channel to stop receiving notifications from it while still keeping full access to read the content when you choose to.",
          },
          {
            type: "bullet",
            bold: "Right-click the channel name",
            text: "Right-click the channel name in your Teams list.",
          },
          {
            type: "bullet",
            bold: "Select 'Mute channel'",
            text: "Select 'Mute channel' from the menu.",
          },
          {
            type: "body",
            text: "The channel icon will appear slightly greyed out to show it is muted. You can still navigate to it and read everything — you simply will not receive any notifications from it.",
          },
          {
            type: "note",
            text: "Muting a channel does not mute @mentions. If someone directly @mentions you in a muted channel, you will still receive a notification.",
          },
        ],
      },
      {
        id: "t8-status",
        title: "Using Your Status Effectively",
        blocks: [
          {
            type: "body",
            text: "Your status is a simple but powerful communication tool. When you keep it updated, your colleagues know whether it is a good time to reach you — reducing interruptions for you and frustration for them.",
          },
          {
            type: "bullet",
            bold: "Available",
            text: "Available — green circle. You are at your desk and free to respond.",
          },
          {
            type: "bullet",
            bold: "Busy",
            text: "Busy — red circle. You are in a meeting or focused on work. Messages are received but you will respond later.",
          },
          {
            type: "bullet",
            bold: "Do Not Disturb",
            text: "Do Not Disturb — red circle with a line. All notifications are silenced. Use this for deep work blocks or when you are presenting and cannot be interrupted.",
          },
          {
            type: "bullet",
            bold: "Be Right Back",
            text: "Be Right Back — yellow clock. You have stepped away briefly and will return shortly.",
          },
          {
            type: "bullet",
            bold: "Away",
            text: "Away — yellow clock. Teams sets this automatically when your computer has been idle for a while. You can also set it manually.",
          },
          {
            type: "tip",
            text: "Add a status message for context: 'In training until 3pm — checking messages at 2pm' or 'Deep work block until noon'. Click your profile picture → Set status message. This gives colleagues the information they need to decide whether their message can wait.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t8-c1", text: "I have configured my notification settings to reduce distractions", type: "implemented" },
      { id: "t8-c2", text: "I know how to mute a noisy channel while keeping access to it", type: "understood" },
      { id: "t8-c3", text: "I keep my status updated to accurately reflect my availability", type: "implemented" },
      { id: "t8-c4", text: "I understand what each status colour means to my colleagues", type: "understood" },
    ],
  },

  {
    number: 9,
    title: "Desktop vs Mobile",
    subtitle: "Getting the most from each version — knowing when to use which",
    whatYouWillLearn: [
      "Which features are only available on the desktop app",
      "The best use cases for each version",
      "Practical tips for using Teams effectively on your phone",
    ],
    sections: [
      {
        id: "t9-overview",
        title: "Two Tools, One Platform",
        blocks: [
          {
            type: "body",
            lead: true,
            text: "Teams works on both your desktop computer and your mobile phone, and your messages, meetings, and files sync instantly between them. But the two versions are not identical — each has strengths the other does not.",
          },
          {
            type: "body",
            text: "The desktop app is the full-power version — designed for deep work, leading meetings, managing teams, and editing files. The mobile app is optimised for staying connected on the go — quick replies, joining meetings, and checking notifications when you are away from your desk.",
          },
          {
            type: "body",
            text: "You do not have to choose one over the other — use both. Just understand what each does best so you reach for the right tool at the right moment.",
          },
        ],
      },
      {
        id: "t9-compare",
        title: "Side-by-Side Comparison",
        blocks: [
          {
            type: "table",
            headers: ["Feature", "Desktop App", "Mobile App"],
            rows: [
              ["Navigation", "Left sidebar with icons", "Bottom tab bar"],
              ["Chat and Channels", "Full access", "Full access"],
              ["Meeting controls", "Full controls", "Full controls"],
              ["Screen sharing", "Full — any window or full screen", "Phone screen only"],
              ["Breakout rooms", "Full management", "Can join, limited management"],
              ["Install third-party apps", "Yes", "Not available — desktop only"],
              ["File creation", "Create Word/Excel/PowerPoint inside Teams", "View and edit only"],
              ["Background blur", "Yes", "Yes (on supported devices)"],
              ["Keyboard shortcuts", "Many shortcuts available", "Not applicable"],
              ["Best for", "Deep work, leading meetings, file editing", "Quick replies, joining meetings on the go"],
            ],
          },
        ],
      },
      {
        id: "t9-mobile-tips",
        title: "Making the Most of Teams on Mobile",
        blocks: [
          {
            type: "body",
            text: "The mobile app is more capable than many people realise. Here are a few tips to make it work well for you:",
          },
          {
            type: "bullet",
            text: "Swipe right on a message in a chat or channel to quickly reply to it without searching for the Reply button.",
          },
          {
            type: "bullet",
            text: "Tap and hold on any message to see all available options — react, reply, copy, forward, or save.",
          },
          {
            type: "bullet",
            text: "Use the widget on your phone's home screen (available for iPhone and Android) to see your upcoming meetings directly without opening the app.",
          },
          {
            type: "bullet",
            text: "Adjust mobile notification settings separately from the desktop — you may want banner notifications on mobile but only Feed notifications on desktop, or vice versa.",
          },
          {
            type: "tip",
            text: "Recommendation: use the desktop app as your primary work tool for leading meetings, editing files, and managing teams. Use the mobile app to stay connected when you are away from your desk — but resist the temptation to manage complex work from your phone.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t9-c1", text: "I understand which features are only available on the desktop app", type: "understood" },
      { id: "t9-c2", text: "I have Teams installed and configured on both desktop and mobile", type: "implemented" },
      { id: "t9-c3", text: "I know when to reach for the desktop app vs the mobile app", type: "understood" },
    ],
  },

  {
    number: 10,
    title: "Quick Reference",
    subtitle: "Shortcuts, common tasks, and what to do when something goes wrong",
    whatYouWillLearn: [
      "All the essential keyboard shortcuts for the desktop app",
      "Step-by-step reminders for the most common tasks",
      "How to fix the most frequent problems",
    ],
    sections: [
      {
        id: "t10-shortcuts",
        title: "Keyboard Shortcuts (Desktop App)",
        blocks: [
          {
            type: "body",
            text: "Keyboard shortcuts let you navigate Teams faster without hunting through menus. You do not need to memorise all of these — start with the 3 or 4 you will use most often.",
          },
          {
            type: "table",
            headers: ["Action", "Shortcut (Windows / Mac)"],
            rows: [
              ["Start a new chat", "Ctrl+N / Cmd+N"],
              ["Open Search", "Ctrl+E / Cmd+E"],
              ["Go to a team or channel", "Ctrl+G / Cmd+G"],
              ["Mute/unmute in a meeting", "Ctrl+Shift+M / Cmd+Shift+M"],
              ["Camera on/off in a meeting", "Ctrl+Shift+O / Cmd+Shift+O"],
              ["Raise or lower your hand", "Ctrl+Shift+K / Cmd+Shift+K"],
              ["Start screen sharing", "Ctrl+Shift+E / Cmd+Shift+E"],
              ["Accept an incoming call", "Ctrl+Shift+A / Cmd+Shift+A"],
              ["Decline an incoming call", "Ctrl+Shift+D / Cmd+Shift+D"],
              ["Open Activity feed", "Ctrl+1 / Cmd+1"],
              ["Open Chat", "Ctrl+2 / Cmd+2"],
              ["Open Teams section", "Ctrl+3 / Cmd+3"],
              ["Open Calendar", "Ctrl+4 / Cmd+4"],
            ],
          },
        ],
      },
      {
        id: "t10-tasks",
        title: "Common Tasks — Quick Step Reminders",
        blocks: [
          {
            type: "body",
            text: "Use this as a quick-reference guide when you cannot remember the steps for a common task.",
          },
          { type: "h3", text: "Send a message to someone" },
          {
            type: "body",
            text: "Chat → pencil (compose) icon → type name in To field → type message → press Enter.",
          },
          { type: "h3", text: "Start an instant meeting" },
          {
            type: "body",
            text: "Calendar → 'Meet now' button (top right) → Start meeting → share the link with participants.",
          },
          { type: "h3", text: "Share your screen in a meeting" },
          {
            type: "body",
            text: "Inside meeting → Share content button in the controls bar → choose Screen, Window, or PowerPoint → click Share.",
          },
          { type: "h3", text: "Find a file someone shared" },
          {
            type: "body",
            text: "Files (left navigation) → browse by team and channel, or use the search bar at the top of Teams.",
          },
          { type: "h3", text: "Change your status" },
          {
            type: "body",
            text: "Profile picture (top right) → click your current status → choose the new status from the dropdown.",
          },
          { type: "h3", text: "Mute a noisy channel" },
          {
            type: "body",
            text: "Right-click the channel name in the Teams list → select Mute channel.",
          },
        ],
      },
      {
        id: "t10-trouble",
        title: "Quick Troubleshooting",
        blocks: [
          {
            type: "body",
            text: "Most Teams problems fall into a small number of categories. Here is how to fix the most common ones quickly.",
          },
          {
            type: "bullet",
            bold: "Cannot hear audio in a meeting",
            text: "Cannot hear audio in a meeting — click More (...) → Device settings → check that the correct speaker is selected. Also check your computer's system volume.",
          },
          {
            type: "bullet",
            bold: "Camera not working",
            text: "Camera not working — click More (...) → Device settings → select the correct camera. If it still does not work, check your computer's privacy settings (Windows: Settings → Privacy → Camera; Mac: System Preferences → Privacy → Camera).",
          },
          {
            type: "bullet",
            bold: "Messages not loading",
            text: "Messages not loading — click your profile picture → Sign out, then sign back in. If the problem continues, close and restart the Teams application.",
          },
          {
            type: "bullet",
            bold: "Not receiving notifications",
            text: "Not receiving notifications — go to Settings → Notifications and check that your preferences are set correctly. Also check your computer's system notification settings — Teams may have been blocked at the system level.",
          },
          {
            type: "bullet",
            bold: "Teams is running slowly",
            text: "Teams is running slowly — check for updates (click ... near your profile → Check for updates). Restarting Teams often resolves performance issues as well.",
          },
          {
            type: "tip",
            text: "Keep Teams updated. Click the three dots (...) near your profile picture → Check for updates. Updates fix most known bugs and security vulnerabilities — an outdated app is both slower and less secure.",
          },
        ],
      },
    ],
    endChecklist: [
      { id: "t10-c1", text: "I have memorised at least 3 keyboard shortcuts I will use regularly", type: "implemented" },
      { id: "t10-c2", text: "I know how to find the most common actions without looking them up", type: "understood" },
      { id: "t10-c3", text: "I know the first steps to take when something is not working", type: "understood" },
      { id: "t10-c4", text: "I feel confident using Microsoft Teams for my daily work and team meetings", type: "understood" },
    ],
  },
];
