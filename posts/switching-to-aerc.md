---
title: Switching to aerc
layout: posts.liquid
is_draft: false
---

Today I started using "The world's best email client" [aerc](https://aerc-mail.org/).
I've been using Mozilla Thunderbird for years and wanted to try something a little more light
and efficient. Thunderbird works great, but I couldn't help but feel like it's just too much
for an email/calendar client.

This wasn't the first time I've tried using a terminal based email client. Not too long ago
I tried getting into mutt/neomutt but just found the learning curve too high. I couldn't just
set it up and start using it as a replacement for thunderbird the way I did with aerc.

aerc is very easy to configure. It has a built in tutorial `man aerc-tutorial` or `:help tutorial`
from within the program itself. It has a build in wizard for adding mail accounts that worked
perfectly for my accounts.

About a month ago I setup my own NextCloud instance to syncronize my calendar and files across
my devices. Thunderbird has a built in calendar that worked well with CalDAV, but aerc is just
an email client. So I had to turn to another program if I wanted to access my calendar easily
without a web browser.

My first choice was [khal](https://github.com/pimutils/khal). It came up
when I searched for a terminal based CalDAV client. It seemed nice at first glance, but I just
couldn't get it configured the way I wanted and shortly gave up on it.

After khal I turned to [calcurse](https://www.calcurse.org/). It seemed to be a more mature
program. They only have experimental support for CalDAV, but the
[script](https://www.calcurse.org/files/calcurse-caldav.html) seemed to work fine for
me when I set it up against my NextCloud.

I wanted to be able to share my [dotfiles](https://git.sr.ht/~rleek/dotfiles) for easy syncing
between my devices, but the problem with the default configuration of calcurse (for caldav support anyway)
and aerc is that your passwords are stored in plain text. They both have the ability to load your
password from an external program or command. I chose to use [keyring](https://github.com/jaraco/keyring).
You can install it with the [python-keyring](https://www.archlinux.org/packages/community/any/python-keyring/)
package on Arch. It integrates with a bunch of keyring backends and can be used to store and retrieve passwords
securely.

For aerc there are 3 changes you need to make per mail account.
1) Remove your password from the source and outgoing fields (e.g. bob@example.com:password to just bob@example.com)
2) Add source-cred-cmd and give it the keyring command for retreiving your password.
3) Add outgoing-cred-cmd and give it the keyring command for retreiving your password.
```
[Personal]
source   = imaps://richard%40richardleek.com@mail.runbox.com
outgoing = smtps+plain://richard%40richardleek.com@mail.runbox.com:465
default  = INBOX
from     = Richard Leek <richard@richardleek.com>
copy-to  = Sent
source-cred-cmd = keyring get runbox richard@richardleek.com
outgoing-cred-cmd = keyring get runbox richard@richardleek.com
```

I made the mistake of ommitting the outgoing-cred-cmd the first time around and couldn't figure out
why my emails were failing to send. Another read of the man page and I figured out what I had missed.


CalCurse's CalDAV script is a little different. You have to set an environment variable before running
the script. I made a bash script to sync my calendar and open calcurse and alias'd calcurse to run it.

```bash
#!/bin/bash
CALCURSE_CALDAV_PASSWORD=$(keyring get cloud.richardleek.com rleek) calcurse-caldav
calcurse
```

I've only been running with this setup today, but so far I'm enjoing it. aerc is still under heavy development
and not quite stable yet, but it works for me. I recommend it to anyone looking for a light and fresh email
client for their terminal.
