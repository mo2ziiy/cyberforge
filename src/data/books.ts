export interface Book {
  title: string;
  author: string;
  description: string;
  category: string;
  cover: string;
  url: string;
  tags: string[];
}

export const books: Book[] = [
  {
    title: "The Web Application Hacker's Handbook",
    author: "Dafydd Stuttard & Marcus Pinto",
    description: "The definitive guide to discovering and exploiting security flaws in web applications. Covers every major vulnerability class with practical attack and defense techniques.",
    category: "Web Security",
    cover: "https://covers.openlibrary.org/b/isbn/9781118026472-L.jpg",
    url: "https://www.amazon.com/Web-Application-Hackers-Handbook-Exploiting/dp/1118026470",
    tags: ["web", "pentesting", "exploitation"],
  },
  {
    title: "Hacking: The Art of Exploitation",
    author: "Jon Erickson",
    description: "A comprehensive guide to hacking from a programmer's perspective. Covers buffer overflows, shellcode writing, cryptography fundamentals, and network exploitation.",
    category: "Penetration Testing",
    cover: "https://covers.openlibrary.org/b/isbn/9781593271442-L.jpg",
    url: "https://nostarch.com/hacking2.htm",
    tags: ["exploitation", "shellcode", "programming"],
  },
  {
    title: "Penetration Testing",
    author: "Georgia Weidman",
    description: "A hands-on introduction to penetration testing. Covers lab setup, vulnerability scanning, exploitation, post-exploitation, and reporting — ideal for beginners.",
    category: "Penetration Testing",
    cover: "https://covers.openlibrary.org/b/isbn/9781593275648-L.jpg",
    url: "https://nostarch.com/pentesting",
    tags: ["beginner", "hands-on", "lab"],
  },
  {
    title: "The Hacker Playbook 3",
    author: "Peter Kim",
    description: "Practical red team tactics using real-world attack scenarios. Covers advanced adversarial simulation, custom malware, and lateral movement techniques.",
    category: "Red Team",
    cover: "https://covers.openlibrary.org/b/isbn/9781980901754-L.jpg",
    url: "https://www.amazon.com/Hacker-Playbook-Practical-Penetration-Testing/dp/1980901759",
    tags: ["red-team", "pentesting", "adversarial"],
  },
  {
    title: "Practical Malware Analysis",
    author: "Michael Sikorski & Andrew Honig",
    description: "The hands-on guide to dissecting malicious software. Learn to analyze, debug, and disassemble malware using industry-standard tools and methodologies.",
    category: "Malware Analysis",
    cover: "https://covers.openlibrary.org/b/isbn/9781593272906-L.jpg",
    url: "https://nostarch.com/malware",
    tags: ["malware", "reverse-engineering", "analysis"],
  },
  {
    title: "The Art of Memory Forensics",
    author: "Michael Hale Ligh et al.",
    description: "Detecting malware and threats in Windows, Linux, and Mac memory. An essential resource for forensic investigators and incident responders.",
    category: "Digital Forensics",
    cover: "https://covers.openlibrary.org/b/isbn/9781118825099-L.jpg",
    url: "https://www.amazon.com/Art-Memory-Forensics-Detecting-Malware/dp/1118825098",
    tags: ["forensics", "memory", "malware"],
  },
  {
    title: "Blue Team Handbook: Incident Response",
    author: "Don Murdoch",
    description: "A condensed field guide for cyber security incident responders covering triage, investigation, log analysis, and containment of security incidents.",
    category: "Blue Team",
    cover: "https://covers.openlibrary.org/b/isbn/9781500734756-L.jpg",
    url: "https://www.amazon.com/Blue-Team-Handbook-condensed-Operations/dp/1500734756",
    tags: ["incident-response", "blue-team", "dfir"],
  },
  {
    title: "Network Security Assessment",
    author: "Chris McNab",
    description: "A comprehensive guide to assessing network security. Covers enumeration, vulnerability scanning, service exploitation, and security hardening techniques.",
    category: "Network Security",
    cover: "https://covers.openlibrary.org/b/isbn/9780596510305-L.jpg",
    url: "https://www.oreilly.com/library/view/network-security-assessment/9780596510305/",
    tags: ["network", "assessment", "scanning"],
  },
  {
    title: "Social Engineering: The Science of Human Hacking",
    author: "Christopher Hadnagy",
    description: "An in-depth exploration of social engineering attack tactics and psychological manipulation. Essential reading for anyone serious about security awareness.",
    category: "General",
    cover: "https://covers.openlibrary.org/b/isbn/9781119433385-L.jpg",
    url: "https://www.amazon.com/Social-Engineering-Science-Human-Hacking/dp/111943338X",
    tags: ["social-engineering", "psychology", "awareness"],
  },
  {
    title: "Real-World Bug Hunting",
    author: "Peter Yaworski",
    description: "A field guide to web hacking and bug bounty programs. Learn vulnerability discovery through real-world reports, covering XSS, SSRF, IDOR, and more.",
    category: "Web Security",
    cover: "https://covers.openlibrary.org/b/isbn/9781593278908-L.jpg",
    url: "https://nostarch.com/bughunting",
    tags: ["bug-bounty", "web", "xss", "ssrf"],
  },
  {
    title: "Cryptography and Network Security",
    author: "William Stallings",
    description: "A rigorous guide to cryptographic principles and their application in network security. Covers symmetric/asymmetric encryption, PKI, and protocol security.",
    category: "Cryptography",
    cover: "https://covers.openlibrary.org/b/isbn/9780134444284-L.jpg",
    url: "https://www.amazon.com/Cryptography-Network-Security-Principles-Practice/dp/0134444280",
    tags: ["cryptography", "encryption", "pki"],
  },
  {
    title: "The Art of Intrusion",
    author: "Kevin Mitnick",
    description: "True stories of the world's most daring hackers. A riveting and educational account of real-world social engineering, intrusion, and espionage operations.",
    category: "General",
    cover: "https://covers.openlibrary.org/b/isbn/9780764569593-L.jpg",
    url: "https://www.amazon.com/Art-Intrusion-Exploits-Intruders-Deceivers/dp/0764569597",
    tags: ["true-stories", "social-engineering", "hacking"],
  },
];
