export interface VideoProject {
  key: string;
  title: string;
  description: string;
  poster: string;
  videoUrl: string;
  tags: string[];
}

export interface ProjectThink {
  challenge?: string;
  idea?: string;
  mark?: string;
  craft?: string;
  type?: string;
  pal?: string[];
}

export interface Project {
  key: string;
  name: string;
  cat: string;
  sub: string;
  desc: string;
  quote?: string;
  tags: string[];
  cover: string;
  lqip: string;
  gallery: string[];
  caps: string[];
  think?: ProjectThink;
}

export interface SiteData {
  meta: {
    title: string;
    description: string;
  };
  hero: {
    topLeft: string;
    topLeftDetail: string;
    line1: string;
    line2: string;
    studio: string;
    disciplines: string[];
    basedIn: string;
    volume: string;
  };
  about: {
    lead: string;
    paragraphs: string[];
    services: string[];
    basedList: string[];
    portraitTag: string;
  };
  works: {
    title: string;
    sub: string;
  };
  contact: {
    heading: string;
    email: string;
    instagramHandle: string;
    instagramUrl: string;
    phoneDisplay: string;
    phoneTel: string;
    location: string;
    timeChip: string;
    whatsapp: string;
    whatsappText: string;
    footerA: string;
    footerB: string;
  };
  projects: Project[];
  uiuxVideos: VideoProject[];
}

