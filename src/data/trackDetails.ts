/**
 * Long-form content for the /tracks/[slug] detail pages.
 *
 * Keyed by the track ids in data/tracks.ts. `topicNotes` carries one line of
 * context for every topic listed on that track, so the key-topics outline can
 * be rendered as a real syllabus instead of a bag of chips.
 */
export interface TrackDetail {
  /** Short line shown under the title. */
  tagline: string;
  /** Badge label for the domain family this track belongs to. */
  domain: string;
  /** Entry difficulty of the track as a whole. */
  level: "Beginner" | "Intermediate" | "Advanced";
  /** Realistic time to work through the full roadmap. */
  estimatedTime: string;
  /** Two to three paragraphs of overview copy. */
  summary: string[];
  /** What a learner can do after finishing. */
  outcomes: string[];
  /** What they should already know. */
  prerequisites: string[];
  /** Job titles this track feeds into. */
  careers: string[];
  /** Tool categories (from data/tools.ts) relevant to this track. */
  toolCategories: string[];
  /** Names of the three topic modules, in order. */
  modules: [string, string, string];
  /** One-line note per topic name. */
  topicNotes: Record<string, string>;
}

export const trackDetails: Record<string, TrackDetail> = {
  "web-security": {
    tagline: "Break and defend the applications everyone depends on.",
    domain: "Offensive Security",
    level: "Beginner",
    estimatedTime: "~6 months",
    summary: [
      "Web security is the highest-volume specialisation in the industry: almost every organisation runs web applications, and almost every one of them has bugs. This track takes you from understanding how an HTTP request is put together to chaining subtle logic flaws into full account takeover.",
      "You will spend most of your time with a proxy in front of a deliberately vulnerable application, learning to read requests the way an attacker does. The roadmap starts with the OWASP Top 10 as a map of the territory, then goes deep on the classes that actually pay: injection, access control, and server-side request handling.",
      "By the end you should be comfortable picking up an unfamiliar application, mapping its attack surface methodically, and writing up what you find in a way a developer can act on.",
    ],
    outcomes: [
      "Map an unfamiliar web application's full attack surface and prioritise where to look first",
      "Find and exploit injection, access-control, and SSRF classes by hand, not just with a scanner",
      "Use Burp Suite fluently, including Repeater, Intruder, and custom match-and-replace rules",
      "Write a vulnerability report a developer can reproduce and fix without a follow-up call",
    ],
    prerequisites: ["Comfort with a browser's developer tools", "Basic HTML, CSS, and JavaScript reading ability", "Willingness to read RFCs when a protocol detail matters"],
    careers: ["Application Security Engineer", "Penetration Tester (Web)", "Bug Bounty Hunter", "Product Security Engineer"],
    toolCategories: ["Web Security"],
    modules: ["Foundations", "Core exploitation", "Advanced & chaining"],
    topicNotes: {
      "OWASP Top 10": "The industry's shared vocabulary for web risk — learn it as a checklist of where to look, not as a ceiling.",
      "SQL Injection": "Coercing a database into running your query. Still present wherever string concatenation meets user input.",
      "Cross-Site Scripting (XSS)": "Getting your JavaScript to run in someone else's session. Reflected, stored, and DOM variants each need a different hunt.",
      "Cross-Site Request Forgery (CSRF)": "Making a victim's browser send an authenticated request they never intended.",
      "Server-Side Request Forgery (SSRF)": "Turning the server into your proxy — the fastest route into cloud metadata and internal networks.",
      "Authentication Bypass": "Logic flaws in login, session, and reset flows that skip the credential check entirely.",
      "Insecure Deserialization": "Untrusted bytes turned back into live objects, frequently landing on remote code execution.",
      "File Upload Vulnerabilities": "Getting a payload onto disk and then getting the server to execute it.",
      "API Security": "REST and GraphQL move the same bugs behind a different shape — mass assignment, BOLA, and over-fetching.",
      "Web Application Firewalls": "How filtering works, where it breaks, and why a WAF is a speed bump rather than a fix.",
    },
  },

  "network-security": {
    tagline: "Understand the wire before you try to defend it.",
    domain: "Infrastructure",
    level: "Beginner",
    estimatedTime: "~6 months",
    summary: [
      "Everything else in security sits on top of the network. This track builds the mental model that makes the rest of the field legible: how packets are addressed and routed, where trust boundaries actually sit, and what a compromise looks like when you only have traffic to go on.",
      "The work is hands-on with a packet capture open. You will learn to read a three-way handshake at a glance, spot a DNS tunnel in a sea of ordinary lookups, and understand why segmentation does more for a breach's blast radius than any single appliance.",
      "It pairs naturally with the Blue Team track: network fundamentals are what let detection engineering produce rules that fire on real behaviour rather than on noise.",
    ],
    outcomes: [
      "Read a packet capture confidently and reconstruct what happened on the wire",
      "Design and justify a segmentation model for a realistic corporate network",
      "Configure and tune IDS/IPS rules that fire on behaviour rather than on strings",
      "Recognise the traffic signatures of spoofing, poisoning, and tunnelling attacks",
    ],
    prerequisites: ["Basic command-line comfort on Linux or Windows", "A rough idea of what an IP address and a port are", "Access to a lab network or virtualisation software"],
    careers: ["Network Security Engineer", "SOC Analyst", "Infrastructure Security Architect", "Detection Engineer"],
    toolCategories: ["Network Security"],
    modules: ["Protocol foundations", "Defensive controls", "Architecture & hunting"],
    topicNotes: {
      "TCP/IP Fundamentals": "Addressing, routing, and the handshake — the substrate every other topic here assumes.",
      "Firewalls & ACLs": "Stateful versus stateless filtering, and why rule order decides what actually gets blocked.",
      "IDS/IPS Systems": "Signature and anomaly detection, plus the tuning work that keeps alerts actionable.",
      "VPN Technologies": "IPsec and WireGuard, split tunnelling, and the trust assumptions each design bakes in.",
      "Network Monitoring": "Flow data, span ports, and choosing what to keep when you cannot keep everything.",
      "Packet Analysis": "Wireshark as an investigative instrument — filters, follow-stream, and protocol dissection.",
      "DNS Security": "Poisoning, tunnelling, and exfiltration hiding inside the one protocol nobody blocks.",
      "Wireless Security": "WPA2 and WPA3 handshakes, rogue access points, and why the perimeter leaks through the air.",
      "Network Segmentation": "VLANs and microsegmentation as the single most effective limit on lateral movement.",
      "Zero Trust Architecture": "Replacing implicit network trust with per-request verification of identity and device posture.",
    },
  },

  "penetration-testing": {
    tagline: "A repeatable method for finding what an attacker would find.",
    domain: "Offensive Security",
    level: "Intermediate",
    estimatedTime: "~8 months",
    summary: [
      "Penetration testing is the discipline of simulating a real attack under rules of engagement and then explaining it well enough that it gets fixed. The skill is less about knowing exploits and more about method: reconnaissance, enumeration, exploitation, and post-exploitation applied consistently until something gives.",
      "This track follows that kill chain in order. You will spend real time on enumeration, which is where most engagements are actually won, then move through exploitation and privilege escalation on both Linux and Windows before reaching Active Directory — the environment where most corporate testing happens.",
      "Reporting is treated as a first-class skill here, not an afterthought. A finding nobody can reproduce has no value.",
    ],
    outcomes: [
      "Run a full engagement from scoping through to a written report",
      "Enumerate a host or network exhaustively rather than stopping at the first open port",
      "Escalate privileges reliably on both Linux and Windows targets",
      "Attack a realistic Active Directory environment and explain the blast radius",
    ],
    prerequisites: ["Linux command line fluency", "Networking fundamentals (see the Network Security track)", "Basic scripting in Python or Bash"],
    careers: ["Penetration Tester", "Security Consultant", "Red Team Operator", "Vulnerability Researcher"],
    toolCategories: ["Penetration Testing", "Network Security", "Web Security"],
    modules: ["Method & recon", "Exploitation", "Post-exploitation & AD"],
    topicNotes: {
      Reconnaissance: "Passive and active information gathering before you touch anything that logs.",
      "Scanning & Enumeration": "The phase that decides the engagement. Slow, exhaustive, and endlessly revisited.",
      "Vulnerability Assessment": "Separating the scanner's noise from the handful of findings that actually chain.",
      Exploitation: "Turning a known weakness into reliable, repeatable access.",
      "Post-Exploitation": "Situational awareness, credential harvesting, and deciding where to go next.",
      "Privilege Escalation": "Local misconfigurations and kernel paths that take you from user to root or SYSTEM.",
      "Lateral Movement": "Reusing credentials and trust relationships to spread across a network.",
      Reporting: "Reproduction steps, impact, and remediation — the deliverable the client actually pays for.",
      "Web App Pentesting": "Applying the same method to applications; overlaps heavily with the Web Security track.",
      "Active Directory Attacks": "Kerberoasting, delegation abuse, and ACL paths — where most corporate engagements are decided.",
    },
  },

  "malware-analysis": {
    tagline: "Take the sample apart and find out what it really does.",
    domain: "Defensive Research",
    level: "Intermediate",
    estimatedTime: "~7 months",
    summary: [
      "Malware analysis answers the questions an incident responder cannot answer from logs alone: what did this binary do, what did it talk to, and how do we detect the next one? It sits at the intersection of reverse engineering and threat intelligence.",
      "The track moves from static triage — strings, imports, PE structure — into dynamic detonation in an instrumented sandbox, and then into the behavioural analysis that produces durable detection logic. You will write YARA rules against real sample families rather than toy examples.",
      "Everything here assumes a properly isolated lab. Building that lab safely is the first module for a reason.",
    ],
    outcomes: [
      "Triage an unknown binary statically and decide whether it warrants deeper analysis",
      "Detonate a sample safely and capture its full behavioural footprint",
      "Write YARA rules that catch a family rather than a single hash",
      "Produce indicators and a written analysis that a SOC can operationalise",
    ],
    prerequisites: ["Comfort with Windows internals at a basic level", "Some exposure to assembly or a willingness to learn it", "A dedicated, isolated virtual machine"],
    careers: ["Malware Analyst", "Threat Intelligence Analyst", "Incident Responder", "Detection Engineer"],
    toolCategories: ["Reverse Engineering", "Blue Team", "Digital Forensics"],
    modules: ["Static triage", "Dynamic analysis", "Intelligence & detection"],
    topicNotes: {
      "Static Analysis": "Reading the sample without running it — strings, imports, entropy, and packing indicators.",
      "Dynamic Analysis": "Detonating in an instrumented environment and watching what it touches.",
      "Behavioral Analysis": "Moving from individual API calls to the intent behind them.",
      Sandboxing: "Building isolation that the sample cannot detect and cannot escape.",
      "PE File Analysis": "Headers, sections, and the import table as a map of the binary's capabilities.",
      "Ransomware Analysis": "Key handling, encryption routines, and whether recovery is realistically possible.",
      "Rootkit Detection": "Hooking, driver abuse, and finding what is actively hiding itself from you.",
      "Threat Intelligence": "Turning a single sample into attribution, campaign context, and shareable indicators.",
      "YARA Rules": "Pattern logic that generalises across a family instead of matching one build.",
      "Malware Families": "Knowing the major lineages so a new sample has somewhere to sit.",
    },
  },

  "digital-forensics": {
    tagline: "Reconstruct what happened, in a way that holds up.",
    domain: "Incident Response",
    level: "Intermediate",
    estimatedTime: "~6 months",
    summary: [
      "Digital forensics is disciplined reconstruction. Given a disk image, a memory capture, or a pile of logs, the job is to establish a defensible timeline of what happened, when, and by whom — and to do it without contaminating the evidence.",
      "This track covers the major evidence sources in turn: disk, memory, network, and mobile. Alongside the technical work it takes procedure seriously, because an analysis that cannot survive scrutiny of its chain of custody is worth very little in the contexts where forensics matters most.",
      "It pairs directly with incident response: in practice the same people often do both, under time pressure.",
    ],
    outcomes: [
      "Acquire disk and memory images without altering the source",
      "Reconstruct a defensible timeline from multiple independent evidence sources",
      "Recover deleted and partially overwritten artefacts from a file system",
      "Maintain chain of custody documentation that survives review",
    ],
    prerequisites: ["File system fundamentals (NTFS, ext4)", "Basic Linux and Windows administration", "Methodical note-taking habits"],
    careers: ["Digital Forensics Examiner", "Incident Responder", "eDiscovery Analyst", "Law Enforcement Cyber Investigator"],
    toolCategories: ["Digital Forensics", "Blue Team"],
    modules: ["Evidence handling", "Analysis by source", "Timeline & response"],
    topicNotes: {
      "Disk Forensics": "Imaging, hashing, and carving artefacts out of file system structures.",
      "Memory Forensics": "Volatile evidence — running processes, injected code, and keys that exist nowhere on disk.",
      "Network Forensics": "Reconstructing sessions and transfers from captured traffic.",
      "Mobile Forensics": "Acquisition and analysis on locked, encrypted, and cloud-backed devices.",
      "Log Analysis": "Correlating across sources where each one only tells part of the story.",
      "Evidence Collection": "Order of volatility, write blockers, and the decisions made in the first ten minutes.",
      "Chain of Custody": "The documentation that makes an analysis defensible rather than merely correct.",
      "Timeline Analysis": "Fusing timestamps from many sources into one coherent narrative.",
      "File System Analysis": "NTFS, ext4, and APFS internals — where deleted data actually lingers.",
      "Incident Response": "The wider process forensics feeds: contain, eradicate, recover, learn.",
    },
  },

  "red-team": {
    tagline: "Adversary simulation against a defence that is watching.",
    domain: "Offensive Security",
    level: "Advanced",
    estimatedTime: "~9 months",
    summary: [
      "Red teaming is not penetration testing with a better name. The objective is different: rather than enumerating vulnerabilities, you emulate a specific adversary against a live defence to test whether that defence detects and responds.",
      "That changes the skill set. Stealth, infrastructure, and tradecraft matter more than exploit count. This track covers command-and-control design, evasion, and the human and physical vectors that technical controls do not cover — all of which assume you already have solid penetration testing fundamentals.",
      "Every technique here belongs inside a written rules-of-engagement document, agreed with the organisation being tested, before anything is executed.",
    ],
    outcomes: [
      "Plan an engagement around a specific threat actor's documented behaviour",
      "Stand up resilient command-and-control infrastructure",
      "Gain and keep access without tripping the defences you are testing",
      "Debrief a blue team on exactly what they missed and why",
    ],
    prerequisites: ["Solid penetration testing fundamentals", "Active Directory attack experience", "Comfort writing tooling in C#, Python, or Go"],
    careers: ["Red Team Operator", "Adversary Emulation Specialist", "Security Consultant", "Purple Team Lead"],
    toolCategories: ["Red Team", "Penetration Testing"],
    modules: ["Planning & OSINT", "Access & control", "Persistence & evasion"],
    topicNotes: {
      "Adversary Simulation": "Emulating a documented threat actor's behaviour rather than improvising freely.",
      "Social Engineering": "The human attack surface, which remains the most reliable initial access vector.",
      "Phishing Campaigns": "Pretext, infrastructure, and payload delivery that survives contact with a mail gateway.",
      "C2 Frameworks": "Command-and-control design, redirectors, and traffic that blends into the baseline.",
      "Evasion Techniques": "Understanding EDR telemetry well enough to operate underneath it.",
      "Physical Security": "Badge cloning, tailgating, and drop devices — where the network perimeter ends.",
      OSINT: "Building the target picture from public sources before touching anything.",
      "Initial Access": "The first foothold, and choosing the vector with the best noise-to-value ratio.",
      Persistence: "Surviving reboots and credential resets without leaving obvious artefacts.",
      Exfiltration: "Demonstrating data loss over channels the defence is not inspecting.",
    },
  },

  "blue-team": {
    tagline: "Detection, response, and the operations that make them work.",
    domain: "Defensive Security",
    level: "Beginner",
    estimatedTime: "~6 months",
    summary: [
      "Blue team work is where security meets operations. The job is to see what is happening across an estate, decide quickly what matters, and respond before an intrusion becomes an incident — repeatedly, under alert volume that never stops.",
      "This track covers the SOC toolchain from the analyst's seat outward: SIEM query fluency, endpoint telemetry, triage discipline, and then the engineering work of writing detections that fire on attacker behaviour rather than on easily-changed indicators.",
      "It rewards pairing with an offensive track. The best detection engineers know precisely what the attack looks like from the other side.",
    ],
    outcomes: [
      "Triage an alert queue and justify what you escalated and what you closed",
      "Write SIEM queries that answer an investigative question, not just return rows",
      "Build behavioural detections mapped to MITRE ATT&CK techniques",
      "Run an incident from detection through to a written post-incident review",
    ],
    prerequisites: ["Networking and operating system fundamentals", "Basic log formats and parsing", "Comfort with a query language"],
    careers: ["SOC Analyst", "Detection Engineer", "Incident Responder", "Security Operations Manager"],
    toolCategories: ["Blue Team", "Network Security", "Digital Forensics"],
    modules: ["Visibility", "Detection & hunting", "Response & engineering"],
    topicNotes: {
      "SIEM Operations": "Ingestion, normalisation, and writing queries that answer a real question.",
      "Threat Hunting": "Starting from a hypothesis instead of waiting for an alert to arrive.",
      "Incident Response": "The formal cycle — prepare, detect, contain, eradicate, recover, review.",
      "Log Analysis": "Knowing which log answers which question, and what each source silently omits.",
      "Endpoint Detection": "EDR telemetry, process trees, and what the agent cannot see.",
      "Security Monitoring": "Coverage, alert fatigue, and the tuning that keeps a queue survivable.",
      "Vulnerability Management": "Prioritising by exploitability and exposure rather than by CVSS alone.",
      "Threat Intelligence": "Turning external reporting into detections that fire in your environment.",
      "SOC Operations": "Shift handover, runbooks, and the process discipline that makes a team scale.",
      "Detection Engineering": "Building rules on attacker behaviour so they survive a changed hash or domain.",
    },
  },

  cryptography: {
    tagline: "The mathematics everything else quietly depends on.",
    domain: "Foundations",
    level: "Intermediate",
    estimatedTime: "~6 months",
    summary: [
      "Cryptography underpins every other domain in this platform, and it is the one most often used incorrectly. The practical goal of this track is not to invent ciphers — it is to know which primitive fits a problem, how implementations fail, and how to spot a broken construction in a code review.",
      "You will work through symmetric and asymmetric primitives, hashing, and signatures, then move into the protocol layer where TLS and PKI combine them. The attack sections matter most: padding oracles, nonce reuse, and length extension teach more about a primitive than its specification does.",
      "The recurring lesson is that cryptographic failures are almost always failures of use rather than of the underlying mathematics.",
    ],
    outcomes: [
      "Choose the correct primitive and mode for a given security requirement",
      "Recognise misuse — ECB, reused nonces, unauthenticated encryption — in a code review",
      "Explain how TLS and PKI establish trust, and where that trust can break",
      "Execute classic attacks such as padding oracles and length extension",
    ],
    prerequisites: ["Comfortable with modular arithmetic", "Ability to read and write Python", "Patience for specifications"],
    careers: ["Cryptography Engineer", "Application Security Engineer", "Security Researcher", "PKI Administrator"],
    toolCategories: ["Cryptography"],
    modules: ["Primitives", "Protocols & PKI", "Attacks & frontiers"],
    topicNotes: {
      "Symmetric Encryption": "AES and ChaCha20, and why the mode of operation matters more than the cipher.",
      "Asymmetric Encryption": "RSA and elliptic curves — key exchange and encryption without a shared secret.",
      "Hashing Algorithms": "Preimage and collision resistance, and why fast hashes are wrong for passwords.",
      "Digital Signatures": "Authenticity and non-repudiation, plus the nonce failures that leak private keys.",
      "PKI & Certificates": "Chains of trust, certificate authorities, revocation, and how it fails in practice.",
      "TLS/SSL": "The handshake in detail — the single most important protocol on the internet.",
      "Cryptographic Attacks": "Padding oracles, length extension, and side channels that ignore the mathematics entirely.",
      "Key Management": "Generation, rotation, storage, and destruction — where real systems usually break.",
      "Blockchain Basics": "Merkle trees and consensus as an applied use of hashing and signatures.",
      "Quantum Cryptography": "What Shor's algorithm actually threatens, and what post-quantum migration involves.",
    },
  },

  "cloud-security": {
    tagline: "The perimeter is an IAM policy now.",
    domain: "Infrastructure",
    level: "Intermediate",
    estimatedTime: "~6 months",
    summary: [
      "Cloud platforms rearranged the security model: the network perimeter thinned out and identity became the real control plane. Most cloud breaches are not exotic — they are a public storage bucket, an over-permissive role, or a leaked key with no expiry.",
      "This track covers the three major providers with an emphasis on what transfers between them, then goes deep on identity and access management, container and Kubernetes security, and the misconfiguration classes that dominate real incidents.",
      "It assumes some infrastructure background. If you have not done the Network Security track, start there.",
    ],
    outcomes: [
      "Audit an AWS, Azure, or GCP account for the misconfigurations that matter most",
      "Design least-privilege IAM policies and explain the blast radius of each role",
      "Secure a container build pipeline and a Kubernetes cluster's runtime posture",
      "Map a cloud environment's attack paths from an initial credential outward",
    ],
    prerequisites: ["Networking fundamentals", "Linux administration", "Basic familiarity with at least one cloud console"],
    careers: ["Cloud Security Engineer", "DevSecOps Engineer", "Cloud Security Architect", "Platform Security Engineer"],
    toolCategories: ["Cloud Security", "Penetration Testing"],
    modules: ["Provider foundations", "Identity & workloads", "Posture & compliance"],
    topicNotes: {
      "AWS Security": "IAM, S3, VPC, and CloudTrail — the four services behind most AWS incidents.",
      "Azure Security": "Entra ID, role assignments, and the hybrid identity surface joining cloud to on-premises.",
      "GCP Security": "Projects, service accounts, and the organisation policy hierarchy.",
      "IAM & Access Control": "Least privilege, role assumption, and the privilege-escalation paths policies create.",
      "Container Security": "Image provenance, registry scanning, and shrinking the runtime attack surface.",
      "Kubernetes Security": "RBAC, network policies, admission control, and pod security standards.",
      "Serverless Security": "Function permissions, event injection, and dependency risk without a host to patch.",
      "Cloud Misconfigurations": "Public buckets and wildcard policies — the leading cause of real cloud breaches.",
      "Cloud Compliance": "Mapping controls to CIS benchmarks and the shared responsibility model.",
      "Multi-Cloud Security": "Consistent policy and identity federation across providers that disagree on everything.",
    },
  },

  "reverse-engineering": {
    tagline: "Read the binary when there is no source to read.",
    domain: "Research",
    level: "Advanced",
    estimatedTime: "~9 months",
    summary: [
      "Reverse engineering is the deepest technical track here. Given only a compiled artefact, you recover its logic — to find vulnerabilities, to understand malware, or to interoperate with something undocumented.",
      "It starts with x86 and x64 assembly, because nothing further makes sense without it, then moves through disassembly and decompilation with Ghidra and IDA, into debugging, and finally into binary exploitation where understanding becomes control.",
      "Progress is slower here than on any other track and the early plateau is steep. The payoff is that very few people push through it, and the skill transfers directly into malware analysis and vulnerability research.",
    ],
    outcomes: [
      "Read x86/x64 assembly fluently enough to follow unfamiliar control flow",
      "Recover a program's logic using a disassembler and decompiler",
      "Debug a live process to confirm what static analysis only suggested",
      "Develop a working exploit for a memory-corruption vulnerability",
    ],
    prerequisites: ["Solid C programming", "Operating system and memory layout fundamentals", "High tolerance for slow, detailed work"],
    careers: ["Reverse Engineer", "Vulnerability Researcher", "Malware Analyst", "Exploit Developer"],
    toolCategories: ["Reverse Engineering", "Penetration Testing"],
    modules: ["Assembly & tooling", "Analysis", "Exploitation & platforms"],
    topicNotes: {
      "x86/x64 Assembly": "Registers, calling conventions, and the stack — the foundation for everything below.",
      Disassembly: "Turning machine code back into instructions and recovering control flow graphs.",
      Decompilation: "Ghidra and IDA reconstructing C-like output, and knowing where they lie to you.",
      Debugging: "GDB and x64dbg — watching memory change confirms what static reading only implies.",
      "Binary Exploitation": "Stack and heap corruption, ROP chains, and modern mitigation bypasses.",
      "Firmware Analysis": "Extracting and analysing embedded images where no operating system helps you.",
      "Android RE": "Smali, DEX, and native libraries inside an APK.",
      "iOS RE": "Mach-O binaries, Objective-C runtime structures, and a far more hostile toolchain.",
      "Anti-Reversing Techniques": "Packing, obfuscation, and anti-debug tricks — and how to defeat them.",
      Patching: "Modifying a binary's behaviour directly, the practical proof you understood it.",
    },
  },
};

export const getTrackDetail = (id: string): TrackDetail | undefined => trackDetails[id];
