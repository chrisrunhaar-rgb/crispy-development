"use client";

import React, { useState, useTransition } from "react";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- Brand tokens ------------------------------------------------------------
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const mutedText = "oklch(48% 0.04 260)";
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

const SLUG = "receiver-determines-meaning";

// -- Content (EN only for now; add `id` alongside `en` later) -----------------
type FilterItem = { key: string; title: string; sub: string; paras: string[]; watchLabel: string; watch: string[] };
type Card = { title: string; body: string };
type Row = { label: string; sender: string; receiver: string };
type Myth = { myth: string; reality: string };
type Practice = { title: string; body: string; phrase: string };
type Panel = { title: string; paras: string[] };

const CONTENT = {
  en: {
    hero: {
      eyebrow: "Communication · Concept",
      title: "The Receiver Determines the Meaning",
      subtitle: "What counts is what the other person understood.",
      lead:
        "Every listener builds meaning from their own language, culture, experience and relationship with you. This module explains that principle and the habits that help a leader check what was actually understood.",
    },
    intro: {
      eyebrow: "What It Is",
      heading: "Meaning is built on the receiving end",
      paras: [
        "A common picture of communication goes like this: I have an idea, I put it into words, the words travel to you, and you take the idea out again. In that picture, the meaning sits inside the message. If I choose the right words, the meaning arrives intact.",
        "Some early models of communication worked in roughly this way. They were built to explain how a signal moves along a telephone line or a radio channel, and how noise can disturb it on the way. For engineers they were very useful. For people talking to people, they leave out the most important step.",
        "Words carry signals. The meaning is made by the person who receives them. When you hear a sentence, your mind connects it to the words you know, the situations you have lived through, the habits of your culture and what you think of the speaker. Out of all of that, you build an understanding. Another listener, hearing exactly the same sentence, may build a different one.",
        "The communication scholar David Berlo made this point in 1960 when he argued that words themselves hold no meaning, and that meaning lives in the people who use them. A few years earlier, Wilbur Schramm described each person as carrying a field of experience: the store of life, language and values they bring to any exchange. Understanding happens mostly where two of those fields overlap.⁶",
        "Charles Kraft, writing for Christians who communicate across cultures, took the idea further. He argued that the receiver is the one who finally settles what a message means, so the communicator's task is to understand how the receiver is likely to hear and to shape the message with that in mind.⁸ He called this receptor-oriented communication. In this module we use the plainer phrase receiver-oriented.",
        "For leaders, this has a practical consequence. If meaning is built by the listener, then saying something clearly is only half the work. The other half is finding out what was understood. That responsibility sits mainly with the person speaking, and even more with the person who holds authority in the room.",
        "The principle applies inside one culture as well as across many. Two colleagues from the same town can misunderstand each other. Across languages and cultures the gaps tend to be wider and harder to see, which is why the principle matters so much for leaders of international teams. This module focuses on the receiving side and on the habits of checking. Other modules on this site look at cultural communication styles and at reading high-context messages, and they pair well with this one.",
      ],
      quote:
        "A message is complete when the meaning in the listener's mind is close to the meaning in yours, and only the listener can show you whether it is.",
    },
    objectives: {
      label: "After This Module",
      items: [
        "Explain why the listener, rather than the speaker, builds the meaning of a message.",
        "Describe four filters that shape what a listener understands.",
        "Distinguish sender-oriented from receiver-oriented communication.",
        "Explain why speakers tend to overestimate how clear they have been.",
        "Use simple practices to check what was understood.",
      ],
    },
    filters: {
      eyebrow: "The Model",
      heading: "Four filters every message passes through",
      intro:
        "Each listener receives your words through at least four filters. They work at the same time and mostly without the listener noticing. Select a filter to see how it shapes meaning.",
      items: [
        {
          key: "language",
          title: "Language",
          sub: "Words and sound",
          paras: [
            "The first filter is the language itself. A listener using their second or third language is doing more work than a native speaker. They are processing vocabulary, grammar and pronunciation while also trying to follow your point. Fast speech, long sentences and an unfamiliar accent all add to that load.",
            "Idioms and figures of speech are a frequent source of confusion. Phrases like 'touch base', 'ballpark figure' or 'move the goalposts' make sense only if you already know them. A listener may take them literally, make a guess, or quietly lose the thread while still nodding along.",
            "Accent affects the listener's side as well. In one experiment, listeners rated identical trivia statements as less likely to be true when they were read by a speaker with a foreign accent. The researchers linked this to the extra effort of processing unfamiliar speech, and the effect became smaller when listeners were made aware of it.⁴ A leader who knows about this bias can correct for it when weighing ideas from team members who speak with an accent.",
          ],
          watchLabel: "Signs to watch for",
          watch: [
            "Nodding that slows or stops when the pace picks up",
            "Questions about single words rather than the main point",
            "Replies that answer a slightly different question from the one you asked",
          ],
        },
        {
          key: "culture",
          title: "Culture",
          sub: "Shared habits of meaning",
          paras: [
            "Culture shapes how a message is expected to sound. In some settings, important points are stated plainly. In others, they are carried by context, tone and what is left unsaid. A direct instruction can sound efficient to one listener and harsh to another.",
            "Culture also shapes what common responses mean. 'Yes' can mean 'I agree', 'I heard you', 'I respect you' or 'I will try'. Silence can signal agreement, disagreement, careful thought, discomfort or confusion. In many hierarchical settings, from parts of East and Southeast Asia to the Middle East and Latin America, asking a senior person a question in public can feel like suggesting they explained poorly, so people stay quiet and work it out later.",
            "These patterns are different ways of protecting relationships and getting work done, and each makes sense from the inside. The risk comes when a speaker reads a listener's response through the speaker's own cultural rules, and treats a polite 'yes' as a commitment or a quiet room as full agreement.",
          ],
          watchLabel: "Signs to watch for",
          watch: [
            "A quick 'yes' with no follow-up questions",
            "Silence that you have read as agreement without checking",
            "People leaving the same meeting with different action points",
          ],
        },
        {
          key: "experience",
          title: "Experience",
          sub: "What they already know",
          paras: [
            "Every listener brings a store of knowledge and assumptions. Words like 'soon', 'urgent', 'simple' or 'a short report' only make sense against what a person has seen before. 'Soon' for someone used to week-long approval cycles is very different from 'soon' for someone used to answering within the hour.",
            "Experience includes professional background. A finance specialist and a field coordinator can hear the word 'budget' and picture two different documents. Someone new to an organisation lacks the history that long-serving staff take for granted, so a reference to 'the way we did it last year' may mean little to them.",
            "Research on conversation shows that listeners lean on their own perspective first. In an eye-tracking study, listeners briefly looked at objects that only they could see, even though they knew the speaker could not see them.³ We tend to start from what we know and correct afterwards, and the correction is often incomplete.",
          ],
          watchLabel: "Signs to watch for",
          watch: [
            "Vague time words such as 'soon', 'shortly' or 'when you can'",
            "Abbreviations, project names and internal shorthand",
            "References to past events the listener did not see",
          ],
        },
        {
          key: "relationship",
          title: "Relationship",
          sub: "Who is speaking",
          paras: [
            "The same sentence can mean something different depending on who says it. Watzlawick and his colleagues described every message as carrying two things: its content, and a signal about the relationship between the people involved. The relationship level frames how the content is received.⁷",
            "A suggestion from a peer may be heard as one option among several. The same words from a director may be heard as an instruction. A correction from someone the listener trusts may feel like help, while the same correction from someone they distrust may feel like criticism of them as a person.",
            "Language and trust are linked as well. A study of multinational teams found that language barriers affected how trustworthy team members seemed to one another and how willing they were to trust.⁵ When people struggle to understand each other, they tend to fill the gap with guesses about intentions, and those guesses are often less generous than the truth.",
          ],
          watchLabel: "Signs to watch for",
          watch: [
            "A passing idea from a leader treated as a firm decision",
            "Feedback on the work heard as a judgement on the person",
            "Reluctance to admit confusion to someone more senior",
          ],
        },
      ] as FilterItem[],
    },
    clarity: {
      eyebrow: "Why Speakers Think They Were Clear",
      heading: "Your own clarity is hard to judge",
      intro:
        "Speakers often feel sure they were understood when they were not. Research points to several ordinary mental habits behind this.",
      cards: [
        {
          title: "The curse of knowledge",
          body:
            "Once you know something, it is hard to imagine not knowing it. In a well-known Stanford study, one group tapped out the rhythm of familiar songs on a table while another group tried to name the songs. The tappers expected listeners to succeed about half the time. Listeners named the song in about 3 out of 120 attempts.¹ The tappers could hear the melody in their heads. The listeners heard only knocks. Leaders explain with the full picture in mind, and the listener may receive only the knocks.",
        },
        {
          title: "The illusion of transparency",
          body:
            "People tend to overestimate how well others can read their inner states. In studies by Gilovich and colleagues, people who were hiding a lie or a feeling of disgust believed observers could see it far more often than observers actually could.² The original studies were about emotions. It is a reasonable step, though not a direct finding, to expect a similar pattern when we assume our intentions and priorities are obvious to others.",
        },
        {
          title: "Starting from your own view",
          body:
            "Speakers and listeners both begin from their own perspective and adjust afterwards. The eye-tracking work described under the Experience filter showed listeners first considering what only they could see.³ Speakers do something similar when they assume the listener shares their context, their history with the project or their sense of what is urgent.",
        },
      ] as Card[],
      close:
        "These habits are ordinary features of how minds work, and they appear in careful, experienced communicators as well as in beginners. That is good news, because it means the response can also be a habit: building regular, low-pressure checks into the way you communicate.",
    },
    compare: {
      eyebrow: "Side by Side",
      heading: "Two ways of approaching communication",
      intro:
        "The difference between a sender-oriented and a receiver-oriented approach shows up in small, practical choices. The table sets them next to each other.",
      colLabel: "Aspect",
      colSender: "Sender-oriented",
      colReceiver: "Receiver-oriented",
      rows: [
        { label: "Goal", sender: "Say the message correctly and completely.", receiver: "Help the listener build an accurate understanding." },
        { label: "What counts as success", sender: "The message was delivered.", receiver: "The listener can explain the message and act on it." },
        { label: "Who adapts", sender: "The listener is expected to keep up.", receiver: "The speaker adjusts words, pace and format to the listener." },
        { label: "How understanding is checked", sender: "'Any questions?' or 'Is that clear?'", receiver: "The listener describes the plan or next step in their own words." },
        { label: "Role of feedback", sender: "Optional, and sometimes unwelcome.", receiver: "Expected, and treated as useful information." },
        { label: "When things go wrong", sender: "The listener was not paying attention.", receiver: "The speaker asks which part of the message did not land." },
      ] as Row[],
      note:
        "Most leaders move between the two. The aim is to notice which one you are using, especially when the stakes are high or the team is diverse.",
    },
    myths: {
      eyebrow: "Common Misunderstandings",
      heading: "Four ideas that get in the way",
      intro: "These assumptions are widespread and understandable. Each one makes it harder to see what the listener actually took away.",
      items: [
        {
          myth: "If I said it clearly, they understood it.",
          reality:
            "Clarity in your own head is a starting point. The curse of knowledge means a message can feel complete to you and still leave gaps for the listener.¹ Understanding is something you confirm rather than assume.",
        },
        {
          myth: "'Yes' means agreement.",
          reality:
            "In many settings, 'yes' signals respect or attention rather than agreement or commitment. A positive answer to a closed question tells you little. A short description of the next step tells you much more.",
        },
        {
          myth: "Simplifying means talking down.",
          reality:
            "Plain words, shorter sentences and a slower pace reduce the effort required of the listener without reducing the content. Simplifying the message is a form of respect for the person receiving it. Talking down happens when the tone becomes patronising, and that is a separate matter from word choice.",
        },
        {
          myth: "No questions means no confusion.",
          reality:
            "Silence can mean understanding. It can also mean embarrassment, a wish to avoid seeming slow, or reluctance to question someone senior. Speakers tend to overestimate how obvious their meaning is,² so a quiet room deserves a gentle check.",
        },
      ] as Myth[],
    },
    practices: {
      eyebrow: "What It Means for Leaders",
      heading: "Five practices for checking meaning",
      intro:
        "The principle becomes useful when it turns into habits. The practices below are simple. Their value comes from using them regularly, especially with people who work in a second language or come from a different background from yours.",
      phraseLabel: "You might say",
      items: [
        {
          title: "Use teach-back to test your explanation",
          body:
            "Teach-back means asking the listener to explain, in their own words, what they will do. It was developed in healthcare, where systematic reviews have found it improves understanding in most of the studies examined.⁹ Its success depends on framing: the check is on the explainer, and the listener should feel that clearly.¹⁰ Because the evidence comes from clinics, treat it in the workplace as a well-supported analogy rather than proof.",
          phrase: "“I want to be sure I explained this well. How would you describe the plan to your team?”",
        },
        {
          title: "Paraphrase what you hear",
          body:
            "When you are the listener, summarise what you understood before you respond. This closes the loop in the other direction, and it models the kind of checking you hope others will use with you.",
          phrase: "“What I'm hearing is that the deadline matters more than the format. Have I got that right?”",
        },
        {
          title: "Ask open and specific questions",
          body:
            "Closed questions like 'Any questions?' and 'Is that clear?' invite a quick yes. Open, specific questions ask for content, and they make it easier for someone to reveal a gap without losing face in front of others.",
          phrase: "“What will you do first?” or “Which part of this might be easy to misread?”",
        },
        {
          title: "Make it safe to say 'I didn't understand'",
          body:
            "Take responsibility for clarity out loud. Offer a second channel, such as a message after the meeting or a short written summary, so people who are uncomfortable asking in public still have a way to check. When a leader admits their own misunderstandings openly, others find it easier to do the same.",
          phrase: "“If anything was unclear, that's on me. Send me a note later if that's easier.”",
        },
        {
          title: "Simplify the message, not the person",
          body:
            "Cut idioms, shorten sentences, slow down and put key points in writing. Use an example, a sample document or a simple sketch where it helps. Keep the content and the respect at full strength while lowering the effort it takes to understand.",
          phrase: "“Please send the report by Thursday at 5 pm. Two pages, with the budget table first.”",
        },
      ] as Practice[],
      note:
        "Checking does not have to slow everything down. One good question at the end of a conversation can save days of rework later.",
    },
    faith: {
      eyebrow: "Faith Anchor",
      heading: "Heard in their own language",
      paras: [
        "At Pentecost, people from many nations were gathered in Jerusalem. Luke records their surprise: each one heard the message in their own language (Acts 2:6-11). The message reached them in a form they could receive, rather than requiring them to reach the speaker's form first.",
        "James gives a simpler instruction for everyday life: be quick to listen and slow to speak (James 1:19). Listening first honours the other person, and it is also how a speaker learns what was actually heard.",
        "For readers of any faith or none, the shared point is humility. The person speaking carries the responsibility to be understood.",
      ],
    },
    reflection: {
      eyebrow: "Reflection",
      question: "Which of the four filters do I most often forget in the people I lead?",
      prompts: [
        "Choose one conversation this week where you can replace 'Any questions?' with an open check.",
        "Notice who on your team works in a second language, and one way you could lower the effort of listening for them.",
      ],
    },
    finalWord: {
      eyebrow: "A Final Word",
      heading: "Understanding is confirmed together",
      body:
        "Speaking clearly is a good start. Whether you were understood becomes visible in the other person's words and actions. Leaders who take responsibility for that second step tend to build teams where people can admit confusion early, while it is still easy to fix. Over time, that habit becomes part of how trust is built.",
    },
    takeaways: {
      eyebrow: "Key Takeaways",
      heading: "What to Carry Forward",
      items: [
        "Meaning is built by the listener from their language, culture, experience and relationship with you. The same words can produce different understandings in different people.⁶",
        "Speakers tend to overestimate how clear they were. The curse of knowledge and the illusion of transparency make a message seem more obvious to the speaker than it is to the listener.¹,²",
        "A receiver-oriented leader shapes the message for the listener and measures success by what was understood.⁸",
        "Replace closed checks like 'Any questions?' with open ones, and use teach-back as a test of your own explanation.⁹,¹⁰",
        "Make it safe to say 'I didn't understand'. The leader goes first.",
      ],
    },
    digDeeper: {
      eyebrow: "Dig Deeper",
      heading: "For those who want more",
      intro: "Optional background on the research and ideas behind this module.",
      panels: [
        {
          title: "The tapping study in more detail",
          paras: [
            "The study comes from Elizabeth Newton's 1990 doctoral research at Stanford University. Participants were paired. One person tapped the rhythm of a well-known song, and the other tried to identify it. Before hearing the result, tappers estimated that listeners would name the song about half the time. Across 120 attempts, listeners named it 3 times.",
            "The figures are best known through Chip and Dan Heath's book Made to Stick, which uses the study to illustrate the curse of knowledge.¹ It was a laboratory task, so the exact numbers say little about everyday workplaces. The lesson travels well: the person who already knows the content cannot easily hear it as a newcomer does.",
          ],
        },
        {
          title: "Schramm's fields of experience",
          paras: [
            "Wilbur Schramm pictured communication as two overlapping circles. Each circle holds a person's field of experience: their language, background, attitudes and values. A message can be reliably shared only where the circles overlap. Schramm also gave weight to feedback, the responses that let a speaker see how a message was received and adjust.⁶",
            "In diverse teams, the overlap is often smaller than it looks. Shared job titles and a shared working language can hide large differences in background. Feedback is the main tool a speaker has for finding where the overlap ends.",
          ],
        },
        {
          title: "Content and relationship",
          paras: [
            "In Pragmatics of Human Communication, Paul Watzlawick, Janet Beavin and Don Jackson proposed that every message works on two levels. One level is the content. The other is what the message implies about the relationship between the people involved, and this second level shapes how the content is taken.⁷",
            "This helps explain why the same request can be welcomed from one colleague and resented from another. When a message lands badly, it can help to ask whether the problem was the content or the relationship signal the listener received alongside it.",
          ],
        },
        {
          title: "Language, accent and trust",
          paras: [
            "Shiri Lev-Ari and Boaz Keysar asked listeners to judge trivia statements read by native and non-native speakers. Statements read with a foreign accent were rated as less true, even though the speakers were only reading statements written by others. The researchers linked this to the extra effort of processing accented speech. When listeners were told the study was about processing difficulty, the effect was reduced for mild accents.⁴",
            "Helene Tenzer, Markus Pudelko and Anne-Wil Harzing interviewed 90 members of 15 multinational teams in German automotive companies. They found that language barriers shaped how trustworthy colleagues seemed and how willing people were to trust them.⁵ The study covers one industry and one country of headquarters, so it is best read as research that suggests a pattern rather than a global measure.",
          ],
        },
        {
          title: "What the teach-back evidence shows",
          paras: [
            "A 2020 systematic review by Talevski and colleagues looked at studies of teach-back in health settings. Most of the included studies reported benefits such as better understanding, and the authors judged the overall quality of the evidence as moderate.⁹",
            "The US Agency for Healthcare Research and Quality publishes a short practical guide to teach-back. Its central point is framing: the clinician presents the check as a test of how well they explained, which lowers the pressure on the patient.¹⁰ Workplaces differ from clinics, so this evidence supports teach-back by analogy. The framing advice transfers easily to any leader giving instructions.",
          ],
        },
        {
          title: "Receptor-oriented communication in Christian thought",
          paras: [
            "Charles Kraft's Communication Theory for Christian Witness argues that receivers construct meaning from what communicators offer, so a faithful communicator studies the receiver and adapts the message to them.⁸ Kraft drew on earlier work by Eugene Nida, whose Message and Mission explored how meaning moves between cultures, and his approach sits alongside David Hesselgrave's Communicating Christ Cross-Culturally.",
            "Kraft points to the incarnation as a pattern. In John 1:14, God communicates by entering the human world and speaking within it, rather than calling from a distance. For leaders of any background, the idea offers a picture of communication that starts by coming close to the listener.",
          ],
        },
        {
          title: "Further reading",
          paras: [
            "Charles H. Kraft, Communication Theory for Christian Witness (Orbis, revised edition 1991). A readable statement of the idea that meaning is built by the receiver.",
            "Tsedal Neeley, The Language of Global Success (Princeton University Press, 2017). A study of what happened when one multinational company adopted a single working language.",
            "Chip Heath and Dan Heath, Made to Stick (Random House, 2007), chapter 1. A short, practical account of the curse of knowledge.",
            "Agency for Healthcare Research and Quality, Teach-Back tool. A free, one-page guide to the best-evidenced checking technique.",
            "Erin Meyer, The Culture Map (PublicAffairs, 2014). A practical comparison of communication and feedback styles across countries.",
          ],
        },
      ] as Panel[],
    },
    sources: [
      "Heath, C., & Heath, D. (2007). Made to Stick: Why Some Ideas Survive and Others Die. Random House. (Reports Newton, E. L. (1990), doctoral dissertation, Stanford University.)",
      "Gilovich, T., Savitsky, K., & Medvec, V. H. (1998). The illusion of transparency: Biased assessments of others' ability to read one's emotional states. Journal of Personality and Social Psychology, 75(2), 332-346. https://pubmed.ncbi.nlm.nih.gov/9731312/",
      "Keysar, B., Barr, D. J., Balin, J. A., & Brauner, J. S. (2000). Taking perspective in conversation: The role of mutual knowledge in comprehension. Psychological Science, 11(1), 32-38. https://doi.org/10.1111/1467-9280.00211",
      "Lev-Ari, S., & Keysar, B. (2010). Why don't we believe non-native speakers? The influence of accent on credibility. Journal of Experimental Social Psychology, 46(6), 1093-1096. https://doi.org/10.1016/j.jesp.2010.05.025",
      "Tenzer, H., Pudelko, M., & Harzing, A.-W. (2014). The impact of language barriers on trust formation in multinational teams. Journal of International Business Studies, 45(5), 508-535. https://doi.org/10.1057/jibs.2013.64",
      "Schramm, W. (1954). How communication works. In W. Schramm (Ed.), The Process and Effects of Mass Communication. University of Illinois Press.",
      "Watzlawick, P., Beavin, J. H., & Jackson, D. D. (1967). Pragmatics of Human Communication. W. W. Norton.",
      "Kraft, C. H. (1991). Communication Theory for Christian Witness (rev. ed.). Orbis Books. https://orbisbooks.com/products/communication-theory-for-christian-witness",
      "Talevski, J., Wong Shee, A., Rasmussen, B., Kemp, G., & Beauchamp, A. (2020). Teach-back: A systematic review of implementation and impacts. PLoS ONE, 15(4), e0231350. https://pubmed.ncbi.nlm.nih.gov/32287296/",
      "Agency for Healthcare Research and Quality. TeamSTEPPS Teach-Back tool. https://www.ahrq.gov/teamstepps-program/curriculum/communication/tools/teachback.html",
    ],
  },
};

