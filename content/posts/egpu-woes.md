---
title: "eGPU Woes"
date: 2020-05-12T08:56:59+02:00
draft: false
tags: [
    "eGPU",
    "EXP GDC Beast",
    "Thinkpad",
    "X220",
    "Windows",
    "Linux",
]
---

I've been using my thinkpad x220 as my primary pc for the last four weeks
or so. It can handle a little gaming but not very much with it's little
intel 2nd gen gpu. So last week I decided to order some parts for an
eGPU (External GPU) setup.

I ordered the EXP GDC Beast 8.5c, an old Dell 2A 220W power brick,
and an ASUS GTX 750 Ti GPU. Should be a nice boost in performance for
my little thinkpad!

The parts came one by one in the mail. First the video card, then the power
brick, then finally yesterday I got the EXP GDC Beast. I started setting it
all up around two in the afternoon. I plugged it all in, booted my system,
and nothing worked!

I heard that eGPU setups can be tricky, but from the videos and stories
I had seen before with almost identical setups to mine I figured this would
work great, no problem! But alas, here we are.

Everything after GRUB lagged horribly, as soon as the kernal/systemd
started to mount the card it was like my CPU was performing at less than
half capacity. The heat sink fan was going hard. Characters were lagging
as they rendered onto the terminal (we aren't even in X yet).

After an hour or so of troubleshooting drivers, and BIOS settings I decided
to give windows a shot! My uncle had an extra SSD so I popped it in and
did a fresh install of windows 10 on my laptop. Shut it down, plugged in
the card, and windows is having the exact same issue!

So I have no idea what's going on. I took the video card to a friend's
house and tested it in his system and it worked great. So it's got to be
either my laptop, the power brick, or the EXP GDC Beast. I've kinda given
up on fixing it today. I might try a different power supply later to see
if that changes anything.

I'll post again if I get this thing to work!
