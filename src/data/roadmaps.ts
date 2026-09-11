export interface RoadmapLevel {
  level: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  resources: { name: string; type: string }[];
}

export interface Roadmap {
  trackId: string;
  title: string;
  levels: RoadmapLevel[];
}

export const roadmaps: Roadmap[] = [
  {
    trackId: "web-security",
    title: "Web Security Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["HTML/CSS/JavaScript basics", "HTTP protocol & methods", "Cookies & sessions", "Same-Origin Policy", "OWASP Top 10 overview", "Basic SQL injection", "Basic XSS"],
        resources: [{ name: "PortSwigger Web Security Academy", type: "Lab" }, { name: "OWASP WebGoat", type: "Lab" }, { name: "TryHackMe Web Fundamentals", type: "Course" }],
      },
      {
        level: "Intermediate",
        topics: ["Advanced SQL injection (blind, time-based)", "Stored/Reflected/DOM XSS", "CSRF attacks", "SSRF exploitation", "File upload vulnerabilities", "Authentication bypass", "API security testing", "Burp Suite proficiency"],
        resources: [{ name: "PortSwigger Labs (all topics)", type: "Lab" }, { name: "PentesterLab", type: "Lab" }, { name: "Hack The Box Web Challenges", type: "Lab" }],
      },
      {
        level: "Advanced",
        topics: ["Insecure deserialization", "Race conditions", "WebSocket attacks", "GraphQL security", "OAuth/OIDC attacks", "Prototype pollution", "Cache poisoning", "WAF bypass techniques", "Bug bounty hunting"],
        resources: [{ name: "HackTricks Web", type: "Reference" }, { name: "Bug Bounty Programs", type: "Practice" }, { name: "Real-world CVE analysis", type: "Research" }],
      },
    ],
  },
  {
    trackId: "network-security",
    title: "Network Security Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["OSI & TCP/IP models", "IP addressing & subnetting", "Common protocols (HTTP, DNS, DHCP, ARP)", "Basic Wireshark usage", "Firewall concepts", "VPN basics", "Network scanning with Nmap"],
        resources: [{ name: "TryHackMe Network Fundamentals", type: "Course" }, { name: "CompTIA Network+ study material", type: "Course" }, { name: "Professor Messer videos", type: "Video" }],
      },
      {
        level: "Intermediate",
        topics: ["Advanced packet analysis", "IDS/IPS configuration", "VLAN security", "802.1X authentication", "DNS attacks (poisoning, tunneling)", "ARP spoofing", "Man-in-the-middle attacks", "Wireless security (WPA2/WPA3)"],
        resources: [{ name: "Wireshark Masterclass", type: "Course" }, { name: "TryHackMe Network Security", type: "Lab" }, { name: "Hack The Box Machines", type: "Lab" }],
      },
      {
        level: "Advanced",
        topics: ["Zero Trust Architecture", "Network segmentation strategies", "Advanced traffic analysis", "SDN security", "BGP security", "IPv6 security", "Network forensics", "Threat hunting on networks"],
        resources: [{ name: "SANS SEC503", type: "Course" }, { name: "CyberDefenders Network Challenges", type: "Lab" }, { name: "Malcolm Network Analysis", type: "Tool" }],
      },
    ],
  },
  {
    trackId: "penetration-testing",
    title: "Penetration Testing Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Linux command line", "Networking fundamentals", "Basic scripting (Python/Bash)", "Nmap scanning", "Web application basics", "Vulnerability scanning", "Report writing basics"],
        resources: [{ name: "TryHackMe Complete Beginner", type: "Path" }, { name: "OverTheWire Bandit", type: "Wargame" }, { name: "TCM Security PEH", type: "Course" }],
      },
      {
        level: "Intermediate",
        topics: ["Metasploit Framework", "Web app pentesting", "Active Directory attacks", "Privilege escalation (Linux/Windows)", "Password attacks", "Pivoting & tunneling", "Buffer overflow basics", "Client-side attacks"],
        resources: [{ name: "Hack The Box", type: "Lab" }, { name: "OSCP preparation", type: "Certification" }, { name: "TryHackMe Offensive Pentesting", type: "Path" }],
      },
      {
        level: "Advanced",
        topics: ["Advanced Active Directory", "Custom exploit development", "Antivirus evasion", "Advanced pivoting", "Cloud pentesting", "Mobile app pentesting", "IoT pentesting", "Red team operations"],
        resources: [{ name: "Hack The Box Pro Labs", type: "Lab" }, { name: "OSEP / OSED", type: "Certification" }, { name: "Offensive Security courses", type: "Course" }],
      },
    ],
  },
  {
    trackId: "malware-analysis",
    title: "Malware Analysis Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Malware types overview", "Setting up analysis lab", "Basic static analysis", "File hash analysis", "VirusTotal usage", "Strings extraction", "PE file structure basics"],
        resources: [{ name: "Malware Unicorn Workshop", type: "Workshop" }, { name: "TryHackMe Malware Analysis", type: "Path" }, { name: "Practical Malware Analysis book", type: "Book" }],
      },
      {
        level: "Intermediate",
        topics: ["Dynamic analysis with sandboxes", "Behavioral analysis", "Process monitoring", "Network traffic analysis", "Registry monitoring", "YARA rules", "Basic debugging with x64dbg"],
        resources: [{ name: "Any.Run sandbox", type: "Tool" }, { name: "REMnux distribution", type: "Tool" }, { name: "Malware Traffic Analysis exercises", type: "Lab" }],
      },
      {
        level: "Advanced",
        topics: ["Advanced debugging", "Code injection techniques", "Rootkit analysis", "Ransomware decryption", "APT malware analysis", "Firmware malware", "Anti-analysis techniques", "Threat intelligence integration"],
        resources: [{ name: "SANS FOR610", type: "Course" }, { name: "GREM certification", type: "Certification" }, { name: "MalwareBazaar samples", type: "Practice" }],
      },
    ],
  },
  {
    trackId: "digital-forensics",
    title: "Digital Forensics Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Forensics methodology", "Evidence handling", "Chain of custody", "Disk imaging", "File system basics (NTFS, ext4)", "Basic Autopsy usage", "Log analysis fundamentals"],
        resources: [{ name: "TryHackMe Digital Forensics", type: "Path" }, { name: "Autopsy training", type: "Tool" }, { name: "CHFI study material", type: "Course" }],
      },
      {
        level: "Intermediate",
        topics: ["Memory forensics with Volatility", "Windows artifact analysis", "Registry forensics", "Browser forensics", "Email forensics", "Timeline analysis", "Network forensics"],
        resources: [{ name: "CyberDefenders challenges", type: "Lab" }, { name: "SANS DFIR Poster", type: "Reference" }, { name: "13Cubed YouTube", type: "Video" }],
      },
      {
        level: "Advanced",
        topics: ["Advanced memory analysis", "Mobile forensics", "Cloud forensics", "Anti-forensics detection", "Malware forensics", "Incident response", "Expert witness testimony", "Forensic tool development"],
        resources: [{ name: "SANS FOR508", type: "Course" }, { name: "GCFA certification", type: "Certification" }, { name: "DFIR Summit presentations", type: "Research" }],
      },
    ],
  },
  {
    trackId: "red-team",
    title: "Red Team Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Penetration testing basics", "OSINT fundamentals", "Social engineering concepts", "Phishing basics", "Basic C2 frameworks", "Kali Linux proficiency"],
        resources: [{ name: "TryHackMe Red Team Path", type: "Path" }, { name: "The Hacker Playbook", type: "Book" }, { name: "OSINT Framework", type: "Tool" }],
      },
      {
        level: "Intermediate",
        topics: ["Advanced phishing campaigns", "C2 infrastructure setup", "Active Directory attacks", "Lateral movement techniques", "Persistence mechanisms", "Credential harvesting", "Living off the land"],
        resources: [{ name: "Red Team Ops course", type: "Course" }, { name: "Hack The Box Pro Labs", type: "Lab" }, { name: "CRTO certification", type: "Certification" }],
      },
      {
        level: "Advanced",
        topics: ["Custom implant development", "EDR evasion", "Advanced infrastructure", "Physical security testing", "Supply chain simulation", "Cloud-based C2", "Purple team exercises", "Adversary emulation"],
        resources: [{ name: "OSEP certification", type: "Certification" }, { name: "SpecterOps training", type: "Course" }, { name: "MITRE ATT&CK framework", type: "Reference" }],
      },
    ],
  },
  {
    trackId: "blue-team",
    title: "Blue Team Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Security fundamentals", "Log analysis basics", "SIEM introduction", "Windows Event Logs", "Linux logs", "Basic threat detection", "Security monitoring concepts"],
        resources: [{ name: "TryHackMe SOC Level 1", type: "Path" }, { name: "LetsDefend", type: "Lab" }, { name: "Security Blue Team BTL1", type: "Certification" }],
      },
      {
        level: "Intermediate",
        topics: ["Advanced SIEM operations", "Threat hunting", "MITRE ATT&CK mapping", "Sigma rules", "Endpoint detection", "Network traffic analysis", "Incident response procedures", "Vulnerability management"],
        resources: [{ name: "CyberDefenders", type: "Lab" }, { name: "Splunk Fundamentals", type: "Course" }, { name: "SANS SEC555", type: "Course" }],
      },
      {
        level: "Advanced",
        topics: ["Detection engineering", "Custom detection rules", "Threat intelligence platforms", "SOAR automation", "Advanced threat hunting", "Forensic investigation", "Purple team operations", "Security architecture"],
        resources: [{ name: "SANS SEC599", type: "Course" }, { name: "GCIH certification", type: "Certification" }, { name: "Detection Lab by Chris Long", type: "Lab" }],
      },
    ],
  },
  {
    trackId: "cryptography",
    title: "Cryptography Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Encryption vs encoding vs hashing", "Symmetric encryption (AES, DES)", "Caesar & substitution ciphers", "Hash functions (MD5, SHA)", "Base64 encoding", "Password storage basics"],
        resources: [{ name: "CryptoHack", type: "Lab" }, { name: "Khan Academy Cryptography", type: "Course" }, { name: "Crypto101 book", type: "Book" }],
      },
      {
        level: "Intermediate",
        topics: ["Asymmetric encryption (RSA, ECC)", "Digital signatures", "TLS/SSL protocol", "PKI & certificates", "Key exchange (Diffie-Hellman)", "Block cipher modes", "HMAC"],
        resources: [{ name: "CryptoPals challenges", type: "Lab" }, { name: "Applied Cryptography book", type: "Book" }, { name: "TryHackMe Cryptography", type: "Path" }],
      },
      {
        level: "Advanced",
        topics: ["Cryptographic attacks (padding oracle, BEAST)", "Elliptic curve cryptography", "Zero-knowledge proofs", "Post-quantum cryptography", "Blockchain cryptography", "Side-channel attacks", "Protocol analysis"],
        resources: [{ name: "CryptoPals advanced sets", type: "Lab" }, { name: "Serious Cryptography book", type: "Book" }, { name: "IACR research papers", type: "Research" }],
      },
    ],
  },
  {
    trackId: "cloud-security",
    title: "Cloud Security Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Cloud computing basics", "AWS/Azure/GCP fundamentals", "IAM basics", "Shared responsibility model", "Cloud storage security", "Basic network security in cloud", "Cloud compliance overview"],
        resources: [{ name: "AWS Cloud Practitioner", type: "Certification" }, { name: "flAWS challenge", type: "Lab" }, { name: "TryHackMe Cloud Security", type: "Path" }],
      },
      {
        level: "Intermediate",
        topics: ["Advanced IAM policies", "Container security (Docker)", "Kubernetes security", "Serverless security", "Cloud logging & monitoring", "CloudTrail/Azure Monitor", "Cloud misconfigurations", "Infrastructure as Code security"],
        resources: [{ name: "CloudGoat", type: "Lab" }, { name: "AWS Security Specialty", type: "Certification" }, { name: "Prowler/ScoutSuite", type: "Tool" }],
      },
      {
        level: "Advanced",
        topics: ["Multi-cloud security", "Cloud forensics", "Advanced container orchestration security", "Service mesh security", "Cloud-native SIEM", "Zero trust in cloud", "Cloud compliance automation", "Cloud red teaming"],
        resources: [{ name: "CCSP certification", type: "Certification" }, { name: "SANS SEC510", type: "Course" }, { name: "Cloud Security Alliance", type: "Reference" }],
      },
    ],
  },
  {
    trackId: "reverse-engineering",
    title: "Reverse Engineering Roadmap",
    levels: [
      {
        level: "Beginner",
        topics: ["Computer architecture basics", "Assembly language (x86)", "C programming", "Binary number systems", "Basic debugging", "File formats (PE, ELF)", "Ghidra basics"],
        resources: [{ name: "Crackmes.one (easy)", type: "Lab" }, { name: "x86 Assembly on TryHackMe", type: "Course" }, { name: "RE for Beginners book", type: "Book" }],
      },
      {
        level: "Intermediate",
        topics: ["x64 assembly", "IDA Pro / Ghidra proficiency", "Dynamic analysis with debuggers", "Function identification", "Data structure recovery", "Anti-debugging techniques", "Patching binaries"],
        resources: [{ name: "Exploit Education Phoenix", type: "Lab" }, { name: "Crackmes.one (medium)", type: "Lab" }, { name: "Reverse Engineering for Beginners (Dennis Yurichev)", type: "Book" }],
      },
      {
        level: "Advanced",
        topics: ["Firmware reverse engineering", "Kernel debugging", "Obfuscation / deobfuscation", "Custom tool development", "Emulation", "Symbolic execution", "Android/iOS reversing", "Hardware RE basics"],
        resources: [{ name: "SANS FOR610", type: "Course" }, { name: "GREM certification", type: "Certification" }, { name: "CTF RE challenges", type: "Practice" }],
      },
    ],
  },
];
