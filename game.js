// Game state
const game = {
    player: {
        x: 0, // Center of room is 0
        y: 0,
        isJumping: false,
        isDoubleJumping: false,
        isCrouching: false,
        isWalking: false,
        facingRight: true,
        speed: 5,
        level: 5,
        currentFloor: 1,
        jumpCount: 0,
        canDoubleJump: false
    },
    camera: {
        x: 0
    },
    keys: {},
    lobbyWidth: 20000, // Expanded for more walking space
    screenWidth: window.innerWidth,
    npcPaths: {},
    highscores: {
        'brick-breaker': 12500,
        'pong': 8500,
        'pacman': 15200,
        'tetris': 9800,
        'space-invaders': 11300,
        'dino-run': 7200
    },
    gameRecords: {
        'brick-breaker': 15000,
        'pong': 10000,
        'pacman': 20000,
        'tetris': 12000,
        'space-invaders': 15000,
        'dino-run': 10000
    },
    currentGame: null,
    currentScore: 0
};

// NPC dialogues
const dialogues = {
    librarian: {
        title: "Librarian",
        content: "Welcome to our grand library! I'm the head librarian here. This library has been a cornerstone of knowledge for over a century. We have 10 distinct sections, each curated to provide a unique learning experience. Section 1 contains classic literature that has shaped our understanding of the world. Section 2 is dedicated to historical texts, while Section 3 focuses on philosophy and critical thinking. The sciences occupy Sections 4 and 5, with pure sciences in 4 and applied sciences in 5. Sections 6 and 7 are for arts and humanities, with fine arts in 6 and performing arts in 7. Technology and innovation are featured in Section 8, while Section 9 contains rare manuscripts and first editions. Finally, Section 10 is our special collections area, featuring items you won't find anywhere else in the world. If you reach level 10, you can use the elevator to access our second floor lounge, a more relaxed environment perfect for casual reading and discussions.",
        responses: {
            "Tell me more about the rare books in Section 9.": "Section 9 houses some of our most prized possessions. We have a first edition of Shakespeare's folio, original manuscripts from Jane Austen, and even a Gutenberg Bible leaf. These items are kept in climate-controlled cases and require special handling. Many researchers from around the world visit us specifically to access these rare materials.",
            "How do I level up in this library?": "You level up by exploring the library, reading books, interacting with other patrons, and playing educational games. Each book you read gives you experience points based on its difficulty and length. Talking to NPCs and learning from them also grants experience. The mini-games are designed to test different skills and knowledge areas, with successful completion granting additional experience points.",
            "What can you tell me about the second floor?": "The second floor is our lounge area, accessible only to those who have reached level 10. It features comfortable seating areas, a coffee shop, and more specialized collections. The atmosphere is more relaxed than the main floor, making it perfect for extended reading sessions or quiet discussions. We also host special events and author talks in the lounge area."
        }
    },
    researcher: {
        title: "Researcher",
        content: "Hello there! I'm a researcher specializing in ancient manuscripts. I've been working in this library for the past five years, studying texts that are over 500 years old. Section 3 has some fascinating texts that reveal how people thought about the world centuries ago. It's amazing how much we can learn from these old documents. I'm currently working on translating a 15th-century manuscript that contains what appears to be an early attempt at categorizing all human knowledge. The library's collection is truly unparalleled, with many items that cannot be found anywhere else. Have you had a chance to explore the different sections yet? Each one has its own unique atmosphere and focus.",
        responses: {
            "What's the most interesting discovery you've made?": "Last year, I was examining a manuscript that appeared to be a simple prayer book from the 14th century. However, under ultraviolet light, I discovered hidden text between the lines - it was actually a coded message detailing the location of a monastery that was thought to be lost. This discovery led to an archaeological expedition that uncovered the monastery, complete with a library of its own. It was an incredible feeling to be part of rediscovering a piece of history that had been lost for centuries.",
            "How does one become a researcher like you?": "It requires a great deal of education and passion. I have a PhD in Medieval Studies with a focus on paleography - the study of ancient writing systems. Beyond formal education, you need patience, attention to detail, and a genuine love for discovery. Many days are spent carefully examining documents that might yield nothing, but those moments when you do make a discovery make all the tedious work worthwhile. I'd recommend starting with volunteering at a local archive or special collections library to see if it's the right path for you.",
            "Can you recommend any books for a beginner interested in ancient texts?": "Absolutely! I'd suggest starting with 'The Book: A History of the Bible' by Christopher de Hamel, which provides a wonderful overview of how biblical texts have been preserved and transmitted through the centuries. For a broader look at ancient manuscripts, 'Scribes and Scholars' by L.D. Reynolds and N.G. Wilson is an excellent introduction to classical texts and their transmission. If you're interested in the physical aspects of books, 'The Phaidon Archive of Graphic Design' contains beautiful reproductions of historical texts."
        }
    },
    professor: {
        title: "Professor",
        content: "Greetings! I'm a professor of literature here at the university. This library is my second home - I've spent countless hours here researching and preparing my lectures. Section 5 contains our rare first editions, which are invaluable for my work. Only the most dedicated visitors make it that far in their exploration. The library's collection is truly remarkable, with items that span centuries of human thought and creativity. I often bring my students here to show them the physical manifestations of the texts we discuss in class. There's something magical about holding a book that was printed hundreds of years ago and knowing that others have held it, read it, and been influenced by it throughout history. Keep exploring and leveling up to unlock new areas - the library rewards curiosity and dedication.",
        responses: {
            "What do you teach?": "I primarily teach courses on 19th and 20th century literature, with a focus on the novel as a form. My specialty is post-colonial literature, examining how writers from former colonies have adapted and transformed the novel to express their unique cultural experiences. I also teach a seminar on textual criticism, where we examine how literary texts have been edited and interpreted over time. It's fascinating to see how the same text can be understood in such different ways across time and cultures.",
            "How has digital technology affected your research?": "Digital technology has revolutionized literary research in so many ways. Digital archives have made rare texts accessible to scholars who might never have been able to travel to see them in person. Text analysis software allows us to identify patterns and connections across large bodies of text that would be impossible for a human to detect. At the same time, I believe there's still irreplaceable value in handling physical texts - the feel of the paper, the smell of the ink, the marginalia left by previous readers. I try to give my students experiences with both digital and physical texts.",
            "What advice would you give to someone new to literature?": "Read widely and without judgment. Don't worry about what you 'should' be reading - read what interests you. Literature is about exploring human experience, and there are countless ways to do that. When you find something you love, dig deeper - learn about the author, the historical context, the literary tradition it's part of. But most importantly, allow yourself to be transported by the story. The academic analysis is important, but never lose sight of the simple pleasure of being swept away by a good narrative."
        }
    },
    historian: {
        title: "Historian",
        content: "Hello! I'm a historian specializing in local history. This library holds the history of our world in its collections. Section 7 has maps and documents that reveal secrets long forgotten. I've spent years piecing together the history of our town from these materials, and I'm still finding new connections and stories. It's amazing how much history is preserved in these documents - not just the grand narratives of wars and politics, but the everyday lives of ordinary people. A shopping list from a hundred years ago can tell us so much about what people valued, what they ate, how they lived. What will you discover on your journey through the library? Each section has its own treasures waiting to be found.",
        responses: {
            "What's the most surprising thing you've learned about our town's history?": "I was researching the founding of the town and discovered that it was originally established as a utopian community in the 1830s. The founders wanted to create a society based on equality and shared resources, which was quite radical for the time. What surprised me most was finding evidence that this community was more diverse than I had assumed - they actively welcomed people of all backgrounds, which was very unusual for that period. This progressive foundation shaped the town's development in ways that are still visible today.",
            "How do you use the library's resources in your work?": "The library is essential to my research. I regularly consult the map collection in Section 7 to track how the town has grown and changed over time. The newspaper archives are invaluable for understanding daily life in different eras. I also make use of personal papers and diaries that have been donated to the library - these provide insights into individual experiences that you can't find in official records. The library staff are incredibly knowledgeable and often help me discover resources I wouldn't have found on my own.",
            "Can you recommend a starting point for someone interested in local history?": "I'd suggest beginning with the general history section, where you'll find published works that provide an overview of the town's development. From there, you might want to explore the newspaper archives, which are digitized and searchable. Walking tours of historic districts can help connect the written history to physical places. And don't hesitate to talk to long-time residents - their personal memories are an important part of our local history that often isn't recorded in documents."
        }
    },
    student: {
        title: "Student",
        content: "Hi! I'm a student at the university, trying to finish my research paper. Section 2 has the best resources for my topic - I'm writing about environmental policy in the 20th century. The librarian recommended it to me, and she was absolutely right. I've found so many primary sources that I didn't even know existed. Sometimes it's overwhelming how much information is available here. I've been coming to this library since I was a kid, and I'm still discovering new sections and resources. What brings you to the library today? Are you working on a project too, or just exploring?",
        responses: {
            "What's your research paper about?": "I'm examining how environmental policy has evolved throughout the 20th century, particularly focusing on the tension between economic development and conservation. It's fascinating to see how attitudes have changed - in the early 1900s, conservation was mostly about preserving natural resources for human use, but by the late century, there was more emphasis on preserving ecosystems for their own sake. I'm looking at key legislation, court cases, and the influence of environmental movements. It's a big topic, but there are so many great resources here.",
            "How do you manage all the information available in the library?": "It can definitely be overwhelming! I've learned to be very systematic in my approach. I start with a clear research question and then use the library's catalog to identify potentially useful sources. I take detailed notes as I go, including complete citations so I can easily find things again. The librarians are incredibly helpful - they've taught me how to use databases effectively and how to evaluate sources for credibility. I also try to give myself time to just explore without a specific agenda - that's when I often make the most interesting discoveries.",
            "Do you have any advice for new students using the library?": "Absolutely! First, don't be intimidated by the size of the collection - librarians are there to help you navigate it. Second, learn to use the online catalog and databases effectively - they'll save you so much time. Third, don't limit yourself to digital resources - sometimes the best information is in physical books that haven't been digitized. And finally, explore beyond your immediate area of interest - you never know what connections you might discover between different fields of knowledge."
        }
    },
    bookworm: {
        title: "Bookworm",
        content: "Oh, hello! I didn't see you there. I was lost in my book again. I've read almost every book in sections 1-4. My goal is to read everything in the library! There's something magical about books - they can transport you to different times and places, introduce you to people you'd never meet otherwise, and teach you things you never imagined. Each section has its own character and treasures. Section 1 has the classics that have stood the test of time, while Section 2 takes you on a journey through history. Section 3 challenges your thinking with philosophy, and Section 4 reveals the wonders of science. What's your favorite section so far? Have you tried clicking on any books? You can read excerpts from many of them.",
        responses: {
            "What's the best book you've ever read?": "That's like asking a parent to choose their favorite child! I love different books for different reasons. If I had to choose just one, I'd say 'One Hundred Years of Solitude' by Gabriel García Márquez. The way he weaves magical realism with historical narrative is breathtaking. Every time I read it, I discover something new. The book creates an entire world that feels both fantastical and utterly real. It's the kind of book that stays with you long after you've finished it.",
            "How do you find time to read so much?": "I make reading a priority in my life. I always have a book with me, so I can read in spare moments - waiting for appointments, on my lunch break, before bed. I also try to limit screen time in the evenings. Most importantly, I choose books that genuinely interest me, so reading feels like a pleasure rather than a chore. I also vary my reading - sometimes I'll read something challenging that requires concentration, other times I'll opt for something lighter. Balance is key.",
            "Do you have any reading recommendations?": "Oh, so many! If you like classics, you can't go wrong with 'Middlemarch' by George Eliot - it's long but incredibly rewarding. For something more contemporary, I highly recommend 'The Overstory' by Richard Powers - it will change how you think about trees and our relationship with nature. If you enjoy science fiction, 'The Three-Body Problem' by Cixin Liu is mind-bending. And for non-fiction, 'Sapiens' by Yuval Noah Harari provides a fascinating overview of human history. But really, the best book is the one that speaks to you personally."
        }
    },
    curator: {
        title: "Curator",
        content: "Greetings! I'm the curator of special collections here at the library. Section 6 contains our archival materials and artifacts that aren't available anywhere else. These items are preserved under special conditions due to their rarity and fragility. My job is to acquire new items for the collection, preserve existing ones, and help researchers access these materials. It's a delicate balance between preservation and access. We have everything from medieval manuscripts to contemporary artists' books, from historical maps to personal letters of notable figures. Each item tells a story not just through its content, but through its physical existence - the materials it's made from, the marks of its creation, the traces of its journey through time. Would you like to see some of these treasures? Right-click on me to play a game!",
        responses: {
            "What's the most valuable item in your collection?": "Value can be measured in many ways - monetary, historical, cultural. One of our most monetarily valuable items is a first edition of Isaac Newton's 'Principia Mathematica.' But in terms of historical significance, I'd point to our collection of suffragette newspapers from the early 20th century. These relatively humble papers document a movement that changed our society. Culturally, perhaps our collection of zines from the punk movement of the 1970s and 80s - they represent a grassroots creative expression that influenced so much of what came after.",
            "How do you decide what to add to the collection?": "We have a collection development policy that guides our decisions. We consider factors like the item's relevance to our existing collections, its condition, its provenance (history of ownership), and its potential research value. We also consider our budget - rare items can be expensive. Sometimes items are donated, which allows us to acquire things we couldn't otherwise afford. We're particularly interested in items that document underrepresented aspects of our culture and history. It's not just about collecting 'important' items, but about building a collection that reflects the diversity of human experience.",
            "Can anyone access the special collections?": "Yes, but with some restrictions. Anyone can visit our exhibition space where we display rotating selections from the collections. For research purposes, we welcome students, scholars, and members of the public, but they do need to register with us and agree to follow our handling guidelines. Some of our most fragile items require supervision when used. We also offer tours and workshops to introduce people to the collections. Our goal is to make these materials as accessible as possible while ensuring they'll be available for future generations as well."
        }
    },
    archivist: {
        title: "Archivist",
        content: "Hello! I'm an archivist, which means I'm responsible for organizing, preserving, and providing access to historical documents. Section 8 contains our archival materials - these are unique, often one-of-a-kind documents that provide primary source evidence of past events. Unlike published books, which exist in multiple copies, archival materials are typically unique originals. This makes them incredibly valuable for researchers, but also challenging to preserve. My work involves everything from assessing the condition of documents and performing conservation treatments to creating detailed descriptions that help researchers discover relevant materials. It's detective work, preservation science, and historical research all rolled into one. Check the bulletin board for high scores from our archival research games!",
        responses: {
            "What's the difference between an archivist and a librarian?": "That's a great question! While there's some overlap, the main difference has to do with the materials we work with. Librarians typically work with published materials that exist in multiple copies - books, journals, etc. Archivists work with unique, often unpublished materials - letters, diaries, photographs, organizational records, etc. Because archival materials are unique, we focus more on preserving the original item and its context, while librarians often focus more on providing access to content that exists in multiple formats. Both professions are dedicated to connecting people with information, just through different types of materials.",
            "What's the most challenging part of your job?": "Preservation is always challenging. We're fighting against the natural processes of decay - paper becomes brittle, ink fades, photographs deteriorate. Climate control is crucial but expensive. We also face the challenge of born-digital materials - how do we preserve and provide access to emails, websites, and digital files when technology changes so rapidly? Another challenge is dealing with restricted materials - we have to balance privacy concerns with the historical value of documents. It requires careful judgment and sometimes difficult decisions.",
            "How has technology changed archival work?": "Technology has transformed archival work in so many ways. Digitization has made it possible to provide access to fragile materials without handling the originals. Online finding aids and databases have made collections much more discoverable. We can now use spectral imaging to read text that's faded or obscured. But technology also brings new challenges - digital preservation requires constant attention as file formats and hardware become obsolete. We're also dealing with email archives, websites, and social media content that exist in massive quantities. The principles of archival work remain the same, but the tools and materials continue to evolve."
        }
    },
    collector: {
        title: "Collector",
        content: "Hello there! I'm a private collector who has donated many items to section 9 of the library. Each piece in my collection has a story and a history that I find fascinating. I've been collecting rare books and manuscripts for over thirty years, and it's been a journey of discovery. What started as a casual interest has become a lifelong passion. I'm particularly drawn to items that have interesting provenance - the history of who owned them and how they passed from one person to another. A book isn't just a container for text; it's an artifact that has passed through many hands and witnessed many moments in history. I'm always looking for new additions to the collection. Want to play a game?",
        responses: {
            "What got you started collecting?": "It began quite by accident. I inherited a few old books from my grandfather, and as I researched their history, I became fascinated by the stories behind them. One book had an inscription from the author to a famous historical figure, which led me down a rabbit hole of research about their connection. I was hooked! I started visiting bookshops and auctions, learning more about the field, and gradually building my knowledge and collection. What I love most is that each new item comes with its own mystery to solve - who owned it, what did it mean to them, how did it survive?",
            "What's the most unusual item in your collection?": "That would be a 17th-century commonplace book that belonged to a little-known female scientist. Commonplace books were like scrapbooks where people collected quotes, ideas, and observations. This one contains her scientific notes alongside recipes, personal reflections, and pressed flowers. It's extraordinary because it gives us insight into the mind of a woman who was clearly brilliant but worked in a field that was largely closed to women at the time. The book itself is beautiful, with her handwriting and drawings, but it's the window into her world that makes it truly special.",
            "How do you decide what to collect?": "Over the years, my collecting has become more focused. I used to acquire anything that caught my interest, but now I concentrate on a few specific areas: early scientific works by underrepresented figures, books with interesting provenance, and manuscripts that show the creative process. I look for items that tell a story beyond their content. Condition is important, but I'm sometimes willing to accept flaws if an item has particular historical significance. I also consider how each new piece fits into the collection as a whole - I want it to be coherent, not just a random assortment of items."
        }
    },
    scholar: {
        title: "Scholar",
        content: "Welcome! I'm a research scholar specializing in interdisciplinary studies. Section 10 is the pinnacle of our library, containing knowledge that few have ever accessed. You've come a long way to reach this point, which speaks to your dedication and curiosity. This section contains materials that bridge different fields of knowledge, showing how ideas connect across disciplines. It's my belief that the most important discoveries happen at the intersections between traditional areas of study. Here you'll find works that combine science and philosophy, art and technology, history and futurism. These materials challenge us to think beyond the boundaries of conventional categories. Congratulations on reaching this section - it shows you have the curiosity and persistence that are essential for true scholarship.",
        responses: {
            "What does interdisciplinary studies mean?": "Interdisciplinary studies is an approach to knowledge that intentionally combines insights and methods from different academic disciplines. Rather than staying within the boundaries of a single field, interdisciplinary work seeks to address questions that are too complex to be answered from one perspective alone. For example, understanding climate change requires knowledge from atmospheric science, ecology, economics, politics, ethics, and more. By bringing these different perspectives together, we can develop more comprehensive solutions. Interdisciplinary work challenges us to think in new ways and make connections that might otherwise be missed.",
            "How do you see the future of libraries evolving?": "Libraries are already evolving in exciting ways. They're becoming more than just repositories of books - they're community hubs, technology centers, and creative spaces. I see them increasingly focusing on helping people navigate information overload rather than just providing access to information. Digital preservation will become even more important as so much of our cultural and intellectual heritage exists only in digital form. I also think we'll see more specialized libraries focusing on particular areas of knowledge, while still maintaining connections through shared digital resources. The physical library will remain important as a place for collaboration and serendipitous discovery.",
            "What advice would you give to someone pursuing knowledge?": "Be curious about everything. Don't limit yourself to what you think you're 'supposed' to be interested in. Follow your questions wherever they lead, even if that takes you outside your comfort zone or area of expertise. Learn how to evaluate information critically - not all sources are equally reliable. Develop the habit of making connections between different ideas and fields. And remember that knowledge isn't just about accumulating facts - it's about developing understanding and wisdom. Finally, find others to share your journey with - knowledge grows through conversation and collaboration."
        }
    }
};

