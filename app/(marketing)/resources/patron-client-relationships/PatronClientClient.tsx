"use client";

import React, { useState, useTransition } from "react";
import { saveResourceToDashboard } from "../actions";
import SourcesDropdown from "@/components/SourcesDropdown";

/* ── Tokens ───────────────────────────────────────────── */
const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const offWhite = "oklch(96% 0.005 80)";
const lightGray = "oklch(88% 0.008 80)";
const bodyText = "oklch(38% 0.05 260)";
const mutedText = "oklch(48% 0.04 260)";
const heroSub = "oklch(72% 0.04 260)";
const heroIntro = "oklch(82% 0.025 80)";
const savedBg = "oklch(35% 0.05 260)";
const white = "#ffffff";
const hairline = "oklch(84% 0.01 260)";
const serif = "Cormorant Garamond, Georgia, serif";
const sans = "Montserrat, sans-serif";

const SLUG = "patron-client-relationships";

/* ── Content (EN only for now; add `id` later) ───────────── */
type PartKey = "patron" | "client" | "broker" | "down" | "up" | "entrusted";

const CONTENT = {
  en: {
    hero: {
      eyebrow: "Culture · Guide",
      title: "Patron-Client Relationships",
      subtitle: "The unwritten give-and-take",
      intro:
        "In much of the world, help moves through people rather than through forms. Someone with more resources helps someone with fewer, and the help is answered over the years with loyalty and support. This module explains how that system works, why it makes good sense to the people inside it, and where its limits lie for a leader.",
      save: "Save to Dashboard",
      saved: "Saved to Dashboard",
    },
    what: {
      eyebrow: "The Concept",
      title: "What a Patron-Client Relationship Is",
      paras: [
        "A patron-client relationship is a lasting personal bond between two people of unequal power or resources. The patron has something the client needs: money, work, access to officials, protection, or a good word in the right place. The client offers something back, such as loyalty, labour, public support or useful information. The political scientist James Scott described the relationship as an exchange between people of unequal status, and used it to explain much of political life in Southeast Asia.¹",
        "The sociologists Shmuel Eisenstadt and Luis Roniger compared these ties across many societies. They treated them as a distinct kind of relationship, built on trust as well as on unequal status and mutual obligation.² It sits somewhere between friendship and a business deal. It has the warmth and loyalty of a friendship, but the two people are not equals. It involves exchange, like a deal, but the terms are seldom written down and the account is seldom closed.",
      ],
      featuresLabel: "Four features",
      features: [
        { title: "Unequal", text: "One side controls more of what both sides need. The gap can be money, position, education, age or connections." },
        { title: "Reciprocal", text: "Help moves in both directions, though each side gives something different. Both carry obligations to the other." },
        { title: "Personal", text: "The bond is between these two people, or their families, rather than between a role and a customer. If either person changes, the relationship has to be built again." },
        { title: "Long-term", text: "It is meant to last. Favours are remembered over years, sometimes across generations, and the balance is rarely settled in full." },
      ],
      namesTitle: "Many places, many names",
      names: [
        "Most languages have a word for getting things done through personal connections. A study of managers in five nations compared guanxi in China, wasta in the Arab world, jeitinho in Brazil, svyazi in Russia and “pulling strings” in Britain. The managers saw these as distinct but related practices.⁴",
        "Wasta has its own book-length study, which describes it as a hidden force in daily life across the Middle East.¹⁴ In Indonesia, research on public-sector leadership describes a strong expectation that leaders act as caring father figures, a pattern often called bapakisme.¹¹ The details differ from place to place. The underlying pattern is very widely shared.",
      ],
    },
    parts: {
      eyebrow: "Explore",
      title: "The Parts of the Relationship",
      intro: "The relationship has a few moving parts: the people involved, and what moves between them. Select each part to read what it does.",
      peopleLabel: "The people",
      flowsLabel: "What moves between them",
      items: {
        patron: {
          label: "Patron",
          short: "Holds the resources",
          text: [
            "The person with more resources or influence. A patron might be a landowner, an employer, a senior relative, an official, a pastor or a respected elder. What makes someone a patron is control over things other people need, such as jobs, money, introductions or protection.¹ ²",
            "A patron's standing grows with the number of people who depend on them and speak well of them. Giving is therefore one of the main ways a patron builds honour.",
          ],
        },
        client: {
          label: "Client",
          short: "Receives help, gives support",
          text: [
            "The person who receives help and gives something different in return. Clients offer loyalty, work, information and public support, and in political settings, votes.¹ ³",
            "A client has some power too. A patron with no clients has no following. In many settings a client who is treated badly can look for another patron, although that is much easier in some places than in others.",
          ],
        },
        broker: {
          label: "Broker",
          short: "Connects the two",
          text: [
            "Someone who stands between a patron and a client and links them. A broker might be a local leader who connects residents to a district official, or a manager who connects staff to an owner.¹ ²",
            "Brokers are often clients to the people above them and patrons to the people below them at the same time. Their value lies largely in who they know.",
          ],
        },
        down: {
          label: "Downward flow",
          short: "From patron to client",
          text: [
            "What moves from patron to client. Some of it is material: money, loans, jobs, school fees, medical costs, land. Some of it is less visible: protection, advice, introductions, and speaking up for the client when trouble comes.",
            "Downward help often arrives at moments of need, which is one reason it is remembered for so long.",
          ],
        },
        up: {
          label: "Upward flow",
          short: "From client to patron",
          text: [
            "What moves from client to patron: loyalty, labour, availability when needed, information, respect in public, and a good word that adds to the patron's reputation.",
            "Much of this is honour rather than goods. It is still real value, because a patron's standing depends on it.",
          ],
        },
        entrusted: {
          label: "Entrusted resources",
          short: "Held for others",
          text: [
            "Resources the patron controls but does not own: a public budget, an organisation's jobs, a church's funds, a seat on a hiring panel. This is the part that deserves the closest attention.",
            "When a patron gives their own money, the gift is theirs to give. When they spend what has been entrusted to them in return for personal loyalty, the relationship crosses into what Transparency International calls corruption.¹³",
          ],
        },
      } as Record<PartKey, { label: string; short: string; text: string[] }>,
    },
    exchange: {
      eyebrow: "How It Works",
      title: "Two Currencies and an Open Account",
      blocks: [
        {
          h: "Unlike things are traded",
          p: [
            "Patron and client exchange different kinds of value. The patron mainly gives material and practical help. The client mainly gives social goods: loyalty, honour, availability and reputation. Because the two sides give such different things, there is no simple way to say when the account is even. That is part of how the system holds together.",
          ],
        },
        {
          h: "The debt stays open",
          p: [
            "The anthropologist Marcel Mauss argued that gifts carry linked duties: to give, to receive and to return.⁵ A favour repaid at once, in exactly the same amount, can close a relationship, much as a shop purchase does. A favour that stays partly unpaid keeps the relationship going.",
            "Some favours are expected back soon and in kind. Others are left open on purpose, so that both people stay connected.⁵ ⁶ Seen from inside this system, paying straight back for a kindness can feel cold, and refusing a gift can feel like refusing a friendship.",
          ],
        },
        {
          h: "Reciprocity is a moral rule",
          p: [
            "The sociologist Alvin Gouldner described reciprocity as a near-universal moral norm: people feel they should help those who have helped them.⁶ He also pointed to its uneven side. When one party is much more powerful, the weaker party can be pressed to give back more than they received.⁶ This helps explain why a small favour from someone in authority can feel heavy to the person who receives it.",
          ],
        },
        {
          h: "Different ties, different rules",
          p: [
            "The psychologist Kwang-kuo Hwang, writing about Chinese social life, described how people apply different exchange rules depending on the tie.¹² With close family, help follows need. With familiar people such as colleagues, neighbours and friends of friends, help follows mutual favour, and this is where most patron-client exchange happens. With strangers, exchange follows calculation, much like a market.¹²",
            "A leader who treats workplace ties mainly as the third kind may find that colleagues treat them as the second. Both are acting in good faith, by different rules.",
          ],
        },
        {
          h: "Why the system persists",
          p: [
            "Patron-client ties tend to matter most where formal systems are thin or hard to reach: where bank loans, insurance, public services, courts or job markets do not serve ordinary people well. In those settings a patron becomes a source of credit, protection and access. For the client, a good patron is a form of security. For the patron, a loyal circle is a form of standing and support.",
            "Both people are acting sensibly within the options they have. This is why it helps to see patronage as a working social system that solves real problems. Like any system that runs on unequal power, it can also be bent.",
          ],
        },
      ],
    },
    compare: {
      eyebrow: "Side by Side",
      title: "Patronage, Contract and Misuse Compared",
      intro: "Three kinds of exchange are easily confused, especially by someone looking in from outside. The table sets them next to each other.",
      cols: ["Patron-client relationship", "Contract or market exchange", "Misuse of entrusted power"],
      rows: [
        { label: "Basis", cells: ["Personal trust and mutual obligation between unequal people", "Agreed terms between parties who can each walk away", "Power held on behalf of others, used for private gain"] },
        { label: "Duration", cells: ["Long-term and often open-ended", "Ends when the terms are met", "Lasts while it stays hidden or tolerated"] },
        { label: "What is exchanged", cells: ["Practical help for loyalty, honour and support", "Goods, services or labour for an agreed price", "Shared or public resources for personal loyalty, money or favours"] },
        { label: "Who benefits", cells: ["Both people, though unevenly", "Both parties, on stated terms", "The insiders to the arrangement"] },
        { label: "Who bears the cost", cells: ["Mostly the two people involved; the weaker side may give more than it gets", "The parties themselves, as agreed", "People outside it: taxpayers, other applicants, members, donors"] },
      ],
      after: [
        "The first two columns are both legitimate ways of organising life. The third is where the harm lies. Transparency International defines corruption as “the abuse of entrusted power for private gain”.¹³ A private patron helping a private client with their own means does not fit that definition.",
        "Allen Hicken's review of clientelism offers a useful test: is the benefit aimed at particular individuals, and does it depend on something being returned?³ When the answer to both is yes, and the resources belong to others, the relationship has moved into the third column.",
      ],
    },
    strengths: {
      eyebrow: "Strengths and Risks",
      title: "What It Does Well, and Where It Can Go Wrong",
      goodLabel: "What it does well",
      good: [
        { h: "It carries people through hard times", p: "A patron can cover a hospital bill, a school fee or a funeral when other help is missing or slow." },
        { h: "It builds lasting trust", p: "Because the bond is personal and long, both people have reasons to keep faith with each other.²" },
        { h: "It lowers risk where records are weak", p: "Hiring someone who is known to a trusted person is a way of checking character when references are hard to verify.⁴ ¹¹" },
        { h: "It gives leaders a way to show care", p: "In many cultures a good leader is expected to attend weddings and funerals, remember families and step in when there is trouble. Staff judge leaders on that care as well as on results.⁹ ¹⁰" },
      ],
      riskLabel: "Where it can go wrong",
      risk: [
        { h: "Dependency", p: "When a client relies on one patron for everything, the client loses the freedom to disagree, to move or to grow. Help that only relieves need, without building capacity, can keep someone dependent for years." },
        { h: "Pressure on the weaker side", p: "Loyalty can turn into silence. A client may hide bad news, back a poor decision or give more time than is fair, because saying no feels like breaking the bond.⁶" },
        { h: "Exclusion", p: "People outside the circle lose out. A job filled through a personal tie is a job others could not apply for. Over time, people without connections may conclude that effort counts for less than access." },
        { h: "Crossing the line", p: "The most serious risk is the one in the third column: using entrusted resources to reward personal loyalty. The five-nation study found that influence through connections was reported more often where people held self-enhancement values and accepted corruptibility in business.⁴ The pattern itself is widespread. How often it tips into harm depends on context and choices, rather than on the character of a nation." },
      ],
    },
    myths: {
      eyebrow: "Common Misunderstandings",
      title: "Five Ideas Worth Correcting",
      items: [
        { claim: "“Patronage is simply corruption.”", answer: "Generosity and loyalty are not the problem. The harm lies in spending entrusted power for private loyalty, and in shutting others out.³ ¹³" },
        { claim: "“This belongs to poorer countries.”", answer: "Informal influence exists in wealthy societies too. The five-nation study placed Britain's “pulling strings” alongside the other practices.⁴ What changes from place to place is how visible it is and what it is called." },
        { claim: "“People who ask for help are being manipulative.”", answer: "A request is often a sign of trust, a way of saying: you are someone I can ask. Leaders from contract-based cultures sometimes hear manipulation where the other person means relationship. This misreading is widely reported by people who work across cultures. It rests on field accounts and experience rather than on a single measured study.¹⁴" },
        { claim: "“A good leader treats every person identically.”", answer: "Equal treatment and fair treatment can differ. In a relational setting, identical treatment can come across as coldness, while hidden special treatment comes across as favouritism. Fairness here usually means open rules that apply to all, combined with genuine personal care." },
        { claim: "“Fatherly leadership is simply good, or simply bad.”", answer: "The research gives a mixed picture. A major review found the concept unclear and the findings contradictory.⁸ A six-country study found that the ideal of a caring, fatherly leader overlaps more with authoritarian leadership in hierarchical, collectivist cultures than in more egalitarian ones.¹⁰ Context matters a great deal." },
      ],
    },
    leaders: {
      eyebrow: "For Leaders",
      title: "When You Are Seen as a Patron",
      intro: [
        "Leaders who bring a salary, an education, an organisation's budget or international connections are often seen as patrons, whether they intend it or not. Staff and neighbours may bring requests for loans, school fees, jobs for relatives or help with officials. Refusing everything can look like refusing the relationship. Agreeing to everything can drain the leader and create unfairness. The principles below can help hold both concerns together.",
      ],
      principles: [
        { h: "Read the request before you answer it", p: "Ask yourself whether this is a need, a test of the relationship, or both. Respond to the person first and the policy second. A warm response to the person can sit alongside a clear limit on what you are able to do." },
        { h: "Know whose resources you are spending", p: "Your own money, time and network are yours to give. Your organisation's jobs, funds and decisions are held in trust for others. Keep personal generosity separate from organisational decisions, so that loyalty to you does not buy access to what belongs to the whole organisation." },
        { h: "Give in ways that build people up", p: "Help that builds capacity, such as a loan with a repayment plan, training or an introduction, tends to leave people stronger than relief alone. Be open about what, if anything, you expect in return. Keep it small, and leave a person's conscience and vote out of it." },
        { h: "Make it safe to say no", p: "Healthy help comes without hidden strings. Say so plainly, and show it by treating people the same way after they have disagreed with you." },
        { h: "Set limits with warmth", p: "One useful form is “yes to you, no to this method”, followed by an alternative: a transparent hardship fund with clear criteria, a salary advance repaid through payroll, or a referral to someone better placed to help. Apply the same limit to each person, so that favour does not happen in secret." },
      ],
      questionsTitle: "Three Questions Before You Give",
      questionsNote: "A practical check for leaders. It is a working tool, not a research instrument.",
      questions: [
        "Whose resources am I spending?",
        "Would I be comfortable if all the people affected could see this?",
        "Who is not in the room that this decision touches?",
      ],
      paternal: [
        "Research on paternalistic leadership describes three parts: benevolence, moral example and authority.⁹ A study of Indonesian civil servants found a similar pattern, with care and moral example sitting alongside visible authority, rooted in Javanese values.¹¹ The healthier forms lean on the first two. The risks grow when authority carries the weight on its own.",
      ],
    },
    faith: {
      eyebrow: "Faith Anchor",
      title: "A Gift Without a Hook",
      paras: [
        "The New Testament was written in a world shaped by patronage. Scholars such as David deSilva and Frederick Danker have shown how words like grace, gift and benefactor belonged to everyday public life, and how the early Christians used that vocabulary to speak about God.⁷ ¹⁵",
      ],
      verse:
        "When you make a dinner or a supper, don't call your friends, nor your brothers, nor your kinsmen, nor rich neighbors, or perhaps they might also return the favor, and pay you back. But when you make a feast, ask the poor, the maimed, the lame, or the blind; and you will be blessed, because they don't have the resources to repay you.",
      verseRef: "Luke 14:12-14 (WEB)",
      after: [
        "In the patronage of that time, a gift usually bound the receiver to return it in some form. Jesus tells a host to invite the people who cannot repay. John Barclay's study of the gift in Paul's letters argues that Paul understood God's grace as a gift given without regard to whether the receiver was worthy of it.¹⁶ The fitting response is gratitude and a changed life rather than repayment.⁷ ¹⁶",
        "For a leader who is seen as a patron, this offers a quiet standard. Generosity is good. Generosity that leaves people free, and keeps no ledger, comes closer to the grace Christians believe they have received.",
      ],
    },
    reflect: {
      eyebrow: "Reflection",
      title: "Take a Few Minutes",
      prompt: "Who has been a patron to me, who am I a patron to, and what does each of us quietly owe?",
      note: "You may find it helpful to write down the names that come to mind, and what you hope each relationship looks like a year from now.",
    },
    final: {
      eyebrow: "A Final Word",
      paras: [
        "Patron-client relationships are one of the oldest ways people have found to share resources and look after each other across a gap in power. Many leaders working across cultures will find themselves inside such a system, sometimes as clients and often as patrons.",
        "Understanding it lets you honour the trust behind a request, give in ways that strengthen people, and keep a clear line around what has been entrusted to you. Warmth and clarity together tend to earn respect in a great many cultures.",
      ],
    },
    takeaways: {
      eyebrow: "Key Takeaways",
      title: "What to Carry Forward",
      items: [
        "Patron-client relationships are lasting, personal bonds between unequal people, in which practical help flows one way and loyalty and honour flow the other.",
        "The system meets real needs, especially where formal institutions are thin, and some form of it exists in most societies, wealthy ones included.",
        "A request for help is often a sign of trust as well as a need. Read it before you answer it.",
        "The line is crossed when someone spends entrusted resources, such as an organisation's jobs or funds, to reward personal loyalty.",
        "A healthy patron builds people up, asks little in return and makes it safe to say no, giving in the spirit of a gift without a hook.",
      ],
    },
    deeper: {
      eyebrow: "Dig Deeper",
      title: "For Those Who Want More",
      panels: [
        {
          h: "The classic studies: Scott, Eisenstadt and Roniger",
          p: [
            "James Scott's 1972 paper took Southeast Asia as its main case. It treated the patron-client pair as the basic unit of much political life in the region, and linked changes in these ties to wider political change and to periods of economic and political stress.¹",
            "Eisenstadt and Roniger widened the lens. Their comparative study, subtitled Interpersonal Relations and the Structure of Trust in Society, places patron-client ties alongside friendship and other personal bonds, and asks how each one organises trust in a society.²",
            "Later political science narrowed the focus to “clientelism”. Hicken's review describes it by two features: benefits targeted at particular people, and exchange that depends on a return, such as a vote or public support.³ This is the version of patronage most often linked to public harm.",
          ],
        },
        {
          h: "Face and favour: how the rules change with the tie",
          p: [
            "Kwang-kuo Hwang's model starts from the person who holds resources and receives a request. That person decides how to respond partly by looking at the kind of tie they share with the one asking.¹²",
            "Close family ties run on need. Ties with familiar people run on mutual favour, where face and the memory of past help shape what is fair. Ties with strangers run on calculation.¹² The middle category is where most patron-client exchange sits, and where outsiders most often misjudge what is expected.",
            "Hwang developed the model from Chinese social life. Its broad idea, that exchange rules depend on the relationship, is a helpful lens in many other settings, though the details will differ from culture to culture.",
          ],
        },
        {
          h: "Paternalistic leadership: the mixed evidence",
          p: [
            "Cheng and colleagues described paternalistic leadership in Chinese organisations as combining benevolence, moral example and authority, and studied how staff respond to each part.⁹",
            "A broad review by Pellegrini and Scandura found the idea promising but loosely defined, with findings that point in different directions.⁸ Aycan and colleagues compared how people in six countries picture a paternalistic leader, and found that the picture overlaps more with authoritarian leadership in hierarchical, collectivist cultures than in egalitarian ones.¹⁰",
            "In Indonesia, Irawanto, Ramsey and Tweed explored paternalistic leadership in the public sector and found that the model fits there, with benevolence and moral example sitting alongside visible authority.¹¹ Taken together, the research suggests that care from a leader is welcomed in many places, while the weight given to authority varies a great deal.",
          ],
        },
        {
          h: "The biblical world of benefactors",
          p: [
            "deSilva's introduction to New Testament culture treats patronage as one of the keys to reading the text, and explains grace in the vocabulary of benefaction.⁷ Danker's earlier study traced the language of benefactors through Greek inscriptions and the New Testament.¹⁵ Barclay showed that ancient gifts usually came with an expected return, and argued that Paul's account of grace breaks that expectation because it is given without regard to worth.¹⁶",
            "Two passages reward a slow reading with this background. In Luke 7:1-10, local elders speak for a Roman centurion who built their synagogue, a benefactor with real standing, yet he describes himself as unworthy and simply trusts the word of Jesus. In Philemon, Paul writes to a man of standing on behalf of Onesimus, using the language of relationship, honour and debt, and offers to cover any wrong himself, while leaving the decision with Philemon.⁷ ¹⁶",
          ],
        },
      ],
    },
    sourcesHeading: "Sources",
  },
};

