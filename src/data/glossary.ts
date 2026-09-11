export interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

export const glossaryTerms: GlossaryTerm[] = [
  // General
  { term: "Attack Surface", definition: "The total sum of different points (attack vectors) where an unauthorized user can try to enter data to or extract data from an environment.", category: "General", relatedTerms: ["Attack Vector", "Vulnerability"] },
  { term: "Attack Vector", definition: "A path or means by which an attacker can gain unauthorized access to a computer or network server in order to deliver a payload or malicious outcome.", category: "General", relatedTerms: ["Attack Surface", "Exploit"] },
  { term: "Threat Actor", definition: "An individual or group of individuals who seek to conduct malicious activities for purposes such as financial gain, espionage, or disruption.", category: "General" },
  { term: "Zero-Day", definition: "A vulnerability that is unknown to the software vendor and for which no patch is available. Exploits targeting these vulnerabilities are called zero-day exploits.", category: "General", relatedTerms: ["CVE", "Exploit", "Vulnerability"] },
  { term: "CVE", definition: "Common Vulnerabilities and Exposures — a list of publicly disclosed cybersecurity vulnerabilities. Each entry has a unique identifier (e.g., CVE-2023-1234).", category: "General", relatedTerms: ["CVSS", "Patch", "Zero-Day"] },
  { term: "CVSS", definition: "Common Vulnerability Scoring System — a framework for rating the severity of security vulnerabilities on a scale from 0 to 10.", category: "General", relatedTerms: ["CVE"] },
  { term: "IOC", definition: "Indicator of Compromise — evidence that a security incident has occurred, such as unusual traffic, file hashes, or IP addresses associated with malicious activity.", category: "General" },
  { term: "TTPs", definition: "Tactics, Techniques, and Procedures — the specific methods, tools, and procedures used by threat actors to carry out attacks.", category: "General", relatedTerms: ["MITRE ATT&CK"] },
  { term: "OSINT", definition: "Open Source Intelligence — the collection and analysis of data gathered from publicly available sources, such as social media, websites, and public records.", category: "General" },
  { term: "APT", definition: "Advanced Persistent Threat — a prolonged and targeted cyberattack in which an intruder gains access to a network and remains undetected for an extended period.", category: "General" },

  // Attacks
  { term: "SQL Injection", definition: "A code injection technique that exploits vulnerabilities in an application's database query processing, allowing attackers to interfere with queries.", category: "Attacks", relatedTerms: ["XSS", "OWASP", "Input Validation"] },
  { term: "XSS", definition: "Cross-Site Scripting — a type of injection attack where malicious scripts are injected into otherwise benign and trusted websites.", category: "Attacks", relatedTerms: ["CSRF", "SQL Injection", "DOM"] },
  { term: "CSRF", definition: "Cross-Site Request Forgery — an attack that tricks the victim into submitting a malicious request on a web application where they are authenticated.", category: "Attacks", relatedTerms: ["XSS", "Session Hijacking"] },
  { term: "SSRF", definition: "Server-Side Request Forgery — an attack that allows attackers to induce the server-side application to make HTTP requests to an arbitrary domain.", category: "Attacks", relatedTerms: ["CSRF", "Cloud Security"] },
  { term: "RCE", definition: "Remote Code Execution — a type of vulnerability that allows an attacker to run arbitrary code on a target machine from a remote location.", category: "Attacks", relatedTerms: ["LFI", "RFI", "Exploit"] },
  { term: "LFI", definition: "Local File Inclusion — a vulnerability that allows an attacker to include files from the server's filesystem into the response, potentially exposing sensitive data.", category: "Attacks", relatedTerms: ["RFI", "Path Traversal", "RCE"] },
  { term: "RFI", definition: "Remote File Inclusion — an attack where an attacker includes a remote file via a script on the server, often leading to remote code execution.", category: "Attacks", relatedTerms: ["LFI", "RCE"] },
  { term: "Buffer Overflow", definition: "A vulnerability where a program writes more data to a buffer than it can hold, overwriting adjacent memory and potentially allowing code execution.", category: "Attacks", relatedTerms: ["Stack Smashing", "Heap Spray", "Return-Oriented Programming"] },
  { term: "MITM", definition: "Man-in-the-Middle attack — an attack where the attacker secretly intercepts and relays messages between two parties who believe they are communicating directly.", category: "Attacks", relatedTerms: ["ARP Spoofing", "SSL Stripping", "Eavesdropping"] },
  { term: "DDoS", definition: "Distributed Denial of Service — an attack where multiple systems flood the bandwidth or resources of a targeted system, making it unavailable.", category: "Attacks", relatedTerms: ["Botnet", "DoS", "Amplification Attack"] },
  { term: "Phishing", definition: "A social engineering attack where attackers disguise themselves as trusted entities to trick individuals into revealing sensitive information.", category: "Attacks", relatedTerms: ["Spear Phishing", "Vishing", "Social Engineering"] },
  { term: "Spear Phishing", definition: "A targeted phishing attack that is personalized to specific individuals or organizations using information gathered about the target.", category: "Attacks", relatedTerms: ["Phishing", "Whaling", "OSINT"] },
  { term: "Ransomware", definition: "A type of malicious software designed to block access to a computer system or encrypt data until a sum of money is paid.", category: "Attacks", relatedTerms: ["Malware", "Encryption", "Extortion"] },
  { term: "Path Traversal", definition: "An attack that aims to access files and directories outside the web root folder by manipulating file paths (e.g., using ../../../).", category: "Attacks", relatedTerms: ["LFI", "Directory Traversal"] },
  { term: "Command Injection", definition: "An attack where the goal is execution of arbitrary commands on the host operating system via a vulnerable application.", category: "Attacks", relatedTerms: ["RCE", "Shell", "OS Injection"] },

  // Defense
  { term: "WAF", definition: "Web Application Firewall — a security tool that monitors, filters, and blocks HTTP traffic to and from a web application based on a set of rules.", category: "Defense", relatedTerms: ["Firewall", "IDS", "IPS"] },
  { term: "IDS", definition: "Intrusion Detection System — a device or software application that monitors a network or systems for malicious activity or policy violations.", category: "Defense", relatedTerms: ["IPS", "SIEM", "WAF"] },
  { term: "IPS", definition: "Intrusion Prevention System — a network security tool that continuously monitors a network and prevents identified threats.", category: "Defense", relatedTerms: ["IDS", "Firewall"] },
  { term: "SIEM", definition: "Security Information and Event Management — a system that aggregates and analyzes activity from many different resources across your IT infrastructure.", category: "Defense", relatedTerms: ["IDS", "Log Management", "SOC"] },
  { term: "SOC", definition: "Security Operations Center — a centralized unit that deals with security issues on an organizational and technical level.", category: "Defense", relatedTerms: ["SIEM", "Incident Response", "Blue Team"] },
  { term: "EDR", definition: "Endpoint Detection and Response — a security solution that continuously monitors endpoints to detect and respond to cyber threats.", category: "Defense", relatedTerms: ["AV", "MDR", "SIEM"] },
  { term: "Zero Trust", definition: "A security model that requires strict identity verification for every person and device trying to access resources, regardless of whether they are inside or outside the network perimeter.", category: "Defense", relatedTerms: ["IAM", "MFA", "Microsegmentation"] },
  { term: "Defense in Depth", definition: "A cybersecurity strategy that uses multiple layers of security controls throughout an IT system, so if one fails, another takes over.", category: "Defense", relatedTerms: ["Zero Trust", "Security Controls"] },
  { term: "Threat Hunting", definition: "The proactive practice of searching through networks and endpoints to detect and isolate advanced threats that evade existing security solutions.", category: "Defense", relatedTerms: ["SIEM", "IOC", "TTP"] },
  { term: "Patch Management", definition: "The process of distributing and applying updates to software to fix security vulnerabilities and improve functionality.", category: "Defense", relatedTerms: ["Vulnerability Management", "CVE"] },

  // Protocols & Networking
  { term: "TLS", definition: "Transport Layer Security — a cryptographic protocol designed to provide communications security over a computer network, successor to SSL.", category: "Protocols", relatedTerms: ["SSL", "HTTPS", "Certificate"] },
  { term: "SSL", definition: "Secure Sockets Layer — a deprecated cryptographic protocol that provides communication security over the Internet. Replaced by TLS.", category: "Protocols", relatedTerms: ["TLS", "HTTPS"] },
  { term: "DNS", definition: "Domain Name System — the phonebook of the Internet that translates human-readable domain names to IP addresses.", category: "Protocols", relatedTerms: ["DNS Poisoning", "DNS Hijacking"] },
  { term: "ARP", definition: "Address Resolution Protocol — a protocol for mapping an IP address to a physical MAC address on a local area network.", category: "Protocols", relatedTerms: ["ARP Spoofing", "MAC Address", "MITM"] },
  { term: "HTTPS", definition: "HyperText Transfer Protocol Secure — an extension of HTTP that uses TLS/SSL to encrypt communications between a browser and a web server.", category: "Protocols", relatedTerms: ["HTTP", "TLS", "Certificate"] },
  { term: "SSH", definition: "Secure Shell — a cryptographic network protocol for operating network services securely over an unsecured network, commonly used for remote login.", category: "Protocols", relatedTerms: ["Key Pair", "Port 22", "Tunneling"] },
  { term: "VPN", definition: "Virtual Private Network — a service that creates a secure, encrypted connection over a less secure network such as the Internet.", category: "Protocols", relatedTerms: ["Tunneling", "Encryption", "IPSec"] },

  // Cryptography
  { term: "Encryption", definition: "The process of converting readable data (plaintext) into an unreadable format (ciphertext) using an algorithm and key.", category: "Cryptography", relatedTerms: ["Decryption", "Key", "AES", "RSA"] },
  { term: "Hashing", definition: "A one-way function that converts data of any size into a fixed-size string of bytes. Unlike encryption, hashing cannot be reversed.", category: "Cryptography", relatedTerms: ["MD5", "SHA-256", "Salt"] },
  { term: "Public Key Infrastructure", definition: "A set of roles, policies, hardware, software and procedures needed to create, manage, distribute, use, store and revoke digital certificates.", category: "Cryptography", relatedTerms: ["Certificate", "CA", "TLS"] },
  { term: "Salt", definition: "Random data added to a password before hashing to prevent dictionary and rainbow table attacks.", category: "Cryptography", relatedTerms: ["Hashing", "Password Storage", "Bcrypt"] },
  { term: "RSA", definition: "A widely used asymmetric encryption algorithm based on the mathematical difficulty of factoring large numbers. Used for secure key exchange and digital signatures.", category: "Cryptography", relatedTerms: ["Public Key", "Private Key", "Asymmetric Encryption"] },
  { term: "AES", definition: "Advanced Encryption Standard — a symmetric encryption algorithm that is widely used across the globe and by the U.S. government.", category: "Cryptography", relatedTerms: ["Symmetric Encryption", "Key", "Block Cipher"] },
  { term: "Digital Signature", definition: "A mathematical scheme for verifying the authenticity and integrity of a message, ensuring it was created by the sender and not altered in transit.", category: "Cryptography", relatedTerms: ["RSA", "Hash", "Certificate"] },

  // Penetration Testing
  { term: "Reconnaissance", definition: "The first phase of penetration testing where information about a target is gathered. Can be active (directly interacting with the target) or passive.", category: "Penetration Testing", relatedTerms: ["OSINT", "Enumeration", "Footprinting"] },
  { term: "Enumeration", definition: "The process of gathering detailed information about a target network or system, such as user accounts, open ports, and services.", category: "Penetration Testing", relatedTerms: ["Reconnaissance", "Scanning", "Nmap"] },
  { term: "Privilege Escalation", definition: "The act of exploiting a bug, design flaw, or configuration oversight to gain elevated access to resources that are normally protected.", category: "Penetration Testing", relatedTerms: ["Root", "SUID", "Lateral Movement"] },
  { term: "Lateral Movement", definition: "Techniques that attackers use to progressively move through a network as they search for key assets and data.", category: "Penetration Testing", relatedTerms: ["Privilege Escalation", "Pass-the-Hash", "Living Off the Land"] },
  { term: "Persistence", definition: "Techniques used by attackers to maintain their presence on systems they have accessed, surviving reboots and credential changes.", category: "Penetration Testing", relatedTerms: ["Backdoor", "Rootkit", "Scheduled Task"] },
  { term: "Payload", definition: "The part of malware or an exploit that performs the malicious action. In penetration testing, it's the code that provides the attacker with access.", category: "Penetration Testing", relatedTerms: ["Exploit", "Reverse Shell", "Bind Shell"] },
  { term: "Reverse Shell", definition: "A type of shell in which the target machine initiates the connection back to the attacker's machine, bypassing outbound firewall restrictions.", category: "Penetration Testing", relatedTerms: ["Bind Shell", "Netcat", "Payload"] },
  { term: "Bind Shell", definition: "A type of shell in which the attacker connects to the target machine on a listening port, as opposed to a reverse shell.", category: "Penetration Testing", relatedTerms: ["Reverse Shell", "Netcat"] },

  // Tools
  { term: "Metasploit", definition: "An open-source penetration testing framework that provides information about security vulnerabilities and aids in penetration testing and IDS signature development.", category: "Tools", relatedTerms: ["Meterpreter", "Payload", "Exploit"] },
  { term: "Nmap", definition: "Network Mapper — a free and open-source utility for network discovery and security auditing, used to scan ports and identify services.", category: "Tools", relatedTerms: ["Port Scanning", "NSE", "Enumeration"] },
  { term: "Burp Suite", definition: "An integrated platform for performing security testing of web applications, including an intercepting proxy, scanner, and various attack tools.", category: "Tools", relatedTerms: ["Proxy", "Web Application Testing", "Intruder"] },
  { term: "Wireshark", definition: "A network protocol analyzer that lets you capture and interactively browse the traffic running on a computer network.", category: "Tools", relatedTerms: ["Packet Capture", "PCAP", "Network Analysis"] },
  { term: "John the Ripper", definition: "A fast password security auditing and password recovery tool available for many operating systems, used for cracking password hashes.", category: "Tools", relatedTerms: ["Hashcat", "Password Cracking", "Wordlist"] },
  { term: "Ghidra", definition: "A free and open-source reverse engineering tool developed by the NSA for analyzing compiled code on a variety of platforms.", category: "Tools", relatedTerms: ["Reverse Engineering", "Disassembly", "IDA Pro"] },

  // General Security
  { term: "Social Engineering", definition: "The psychological manipulation of people into performing actions or divulging confidential information.", category: "General", relatedTerms: ["Phishing", "Pretexting", "Baiting"] },
  { term: "Sandbox", definition: "An isolated testing environment that enables users to run programs or execute files without affecting the application, system, or platform they run on.", category: "General", relatedTerms: ["Malware Analysis", "Dynamic Analysis"] },
  { term: "Rootkit", definition: "A collection of computer software designed to enable access to a computer or an area of its software that is not otherwise allowed, while hiding its existence.", category: "General", relatedTerms: ["Persistence", "Stealth", "Kernel"] },
  { term: "Backdoor", definition: "A hidden method to bypass normal authentication or encryption in a computer system.", category: "General", relatedTerms: ["Persistence", "Trojan", "RAT"] },
  { term: "RAT", definition: "Remote Access Trojan — a type of malware that includes a backdoor for administrative control over the target computer.", category: "General", relatedTerms: ["Backdoor", "C2", "Trojan"] },
  { term: "C2", definition: "Command and Control — the infrastructure (servers, domains) used by attackers to maintain communications with and control compromised systems.", category: "General", relatedTerms: ["Botnet", "Beacon", "RAT"] },
  { term: "Botnet", definition: "A network of private computers infected with malicious software and controlled as a group without the owners' knowledge.", category: "General", relatedTerms: ["C2", "DDoS", "Malware"] },
  { term: "Malware", definition: "Short for malicious software — any software intentionally designed to cause damage to a computer, server, client, or computer network.", category: "General", relatedTerms: ["Virus", "Worm", "Trojan", "Ransomware"] },
  { term: "Forensics", definition: "The process of uncovering and interpreting electronic data for use in a court of law. In cybersecurity, it involves investigating security incidents.", category: "General", relatedTerms: ["Chain of Custody", "Artifact", "Memory Forensics"] },
  { term: "Vulnerability", definition: "A weakness in a system, application, or network that could be exploited by a threat actor to gain unauthorized access.", category: "General", relatedTerms: ["CVE", "Zero-Day", "Patch"] },
  { term: "Exploit", definition: "A piece of software, a chunk of data, or a sequence of commands that takes advantage of a vulnerability to cause unintended behavior.", category: "General", relatedTerms: ["Vulnerability", "Zero-Day", "Payload"] },
  { term: "Port Scanning", definition: "A technique used to identify open ports and services available on a networked host.", category: "Protocols", relatedTerms: ["Nmap", "Enumeration", "TCP", "UDP"] },
  { term: "Hardening", definition: "The process of securing a system by reducing its attack surface, disabling unnecessary services, applying patches, and configuring security settings.", category: "Defense", relatedTerms: ["Patch Management", "CIS Benchmarks", "Least Privilege"] },
  { term: "Least Privilege", definition: "A principle that states every user, program, or system process should only have the bare minimum privileges necessary to perform its function.", category: "Defense", relatedTerms: ["Zero Trust", "IAM", "Role-Based Access Control"] },
  { term: "MFA", definition: "Multi-Factor Authentication — a security system that requires more than one method of authentication to verify a user's identity.", category: "Defense", relatedTerms: ["2FA", "OTP", "Authentication"] },
  { term: "IAM", definition: "Identity and Access Management — a framework of policies and technologies to ensure that the right users have appropriate access to technology resources.", category: "Defense", relatedTerms: ["MFA", "SSO", "Role-Based Access Control"] },
  { term: "OWASP", definition: "Open Web Application Security Project — a nonprofit foundation that works to improve the security of software, known for its Top 10 list of web application security risks.", category: "General", relatedTerms: ["SQL Injection", "XSS", "CSRF"] },
];

export const glossaryCategories = Array.from(new Set(glossaryTerms.map((t) => t.category))).sort();