// Chatbot responses
const chatbotResponses = {
    receptionist1: {
        greeting: "Hello! Welcome to the library. I'm the head receptionist. How can I help you today?",
        responses: {
            "What are the library hours?": "We're open from 9 AM to 9 PM Monday through Friday, and 10 AM to 6 PM on weekends. The second floor lounge closes at 8 PM.",
            "How do I get a library card?": "You can get a library card at the front desk here. Just bring a valid ID and proof of address. The process takes about 5 minutes, and your card will be ready immediately.",
            "Where can I find books on [topic]?": "Our library is organized into 10 sections. Section 1 is classics, 2 is history, 3 is philosophy, 4 is pure sciences, 5 is applied sciences, 6 is fine arts, 7 is performing arts, 8 is technology, 9 is rare books, and 10 is special collections. The computer catalog can help you find specific titles.",
            "How do I access the second floor?": "The second floor lounge is accessible via the elevator on the far right side of the lobby. You need to be at least level 10 to access it. You can level up by exploring the library, reading books, and interacting with others.",
            "Are there any events happening at the library?": "We have author talks every Thursday at 7 PM in section 3. There's also a monthly book club that meets on the first Tuesday of each month in section 1. Check our events calendar for more details."
        }
    },
    receptionist2: {
        greeting: "Hi there! I'm the assistant receptionist. Welcome to our library! What can I assist you with?",
        responses: {
            "Can I use the computers?": "Yes, we have computer stations available in sections 2, 5, and 8. You can use them for up to one hour at a time. Just sign in with your library card at the reception desk.",
            "Is there Wi-Fi available?": "Yes, we offer free Wi-Fi throughout the building. The network name is 'LibraryGuest' and there's no password required.",
            "Where are the restrooms?": "There are restrooms at the end of each section. They're clearly marked with signs. There's also an accessible restroom near the reception area.",
            "Can I borrow books?": "Yes, with a library card you can borrow up to 10 books at a time for 3 weeks. You can renew them online if no one else has requested them. Rare books in section 9 are for in-library use only.",
            "Do you have study rooms?": "Yes, we have study rooms available on a first-come, first-served basis in sections 4 and 7. You can also reserve rooms up to a week in advance through our website or by asking at the front desk."
        }
    }
};

