"use client";

import type { ReactNode } from "react";
import { useState, useTransition, Fragment } from "react";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

// ── TOKENS ─────────────────────────────────────────────────────────────────────

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const muted = "oklch(48% 0.04 260)";
const card = "oklch(99% 0.003 80)";
const line = "oklch(84% 0.01 260)";
const lightNavy = "oklch(88% 0.02 80)";
const serif = "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif";
const sans = "var(--font-montserrat), Montserrat, sans-serif";

const SLUG = "individualism-collectivism";

// ── RICH TEXT ──────────────────────────────────────────────────────────────────
// **bold**  *italic*  ^n^ = orange superscript citation  ~~ref~~ = orange bold verse ref

function rich(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\^[^^]+\^|~~[^~]+~~)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("~~") && p.endsWith("~~")) return <span key={i} className="ic-verse">{p.slice(2, -2)}</span>;
    if (p.startsWith("^") && p.endsWith("^") && p.length > 2) return <sup key={i} className="ic-sup">{p.slice(1, -1)}</sup>;
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

// ── CONTENT ────────────────────────────────────────────────────────────────────
// English only for now. Add an `id` key with the same shape when Indonesian is ready.

type Form = {
  id: string;
  code: string;
  name: string;
  tagline: string;
  values: string;
  equals: string;
  authority: string;
  leadership: string;
};

type Panel = { id: string; title: string; body: string[] };

