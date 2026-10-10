"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- Tokens ------------------------------------------------------------------
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const mutedOnGray = "oklch(48% 0.04 260)";
const calloutBg = "oklch(97% 0.010 50)";
const calloutBorder = "oklch(88% 0.030 50)";
const cardBorder = "oklch(84% 0.012 80)";
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

const SLUG = "culture-shock-and-stress";

// Wraps superscript citation markers (e.g. "¹", "¹²", "⁵,⁶") in an orange span.
function cite(text: string): React.ReactNode {
  const parts = text.split(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:,[⁰¹²³⁴⁵⁶⁷⁸⁹]+)*)/);
  return (
    <>
      {parts.map((p, i) =>
        /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+(?:,[⁰¹²³⁴⁵⁶⁷⁸⁹]+)*$/.test(p) ? (
          <span key={i} style={{ color: orange }}>
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}

// -- Content (EN only for now; ID can be added as CONTENT.id later) ---------
const CONTENT = {
  en: {
    hero: {
      eyebrow: "Cross-Cultural Leadership · Guide",
      title: "Culture Shock and Culture Stress",
      subtitle: "Why ordinary life can feel harder in a culture that is not your own, and what helps",
      intro:
        "Living or working in another culture asks more of you than it first appears. This module explains the difference between culture shock and culture stress, where the strain comes from, how to recognise it, and what helps individuals and the teams they belong to.",
      save: "Save to My Pathway",
      saved: "Saved to My Pathway",
      saveAria: "Save this module to My Pathway",
      savedAria: "Saved to My Pathway",
    },
    objectives: {
      eyebrow: "After This Module",
      heading: "You will be able to",
      items: [
        "Explain the difference between culture shock and culture stress.",
        "Describe how the strain can show up in feelings, behaviour and thinking.",
        "Tell culture stress apart from burnout, and from conditions that need professional help.",
        "Use a few practical tools for yourself and for a team, including Berry's four acculturation strategies.",
      ],
    },
    terms: {
      eyebrow: "The Two Terms",
      heading: "Two related ideas, with different timing",
      paras: [
        "The term culture shock was made popular by the anthropologist Kalervo Oberg in 1960. He described it as the anxiety that comes from losing the familiar signs and symbols of social life.¹ At home you know without thinking how to greet someone, when to speak in a meeting, what a pause means, how to queue and how to turn down an invitation politely. In a new culture many of those cues change at once, and losing them can be unsettling even for experienced and confident people.",
        "Oberg also described a series of stages: a honeymoon period, a crisis, a recovery and finally adjustment.¹ This became the well-known U-curve, which starts high, dips, and then climbs back up. Some people recognise themselves in that picture. Later research, however, shows that it describes only some experiences, and many people follow a different pattern.⁵,⁶ The U-curve is best used as a map that some people find familiar, rather than a timetable to expect or a test of whether you are adjusting correctly.",
        "Later researchers widened the idea. The psychologist John Berry described the strain of adapting to a new culture as acculturative stress: a normal response when the demands of a new setting are greater than the resources you have to meet them.³ This links to the wider stress research of Richard Lazarus and Susan Folkman, who showed that stress depends on how we judge a demand and how we judge our ability to cope with it.⁴ Seen this way, the strain of a new culture is ordinary stress with a particular source, rather than a special condition.",
      ],
      cards: [
        {
          term: "Culture shock",
          text: "A sharper period of disorientation, often early on or after a major change, when many familiar cues disappear at once. It can feel like confusion, anxiety or a sudden drop in confidence.",
        },
        {
          term: "Culture stress",
          text: "The steady, lower-level strain of living or working where the unwritten rules are not yours. It comes from having to interpret, adjust and work harder than people around you to do ordinary things, and it can continue for months or years.",
        },
      ],
      closing:
        "The two overlap, and writers use the terms in different ways. In this module, culture shock refers to the sharper disorientation and culture stress refers to the ongoing load. Some people feel a clear shock and then settle. Others feel little shock at all but notice, over many months, that they are more tired than they expected to be. Both are common, and both are normal human responses to a demanding situation.",
    },
    buildup: {
      eyebrow: "Why It Builds Up",
      heading: "Small efforts that add up",
      paras: [
        "Much of culture stress comes from tasks that look small from the outside. Reading a menu, following a conversation in a strong accent, working out whether a yes means yes, guessing what a manager expects when it has not been said. Each of these takes a little extra attention, and none of them is hard on its own.",
        "The difficulty lies in how often they come. At home most of this interpreting happens automatically, below the level of awareness. In a new culture you are doing it consciously, many times a day, and conscious effort uses energy. Many people who work in a second language say they feel unusually tired by the end of the day, even when the work itself is familiar. This is a commonly reported experience rather than a precisely measured effect, but it matches what many people working abroad describe.⁷",
        "Stress researchers use the term allostatic load for the way repeated demands, without enough recovery in between, can wear on the body over time.¹² Here it works as an analogy. The problem is usually the total rather than any single moment, and the total grows fastest when there is little time or space to recover.",
        "This also explains why culture stress can be hard to see. A person may look capable and calm in meetings and still go home drained. Colleagues from the host culture may not notice anything, because the tasks that cost the newcomer effort cost them very little.",
      ],
      factorsTitle: "Factors linked with harder adjustment",
      factorsIntro:
        "A large meta-analysis of research on people working abroad found that several factors were linked with how well people adjusted.⁹ Among them:",
      factors: [
        "A larger gap between the home culture and the host culture",
        "Little day-to-day contact with people from the host culture",
        "Limited family support, or a partner who is struggling to settle",
        "Low confidence in your own ability to handle new situations",
      ],
      factorsNote:
        "Several of these can be changed or supported, which is part of why culture stress responds well to practical help.",
    },
    abc: {
      eyebrow: "Three Areas It Affects",
      heading: "Feelings, behaviour and thinking",
      intro:
        "Colleen Ward, Stephen Bochner and Adrian Furnham describe culture shock as having three sides, often called the ABC model: affect, behaviour and cognition.² The model is useful because it shows that adjusting involves more than feeling better. It also involves learning new skills and rethinking how you explain what you see. Open each card to read more.",
      cards: [
        {
          id: "affect",
          letter: "A",
          title: "Affect: how it feels",
          summary: "The emotional side, such as anxiety, homesickness, irritability or sadness.",
          paras: [
            "This is the part most people think of first. You may feel anxious before ordinary tasks, homesick at unexpected moments, or irritated by things that would not bother you at home. Some people describe feeling less capable or less like themselves. Humour can be harder to find, partly because humour depends so much on shared cultural cues.",
            "Research on this side looks at psychological adjustment, meaning how well a person feels. Personality, coping style and the support around a person are linked with how this part goes.⁸",
          ],
          signsLabel: "What you might notice",
          signs: [
            "A shorter temper than usual",
            "Homesickness or sadness that comes in waves",
            "Anxiety before routine tasks",
            "Feeling foolish or incompetent",
          ],
        },
        {
          id: "behaviour",
          letter: "B",
          title: "Behaviour: what you do",
          summary: "The skills side, which is about learning how things are done here.",
          paras: [
            "Every culture has its own ways of greeting, asking, refusing, disagreeing, eating, giving and receiving. Without those rules you make more mistakes, and it is natural to start avoiding the situations where mistakes are likely, such as phone calls, markets, meetings or social events.",
            "This side is about sociocultural adjustment, meaning how well a person manages daily life. It tends to improve with language learning, contact with local people and time.⁸ That is encouraging, because skills can be learned.",
          ],
          signsLabel: "What you might notice",
          signs: [
            "Avoiding calls, shops or social invitations",
            "Spending most free time with your own language group",
            "Holding tightly to fixed routines",
            "More time in escapes such as screens or alcohol",
          ],
        },
        {
          id: "cognition",
          letter: "C",
          title: "Cognition: how you think",
          summary: "The thinking side, which covers how you explain what happens and how you see yourself.",
          paras: [
            "When you do not know the rules, you still try to make sense of what you see, and it is easy to fill the gaps with explanations from home. A silence can be read as agreement when it signals hesitation, or as rudeness when it signals respect. Over time, repeated misreadings can harden into fixed views about what people here are like.",
            "This side also touches identity. Some people start to idealise home, while others idealise the new culture and dismiss their own. Both can be part of working out who you are in a new place, and both tend to soften as understanding grows.",
          ],
          signsLabel: "What you might notice",
          signs: [
            "Quick negative judgements about local people",
            "Idealising home, or idealising the host culture",
            "Second-guessing what others mean",
            "Questions about who you are in this setting",
          ],
        },
      ],
      referTitle: "A gentle note",
      referText:
        "Culture stress is not a medical diagnosis. It describes a common response to a demanding situation. If symptoms such as low mood, worry, poor sleep or loss of interest persist or are severe, talk to a doctor or counsellor. If you are not sure where to find support, an international directory of helplines by country is available at ",
      referLinkLabel: "findahelpline.com",
      referLinkHref: "https://findahelpline.com",
      referAfter: ". For responding in more acute moments, see the ",
      referModuleLabel: "Psychological First Aid",
      referModuleHref: "/resources/psychological-first-aid",
      referEnd: " module.",
    },
    compare: {
      eyebrow: "Telling Them Apart",
      heading: "What it is, and what it isn't",
      intro:
        "Culture stress shares features with other kinds of strain. Telling them apart helps you choose a fitting response. The table below is a general guide only. It cannot replace an assessment by a qualified professional.",
      columns: ["Culture shock", "Culture stress", "Burnout", "Depression or anxiety"],
      rows: [
        {
          label: "Main cause",
          cells: [
            "Sudden loss of familiar cues after a move or major change",
            "The ongoing effort of living by unfamiliar rules",
            "Long-term work overload without enough recovery",
            "Many possible causes, including stress, loss, health and personal history",
          ],
        },
        {
          label: "Typical timing",
          cells: [
            "Often early, or after a new change; tends to ease as you settle",
            "Can continue for months or years, rising and falling",
            "Builds slowly over a long period of overwork",
            "Varies; symptoms last for weeks or longer",
          ],
        },
        {
          label: "Common signs",
          cells: [
            "Confusion, anxiety, a sudden drop in confidence",
            "Tiredness, irritability, withdrawal, slower decisions",
            "Exhaustion, cynicism, a sense of being ineffective",
            "Persistent low mood or worry, loss of interest, changes in sleep and appetite",
          ],
        },
        {
          label: "What tends to help",
          cells: [
            "Orientation, rest, a trusted guide, patience",
            "Culture learning, support on both sides, planned recovery",
            "Changes to workload and rhythm",
            "Help from a doctor or counsellor",
          ],
        },
      ],
      notePre:
        "These can overlap. Culture stress can feed burnout, and long-term strain can contribute to anxiety or low mood. For the work-overload side, see ",
      links: [
        { label: "Understanding Burnout", href: "/resources/understanding-burnout" },
        { label: "Sustainable Pace", href: "/resources/sustainable-pace" },
      ],
      notePost: ".",
    },
    sources: {
      eyebrow: "Sources of Stress",
      heading: "Where the strain comes from",
      intro:
        "A systematic review of 45 studies on people working abroad grouped their stress into six areas: communication, cultural differences at work, daily life, relationships with family and colleagues, money, and social inequality.⁷ The authors concluded that people working outside their home country face a different pattern of stress from local workers. The list below draws on that review and on wider research on adjustment.⁷,⁹ Some will apply to you and others will not.",
      stressors: [
        {
          title: "Language",
          text: "Working in a second language, or being understood through an accent, takes steady concentration. Even fluent speakers can find humour, speed and indirect speech tiring.",
        },
        {
          title: "Ambiguity",
          text: "Unclear roles and unwritten norms mean you are often unsure whether you are doing the right thing, and you may not know whom to ask.",
        },
        {
          title: "Loss of status and competence",
          text: "Skills that made you effective at home may count for less here. Simple tasks take longer, and it can be hard to feel like the capable adult you are.",
        },
        {
          title: "Being visible",
          text: "Looking or sounding different can mean being noticed, commented on or watched, often with less privacy than you are used to.",
        },
        {
          title: "A thin support network",
          text: "Old friends are far away and new relationships take time to grow. Knowing that support is available makes a real difference.⁹",
        },
        {
          title: "Time and relationship rules",
          text: "Expectations about punctuality, planning, hospitality and obligation to others may differ a great deal from your own.",
        },
        {
          title: "Family strain",
          text: "A partner or children who are struggling affect the whole household. Research links family support with how well people adjust.⁹",
        },
        {
          title: "Money and paperwork",
          text: "Visa rules, unfamiliar systems and financial uncertainty add a quiet background worry that can last for years.",
        },
        {
          title: "Exclusion or unfair treatment",
          text: "Being treated as an outsider, or treated unfairly because of where you come from, is a source of stress in its own right.",
        },
      ],
      signsHeading: "How it can show up",
      signsIntro:
        "Many of these signs have other causes too, so they are worth noticing as a pattern over time rather than ticking off as a checklist.",
      signAreas: [
        {
          area: "Body",
          items: [
            "Tiredness that rest does not seem to fix",
            "Disrupted sleep",
            "Headaches or stomach complaints",
            "Picking up minor illnesses more often (a pattern people report, not a proven cause)",
          ],
        },
        {
          area: "Emotions",
          items: [
            "Irritability and a shorter fuse",
            "Homesickness, sadness or worry",
            "Feeling incompetent or foolish",
            "Losing your sense of humour",
          ],
        },
        {
          area: "Behaviour",
          items: [
            "Withdrawing to your own language group",
            "Avoiding markets, calls or meetings",
            "Rigid routines",
            "More screen time, alcohol or other escapes",
          ],
        },
        {
          area: "Work",
          items: [
            "Slower decisions after a day of interpreting",
            "Misreading silence or indirect speech",
            "Friction over feedback or hierarchy",
            "Perfectionism after small mistakes, or less initiative",
          ],
        },
      ],
    },
    myths: {
      eyebrow: "Common Misunderstandings",
      heading: "Ideas worth setting aside",
      items: [
        {
          myth: "It only happens in the first few weeks.",
          text: "Stress can appear later, return after a new change such as a move or a new role, or continue at a low level for a long time. In a large study of exchange students across many countries, the timing and size of stress varied widely from person to person.⁵",
        },
        {
          myth: "Most people follow the U-curve.",
          text: "That same study followed about 2,480 students from 46 sending countries in 51 host countries and found no single U-shaped pattern. The most common experiences were small, steady shifts: a mild rise in stress for many, and a small sense of relief for many others. A smaller group did have clear peaks early or partway through their stay.⁵ An earlier study that tested the U-curve directly also did not find the predicted shape.⁶",
        },
        {
          myth: "Feeling stressed means I am weak, or in the wrong place.",
          text: "Stress is a normal response when demands are higher than the resources available to meet them.⁴ It says more about the size of the demand than about your character or your calling.",
        },
        {
          myth: "Once my language is fluent, it will go away.",
          text: "Language helps a great deal with daily life and is linked with better sociocultural adjustment.⁸ On its own, though, it does not remove ambiguity, loneliness or questions of identity.",
        },
        {
          myth: "Sharing a nationality or language means there is nothing to adjust to.",
          text: "People who move to another region of their own country, or into a very different organisational or church culture, can face real adjustment. Local colleagues on a mixed team may also carry strain that is easy to overlook because they are on home ground.",
        },
      ],
    },
    helps: {
      eyebrow: "What Helps",
      heading: "Practical steps for individuals and leaders",
      intro:
        "Culture stress responds to ordinary, steady practices more than to dramatic changes. Some of the steps below reduce the load, and others help you recover from it.",
      selfHeading: "For yourself",
      selfItems: [
        {
          title: "Sort your stressors",
          text: "Drawing on stress and coping research,⁴ it can help to write down what is weighing on you and sort each item. Can I change this? Can I learn this? Or is this something I need to endure, with support? Each group calls for a different response. Changing a situation, building a skill and finding comfort are different kinds of work, and mixing them up can waste energy.",
        },
        {
          title: "Learn the culture as well as coping with it",
          text: "Coping strategies help with how you feel. Culture learning reduces how often you are confused in the first place. Language study, regular contact with local people and a trusted cultural guide who can explain what is going on all build sociocultural skill over time.⁸,⁹",
        },
        {
          title: "Build support on both sides",
          text: "Aim for at least one trusted friend from the host culture and one person who shares your home culture. Contact with people from the host culture is linked with better adjustment, and so is knowing that support is there when you need it.⁹",
        },
        {
          title: "Plan your recovery",
          text: "Rest is part of the work. Research on recovery suggests that mentally switching off from work during free time, often called psychological detachment, is one of the best-supported ways to recover.¹⁰ In a new culture that may also mean time in your own language, with familiar food or routines, without feeling guilty about it.",
        },
      ],
      decodeTitle: "A short decoding routine",
      decodeIntro:
        "When something confuses or upsets you, pause and write down four short answers. This slows down quick judgements and turns a moment of confusion into a question you can follow up.",
      decodeSteps: [
        "What did I see or hear?",
        "What did I assume it meant?",
        "What else could it mean?",
        "Who could I ask?",
      ],
      berryHeading: "Four ways of relating to a new culture",
      berryIntro:
        "Berry described four broad strategies people use when they live between cultures. They come from two questions: how much do I keep my own culture, and how much do I take part in the new one?³",
      berry: [
        {
          name: "Integration",
          text: "Keeping your own cultural identity while taking an active part in the new culture. Many writers on acculturation see this as a helpful aim where the setting allows it.",
        },
        {
          name: "Assimilation",
          text: "Taking on the new culture and letting go of much of your own.",
        },
        {
          name: "Separation",
          text: "Holding on to your own culture and keeping contact with the new one to a minimum.",
        },
        {
          name: "Marginalisation",
          text: "Losing touch with your own culture while not feeling part of the new one. This tends to be the most isolating position.",
        },
      ],
      berryNote:
        "These are not fixed personality types. People may use different strategies at work and at home, and the options open to them depend partly on how welcoming the host society is.³",
      leaderHeading: "For leaders supporting a team",
      leaderItems: [
        {
          title: "Name it early",
          text: "Talk about culture stress in onboarding and in regular check-ins, so people know it is common and feel free to mention it.",
        },
        {
          title: "Reduce avoidable ambiguity",
          text: "Written expectations, a named buddy and a clear plan for the first ninety days remove some of the guesswork.",
        },
        {
          title: "Make time for learning",
          text: "Protect time for language and culture learning within working hours, rather than expecting it to happen in the evenings.",
        },
        {
          title: "Include families and local staff",
          text: "A partner's adjustment affects the whole assignment.⁹ Local colleagues who adapt to newcomers, or who have moved region themselves, carry strain too.",
        },
        {
          title: "Use a wider care structure",
          text: "Kelly O'Donnell's member-care framework describes care at several levels: self and mutual care, care from the sending organisation, specialist care and wider networks.¹³ A leader does not need to provide all of it alone.",
        },
      ],
      returnTitle: "A note on returning",
      returnPre:
        "Many people feel a similar strain when they go back to their home country, often called reverse culture shock. Home has changed, and so have they. That experience has its own module: ",
      returnLabel: "Returning Well",
      returnHref: "/resources/returning-well",
      returnPost: ". For change and transition more broadly, see ",
      transLabel: "Healthy Transitions",
      transHref: "/resources/healthy-transitions",
      returnEnd: ".",
    },
    faith: {
      eyebrow: "Faith Anchor",
      heading: "Settling in a place that is not home",
      paras: [
        "When the people of Judah were taken into exile in Babylon, the prophet Jeremiah sent them a letter. He told them to build houses, plant gardens, raise families and seek the welfare of the city where they now lived. It was practical counsel for people living by someone else's rules: settle, learn and contribute.",
        "The same exile is remembered in Psalm 137, where the people ask how they can sing the Lord's song in a foreign land. Scripture keeps both of these together. Seeking the good of a new place and grieving what has been lost both belong to a faithful response, and the lament is allowed to be spoken out loud.",
        "For anyone feeling the weight of a new culture, that is an encouragement. Struggle in an unfamiliar place does not mean failure, and God is present in the slow work of settling.",
      ],
      refs: ["Jeremiah 29:4-7", "Psalm 137:4"],
    },
    reflection: {
      eyebrow: "For Reflection",
      heading: "Questions to sit with",
      items: [
        "Which unwritten rules around me still take effort to read?",
        "Which of my current stressors could I change, which could I learn, and which do I need support to endure?",
        "Who is my host-culture friend, and who shares my home culture? If one of them is missing, what small step could I take?",
        "If I lead others, who on my team might be under strain that is easy to miss?",
      ],
    },
    finalWord: {
      eyebrow: "A Final Word",
      heading: "Adjusting takes time, and the effort is real",
      paras: [
        "Culture stress is the cost of doing ordinary things in an unfamiliar setting. Naming it can make it easier to bear and easier to talk about, both for you and for the people you lead.",
        "The communication scholar Young Yun Kim describes adaptation as a cycle in which stress pushes us to adjust, and adjustment can lead to growth, often with steps back along the way.¹¹ Growth is possible but not guaranteed. It tends to come through learning, support and rest, more than through willpower alone.",
      ],
    },
    takeaways: {
      eyebrow: "Key Takeaways",
      heading: "What to carry forward",
      items: [
        "Culture shock is a sharper period of disorientation. Culture stress is the ongoing strain of living by rules that are not yours. Both are normal responses to a demanding situation.",
        "It builds quietly. Many small acts of interpreting add up, especially when there is little time to recover.",
        "There is no single curve. The U-curve fits some people and many follow other patterns, so it helps to learn your own.",
        "Sort your stressors into what you can change, what you can learn and what you need support to endure, and respond to each in its own way.",
        "Leaders can lighten the load by naming it, reducing ambiguity, making time to learn and including families and local staff. If symptoms persist or are severe, a doctor or counsellor can help.",
      ],
    },
    dig: {
      eyebrow: "Dig Deeper",
      heading: "For those who want to go further",
      panels: [
        {
          id: "two-tracks",
          title: "Two kinds of adjustment",
          paras: [
            "Wendy Searle and Colleen Ward distinguished two kinds of adjustment during a move between cultures.⁸ Psychological adjustment is about wellbeing: how content, calm and settled a person feels. Sociocultural adjustment is about skill: how well a person handles the practical and social demands of daily life.",
            "The two are related but predicted by different things. Personality, coping and support matter more for the first, while language, contact with local people and time matter more for the second. A person can manage daily tasks well and still feel low, or feel fairly content while still making many cultural mistakes. Checking both gives a fuller picture of how someone is doing.",
          ],
        },
        {
          id: "predictors",
          title: "What predicts smoother adjustment",
          paras: [
            "A meta-analysis by Bhaskar-Shrinivas and colleagues combined 66 studies covering 8,474 people on international assignments.⁹ Factors such as confidence in one's own abilities, interaction with people from the host country, family support and the size of the cultural gap were linked with adjustment. In this research, these factors stood out more than demographic ones such as age.",
            "This is useful for organisations, because many of these factors can be strengthened through preparation, team design and steady support rather than left to chance.",
          ],
        },
        {
          id: "allostatic",
          title: "Allostatic load as an analogy",
          paras: [
            "Bruce McEwen and Eliot Stellar used the term allostatic load for the wear on the body that comes from repeated or prolonged stress responses.¹² The idea is that the body adapts well to short challenges, and the cost comes when demands keep returning without enough recovery.",
            "In this module the idea is used only as an analogy for why many small daily efforts can add up. It is not a claim that culture stress has been measured as a specific bodily effect.",
          ],
        },
        {
          id: "growth",
          title: "Stress, adaptation and growth",
          paras: [
            "Young Yun Kim's theory of cross-cultural adaptation describes a repeating pattern she calls stress, adaptation and growth.¹¹ Stress unsettles a person, which prompts them to adjust, and over time those adjustments can lead to a wider and more flexible sense of self. She describes the movement as drawing back in order to leap forward.",
            "The theory offers a hopeful frame without promising an easy road. Steps back are part of the pattern, and growth depends on ongoing contact, learning and support.",
          ],
        },
        {
          id: "u-curve",
          title: "The U-curve on trial",
          paras: [
            "The U-curve became popular because it was simple and easy to remember. When Colleen Ward and colleagues followed students over the course of a transition to test it directly, they did not find the predicted U-shape.⁶ The much larger study by Demes and Geeraert later found many different patterns rather than one shared curve.⁵",
            "For leaders, the practical point is to avoid telling people what they should be feeling at a given month. Asking how someone is doing, and listening, is more reliable than any timetable.",
          ],
        },
        {
          id: "strangers",
          title: "Strangers and foreigners",
          paras: [
            "The letter to the Hebrews describes people of faith as strangers and foreigners on the earth, looking for a homeland (Hebrews 11:13-16). For those living far from home, this can be a quiet reminder that belonging is about more than place, and that feeling like an outsider has a long history among God's people.",
          ],
        },
      ],
    },
    sourcesList: [
      "Oberg, K. (1960). Cultural shock: Adjustment to new cultural environments. Practical Anthropology, 7(4), 177-182.",
      "Ward, C., Bochner, S., & Furnham, A. (2001). The Psychology of Culture Shock (2nd ed.). Routledge.",
      "Berry, J. W. (1997). Immigration, acculturation, and adaptation. Applied Psychology, 46(1), 5-34. https://doi.org/10.1111/j.1464-0597.1997.tb01087.x",
      "Lazarus, R. S., & Folkman, S. (1984). Stress, Appraisal, and Coping. Springer.",
      "Demes, K. A., & Geeraert, N. (2015). The highs and lows of a cultural transition: A longitudinal analysis of sojourner stress and adaptation across 50 countries. Journal of Personality and Social Psychology, 109(2), 316-337. https://doi.org/10.1037/pspp0000046",
      "Ward, C., Okura, Y., Kennedy, A., & Kojima, T. (1998). The U-curve on trial: A longitudinal study of psychological and sociocultural adjustment during cross-cultural transition. International Journal of Intercultural Relations, 22(3), 277-291.",
      "Doki, S., Sasahara, S., & Matsuzaki, I. (2018). Stress of working abroad: A systematic review. International Archives of Occupational and Environmental Health, 91(7), 767-784. https://doi.org/10.1007/s00420-018-1333-4",
      "Searle, W., & Ward, C. (1990). The prediction of psychological and sociocultural adjustment during cross-cultural transitions. International Journal of Intercultural Relations, 14(4), 449-464.",
      "Bhaskar-Shrinivas, P., Harrison, D. A., Shaffer, M. A., & Luk, D. M. (2005). Input-based and time-based models of international adjustment: Meta-analytic evidence and theoretical extensions. Academy of Management Journal, 48(2), 257-281.",
      "Sonnentag, S. (2012). Psychological detachment from work during leisure time: The benefits of mentally disengaging from work. Current Directions in Psychological Science, 21(2), 114-118.",
      "Kim, Y. Y. (2001). Becoming Intercultural: An Integrative Theory of Communication and Cross-Cultural Adaptation. SAGE.",
      "McEwen, B. S., & Stellar, E. (1993). Stress and the individual: Mechanisms leading to disease. Archives of Internal Medicine, 153, 2093-2101. https://pubmed.ncbi.nlm.nih.gov/8379800/",
      "O'Donnell, K. (Ed.). (2002). Doing Member Care Well: Perspectives and Practices from Around the World. William Carey Library.",
    ],
  },
};

// -- Shared styles ------------------------------------------------------------
const eyebrowStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: orange,
  marginBottom: 24,
};

const h2Style: React.CSSProperties = {
  fontFamily: serif,
  fontSize: "clamp(28px, 3.5vw, 42px)",
  fontWeight: 700,
  color: navy,
  fontStyle: "italic",
  lineHeight: 1.18,
  marginBottom: 32,
};

const h3Style: React.CSSProperties = {
  fontFamily: serif,
  fontSize: "clamp(22px, 2.6vw, 30px)",
  fontWeight: 700,
  color: navy,
  lineHeight: 1.2,
  marginTop: 56,
  marginBottom: 20,
};

const bodyStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "clamp(16px, 1.9vw, 19px)",
  color: bodyText,
  lineHeight: 1.9,
  marginBottom: 24,
};

const smallBody: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 15,
  color: bodyText,
  lineHeight: 1.75,
  margin: 0,
};