// Initialize game
function init() {
    // Set initial player position
    updatePlayerPosition();
    
    // Set up keyboard listeners
    document.addEventListener('keydown', (e) => {
        game.keys[e.key.toLowerCase()] = true;
        
        // Prevent default for arrow keys and space
        if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        // Handle double jump
        if ((e.key === 'ArrowUp' || e.key === ' ') && !game.player.isJumping && !game.player.isDoubleJumping) {
            game.player.jumpCount++;
            
            if (game.player.jumpCount === 1) {
                // Single jump
                game.player.isJumping = true;
                game.player.canDoubleJump = true;
                document.getElementById('player').classList.add('jumping');
                
                // Reset jump after animation
                setTimeout(() => {
                    game.player.isJumping = false;
                    document.getElementById('player').classList.remove('jumping');
                    if (!game.player.canDoubleJump) {
                        game.player.jumpCount = 0;
                    }
                }, 800);
            } else if (game.player.jumpCount === 2 && game.player.canDoubleJump) {
                // Double jump
                game.player.isDoubleJumping = true;
                game.player.canDoubleJump = false;
                document.getElementById('player').classList.remove('jumping');
                document.getElementById('player').classList.add('double-jumping');
                
                // Reset jump after animation
                setTimeout(() => {
                    game.player.isDoubleJumping = false;
                    document.getElementById('player').classList.remove('double-jumping');
                    game.player.jumpCount = 0;
                }, 1200);
            }
        }
    });
    
    document.addEventListener('keyup', (e) => {
        game.keys[e.key.toLowerCase()] = false;
        
        // Handle crouch release
        if(e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
            game.player.isCrouching = false;
            document.getElementById('player').classList.remove('crouching');
        }
        
        // Handle walking release
        if(e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'd') {
            game.player.isWalking = false;
            document.getElementById('player').classList.remove('walking');
        }
    });
    
    // Set up NPC paths
    setupNPCPaths();
    
    // Start game loop
    gameLoop();
    
    // Start NPC movement
    startNPCMovement();
    
    // Update level display
    updateLevelDisplay();
    
    // Check elevator access
    checkElevatorAccess();
    
    // Set up hover tooltips
    setupTooltips();
}