const CONTENT = {
  en: {
    hero: {
      eyebrow: "Cross-Cultural · Leadership",
      title: "Individualism and Collectivism",
      subtitle: "Some people start with \"I\". Others start with \"we\". Most of us live somewhere in between.",
      save: "Save to My Pathway",
      saved: "Saved to My Pathway",
      saveAria: "Save this module to My Pathway",
      savedAria: "Saved to My Pathway",
    },
    intro: [
      "Some people describe themselves first by what they do and what they want. Others describe themselves first by the people they belong to: a family, a clan, a village, a church or a company. Researchers call this the difference between individualism and collectivism.^5^",
      "The difference shapes ordinary moments at work. It affects who expects to be consulted before a decision, how praise and correction are received, what loyalty looks like, and who receives the credit when something goes well.",
      "This module explains the idea in plain terms. It treats individualism and collectivism as two ends of a line, with most people and groups somewhere in between. It also shows why the line has a second dimension, and why the question \"who is the we?\" matters as much as the label itself.",
    ],
    objectives: [
      "Describe individualism and collectivism as a difference in the unit of identity: the person or the group.",
      "Explain why a spectrum fits the evidence better than two separate boxes.",
      "Distinguish the four forms: horizontal and vertical individualism, horizontal and vertical collectivism.",
      "Recognise how in-group and out-group lines shape trust and loyalty.",
      "Apply the idea to decisions, feedback, loyalty and credit in a mixed team.",
    ],
    core: {
      eyebrow: "The core idea",
      title: "I and we as starting points",
      paras: [
        "At its simplest, individualism and collectivism describe what people treat as the basic unit of social life. In a more individualist setting, the starting point is the person. People are expected to have their own goals, opinions and choices, and groups are formed by individuals who decide to join them. In a more collectivist setting, the starting point is the group. People are seen as members first, and their goals and choices are shaped by the relationships they belong to.",
        "Hazel Markus and Shinobu Kitayama described this as two ways of understanding the self.^5^ An **independent self** is seen as separate and fairly stable across situations. A person with this view tends to describe themselves with inner qualities: \"I am honest\", \"I am creative\". An **interdependent self** is seen as connected and partly defined by relationships. A person with this view tends to describe themselves through roles and bonds: \"I am the eldest daughter\", \"I am part of this team\". Both views can live inside one person, and which one comes forward can depend on the setting.",
        "This difference reaches into many areas of life. It affects how people think about duty, whose approval matters in a big decision, what counts as a good reason to change plans, and what makes a person feel proud or ashamed. Neither orientation makes a culture more caring or more mature than another. Each one organises care and responsibility in its own way.",
      ],
      definitionLabel: "A working definition",
      definition: "Individualism and collectivism differ in whether people mainly see themselves as a separate \"I\" with personal goals, or as part of a \"we\" defined by relationships and groups.",
    },
    spectrum: {
      eyebrow: "The model",
      title: "A line, with most people in between",
      lead: "Early research often presented individualism and collectivism as opposite boxes and placed whole countries in one box or the other. Later work has made that picture more careful. Three findings stand out.",
      cards: [
        {
          title: "Both ends exist in every society",
          text: "People everywhere hold some personal goals and some group loyalties. A large review of the research by Daphna Oyserman and colleagues found that popular claims, such as the idea that Americans are far more individualist than East Asians, held only in part and depended on how individualism was measured and who was compared.^4^ The more useful question is where a person or group leans, and in which area of life.",
        },
        {
          title: "Large differences inside countries",
          text: "National averages hide a great deal. Age, education, city or village life, social class, religion and type of work all move people along the line. A study of 55 cultural groups in 33 nations by Vivian Vignoles and colleagues found several distinct ways of being independent or interdependent, shaped by economic development and religious heritage, rather than one line running from East to West.^9^",
        },
        {
          title: "Cultures move over time",
          text: "Data from 78 countries over about five decades show individualism rising in most societies, linked mainly to socioeconomic development.^10^ The same study found that sizeable differences between societies remain. Change is real, and it has not made cultures alike.",
        },
      ],
      after: "For a leader, this means a country label is only a first guess. The person in front of you may lean further toward one end than their national average, or less far, and may lean differently at home and at work.",
    },
    forms: {
      eyebrow: "Four forms",
      title: "Horizontal and vertical",
      paras: [
        "Harry Triandis and Michele Gelfand added a second question to the picture.^6^ Besides asking whether people lean toward the I or the we, they asked whether people see others as equals or accept differences in rank. **Horizontal** patterns stress equality. **Vertical** patterns accept hierarchy and status. Crossing the two questions gives four forms instead of two.",
        "Select a form to see what it values, how people relate to equals and to authority, and how it can show up in leadership. Triandis and Gelfand measured these as values held by individuals, so the four forms describe people and teams more than nations. A person can hold more than one, and a team can contain all four.",
      ],
      axisTop: "Accepts rank",
      axisBottom: "Stresses equality",
      axisLeft: "Leans toward I",
      axisRight: "Leans toward we",
      labels: { values: "What it values", equals: "With equals", authority: "With authority", leadership: "In leadership" },
      hint: "Select a form to open it.",
      items: [
        {
          id: "vi",
          code: "VI",
          name: "Vertical individualism",
          tagline: "Stand out, and win.",
          values: "Personal achievement, competition and success compared with others. Being the best is a legitimate aim, and differences in status are seen as fair results of effort.",
          equals: "Peers can be rivals as well as colleagues. Comparison and ranking feel normal, and individual results are watched closely.",
          authority: "Hierarchy is accepted when it reflects performance. People expect to rise by merit and expect rewards to follow results.",
          leadership: "Leaders are expected to set clear targets, measure individual results and reward top performers visibly. People who lean this way may find shared credit unsatisfying.",
        },
        {
          id: "vc",
          code: "VC",
          name: "Vertical collectivism",
          tagline: "Serve the group, and respect its order.",
          values: "Duty to the group, loyalty, and a willingness to put the group's needs before one's own, within an accepted hierarchy. Sacrifice for family or organisation is honourable.",
          equals: "Relationships are warm inside the group, and each person knows their place in it. Rank and role shape who speaks and when.",
          authority: "Authority is respected as part of serving the group. Disagreement with a senior person is usually expressed indirectly, if at all.",
          leadership: "Leaders are expected to protect and provide for the group, and members are expected to show loyalty in return. This form overlaps with power distance, which has its own module.",
        },
        {
          id: "hi",
          code: "HI",
          name: "Horizontal individualism",
          tagline: "Be unique, and stay equal.",
          values: "Self-reliance and personal freedom, without a wish to stand above others. People want to do things their own way and be seen as distinct, while treating others as peers.",
          equals: "Relationships with colleagues are friendly and informal. Status differences feel uncomfortable and are often played down.",
          authority: "Authority is accepted when it is earned and explained. Titles count for less than competence and fairness.",
          leadership: "Leaders are expected to give autonomy, ask for input and avoid displays of rank. A leader who gives orders without reasons may lose respect quickly.",
        },
        {
          id: "hc",
          code: "HC",
          name: "Horizontal collectivism",
          tagline: "Belong, as equals.",
          values: "Shared goals, cooperation and a sense of oneness with the group, with members seen as similar in standing. Harmony and mutual help matter more than personal distinction.",
          equals: "Peers are close and depend on one another. Standing out too much can feel like breaking the bond.",
          authority: "Leaders are seen as members of the group. Authority works best when it stays close to the group and listens before it acts.",
          leadership: "Leaders are expected to build consensus, share credit and protect the group's unity. Public praise for one person may embarrass them in front of their peers.",
        },
      ] as Form[],
    },
    ingroup: {
      eyebrow: "In-group and out-group",
      title: "Who counts as \"we\"",
      paras: [
        "Collectivism is loyalty to a particular group, which raises the question of which group. Marilynn Brewer and Ya-Ru Chen pointed out that collectivism can mean loyalty to close relationships, such as family and friends, or loyalty to a larger group, such as a company, a tribe or a nation. They noted that many research measures blur the two.^7^",
        "The GLOBE study of leadership across 62 societies made a similar distinction.^8^ It separated **in-group collectivism**, the pride and loyalty people feel toward their families and small groups, from **institutional collectivism**, the degree to which organisations and institutions encourage and reward group action. A society can score high on one and lower on the other. Strong family loyalty does not automatically produce strong loyalty to an employer.",
        "This has a practical edge. In many settings that lean collectivist, people draw a clear line between in-group and out-group. Inside the line there is deep trust, generosity and obligation. Outside it, people may be polite but cautious, and the same duties of care may not apply. A newcomer to a team may need time, shared history or an introduction from a trusted person before they are treated as one of \"us\".",
        "In settings that lean individualist, the line is often thinner. People can form working teams quickly with strangers and cooperate well for a project. Those bonds may also be looser, and people may move on when the project ends. Each pattern makes some things easy and other things hard.",
        "For leaders, the practical question is this: which group does this person feel most bound to, and where does my team sit in relation to it? A team member may be deeply loyal, and that loyalty may belong first to family, a home community or a church before it reaches the organisation.",
      ],
    },
    table: {
      eyebrow: "Side by side",
      title: "How the two ends tend to look",
      lead: "The table describes tendencies at each end of the line. Real people sit somewhere in between, and may sit in different places for different parts of life.",
      head: ["Area", "Leaning toward I", "Leaning toward we"],
      rows: [
        ["Unit of identity", "The person, with their own qualities and goals", "The person within their relationships and groups"],
        ["Basis of decisions", "Personal judgement and preference, with others informed", "Consultation with family, elders or the team before committing"],
        ["Loyalty", "Chosen, and can shift when a relationship stops working", "Given to the in-group and expected to last, with duties running both ways"],
        ["Feedback", "Direct and personal: tell me where I can improve", "Careful of face, often private or framed around the group"],
        ["Recognition", "Individual praise for individual results", "Credit shared with the group; singling someone out can embarrass"],
        ["Obligation to family and group", "Important, and weighed against personal plans", "Can rightly come before personal plans and work deadlines"],
        ["Disagreement", "Open dissent is seen as a contribution", "Open dissent can threaten harmony; silence may not mean agreement"],
      ],
      note: "Studies with American and East Asian participants found that the appeal of being unique and the appeal of fitting in can run in opposite directions.^12^ A choice that signals freedom to one person can signal disharmony to another.",
    },
    myths: {
      eyebrow: "Common misunderstandings",
      title: "Six ideas worth correcting",
      items: [
        {
          claim: "\"A culture is either individualist or collectivist.\"",
          text: "Both orientations exist in every society, and variation within countries is large.^4, 9^ It is more accurate to speak of leanings, and of particular areas of life.",
        },
        {
          claim: "\"Collectivists have no personal goals.\"",
          text: "People in group-oriented settings pursue ambitions, careers and dreams. What changes is whose approval and welfare are weighed along the way.",
        },
        {
          claim: "\"Individualists do not care about others.\"",
          text: "Individualist societies have strong traditions of volunteering, cooperation and giving. The I carries its own obligations, often to people a person has chosen rather than been born into.",
        },
        {
          claim: "\"A national score describes each person from that country.\"",
          text: "Scores such as Hofstede's are national averages, first drawn from one company's staff, and the method has been criticised.^1, 3^ They can open a conversation. They cannot describe the person in front of you.",
        },
        {
          claim: "\"Collectivism means agreeing with the group.\"",
          text: "Group-oriented people disagree too. They often choose a different time, place or channel to say so, such as a private conversation or a trusted go-between.",
        },
        {
          claim: "\"East means collectivist and West means individualist.\"",
          text: "Patterns of independence and interdependence vary across world regions in more ways than a single East-West line can hold, shaped in part by economic development and religious heritage.^9^",
        },
      ],
    },
    leaders: {
      eyebrow: "For leaders",
      title: "What this means for leaders",
      lead: "The ideas above become practical in a few recurring moments. The suggestions below draw on the research and on good practice. Treat them as things to test with your own team rather than as rules.",
      blocks: [
        {
          title: "Decisions",
          paras: [
            "In a team that leans individualist, a person may decide on the spot and inform others later. In a team that leans collectivist, a person may need to consult family, elders or colleagues before committing. A delay may be consultation rather than hesitation.",
            "Ask the unit question early: who else should be part of this decision? Building that time into the plan prevents a late surprise, such as a commitment withdrawn after the family has been consulted. It also shows respect for the relationships the person carries.",
          ],
        },
        {
          title: "Feedback",
          paras: [
            "Feedback that feels clear and helpful to one person can feel like public exposure to another. Where face and group harmony matter, correction given in front of others may damage trust far beyond the issue at hand.",
            "One approach is to offer two doors. One door is a private, one-to-one conversation about the person's own work. The other is a group-framed conversation: how can we, as a team, improve this? Let people choose, and notice which door they use. Praise follows the same logic. Some people value thanks in a meeting, while others prefer a quiet word afterwards.",
          ],
        },
        {
          title: "Loyalty",
          paras: [
            "Obligations to extended family, such as illness, funerals, weddings or school fees, can rightly outrank a work deadline for some team members. A leader from a more individualist background may read this as a lack of commitment. The team member may see it as faithfulness, and may expect a good leader to understand.",
            "It helps to make these obligations discussable before they arise. Agree together how much notice is possible and how work will be covered, without ranking one culture's reasons above another's. Loyalty to the team tends to grow when people feel their other loyalties are respected.",
          ],
        },
        {
          title: "Credit and reward",
          paras: [
            "Who receives the credit is a sensitive question in a mixed team. Individual recognition motivates some people and embarrasses others. Team credit can feel fair to some and can hide real differences in performance from others.",
            "A classic study by Christopher Earley found that American participants worked harder when they were individually accountable, while Chinese participants worked as hard under shared responsibility.^11^ It is one study, and it is best read as an illustration. It suggests that the same reward design can land differently across a team. Pairing individual and team recognition, and asking people which they value, is a reasonable starting point to test.",
          ],
        },
        {
          title: "Disagreement",
          paras: [
            "In more individualist settings, open dissent in a meeting is often seen as a contribution. In more collectivist settings, it can feel like a threat to harmony, especially if it would embarrass a senior person. Silence in a meeting may therefore mean something other than agreement.",
            "Offer more than one channel for disagreement, such as a round where each person speaks, a written option, or a follow-up in smaller groups. It also helps to name the we and the I together: set a shared team goal, and give each person a distinct and visible part in reaching it.^7, 9^",
          ],
        },
      ],
    },
    faith: {
      eyebrow: "Faith Anchor",
      title: "Carry one another, and carry your own load",
      paras: [
        "In one short passage, Paul holds both ends of the line together. ~~Galatians 6:2~~ says: \"Carry each other's burdens, and in this way you will fulfil the law of Christ.\" A few verses later, ~~Galatians 6:5~~ says: \"for each one should carry their own load.\"",
        "The church is described as one body with many members, each with a distinct part, all belonging to the whole (~~1 Corinthians 12:12-27~~). Personal responsibility and shared life both belong in that picture. Each culture tends to see one half of it more clearly than the other.",
        "A leader who leans toward the I may need to learn how much of life is meant to be shared. A leader who leans toward the we may need to learn that each person stands before God with their own calling and their own account. Both can learn from team members who lean the other way.",
      ],
      close: "Faithful leadership makes room for the burden we carry together and for the load that is ours to carry.",
      reflectLabel: "Reflect",
      reflect: "Where do I lean on the line between I and we, and where did I learn it?",
    },
    final: {
      eyebrow: "A final word",
      title: "Start with curiosity",
      paras: [
        "Individualism and collectivism are useful ideas when they help leaders ask better questions. They become less useful when they turn into labels for whole nations or excuses for misunderstanding.",
        "The research points to a line with many positions and to four distinct forms. It also points to a practical question about which group a person feels most bound to. In a mixed team, the most useful work is understanding where each person stands, and then building ways of working that respect both the person and the group.",
      ],
    },
    takeaways: {
      eyebrow: "Key Takeaways",
      title: "What to remember",
      items: [
        "Individualism and collectivism describe whether people mainly see themselves as a separate I or as part of a we.",
        "The two are ends of a line. Most people and groups sit in between, and variation within countries is large.",
        "Horizontal and vertical forms add a second question: do people see others as equals, or do they accept rank?",
        "Collectivism is loyalty to a particular group. Ask which group a person feels most bound to.",
        "Decisions, feedback, loyalty and credit can land differently across a mixed team. Ask people what works for them, and adjust.",
      ],
    },
    dig: {
      eyebrow: "Dig Deeper",
      title: "For those who want more",
      panels: [
        {
          id: "hofstede",
          title: "Hofstede's scores and their limits",
          body: [
            "Geert Hofstede's work made individualism one of the best-known dimensions of culture.^1^ On his 0 to 100 scale, the United States scores 91 and Indonesia 14, near opposite ends.^2^",
            "These numbers are national averages, first drawn from staff of one multinational company in the 1960s and 1970s and later extended. Brendan McSweeney and others have criticised the method, including the assumption that one company's staff can stand for a national culture.^3^ Read such scores as a rough starting point, and expect individuals, cities, generations and professions to differ widely.",
          ],
        },
        {
          id: "evidence",
          title: "How strong is the evidence?",
          body: [
            "The review by Oyserman, Coon and Kemmelmeier brought together a large body of studies. It found that common claims about national differences held only in part, and that results depended heavily on the measure used and the groups compared.^4^ This is a good reason to hold the ideas in this module with some humility.",
          ],
        },
        {
          id: "globe",
          title: "In-group and institutional collectivism (GLOBE)",
          body: [
            "The GLOBE study measured cultural practices and values in 62 societies, with a focus on leadership.^8^ Its separate scales for in-group and institutional collectivism are useful for leaders who work with organisations, because a society's family loyalty and its organisational teamwork can differ. For exact definitions and figures, the original chapters are the best guide.",
          ],
        },
        {
          id: "measure",
          title: "Measuring the four forms",
          body: [
            "Triandis and Gelfand developed and tested short questionnaires for the horizontal and vertical forms, and showed that different measurement methods pointed in the same direction.^6^ Their work is a good place to start for anyone who wants to learn a team's actual values rather than guess them from nationality.",
          ],
        },
        {
          id: "roots",
          title: "Possible roots: development, farming and tight norms",
          body: [
            "The rise of individualism across many countries has been linked mainly to socioeconomic development.^10^ Thomas Talhelm and colleagues found that people from rice-farming regions of China thought in more interdependent ways than people from wheat-farming regions.^14^ That study covers one country, is correlational, and is still debated, so it is best held loosely.",
            "A related but separate idea is the difference between tight and loose cultures, which concerns how strong social norms are and how much deviation a society tolerates.^13^ The two ideas overlap in places, but they measure different things.",
          ],
        },
        {
          id: "indonesia",
          title: "One example: gotong royong in Indonesia",
          body: [
            "Indonesia is often cited as strongly collectivist, and gotong royong, mutual help within a community, is a well-known example. John Bowen showed that gotong royong is both a lived practice and an idea shaped by the state for political purposes, so it is better understood as a tradition with a history than as a timeless trait.^15^",
            "The same caution applies to cultural ideals in any country. Urban, younger and professional Indonesians vary widely, as people do elsewhere.",
          ],
        },
        {
          id: "ruth",
          title: "Ruth: loyalty as a personal choice",
          body: [
            "The book of Ruth gives a picture of group loyalty that is also a personal decision. In ~~Ruth 1:16~~ she says to Naomi: \"Where you go I will go, and where you stay I will stay. Your people will be my people and your God my God.\" Ruth chooses, as an individual, to bind herself to a new people. Her words hold the I and the we together.",
          ],
        },
        {
          id: "related",
          title: "Related modules",
          body: [
            "Power Distance covers hierarchy and how people relate to authority, which overlaps with vertical collectivism. Understanding High-Context Communication and Intercultural Communication cover how messages are sent and read across cultures.",
          ],
        },
      ] as Panel[],
    },
    sources: [
      "Hofstede, G. (2001). Culture's Consequences (2nd ed.). Sage.",
      "Hofstede Insights. Country Comparison Tool. https://www.hofstede-insights.com/country-comparison-tool",
      "McSweeney, B. (2002). Hofstede's model of national cultural differences and their consequences: A triumph of faith, a failure of analysis. Human Relations, 55(1), 89-118. https://doi.org/10.1177/0018726702551004",
      "Oyserman, D., Coon, H. M., & Kemmelmeier, M. (2002). Rethinking individualism and collectivism: Evaluation of theoretical assumptions and meta-analyses. Psychological Bulletin, 128(1), 3-72. https://pubmed.ncbi.nlm.nih.gov/11843550",
      "Markus, H. R., & Kitayama, S. (1991). Culture and the self: Implications for cognition, emotion, and motivation. Psychological Review, 98(2), 224-253.",
      "Triandis, H. C., & Gelfand, M. J. (1998). Converging measurement of horizontal and vertical individualism and collectivism. Journal of Personality and Social Psychology, 74(1), 118-128.",
      "Brewer, M. B., & Chen, Y.-R. (2007). Where (who) are collectives in collectivism? Toward conceptual clarification of individualism and collectivism. Psychological Review, 114(1), 133-151.",
      "House, R. J., Hanges, P. J., Javidan, M., Dorfman, P. W., & Gupta, V. (Eds.) (2004). Culture, Leadership, and Organizations: The GLOBE Study of 62 Societies. Sage.",
      "Vignoles, V. L., et al. (2016). Beyond the \"East-West\" dichotomy: Global variation in cultural models of selfhood. Journal of Experimental Psychology: General, 145(8), 966-1000.",
      "Santos, H. C., Varnum, M. E. W., & Grossmann, I. (2017). Global increases in individualism. Psychological Science, 28(9), 1228-1239. https://doi.org/10.1177/0956797617700622",
      "Earley, P. C. (1989). Social loafing and collectivism: A comparison of the United States with the People's Republic of China. Administrative Science Quarterly, 34(4), 565-581.",
      "Kim, H., & Markus, H. R. (1999). Deviance or uniqueness, harmony or conformity? A cultural analysis. Journal of Personality and Social Psychology, 77(4), 785-800.",
      "Gelfand, M. J., et al. (2011). Differences between tight and loose cultures: A 33-nation study. Science, 332(6033), 1100-1104. https://doi.org/10.1126/science.1197754",
      "Talhelm, T., et al. (2014). Large-scale psychological differences within China explained by rice versus wheat agriculture. Science, 344(6184), 603-608. https://doi.org/10.1126/science.1246850",
      "Bowen, J. R. (1986). On the political construction of tradition: Gotong royong in Indonesia. Journal of Asian Studies, 45(3), 545-561.",
    ],
  },
};

