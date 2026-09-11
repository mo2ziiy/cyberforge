import type { Writeup } from "@/data/writeups";

/**
 * Builds a structured, plausible walkthrough body from a writeup's metadata.
 *
 * The source data only carries a description and a list of topics, so the four
 * canonical sections (Reconnaissance, Exploitation, Privilege Escalation, Flags)
 * are generated deterministically from that metadata. The commands are realistic
 * for the platform and category but illustrative — they are not a live exploit
 * against any specific target. This keeps every writeup page consistent without
 * shipping copy-paste attack chains for real machines.
 */

export interface WriteupSection {
  id: string;
  title: string;
  body: string[];
  code?: { title: string; code: string };
}

const host = (w: Writeup) => {
  const base = w.title.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return `${base || "target"}.htb`;
};

const reconCode = (w: Writeup) => {
  const target = "10.10.11.42";
  return {
    title: "nmap — service discovery",
    code: [
      `$ nmap -sC -sV -oN nmap/initial ${target}`,
      "PORT     STATE SERVICE  VERSION",
      "22/tcp   open  ssh      OpenSSH 8.9p1 Ubuntu",
      "80/tcp   open  http     nginx 1.18.0",
      `$ echo "${target} ${host(w)}" | sudo tee -a /etc/hosts`,
      `$ gobuster dir -u http://${host(w)} -w /usr/share/wordlists/dirb/common.txt -q`,
      "/login                (Status: 200)",
      "/api                  (Status: 401)",
    ].join("\n"),
  };
};

const categoryExploit: Record<Writeup["category"], { title: string; code: string; note: string }> = {
  Web: {
    title: "exploitation — injection to foothold",
    note: "The application trusted user input in a database query, so a crafted parameter returned rows it should not have.",
    code: ["$ sqlmap -u 'http://target/item?id=1' --batch --dump", "[*] fetching entries", "$ curl -s http://target/api/export | jq '.credentials'"].join("\n"),
  },
  Pwn: {
    title: "exploitation — memory corruption",
    note: "A missing bounds check on the input buffer let us overwrite the saved return address and redirect execution.",
    code: ["$ checksec --file=./vuln", "$ python3 -c 'from pwn import *; print(cyclic(200))' | ./vuln", "$ python3 exploit.py REMOTE target 1337"].join("\n"),
  },
  Forensics: {
    title: "analysis — evidence extraction",
    note: "The capture hid the payload inside otherwise ordinary traffic; carving it out revealed the transferred artefact.",
    code: ["$ file evidence.raw", "$ binwalk -e evidence.raw", "$ strings -n 8 evidence.raw | grep -i flag"].join("\n"),
  },
  Crypto: {
    title: "exploitation — breaking the scheme",
    note: "The implementation reused a nonce, which collapsed the security of the whole construction.",
    code: ["$ python3 solve.py challenge.txt", "[*] recovering key from reused nonce", "[+] plaintext recovered"].join("\n"),
  },
  Reverse: {
    title: "analysis — recovering the logic",
    note: "Decompilation exposed a check that compared the input against a value computed at runtime.",
    code: ["$ file ./bin", "$ r2 -A ./bin", "[0x00001060]> pdf @ main", "$ ./bin $(python3 keygen.py)"].join("\n"),
  },
  OSINT: {
    title: "investigation — pivoting on public data",
    note: "Public records tied the handle to an email, and that email to the account holding the flag.",
    code: ["$ sherlock target_handle", "$ theHarvester -d target.com -b all", "$ exiftool downloaded_image.jpg | grep -i gps"].join("\n"),
  },
  Misc: {
    title: "exploitation — chaining the pieces",
    note: "No single step was decisive; the foothold came from combining several small oversights.",
    code: ["$ ./enumerate.sh target", "$ curl -s http://target/debug | tee debug.txt", "$ grep -iE 'pass|token|key' debug.txt"].join("\n"),
  },
  Network: {
    title: "exploitation — abusing the protocol",
    note: "A service on the wire accepted unauthenticated commands, which we used to pivot inward.",
    code: ["$ responder -I tun0 -wv", "$ crackmapexec smb target -u users.txt -p passwords.txt", "$ evil-winrm -i target -u svc -p 'recovered'"].join("\n"),
  },
};

const privescCode = (w: Writeup) => {
  const isWindows = w.platform === "HackTheBox" && w.topics.some((t) => /active directory|windows|kerberos/i.test(t));
  if (isWindows) {
    return {
      title: "privilege escalation — Windows",
      code: ["PS> whoami /priv", "SeImpersonatePrivilege        Enabled", "PS> .\\GodPotato.exe -cmd 'cmd /c whoami'", "nt authority\\system"].join("\n"),
    };
  }
  return {
    title: "privilege escalation — Linux",
    code: ["$ sudo -l", "User svc may run the following commands:", "    (root) NOPASSWD: /usr/bin/tar", "$ sudo tar -cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh", "# id", "uid=0(root) gid=0(root) groups=0(root)"].join("\n"),
  };
};

export function buildWriteupSections(w: Writeup): WriteupSection[] {
  const exploit = categoryExploit[w.category] ?? categoryExploit.Misc;
  const first = w.topics[0] ?? "the exposed service";
  const privescNeeded = w.platform === "HackTheBox" || w.platform === "VulnHub" || w.platform === "TryHackMe";

  const sections: WriteupSection[] = [
    {
      id: "reconnaissance",
      title: "Reconnaissance",
      body: [
        `Every engagement starts with mapping what is reachable. A full service scan of ${w.title} highlighted the exposed surface and pointed at ${first.toLowerCase()} as the most promising entry point.`,
        "Enumeration is deliberately exhaustive here — the goal is to leave no service unexamined before committing to an attack path.",
      ],
      code: reconCode(w),
    },
    {
      id: "exploitation",
      title: "Exploitation",
      body: [
        exploit.note,
        `In this ${w.category.toLowerCase()} challenge that translated into a repeatable foothold. ${w.description}`,
      ],
      code: { title: exploit.title, code: exploit.code },
    },
  ];

  if (privescNeeded) {
    sections.push({
      id: "privilege-escalation",
      title: "Privilege Escalation",
      body: [
        "With a foothold established, the next step is enumerating the local environment for a path to full control — misconfigured sudo rules, dangerous capabilities, or an over-privileged service account.",
        `For ${w.title}, ${w.difficulty === "Easy" ? "the escalation was a well-known misconfiguration" : "the escalation required chaining a couple of findings together"}.`,
      ],
      code: privescCode(w),
    });
  }

  sections.push({
    id: "flags",
    title: "Flags",
    body: [
      privescNeeded
        ? "Both the user and root flags are captured below. Redact the hashes when you publish — they are unique per instance."
        : "The flag is recovered directly from the solved challenge.",
    ],
    code: {
      title: "flags",
      code: privescNeeded
        ? ["$ cat /home/svc/user.txt", "e3b0c44298fc1c149afbf4c8996fb924", "# cat /root/root.txt", "2c26b46b68ffc68ff99b453c1d30413d"].join("\n")
        : [`$ cat flag.txt`, `${w.platform === "PicoCTF" ? "picoCTF{" : "flag{"}redacted_for_this_writeup}`].join("\n"),
    },
  });

  return sections;
}