// Game loop
function gameLoop() {
    // Handle player input
    handleInput();
    
    // Update camera position
    updateCamera();
    
    // Update UI
    updateUI();
    
    // Continue loop
    requestAnimationFrame(gameLoop);
}

// Handle player input
function handleInput() {
    const player = game.player;
    let isMoving = false;
    
    // Horizontal movement
    if (game.keys['arrowleft'] || game.keys['a']) {
        player.x = Math.max(-1000, player.x - player.speed); // Allow 1000px to the left
        isMoving = true;
        player.facingRight = false;
        document.getElementById('player').classList.remove('facing-right');
        document.getElementById('player').classList.add('facing-left');
    }
    if (game.keys['arrowright'] || game.keys['d']) {
        player.x = Math.min(game.lobbyWidth - 1000, player.x + player.speed); // Allow 1000px to the right
        isMoving = true;
        player.facingRight = true;
        document.getElementById('player').classList.remove('facing-left');
        document.getElementById('player').classList.add('facing-right');
    }
    
    // Update walking state
    if (isMoving && !player.isJumping && !player.isDoubleJumping && !player.isCrouching) {
        player.isWalking = true;
        document.getElementById('player').classList.add('walking');
    } else if (!isMoving) {
        player.isWalking = false;
        document.getElementById('player').classList.remove('walking');
    }
    
    // Crouch
    if ((game.keys['arrowdown'] || game.keys['s']) && !player.isJumping && !player.isDoubleJumping) {
        player.isCrouching = true;
        document.getElementById('player').classList.add('crouching');
    }
    
    // Update player position
    updatePlayerPosition();
}