// ── STYLES ─────────────────────────────────────────────────────────────────────

const CSS = `
.ic{--navy:${navy};--orange:${orange};--off:${offWhite};--light:${lightGray};--body:${bodyText};--muted:${muted};--card:${card};--line:${line};--light-navy:${lightNavy};--serif:${serif};font-family:${sans};background:var(--off);color:var(--body)}
.ic *{box-sizing:border-box}
.ic-wrap{max-width:860px;margin:0 auto;padding:0 16px}
.ic-sec{padding:clamp(56px,8vw,88px) 0}
.ic-a{background:var(--off)}
.ic-b{background:var(--light)}
.ic p{font-size:15px;line-height:1.85;margin:0 0 18px}
.ic-eyebrow{font-size:0.75rem!important;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--orange);margin:0 0 12px!important;line-height:1.4!important;display:flex;align-items:center;gap:8px}
.ic h2{font-family:var(--serif);font-weight:600;font-size:clamp(28px,3.6vw,40px);line-height:1.15;color:var(--navy);margin:0 0 20px}
.ic h3{font-family:var(--serif);font-weight:600;font-size:clamp(22px,2.6vw,27px);line-height:1.2;color:var(--navy);margin:32px 0 10px}
.ic-sup{font-size:.68em;font-weight:700;color:var(--orange);line-height:0;margin-left:1px}
.ic-verse{color:var(--orange);font-weight:700}
.ic-lede{font-size:clamp(15px,1.6vw,17px)!important}
/* hero */
.ic-hero{background:var(--navy);padding:clamp(72px,10vw,96px) 0 clamp(64px,9vw,88px)}
.ic-hero h1{font-family:var(--serif);font-weight:600;font-size:clamp(40px,6vw,72px);line-height:1.08;color:var(--off);margin:0 0 20px}
.ic-hero .ic-subline{font-family:var(--serif);font-style:italic;font-size:clamp(18px,2.2vw,23px);color:oklch(82% 0.025 80);line-height:1.6;max-width:620px;margin:0 0 32px}
.ic-save{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:10px 24px;border:none;border-radius:4px;background:var(--orange);color:var(--off);font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}
.ic-save[aria-pressed="true"]{background:oklch(35% 0.05 260);cursor:default}
.ic-save svg{width:18px;height:18px}
.ic button:focus-visible{outline:2px solid var(--orange);outline-offset:2px}
/* objectives */
.ic-obj{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.ic-obj li{display:flex;gap:14px;align-items:flex-start;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 18px;font-size:15px;line-height:1.7;color:var(--navy)}
.ic-num{flex:0 0 30px;height:30px;border-radius:50%;background:var(--navy);color:var(--off);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}
/* definition */
.ic-def{background:var(--navy);border-radius:8px;padding:clamp(22px,4vw,32px);margin-top:28px}
.ic-def .ic-eyebrow{margin-bottom:8px!important}
.ic-def p.ic-def-text{font-family:var(--serif);font-size:clamp(21px,2.8vw,26px);line-height:1.4;color:var(--light-navy);margin:0}
/* cards */
.ic-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:24px 0 28px}
.ic-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:22px}
.ic-card h3{margin:0 0 10px;font-size:22px}
.ic-card p{font-size:14px;line-height:1.75;margin:0}
/* quadrant interaction */
.ic-quad-wrap{margin-top:28px}
.ic-axis{display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 8px}
.ic-quad{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ic-qbtn{width:100%;min-height:120px;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:18px 20px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;gap:6px;transition:background .2s,border-color .2s}
.ic-qbtn:hover{border-color:var(--navy)}
.ic-qbtn[aria-expanded="true"]{background:var(--navy);border-color:var(--navy)}
.ic-qcode{font-size:12px;font-weight:700;letter-spacing:.12em;color:var(--orange)}
.ic-qname{font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.2;color:var(--navy)}
.ic-qtag{font-size:14px;color:var(--muted);font-style:italic}
.ic-qbtn[aria-expanded="true"] .ic-qname{color:var(--off)}
.ic-qbtn[aria-expanded="true"] .ic-qtag{color:var(--light-navy)}
.ic-hint{font-size:13px!important;color:var(--muted);margin:12px 0 0!important}
.ic-detail{margin-top:16px;background:var(--card);border:1px solid var(--line);border-radius:8px;padding:clamp(20px,3vw,28px)}
.ic-detail h3{margin-top:0}
.ic-detail dl{margin:0;display:grid;gap:14px}
.ic-detail dt{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:0 0 4px}
.ic-detail dd{margin:0;font-size:15px;line-height:1.75}
/* table */
.ic-table{display:grid;grid-template-columns:1fr 1.4fr 1.4fr;border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--card);margin-top:24px}
.ic-th{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:14px 18px;background:var(--navy);color:var(--off)}
.ic-td{font-size:14px;line-height:1.6;padding:14px 18px;border-top:1px solid var(--line)}
.ic-td.rowhead{font-weight:700;color:var(--navy)}
.ic-td+.ic-td{border-left:1px solid var(--line)}
.ic-cell-label{display:none}
.ic-note{font-size:14px!important;color:var(--muted);margin-top:20px!important}
/* myths */
.ic-myths{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:24px}
.ic-myth{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:20px 22px}
.ic-myth .ic-claim{font-family:var(--serif);font-weight:600;font-size:20px!important;line-height:1.3!important;color:var(--navy);margin:0 0 8px!important}
.ic-myth p{font-size:14px;line-height:1.75;margin:0}
/* faith */
.ic-faith{background:var(--navy)}
.ic-faith h2{color:var(--off)}
.ic-faith p{color:var(--light-navy)}
.ic-faith .ic-faith-close{color:var(--off);font-weight:600}
.ic-cross{width:14px;height:14px;flex:0 0 14px}
.ic-reflect{background:var(--off);border-radius:8px;padding:clamp(20px,3vw,28px);margin-top:28px}
.ic-reflect p.ic-reflect-text{font-family:var(--serif);font-size:22px;line-height:1.45;color:var(--navy);margin:0}
/* takeaways */
.ic-take{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.ic-take li{display:flex;gap:16px;align-items:flex-start;background:var(--off);border:1px solid var(--line);border-radius:8px;padding:16px 18px;font-size:15px;line-height:1.75;color:var(--navy)}
.ic-take .ic-num{background:var(--orange)}
/* dig deeper accordion */
.ic-acc{margin-top:24px;border-top:1px solid var(--line)}
.ic-acc-item{border-bottom:1px solid var(--line)}
.ic-acc-btn{width:100%;min-height:56px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;background:none;border:none;cursor:pointer;text-align:left;font-family:inherit;font-size:15px;font-weight:600;color:var(--navy)}
.ic-chev{flex:0 0 20px;width:20px;height:20px;color:var(--orange);transition:transform .3s}
.ic-acc-btn[aria-expanded="true"] .ic-chev{transform:rotate(180deg)}
.ic-acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s}
.ic-acc-panel.open{grid-template-rows:1fr}
.ic-acc-panel>div{overflow:hidden}
.ic-acc-inner{padding:0 0 22px}
@media (max-width:700px){
  .ic-cards{grid-template-columns:1fr}
  .ic-myths{grid-template-columns:1fr}
}
@media (max-width:600px){
  .ic-quad{grid-template-columns:1fr}
  .ic-axis{display:none}
  .ic-table{grid-template-columns:1fr}
  .ic-th{display:none}
  .ic-td+.ic-td{border-left:none;border-top:none;padding-top:0}
  .ic-td.rowhead{background:oklch(93% 0.008 80)}
  .ic-cell-label{display:block;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;color:var(--muted)}
}
@media (prefers-reduced-motion:reduce){
  .ic-acc-panel,.ic-chev,.ic-qbtn{transition:none}
}
`;

