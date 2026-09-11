export interface Track {
  id: string;
  name: string;
  color: string;
  description: string;
  topics: string[];
}

export const tracks: Track[] = [
  {
    id: "web-security",
    name: "Web Security",
    color: "from-blue-500 to-cyan-500",
    description:
      "Learn to identify and exploit web application vulnerabilities including XSS, SQL Injection, CSRF, SSRF, and more.",
    topics: [
      "OWASP Top 10",
      "SQL Injection",
      "Cross-Site Scripting (XSS)",
      "Cross-Site Request Forgery (CSRF)",
      "Server-Side Request Forgery (SSRF)",
      "Authentication Bypass",
      "Insecure Deserialization",
      "File Upload Vulnerabilities",
      "API Security",
      "Web Application Firewalls",
    ],
  },
  {
    id: "network-security",
    name: "Network Security",
    color: "from-green-500 to-emerald-500",
    description:
      "Master network protocols, firewalls, IDS/IPS, packet analysis, and network architecture security.",
    topics: [
      "TCP/IP Fundamentals",
      "Firewalls & ACLs",
      "IDS/IPS Systems",
      "VPN Technologies",
      "Network Monitoring",
      "Packet Analysis",
      "DNS Security",
      "Wireless Security",
      "Network Segmentation",
      "Zero Trust Architecture",
    ],
  },
  {
    id: "penetration-testing",
    name: "Penetration Testing",
    color: "from-red-500 to-orange-500",
    description:
      "Learn systematic approaches to testing security of systems, networks, and applications through simulated attacks.",
    topics: [
      "Reconnaissance",
      "Scanning & Enumeration",
      "Vulnerability Assessment",
      "Exploitation",
      "Post-Exploitation",
      "Privilege Escalation",
      "Lateral Movement",
      "Reporting",
      "Web App Pentesting",
      "Active Directory Attacks",
    ],
  },
  {
    id: "malware-analysis",
    name: "Malware Analysis",
    color: "from-purple-500 to-pink-500",
    description:
      "Analyze malicious software through static and dynamic analysis techniques to understand behavior and impact.",
    topics: [
      "Static Analysis",
      "Dynamic Analysis",
      "Behavioral Analysis",
      "Sandboxing",
      "PE File Analysis",
      "Ransomware Analysis",
      "Rootkit Detection",
      "Threat Intelligence",
      "YARA Rules",
      "Malware Families",
    ],
  },
  {
    id: "digital-forensics",
    name: "Digital Forensics",
    color: "from-amber-500 to-yellow-500",
    description:
      "Investigate digital evidence from computers, networks, and mobile devices for incident response and legal proceedings.",
    topics: [
      "Disk Forensics",
      "Memory Forensics",
      "Network Forensics",
      "Mobile Forensics",
      "Log Analysis",
      "Evidence Collection",
      "Chain of Custody",
      "Timeline Analysis",
      "File System Analysis",
      "Incident Response",
    ],
  },
  {
    id: "red-team",
    name: "Red Team",
    color: "from-red-600 to-red-400",
    description:
      "Advanced adversary simulation including social engineering, physical security, and sophisticated attack chains.",
    topics: [
      "Adversary Simulation",
      "Social Engineering",
      "Phishing Campaigns",
      "C2 Frameworks",
      "Evasion Techniques",
      "Physical Security",
      "OSINT",
      "Initial Access",
      "Persistence",
      "Exfiltration",
    ],
  },
  {
    id: "blue-team",
    name: "Blue Team",
    color: "from-blue-600 to-blue-400",
    description:
      "Defend organizations through monitoring, detection, incident response, and security operations.",
    topics: [
      "SIEM Operations",
      "Threat Hunting",
      "Incident Response",
      "Log Analysis",
      "Endpoint Detection",
      "Security Monitoring",
      "Vulnerability Management",
      "Threat Intelligence",
      "SOC Operations",
      "Detection Engineering",
    ],
  },
  {
    id: "cryptography",
    name: "Cryptography",
    color: "from-indigo-500 to-violet-500",
    description:
      "Understand encryption algorithms, protocols, PKI, hashing, and cryptographic attacks.",
    topics: [
      "Symmetric Encryption",
      "Asymmetric Encryption",
      "Hashing Algorithms",
      "Digital Signatures",
      "PKI & Certificates",
      "TLS/SSL",
      "Cryptographic Attacks",
      "Key Management",
      "Blockchain Basics",
      "Quantum Cryptography",
    ],
  },
  {
    id: "cloud-security",
    name: "Cloud Security",
    color: "from-sky-500 to-blue-500",
    description:
      "Secure cloud environments across AWS, Azure, and GCP including IAM, container security, and serverless.",
    topics: [
      "AWS Security",
      "Azure Security",
      "GCP Security",
      "IAM & Access Control",
      "Container Security",
      "Kubernetes Security",
      "Serverless Security",
      "Cloud Misconfigurations",
      "Cloud Compliance",
      "Multi-Cloud Security",
    ],
  },
  {
    id: "reverse-engineering",
    name: "Reverse Engineering",
    color: "from-gray-500 to-zinc-500",
    description:
      "Disassemble and decompile software to understand inner workings, find vulnerabilities, and analyze malware.",
    topics: [
      "x86/x64 Assembly",
      "Disassembly",
      "Decompilation",
      "Debugging",
      "Binary Exploitation",
      "Firmware Analysis",
      "Android RE",
      "iOS RE",
      "Anti-Reversing Techniques",
      "Patching",
    ],
  },
];