// Update player position
function updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = (game.lobbyWidth / 2 + game.player.x) + 'px'; // Center of room is 0
}

// Update camera position
function updateCamera() {
    const gameWorld = document.getElementById('game-world');
    const playerCenterX = game.lobbyWidth / 2 + game.player.x + 30; // Half of player width
    
    // Camera follows player
    game.camera.x = playerCenterX - game.screenWidth / 2;
    
    // Limit camera to lobby bounds
    game.camera.x = Math.max(0, Math.min(game.camera.x, game.lobbyWidth - game.screenWidth));
    
    // Apply camera transform
    gameWorld.style.transform = `translateX(${-game.camera.x}px)`;
}

// Update UI elements
function updateUI() {
    // Update position indicator
    document.getElementById('pos-x').textContent = game.player.x;
    
    // Calculate current section (1-10)
    const section = Math.floor((game.lobbyWidth / 2 + game.player.x) / (game.lobbyWidth / 10)) + 1;
    document.getElementById('section').textContent = Math.min(Math.max(section, 1), 10);
}

// Update level display
function updateLevelDisplay() {
    document.getElementById('player-level').textContent = game.player.level;
    
    // Calculate next floor access
    let nextFloor = 10;
    if (game.player.level < 10) nextFloor = 10;
    else if (game.player.level < 50) nextFloor = 50;
    else if (game.player.level < 300) nextFloor = 300;
    else if (game.player.level < 1000) nextFloor = 1000;
    
    document.getElementById('next-floor').textContent = nextFloor;
}