// -- Helpers -----------------------------------------------------------------
function cite(text: string): React.ReactNode {
  const parts = text.split(/([¹²³⁴⁵⁶⁷⁸⁹⁰]+)/);
  return (
    <>
      {parts.map((p, i) =>
        /^[¹²³⁴⁵⁶⁷⁸⁹⁰]+$/.test(p) ? (
          <span key={i} style={{ color: orange }}>{p}</span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: orange,
  margin: "0 0 16px",
};

const h2Style: React.CSSProperties = {
  fontFamily: serif,
  fontSize: "clamp(28px, 3.5vw, 42px)",
  fontWeight: 700,
  color: navy,
  fontStyle: "italic",
  lineHeight: 1.2,
  margin: "0 0 28px",
};

const bodyStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "clamp(15px, 1.7vw, 17px)",
  color: bodyText,
  lineHeight: 1.85,
  margin: "0 0 20px",
};

const container: React.CSSProperties = { maxWidth: 860, margin: "0 auto" };

type Props = { isSaved: boolean; userPathway?: string | null };

export default function ReceiverMeaningClient({ isSaved }: Props) {
  const c = CONTENT.en; // EN only for now, regardless of site language
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState(0);
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  }

  const filter = c.filters.items[activeFilter];

  return (
    <div style={{ fontFamily: sans, background: offWhite, minHeight: "100vh" }}>
      <style>{`
        .rdm-tabs { grid-template-columns: repeat(4, 1fr); }
        .rdm-cards { grid-template-columns: repeat(3, 1fr); }
        .rdm-two { grid-template-columns: repeat(2, 1fr); }
        .rdm-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        .rdm-table th, .rdm-table td { padding: 16px 18px; text-align: left; vertical-align: top; border-bottom: 1px solid oklch(88% 0.01 80); }
        .rdm-table thead th { background: ${navy}; color: ${offWhite}; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; }
        .rdm-table td.rdm-rowlabel { font-weight: 700; color: ${navy}; width: 26%; }
        @media (max-width: 760px) {
          .rdm-cards { grid-template-columns: 1fr; }
          .rdm-two { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .rdm-tabs { grid-template-columns: repeat(2, 1fr); }
          .rdm-table thead { display: none; }
          .rdm-table, .rdm-table tbody, .rdm-table tr, .rdm-table td { display: block; width: 100%; }
          .rdm-table tr { border-bottom: 1px solid oklch(80% 0.01 80); padding: 8px 0; }
          .rdm-table td { border-bottom: none; padding: 8px 18px; }
          .rdm-table td.rdm-rowlabel { width: 100%; font-size: 15px; padding-top: 14px; }
          .rdm-table td[data-label]::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${orange}; margin-bottom: 4px; }
        }
      `}</style>

      {/* -- Hero (plain navy band, no image) ------------------------------- */}
      <section style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={container}>
          <p style={{ ...eyebrowStyle, marginBottom: 24 }}>{c.hero.eyebrow}</p>
          <h1 style={{
            fontFamily: serif, fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 600,
            color: offWhite, lineHeight: 1.08, margin: "0 0 24px",
          }}>
            {c.hero.title}
          </h1>
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontSize: "clamp(17px, 2vw, 21px)",
            color: "oklch(72% 0.04 260)", margin: "0 0 36px", lineHeight: 1.5,
          }}>
            {c.hero.subtitle}
          </p>
          <div style={{ width: 48, height: 1, background: orange, marginBottom: 28 }} />
          <p style={{
            fontFamily: serif, fontStyle: "italic", fontSize: "clamp(17px, 2vw, 20px)",
            color: "oklch(82% 0.025 80)", maxWidth: 620, lineHeight: 1.6, margin: "0 0 36px",
          }}>
            {c.hero.lead}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved || isPending}
            aria-pressed={saved}
            aria-label={saved ? "Saved to My Pathway" : "Save this module to My Pathway"}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10, minHeight: 44,
              padding: "10px 24px", border: "none", cursor: saved ? "default" : "pointer",
              fontFamily: sans, fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
              background: saved ? "oklch(35% 0.05 260)" : orange, color: offWhite, borderRadius: 4,
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            {saved ? "Saved to My Pathway" : "Save to My Pathway"}
          </button>
        </div>
      </section>

      {/* -- What it is -------------------------------------------------------- */}
      <section style={{ background: offWhite, padding: "96px 24px 64px" }}>
        <div style={container}>
          <p style={{ ...eyebrowStyle, marginBottom: 28 }}>{c.intro.eyebrow}</p>
          <h2 style={{ ...h2Style, fontSize: "clamp(28px, 3.5vw, 42px)", lineHeight: 1.18, marginBottom: 40 }}>{c.intro.heading}</h2>
          {c.intro.paras.slice(0, 4).map((p, i) => (
            <p key={i} style={{ ...bodyStyle, fontSize: "clamp(16px, 1.9vw, 19px)", lineHeight: 1.9, marginBottom: 28 }}>{cite(p)}</p>
          ))}
          <blockquote style={{
            fontFamily: serif, fontStyle: "italic", fontSize: "clamp(20px, 2.4vw, 26px)",
            color: navy, lineHeight: 1.5, borderLeft: `3px solid ${orange}`,
            padding: "12px 0 12px 28px", margin: "8px 0 36px",
          }}>
            {c.intro.quote}
          </blockquote>
          {c.intro.paras.slice(4).map((p, i) => (
            <p key={i} style={{ ...bodyStyle, fontSize: "clamp(16px, 1.9vw, 19px)", lineHeight: 1.9, marginBottom: 28 }}>{cite(p)}</p>
          ))}
        </div>
      </section>

      {/* -- After this module ------------------------------------------------ */}
      <section style={{ background: navy, padding: "56px 24px" }}>
        <div style={container}>
          <p style={{ ...eyebrowStyle, marginBottom: 24 }}>{c.objectives.label}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
            {c.objectives.items.map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span aria-hidden="true" style={{ width: 3, height: 20, background: orange, flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontFamily: sans, fontSize: 14, fontWeight: 500, color: "oklch(76% 0.03 80)", lineHeight: 1.6 }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -- Four filters (the one interaction: tabs) ------------------------- */}
      <section style={{ background: lightGray, padding: "80px 24px 96px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.filters.eyebrow}</p>
          <h2 style={h2Style}>{c.filters.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 36 }}>{c.filters.intro}</p>

          <div
            role="tablist"
            aria-label="The four filters"
            className="rdm-tabs"
            style={{
              display: "grid", gap: 1, borderRadius: 8, overflow: "hidden",
              border: "1px solid oklch(80% 0.01 80)", background: "oklch(80% 0.01 80)", marginBottom: 28,
            }}
          >
            {c.filters.items.map((f, i) => {
              const active = i === activeFilter;
              return (
                <button
                  key={f.key}
                  type="button"
                  role="tab"
                  id={`rdm-tab-${f.key}`}
                  aria-selected={active}
                  aria-controls={`rdm-panel-${f.key}`}
                  onClick={() => setActiveFilter(i)}
                  style={{
                    padding: "18px 10px", minHeight: 44, border: "none", cursor: "pointer",
                    background: active ? navy : offWhite, textAlign: "center",
                  }}
                >
                  <span style={{
                    display: "block", fontFamily: serif, fontStyle: "italic", fontWeight: 700,
                    fontSize: 20, color: active ? offWhite : navy, lineHeight: 1.2,
                  }}>
                    {f.title}
                  </span>
                  <span style={{
                    display: "block", fontFamily: sans, fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 6,
                    color: active ? orange : "oklch(60% 0.04 260)",
                  }}>
                    {f.sub}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`rdm-panel-${filter.key}`}
            aria-labelledby={`rdm-tab-${filter.key}`}
            style={{ background: offWhite, borderRadius: 10, padding: "32px clamp(20px, 4vw, 40px)" }}
          >
            <h3 style={{ fontFamily: serif, fontSize: "clamp(24px, 2.8vw, 32px)", fontWeight: 700, color: navy, margin: "0 0 20px" }}>
              {filter.title}
            </h3>
            {filter.paras.map((p, i) => (
              <p key={i} style={bodyStyle}>{cite(p)}</p>
            ))}
            <div style={{
              marginTop: 8, background: "oklch(97% 0.010 50)", border: "1px solid oklch(88% 0.030 50)",
              borderRadius: 6, padding: "18px 22px",
            }}>
              <p style={{ ...eyebrowStyle, marginBottom: 10 }}>{filter.watchLabel}</p>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {filter.watch.map((w, i) => (
                  <li key={i} style={{ fontFamily: sans, fontSize: 15, color: bodyText, lineHeight: 1.7, marginBottom: 4 }}>{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* -- Why speakers think they were clear ------------------------------- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.clarity.eyebrow}</p>
          <h2 style={h2Style}>{c.clarity.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 36 }}>{c.clarity.intro}</p>
          <div className="rdm-cards" style={{ display: "grid", gap: 16, marginBottom: 32 }}>
            {c.clarity.cards.map((card, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "26px 24px", border: "1px solid oklch(22% 0.10 260 / 0.10)" }}>
                <h3 style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: navy, margin: "0 0 12px", lineHeight: 1.25 }}>{card.title}</h3>
                <p style={{ ...bodyStyle, fontSize: 15, margin: 0 }}>{cite(card.body)}</p>
              </div>
            ))}
          </div>
          <p style={{ ...bodyStyle, margin: 0 }}>{c.clarity.close}</p>
        </div>
      </section>

      {/* -- Side by side table ------------------------------------------------ */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.compare.eyebrow}</p>
          <h2 style={h2Style}>{c.compare.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 32 }}>{c.compare.intro}</p>
          <table className="rdm-table" style={{ fontFamily: sans, fontSize: 15, color: bodyText, lineHeight: 1.6 }}>
            <thead>
              <tr>
                <th scope="col">{c.compare.colLabel}</th>
                <th scope="col">{c.compare.colSender}</th>
                <th scope="col">{c.compare.colReceiver}</th>
              </tr>
            </thead>
            <tbody>
              {c.compare.rows.map((row, i) => (
                <tr key={i}>
                  <td className="rdm-rowlabel">{row.label}</td>
                  <td data-label={c.compare.colSender}>{row.sender}</td>
                  <td data-label={c.compare.colReceiver}>{row.receiver}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ ...bodyStyle, color: mutedText, marginTop: 24, marginBottom: 0 }}>{c.compare.note}</p>
        </div>
      </section>

      {/* -- Common misunderstandings ------------------------------------------ */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.myths.eyebrow}</p>
          <h2 style={h2Style}>{c.myths.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 32 }}>{c.myths.intro}</p>
          <div className="rdm-two" style={{ display: "grid", gap: 16 }}>
            {c.myths.items.map((m, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "24px", border: "1px solid oklch(22% 0.10 260 / 0.10)" }}>
                <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 22, fontWeight: 700, color: navy, margin: "0 0 12px", lineHeight: 1.3 }}>
                  &ldquo;{m.myth}&rdquo;
                </p>
                <p style={{ ...bodyStyle, fontSize: 15, margin: 0 }}>{cite(m.reality)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Leader practices --------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.practices.eyebrow}</p>
          <h2 style={h2Style}>{c.practices.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 32 }}>{c.practices.intro}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.practices.items.map((p, i) => (
              <div key={i} style={{ background: offWhite, borderRadius: 10, padding: "26px clamp(20px, 3vw, 32px)" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "baseline", marginBottom: 12 }}>
                  <span style={{ fontFamily: serif, fontSize: 28, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 24 }}>{i + 1}</span>
                  <h3 style={{ fontFamily: serif, fontSize: "clamp(20px, 2.4vw, 24px)", fontWeight: 700, color: navy, margin: 0, lineHeight: 1.25 }}>{p.title}</h3>
                </div>
                <p style={{ ...bodyStyle, marginBottom: 14 }}>{cite(p.body)}</p>
                <div style={{ background: "oklch(97% 0.010 50)", border: "1px solid oklch(88% 0.030 50)", borderRadius: 6, padding: "14px 18px" }}>
                  <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: orange, margin: "0 0 6px" }}>
                    {c.practices.phraseLabel}
                  </p>
                  <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: 18, color: navy, margin: 0, lineHeight: 1.5 }}>{p.phrase}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ ...bodyStyle, color: mutedText, marginTop: 28, marginBottom: 0 }}>{c.practices.note}</p>
        </div>
      </section>

      {/* -- Faith Anchor -------------------------------------------------------- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={container}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2v20M5 8h14" stroke={orange} strokeWidth="2.4" strokeLinecap="round" fill="none" />
            </svg>
            <p style={{ ...eyebrowStyle, margin: 0 }}>{c.faith.eyebrow}</p>
          </div>
          <h2 style={h2Style}>{c.faith.heading}</h2>
          {c.faith.paras.map((p, i) => (
            <p key={i} style={{ ...bodyStyle, fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)" }}>{p}</p>
          ))}
        </div>
      </section>

      {/* -- Reflection --------------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "80px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.reflection.eyebrow}</p>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 600, color: navy, lineHeight: 1.3, margin: "0 0 28px" }}>
            {c.reflection.question}
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {c.reflection.prompts.map((p, i) => (
              <li key={i} style={{ ...bodyStyle, marginBottom: 10 }}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* -- A Final Word ------------------------------------------------------- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={container}>
          <p style={{ ...eyebrowStyle, marginBottom: 24 }}>{c.finalWord.eyebrow}</p>
          <h2 style={{ ...h2Style, marginBottom: 32 }}>{c.finalWord.heading}</h2>
          <p style={{ ...bodyStyle, fontFamily: serif, fontSize: "clamp(17px, 2vw, 20px)", margin: 0 }}>{c.finalWord.body}</p>
        </div>
      </section>

      {/* -- Key Takeaways ------------------------------------------------------ */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.takeaways.eyebrow}</p>
          <h2 style={{ ...h2Style, marginBottom: 48 }}>{c.takeaways.heading}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {c.takeaways.items.map((item, i) => (
              <li key={i} style={{ background: "white", borderRadius: 10, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                <span style={{ fontFamily: serif, fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0, marginTop: -2 }}>
                  {i + 1}
                </span>
                <p style={{ fontFamily: serif, fontSize: "clamp(16px, 1.8vw, 18px)", color: bodyText, lineHeight: 1.8, margin: 0 }}>{cite(item)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -- Dig Deeper --------------------------------------------------------- */}
      <section style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.digDeeper.eyebrow}</p>
          <h2 style={h2Style}>{c.digDeeper.heading}</h2>
          <p style={{ ...bodyStyle, marginBottom: 32 }}>{c.digDeeper.intro}</p>
          {c.digDeeper.panels.map((panel, i) => {
            const isOpen = openPanel === i;
            return (
              <div key={i} style={{ border: "1px solid oklch(22% 0.10 260 / 0.14)", borderRadius: 10, overflow: "hidden", marginBottom: 12, background: "white" }}>
                <button
                  type="button"
                  onClick={() => setOpenPanel(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`rdm-dig-${i}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "20px 24px", background: "white", border: "none",
                    cursor: "pointer", textAlign: "left", minHeight: 44,
                    fontFamily: sans, fontSize: 15, fontWeight: 700, color: navy,
                  }}
                >
                  <span>{panel.title}</span>
                  <span aria-hidden="true" style={{
                    display: "inline-block", width: 9, height: 9, flexShrink: 0, marginLeft: 12,
                    borderRight: `2px solid ${navy}`, borderBottom: `2px solid ${navy}`,
                    transform: isOpen ? "rotate(-135deg)" : "rotate(45deg)",
                    transition: "transform 0.25s ease", marginTop: isOpen ? 4 : 0,
                  }} />
                </button>
                <div
                  id={`rdm-dig-${i}`}
                  style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease", overflow: "hidden" }}
                >
                  <div style={{ minHeight: 0 }}>
                    <div style={{ padding: "0 24px 24px", borderTop: "1px solid oklch(22% 0.10 260 / 0.10)", boxSizing: "border-box" }}>
                      {panel.paras.map((p, pi) => (
                        <p key={pi} style={{ ...bodyStyle, marginTop: pi === 0 ? 20 : 0, marginBottom: pi === panel.paras.length - 1 ? 0 : 16 }}>{cite(p)}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* -- Sources ------------------------------------------------------------ */}
      <SourcesDropdown lang="en" background={lightGray} sources={c.sources} />
    </div>
  );
}
