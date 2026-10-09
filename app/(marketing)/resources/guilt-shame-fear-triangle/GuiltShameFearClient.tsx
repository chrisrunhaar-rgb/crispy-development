"use client";

import React, { useState, useTransition } from "react";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

// -- Tokens ------------------------------------------------------------------
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

const SLUG = "guilt-shame-fear-triangle";

// -- Content (EN only for now; an `id` block can be added later) --------------
type LensKey = "guilt" | "shame" | "fear";

interface Lens {
  key: LensKey;
  tab: string;
  pair: string;
  sections: { heading: string; body: string }[];
}

const CONTENT = {
  en: {
    hero: {
      eyebrow: "Cross-Cultural Leadership · Guide",
      title: "The Guilt, Shame and Fear Triangle",
      subtitle: "How cultures handle wrongdoing, and what that means for leaders",
      intro:
        "Every group carries a quiet answer to two questions: what happens when someone does wrong, and what puts it right? This guide explains three common answers, how they mix inside every culture, and how leaders can work with all of them.",
      save: "Save to Dashboard",
      saved: "Saved to Dashboard",
    },
    objectives: {
      title: "By the end of this module you will be able to",
      items: [
        "Describe the three orientations of guilt and innocence, shame and honour, and fear and power.",
        "Distinguish what each orientation treats as wrong and what it treats as putting things right.",
        "Recognise how a mix of the three shapes the way people respond to mistakes, correction and apology.",
        "Explain why the model is a lens for asking better questions and not a label for nations or people.",
      ],
    },
    what: {
      eyebrow: "What Is It",
      title: "Three ways of answering the same question",
      paras: [
        "When something goes wrong in a family, a church or a workplace, people feel it before they think about it. One person feels the weight of a broken rule. Another feels exposed in front of the people whose respect they need. A third feels unsafe, as if someone stronger may now turn against them. Most people know all of these reactions from the inside, even if one tends to come first.",
        "Writers in mission and intercultural studies have grouped these reactions into three pairs: guilt and innocence, shame and honour, and fear and power.¹ Each pair describes a whole way of seeing right and wrong. It shapes what a person notices first after a mistake, what they expect to happen next and what they believe will restore things.",
        "Jayson Georges and Mark Baker, who use the same three pairs, stress that societies generally hold elements of each, usually with one more prominent than the others.²,³ A culture can lean strongly toward one pair while still drawing on the other two in daily life. A single person can also move between them depending on the setting, for example the written rules of a workplace, the reputation of a family or the authority of a powerful manager.",
        "This module treats the triangle as a lens. It is a practitioner framework that grew out of mission work, and it has not been tested as a scientific model in the way a personality measure would be.¹,³ Its value lies in the questions it helps a leader ask and in the shared vocabulary it gives a team for talking about how mistakes feel.",
      ],
      quote:
        "The triangle describes tendencies inside groups. It cannot tell you what a particular person feels, and it works poorly as a tool for sorting people.",
    },
    model: {
      eyebrow: "The Model",
      title: "The three pairs at a glance",
      intro:
        "Each pair joins a problem to its remedy. The first word names what goes wrong. The second names the condition people want to reach or return to.",
      cards: [
        {
          pair: "Guilt and innocence",
          body: "Wrongdoing is seen as breaking a rule, a law or a promise. The person responsible carries guilt, which works like a debt. Innocence is being clear before the standard again, either because no rule was broken or because the debt has been dealt with through admission, fair process, repayment or forgiveness.",
        },
        {
          pair: "Shame and honour",
          body: "Wrongdoing is seen as damage to a person's standing in the group. Shame is the loss of worth in the eyes of people who matter, and it can spread to a family or team. Honour is worth that others recognise. It returns through reconciliation, the help of a respected go-between or a gesture that gives face back.",
        },
        {
          pair: "Fear and power",
          body: "Wrongdoing is seen as offending, or being exposed to, a power that can do harm. That power may be an employer, an elder, a government or, in many traditions, an unseen spiritual force. Power in this pair means the strength and protection that keep a person safe. It returns through protection, reassurance or the help of someone stronger.",
        },
      ],
      termsTitle: "The key words in plain language",
      terms: [
        {
          term: "Innocence",
          body: "In this model innocence means a clean record before a standard. It is about a person's status in relation to the rules. It has little to do with being naive or inexperienced.",
        },
        {
          term: "Honour",
          body: "Honour is worth that a community recognises and confirms. Because others grant it, it is public and often shared. A person may carry the honour of a family, a congregation or an organisation, and what they do can raise or lower it.",
        },
        {
          term: "Power",
          body: "Power here means the capacity to protect, to provide or to harm. People with a strong fear and power orientation pay close attention to who holds that capacity and how to stay safe in relation to it.",
        },
      ],
      fourthTitle: "A possible fourth pair",
      fourth:
        "Some writers add a fourth pair, impurity and purity. In this view wrongdoing is felt as becoming unclean or defiled, and the remedy is cleansing. It tends to appear where ideas of clean and unclean carry moral weight. This module stays with the three pairs that are more widely used in leadership settings, and returns to cleansing briefly in the Faith Anchor.",
    },
    lenses: {
      eyebrow: "Three Lenses",
      title: "Each orientation up close",
      intro:
        "Choose a lens to read about it. All three use the same headings, so you can switch between them and compare.",
      items: [
        {
          key: "guilt",
          tab: "Guilt",
          pair: "Guilt and innocence",
          sections: [
            {
              heading: "Core concern",
              body: "The main question is whether a standard has been kept or broken. Attention goes to the act itself: what was done, which rule it broke and what is now owed. Clear rules, written agreements and fair procedures carry moral weight.",
            },
            {
              heading: "When something goes wrong",
              body: "The person responsible is expected to admit it, take responsibility and accept a fair consequence. Psychologists who study guilt describe it as a focus on behaviour, roughly “I did a bad thing”.⁴ In mostly Western studies, people who tend toward guilt are more likely to feel concern for those they affected and to try to repair the harm.⁵",
            },
            {
              heading: "What puts it right",
              body: "Admission, a fair hearing, a proportionate consequence, making amends and forgiveness. Once the debt is settled the matter can be closed, and the person can start again with a clean record.",
            },
            {
              heading: "Where it shows up at work",
              body: "Codes of conduct, performance reviews, written warnings and formal grievance processes. A manager with this orientation may expect people to report their own mistakes promptly, and may hear an apology as an admission of personal responsibility.",
            },
            {
              heading: "Strengths",
              body: "Clarity and consistency, with a sense that the same rules apply to all. It can protect people with little status, because the rule matters more than who broke it.",
            },
            {
              heading: "Blind spots",
              body: "It can become cold or legalistic, treating people as cases to be closed. Damaged relationships may be overlooked once the rule question is settled. It can also underestimate how exposed a person feels when correction happens in front of others.",
            },
          ],
        },
        {
          key: "shame",
          tab: "Shame",
          pair: "Shame and honour",
          sections: [
            {
              heading: "Core concern",
              body: "The main question is where a person stands with the group. Attention goes to relationships, reputation and belonging. Behaviour matters because of what it signals to others and what it does to the shared name of a family, team or community.",
            },
            {
              heading: "When something goes wrong",
              body: "The deepest loss is standing. Psychologists describe shame as a focus on the whole self, roughly “I am bad”, which brings a strong urge to hide.⁴ Researchers point out that this picture comes mainly from Western samples. In other cultural settings shame can serve moral and harmonising purposes, moving people to mend relationships and live up to what the group expects of them.⁸,⁹",
            },
            {
              heading: "What puts it right",
              body: "Restored face and acceptance. This may come through a quiet conversation, a respected go-between, a gesture of humility, a shared meal or a public sign that the person is welcome again. The goal is for the person to rejoin the group with their dignity intact.",
            },
            {
              heading: "Where it shows up at work",
              body: "A preference for private or indirect correction, care about who is present when problems are raised and reluctance to contradict someone senior in front of others. In Indonesia, for example, the word sungkan names a respectful reluctance that can make it uncomfortable to refuse or disagree, and researchers have linked it to people-pleasing behaviour.¹⁸ Similar ideas go by other names in many parts of the world.",
            },
            {
              heading: "Strengths",
              body: "Strong loyalty and care for relationships, with a powerful social reason to behave well. It can shield people from humiliation and hold a group together under strain.",
            },
            {
              heading: "Blind spots",
              body: "Problems may be hidden to protect face, so they grow before anyone names them. Appearance can win over truth. People outside the inner circle may be left with little honour and little recourse.",
            },
          ],
        },
        {
          key: "fear",
          tab: "Fear",
          pair: "Fear and power",
          sections: [
            {
              heading: "Core concern",
              body: "The main question is whether a person is safe in relation to those who hold power. Attention goes to authority, protection, threat and favour. That power may be human, such as an employer or a government, or spiritual, as in traditions where unseen forces are believed to affect health, harvest or success.",
            },
            {
              heading: "When something goes wrong",
              body: "The main feeling is exposure. A mistake may bring punishment, loss of work, loss of protection or harm from a source the person cannot control. The natural response is to keep the problem out of sight, look for cover or try to calm whoever has been offended.",
            },
            {
              heading: "What puts it right",
              body: "Protection, reassurance and a stronger ally. People look for someone with enough influence to cover them, or for an action that restores favour. Fair and predictable use of power lowers the fear over time.",
            },
            {
              heading: "Where it shows up at work",
              body: "Silence in meetings, agreement in public with doubts voiced in private, bad news that arrives late and close attention to the moods of senior people. Fear of retaliation, exclusion or losing a job is a rational part of this orientation, and it can appear in any organisation anywhere in the world.",
            },
            {
              heading: "Strengths",
              body: "Realism about how power works and close attention to risk. People are often deeply loyal to those who protect them. In spiritual settings it takes the unseen world seriously.",
            },
            {
              heading: "Blind spots",
              body: "Fear keeps information hidden, so leaders hear about problems late. It can encourage control from above and suspicion between colleagues. People may comply on the surface without real commitment.",
            },
          ],
        },
      ] as Lens[],
    },
    compare: {
      eyebrow: "Side by Side",
      title: "Comparing the three orientations",
      intro:
        "The table below sets the three pairs next to each other. Each row is a tendency, and real people and groups combine elements from all three columns.",
      columns: ["Guilt and innocence", "Shame and honour", "Fear and power"],
      rows: [
        {
          label: "Core question",
          cells: [
            "Have I kept or broken the standard?",
            "How do I stand with the people who matter?",
            "Am I safe with those who hold power?",
          ],
        },
        {
          label: "Source of right and wrong",
          cells: [
            "Rules, laws and agreements",
            "The expectations of the group",
            "Those with authority, human or spiritual",
          ],
        },
        {
          label: "What is lost",
          cells: [
            "A clean record; a debt is now owed",
            "Face, respect and belonging",
            "Protection and favour",
          ],
        },
        {
          label: "What restores",
          cells: [
            "Admission, fair process, consequence, forgiveness",
            "Reconciliation, a go-between, welcome back into the group",
            "Protection, appeasement, the help of someone stronger",
          ],
        },
        {
          label: "Typical expectation of a leader",
          cells: [
            "Apply clear rules consistently and fairly",
            "Guard relationships and people's dignity",
            "Use authority predictably and protect people",
          ],
        },
        {
          label: "Possible failure",
          cells: [
            "Legalism and cold justice",
            "Hiding problems; face over truth",
            "Control, silence and suspicion",
          ],
        },
      ],
      after:
        "Read across the rows and each column has its own consistent logic. Friction in mixed teams often comes from people reading the same moment through different columns, each convinced that their own response is simply the right one.",
    },
    background: {
      eyebrow: "Background and Research",
      title: "Where the idea comes from, and its limits",
      paras: [
        "The contrast between guilt and shame has a long history in anthropology. In 1946 Ruth Benedict described Japan as a “shame culture” and the United States as a “guilt culture”.⁶ The labels spread widely. Later scholars criticised the split as too neat, pointing out that both kinds of feeling are present in both societies.⁷",
        "Roland Muller widened the picture in his writing on mission by adding a third pair, fear and power.¹ Jayson Georges later brought the three pairs to a wide Christian audience, and Georges and Baker developed the honour and shame strand in depth.²,³ These writers offer the model as a practical aid for ministry and leadership. It has not been validated as a psychological measure.",
        "Psychology adds a second strand. June Tangney and her colleagues distinguish guilt, a focus on what I did, from shame, a focus on who I am.⁴ In their research, mostly with Western participants, a tendency toward shame was linked with hostility and blaming others, while a tendency toward guilt was linked with empathy and efforts to make things right.⁵",
        "Researchers working across cultures report that these patterns do not transfer neatly. Wong and Tsai describe cultural models in which the value, triggers and effects of shame and guilt differ.⁸ Bedford and Hwang argue that in Chinese culture the two are less sharply separated, and that shame can serve moral purposes.⁹ Daniel Fessler found shame more prominent in Bengkulu, Sumatra, than in California, and later warned that researchers' own cultural background can hide how shame works elsewhere.¹⁰,¹¹",
        "A further point concerns individuals. Leung and Cohen found that people with similar personal traits can behave differently depending on whether their culture runs on the logic of honour, face or dignity.¹² Personality and situation matter alongside culture, so where someone comes from says little about how they will respond in a particular moment.",
      ],
      callout:
        "In short, the triangle is a helpful map drawn by practitioners. Research supports parts of it and questions others. Hold it with an open hand.",
    },
    myths: {
      eyebrow: "Common Misunderstandings",
      title: "What the triangle does not say",
      items: [
        {
          myth: "Western cultures are guilt cultures and Asian cultures are shame cultures.",
          reality:
            "This split goes back to Benedict and has been widely criticised.⁶,⁷ Every society mixes the three, and large regions contain many different cultures.",
        },
        {
          myth: "Guilt is healthy and shame is harmful, wherever you are.",
          reality:
            "That finding comes largely from Western samples. In other settings shame can support moral behaviour and group harmony.⁸,⁹",
        },
        {
          myth: "Groups that lean toward shame and honour lack truth or accountability.",
          reality:
            "They can hold people strongly to account. Accountability is carried mainly through relationships and standing, with less reliance on written rules.",
        },
        {
          myth: "Groups that lean toward guilt and innocence do not use shame.",
          reality:
            "Public exposure, loss of reputation and exclusion are familiar tools in guilt-leaning settings too.",
        },
        {
          myth: "Fear and power is only about spirits and superstition.",
          reality:
            "It also covers the very rational fear of retaliation, losing a job or being pushed out, which can be present in any organisation.",
        },
        {
          myth: "One style of apology is the sincere one.",
          reality:
            "In a study comparing American and Japanese participants, apologies carried different meanings and had different effects on trust.¹⁴ What counts as sincere depends on context.",
        },
        {
          myth: "You can tell a person's orientation from where they come from.",
          reality:
            "Individuals vary a great deal, and people move between orientations depending on the setting.¹²",
        },
      ],
    },
    leaders: {
      eyebrow: "For Leaders",
      title: "Leading a team that holds all three",
      intro:
        "A leader does not need to diagnose each team member. The aim is to build ways of working that make sense across the three orientations, so that mistakes come to light early and people can recover from them.",
      practices: [
        {
          title: "Separate the act from the person",
          body: "Name the behaviour and what needs to change, and leave out labels about character. This draws on the research distinction between guilt and shame.⁴,⁵ Where standing matters a great deal, take equal care to protect the person's public dignity while you address the problem.",
        },
        {
          title: "Agree in advance how mistakes will be handled",
          body: "Early in a team's life, talk about how people want to hear about problems and who should be present. In Amy Edmondson's study of work teams, psychological safety was linked with learning behaviour, which in turn was linked with team performance.¹⁵ Agreeing on the process before anything goes wrong lowers the fear of exposure.",
        },
        {
          title: "Learn what an apology means to the person receiving it",
          body: "For some people an apology mainly admits personal blame. For others it mainly expresses regret and honours the relationship. One laboratory study comparing Americans and Japanese found that apologies carried these different meanings and repaired trust in different ways.¹⁴ The study covered two countries only, so treat it as a reason to ask questions. Where it is appropriate and safe, an apology can do both: acknowledge the harm to the relationship and state clearly what you are responsible for.",
        },
        {
          title: "Offer a private route, then make the facts clear",
          body: "Private conversations or a trusted go-between can protect face and lower fear. In a study across four countries, concern for the other person's face was associated with avoiding and integrating styles of conflict.¹³ Guidance on exactly when to choose private or public routes rests mostly on practitioner experience. Whichever route you use, make sure the facts are eventually stated plainly, so that saving face does not bury the problem.",
        },
        {
          title: "Review what happened instead of searching for someone to blame",
          body: "Michael Frese and Nina Keith argue that preventing errors needs to be paired with managing them well once they happen, so that harm is limited and learning is maximised.¹⁶ A simple review asks what happened, what the team learned and what will change.",
        },
        {
          title: "Use your authority predictably",
          body: "Where fear runs strong, people watch closely how power is used. Consistent responses, kept promises and visible protection for those who raise problems help a team believe that honesty is safe.",
        },
      ],
      noteTitle: "A spoken yes may not mean real agreement",
      note: "Where shame and fear are strong, people may agree in a meeting and voice their doubts elsewhere. A safe channel for disagreement, such as written input after a meeting or short one-to-one conversations, helps you hear what people actually think.",
    },
    faith: {
      eyebrow: "Faith Anchor",
      title: "The gospel speaks to all three",
      intro: [
        "The Bible's first account of human wrongdoing holds all three reactions together. In Genesis 3:7-10 a command has been broken. The man and the woman realise they are naked and cover themselves with fig leaves. When God calls, the man answers, “I was afraid because I was naked; so I hid.” Guilt, shame and fear appear in a single scene, bound together from the beginning.",
        "Scripture describes God's response in language that meets each of them.",
      ],
      items: [
        {
          label: "Guilt and forgiveness",
          ref: "Colossians 2:13-14",
          body: "Where wrongdoing is a debt, the gospel speaks of forgiveness and of being made right with God. Paul writes that the record of charges against us was cancelled and nailed to the cross.",
        },
        {
          label: "Shame and restored honour",
          ref: "Hebrews 12:2; Romans 10:11",
          body: "Where wrongdoing brings disgrace, the gospel speaks of welcome and of a new standing as God's adopted children. Jesus endured the cross, “scorning its shame”, and those who trust in him are promised that they will not be put to shame.",
        },
        {
          label: "Fear and deliverance",
          ref: "Colossians 2:15; 1 John 4:18",
          body: "Where wrongdoing leaves people exposed to hostile powers, the gospel speaks of rescue. The powers and authorities are described as disarmed and put on public display, and John writes that perfect love drives out fear.",
        },
        {
          label: "Impurity and cleansing",
          ref: "1 John 1:9",
          body: "For those who experience wrongdoing as being made unclean, Scripture also speaks of cleansing. When we confess, God forgives and purifies us.",
        },
      ],
      close: [
        "Believers from different backgrounds often feel one of these themes most strongly, and that is natural. Keeping them together gives a fuller account of what God has done in Christ.",
        "For leaders, Matthew 18:15-17 also shows a careful, step-by-step way of handling wrongdoing that begins in private and widens only when it needs to.",
      ],
    },
    reflect: {
      eyebrow: "Reflection",
      title: "Questions to sit with",
      questions: [
        "When you make a mistake, what do you tend to feel first: a broken standard, a loss of face or a sense of being unsafe?",
        "Which orientation was strongest in the family or community you grew up in? Which is strongest in the place you work now?",
        "How do the people you lead usually tell you about problems, and what might that say about how safe they feel?",
        "Which of the three do you find hardest to understand in other people?",
      ],
      finalEyebrow: "A Final Word",
      final:
        "Guilt, shame and fear are part of being human, and each orientation holds real wisdom about rules, relationships and power. A leader who can recognise all three is better placed to hear bad news early, correct with care and help people regain their footing. The triangle will not tell you who someone is. It can help you ask better questions and listen more closely to the answers.",
    },
    takeaways: {
      eyebrow: "Key Takeaways",
      title: "What to carry forward",
      items: [
        "Every group has an unspoken answer to what happens when someone does wrong. Guilt and innocence, shame and honour, and fear and power are three common answers.¹",
        "All cultures mix the three, usually with one more prominent. Individuals vary, and they shift between orientations depending on the setting.³,¹²",
        "The triangle is a practitioner lens. Research on shame and guilt is useful, and much of it rests on Western samples.⁸,¹¹",
        "The same apology can mean “I take the blame” or “I value our relationship”. Ask what the people you lead need from it.¹⁴",
        "Separate the act from the person, protect people's dignity and agree early on how mistakes will be handled.¹⁵",
      ],
    },
    deeper: {
      eyebrow: "Dig Deeper",
      title: "For those who want more",
      panels: [
        {
          title: "The psychology of guilt and shame, and its limits",
          paras: [
            "Tangney and Dearing's work is the main psychological reference on the difference between guilt and shame.⁴ A later review by Tangney, Stuewig and Mashek summarises how these moral emotions relate to behaviour, including the link between shame-proneness and hostility, and between guilt-proneness and empathy.⁵",
            "Fessler argues that when researchers and participants share the same culture, they can miss what they do not know to look for. He uses shame research as his example.¹¹ This is one reason to hold Western findings lightly when leading across cultures.",
          ],
        },
        {
          title: "Face and facework",
          paras: [
            "Face-negotiation theory describes how people manage their own face and the face of others during conflict. A study of 768 people in China, Germany, Japan and the United States found that concern for one's own face was associated with dominating styles of conflict, while concern for the other person's face was associated with avoiding and integrating styles.¹³",
            "Christopher Flanders, writing from experience in Thailand, argues that face is a basic human reality that mission and leadership need to address directly.¹⁷",
          ],
        },
        {
          title: "Honour, face and dignity",
          paras: [
            "Leung and Cohen compare three cultural logics. In a dignity logic, worth is seen as belonging to each person regardless of what others think. In an honour logic, worth is claimed and defended. In a face logic, worth is granted within a social order. Their studies show that the same personal trait can lead to different behaviour depending on which logic surrounds a person.¹²",
            "For leaders, the main lesson is humility about predicting individuals. Culture shapes behaviour, and so do personality and the situation of the moment.",
          ],
        },
        {
          title: "Benedict and the guilt culture versus shame culture debate",
          paras: [
            "Benedict's study of Japan, written during the Second World War without fieldwork in the country, made the guilt and shame contrast famous.⁶ Creighton's later review traces forty years of debate and shows why most scholars no longer use the two labels to describe whole nations.⁷",
          ],
        },
        {
          title: "The three pairs in Christian writing",
          paras: [
            "Muller's short book introduced the three-pair map to many readers.¹ Georges's The 3D Gospel is a brief, readable introduction for practitioners.² Georges and Baker's Ministering in Honor-Shame Cultures goes deeper into Scripture and practice, with a focus on honour and shame.³",
            "These are practitioner works. They are most useful as a source of questions and biblical reflection, alongside the research cautions in this module.",
          ],
        },
        {
          title: "Psychological safety and learning from errors",
          paras: [
            "Edmondson's study of 51 work teams in a manufacturing company found that team psychological safety was associated with learning behaviour, and that learning behaviour helped explain team performance.¹⁵",
            "Frese and Keith's review distinguishes error prevention from error management, the work of limiting harm and learning once an error has happened. They argue that organisations need both.¹⁶",
          ],
        },
      ],
    },
    sources: [
      "Muller, R. (2000/2001). Honor and Shame: Unlocking the Door. Xlibris.",
      "Georges, J. (2017). The 3D Gospel: Ministry in Guilt, Shame, and Fear Cultures. Time Press.",
      "Georges, J., & Baker, M. D. (2016). Ministering in Honor-Shame Cultures: Biblical Foundations and Practical Essentials. IVP Academic. https://ivpress.com/ministering-in-honor-shame-cultures",
      "Tangney, J. P., & Dearing, R. L. (2002). Shame and Guilt. Guilford Press. https://www.guilford.com/books/Shame-and-Guilt/Tangney-Dearing/9781572309876",
      "Tangney, J. P., Stuewig, J., & Mashek, D. J. (2007). Moral emotions and moral behavior. Annual Review of Psychology, 58, 345-372. https://doi.org/10.1146/annurev.psych.56.091103.070145",
      "Benedict, R. (1946). The Chrysanthemum and the Sword: Patterns of Japanese Culture. Houghton Mifflin.",
      "Creighton, M. R. (1990). Revisiting shame and guilt cultures: A forty-year pilgrimage. Ethos, 18, 279-307.",
      "Wong, Y., & Tsai, J. (2007). Cultural models of shame and guilt. In J. L. Tracy, R. W. Robins, & J. P. Tangney (Eds.), The Self-Conscious Emotions: Theory and Research (Ch. 12). Guilford Press.",
      "Bedford, O., & Hwang, K.-K. (2003). Guilt and shame in Chinese culture: A cross-cultural framework from the perspective of morality and identity. Journal for the Theory of Social Behaviour, 33(2), 127-144.",
      "Fessler, D. M. T. (2004). Shame in two cultures: Implications for evolutionary approaches. Journal of Cognition and Culture, 4(2), 207-262.",
      "Fessler, D. M. T. (2010). Cultural congruence between investigators and participants masks the unknown unknowns: Shame research as an example. Behavioral and Brain Sciences, 33(2-3). https://doi.org/10.1017/S0140525X10000087",
      "Leung, A. K.-y., & Cohen, D. (2011). Within- and between-culture variation: Individual differences and the cultural logics of honor, face, and dignity cultures. Journal of Personality and Social Psychology, 100(3), 507-526.",
      "Oetzel, J. G., & Ting-Toomey, S. (2003). Face concerns in interpersonal conflict: A cross-cultural empirical test of the face negotiation theory. Communication Research, 30(6), 599-624.",
      "Maddux, W. W., Kim, P. H., Okumura, T., & Brett, J. M. (2011). Cultural differences in the function and meaning of apologies. International Negotiation, 16, 405-425. https://doi.org/10.1163/157180611X592932",
      "Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly, 44(2), 350-383. https://doi.org/10.2307/2666999",
      "Frese, M., & Keith, N. (2015). Action errors, error management, and learning in organizations. Annual Review of Psychology, 66, 661-687.",
      "Flanders, C. L. (2011). About Face: Rethinking Face for 21st Century Mission. Pickwick Publications.",
      "Hanif, F. D., Oktafiani, R. A., Rachmawati, D. K., & Sasikirana, T. V. (2025). People pleaser behavior within the perspective of sungkan: A psycho-anthropological interpretation. Jurnal Antropologi: Isu-Isu Sosial Budaya, 27(2). https://doi.org/10.25077/jantro.v27.n2.p249-259.2025",
    ],
  },
};