// Check elevator access
function checkElevatorAccess() {
    const elevator = document.getElementById('elevator');
    const elevatorButton = document.getElementById('elevator-button');
    
    if (game.player.level >= 10) {
        elevator.classList.remove('elevator-locked');
        elevatorButton.disabled = false;
    } else {
        elevator.classList.add('elevator-locked');
        elevatorButton.disabled = true;
    }
}

// Setup NPC paths
function setupNPCPaths() {
    // Define paths for NPCs to walk
    game.npcPaths = {
        librarian: { start: 300, end: 350, speed: 1, direction: 1 },
        researcher: { start: 1200, end: 1250, speed: 1, direction: 1 },
        professor: { start: 2200, end: 2250, speed: 1, direction: 1 },
        historian: { start: 3200, end: 3250, speed: 1, direction: 1 },
        student: { start: 4200, end: 4250, speed: 1, direction: 1 },
        bookworm: { start: 5200, end: 5250, speed: 1, direction: 1 },
        curator: { start: 6200, end: 6250, speed: 1, direction: 1 },
        archivist: { start: 7200, end: 7250, speed: 1, direction: 1 },
        collector: { start: 8200, end: 8250, speed: 1, direction: 1 },
        scholar: { start: 9200, end: 9250, speed: 1, direction: 1 },
        receptionist1: { start: 4550, end: 4650, speed: 0.5, direction: 1 },
        receptionist2: { start: 4700, end: 4800, speed: 0.5, direction: 1 }
    };
}