const cardTitle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: 15,
  fontWeight: 700,
  color: navy,
  marginBottom: 8,
  lineHeight: 1.4,
};

const linkStyle: React.CSSProperties = {
  color: navy,
  fontWeight: 700,
  textDecoration: "underline",
  textUnderlineOffset: 3,
};

function Section({
  bg,
  id,
  children,
}: {
  bg: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} style={{ background: bg, padding: "88px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>{children}</div>
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      aria-hidden="true"
      style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s" }}
    >
      <polyline points="6 9 12 15 18 9" fill="none" stroke={orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// -- Component ------------------------------------------------------------------
export default function CultureShockStressClient({ isSaved }: { isSaved: boolean }) {
  // English only for now: render EN regardless of the site language setting.
  const c = CONTENT.en;

  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [openAbc, setOpenAbc] = useState<Record<string, boolean>>({});
  const [openDig, setOpenDig] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  };

  return (
    <div style={{ fontFamily: sans, background: offWhite, minHeight: "100vh" }}>
      <style>{`
        .css-table { width: 100%; border-collapse: collapse; background: #ffffff; border: 1px solid ${cardBorder}; border-radius: 6px; overflow: hidden; }
        .css-table th, .css-table td { padding: 14px 16px; text-align: left; vertical-align: top; font-family: ${sans}; font-size: 14px; line-height: 1.6; border-bottom: 1px solid ${cardBorder}; }
        .css-table thead th { background: ${navy}; color: ${offWhite}; font-weight: 700; font-size: 13px; letter-spacing: 0.02em; }
        .css-table tbody th { color: ${navy}; font-weight: 700; width: 18%; }
        .css-table td { color: ${bodyText}; }
        .css-grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .css-grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        @media (max-width: 760px) {
          .css-grid-3 { grid-template-columns: 1fr; }
          .css-table thead { display: none; }
          .css-table, .css-table tbody, .css-table tr, .css-table th, .css-table td { display: block; width: 100%; }
          .css-table tr { border-bottom: 2px solid ${cardBorder}; padding: 8px 0; }
          .css-table tbody th { background: ${calloutBg}; border-bottom: none; width: 100%; }
          .css-table td { border-bottom: none; padding: 8px 16px; }
          .css-table td::before { content: attr(data-label); display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.10em; text-transform: uppercase; color: ${mutedOnGray}; margin-bottom: 2px; }
        }
        @media (max-width: 600px) {
          .css-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* -- Hero (plain navy band, no image) ------------------------------- */}
      <section style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrowStyle}>{c.hero.eyebrow}</p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: 600,
              color: offWhite,
              lineHeight: 1.08,
              marginBottom: 20,
            }}
          >
            {c.hero.title}
          </h1>
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "clamp(17px, 2vw, 21px)",
              color: "oklch(72% 0.04 260)",
              lineHeight: 1.5,
              marginBottom: 32,
              maxWidth: 640,
            }}
          >
            {c.hero.subtitle}
          </p>
          <div style={{ width: 48, height: 1, background: orange, marginBottom: 32 }} />
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "clamp(16px, 1.8vw, 19px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.8,
              maxWidth: 620,
              marginBottom: 40,
            }}
          >
            {c.hero.intro}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={saved || isPending}
            aria-pressed={saved}
            aria-label={saved ? c.hero.savedAria : c.hero.saveAria}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              minHeight: 44,
              padding: "10px 24px",
              border: "none",
              cursor: saved ? "default" : "pointer",
              fontFamily: sans,
              fontSize: 13,
              fontWeight: 700,
              background: saved ? "oklch(35% 0.05 260)" : orange,
              color: offWhite,
              letterSpacing: "0.04em",
              borderRadius: 4,
            }}
          >
            <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
              <path
                d="M6 3h12v18l-6-4.5L6 21z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {saved ? c.hero.saved : c.hero.save}
          </button>
        </div>
      </section>

      {/* -- Objectives ------------------------------------------------------- */}
      <Section bg={lightGray}>
        <p style={eyebrowStyle}>{c.objectives.eyebrow}</p>
        <h2 style={h2Style}>{c.objectives.heading}</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
          {c.objectives.items.map((item, i) => (
            <li key={i} style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <span style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, color: orange, minWidth: 22 }}>{i + 1}</span>
              <span style={{ ...smallBody, fontSize: 16 }}>{item}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* -- The two terms ---------------------------------------------------- */}
      <Section bg={offWhite} id="two-terms">
        <p style={eyebrowStyle}>{c.terms.eyebrow}</p>
        <h2 style={h2Style}>{c.terms.heading}</h2>
        {c.terms.paras.map((p, i) => (
          <p key={i} style={bodyStyle}>
            {cite(p)}
          </p>
        ))}
        <div className="css-grid-2" style={{ margin: "16px 0 32px" }}>
          {c.terms.cards.map((card) => (
            <div key={card.term} style={{ background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6, padding: "24px 24px" }}>
              <p style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, fontStyle: "italic", color: navy, marginBottom: 10 }}>{card.term}</p>
              <p style={smallBody}>{card.text}</p>
            </div>
          ))}
        </div>
        <p style={{ ...bodyStyle, marginBottom: 0 }}>{c.terms.closing}</p>
      </Section>

      {/* -- Why it builds up ------------------------------------------------- */}
      <Section bg={lightGray} id="builds-up">
        <p style={eyebrowStyle}>{c.buildup.eyebrow}</p>
        <h2 style={h2Style}>{c.buildup.heading}</h2>
        {c.buildup.paras.map((p, i) => (
          <p key={i} style={bodyStyle}>
            {cite(p)}
          </p>
        ))}
        <div style={{ background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "28px 28px" }}>
          <p style={{ ...cardTitle, fontSize: 16 }}>{c.buildup.factorsTitle}</p>
          <p style={{ ...smallBody, marginBottom: 14 }}>{cite(c.buildup.factorsIntro)}</p>
          <ul style={{ margin: "0 0 14px", paddingLeft: 20, display: "grid", gap: 6 }}>
            {c.buildup.factors.map((f) => (
              <li key={f} style={smallBody}>
                {f}
              </li>
            ))}
          </ul>
          <p style={{ ...smallBody, color: mutedOnGray }}>{c.buildup.factorsNote}</p>
        </div>
      </Section>

      {/* -- ABC model (the one interaction: expandable cards) ---------------- */}
      <Section bg={offWhite} id="abc-model">
        <p style={eyebrowStyle}>{c.abc.eyebrow}</p>
        <h2 style={h2Style}>{c.abc.heading}</h2>
        <p style={bodyStyle}>{cite(c.abc.intro)}</p>
        <div style={{ display: "grid", gap: 14, marginBottom: 32 }}>
          {c.abc.cards.map((card) => {
            const open = !!openAbc[card.id];
            const panelId = `css-abc-${card.id}`;
            return (
              <div key={card.id} style={{ background: "#ffffff", border: `1px solid ${open ? orange : cardBorder}`, borderRadius: 6, transition: "border-color 0.2s" }}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenAbc((s) => ({ ...s, [card.id]: !s[card.id] }))}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "20px 22px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: serif,
                      fontSize: 34,
                      fontWeight: 700,
                      color: orange,
                      lineHeight: 1,
                      minWidth: 30,
                    }}
                  >
                    {card.letter}
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: sans, fontSize: 16, fontWeight: 700, color: navy, marginBottom: 4 }}>{card.title}</span>
                    <span style={{ display: "block", fontFamily: sans, fontSize: 14, color: bodyText, lineHeight: 1.6 }}>{card.summary}</span>
                  </span>
                  <Chevron open={open} />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-label={card.title}
                  style={{
                    display: "grid",
                    gridTemplateRows: open ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.3s ease",
                  }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <div style={{ padding: "0 22px 24px 70px", boxSizing: "border-box" }}>
                      {card.paras.map((p, i) => (
                        <p key={i} style={{ ...smallBody, marginBottom: 14 }}>
                          {cite(p)}
                        </p>
                      ))}
                      <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: mutedOnGray, margin: "18px 0 8px" }}>
                        {card.signsLabel}
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
                        {card.signs.map((s) => (
                          <li key={s} style={smallBody}>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "22px 24px" }}>
          <p style={{ ...cardTitle, marginBottom: 6 }}>{c.abc.referTitle}</p>
          <p style={smallBody}>
            {c.abc.referText}
            <a href={c.abc.referLinkHref} target="_blank" rel="noopener noreferrer" style={linkStyle}>
              {c.abc.referLinkLabel}
            </a>
            {c.abc.referAfter}
            <Link href={c.abc.referModuleHref} style={linkStyle}>
              {c.abc.referModuleLabel}
            </Link>
            {c.abc.referEnd}
          </p>
        </div>
      </Section>

      {/* -- Comparison table -------------------------------------------------- */}
      <Section bg={lightGray} id="telling-apart">
        <p style={eyebrowStyle}>{c.compare.eyebrow}</p>
        <h2 style={h2Style}>{c.compare.heading}</h2>
        <p style={bodyStyle}>{c.compare.intro}</p>
        <table className="css-table">
          <thead>
            <tr>
              <th scope="col">
                <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Aspect</span>
              </th>
              {c.compare.columns.map((col) => (
                <th key={col} scope="col">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.compare.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.cells.map((cell, i) => (
                  <td key={i} data-label={c.compare.columns[i]}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ ...smallBody, color: mutedOnGray, marginTop: 20 }}>
          {c.compare.notePre}
          {c.compare.links.map((l, i) => (
            <React.Fragment key={l.href}>
              {i > 0 && " and "}
              <Link href={l.href} style={linkStyle}>
                {l.label}
              </Link>
            </React.Fragment>
          ))}
          {c.compare.notePost}
        </p>
      </Section>

      {/* -- Sources of stress and signs ---------------------------------------- */}
      <Section bg={offWhite} id="sources-of-stress">
        <p style={eyebrowStyle}>{c.sources.eyebrow}</p>
        <h2 style={h2Style}>{c.sources.heading}</h2>
        <p style={bodyStyle}>{cite(c.sources.intro)}</p>
        <div className="css-grid-3">
          {c.sources.stressors.map((s) => (
            <div key={s.title} style={{ background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6, padding: "20px 20px" }}>
              <p style={cardTitle}>{s.title}</p>
              <p style={{ ...smallBody, fontSize: 14 }}>{cite(s.text)}</p>
            </div>
          ))}
        </div>
        <h3 style={h3Style}>{c.sources.signsHeading}</h3>
        <p style={bodyStyle}>{c.sources.signsIntro}</p>
        <div className="css-grid-2">
          {c.sources.signAreas.map((a) => (
            <div key={a.area} style={{ background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "20px 22px" }}>
              <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: navy, marginBottom: 10 }}>{a.area}</p>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                {a.items.map((it) => (
                  <li key={it} style={{ ...smallBody, fontSize: 14 }}>
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* -- Misunderstandings ------------------------------------------------- */}
      <Section bg={lightGray} id="misunderstandings">
        <p style={eyebrowStyle}>{c.myths.eyebrow}</p>
        <h2 style={h2Style}>{c.myths.heading}</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {c.myths.items.map((m) => (
            <div key={m.myth} style={{ background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6, padding: "22px 24px" }}>
              <p style={{ fontFamily: serif, fontSize: 22, fontStyle: "italic", fontWeight: 700, color: navy, marginBottom: 8 }}>&ldquo;{m.myth}&rdquo;</p>
              <p style={smallBody}>{cite(m.text)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* -- What helps -------------------------------------------------------- */}
      <Section bg={offWhite} id="what-helps">
        <p style={eyebrowStyle}>{c.helps.eyebrow}</p>
        <h2 style={h2Style}>{c.helps.heading}</h2>
        <p style={bodyStyle}>{c.helps.intro}</p>

        <h3 style={{ ...h3Style, marginTop: 24 }}>{c.helps.selfHeading}</h3>
        <div style={{ display: "grid", gap: 16 }}>
          {c.helps.selfItems.map((item, i) => (
            <div key={item.title} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <span style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: navy, minWidth: 26, lineHeight: 1.2 }}>{i + 1}</span>
              <div>
                <p style={cardTitle}>{item.title}</p>
                <p style={smallBody}>{cite(item.text)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "26px 26px", marginTop: 36 }}>
          <p style={{ ...cardTitle, fontSize: 16 }}>{c.helps.decodeTitle}</p>
          <p style={{ ...smallBody, marginBottom: 16 }}>{c.helps.decodeIntro}</p>
          <ol className="css-grid-2" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {c.helps.decodeSteps.map((s, i) => (
              <li key={s} style={{ background: "#ffffff", border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "12px 16px", display: "flex", gap: 12, alignItems: "baseline" }}>
                <span style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, color: navy }}>{i + 1}</span>
                <span style={{ ...smallBody, fontSize: 14 }}>{s}</span>
              </li>
            ))}
          </ol>
        </div>

        <h3 style={h3Style}>{c.helps.berryHeading}</h3>
        <p style={bodyStyle}>{cite(c.helps.berryIntro)}</p>
        <div className="css-grid-2">
          {c.helps.berry.map((b) => (
            <div key={b.name} style={{ background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6, padding: "20px 22px" }}>
              <p style={{ fontFamily: serif, fontSize: 22, fontWeight: 700, fontStyle: "italic", color: navy, marginBottom: 6 }}>{b.name}</p>
              <p style={{ ...smallBody, fontSize: 14 }}>{b.text}</p>
            </div>
          ))}
        </div>
        <p style={{ ...smallBody, color: mutedOnGray, marginTop: 16 }}>{cite(c.helps.berryNote)}</p>

        <h3 style={h3Style}>{c.helps.leaderHeading}</h3>
        <div style={{ display: "grid", gap: 16 }}>
          {c.helps.leaderItems.map((item, i) => (
            <div key={item.title} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <span style={{ fontFamily: serif, fontSize: 26, fontWeight: 700, color: navy, minWidth: 26, lineHeight: 1.2 }}>{i + 1}</span>
              <div>
                <p style={cardTitle}>{item.title}</p>
                <p style={smallBody}>{cite(item.text)}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: calloutBg, border: `1px solid ${calloutBorder}`, borderRadius: 6, padding: "22px 24px", marginTop: 40 }}>
          <p style={{ ...cardTitle, marginBottom: 6 }}>{c.helps.returnTitle}</p>
          <p style={smallBody}>
            {c.helps.returnPre}
            <Link href={c.helps.returnHref} style={linkStyle}>
              {c.helps.returnLabel}
            </Link>
            {c.helps.returnPost}
            <Link href={c.helps.transHref} style={linkStyle}>
              {c.helps.transLabel}
            </Link>
            {c.helps.returnEnd}
          </p>
        </div>
      </Section>

      {/* -- Faith Anchor ------------------------------------------------------- */}
      <section id="faith-anchor" style={{ background: navy, padding: "88px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
              <path d="M12 3v18M6 9h12" fill="none" stroke={orange} strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <p style={{ ...eyebrowStyle, marginBottom: 0 }}>{c.faith.eyebrow}</p>
          </div>
          <h2 style={{ ...h2Style, color: offWhite }}>{c.faith.heading}</h2>
          {c.faith.paras.map((p, i) => (
            <p key={i} style={{ fontFamily: sans, fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(82% 0.025 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {p}
            </p>
          ))}
          <p style={{ fontFamily: sans, fontSize: 12, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "oklch(72% 0.04 260)", marginTop: 28 }}>
            {c.faith.refs.join("  ·  ")}
          </p>
        </div>
      </section>

      {/* -- Reflection --------------------------------------------------------- */}
      <Section bg={offWhite} id="reflection">
        <p style={eyebrowStyle}>{c.reflection.eyebrow}</p>
        <h2 style={h2Style}>{c.reflection.heading}</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {c.reflection.items.map((q) => (
            <p key={q} style={{ fontFamily: serif, fontSize: "clamp(19px, 2.2vw, 23px)", fontStyle: "italic", color: navy, lineHeight: 1.5, margin: 0, padding: "16px 22px", background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6 }}>
              {q}
            </p>
          ))}
        </div>
      </Section>

      {/* -- A Final Word ------------------------------------------------------- */}
      <Section bg={lightGray} id="final-word">
        <p style={eyebrowStyle}>{c.finalWord.eyebrow}</p>
        <h2 style={h2Style}>{c.finalWord.heading}</h2>
        {c.finalWord.paras.map((p, i) => (
          <p key={i} style={i === c.finalWord.paras.length - 1 ? { ...bodyStyle, marginBottom: 0 } : bodyStyle}>
            {cite(p)}
          </p>
        ))}
      </Section>

      {/* -- Key Takeaways ------------------------------------------------------ */}
      <section id="key-takeaways" style={{ background: offWhite, padding: "96px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={eyebrowStyle}>{c.takeaways.eyebrow}</p>
          <h2 style={h2Style}>{c.takeaways.heading}</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {c.takeaways.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: lightGray, border: `1px solid ${cardBorder}`, borderRadius: 6, padding: "22px 24px" }}>
                <span style={{ fontFamily: serif, fontSize: 34, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 30 }}>{i + 1}</span>
                <p style={{ ...smallBody, fontSize: 16, color: navy }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Dig Deeper --------------------------------------------------------- */}
      <Section bg={lightGray} id="dig-deeper">
        <p style={eyebrowStyle}>{c.dig.eyebrow}</p>
        <h2 style={h2Style}>{c.dig.heading}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {c.dig.panels.map((panel) => {
            const open = !!openDig[panel.id];
            const panelId = `css-dig-${panel.id}`;
            return (
              <div key={panel.id} style={{ background: "#ffffff", border: `1px solid ${cardBorder}`, borderRadius: 6 }}>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenDig((s) => ({ ...s, [panel.id]: !s[panel.id] }))}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    padding: "18px 22px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: sans,
                    fontSize: 15,
                    fontWeight: 700,
                    color: navy,
                  }}
                >
                  <span>{panel.title}</span>
                  <Chevron open={open} />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-label={panel.title}
                  style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease" }}
                >
                  <div style={{ overflow: "hidden", minHeight: 0 }}>
                    <div style={{ padding: "0 22px 22px", boxSizing: "border-box" }}>
                      {panel.paras.map((p, i) => (
                        <p key={i} style={{ ...smallBody, marginBottom: i === panel.paras.length - 1 ? 0 : 14 }}>
                          {cite(p)}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* -- Sources ------------------------------------------------------------ */}
      <SourcesDropdown lang="en" markerStyle="number" background={offWhite} sources={c.sourcesList} />
    </div>
  );
}