// ── COMPONENT ──────────────────────────────────────────────────────────────────

type Props = { isSaved: boolean };

export default function IndividualismCollectivismClient({ isSaved: initialSaved }: Props) {
  // English only for now: render EN regardless of the language setting.
  const c = CONTENT.en;

  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  function handleSave() {
    if (saved || isPending) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  }

  function togglePanel(id: string) {
    setOpenPanels((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const active = c.forms.items.find((f) => f.id === activeForm) ?? null;

  return (
    <div className="ic">
      <style>{CSS}</style>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <header className="ic-hero">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.hero.eyebrow}</p>
          <h1>{c.hero.title}</h1>
          <p className="ic-subline">{c.hero.subtitle}</p>
          <button
            type="button"
            className="ic-save"
            onClick={handleSave}
            disabled={saved || isPending}
            aria-pressed={saved}
            aria-label={saved ? c.hero.savedAria : c.hero.saveAria}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3h12v18l-6-4.5L6 21z" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <span>{saved ? c.hero.saved : c.hero.save}</span>
          </button>
        </div>
      </header>

      {/* ── 2. INTRODUCTION ─────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          {c.intro.map((p, i) => (
            <p key={i} className="ic-lede" style={i === c.intro.length - 1 ? { marginBottom: 0 } : undefined}>{rich(p)}</p>
          ))}
        </div>
      </section>

      {/* ── 3. AFTER THIS MODULE ────────────────────────────────────────────── */}
      <section className="ic-sec ic-b">
        <div className="ic-wrap">
          <p className="ic-eyebrow">After This Module</p>
          <h2>You will be able to</h2>
          <ol className="ic-obj">
            {c.objectives.map((o, i) => (
              <li key={i}>
                <span className="ic-num" aria-hidden="true">{i + 1}</span>
                <div>{o}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 4. THE CORE IDEA ────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.core.eyebrow}</p>
          <h2>{c.core.title}</h2>
          {c.core.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
          <div className="ic-def">
            <p className="ic-eyebrow">{c.core.definitionLabel}</p>
            <p className="ic-def-text">{c.core.definition}</p>
          </div>
        </div>
      </section>

      {/* ── 5. A SPECTRUM ───────────────────────────────────────────────────── */}
      <section className="ic-sec ic-b">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.spectrum.eyebrow}</p>
          <h2>{c.spectrum.title}</h2>
          <p>{c.spectrum.lead}</p>
          <div className="ic-cards">
            {c.spectrum.cards.map((card) => (
              <div className="ic-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{rich(card.text)}</p>
              </div>
            ))}
          </div>
          <p style={{ marginBottom: 0 }}>{c.spectrum.after}</p>
        </div>
      </section>

      {/* ── 6. FOUR FORMS (interaction) ─────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.forms.eyebrow}</p>
          <h2>{c.forms.title}</h2>
          {c.forms.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}

          <div className="ic-quad-wrap">
            <div className="ic-axis" aria-hidden="true">
              <span>{c.forms.axisLeft}</span>
              <span>{c.forms.axisRight}</span>
            </div>
            <div className="ic-quad">
              {c.forms.items.map((f) => {
                const isOpen = activeForm === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    className="ic-qbtn"
                    aria-expanded={isOpen}
                    aria-controls="ic-form-detail"
                    onClick={() => setActiveForm(isOpen ? null : f.id)}
                  >
                    <span className="ic-qcode">{f.code} · {f.id.startsWith("v") ? c.forms.axisTop : c.forms.axisBottom}</span>
                    <span className="ic-qname">{f.name}</span>
                    <span className="ic-qtag">{f.tagline}</span>
                  </button>
                );
              })}
            </div>
            <div id="ic-form-detail" aria-live="polite">
              {active ? (
                <div className="ic-detail">
                  <h3>{active.name}</h3>
                  <dl>
                    <div><dt>{c.forms.labels.values}</dt><dd>{active.values}</dd></div>
                    <div><dt>{c.forms.labels.equals}</dt><dd>{active.equals}</dd></div>
                    <div><dt>{c.forms.labels.authority}</dt><dd>{active.authority}</dd></div>
                    <div><dt>{c.forms.labels.leadership}</dt><dd>{active.leadership}</dd></div>
                  </dl>
                </div>
              ) : (
                <p className="ic-hint">{c.forms.hint}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. IN-GROUP AND OUT-GROUP ───────────────────────────────────────── */}
      <section className="ic-sec ic-b">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.ingroup.eyebrow}</p>
          <h2>{c.ingroup.title}</h2>
          {c.ingroup.paras.map((p, i) => (
            <p key={i} style={i === c.ingroup.paras.length - 1 ? { marginBottom: 0 } : undefined}>{rich(p)}</p>
          ))}
        </div>
      </section>

      {/* ── 8. SIDE BY SIDE ─────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.table.eyebrow}</p>
          <h2>{c.table.title}</h2>
          <p>{c.table.lead}</p>
          <div className="ic-table" role="table" aria-label={c.table.title}>
            <div role="row" style={{ display: "contents" }}>
              {c.table.head.map((h) => (
                <div key={h} className="ic-th" role="columnheader">{h}</div>
              ))}
            </div>
            {c.table.rows.map((r) => (
              <div role="row" key={r[0]} style={{ display: "contents" }}>
                <div className="ic-td rowhead" role="rowheader">{r[0]}</div>
                <div className="ic-td" role="cell">
                  <span className="ic-cell-label">{c.table.head[1]}</span>
                  {r[1]}
                </div>
                <div className="ic-td" role="cell">
                  <span className="ic-cell-label">{c.table.head[2]}</span>
                  {r[2]}
                </div>
              </div>
            ))}
          </div>
          <p className="ic-note">{rich(c.table.note)}</p>
        </div>
      </section>

      {/* ── 9. MISUNDERSTANDINGS ────────────────────────────────────────────── */}
      <section className="ic-sec ic-b">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.myths.eyebrow}</p>
          <h2>{c.myths.title}</h2>
          <div className="ic-myths">
            {c.myths.items.map((m) => (
              <div className="ic-myth" key={m.claim}>
                <p className="ic-claim">{m.claim}</p>
                <p>{rich(m.text)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FOR LEADERS ─────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.leaders.eyebrow}</p>
          <h2>{c.leaders.title}</h2>
          <p>{c.leaders.lead}</p>
          {c.leaders.blocks.map((b) => (
            <div key={b.title}>
              <h3>{b.title}</h3>
              {b.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
            </div>
          ))}
        </div>
      </section>

      {/* ── 11. FAITH ANCHOR ────────────────────────────────────────────────── */}
      <section className="ic-sec ic-faith">
        <div className="ic-wrap">
          <p className="ic-eyebrow">
            <svg className="ic-cross" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M7 1v12M3 4.5h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {c.faith.eyebrow}
          </p>
          <h2>{c.faith.title}</h2>
          {c.faith.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
          <p className="ic-faith-close">{c.faith.close}</p>
          <div className="ic-reflect">
            <p className="ic-eyebrow">{c.faith.reflectLabel}</p>
            <p className="ic-reflect-text">{c.faith.reflect}</p>
          </div>
        </div>
      </section>

      {/* ── 12. A FINAL WORD ────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.final.eyebrow}</p>
          <h2>{c.final.title}</h2>
          {c.final.paras.map((p, i) => (
            <p key={i} style={i === c.final.paras.length - 1 ? { marginBottom: 0 } : undefined}>{rich(p)}</p>
          ))}
        </div>
      </section>

      {/* ── 13. KEY TAKEAWAYS ───────────────────────────────────────────────── */}
      <section className="ic-sec ic-b">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.takeaways.eyebrow}</p>
          <h2>{c.takeaways.title}</h2>
          <ol className="ic-take">
            {c.takeaways.items.map((k, i) => (
              <li key={i}>
                <span className="ic-num" aria-hidden="true">{i + 1}</span>
                <div>{k}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 14. DIG DEEPER ──────────────────────────────────────────────────── */}
      <section className="ic-sec ic-a">
        <div className="ic-wrap">
          <p className="ic-eyebrow">{c.dig.eyebrow}</p>
          <h2>{c.dig.title}</h2>
          <div className="ic-acc">
            {c.dig.panels.map((panel) => {
              const isOpen = !!openPanels[panel.id];
              const panelId = `ic-panel-${panel.id}`;
              const btnId = `ic-btn-${panel.id}`;
              return (
                <div className="ic-acc-item" key={panel.id}>
                  <button
                    id={btnId}
                    type="button"
                    className="ic-acc-btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => togglePanel(panel.id)}
                  >
                    <span>{panel.title}</span>
                    <svg className="ic-chev" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>
                  <div id={panelId} role="region" aria-labelledby={btnId} className={`ic-acc-panel${isOpen ? " open" : ""}`}>
                    <div>
                      <div className="ic-acc-inner">
                        {panel.body.map((p, i) => (
                          <p key={i} style={i === panel.body.length - 1 ? { marginBottom: 0 } : undefined}>{rich(p)}</p>
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

      {/* ── 15. SOURCES ─────────────────────────────────────────────────────── */}
      <SourcesDropdown sources={c.sources} lang="en" markerStyle="number" background={lightGray} />
    </div>
  );
}
