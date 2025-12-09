export const SECTION_FADE = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.6 },
};

export const createSmallStagger = (index) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.45, delay: index * 0.06 },
});

export const OFFER_ITEMS = [
  {
    id: "classes",
    tag: "Openroot Classes",
    title: "Learn Skills That Actually Help",
    intro:
      "Openroot Classes is our education arm — a financial-literacy and investing-education initiative for students, beginners, and MSMEs who want practical skills, not just theory.",
    paragraphs: [
      "We believe high-quality, in-depth learning shouldn’t break the bank. That’s why our programs are affordable, ad-free, and transparent, with a deep focus on real-life application instead of textbook-style content.",
    ],
    subheading: "Our expert-led programs include:",
    listItems: [
      {
        id: "prompt-engineering",
        text: "Prompt Engineering — Learn how to design AI workflows and automations that can help in content creation, data handling, business operations, and day-to-day productivity.",
      },
      {
        id: "financial-investing",
        text: "Financial Investing — Understand wealth-building fundamentals, risk management, and long-term investing strategies so you can make confident financial decisions instead of guessing or following hype.",
      },
    ],
    note: "Our goal is simple — to make people future-ready by combining technology, financial literacy, and practical skill-building in one place.",
  },
  {
    id: "software-solutions",
    tag: "Software Solutions",
    title: "Software Built for Real-World Businesses",
    intro:
      "Under Software Solutions, we design and build custom digital tools, web apps, and automation systems for micro and small enterprises that need strong online systems at practical, sustainable pricing.",
    paragraphs: [
      "Our work is focused on enabling businesses that often don’t have access to expensive software, in-house tech teams, or complex tools — but still need reliable, long-term digital systems to grow.",
    ],
    subheading: "We help MSMEs with:",
    listItems: [
      {
        id: "business-automation",
        text: "Business automation to reduce repetitive manual tasks and save time.",
      },
      {
        id: "custom-apps",
        text: "Custom applications & portals built specifically for their workflows instead of forcing them to adjust to generic tools.",
      },
      {
        id: "practical-architectures",
        text: "Practical, scalable architectures designed to grow with the business without unnecessary complexity.",
      },
    ],
    note: "Every solution is meant to be understandable, maintainable, and truly helpful — not just impressive on paper.",
  },
];

export const REASON_ITEMS = [
  {
    id: "user-first",
    title: "User-First Always",
    body: "No ads. No gimmicks. No dark patterns. We focus on building trust by respecting user time, data, and attention.",
  },
  {
    id: "transparent-pricing",
    title: "Transparent & Accessible Pricing",
    body: "We design high-value solutions for students and small businesses at prices that make sense for them, not just for big companies.",
  },
  {
    id: "small-team",
    title: "Small Team, Big Impact",
    body: "We are a lean, focused team that loves building tools that solve concrete problems instead of chasing trends.",
  },
  {
    id: "education-empowerment",
    title: "Education & Empowerment",
    body: "We don’t just give tools — we teach people how to use technology, AI, and investing methods to create real change in their own lives.",
  },
];
