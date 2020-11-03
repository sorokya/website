---
title: "GUIs and Threads in Rust"
date: 2020-11-03T11:41:32-05:00
draft: false
tags: [
    "rust",
    "threads",
    "gui",
    "eo",
]
---

One thing I've really been wanting to accomplish with my [eobot](https://git.sr.ht/~rleek/eobot) project
is a GUI. I explored a few options for getting a GUI up and running. I'd heard a lot of projects go the
electron route but I didn't really want to pull in all the bloat for this.

A slimmer option that seemed appealing was the [web-view](https://github.com/Boscop/web-view) crate.
Its purpose is to open a native window + web view using the system's default web render stack. I set
up a project and went along trying to write some react+webpack front-end but I could not get it to work
on my system (Windows 10 LTSC 2019) at all. From what I could tell it was trying to run the code in an
IE11 window and I couldn't get it to use Edge.

A few weeks ago I decided I'd just go native. I went with the [native-windows-gui](https://github.com/gabdube/native-windows-gui) crate for this. Here's the first mockup I created with the crate.

![mockup](../mockup.png)

The idea is that on the world tab you'll get a view into the game world of [eo](https://game.eoserv.net).
The map will show you other players/npcs/drops/warps/chests/etc around the logged in player. The lists on
the side will give you a more detailed list of npcs, drops, and other players around you. The packets tab will give you a detailed summary of each packet sent to and from the server. This will be useful for debugging and just be fun to look at.
Finally the settings tab will just be a place to easily modify the config.toml file for the bot.

So once I had decided on a GUI it came time to actually try getting the bot running with it. I knew I was
going to need a separate thread to run the bot on. I couldn't believe how easy it really was once I did a
little bit of searching and read a few documents on the rust website. Below is a snippet of code from the
GUI programs main.rs file.

```rust
fn main() {
    let (tx, rx) = mpsc::channel();
    nwg::init().expect("Failed to init Native Windows GUI");
    nwg::Font::set_global_family("Segoe UI").expect("Failed to set default font");
    let mut _app = EOBot::build_ui(Default::default()).expect("Failed to build UI");

    thread::spawn(move || {
        let mut client = Client::new();

        // snipped configuration

        match client.load_pub_files() {
            Ok(_) => {}
            Err(e) => {
                println!("Error Encountered loading pub files: {:?}", e);
            }
        }

        if client.connect().unwrap() {
            client.send_init_request();
            const UPDATE_INTERVAL_MILLIS: u64 = 500;
            const SLEEP_INTERVAL_MILLIS: u64 = 50;
            let mut update_timer = 0;
            while client.connected {
                match client.receive_and_process() {
                    Ok(_) => {}
                    Err(e) => {
                        if e.kind() != io::ErrorKind::WouldBlock {
                            println!("Error Encountered, closing: {:?}", e);
                            client.connected = false;
                        }
                    }
                }
                if update_timer == 0 {
                    let mut chat_log: Vec<String> = Vec::with_capacity(client.chat_log.len());
                    chat_log.append(&mut client.chat_log);

                    let mut packet_log: Vec<(message::PacketSender, packet::Packet)> =
                        Vec::with_capacity(client.packet_log.len());
                    packet_log.append(&mut client.packet_log);

                    tx.send(message::Message {
                        chat: chat_log,
                        packets: packet_log,
                        drops: client.drops.clone(),
                        characters: client.characters.clone(),
                        npcs: client.npcs.clone(),
                    })
                    .unwrap();
                    update_timer = UPDATE_INTERVAL_MILLIS;
                } else {
                    update_timer -= SLEEP_INTERVAL_MILLIS;
                }
                thread::sleep(time::Duration::from_millis(SLEEP_INTERVAL_MILLIS));
            }
        }
    });
}
```

To pass data between the threads I decided to use a multiple producer, single consumer channel.
It's created like this. [Rust book chapter on the subject](https://doc.rust-lang.org/book/ch16-02-message-passing.html)
```rust
let (tx, rx) = mpsc::channel();
```

The eobot thread runs ever 50ms and I coded a sort of timer into it so that it'll update the GUI thread
every 500ms. I created a message struct inside the eobot library that contains the data we want
to send back to the consuming application (in this case the GUI app).
```rust
#[derive(Debug)]
pub struct Message {
    pub chat: Vec<String>,
    pub packets: Vec<(PacketSender, Packet)>,
    pub drops: Vec<Drop>,
    pub characters: Vec<Character>,
    pub npcs: Vec<Npc>,
}

#[derive(Debug)]
pub enum PacketSender {
    Client,
    Server,
}
```

As of right now the chat, and packets members only contain a pending Vec of items. This means the consumer can
append them to the view as it comes in. The other three members are the complete list of drops/characters/npcs
in the world view. I might change these to all be separate messages and actually send to the consumer as the events
are happening in the main loop, but this is working for now.

The one thing that really let this all come together was this function from the nwg crate
```rust
nwg::dispatch_thread_events_with_callback(move || {
    if let Ok(m) = rx.try_recv() {

        // this takes the message struct from above and updates the gui
        _app.process_bot_state(m);
    }

    // cpu runs like crazy without this
    thread::sleep(time::Duration::from_millis(1));
});
```

The default `nwg::dispatch_thread_events` function doesn't have a callback so you wouldn't
be able to run your own code on every cycle of the event loop. I had to add that `thread::sleep` call at
the bottom when I noticed my program was using 30%+ of cpu while running.

Anywho, I'm quite happy with the results so far. The last thing I got working was the packet log.
But soon I'd like to add popup windows to the GUI so when you click a packet you get a view of
all the data, sequence numbers, encoding, etc.

There's still a ton left to do on this project but it's a lot of fun to work on.
