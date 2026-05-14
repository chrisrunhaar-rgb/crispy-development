"""
Seed multiple-choice quiz questions (3 per chapter, 63 total).
Run: uv run --python 3.12 python scripts/seed_quiz.py
"""
import json
import urllib.request

SUPABASE_URL = "https://miegjduhwekszuaestzh.supabase.co"
SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZWdqZHVod2Vrc3p1YWVzdHpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU2MDgxOCwiZXhwIjoyMDkyMTM2ODE4fQ.5XBGwjaA-AaMWSa4KWxLD--pNcWzD-SWk_OkSCnPgKY"

HEADERS = {
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "apikey": SERVICE_ROLE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}


def rest_delete(table: str, filters: str) -> None:
    url = f"{SUPABASE_URL}/rest/v1/{table}?{filters}"
    headers = {**HEADERS, "Prefer": "return=minimal"}
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as resp:
            resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"DELETE HTTP {e.code}: {body}") from e


def rest_post(table: str, data: list) -> list:
    url = f"{SUPABASE_URL}/rest/v1/{table}"
    payload = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers=HEADERS, method="POST")
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"POST HTTP {e.code}: {body}") from e


# chapter_id -> list of (question, options[4], correct_answer_text)
QUESTIONS = {
    # ── Zoom Training ──────────────────────────────────────────────────────────
    "e98adaa8-5fd6-440c-87ef-51b96ff86d34": [  # Zoom Part 1: Getting Started
        (
            "What is the first thing you need to do to use Zoom on your computer?",
            ["Download and install the Zoom desktop app", "Purchase a Zoom Pro subscription", "Create a Google account", "Install Microsoft Office"],
            "Download and install the Zoom desktop app",
        ),
        (
            "Where do you create a free Zoom account?",
            ["zoom.us", "zoom.com/signup", "microsoft.com/zoom", "accounts.google.com"],
            "zoom.us",
        ),
        (
            "Which audio option gives the most reliable sound quality for a Zoom call?",
            ["A wired headset", "Your laptop's built-in speakers", "Your phone speaker", "A Bluetooth speaker across the room"],
            "A wired headset",
        ),
    ],
    "5c9ba79f-ec27-49fd-9391-206e6a247f98": [  # Zoom Part 2: Joining a Meeting
        (
            "What information do you typically need to join a Zoom meeting?",
            ["Meeting ID and passcode", "Your Zoom Pro subscription number", "The host's email address", "A VPN connection"],
            "Meeting ID and passcode",
        ),
        (
            "From where can you join a Zoom meeting?",
            ["Via the Zoom app, a web browser, or a meeting link", "Only from the Zoom desktop app", "Only from a Windows computer", "Only if you have a paid account"],
            "Via the Zoom app, a web browser, or a meeting link",
        ),
        (
            "When is the best time to join a meeting to test your audio and video?",
            ["A few minutes before it starts", "Exactly at the scheduled start time", "After the host begins presenting", "Only when called upon to speak"],
            "A few minutes before it starts",
        ),
    ],
    "9cc56d1f-758f-48f8-9ef1-2e34f0b469c7": [  # Zoom Part 3: Hosting Your First Meeting
        (
            "To invite others to your Zoom meeting, you should:",
            ["Share the meeting link and ID with participants", "Give participants your Zoom login password", "Ask IT to send invitations for you", "Call each person individually"],
            "Share the meeting link and ID with participants",
        ),
        (
            "Which host feature lets you control who enters your meeting before admitting them?",
            ["Waiting Room", "Screen Share", "Raise Hand", "Gallery View"],
            "Waiting Room",
        ),
        (
            "What is the main benefit of scheduling a recurring meeting?",
            ["The same link and ID can be reused each time", "Participants are added to your contacts automatically", "The meeting records itself", "Participants can join without internet"],
            "The same link and ID can be reused each time",
        ),
    ],
    "783964af-d058-481b-bda5-679d7bd39746": [  # Zoom Part 4: Audio and Video Settings
        (
            "Where can you test your microphone and speaker before joining a call?",
            ["In Zoom Settings > Audio", "In your computer's Control Panel only", "Only during a live call", "Under Zoom's Help menu"],
            "In Zoom Settings > Audio",
        ),
        (
            "What should you check first if participants cannot hear you?",
            ["That your microphone is unmuted and set as the correct input device", "Restart your computer immediately", "Ask the host to fix your connection", "Switch to phone audio only"],
            "That your microphone is unmuted and set as the correct input device",
        ),
        (
            "Which Zoom setting helps reduce distracting background noise?",
            ["Suppress background noise (in Audio settings)", "Increase speaker volume to maximum", "Enable Virtual Background", "Disable HD video"],
            "Suppress background noise (in Audio settings)",
        ),
    ],
    "feecf535-e83a-4397-9e71-a720a567981c": [  # Zoom Part 5: Screen Sharing
        (
            "How do you share only one application instead of your whole screen?",
            ["Select that specific application window in the share options", "Minimise all other windows first", "Use the mobile app instead", "Share your full screen and hope no one looks"],
            "Select that specific application window in the share options",
        ),
        (
            "Who can share their screen in a Zoom meeting by default?",
            ["The host and co-hosts", "All participants automatically", "Only paid account holders", "Only the person who sent the invite"],
            "The host and co-hosts",
        ),
        (
            "What is the 'Share a portion of screen' option useful for?",
            ["Limiting what others can see to just a selected area", "Improving video resolution", "Automatically recording the session", "Displaying a shared whiteboard"],
            "Limiting what others can see to just a selected area",
        ),
    ],
    "5ddc1921-1ec1-4802-a1ac-40dc66809c0b": [  # Zoom Part 6: Chat, Reactions, and Polls
        (
            "How can participants give feedback without interrupting the speaker?",
            ["Using reactions like thumbs up or Raise Hand", "By calling the host directly", "By leaving and rejoining the meeting", "Only by typing in the chat"],
            "Using reactions like thumbs up or Raise Hand",
        ),
        (
            "Where do you find Zoom polls during a meeting?",
            ["In the Polls button on the meeting toolbar", "Under the Participants panel", "In your profile settings", "Only available after the meeting ends"],
            "In the Polls button on the meeting toolbar",
        ),
        (
            "Which statement about Zoom chat is correct?",
            ["You can send messages to everyone or to a specific person", "Chat messages are only visible to the host", "Chat is automatically deleted when you join", "Only the host can use chat"],
            "You can send messages to everyone or to a specific person",
        ),
    ],
    "27430f29-32a5-44b4-9e31-b8fd02ce7087": [  # Zoom Part 7: Breakout Rooms
        (
            "What is the main purpose of Breakout Rooms in Zoom?",
            ["To split participants into smaller groups for focused discussion", "To record separate segments of the meeting", "To allow private screen sharing", "To mute disruptive participants"],
            "To split participants into smaller groups for focused discussion",
        ),
        (
            "Who can assign participants to Breakout Rooms?",
            ["The host", "Any participant", "Only co-hosts", "Participants who joined earliest"],
            "The host",
        ),
        (
            "Can participants in a Breakout Room communicate with the main session?",
            ["Yes — they can send a message to the host or return to the main room", "No — they are completely isolated", "Only if the host messages them first", "Only with a Pro account"],
            "Yes — they can send a message to the host or return to the main room",
        ),
    ],
    "e7ead956-fdd4-45c0-befa-50c413364db0": [  # Zoom Part 8: Recording Meetings
        (
            "Where are local Zoom recordings saved by default?",
            ["In the Zoom folder inside your Documents", "Automatically to Google Drive", "On Zoom's cloud servers", "On a connected USB drive"],
            "In the Zoom folder inside your Documents",
        ),
        (
            "Before recording a meeting, what must you always do?",
            ["Inform all participants and obtain their consent", "Upgrade to a paid Zoom account", "Enable subtitles first", "Use a Virtual Background"],
            "Inform all participants and obtain their consent",
        ),
        (
            "Which Zoom plan includes cloud recording?",
            ["Zoom Pro and above", "Free Basic accounts", "All accounts by default", "Only Zoom Webinar accounts"],
            "Zoom Pro and above",
        ),
    ],
    "92de904b-eb79-47fb-83f4-527108b485af": [  # Zoom Part 9: Training and Webinars
        (
            "What is the key difference between a Zoom Meeting and a Zoom Webinar?",
            ["In a Webinar, attendees cannot turn on camera or audio by default", "Webinars are limited to 10 people", "Meetings cannot be recorded", "Webinars are free; meetings are paid"],
            "In a Webinar, attendees cannot turn on camera or audio by default",
        ),
        (
            "Which features are especially useful for interactive training sessions?",
            ["Polls and Breakout Rooms", "Virtual backgrounds only", "Recording only", "Annotation when disabled"],
            "Polls and Breakout Rooms",
        ),
        (
            "What does the 'Spotlight' feature do during a Zoom meeting?",
            ["Pins a specific speaker's video so all participants see them", "Highlights the chat window", "Increases your microphone volume", "Automatically shares your screen"],
            "Pins a specific speaker's video so all participants see them",
        ),
    ],
    "ab5399d5-70cc-4d0d-9ba3-d8ee161da782": [  # Zoom Part 10: Security and Privacy
        (
            "What is the best way to prevent uninvited guests from joining your meeting?",
            ["Enable Waiting Room and require a passcode", "Only invite people by email", "Use a very short meeting ID", "Disable chat for participants"],
            "Enable Waiting Room and require a passcode",
        ),
        (
            "What should you do if someone is disrupting your meeting?",
            ["Remove them using the host controls", "Restart the meeting for everyone", "Turn off your own video", "Change the meeting link mid-session"],
            "Remove them using the host controls",
        ),
        (
            "Which action locks your meeting once all expected participants have joined?",
            ["Lock Meeting (under the Security button)", "Enable Screen Share Lock", "Turn on Waiting Room", "Restrict all chat"],
            "Lock Meeting (under the Security button)",
        ),
    ],
    "6e72847b-29b1-46a9-bb4f-8def8bf72cc4": [  # Zoom Part 11: Settings and Productivity Tips
        (
            "Where can you adjust most of Zoom's default behaviours?",
            ["In the Settings section of the Zoom desktop app", "Only in your browser account page", "By contacting Zoom support", "Under Help > Documentation"],
            "In the Settings section of the Zoom desktop app",
        ),
        (
            "Which keyboard shortcut mutes or unmutes your microphone in a Zoom meeting?",
            ["Alt+A (Windows) or Command+Shift+A (Mac)", "Ctrl+M", "F1", "Ctrl+Shift+M"],
            "Alt+A (Windows) or Command+Shift+A (Mac)",
        ),
        (
            "What is the benefit of enabling 'Always show meeting controls'?",
            ["The toolbar stays visible without needing to hover", "All meetings are recorded automatically", "Participants cannot leave the meeting", "Video quality improves"],
            "The toolbar stays visible without needing to hover",
        ),
    ],

    # ── Microsoft Teams ────────────────────────────────────────────────────────
    "fef8005c-d60f-492b-85cb-4372dc872acd": [  # Teams Part 1: Getting Started
        (
            "How do you access Microsoft Teams if you already have a Microsoft 365 account?",
            ["Sign in at teams.microsoft.com or via the desktop app", "Purchase a separate Teams license", "Access it only through Outlook", "Create a new account at office.com"],
            "Sign in at teams.microsoft.com or via the desktop app",
        ),
        (
            "What is the recommended way to install Microsoft Teams on your computer?",
            ["Download the desktop app from teams.microsoft.com", "Use only the web browser version", "Install from the Windows Store exclusively", "Ask IT to install it for you"],
            "Download the desktop app from teams.microsoft.com",
        ),
        (
            "What is a good first step after logging into Teams for the first time?",
            ["Complete your profile with a photo and status message", "Create a new team immediately", "Invite all your colleagues right away", "Schedule a meeting straightaway"],
            "Complete your profile with a photo and status message",
        ),
    ],
    "4a98bc42-99cd-4180-8856-46170b4547cf": [  # Teams Part 2: The Interface
        (
            "What does the left sidebar in Microsoft Teams primarily contain?",
            ["Navigation to Activity, Chat, Teams, Calendar, and Files", "Your email inbox only", "System settings", "Your organisation's org chart"],
            "Navigation to Activity, Chat, Teams, Calendar, and Files",
        ),
        (
            "What does the Activity feed in Teams show you?",
            ["Notifications of @mentions, replies, and reactions to your messages", "All messages sent across your organisation", "Only your calendar appointments", "Files recently shared with you"],
            "Notifications of @mentions, replies, and reactions to your messages",
        ),
        (
            "Where can you find a file that a colleague shared with you in a chat?",
            ["In the Files tab at the top of the chat window", "Only in your email inbox", "Under Settings > Shared Files", "In the Activity feed only"],
            "In the Files tab at the top of the chat window",
        ),
    ],
    "039285c0-65aa-4366-ba1d-14eb9bf99cb7": [  # Teams Part 3: Chats
        (
            "What is the difference between a Chat and a Channel post in Teams?",
            ["Chats are private; channel posts are visible to all team members", "Chats are for files only; channels are for video", "There is no practical difference", "Chats are public; channels are private"],
            "Chats are private; channel posts are visible to all team members",
        ),
        (
            "How can you format a long Teams chat message for better readability?",
            ["Use the Format button (Aa) to add headings, bold text, and lists", "Only plain text is supported in Teams", "Use HTML tags directly in the message box", "Send a Word document attachment instead"],
            "Use the Format button (Aa) to add headings, bold text, and lists",
        ),
        (
            "Which feature lets you respond directly to a specific earlier message?",
            ["Hover over the message and click Reply", "Start a completely new chat", "Forward the message by email", "Use an @mention only"],
            "Hover over the message and click Reply",
        ),
    ],
    "0a29c953-30dd-4215-9ed4-3466b21710b2": [  # Teams Part 4: Teams and Channels
        (
            "What is a Channel in Microsoft Teams?",
            ["A dedicated space within a Team for a specific topic or project", "A private video call", "A type of file folder", "A connection to an external app"],
            "A dedicated space within a Team for a specific topic or project",
        ),
        (
            "What is the difference between a Standard and a Private channel?",
            ["Private channels are only visible to selected members", "Standard channels have more storage", "Private channels can only be used for video calls", "There is no practical difference"],
            "Private channels are only visible to selected members",
        ),
        (
            "How do you notify a specific person in a channel post?",
            ["Type @ followed by their name", "Click on their profile picture in the post", "Forward the post by email", "Call them directly from the channel"],
            "Type @ followed by their name",
        ),
    ],
    "2be37b09-b931-4f58-81bb-8893c5a4bcb0": [  # Teams Part 5: Meetings
        (
            "Where do you schedule a Teams meeting from within Teams?",
            ["From the Calendar tab", "Only from Outlook", "Only from the Chat tab", "From Settings > Meetings"],
            "From the Calendar tab",
        ),
        (
            "What happens when you click 'Meet now' in Microsoft Teams?",
            ["An instant meeting starts immediately without scheduling", "A meeting is scheduled for the next available slot", "An invitation is sent to all your contacts", "It opens Zoom instead"],
            "An instant meeting starts immediately without scheduling",
        ),
        (
            "How can someone join a Teams meeting without a Teams account?",
            ["Via the meeting link in a web browser as a guest", "They cannot — Teams always requires an account", "Only with a phone dial-in number", "Only if the host approves them in advance from the admin centre"],
            "Via the meeting link in a web browser as a guest",
        ),
    ],
    "ab790995-a4cf-45bd-8e3e-cb540369d52e": [  # Teams Part 6: Leading a Team Meeting
        (
            "What does the 'Spotlight' feature allow a meeting organiser to do?",
            ["Pin a specific participant's video so all attendees see them", "Increase a participant's microphone volume", "Lock the meeting chat", "Automatically record the session"],
            "Pin a specific participant's video so all attendees see them",
        ),
        (
            "How do you mute all participants as a meeting organiser?",
            ["Click 'Mute all' in the Participants panel", "Ask each participant to mute themselves", "Disable microphone access in Settings", "Use the Teams admin centre"],
            "Click 'Mute all' in the Participants panel",
        ),
        (
            "What is the main benefit of preparing a meeting agenda before a Teams call?",
            ["Participants come prepared and the meeting stays focused", "It prevents people from joining late", "It automatically records the meeting", "It limits chat during the call"],
            "Participants come prepared and the meeting stays focused",
        ),
    ],
    "6624a533-80ab-40b8-bfc5-354a7c0213b3": [  # Teams Part 7: Files
        (
            "Where are files shared in a Teams channel actually stored?",
            ["In SharePoint, linked to that Team", "On your local computer only", "In your personal OneDrive", "In a Dropbox integration"],
            "In SharePoint, linked to that Team",
        ),
        (
            "How can multiple people edit the same Word document in Teams simultaneously?",
            ["Open the file within Teams — it enables real-time co-authoring", "Only one person can edit at a time in Teams", "Export to Google Docs first", "Use Track Changes and take turns"],
            "Open the file within Teams — it enables real-time co-authoring",
        ),
        (
            "What is the key advantage of using Files within Teams instead of emailing attachments?",
            ["Everyone always accesses the latest version of the file", "Files are automatically encrypted by default", "Files are smaller when stored in Teams", "Email doesn't support large attachments"],
            "Everyone always accesses the latest version of the file",
        ),
    ],
    "b68c0108-94f2-4a19-b39c-a4c0009f9608": [  # Teams Part 8: Notifications and Status
        (
            "What does a yellow crescent moon status indicator mean in Teams?",
            ["The person has set 'Do Not Disturb' or their device is in quiet hours", "They are currently in a meeting", "Their account is inactive", "They are offline"],
            "The person has set 'Do Not Disturb' or their device is in quiet hours",
        ),
        (
            "How can you reduce notification interruptions during focused work?",
            ["Set your status to 'Do Not Disturb' or configure Quiet Hours", "Log out of Teams completely", "Mute your computer speakers", "Only check Teams once a day manually"],
            "Set your status to 'Do Not Disturb' or configure Quiet Hours",
        ),
        (
            "How do you ensure you see all replies in a busy channel without checking it constantly?",
            ["Follow the channel to receive notifications", "Check the channel manually every hour", "Ask senders to email you as well", "Enable all global notifications in Settings"],
            "Follow the channel to receive notifications",
        ),
    ],
    "fc7f9c08-37e5-4b87-acb9-411b4cee7ba3": [  # Teams Part 9: Desktop vs Mobile
        (
            "Which Teams feature is best suited for quick communication on the mobile app?",
            ["Chat and quick reactions", "Co-editing documents", "Scheduling recurring meetings", "Managing team membership settings"],
            "Chat and quick reactions",
        ),
        (
            "How do you join a scheduled meeting on the Teams mobile app?",
            ["Tap the meeting notification or find it in the Calendar tab", "Log in via a mobile web browser", "Call the meeting organiser directly", "Only possible from the desktop app"],
            "Tap the meeting notification or find it in the Calendar tab",
        ),
        (
            "What is a key limitation of the Teams mobile app compared to the desktop version?",
            ["Some admin and settings options are only available on desktop", "You cannot join meetings on mobile", "Chat is not available on mobile", "Files cannot be viewed on mobile"],
            "Some admin and settings options are only available on desktop",
        ),
    ],
    "3646345f-11df-4519-82e1-3538c7f91369": [  # Teams Part 10: Quick Reference
        (
            "Which keyboard shortcut opens the search bar in Microsoft Teams?",
            ["Ctrl+E", "Ctrl+F", "Ctrl+S", "Alt+Q"],
            "Ctrl+E",
        ),
        (
            "Where can you quickly find all files shared across your chats and channels?",
            ["The Files section in the left navigation bar", "Only in your email client", "Under Settings > Recents", "From the Help tab"],
            "The Files section in the left navigation bar",
        ),
        (
            "You receive an important message and want to find it easily later. What should you do?",
            ["Save the message using the '...' (more options) menu", "Take a screenshot", "Print the chat", "Copy and paste it into a Word document"],
            "Save the message using the '...' (more options) menu",
        ),
    ],
}


def main():
    chapter_ids = list(QUESTIONS.keys())
    total_chapters = len(chapter_ids)
    total_questions = sum(len(v) for v in QUESTIONS.values())
    print(f"Seeding {total_questions} questions across {total_chapters} chapters...")

    # Delete existing questions for these chapters
    ids_filter = "chapter_id=in.(" + ",".join(chapter_ids) + ")"
    rest_delete("course_quiz_questions", ids_filter)
    print("  Cleared existing questions.")

    # Build insert payload
    rows = []
    for chapter_id, qs in QUESTIONS.items():
        for i, (question, options, correct_answer) in enumerate(qs, start=1):
            rows.append({
                "chapter_id": chapter_id,
                "question": question,
                "options": options,
                "correct_answer": correct_answer,
                "order_index": i,
            })

    result = rest_post("course_quiz_questions", rows)
    print(f"  Inserted {len(result)} questions.")
    print("Done.")


if __name__ == "__main__":
    main()