// Start NPC movement
function startNPCMovement() {
    setInterval(() => {
        // Move each NPC along its path
        Object.keys(game.npcPaths).forEach(npcId => {
            const path = game.npcPaths[npcId];
            const npc = document.getElementById(npcId) || document.querySelector(`[onclick*="${npcId}"]`);
            
            if (npc) {
                // Get current position
                let currentX = parseFloat(npc.style.left) || path.start;
                
                // Move NPC
                currentX += path.speed * path.direction;
                
                // Check if NPC needs to change direction
                if (currentX >= path.end) {
                    path.direction = -1;
                } else if (currentX <= path.start) {
                    path.direction = 1;
                }
                
                // Update position
                npc.style.left = currentX + 'px';
            }
        });
    }, 50);
}

// Setup hover tooltips
function setupTooltips() {
    const tooltip = document.getElementById('tooltip');
    
    // Add tooltips to all interactive elements
    document.querySelectorAll('.book, .chair, .love-sign, .artwork, .water-cooler, .bulletin-board, .tv-screen').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const title = e.target.getAttribute('title') || e.target.className;
            tooltip.textContent = title;
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mousemove', (e) => {
            tooltip.style.left = e.pageX + 10 + 'px';
            tooltip.style.top = e.pageY - 30 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    });
}