export const siteData: SiteData = {
  meta: {
    title: "G.VIISUALS, George Charbel · Creative Portfolio",
    description:
      "George Charbel, Graphic & Brand Identity Designer. Branding, packaging & social design. Beirut, Lebanon.",
  },
  hero: {
    topLeft: "George Charbel",
    topLeftDetail: " · Graphic Designer",
    line1: "Creative",
    line2: "Portfolio",
    studio: "G.VIISUALS",
    disciplines: [
      "Brand Identity",
      "Packaging Design",
      "Social Campaigns",
      "Logo Design",
      "Print Design",
    ],
    basedIn: "Beirut, Lebanon",
    volume: "01, 2026",
  },
  about: {
    lead: "Hello, I'm George Charbel, a Graphic & Brand Identity Designer creating <em>meaningful visual experiences.</em>",
    paragraphs: [
      "I specialize in branding, packaging, and social media design, helping businesses communicate their story through strategic, modern, and impactful design solutions.",
      "Working across Arabic and Latin scripts from Beirut, I build brand systems rooted in the MENA region and held to an international standard, clear, considered, and built to last.",
    ],
    services: [
      "Brand Identity",
      "Packaging Design",
      "Social Media Design",
      "Logo & Monogram",
      "UI/UX Design",
      "Web Development",
    ],
    basedList: [
      "Beirut, Lebanon",
      "Available worldwide",
      "Freelance & Studio",
      "Vol. 01, 2026",
    ],
    portraitTag: "George Charbel, Founder",
  },
  works: {
    title: "Seven brands, <em>built with purpose.</em>",
    sub: "A selection of identity, packaging, and campaign work, each project carrying a brand from its core idea through to every touchpoint.",
  },
  contact: {
    heading: "Have a brand<br>worth <em>building?</em>",
    email: "georgescharbel6@gmail.com",
    instagramHandle: "@g.viisuals",
    instagramUrl: "https://instagram.com/g.viisuals",
    phoneDisplay: "+961 79 106883",
    phoneTel: "+96179106883",
    location: "Beirut, Lebanon",
    timeChip: "Available for projects",
    whatsapp: "96179106883",
    whatsappText: "Hi George, I saw your portfolio and I'd love to talk.",
    footerA: "G.VIISUALS, George Charbel",
    footerB: "End of Volume 01 · Designed with purpose",
  },
  projects: [
    {
      key: "root",
      name: "Root",
      cat: "Brand Identity · Social",
      sub: "Café & Matcha Bar",
      desc: "Root Café & Matcha Bar is a modern café brand built around calm moments, natural aesthetics, and mindful living. Inspired by organic textures, warm interiors, and the ritual of specialty matcha, the visual identity combines earthy tones, elegant typography, and minimalist design elements to create a welcoming and sophisticated experience.",
      quote: "A brand built around the ritual of slowing down.",
      tags: ["Logo", "Identity System", "Social Templates", "Menu Design"],
      cover: "/assets/img/root-cover.webp",
      lqip: "data:image/webp;base64,UklGRtAAAABXRUJQVlA4IMQAAACQBQCdASocABIAPt1kqU+opaOiKAqpEBuJYgCxH2iBSBLNTgA3xGtctfVx73ggaTUQMVR6AAD7zHaddQM2PMhIbDCYSWsF0ZajxfYGM9wwQN0uIQGiDXUqID1BrPwgMdTNNWNnw+mXXK1VMbpT9Hrrjc0AaYjDr9sorknWmyFOS6nqH6MZa4ZzMgoPppwsQK9AsUrNQFIyrwV0vm+oYV3jpo0rZBnMxskGFhkwNJ+TbYq8H39jz/qzpmoI0iQRsoSUgAAA",
      gallery: [
        "/assets/img/root-01.webp",
        "/assets/img/root-cover.webp",
        "/assets/img/root-02.webp",
        "/assets/img/root-03.webp",
        "/assets/img/root-04.webp",
        "/assets/img/root-05.webp",
        "/assets/img/root-06.webp",
        "/assets/img/root-07.webp",
        "/assets/img/root-08.webp",
        "/assets/img/root-09.webp",
        "/assets/img/root-10.webp",
        "/assets/img/root-11.webp",
        "/assets/img/root-12.webp",
      ],
      caps: [
        "Illuminated signage",
        "Café interior",
        "Counter & pastry display",
        "Coffee cups & collateral",
        "Coffee bag lineup",
        "Matcha tin packaging",
        "Takeaway set",
        "Menu design",
        "Brand flat lay",
        "Apparel & merch",
        "Tote bags",
        "Social media posts",
        "Instagram feed",
      ],
      think: {
        challenge:
          "Specialty cafes compete on noise. Louder colors, busier walls. Root wanted the opposite: an identity as calm as the ritual it serves.",
        idea: "The two o's of the wordmark merge into one continuous loop: a root system, a shared table, a moment of pause. Growth from a still center.",
        mark: "A lowercase logotype with letterforms that loop and link into one another like roots under soil. The rounded weight keeps it calm and organic, and the color is pulled straight from the cup, matcha green over coffee brown.",
        craft: "A palette drawn from matcha and coffee, green meeting roasted brown in the logo itself. One glowing dimensional sign as the only loud gesture, and unbleached cups, pouches and tins that let texture do the branding.",
        type: "A rounded lowercase logotype with a light grotesque doing the quiet work on menus and labels. Nothing shouts, the type drinks slowly.",
        pal: ["#ECE3D6", "#BDA080", "#895220", "#4B5E1C", "#584120"],
      },
    },
    {
      key: "byblobel",
      name: "Byblobel",
      cat: "Brand Identity · Hospitality",
      sub: "Boutique Guesthouse · Byblos",
      desc: "Byblobel is a boutique guesthouse located in the historic coastal city of Byblos, Lebanon. Inspired by the city's rich heritage, Mediterranean lifestyle, and breathtaking sea views, the brand identity combines elegance, warmth, and authenticity.",
      quote: "Old stone, new warmth.",
      tags: ["Logo", "Identity System", "Collateral", "Social Campaign"],
      cover: "/assets/img/byblobel-cover.webp",
      lqip: "data:image/webp;base64,UklGRuIAAABXRUJQVlA4INYAAABwBQCdASocABIAPt1kqE+opaOiKAqpEBuJYgCdH/cqWQkMeFGcNXdcK9Jz554Odiij+Q9oAPz7xotsyliOJeiGjJgVxBsIX0G+OTAs8zCUZ+VjmqszEjG0RHzW30FdyQkH2iSOP7qoeYRI75EjNnDtnjWZSiv/bHZ5VHBVwCBxIqcuG/oBZgdHkWJnw/RasL+K0PA7k4FZjFPJmW3buq5DE2FeaXlYbS4cwLJv2KnOBLSOToynwjIRF3+2sueJQnduM/y1BU8FFXVAWoDT9jOexoZWzxYA",
      gallery: [
        "/assets/img/byblobel-01.webp",
        "/assets/img/byblobel-cover.webp",
        "/assets/img/byblobel-02.webp",
        "/assets/img/byblobel-03.webp",
        "/assets/img/byblobel-04.webp",
        "/assets/img/byblobel-05.webp",
        "/assets/img/byblobel-06.webp",
        "/assets/img/byblobel-07.webp",
        "/assets/img/byblobel-08.webp",
        "/assets/img/byblobel-09.webp",
        "/assets/img/byblobel-10.webp",
        "/assets/img/byblobel-11.webp",
        "/assets/img/byblobel-12.webp",
        "/assets/img/byblobel-13.webp",
        "/assets/img/byblobel-14.webp",
      ],
      caps: [
        "Brand identity",
        "Pool deck branding",
        "Guest room signage",
        "Restaurant menus",
        "Guest stationery",
        "Key cards",
        "Guest directories",
        "Door hangers",
        "Thank you card",
        "Robe & slippers",
        "Amenity kit",
        "Toiletries line",
        "Hat & towels",
        "Beach bags",
        "Social media feed",
      ],
      think: {
        challenge:
          "Byblos is one of the oldest port cities in the world, and this boutique guesthouse needed to read as modern luxury without erasing the heritage that makes the place worth visiting.",
        idea: "'Connecting the ancient sea to modern luxury.' The B monogram is drawn as a window with a sail inside it, the view from a Byblos guesthouse distilled into a letterform.",
        mark: "The B is drawn as a window with a sail passing through it, the old port of Byblos compressed into a single shape. Set beside a clean geometric wordmark, it connects the ancient harbor to a modern stay.",
        craft: "Mediterranean blues on warm coastal neutrals, carried through the full guest journey, from reservation cards and key cards to door hangers, spa amenities, robes and beach totes.",
        type: "Geometric capitals tracked wide, resort calm with a modern edge. Serif moments appear only on print collateral where the paper can carry them.",
        pal: ["#E5E1DD", "#C9A86A", "#5DBDC9", "#1D2C3F"],
      },
    },
    {
      key: "balcony",
      name: "Balcony Burgers",
      cat: "Brand Identity · Restaurant",
      sub: "Burger Restaurant",
      desc: "Balcony Burgers is a fast casual burger brand built around an elevated rooftop dining experience. The identity is anchored by a single mark, a letter B drawn as a stacked burger, that carries both words of the name.",
      quote: "A single B doing the work of a billboard.",
      tags: ["Logo", "Signage", "Packaging", "Menu Boards", "Social"],
      cover: "/assets/img/balcony-cover.webp",
      lqip: "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAACwBQCdASoeABQAPu1kqk2ppaQiMAgBMB2JYgCdMt6/UCn7QL6NnDFDb0yrQIqgHVZCIlooL/AA/uzfKKFW1V3UBa9Jm/uinnsJ/RelaoQysp00SOrPC1rh8xzB8moefJjBP4yPqtKuOR8xV3Lbc87Dlm5y30Fm/pVE08gHATaivikIEYy23/Q53vv5VDQCDAbhayxVxWyVGcRYbuE1V/KsYuDovwyVv7aqqT/KOu0C2ofMHQgAAA==",
      gallery: [
        "/assets/img/balcony-01.webp",
        "/assets/img/balcony-02.webp",
        "/assets/img/balcony-cover.webp",
        "/assets/img/balcony-03.webp",
        "/assets/img/balcony-04.webp",
        "/assets/img/balcony-05.webp",
        "/assets/img/balcony-06.webp",
        "/assets/img/balcony-07.webp",
        "/assets/img/balcony-08.webp",
        "/assets/img/balcony-09.webp",
        "/assets/img/balcony-10.webp",
      ],
      caps: [
        "Previous logo",
        "New identity",
        "Rooftop terrace",
        "Counter & menu boards",
        "Storefront",
        "Night terrace",
        "Open kitchen",
        "Branded serving tray",
        "Burger box",
        "Takeaway bag",
        "Stay Hungry campaign",
      ],
      think: {
        challenge:
          "The fast casual burger space is crowded with look alike branding. Balcony Burgers needed a mark memorable enough to own its rooftop concept.",
        idea: "Let one letter do the work. The B is built as a stacked burger, a sesame bun, a drip of cheese and the patty between.",
        mark: "The B is a stacked burger, sesame bun on top, a drip of cheese and the patty in between, and that one letter stands in for both words of the name.",
        craft: "A warm charcoal and orange palette with cream type, carried across illuminated signage, menu boards, kraft packaging, aprons and social.",
        type: "Bold rounded sans built for distance, the same weight from street sign to menu board.",
        pal: ["#F2EBE3", "#D3BDA2", "#EC8B33", "#2B2724"],
      },
    },
    {
      key: "carneo",
      name: "Carneo",
      cat: "Rebranding · Restaurant",
      sub: "Premium Meat Experience",
      desc: "Carneo is a premium meat restaurant in Lebanon that had outgrown its first logo. The rebrand replaces clip-art knives and flames with a confident gold serif and a mark drawn from the product itself.",
      quote: "A steakhouse identity cut to premium grade.",
      tags: ["Logo", "Identity System", "Menu Design", "Interior Branding"],
      cover: "/assets/img/carneo-cover.webp",
      lqip: "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAADwBACdASocABIAPt1gp06opaMiKA1REBuJTB1owsQAIOTqzzW9L9/Ytqaa0zDuEgAA/vCh7EKVk13+ds/ddHpiv8CK9aIFPGEU6COot4hUeMuuyK92eOIviZNUxwWfyYgtJCJhC7wI5Rcm4Yii4aDVb5FLJyxdFkWlZJBVnBGdp7IPrgUBGAWGewdQnh1Oh/wAAA==",
      gallery: [
        "/assets/img/carneo-01.webp",
        "/assets/img/carneo-02.webp",
        "/assets/img/carneo-03.webp",
        "/assets/img/carneo-04.webp",
        "/assets/img/carneo-05.webp",
        "/assets/img/carneo-06.webp",
        "/assets/img/carneo-07.webp",
        "/assets/img/carneo-08.webp",
        "/assets/img/carneo-09.webp",
      ],
      caps: [
        "Previous logo",
        "New identity, reception",
        "Exterior signage",
        "Menu design",
        "Coasters & napkins",
        "Staff apron",
        "Gift bags",
        "Campaign visual",
        "Reservation poster",
      ],
      think: {
        challenge:
          "Carneo's original logo said butcher shop: crossed knives, cartoon flames. The restaurant underneath was positioning itself as fine dining.",
        idea: "The o of Carneo becomes the product itself, a marbled cut of beef drawn as a simple seal.",
        mark: "A refined serif logotype with a meat seal set inside the final o, the only place the deep red appears.",
        craft: "A black and gold system with deep red reserved for the mark alone. Embossed leather and embroidery, a menu pairing prime cuts with Lebanese specialties.",
        type: "A refined high contrast serif carries the name, supported by small tracked capitals for menus and detail lines.",
        pal: ["#864F26", "#6F2C0A", "#040302"],
      },
    },
    {
      key: "merci",
      name: "Merci Market",
      cat: "Rebranding · Identity",
      sub: "Neighborhood Retail Brand",
      desc: "Merci Market was reimagined as a modern neighborhood retail brand that combines convenience, accessibility, and community. The new identity features a distinctive shopping-cart-inspired logo, bold signage, branded packaging, and a cohesive digital presence.",
      quote: "A neighborhood staple, redesigned for today.",
      tags: ["Rebrand", "Logo", "Signage", "Packaging", "Digital"],
      cover: "/assets/img/merci-cover.webp",
      lqip: "data:image/webp;base64,UklGRsgAAABXRUJQVlA4ILwAAADQBQCdASocABIAPt1eqU2opKOiKAqpEBuJZgCjH9h+wktAVb3kqBYcUKAY4xSk/mmdarYKAPwvIgo5X2f/Yhy/i+1qy5/iyaHDvp1m5sntrFVaMtFJv24z2fiy+nutzfQaqKv0qj9ZRxS/NzCpxju+VGVeTG9zvXREe9axBzpEMkp7AcbyXBeCGFlgq+TZqbT2iPGnZAreZv6mgcJ59So8W3TXSItLn+wiyutHB0n/OnLvJkqjI3zO6NgQyWuSWel+livwyymAY/wHAjzFNufp9rxmUaYSAG9MAAAA",
      gallery: [
        "/assets/img/merci-01.webp",
        "/assets/img/merci-cover.webp",
        "/assets/img/merci-02.webp",
        "/assets/img/merci-03.webp",
        "/assets/img/merci-04.webp",
        "/assets/img/merci-05.webp",
        "/assets/img/merci-06.webp",
        "/assets/img/merci-07.webp",
        "/assets/img/merci-08.webp",
      ],
      caps: [
        "Previous logo",
        "New identity",
        "Storefront signage",
        "Shopping bags",
        "Product packaging",
        "Receipt tape",
        "Staff uniforms",
        "Social media",
        "Loyalty cards",
      ],
      think: {
        challenge:
          "A beloved neighborhood market needed to feel modern without losing the warmth that made people loyal in the first place.",
        idea: "The shopping cart becomes the icon, not the afterthought. A friendly, rounded mark that says 'welcome' before it says 'retail'.",
        mark: "A stylized cart wheel rendered as a smiling arc, paired with a warm wordmark that balances approachability with clarity.",
        craft: "A cheerful yet refined palette applied across bags, signage, uniforms, and digital touchpoints. Every interaction feels considered.",
        type: "A rounded sans-serif that reads warmly at every scale, from shelf tags to storefront.",
        pal: ["#F5F0E8", "#E85D3A", "#2D5F3E", "#1A1A1A"],
      },
    },
    {
      key: "cookiecart",
      name: "The Cookie Cart",
      cat: "Branding · Packaging",
      sub: "Premium Cookies",
      desc: "The Cookie Cart is a playful premium cookie brand inspired by the joy of freshly baked treats and nostalgic moments shared with family and friends. The brand identity combines warm visuals, soft pastel tones, and inviting typography.",
      quote: "Nostalgia, served as a system.",
      tags: ["Logo", "Packaging", "Identity System", "Social"],
      cover: "/assets/img/cookiecart-cover.webp",
      lqip: "data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAADwBQCdASoVABwAPt1eqU6opKOiMBgIARAbiWYAnTODDgHGgDyOrnQYlApRkHBwKKkoKdngPEhRUAD+TxTlbtUXsbZJJcZj6oKTkGHcINzl36DfJsbqSIFtneIPGUZ0JVD+VaSPt8K27u3BE3wVJE2e85JTdpEqS/Gn1f2LVR6W3yir2lXOIHI6eBmDfPhjwherqbbxFGfZGHtDMcpqEXot6LJrDCaZHI5iqy6KiXSFMe70LOC7AsR8RL3WukmsDhQnoefpuSMARdB9/KWYi8By6uQH7YqMuhe+95Rge6UKq1n0fKWUqxVsMS9AjUT9wl/ye30bUNRRGA3L7lKVMAAA",
      gallery: [
        "/assets/img/cookiecart-cover.webp",
        "/assets/img/cookiecart-01.webp",
        "/assets/img/cookiecart-02.webp",
        "/assets/img/cookiecart-03.webp",
        "/assets/img/cookiecart-04.webp",
        "/assets/img/cookiecart-05.webp",
        "/assets/img/cookiecart-06.webp",
        "/assets/img/cookiecart-07.webp",
        "/assets/img/cookiecart-08.webp",
        "/assets/img/cookiecart-09.webp",
        "/assets/img/cookiecart-10.webp",
        "/assets/img/cookiecart-11.webp",
        "/assets/img/cookiecart-12.webp",
        "/assets/img/cookiecart-13.webp",
        "/assets/img/cookiecart-14.webp",
      ],
      caps: [
        "Storefront",
        "Logo",
        "Packaging suite",
        "Brand flat lay",
        "Box & fresh cookies",
        "Ribboned gift boxes",
        "Cookie tins",
        "Box window detail",
        "Carrier bags",
        "Loyalty cards",
        "Coasters & stickers",
        "New flavor post",
        "Counter & interior",
        "Staff uniform",
        "Lifestyle campaign",
      ],
      think: {
        challenge:
          "A homemade-cookie business stepping up to a real storefront needed to scale its warmth, with packaging and a space that feel handmade rather than mass-produced.",
        idea: "Nostalgia as a system. A plump retro script that sits on the page like piped frosting, living in a world of icing pinks and star sprinkles.",
        mark: "A plump retro script that sits on the page like piped frosting, with sprinkle stars scattered around the lockup.",
        craft: "A two-pink palette with cream and gold accents rolled across loyalty cards, stickers, tins, ribboned gift boxes, aprons and the storefront itself.",
        type: "A plump retro script headline over simple sans support. Dessert first, details second.",
        pal: ["#ECE8E5", "#F8DCDB", "#D8A4A4", "#B97678", "#853E32"],
      },
    },
    {
      key: "loqmet",
      name: "Loqmet Setti",
      cat: "Branding · Packaging",
      sub: "Lebanese Mouneh",
      desc: "Loqmet Setti is a Lebanese mouneh brand that celebrates the rich culinary heritage of traditional homemade preserves and pantry essentials. The visual identity reflects warmth, nature, and tradition through earthy tones and handcrafted details.",
      quote: "Setti's kitchen, on every shelf.",
      tags: ["Logo", "Packaging", "Label System"],
      cover: "/assets/img/loqmet-cover.webp",
      lqip: "data:image/webp;base64,UklGRugAAABXRUJQVlA4INwAAABwBQCdASocABIAPt1irU8opaSiKAqpEBuJaACxHtB+4kgAtr0iiBYcUKgY4xSk/mmdarYKAPwvIgo5X2f/Yhy/i+1qy5/iyaHDvp1m5sntrFVaMtFJv24z2fiy+nutzfQaqKv0qj9ZRxS/NzCpxju+VGVeTG9zvXREe9axBzpEMkp7AcbyXBeCGFlgq+TZqbT2iPGnZAreZv6mgcJ59So8W3TXSItLn+wiyutHB0n/OnLvJkqjI3zO6NgQyWuSWel+livwyymAY/wHAjzFNufp9rxmUaYSAG9MAAAA",
      gallery: [
        "/assets/img/loqmet-01.webp",
        "/assets/img/loqmet-cover.webp",
        "/assets/img/loqmet-02.webp",
        "/assets/img/loqmet-03.webp",
        "/assets/img/loqmet-04.webp",
        "/assets/img/loqmet-05.webp",
        "/assets/img/loqmet-06.webp",
        "/assets/img/loqmet-07.webp",
      ],
      caps: [
        "Logo",
        "Jar collection",
        "Olive jars",
        "Olive label",
        "Apricot jars",
        "Apricot label",
        "Makdous jars",
        "Makdous label",
      ],
      think: {
        challenge:
          "Lebanese mouneh is rich with story but usually sold in anonymous jars. Loqmet Setti needed packaging that honors the recipe without looking homemade.",
        idea: "A hand-drawn Arabic logotype crowned with an olive sprout puts the grandmother's voice on the label.",
        mark: "Arabic lettering drawn with a hand made warmth, a fresh sprout growing out of the word the way mouneh grows out of the garden.",
        craft: "Tone-on-tone botanical line patterns, a disciplined Arabic-first label grid, and a product-coded palette of olive green, apricot amber and aubergine.",
        type: "Hand drawn Arabic lettering as the hero, with bilingual labels set in a humble grounded sans.",
        pal: ["#E9E9CB", "#9AA87A", "#E8A74F", "#8C4F86", "#50284A"],
      },
    },
    {
      key: "tanmia",
      name: "Tanmia",
      cat: "Rebrand · Packaging",
      sub: "Poultry Brand",
      desc: "Tanmia is a leading Lebanese poultry brand dedicated to delivering fresh, high-quality chicken products to families across the country. This rebranding introduces a modern logo and packaging system designed to strengthen brand recognition.",
      quote: "From Lebanese farms, with a fresher face.",
      tags: ["Rebrand", "Packaging", "Fleet Branding", "Uniforms", "Social"],
      cover: "/assets/img/tanmia-cover.webp",
      lqip: "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAAAwBACdASocABIAPt1apUyopSOiMAgBEBuJY0wAUI8SVzoOEqRanQLSwwAA/u6WETqtlcuzxEQkf/ozbCVmW9JT1nm56LQ6AB30Ahv7AKS0Nd45Fq3kT4w1fy0FGEeOKsXXPb+kZqxHlKI0xT8wqq4x1neyjgIUKXQDrIdNwnvzdhB438sunjxNlZpvnFN8H4+6W1KsHB1ticH3jtAIzyAMeMU0Y/PAAAA=",
      gallery: [
        "/assets/img/tanmia-01.webp",
        "/assets/img/tanmia-02.webp",
        "/assets/img/tanmia-cover.webp",
        "/assets/img/tanmia-03.webp",
        "/assets/img/tanmia-04.webp",
        "/assets/img/tanmia-05.webp",
        "/assets/img/tanmia-06.webp",
        "/assets/img/tanmia-07.webp",
        "/assets/img/tanmia-08.webp",
        "/assets/img/tanmia-09.webp",
        "/assets/img/tanmia-10.webp",
      ],
      caps: [
        "Previous logo",
        "New identity",
        "Packaging range",
        "Family pack trays",
        "Retail display",
        "Delivery fleet",
        "Staff uniforms",
        "Production facility",
        "Instagram profile",
        "Social media posts",
        "Recipe book",
      ],
      think: {
        challenge:
          "Poultry packaging defaults to the clinical or the industrial. Tanmia needed shoppers to see Lebanese farms, not factories.",
        idea: "A sprout grows out of the logotype itself. Freshness made literal.",
        mark: "A lowercase wordmark where the final letter turns into a hen, comb and all, and a fresh sprout grows from the first.",
        craft: "Clean white trays with a green-and-harvest palette, brand pillars of freshness, quality, trust and farming built into the system.",
        type: "A continuous lowercase logotype with clean bilingual sans support across packaging and fleet.",
        pal: ["#FEFEFE", "#EDCE57", "#BAC18E", "#508846", "#AF3433"],
      },
    },
    {
      key: "socialclub",
      name: "Clube P.A.",
      cat: "Brand Identity · Social Club",
      sub: "Private Members Club",
      desc: "Clube P.A. is a private members club built around community, culture, and belonging. The identity balances warmth and exclusivity through a refined editorial system, tactile collateral, and a visual language that feels both timeless and current.",
      quote: "Belonging, designed with intention.",
      tags: ["Logo", "Identity System", "Editorial", "Collateral", "Social"],
      cover: "/assets/img/socialclub-cover.webp",
      lqip: "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAABwBQCdASocABIAPt1cqU2opKOiKAqpEBuJZQCjH9h+wkvAVb3kqBYcUKAY4xSk/mmdarYKAPwvIgo5X2f/Yhy/i+1qy5/iyaHDvp1m5sntrFVaMtFJv24z2fiy+nutzfQaqKv0qj9ZRxS/NzCpxju+VGVeTG9zvXREe9axBzpEMkp7AcbyXBeCGFlgq+TZqbT2iPGnZAreZv6mgcJ59So8W3TXSItLn+wiyutHB0n/OnLvJkqjI3zO6NgQyWuSWel+livwyymAY/wHAjzFNufp9rxmUaYSAG9MAAAA",
      gallery: [
        "/assets/img/socialclub-cover.webp",
        "/assets/img/socialclub-01.webp",
        "/assets/img/socialclub-02.webp",
        "/assets/img/socialclub-03.webp",
        "/assets/img/socialclub-04.webp",
        "/assets/img/socialclub-05.webp",
        "/assets/img/socialclub-06.webp",
        "/assets/img/socialclub-07.webp",
        "/assets/img/socialclub-08.webp",
        "/assets/img/socialclub-09.webp",
        "/assets/img/socialclub-10.webp",
        "/assets/img/socialclub-11.webp",
        "/assets/img/socialclub-12.webp",
        "/assets/img/socialclub-13.webp",
        "/assets/img/socialclub-14.webp",
        "/assets/img/socialclub-15.webp",
        "/assets/img/socialclub-16.webp",
      ],
      caps: [
        "Brand identity",
        "Club interior",
        "Membership card",
        "Newsletter cover",
        "Event poster",
        "Programme booklet",
        "Signage system",
        "Merchandise",
        "Social templates",
        "Invitation suite",
        "Staff uniform",
        "Packaging",
        "Digital presence",
        "Campaign visual",
        "Editorial spread",
        "Brand flat lay",
        "Lifestyle shot",
      ],
      think: {
        challenge:
          "A private club needed to feel exclusive without being cold, warm without being casual.",
        idea: "An editorial identity that reads like a well-made magazine - considered, cultured, quietly confident.",
        mark: "A monogram drawn from the initials P.A., set in a refined serif that carries weight and history.",
        craft: "Warm neutrals with a single accent colour, carried across membership cards, newsletters, event collateral and digital touchpoints.",
        type: "A high-contrast serif for headlines paired with a clean grotesque for body text - editorial precision throughout.",
        pal: ["#F5F0E8", "#C9A96E", "#2C2C2C", "#8B4513"],
      },
    },
    {
      key: "rim",
      name: "Bingo",
      cat: "Brand Identity · Gaming",
      sub: "Social Bingo Experience",
      desc: "Bingo is a modern social bingo brand that reimagines the classic game for a new generation. The identity is playful, inclusive, and vibrant - built around community, celebration, and the joy of shared moments.",
      quote: "The classic game, reborn for today.",
      tags: ["Logo", "Identity System", "Cards", "Social", "Merch"],
      cover: "/assets/img/rim-cover.webp",
      lqip: "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAABwBQCdASocABIAPt1cqU2opKOiKAqpEBuJZQCjH9h+wkvAVb3kqBYcUKAY4xSk/mmdarYKAPwvIgo5X2f/Yhy/i+1qy5/iyaHDvp1m5sntrFVaMtFJv24z2fiy+nutzfQaqKv0qj9ZRxS/NzCpxju+VGVeTG9zvXREe9axBzpEMkp7AcbyXBeCGFlgq+TZqbT2iPGnZAreZv6mgcJ59So8W3TXSItLn+wiyutHB0n/OnLvJkqjI3zO6NgQyWuSWel+livwyymAY/wHAjzFNufp9rxmUaYSAG9MAAAA",
      gallery: [
        "/assets/img/rim-cover.webp",
        "/assets/img/rim-01.webp",
        "/assets/img/rim-02.webp",
        "/assets/img/rim-03.webp",
        "/assets/img/rim-04.webp",
        "/assets/img/rim-05.webp",
        "/assets/img/rim-06.webp",
        "/assets/img/rim-07.webp",
        "/assets/img/rim-08.webp",
        "/assets/img/rim-09.webp",
        "/assets/img/rim-10.webp",
        "/assets/img/rim-11.webp",
        "/assets/img/rim-12.webp",
        "/assets/img/rim-13.webp",
        "/assets/img/rim-14.webp",
        "/assets/img/rim-15.webp",
        "/assets/img/rim-16.webp",
        "/assets/img/rim-17.webp",
        "/assets/img/rim-18.webp",
      ],
      caps: [
        "Brand identity",
        "Bingo cards 2026",
        "Game board design",
        "Event poster",
        "Social media kit",
        "Merchandise line",
        "Ticket design",
        "Venue branding",
        "Digital interface",
        "Campaign visual",
        "Staff uniform",
        "Packaging",
        "Invitation suite",
        "Programme booklet",
        "Signage system",
        "Brand flat lay",
        "Lifestyle shot",
        "Card detail",
        "Full collection",
      ],
      think: {
        challenge:
          "Bingo carries baggage - dated, dusty, associated with retirement homes. The brand needed to feel fresh, social, and genuinely fun.",
        idea: "Keep the joy, lose the dust. A vibrant identity that celebrates the communal thrill of the game.",
        mark: "A bold rounded logotype with a playful dot replacing the i - the ball drop made literal.",
        craft: "A bright multi-colour palette applied across cards, venue branding, social kits and merchandise. Every touchpoint feels celebratory.",
        type: "A chunky rounded sans for headlines, clean and legible for game cards and practical information.",
        pal: ["#FFF8F0", "#FF6B6B", "#4ECDC4", "#FFE66D", "#2C3E50"],
      },
    },
    {
      key: "bijou",
      name: "Scintilla",
      cat: "Brand Identity · Publishing",
      sub: "Literary Challenge Platform",
      desc: "Scintilla is a literary challenge platform that invites writers to explore identity, voice, and story through structured creative prompts. The identity is intellectual, warm, and visually rich - built around the spark of inspiration that starts every great piece of writing.",
      quote: "Every great story starts with a spark.",
      tags: ["Logo", "Identity System", "Editorial", "Digital", "Campaign"],
      cover: "/assets/img/bijou-cover.webp",
      lqip: "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAABwBQCdASocABIAPt1cqU2opKOiKAqpEBuJZQCjH9h+wkvAVb3kqBYcUKAY4xSk/mmdarYKAPwvIgo5X2f/Yhy/i+1qy5/iyaHDvp1m5sntrFVaMtFJv24z2fiy+nutzfQaqKv0qj9ZRxS/NzCpxju+VGVeTG9zvXREe9axBzpEMkp7AcbyXBeCGFlgq+TZqbT2iPGnZAreZv6mgcJ59So8W3TXSItLn+wiyutHB0n/OnLvJkqjI3zO6NgQyWuSWel+livwyymAY/wHAjzFNufp9rxmUaYSAG9MAAAA",
      gallery: [
        "/assets/img/bijou-cover.webp",
        "/assets/img/bijou-01.webp",
        "/assets/img/bijou-02.webp",
        "/assets/img/bijou-03.webp",
        "/assets/img/bijou-04.webp",
        "/assets/img/bijou-05.webp",
        "/assets/img/bijou-06.webp",
        "/assets/img/bijou-07.webp",
        "/assets/img/bijou-08.webp",
        "/assets/img/bijou-09.webp",
        "/assets/img/bijou-10.webp",
        "/assets/img/bijou-11.webp",
        "/assets/img/bijou-12.webp",
        "/assets/img/bijou-13.webp",
        "/assets/img/bijou-14.webp",
      ],
      caps: [
        "Brand identity",
        "Challenge stamp 2026",
        "Editorial spread",
        "Campaign poster",
        "Digital interface",
        "Social media kit",
        "Author badge",
        "Certificate design",
        "Newsletter template",
        "Event programme",
        "Merchandise",
        "Packaging",
        "Invitation suite",
        "Brand flat lay",
        "Lifestyle shot",
      ],
      think: {
        challenge:
          "A literary platform needed to feel serious about craft without being stuffy - inviting to new writers while respecting established ones.",
        idea: "The spark - scintilla means a tiny spark in Latin. The identity is built around that moment of ignition.",
        mark: "A custom ligature where the double-l of Scintilla forms a flame shape - the spark made visible in the name itself.",
        craft: "Deep jewel tones with warm gold accents, applied across stamps, editorial spreads, digital interfaces and campaign materials.",
        type: "A literary serif for headlines with generous tracking, paired with a humanist sans for body text and practical information.",
        pal: ["#FDF8F0", "#C9A227", "#2D1B4E", "#8B2252", "#1A1A2E"],
      },
    },
  ],
  uiuxVideos: [
    {
      key: "whish-money",
      title: "Whish Money - App Redesign",
      description:
        "An independent redesign concept that makes everyday money management feel simpler. A cleaner interface brings together live transfer tracking, bill splitting, scam checks, and Arabic language support in one intuitive experience.",
      poster: "/assets/img/uiux-whish-poster.png",
      videoUrl: "/assets/videos/whish-money.mp4",
      tags: ["UI/UX", "FINTECH", "MOBILE APP", "REDESIGN"],
    },
    {
      key: "toters",
      title: "Toters - Delivery Reimagined",
      description:
        "An independent redesign concept focused on a smoother ordering experience, from browsing to delivery. Clearer arrival estimates, group orders, instant refunds, and smarter address entry help make every step feel more straightforward.",
      poster: "/assets/img/uiux-toters-poster.png",
      videoUrl: "/assets/videos/toters.mp4",
      tags: ["UI/UX", "DELIVERY", "MOBILE APP", "REDESIGN"],
    },
    {
      key: "omt-pay",
      title: "OMT Pay - Without the Queue",
      description:
        "An independent redesign concept for OMT Pay that eliminates the queue. Features include live wait times, Western Union to wallet transfers, and a guarantee that the app never freezes, backed by real support.",
      poster: "/assets/img/uiux-omt-poster.png",
      videoUrl: "/assets/videos/omt-pay.mp4",
      tags: ["UI/UX", "FINTECH", "MOBILE APP", "REDESIGN"],
    },
    {
      key: "suyool",
      title: "Suyool - Everything in View",
      description:
        "An independent redesign concept for Suyool that brings everything into view. Key features include subscription management, a dedicated Euro pocket, the ability to erase purchases, and family wallets for shared expenses.",
      poster: "/assets/img/uiux-suyool-poster.png",
      videoUrl: "/assets/videos/suyool.mp4",
      tags: ["UI/UX", "FINTECH", "MOBILE APP", "REDESIGN"],
    },
    {
      key: "neo",
      title: "Neo - A Bank You Can Just Ask",
      description:
        "An independent redesign concept for Neo by Bank Audi, reimagined as a bank you can just ask. Features include 'Ask Neo' AI support, live ATM cash availability, a top-up guarantee, and seamless web integration.",
      poster: "/assets/img/uiux-neo-poster.png",
      videoUrl: "/assets/videos/neo.mp4",
      tags: ["UI/UX", "BANKING", "MOBILE APP", "REDESIGN"],
    },
  ],
};

export function getProjectBySlug(slug: string): Project | undefined {
  return siteData.projects.find((p) => p.key === slug);
}

export function getAllProjects(): Project[] {
  return siteData.projects;
}