const SOURCES: string[] = [
  "Scott, J. C. (1972). Patron-Client Politics and Political Change in Southeast Asia. American Political Science Review, 66(1), 91-113.",
  "Eisenstadt, S. N., & Roniger, L. (1984). Patrons, Clients and Friends: Interpersonal Relations and the Structure of Trust in Society. Cambridge University Press.",
  "Hicken, A. (2011). Clientelism. Annual Review of Political Science, 14, 289-310. https://doi.org/10.1146/annurev.polisci.031908.220508",
  "Smith, P. B., Torres, C., Leong, C.-H., Budhwar, P., Achoui, M., & Lebedeva, N. (2012). Are indigenous approaches to achieving influence in business organizations distinctive? A comparative study of guanxi, wasta, jeitinho, svyazi and pulling strings. International Journal of Human Resource Management, 23(2), 333-348.",
  "Mauss, M. (1925). Essai sur le don. English translation: The Gift (trans. W. D. Halls). Routledge, 1990.",
  "Gouldner, A. W. (1960). The norm of reciprocity: A preliminary statement. American Sociological Review, 25(2), 161-178.",
  "deSilva, D. A. (2000). Honor, Patronage, Kinship & Purity: Unlocking New Testament Culture. InterVarsity Press.",
  "Pellegrini, E. K., & Scandura, T. A. (2008). Paternalistic leadership: A review and agenda for future research. Journal of Management, 34(3), 566-593. https://doi.org/10.1177/0149206308316063",
  "Cheng, B.-S., Chou, L.-F., Wu, T.-Y., Huang, M.-P., & Farh, J.-L. (2004). Paternalistic leadership and subordinate responses: Establishing a leadership model in Chinese organizations. Asian Journal of Social Psychology, 7(1), 89-117. https://doi.org/10.1111/j.1467-839X.2004.00137.x",
  "Aycan, Z., Schyns, B., Sun, J.-M., Felfe, J., & Saher, N. (2013). Convergence and divergence of paternalistic leadership: A cross-cultural investigation of prototypes. Journal of International Business Studies, 44(9), 962-969.",
  "Irawanto, D. W., Ramsey, P. L., & Tweed, D. C. (2012). Exploring paternalistic leadership and its application to the Indonesian public sector. International Journal of Leadership in Public Services, 8(1), 4-20. https://doi.org/10.1108/17479881211230637",
  "Hwang, K.-K. (1987). Face and favor: The Chinese power game. American Journal of Sociology, 92(4), 944-974. https://doi.org/10.1086/228588",
  "Transparency International. What is corruption? https://www.transparency.org/en/what-is-corruption",
  "Cunningham, R. B., & Sarayrah, Y. K. (1993). Wasta: The Hidden Force in Middle Eastern Society. Praeger.",
  "Danker, F. W. (1982). Benefactor: Epigraphic Study of a Graeco-Roman and New Testament Semantic Field. Clayton Publishing House.",
  "Barclay, J. M. G. (2015). Paul and the Gift. Eerdmans.",
];