// -- Helpers -----------------------------------------------------------------
const SUP = "¹²³⁴⁵⁶⁷⁸⁹⁰";
const SUP_SPLIT = new RegExp(`([${SUP}]+(?:,[${SUP}]+)*)`);
const SUP_TEST = new RegExp(`^[${SUP}]+(?:,[${SUP}]+)*$`);

function cite(text: string): React.ReactNode {
  const parts = text.split(SUP_SPLIT);
  return (
    <>
      {parts.map((p, i) =>
        SUP_TEST.test(p) ? (
          <span key={i} style={{ color: orange }}>
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

const eyebrowStyle = (color: string = orange): React.CSSProperties => ({
  fontFamily: sans,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color,
  marginBottom: 16,
});

const h2Style = (color: string = navy): React.CSSProperties => ({
  fontFamily: serif,
  fontSize: "clamp(28px, 3.5vw, 42px)",
  fontWeight: 700,
  fontStyle: "italic",
  color,
  lineHeight: 1.2,
  marginBottom: 32,
  textAlign: "left",
});

const pStyle: React.CSSProperties = {
  fontSize: "clamp(16px, 1.9vw, 19px)",
  color: bodyText,
  lineHeight: 1.9,
  marginBottom: 24,
};

const section = (bg: string): React.CSSProperties => ({ background: bg, padding: "88px 24px" });
const inner: React.CSSProperties = { maxWidth: 860, margin: "0 auto" };

function CrossIcon({ color = orange, size = 28 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="10.5" y="2" width="3" height="20" rx="1" fill={color} />
      <rect x="5" y="7" width="14" height="3" rx="1" fill={color} />
    </svg>
  );
}

// -- Component ---------------------------------------------------------------
export default function GuiltShameFearClient({ isSaved }: { isSaved: boolean }) {
  const c = CONTENT.en;
  const [saved, setSaved] = useState(isSaved);
  const [isPending, startTransition] = useTransition();
  const [activeLens, setActiveLens] = useState<LensKey>("guilt");
  const [openPanels, setOpenPanels] = useState<number[]>([]);

  const handleSave = () => {
    if (saved || isPending) return;
    startTransition(async () => {
      const res = await saveResourceToDashboard(SLUG);
      if (!res?.error) setSaved(true);
    });
  };

  const togglePanel = (i: number) =>
    setOpenPanels((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const lens = c.lenses.items.find((l) => l.key === activeLens) ?? c.lenses.items[0];

  return (
    <div style={{ background: offWhite, fontFamily: sans }}>
      <style>{`
        .gsf-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .gsf-tabs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .gsf-lens-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .gsf-row { display: grid; grid-template-columns: 1.1fr repeat(3, 1fr); }
        .gsf-cell { padding: 14px 16px; border-bottom: 1px solid ${lightGray}; }
        .gsf-cell-label { display: none; }
        @media (max-width: 760px) {
          .gsf-cards { grid-template-columns: 1fr; }
          .gsf-lens-grid { grid-template-columns: 1fr; }
          .gsf-row { display: block; border-bottom: 2px solid ${lightGray}; padding: 8px 0; }
          .gsf-row-head { display: none; }
          .gsf-cell { border-bottom: none; padding: 6px 16px; }
          .gsf-cell-label { display: block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${orange}; margin-bottom: 2px; }
          .gsf-rowlabel { font-weight: 700; color: ${navy}; padding-top: 12px; }
        }
        @media (max-width: 420px) {
          .gsf-tabs { gap: 6px; }
        }
      `}</style>

      {/* -- Hero ------------------------------------------------------------ */}
      <section style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.hero.eyebrow}</p>
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
              fontSize: "clamp(20px, 2.6vw, 28px)",
              color: "oklch(72% 0.04 260)",
              lineHeight: 1.4,
              marginBottom: 28,
            }}
          >
            {c.hero.subtitle}
          </p>
          <div style={{ width: 48, height: 3, background: orange, marginBottom: 28 }} />
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "clamp(17px, 2vw, 21px)",
              color: "oklch(82% 0.025 80)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 720,
            }}
          >
            {c.hero.intro}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            aria-pressed={saved}
            aria-label={saved ? c.hero.saved : c.hero.save}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              minHeight: 44,
              padding: "10px 22px",
              background: saved ? "oklch(35% 0.05 260)" : orange,
              color: "white",
              border: "none",
              borderRadius: 4,
              fontFamily: sans,
              fontSize: 14,
              fontWeight: 700,
              cursor: saved ? "default" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M6 3h12v18l-6-4.5L6 21z"
                fill={saved ? "white" : "none"}
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            {saved ? c.hero.saved : c.hero.save}
          </button>
        </div>
      </section>

      {/* -- Objectives ------------------------------------------------------ */}
      <section style={{ background: navy, padding: "0 24px 72px" }}>
        <div style={{ ...inner, borderTop: "1px solid oklch(35% 0.06 260)", paddingTop: 48 }}>
          <p style={eyebrowStyle()}>{c.objectives.title}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
            {c.objectives.items.map((o, i) => (
              <li key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ width: 3, minHeight: 22, background: orange, flexShrink: 0, marginTop: 4 }} />
                <span style={{ color: "oklch(85% 0.02 80)", fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.7 }}>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* -- What is it ------------------------------------------------------ */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.what.eyebrow}</p>
          <h2 style={h2Style()}>{c.what.title}</h2>
          {c.what.paras.map((p, i) => (
            <p key={i} style={pStyle}>
              {cite(p)}
            </p>
          ))}
          <blockquote
            style={{
              fontFamily: serif,
              fontSize: "clamp(19px, 2.2vw, 24px)",
              fontStyle: "italic",
              color: navy,
              borderLeft: `3px solid ${orange}`,
              paddingLeft: 24,
              margin: "40px 0 0",
              lineHeight: 1.5,
            }}
          >
            {c.what.quote}
          </blockquote>
        </div>
      </section>

      {/* -- The model ------------------------------------------------------- */}
      <section style={section(lightGray)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.model.eyebrow}</p>
          <h2 style={h2Style()}>{c.model.title}</h2>
          <p style={pStyle}>{c.model.intro}</p>
          <div className="gsf-cards" style={{ marginBottom: 56 }}>
            {c.model.cards.map((card) => (
              <div key={card.pair} style={{ background: "white", borderRadius: 10, padding: "24px 22px", borderTop: `4px solid ${orange}` }}>
                <h3 style={{ fontFamily: serif, fontSize: 24, fontWeight: 700, color: navy, margin: "0 0 12px", lineHeight: 1.2 }}>
                  {card.pair}
                </h3>
                <p style={{ fontSize: 15, color: bodyText, lineHeight: 1.75, margin: 0 }}>{card.body}</p>
              </div>
            ))}
          </div>

          <h3 style={{ fontFamily: serif, fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 700, fontStyle: "italic", color: navy, marginBottom: 20 }}>
            {c.model.termsTitle}
          </h3>
          <dl style={{ margin: "0 0 48px" }}>
            {c.model.terms.map((t) => (
              <div key={t.term} style={{ marginBottom: 20 }}>
                <dt style={{ fontWeight: 700, color: navy, fontSize: 16, marginBottom: 4 }}>{t.term}</dt>
                <dd style={{ margin: 0, color: bodyText, fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.8 }}>{t.body}</dd>
              </div>
            ))}
          </dl>

          <div style={{ background: offWhite, borderRadius: 10, padding: "24px 28px" }}>
            <p style={{ ...eyebrowStyle(), marginBottom: 10 }}>{c.model.fourthTitle}</p>
            <p style={{ color: bodyText, fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.8, margin: 0 }}>{c.model.fourth}</p>
          </div>
        </div>
      </section>

      {/* -- Three lenses (the one interaction: tabs) ------------------------- */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.lenses.eyebrow}</p>
          <h2 style={h2Style()}>{c.lenses.title}</h2>
          <p style={pStyle}>{c.lenses.intro}</p>

          <div className="gsf-tabs" role="tablist" aria-label="Choose a lens" style={{ marginBottom: 28 }}>
            {c.lenses.items.map((l) => {
              const active = l.key === activeLens;
              return (
                <button
                  key={l.key}
                  type="button"
                  role="tab"
                  id={`gsf-tab-${l.key}`}
                  aria-selected={active}
                  aria-controls={`gsf-panel-${l.key}`}
                  onClick={() => setActiveLens(l.key)}
                  style={{
                    minHeight: 48,
                    padding: "10px 8px",
                    borderRadius: 6,
                    border: `2px solid ${navy}`,
                    background: active ? navy : "white",
                    color: active ? offWhite : navy,
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  {l.tab}
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`gsf-panel-${lens.key}`}
            aria-labelledby={`gsf-tab-${lens.key}`}
            style={{ background: "white", borderRadius: 10, padding: "32px 28px" }}
          >
            <h3 style={{ fontFamily: serif, fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, fontStyle: "italic", color: navy, margin: "0 0 24px" }}>
              {lens.pair}
            </h3>
            <div className="gsf-lens-grid">
              {lens.sections.map((s) => (
                <div key={s.heading}>
                  <p style={{ ...eyebrowStyle(), marginBottom: 8 }}>{s.heading}</p>
                  <p style={{ color: bodyText, fontSize: 15.5, lineHeight: 1.8, margin: 0 }}>{cite(s.body)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -- Side by side ---------------------------------------------------- */}
      <section style={section(lightGray)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.compare.eyebrow}</p>
          <h2 style={h2Style()}>{c.compare.title}</h2>
          <p style={pStyle}>{c.compare.intro}</p>
          <div role="table" aria-label={c.compare.title} style={{ background: "white", borderRadius: 10, overflow: "hidden", marginBottom: 32 }}>
            <div role="row" className="gsf-row gsf-row-head" style={{ background: navy }}>
              <div role="columnheader" className="gsf-cell" style={{ color: offWhite, fontWeight: 700, fontSize: 13, borderBottom: "none" }}>
                <span className="sr-only">Aspect</span>
              </div>
              {c.compare.columns.map((col) => (
                <div key={col} role="columnheader" className="gsf-cell" style={{ color: offWhite, fontWeight: 700, fontSize: 14, borderBottom: "none" }}>
                  {col}
                </div>
              ))}
            </div>
            {c.compare.rows.map((row) => (
              <div key={row.label} role="row" className="gsf-row">
                <div role="rowheader" className="gsf-cell gsf-rowlabel" style={{ fontWeight: 700, color: navy, fontSize: 14 }}>
                  {row.label}
                </div>
                {row.cells.map((cell, j) => (
                  <div key={j} role="cell" className="gsf-cell" style={{ color: bodyText, fontSize: 14.5, lineHeight: 1.6 }}>
                    <span className="gsf-cell-label">{c.compare.columns[j]}</span>
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p style={{ ...pStyle, marginBottom: 0 }}>{c.compare.after}</p>
        </div>
      </section>

      {/* -- Background and research ---------------------------------------- */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.background.eyebrow}</p>
          <h2 style={h2Style()}>{c.background.title}</h2>
          {c.background.paras.map((p, i) => (
            <p key={i} style={pStyle}>
              {cite(p)}
            </p>
          ))}
          <div style={{ background: lightGray, borderRadius: 10, padding: "22px 26px", marginTop: 8 }}>
            <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(18px, 2vw, 21px)", color: navy, lineHeight: 1.6, margin: 0 }}>
              {c.background.callout}
            </p>
          </div>
        </div>
      </section>

      {/* -- Common misunderstandings --------------------------------------- */}
      <section style={section(lightGray)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.myths.eyebrow}</p>
          <h2 style={h2Style()}>{c.myths.title}</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {c.myths.items.map((m, i) => (
              <div key={i} style={{ background: "white", borderRadius: 10, padding: "22px 26px" }}>
                <p style={{ fontWeight: 700, color: navy, fontSize: 15.5, lineHeight: 1.6, margin: "0 0 8px" }}>{m.myth}</p>
                <p style={{ color: bodyText, fontSize: 15, lineHeight: 1.75, margin: 0 }}>{cite(m.reality)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- For leaders ----------------------------------------------------- */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.leaders.eyebrow}</p>
          <h2 style={h2Style()}>{c.leaders.title}</h2>
          <p style={pStyle}>{c.leaders.intro}</p>
          <ol style={{ listStyle: "none", padding: 0, margin: "0 0 40px", display: "grid", gap: 28 }}>
            {c.leaders.practices.map((pr, i) => (
              <li key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <span style={{ fontFamily: serif, fontSize: 30, fontWeight: 700, color: orange, lineHeight: 1, minWidth: 28 }}>{i + 1}</span>
                <div>
                  <h3 style={{ fontFamily: sans, fontSize: 17, fontWeight: 700, color: navy, margin: "2px 0 8px" }}>{pr.title}</h3>
                  <p style={{ color: bodyText, fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.8, margin: 0 }}>{cite(pr.body)}</p>
                </div>
              </li>
            ))}
          </ol>
          <div style={{ background: lightGray, borderRadius: 10, padding: "24px 28px" }}>
            <p style={{ ...eyebrowStyle(), marginBottom: 10 }}>{c.leaders.noteTitle}</p>
            <p style={{ color: bodyText, fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.8, margin: 0 }}>{c.leaders.note}</p>
          </div>
        </div>
      </section>

      {/* -- Faith Anchor ---------------------------------------------------- */}
      <section style={{ background: navy, padding: "96px 24px" }}>
        <div style={inner}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <CrossIcon />
            <p style={{ ...eyebrowStyle(), marginBottom: 0 }}>{c.faith.eyebrow}</p>
          </div>
          <h2 style={h2Style(offWhite)}>{c.faith.title}</h2>
          {c.faith.intro.map((p, i) => (
            <p key={i} style={{ fontSize: "clamp(15px, 1.8vw, 18px)", color: "oklch(82% 0.025 80)", lineHeight: 1.85, marginBottom: 20 }}>
              {p}
            </p>
          ))}
          <div style={{ display: "grid", gap: 28, margin: "32px 0 40px" }}>
            {c.faith.items.map((f) => (
              <div key={f.label} style={{ borderLeft: `3px solid ${orange}`, paddingLeft: 20 }}>
                <p style={{ fontFamily: sans, fontSize: 11, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: orange, margin: "0 0 6px" }}>
                  {f.label} · {f.ref}
                </p>
                <p style={{ fontSize: "clamp(15px, 1.7vw, 17px)", color: "oklch(82% 0.025 80)", lineHeight: 1.8, margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
          {c.faith.close.map((p, i) => (
            <p key={i} style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(18px, 2.1vw, 22px)", color: offWhite, lineHeight: 1.6, marginBottom: 16 }}>
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* -- Reflection and final word -------------------------------------- */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.reflect.eyebrow}</p>
          <h2 style={h2Style()}>{c.reflect.title}</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 56px", display: "grid", gap: 16 }}>
            {c.reflect.questions.map((q, i) => (
              <li key={i} style={{ background: "white", borderRadius: 10, padding: "18px 22px", color: bodyText, fontSize: "clamp(15px, 1.7vw, 17px)", lineHeight: 1.7 }}>
                {q}
              </li>
            ))}
          </ul>
          <p style={eyebrowStyle()}>{c.reflect.finalEyebrow}</p>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(19px, 2.2vw, 23px)", color: navy, lineHeight: 1.65, margin: 0 }}>
            {c.reflect.final}
          </p>
        </div>
      </section>

      {/* -- Key Takeaways --------------------------------------------------- */}
      <section style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.takeaways.eyebrow}</p>
          <h2 style={{ ...h2Style(), marginBottom: 48 }}>{c.takeaways.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {c.takeaways.items.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "white",
                  borderRadius: 10,
                  padding: "24px 28px",
                  borderLeft: `4px solid ${orange}`,
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontFamily: serif, fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 700, color: orange, lineHeight: 1, minWidth: 32, flexShrink: 0, marginTop: -2 }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: serif, fontSize: "clamp(15px, 1.7vw, 17px)", color: bodyText, lineHeight: 1.85, margin: 0 }}>{cite(item)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Dig Deeper ------------------------------------------------------ */}
      <section style={section(offWhite)}>
        <div style={inner}>
          <p style={eyebrowStyle()}>{c.deeper.eyebrow}</p>
          <h2 style={h2Style()}>{c.deeper.title}</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {c.deeper.panels.map((panel, i) => {
              const open = openPanels.includes(i);
              return (
                <div key={i} style={{ background: "white", borderRadius: 10, border: `1px solid ${lightGray}`, boxSizing: "border-box" }}>
                  <button
                    type="button"
                    onClick={() => togglePanel(i)}
                    aria-expanded={open}
                    aria-controls={`gsf-deeper-${i}`}
                    style={{
                      width: "100%",
                      minHeight: 56,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 22px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: sans,
                      fontSize: 15.5,
                      fontWeight: 700,
                      color: navy,
                    }}
                  >
                    {panel.title}
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                      style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
                    >
                      <path d="M6 9l6 6 6-6" fill="none" stroke={orange} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div
                    id={`gsf-deeper-${i}`}
                    style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows 0.3s ease" }}
                  >
                    <div style={{ overflow: "hidden", minHeight: 0 }}>
                      <div style={{ padding: "0 22px 20px", boxSizing: "border-box" }}>
                        {panel.paras.map((p, j) => (
                          <p key={j} style={{ color: bodyText, fontSize: 15, lineHeight: 1.8, margin: j === panel.paras.length - 1 ? 0 : "0 0 14px" }}>
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
        </div>
      </section>

      {/* -- Sources --------------------------------------------------------- */}
      <SourcesDropdown lang="en" markerStyle="number" background={lightGray} sources={c.sources} />
    </div>
  );
}