// Show dialogue
function showDialogue(npcId) {
    const dialogue = dialogues[npcId];
    if (dialogue) {
        document.getElementById('dialogue-title').textContent = dialogue.title;
        document.getElementById('dialogue-content').textContent = dialogue.content;
        
        // Populate response options
        const select = document.getElementById('dialogue-select');
        select.innerHTML = '<option value="">Select a response...</option>';
        
        Object.keys(dialogue.responses).forEach(response => {
            const option = document.createElement('option');
            option.value = response;
            option.textContent = response;
            select.appendChild(option);
        });
        
        // Add event listener for response selection
        select.onchange = function() {
            const selectedResponse = this.value;
            if (selectedResponse) {
                const responseDiv = document.getElementById('dialogue-response');
                responseDiv.textContent = dialogue.responses[selectedResponse];
                responseDiv.style.display = 'block';
            }
        };
        
        document.getElementById('dialogue').style.display = 'block';
    }
}

// Close dialogue
function closeDialogue() {
    document.getElementById('dialogue').style.display = 'none';
    document.getElementById('dialogue-response').style.display = 'none';
    document.getElementById('dialogue-select').value = '';
}

// Show chatbot
function showChatbot(receptionistId) {
    const chatbot = document.getElementById('chatbot');
    const chatbotTitle = document.getElementById('chatbot-title');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    // Set chatbot title
    if (receptionistId === 'receptionist1') {
        chatbotTitle.textContent = 'Head