const PART_ORDER_PEOPLE: PartKey[] = ["patron", "broker", "client"];
const PART_ORDER_FLOWS: PartKey[] = ["down", "up", "entrusted"];

/* ── Helpers ──────────────────────────────────────────── */
function cite(text: string): React.ReactNode {
  const parts = text.split(/([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g);
  return parts.map((part, i) =>
    /^[⁰¹²³⁴⁵⁶⁷⁸⁹]+$/.test(part) ? (
      <span key={i} style={{ color: orange, fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

const eyebrowStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: orange,
  margin: "0 0 12px",
};

const h2Style: React.CSSProperties = {
  fontFamily: serif,
  fontSize: "clamp(30px, 4.2vw, 44px)",
  lineHeight: 1.12,
  fontWeight: 600,
  color: navy,
  margin: "0 0 24px",
};

const h3Style: React.CSSProperties = {
  fontFamily: serif,
  fontSize: "1.55rem",
  lineHeight: 1.2,
  fontWeight: 600,
  color: navy,
  margin: "0 0 10px",
};

const pStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: "1.0rem",
  lineHeight: 1.75,
  color: bodyText,
  margin: "0 0 18px",
};

const container: React.CSSProperties = { maxWidth: 860, margin: "0 auto" };

function Section({ bg, children, id }: { bg: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} style={{ background: bg, padding: "88px 24px" }} className="pc-section">
      <div style={container}>{children}</div>
    </section>
  );
}

/* ── Component ────────────────────────────────────────── */
type Props = { isSaved: boolean };

export default function PatronClientClient({ isSaved: initialSaved }: Props) {
  const c = CONTENT.en;
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();
  const [activePart, setActivePart] = useState<PartKey>("patron");
  const [openPanel, setOpenPanel] = useState<number | null>(null);

  function handleSave() {
    if (saved) return;
    startTransition(async () => {
      await saveResourceToDashboard(SLUG);
      setSaved(true);
    });
  }

  const part = c.parts.items[activePart];

  const partButton = (key: PartKey) => {
    const item = c.parts.items[key];
    const active = key === activePart;
    return (
      <button
        key={key}
        type="button"
        className="pc-part"
        aria-pressed={active}
        aria-controls="pc-part-detail"
        onClick={() => setActivePart(key)}
        style={{
          background: active ? navy : white,
          color: active ? white : navy,
          border: `1px solid ${active ? navy : hairline}`,
        }}
      >
        <span style={{ display: "block", fontFamily: serif, fontSize: "1.35rem", fontWeight: 600, lineHeight: 1.2 }}>
          {item.label}
        </span>
        <span
          style={{
            display: "block",
            fontFamily: sans,
            fontSize: "0.8rem",
            marginTop: 4,
            color: active ? heroSub : mutedText,
          }}
        >
          {item.short}
        </span>
      </button>
    );
  };

  return (
    <div style={{ fontFamily: sans, background: offWhite }}>
      <style>{`
        .pc-part { text-align: left; padding: 16px 18px; border-radius: 10px; cursor: pointer; min-height: 44px; transition: background .2s, color .2s, border-color .2s; }
        .pc-part:focus-visible, .pc-acc-btn:focus-visible, .pc-save:focus-visible { outline: 3px solid ${orange}; outline-offset: 2px; }
        .pc-part-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .pc-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .pc-table { width: 100%; border-collapse: separate; border-spacing: 0; background: ${white}; border: 1px solid ${hairline}; border-radius: 12px; overflow: hidden; }
        .pc-table th, .pc-table td { padding: 14px 16px; text-align: left; vertical-align: top; font-family: ${sans}; font-size: 0.92rem; line-height: 1.55; color: ${bodyText}; border-bottom: 1px solid ${hairline}; }
        .pc-table thead th { background: ${navy}; color: ${white}; font-weight: 600; font-size: 0.85rem; }
        .pc-table tbody th { color: ${navy}; font-weight: 700; width: 18%; }
        .pc-table tbody tr:last-child th, .pc-table tbody tr:last-child td { border-bottom: none; }
        .pc-acc-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
        .pc-acc-panel.open { grid-template-rows: 1fr; }
        .pc-acc-panel > div { overflow: hidden; }
        .pc-chev { width: 20px; height: 20px; flex-shrink: 0; transition: transform .3s ease; }
        .pc-chev.open { transform: rotate(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .pc-acc-panel, .pc-chev, .pc-part { transition: none; }
        }
        @media (max-width: 720px) {
          .pc-section { padding: 64px 16px !important; }
          .pc-hero { padding: 72px 16px 64px !important; }
          .pc-part-grid { grid-template-columns: 1fr; }
          .pc-two { grid-template-columns: 1fr; }
          .pc-table, .pc-table tbody, .pc-table tr, .pc-table th, .pc-table td { display: block; width: 100%; }
          .pc-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
          .pc-table tbody tr { border-bottom: 1px solid ${hairline}; padding: 4px 0; }
          .pc-table tbody tr:last-child { border-bottom: none; }
          .pc-table tbody th { background: ${lightGray}; width: 100%; border-bottom: none; }
          .pc-table td { border-bottom: none; padding: 8px 16px; }
          .pc-table td::before { content: attr(data-label); display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${mutedText}; margin-bottom: 2px; }
        }
      `}</style>

      {/* ── Hero ── */}
      <section className="pc-hero" style={{ background: navy, padding: "96px 24px 88px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.hero.eyebrow}</p>
          <h1
            style={{
              fontFamily: serif,
              fontSize: "clamp(40px, 6vw, 72px)",
              lineHeight: 1.08,
              fontWeight: 600,
              color: white,
              margin: "0 0 14px",
            }}
          >
            {c.hero.title}
          </h1>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(22px, 2.6vw, 30px)", color: heroSub, margin: "0 0 28px" }}>
            {c.hero.subtitle}
          </p>
          <div aria-hidden="true" style={{ width: 48, height: 1, background: orange, margin: "0 0 28px" }} />
          <p
            style={{
              fontFamily: serif,
              fontStyle: "italic",
              fontSize: "1.3rem",
              lineHeight: 1.6,
              color: heroIntro,
              margin: "0 0 36px",
              maxWidth: 680,
            }}
          >
            {c.hero.intro}
          </p>
          <button
            type="button"
            className="pc-save"
            onClick={handleSave}
            disabled={isPending || saved}
            aria-pressed={saved}
            aria-label={saved ? c.hero.saved : c.hero.save}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              minHeight: 44,
              padding: "10px 22px",
              borderRadius: 999,
              border: "none",
              background: saved ? savedBg : orange,
              color: white,
              fontFamily: sans,
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: saved ? "default" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path
                d="M6 3h12v18l-6-4.5L6 21z"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
            <span>{saved ? c.hero.saved : c.hero.save}</span>
          </button>
        </div>
      </section>

      {/* ── What it is ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.what.eyebrow}</p>
        <h2 style={h2Style}>{c.what.title}</h2>
        {c.what.paras.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
        <p style={{ ...eyebrowStyle, color: mutedText, margin: "36px 0 14px" }}>{c.what.featuresLabel}</p>
        <div className="pc-two">
          {c.what.features.map((f) => (
            <div key={f.title} style={{ background: white, border: `1px solid ${hairline}`, borderRadius: 12, padding: "20px 22px" }}>
              <h3 style={{ ...h3Style, fontSize: "1.4rem" }}>{f.title}</h3>
              <p style={{ ...pStyle, fontSize: "0.95rem", margin: 0 }}>{f.text}</p>
            </div>
          ))}
        </div>
        <h3 style={{ ...h3Style, marginTop: 44 }}>{c.what.namesTitle}</h3>
        {c.what.names.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
      </Section>

      {/* ── Parts (the one interaction) ── */}
      <Section bg={lightGray}>
        <p style={eyebrowStyle}>{c.parts.eyebrow}</p>
        <h2 style={h2Style}>{c.parts.title}</h2>
        <p style={pStyle}>{c.parts.intro}</p>

        <p style={{ fontFamily: sans, fontSize: "0.8rem", fontWeight: 700, color: navy, margin: "28px 0 10px" }}>
          {c.parts.peopleLabel}
        </p>
        <div className="pc-part-grid">{PART_ORDER_PEOPLE.map(partButton)}</div>

        <p style={{ fontFamily: sans, fontSize: "0.8rem", fontWeight: 700, color: navy, margin: "22px 0 10px" }}>
          {c.parts.flowsLabel}
        </p>
        <div className="pc-part-grid">{PART_ORDER_FLOWS.map(partButton)}</div>

        <div
          id="pc-part-detail"
          aria-live="polite"
          style={{ background: white, borderRadius: 12, border: `1px solid ${hairline}`, padding: "26px 26px 10px", marginTop: 20 }}
        >
          <h3 style={h3Style}>{part.label}</h3>
          {part.text.map((p, i) => (
            <p key={i} style={pStyle}>{cite(p)}</p>
          ))}
        </div>
      </Section>

      {/* ── How the exchange works ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.exchange.eyebrow}</p>
        <h2 style={h2Style}>{c.exchange.title}</h2>
        {c.exchange.blocks.map((b) => (
          <div key={b.h} style={{ marginBottom: 20 }}>
            <h3 style={h3Style}>{b.h}</h3>
            {b.p.map((p, i) => (
              <p key={i} style={pStyle}>{cite(p)}</p>
            ))}
          </div>
        ))}
      </Section>

      {/* ── Comparison table ── */}
      <Section bg={lightGray}>
        <p style={eyebrowStyle}>{c.compare.eyebrow}</p>
        <h2 style={h2Style}>{c.compare.title}</h2>
        <p style={pStyle}>{c.compare.intro}</p>
        <table className="pc-table" style={{ margin: "12px 0 32px" }}>
          <thead>
            <tr>
              <th scope="col"><span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Aspect</span></th>
              {c.compare.cols.map((col) => (
                <th key={col} scope="col">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.compare.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row">{r.label}</th>
                {r.cells.map((cell, i) => (
                  <td key={i} data-label={c.compare.cols[i]}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {c.compare.after.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
      </Section>

      {/* ── Strengths and risks ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.strengths.eyebrow}</p>
        <h2 style={h2Style}>{c.strengths.title}</h2>
        <h3 style={{ ...h3Style, marginTop: 8 }}>{c.strengths.goodLabel}</h3>
        <div className="pc-two" style={{ marginBottom: 40 }}>
          {c.strengths.good.map((g) => (
            <div key={g.h} style={{ background: white, border: `1px solid ${hairline}`, borderRadius: 12, padding: "20px 22px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, color: navy, fontSize: "0.98rem", margin: "0 0 8px" }}>{g.h}</p>
              <p style={{ ...pStyle, fontSize: "0.95rem", margin: 0 }}>{cite(g.p)}</p>
            </div>
          ))}
        </div>
        <h3 style={h3Style}>{c.strengths.riskLabel}</h3>
        <div className="pc-two">
          {c.strengths.risk.map((g) => (
            <div key={g.h} style={{ background: lightGray, borderRadius: 12, padding: "20px 22px" }}>
              <p style={{ fontFamily: sans, fontWeight: 700, color: navy, fontSize: "0.98rem", margin: "0 0 8px" }}>{g.h}</p>
              <p style={{ ...pStyle, fontSize: "0.95rem", margin: 0 }}>{cite(g.p)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Misunderstandings ── */}
      <Section bg={lightGray}>
        <p style={eyebrowStyle}>{c.myths.eyebrow}</p>
        <h2 style={h2Style}>{c.myths.title}</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {c.myths.items.map((m) => (
            <div key={m.claim} style={{ background: white, borderRadius: 12, padding: "22px 24px" }}>
              <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.35rem", color: navy, margin: "0 0 8px", lineHeight: 1.3 }}>
                {m.claim}
              </p>
              <p style={{ ...pStyle, fontSize: "0.95rem", margin: 0 }}>{cite(m.answer)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── For leaders ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.leaders.eyebrow}</p>
        <h2 style={h2Style}>{c.leaders.title}</h2>
        {c.leaders.intro.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
        <ol style={{ listStyle: "none", padding: 0, margin: "28px 0 40px", display: "grid", gap: 18 }}>
          {c.leaders.principles.map((pr, i) => (
            <li key={pr.h} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, alignItems: "start" }}>
              <span
                aria-hidden="true"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: navy,
                  color: white,
                  fontFamily: sans,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </span>
              <div>
                <p style={{ fontFamily: sans, fontWeight: 700, color: navy, fontSize: "1rem", margin: "6px 0 6px" }}>{pr.h}</p>
                <p style={{ ...pStyle, margin: 0 }}>{pr.p}</p>
              </div>
            </li>
          ))}
        </ol>

        <div style={{ background: navy, borderRadius: 14, padding: "30px 28px", margin: "0 0 36px" }}>
          <h3 style={{ ...h3Style, color: white }}>{c.leaders.questionsTitle}</h3>
          <p style={{ fontFamily: sans, fontSize: "0.85rem", color: heroSub, margin: "0 0 18px" }}>{c.leaders.questionsNote}</p>
          <ol style={{ margin: 0, paddingLeft: 22 }}>
            {c.leaders.questions.map((q) => (
              <li key={q} style={{ fontFamily: serif, fontSize: "1.35rem", lineHeight: 1.4, color: white, marginBottom: 8 }}>
                {q}
              </li>
            ))}
          </ol>
        </div>

        {c.leaders.paternal.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
      </Section>

      {/* ── Faith Anchor ── */}
      <Section bg={lightGray}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M12 3v18M6 9h12" fill="none" stroke={orange} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p style={{ ...eyebrowStyle, margin: 0 }}>{c.faith.eyebrow}</p>
        </div>
        <h2 style={h2Style}>{c.faith.title}</h2>
        {c.faith.paras.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
        <blockquote style={{ background: white, borderRadius: 12, padding: "24px 26px", margin: "8px 0 26px" }}>
          <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "1.35rem", lineHeight: 1.5, color: navy, margin: "0 0 10px" }}>
            “{c.faith.verse}”
          </p>
          <footer style={{ fontFamily: sans, fontSize: "0.85rem", fontWeight: 600, color: mutedText }}>{c.faith.verseRef}</footer>
        </blockquote>
        {c.faith.after.map((p, i) => (
          <p key={i} style={pStyle}>{cite(p)}</p>
        ))}
      </Section>

      {/* ── Reflection + Final word ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.reflect.eyebrow}</p>
        <h2 style={h2Style}>{c.reflect.title}</h2>
        <p style={{ fontFamily: serif, fontStyle: "italic", fontSize: "clamp(24px, 3vw, 32px)", lineHeight: 1.35, color: navy, margin: "0 0 16px" }}>
          {c.reflect.prompt}
        </p>
        <p style={{ ...pStyle, marginBottom: 56 }}>{c.reflect.note}</p>

        <p style={eyebrowStyle}>{c.final.eyebrow}</p>
        {c.final.paras.map((p, i) => (
          <p key={i} style={pStyle}>{p}</p>
        ))}
      </Section>

      {/* ── Key Takeaways ── */}
      <section className="pc-section" style={{ background: lightGray, padding: "96px 24px" }}>
        <div style={container}>
          <p style={eyebrowStyle}>{c.takeaways.eyebrow}</p>
          <h2 style={{ ...h2Style, fontStyle: "italic" }}>{c.takeaways.title}</h2>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
            {c.takeaways.items.map((t, i) => (
              <li
                key={i}
                style={{ background: white, borderRadius: 12, padding: "20px 22px", display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, alignItems: "start" }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: navy,
                    color: white,
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </span>
                <p style={{ ...pStyle, margin: "6px 0 0" }}>{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Dig Deeper ── */}
      <Section bg={offWhite}>
        <p style={eyebrowStyle}>{c.deeper.eyebrow}</p>
        <h2 style={h2Style}>{c.deeper.title}</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {c.deeper.panels.map((panel, i) => {
            const open = openPanel === i;
            const panelId = `pc-deeper-${i}`;
            return (
              <div key={panel.h} style={{ background: white, border: `1px solid ${hairline}`, borderRadius: 12 }}>
                <button
                  type="button"
                  className="pc-acc-btn"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenPanel(open ? null : i)}
                  style={{
                    width: "100%",
                    minHeight: 44,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "18px 22px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: sans,
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: navy,
                  }}
                >
                  <span>{panel.h}</span>
                  <svg className={`pc-chev${open ? " open" : ""}`} viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
                <div id={panelId} className={`pc-acc-panel${open ? " open" : ""}`} role="region" aria-label={panel.h}>
                  <div>
                    <div style={{ padding: "0 22px 8px", boxSizing: "border-box" }}>
                      {panel.p.map((p, j) => (
                        <p key={j} style={{ ...pStyle, fontSize: "0.97rem" }}>{cite(p)}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── Sources ── */}
      <section className="pc-section" style={{ background: lightGray, padding: "64px 24px" }}>
        <div style={container}>
          <SourcesDropdown sources={SOURCES} lang="en" markerStyle="number" background={lightGray} />
        </div>
      </section>
    </div>
  );
}
