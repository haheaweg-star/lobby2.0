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
    currentScore: 0,
    chatbotState: {
        currentBot: null,
        messages: []
    }
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
    
    // Set up bulletin board click handler
    document.getElementById('bulletin-board').addEventListener('click', showHighscores);
    
    // Set up elevator button click handler
    document.getElementById('elevator-button').addEventListener('click', callElevator);
    
    // Set up chatbot input enter key handler
    document.getElementById('chatbot-text').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatbotMessage();
        }
    });
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
                
                // Gain experience for talking to NPCs
                gainExperience(5);
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
        chatbotTitle.textContent = 'Head Receptionist';
        game.chatbotState.currentBot = 'receptionist1';
    } else {
        chatbotTitle.textContent = 'Assistant Receptionist';
        game.chatbotState.currentBot = 'receptionist2';
    }
    
    // Clear previous messages
    chatbotMessages.innerHTML = '';
    game.chatbotState.messages = [];
    
    // Add greeting message
    addChatbotMessage('bot', chatbotResponses[game.chatbotState.currentBot].greeting);
    
    // Show chatbot
    chatbot.style.display = 'block';
    
    // Focus on input
    document.getElementById('chatbot-text').focus();
}

// Add message to chatbot
function addChatbotMessage(sender, message) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    
    // Store message
    game.chatbotState.messages.push({ sender, message });
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Send chatbot message
function sendChatbotMessage() {
    const input = document.getElementById('chatbot-text');
    const message = input.value.trim();
    
    if (message) {
        // Add user message
        addChatbotMessage('user', message);
        
        // Clear input
        input.value = '';
        
        // Get bot response
        const botResponses = chatbotResponses[game.chatbotState.currentBot].responses;
        let response = "I'm not sure how to answer that. You can ask about library hours, getting a library card, finding books, accessing the second floor, or upcoming events.";
        
        // Check for keywords in message
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hour') || lowerMessage.includes('open') || lowerMessage.includes('close')) {
            response = botResponses["What are the library hours?"];
        } else if (lowerMessage.includes('card') || lowerMessage.includes('membership')) {
            response = botResponses["How do I get a library card?"];
        } else if (lowerMessage.includes('find') || lowerMessage.includes('book') || lowerMessage.includes('section')) {
            response = botResponses["Where can I find books on [topic]?"];
        } else if (lowerMessage.includes('second floor') || lowerMessage.includes('elevator') || lowerMessage.includes('lounge')) {
            response = botResponses["How do I access the second floor?"];
        } else if (lowerMessage.includes('event') || lowerMessage.includes('program') || lowerMessage.includes('talk')) {
            response = botResponses["Are there any events happening at the library?"];
        } else if (lowerMessage.includes('computer') || lowerMessage.includes('internet') || lowerMessage.includes('wifi')) {
            response = botResponses["Can I use the computers?"];
        } else if (lowerMessage.includes('restroom') || lowerMessage.includes('bathroom') || lowerMessage.includes('toilet')) {
            response = botResponses["Where are the restrooms?"];
        } else if (lowerMessage.includes('borrow') || lowerMessage.includes('loan') || lowerMessage.includes('check out')) {
            response = botResponses["Can I borrow books?"];
        } else if (lowerMessage.includes('study') || lowerMessage.includes('room')) {
            response = botResponses["Do you have study rooms?"];
        }
        
        // Add bot response after delay
        setTimeout(() => {
            addChatbotMessage('bot', response);
            
            // Gain experience for using chatbot
            gainExperience(3);
        }, 500);
    }
}

// Close chatbot
function closeChatbot() {
    document.getElementById('chatbot').style.display = 'none';
    game.chatbotState.currentBot = null;
    game.chatbotState.messages = [];
}

// Open book
function openBook(title, content) {
    document.getElementById('book-title').textContent = title;
    document.getElementById('book-text').textContent = content;
    document.getElementById('book-modal').style.display = 'flex';
    
    // Gain experience for reading books
    gainExperience(10);
}

// Close book
function closeBook() {
    document.getElementById('book-modal').style.display = 'none';
}

// Show context menu
function showContextMenu(event, target) {
    event.preventDefault();
    
    const contextMenu = document.getElementById('context-menu');
    contextMenu.style.display = 'block';
    contextMenu.style.left = event.pageX + 'px';
    contextMenu.style.top = event.pageY + 'px';
    
    // Store target for game opening
    contextMenu.setAttribute('data-target', target);
    
    // Hide context menu when clicking elsewhere
    document.addEventListener('click', hideContextMenu);
}

// Hide context menu
function hideContextMenu() {
    document.getElementById('context-menu').style.display = 'none';
    document.removeEventListener('click', hideContextMenu);
}

// Open game
function openGame(gameId) {
    // Hide context menu
    hideContextMenu();
    
    // Set current game
    game.currentGame = gameId;
    game.currentScore = 0;
    
    // Set game title
    const titles = {
        'brick-breaker': 'Brick Breaker',
        'pong': 'Table Tennis',
        'pacman': 'Multiplayer Pac-Man',
        'tetris': 'Tetris',
        'space-invaders': 'Asteroid Blaster',
        'dino-run': 'Dinosaur Run'
    };
    
    document.getElementById('game-title').textContent = titles[gameId];
    
    // Update score displays
    document.getElementById('game-record').textContent = `Record: ${game.gameRecords[gameId]}`;
    document.getElementById('game-high').textContent = `High: ${game.highscores[gameId]}`;
    document.getElementById('game-current').textContent = `Score: 0`;
    
    // Show game modal
    document.getElementById('game-modal').style.display = 'flex';
    
    // Initialize game based on ID
    initGame(gameId);
}

// Close game
function closeGame() {
    // Stop any running game
    if (game.gameLoop) {
        cancelAnimationFrame(game.gameLoop);
        game.gameLoop = null;
    }
    
    // Hide game modal
    document.getElementById('game-modal').style.display = 'none';
    
    // Clear game area
    document.getElementById('game-area').innerHTML = `
        <div class="game-score record" id="game-record">Record: 0</div>
        <div class="game-score high" id="game-high">High: 0</div>
        <div class="game-score current" id="game-current">Score: 0</div>
    `;
    
    // Update high score if needed
    if (game.currentScore > game.highscores[game.currentGame]) {
        game.highscores[game.currentGame] = game.currentScore;
    }
    
    // Reset game state
    game.currentGame = null;
    game.currentScore = 0;
}

// Initialize game based on ID
function initGame(gameId) {
    const gameArea = document.getElementById('game-area');
    
    // Clear game area but keep score displays
    const scores = gameArea.innerHTML;
    gameArea.innerHTML = scores;
    
    switch(gameId) {
        case 'brick-breaker':
            initBrickBreaker();
            break;
        case 'pong':
            initTableTennis();
            break;
        case 'pacman':
            initPacman();
            break;
        case 'tetris':
            initTetris();
            break;
        case 'space-invaders':
            initAsteroidBlaster();
            break;
        case 'dino-run':
            initDinoRun();
            break;
    }
}

// Initialize Brick Breaker game
function initBrickBreaker() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.backgroundColor = '#000';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game objects
    const paddle = {
        x: canvas.width / 2 - 50,
        y: canvas.height - 20,
        width: 100,
        height: 10,
        speed: 8
    };
    
    const ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        radius: 8,
        dx: 4,
        dy: -4
    };
    
    // Bricks
    const brickRowCount = 5;
    const brickColumnCount = 8;
    const brickWidth = 65;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;
    
    const bricks = [];
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
    
    // Controls
    let rightPressed = false;
    let leftPressed = false;
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    
    function keyDownHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = true;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = true;
        }
    }
    
    function keyUpHandler(e) {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }
    
    // Collision detection
    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                const b = bricks[c][r];
                if (b.status === 1) {
                    if (ball.x > b.x && ball.x < b.x + brickWidth && 
                        ball.y > b.y && ball.y < b.y + brickHeight) {
                        ball.dy = -ball.dy;
                        b.status = 0;
                        game.currentScore += 10;
                        document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
                        
                        // Check if all bricks are broken
                        let allBroken = true;
                        for (let c = 0; c < brickColumnCount; c++) {
                            for (let r = 0; r < brickRowCount; r++) {
                                if (bricks[c][r].status === 1) {
                                    allBroken = false;
                                    break;
                                }
                            }
                            if (!allBroken) break;
                        }
                        
                        if (allBroken) {
                            // Game won
                            game.currentScore += 100; // Bonus for winning
                            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
                            endGame(true);
                        }
                    }
                }
            }
        }
    }
    
    // Draw functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    
                    // Different colors for different rows
                    const colors = ['#ff6b6b', '#4d79ff', '#5cb85c', '#f0ad4e', '#9b59b6'];
                    ctx.fillStyle = colors[r];
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    
    // Game loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();
        
        // Ball movement
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Wall collision (left/right)
        if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
            ball.dx = -ball.dx;
        }
        
        // Wall collision (top)
        if (ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        } 
        // Paddle collision
        else if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height) {
            if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                ball.dy = -ball.dy;
                
                // Change ball direction based on where it hits the paddle
                const hitPos = (ball.x - paddle.x) / paddle.width;
                ball.dx = 8 * (hitPos - 0.5);
            } else {
                // Game over
                endGame(false);
                return;
            }
        }
        
        // Paddle movement
        if (rightPressed && paddle.x < canvas.width - paddle.width) {
            paddle.x += paddle.speed;
        } else if (leftPressed && paddle.x > 0) {
            paddle.x -= paddle.speed;
        }
        
        game.gameLoop = requestAnimationFrame(draw);
    }
    
    // End game
    function endGame(won) {
        cancelAnimationFrame(game.gameLoop);
        
        // Display result
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        
        if (won) {
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
        } else {
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        
        ctx.font = '16px Arial';
        ctx.fillText(`Final Score: ${game.currentScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        // Gain experience based on score
        const expGained = Math.floor(game.currentScore / 100);
        if (expGained > 0) {
            gainExperience(expGained);
        }
    }
    
    // Start game
    draw();
}

// Initialize Table Tennis game (2-player Pong)
function initTableTennis() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.backgroundColor = '#000';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game objects
    const paddleHeight = 80;
    const paddleWidth = 10;
    
    const player1 = {
        x: 10,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        score: 0,
        speed: 6
    };
    
    const player2 = {
        x: canvas.width - paddleWidth - 10,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        score: 0,
        speed: 6
    };
    
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 8,
        dx: 4,
        dy: 4
    };
    
    // Controls
    let wPressed = false;
    let sPressed = false;
    let upPressed = false;
    let downPressed = false;
    
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);
    
    function keyDownHandler(e) {
        if (e.key === 'w' || e.key === 'W') wPressed = true;
        else if (e.key === 's' || e.key === 'S') sPressed = true;
        else if (e.key === 'ArrowUp') upPressed = true;
        else if (e.key === 'ArrowDown') downPressed = true;
    }
    
    function keyUpHandler(e) {
        if (e.key === 'w' || e.key === 'W') wPressed = false;
        else if (e.key === 's' || e.key === 'S') sPressed = false;
        else if (e.key === 'ArrowUp') upPressed = false;
        else if (e.key === 'ArrowDown') downPressed = false;
    }
    
    // Draw functions
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawPaddle(paddle) {
        ctx.beginPath();
        ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
    
    function drawScore() {
        ctx.font = '20px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(`Player 1: ${player1.score}`, canvas.width / 4, 30);
        ctx.fillText(`Player 2: ${player2.score}`, 3 * canvas.width / 4, 30);
    }
    
    function drawInstructions() {
        ctx.font = '14px Arial';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Player 1: W/S keys', canvas.width / 4, 60);
        ctx.fillText('Player 2: Arrow keys', 3 * canvas.width / 4, 60);
    }
    
    // Game loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawScore();
        drawInstructions();
        drawBall();
        drawPaddle(player1);
        drawPaddle(player2);
        
        // Ball movement
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Wall collision (top/bottom)
        if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
            ball.dy = -ball.dy;
        }
        
        // Paddle collision
        if (
            // Player 1 paddle
            ball.x - ball.radius < player1.x + player1.width &&
            ball.y > player1.y &&
            ball.y < player1.y + player1.height &&
            ball.dx < 0
        ) {
            ball.dx = -ball.dx;
            
            // Change ball direction based on where it hits the paddle
            const hitPos = (ball.y - player1.y) / player1.height;
            ball.dy = 8 * (hitPos - 0.5);
        }
        
        if (
            // Player 2 paddle
            ball.x + ball.radius > player2.x &&
            ball.y > player2.y &&
            ball.y < player2.y + player2.height &&
            ball.dx > 0
        ) {
            ball.dx = -ball.dx;
            
            // Change ball direction based on where it hits the paddle
            const hitPos = (ball.y - player2.y) / player2.height;
            ball.dy = 8 * (hitPos - 0.5);
        }
        
        // Score when ball goes out of bounds
        if (ball.x + ball.dx > canvas.width - ball.radius) {
            // Player 1 scores
            player1.score++;
            game.currentScore += 10;
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
            resetBall();
        } else if (ball.x + ball.dx < ball.radius) {
            // Player 2 scores
            player2.score++;
            resetBall();
        }
        
        // Player 1 movement
        if (wPressed && player1.y > 0) {
            player1.y -= player1.speed;
        } else if (sPressed && player1.y < canvas.height - player1.height) {
            player1.y += player1.speed;
        }
        
        // Player 2 movement
        if (upPressed && player2.y > 0) {
            player2.y -= player2.speed;
        } else if (downPressed && player2.y < canvas.height - player2.height) {
            player2.y += player2.speed;
        }
        
        // Check for game end
        if (player1.score >= 5 || player2.score >= 5) {
            endGame(player1.score >= 5);
            return;
        }
        
        game.gameLoop = requestAnimationFrame(draw);
    }
    
    // Reset ball position
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -ball.dx; // Change direction
        ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1); // Random vertical direction
    }
    
    // End game
    function endGame(player1Won) {
        cancelAnimationFrame(game.gameLoop);
        
        // Display result
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        
        if (player1Won) {
            ctx.fillText('Player 1 Wins!', canvas.width / 2, canvas.height / 2);
            game.currentScore += 50; // Bonus for winning
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
        } else {
            ctx.fillText('Player 2 Wins!', canvas.width / 2, canvas.height / 2);
        }
        
        ctx.font = '16px Arial';
        ctx.fillText(`Final Score: ${game.currentScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        // Gain experience based on score
        const expGained = Math.floor(game.currentScore / 50);
        if (expGained > 0) {
            gainExperience(expGained);
        }
    }
    
    // Start game
    draw();
}

// Initialize Pacman game
function initPacman() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.backgroundColor = '#000';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const cellSize = 20;
    const pacman = {
        x: 9 * cellSize,
        y: 15 * cellSize,
        radius: cellSize / 2,
        speed: cellSize / 4,
        direction: 'right',
        mouthOpen: true,
        mouthCounter: 0
    };
    
    // Simple maze layout (1 = wall, 0 = dot, 2 = empty, 3 = power pellet)
    const maze = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,0,1,1,1,2,2,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,0,1,2,2,2,2,2,2,1,0,1,1,0,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,3,0,1],
        [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Ghosts
    const ghosts = [
        { x: 9 * cellSize, y: 9 * cellSize, color: '#ff0000', direction: 'up', speed: cellSize / 6 },
        { x: 10 * cellSize, y: 9 * cellSize, color: '#00ffff', direction: 'down', speed: cellSize / 6 },
        { x: 9 * cellSize, y: 10 * cellSize, color: '#ffb8ff', direction: 'left', speed: cellSize / 6 },
        { x: 10 * cellSize, y: 10 * cellSize, color: '#ffb852', direction: 'right', speed: cellSize / 6 }
    ];
    
    // Game state
    let dotsRemaining = 0;
    let powerMode = false;
    let powerModeTimer = 0;
    
    // Count dots
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            if (maze[y][x] === 0 || maze[y][x] === 3) {
                dotsRemaining++;
            }
        }
    }
    
    // Controls
    let nextDirection = null;
    
    document.addEventListener('keydown', keyDownHandler);
    
    function keyDownHandler(e) {
        if (e.key === 'ArrowUp') nextDirection = 'up';
        else if (e.key === 'ArrowDown') nextDirection = 'down';
        else if (e.key === 'ArrowLeft') nextDirection = 'left';
        else if (e.key === 'ArrowRight') nextDirection = 'right';
    }
    
    // Draw functions
    function drawMaze() {
        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {
                const cellX = x * cellSize;
                const cellY = y * cellSize;
                
                if (maze[y][x] === 1) {
                    // Wall
                    ctx.fillStyle = '#0000ff';
                    ctx.fillRect(cellX, cellY, cellSize, cellSize);
                } else if (maze[y][x] === 0) {
                    // Dot
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(cellX + cellSize / 2, cellY + cellSize / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (maze[y][x] === 3) {
                    // Power pellet
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(cellX + cellSize / 2, cellY + cellSize / 2, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
    
    function drawPacman() {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        
        // Animate mouth
        pacman.mouthCounter++;
        if (pacman.mouthCounter % 10 === 0) {
            pacman.mouthOpen = !pacman.mouthOpen;
        }
        
        let startAngle, endAngle;
        if (pacman.mouthOpen) {
            const mouthSize = 0.2;
            
            if (pacman.direction === 'right') {
                startAngle = mouthSize * Math.PI;
                endAngle = (2 - mouthSize) * Math.PI;
            } else if (pacman.direction === 'left') {
                startAngle = (1 + mouthSize) * Math.PI;
                endAngle = (1 - mouthSize) * Math.PI;
            } else if (pacman.direction === 'up') {
                startAngle = (1.5 + mouthSize) * Math.PI;
                endAngle = (1.5 - mouthSize) * Math.PI;
            } else if (pacman.direction === 'down') {
                startAngle = (0.5 + mouthSize) * Math.PI;
                endAngle = (0.5 - mouthSize) * Math.PI;
            }
        } else {
            startAngle = 0;
            endAngle = 2 * Math.PI;
        }
        
        ctx.arc(pacman.x, pacman.y, pacman.radius, startAngle, endAngle);
        ctx.lineTo(pacman.x, pacman.y);
        ctx.fill();
    }
    
    function drawGhosts() {
        ghosts.forEach(ghost => {
            ctx.fillStyle = powerMode ? '#0000ff' : ghost.color;
            
            // Ghost body
            ctx.beginPath();
            ctx.arc(ghost.x, ghost.y, cellSize / 2, Math.PI, 0, false);
            ctx.lineTo(ghost.x + cellSize / 2, ghost.y + cellSize / 2);
            
            // Wavy bottom
            for (let i = 0; i < 3; i++) {
                const x = ghost.x + cellSize / 2 - (i + 1) * (cellSize / 6);
                const y = ghost.y + cellSize / 2 + (i % 2 === 0 ? -3 : 0);
                ctx.lineTo(x, y);
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Eyes
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(ghost.x - cellSize / 6, ghost.y - cellSize / 6, cellSize / 8, 0, Math.PI * 2);
            ctx.arc(ghost.x + cellSize / 6, ghost.y - cellSize / 6, cellSize / 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Pupils
            ctx.fillStyle = '#000';
            ctx.beginPath();
            
            // Direction-based pupils
            let pupilOffsetX = 0, pupilOffsetY = 0;
            if (ghost.direction === 'right') pupilOffsetX = 2;
            else if (ghost.direction === 'left') pupilOffsetX = -2;
            else if (ghost.direction === 'up') pupilOffsetY = -2;
            else if (ghost.direction === 'down') pupilOffsetY = 2;
            
            ctx.arc(ghost.x - cellSize / 6 + pupilOffsetX, ghost.y - cellSize / 6 + pupilOffsetY, cellSize / 16, 0, Math.PI * 2);
            ctx.arc(ghost.x + cellSize / 6 + pupilOffsetX, ghost.y - cellSize / 6 + pupilOffsetY, cellSize / 16, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // Movement functions
    function movePacman() {
        // Try to change direction if requested
        if (nextDirection) {
            const testX = Math.floor(pacman.x / cellSize);
            const testY = Math.floor(pacman.y / cellSize);
            
            let canMove = false;
            
            if (nextDirection === 'right' && testX < maze[0].length - 1 && maze[testY][testX + 1] !== 1) {
                canMove = true;
            } else if (nextDirection === 'left' && testX > 0 && maze[testY][testX - 1] !== 1) {
                canMove = true;
            } else if (nextDirection === 'up' && testY > 0 && maze[testY - 1][testX] !== 1) {
                canMove = true;
            } else if (nextDirection === 'down' && testY < maze.length - 1 && maze[testY + 1][testX] !== 1) {
                canMove = true;
            }
            
            if (canMove) {
                pacman.direction = nextDirection;
                nextDirection = null;
            }
        }
        
        // Move in current direction
        let newX = pacman.x;
        let newY = pacman.y;
        
        if (pacman.direction === 'right') newX += pacman.speed;
        else if (pacman.direction === 'left') newX -= pacman.speed;
        else if (pacman.direction === 'up') newY -= pacman.speed;
        else if (pacman.direction === 'down') newY += pacman.speed;
        
        // Check if movement is valid
        const testX = Math.floor(newX / cellSize);
        const testY = Math.floor(newY / cellSize);
        
        let canMove = true;
        
        if (pacman.direction === 'right' && testX < maze[0].length - 1 && maze[testY][testX + 1] === 1) {
            canMove = false;
        } else if (pacman.direction === 'left' && testX > 0 && maze[testY][testX - 1] === 1) {
            canMove = false;
        } else if (pacman.direction === 'up' && testY > 0 && maze[testY - 1][testX] === 1) {
            canMove = false;
        } else if (pacman.direction === 'down' && testY < maze.length - 1 && maze[testY + 1][testX] === 1) {
            canMove = false;
        }
        
        if (canMove) {
            pacman.x = newX;
            pacman.y = newY;
        }
        
        // Wrap around screen
        if (pacman.x < 0) pacman.x = canvas.width;
        else if (pacman.x > canvas.width) pacman.x = 0;
        
        // Check for dot collection
        const cellX = Math.floor(pacman.x / cellSize);
        const cellY = Math.floor(pacman.y / cellSize);
        
        if (maze[cellY][cellX] === 0) {
            maze[cellY][cellX] = 2; // Empty
            dotsRemaining--;
            game.currentScore += 10;
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
            
            // Check for win
            if (dotsRemaining === 0) {
                endGame(true);
            }
        } else if (maze[cellY][cellX] === 3) {
            maze[cellY][cellX] = 2; // Empty
            dotsRemaining--;
            game.currentScore += 50;
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
            
            // Activate power mode
            powerMode = true;
            powerModeTimer = 200; // Frames
            
            // Check for win
            if (dotsRemaining === 0) {
                endGame(true);
            }
        }
        
        // Check for ghost collision
        ghosts.forEach((ghost, index) => {
            const distance = Math.sqrt(Math.pow(pacman.x - ghost.x, 2) + Math.pow(pacman.y - ghost.y, 2));
            
            if (distance < pacman.radius + cellSize / 2) {
                if (powerMode) {
                    // Eat ghost
                    game.currentScore += 200;
                    document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
                    
                    // Reset ghost position
                    ghost.x = 9 * cellSize;
                    ghost.y = 9 * cellSize;
                } else {
                    // Game over
                    endGame(false);
                }
            }
        });
    }
    
    function moveGhosts() {
        ghosts.forEach(ghost => {
            // Simple AI: try to move toward pacman, with some randomness
            const cellX = Math.floor(ghost.x / cellSize);
            const cellY = Math.floor(ghost.y / cellSize);
            
            // Possible directions
            const directions = [];
            
            if (cellX < maze[0].length - 1 && maze[cellY][cellX + 1] !== 1) directions.push('right');
            if (cellX > 0 && maze[cellY][cellX - 1] !== 1) directions.push('left');
            if (cellY > 0 && maze[cellY - 1][cellX] !== 1) directions.push('up');
            if (cellY < maze.length - 1 && maze[cellY + 1][cellX] !== 1) directions.push('down');
            
            // Filter out opposite direction
            const oppositeDir = {
                'right': 'left',
                'left': 'right',
                'up': 'down',
                'down': 'up'
            };
            
            const validDirections = directions.filter(dir => dir !== oppositeDir[ghost.direction]);
            
            // Choose direction
            if (validDirections.length > 0) {
                // In power mode, run away from pacman
                if (powerMode) {
                    // Calculate distances for each direction
                    let bestDir = validDirections[0];
                    let maxDistance = 0;
                    
                    validDirections.forEach(dir => {
                        let testX = ghost.x;
                        let testY = ghost.y;
                        
                        if (dir === 'right') testX += cellSize;
                        else if (dir === 'left') testX -= cellSize;
                        else if (dir === 'up') testY -= cellSize;
                        else if (dir === 'down') testY += cellSize;
                        
                        const distance = Math.sqrt(Math.pow(testX - pacman.x, 2) + Math.pow(testY - pacman.y, 2));
                        
                        if (distance > maxDistance) {
                            maxDistance = distance;
                            bestDir = dir;
                        }
                    });
                    
                    ghost.direction = bestDir;
                } else {
                    // 70% chance to move toward pacman, 30% random
                    if (Math.random() < 0.7) {
                        // Calculate distances for each direction
                        let bestDir = validDirections[0];
                        let minDistance = Infinity;
                        
                        validDirections.forEach(dir => {
                            let testX = ghost.x;
                            let testY = ghost.y;
                            
                            if (dir === 'right') testX += cellSize;
                            else if (dir === 'left') testX -= cellSize;
                            else if (dir === 'up') testY -= cellSize;
                            else if (dir === 'down') testY += cellSize;
                            
                            const distance = Math.sqrt(Math.pow(testX - pacman.x, 2) + Math.pow(testY - pacman.y, 2));
                            
                            if (distance < minDistance) {
                                minDistance = distance;
                                bestDir = dir;
                            }
                        });
                        
                        ghost.direction = bestDir;
                    } else {
                        // Random direction
                        ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                    }
                }
            }
            
            // Move ghost
            if (ghost.direction === 'right') ghost.x += ghost.speed;
            else if (ghost.direction === 'left') ghost.x -= ghost.speed;
            else if (ghost.direction === 'up') ghost.y -= ghost.speed;
            else if (ghost.direction === 'down') ghost.y += ghost.speed;
            
            // Wrap around screen
            if (ghost.x < 0) ghost.x = canvas.width;
            else if (ghost.x > canvas.width) ghost.x = 0;
        });
    }
    
    // Game loop
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawMaze();
        drawPacman();
        drawGhosts();
        
        movePacman();
        moveGhosts();
        
        // Update power mode
        if (powerMode) {
            powerModeTimer--;
            if (powerModeTimer <= 0) {
                powerMode = false;
            }
        }
        
        game.gameLoop = requestAnimationFrame(draw);
    }
    
    // End game
    function endGame(won) {
        cancelAnimationFrame(game.gameLoop);
        
        // Display result
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        
        if (won) {
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
            game.currentScore += 500; // Bonus for winning
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
        } else {
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        
        ctx.font = '16px Arial';
        ctx.fillText(`Final Score: ${game.currentScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        // Gain experience based on score
        const expGained = Math.floor(game.currentScore / 100);
        if (expGained > 0) {
            gainExperience(expGained);
        }
    }
    
    // Start game
    draw();
}

// Initialize Tetris game
function initTetris() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 600;
    canvas.style.backgroundColor = '#000';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const COLS = 10;
    const ROWS = 20;
    const BLOCK_SIZE = 30;
    
    // Game state
    let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    let currentPiece = null;
    let currentX = 0;
    let currentY = 0;
    let dropCounter = 0;
    let dropInterval = 1000;
    let lastTime = 0;
    let gameOver = false;
    
    // Tetromino shapes
    const SHAPES = [
        // I
        [[0, 0, 0, 0],
         [1, 1, 1, 1],
         [0, 0, 0, 0],
         [0, 0, 0, 0]],
        
        // J
        [[1, 0, 0],
         [1, 1, 1],
         [0, 0, 0]],
        
        // L
        [[0, 0, 1],
         [1, 1, 1],
         [0, 0, 0]],
        
        // O
        [[1, 1],
         [1, 1]],
        
        // S
        [[0, 1, 1],
         [1, 1, 0],
         [0, 0, 0]],
        
        // T
        [[0, 1, 0],
         [1, 1, 1],
         [0, 0, 0]],
        
        // Z
        [[1, 1, 0],
         [0, 1, 1],
         [0, 0, 0]]
    ];
    
    // Tetromino colors
    const COLORS = [
        '#00ffff', // I (cyan)
        '#0000ff', // J (blue)
        '#ff7f00', // L (orange)
        '#ffff00', // O (yellow)
        '#00ff00', // S (green)
        '#800080', // T (purple)
        '#ff0000'  // Z (red)
    ];
    
    // Create a new piece
    function createPiece() {
        const typeId = Math.floor(Math.random() * SHAPES.length);
        return {
            shape: SHAPES[typeId],
            color: COLORS[typeId]
        };
    }
    
    // Draw a block
    function drawBlock(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        
        // Draw border
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    // Draw the board
    function drawBoard() {
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (board[y][x]) {
                    drawBlock(x, y, board[y][x]);
                }
            }
        }
    }
    
    // Draw the current piece
    function drawPiece() {
        if (!currentPiece) return;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    drawBlock(currentX + x, currentY + y, currentPiece.color);
                }
            }
        }
    }
    
    // Check collision
    function collide() {
        if (!currentPiece) return false;
        
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardX = currentX + x;
                    const boardY = currentY + y;
                    
                    if (
                        boardX < 0 || 
                        boardX >= COLS || 
                        boardY >= ROWS ||
                        (boardY >= 0 && board[boardY][boardX])
                    ) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Merge the piece with the board
    function merge() {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    if (currentY + y < 0) {
                        // Game over if piece is above the board
                        gameOver = true;
                        return;
                    }
                    
                    board[currentY + y][currentX + x] = currentPiece.color;
                }
            }
        }
    }
    
    // Rotate the piece
    function rotate() {
        if (!currentPiece) return;
        
        // Create a copy of the shape
        const shape = [];
        for (let y = 0; y < currentPiece.shape.length; y++) {
            shape[y] = [];
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                shape[y][x] = currentPiece.shape[y][x];
            }
        }
        
        // Transpose and reverse for rotation
        const N = shape.length;
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < y; x++) {
                const temp = shape[y][x];
                shape[y][x] = shape[x][y];
                shape[x][y] = temp;
            }
        }
        
        for (let y = 0; y < N; y++) {
            shape[y].reverse();
        }
        
        // Save current state
        const prevShape = currentPiece.shape;
        currentPiece.shape = shape;
        
        // Check if rotation is valid
        if (collide()) {
            // Revert if not valid
            currentPiece.shape = prevShape;
        }
    }
    
    // Move the piece
    function move(dir) {
        currentX += dir;
        
        if (collide()) {
            currentX -= dir;
            return false;
        }
        
        return true;
    }
    
    // Drop the piece
    function drop() {
        currentY++;
        
        if (collide()) {
            currentY--;
            merge();
            clearLines();
            currentPiece = createPiece();
            currentX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
            currentY = 0;
            
            if (collide()) {
                gameOver = true;
            }
        }
        
        dropCounter = 0;
    }
    
    // Clear completed lines
    function clearLines() {
        let linesCleared = 0;
        
        for (let y = ROWS - 1; y >= 0; y--) {
            let complete = true;
            
            for (let x = 0; x < COLS; x++) {
                if (!board[y][x]) {
                    complete = false;
                    break;
                }
            }
            
            if (complete) {
                // Remove the line
                for (let yy = y; yy > 0; yy--) {
                    for (let x = 0; x < COLS; x++) {
                        board[yy][x] = board[yy - 1][x];
                    }
                }
                
                // Clear the top line
                for (let x = 0; x < COLS; x++) {
                    board[0][x] = 0;
                }
                
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        // Update score
        if (linesCleared > 0) {
            const points = [0, 40, 100, 300, 1200];
            game.currentScore += points[linesCleared];
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
        }
    }
    
    // Controls
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === 'ArrowLeft') {
            move(-1);
        } else if (e.key === 'ArrowRight') {
            move(1);
        } else if (e.key === 'ArrowDown') {
            drop();
        } else if (e.key === 'ArrowUp') {
            rotate();
        }
    });
    
    // Game loop
    function update(time = 0) {
        if (gameOver) {
            endGame();
            return;
        }
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        dropCounter += deltaTime;
        
        if (dropCounter > dropInterval) {
            drop();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawBoard();
        drawPiece();
        
        game.gameLoop = requestAnimationFrame(update);
    }
    
    // End game
    function endGame() {
        cancelAnimationFrame(game.gameLoop);
        
        // Display result
        ctx.font = '30px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        
        ctx.font = '16px Arial';
        ctx.fillText(`Final Score: ${game.currentScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        // Gain experience based on score
        const expGained = Math.floor(game.currentScore / 50);
        if (expGained > 0) {
            gainExperience(expGained);
        }
    }
    
    // Initialize game
    currentPiece = createPiece();
    currentX = Math.floor(COLS / 2) - Math.floor(currentPiece.shape[0].length / 2);
    currentY = 0;
    
    update();
}

// Initialize Asteroid Blaster game
function initAsteroidBlaster() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.backgroundColor = '#000';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const SHIP_WIDTH = 30;
    const SHIP_HEIGHT = 20;
    const SHIP_SPEED = 5;
    const BULLET_SPEED = 10;
    const ASTEROID_MIN_SIZE = 20;
    const ASTEROID_MAX_SIZE = 60;
    const ASTEROID_MIN_SPEED = 1;
    const ASTEROID_MAX_SPEED = 5;
    const ASTEROID_SPAWN_RATE = 60; // Frames
    
    // Game state
    let ship = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: SHIP_WIDTH,
        height: SHIP_HEIGHT,
        speed: SHIP_SPEED
    };
    
    let bullets = [];
    let asteroids = [];
    let gameOver = false;
    let frameCount = 0;
    let difficulty = 1;
    
    // Create stars for background
    const stars = [];
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 2 + 1
        });
    }
    
    // Draw stars
    function drawStars() {
        ctx.fillStyle = '#fff';
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Move stars
            star.y += star.speed;
            
            // Reset stars that go off screen
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
    }
    
    // Draw ship
    function drawShip() {
        ctx.fillStyle = '#0ff';
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(ship.x - ship.width / 2, ship.y + ship.height);
        ctx.lineTo(ship.x + ship.width / 2, ship.y + ship.height);
        ctx.closePath();
        ctx.fill();
    }
    
    // Draw bullets
    function drawBullets() {
        ctx.fillStyle = '#ff0';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    // Draw asteroids
    function drawAsteroids() {
        asteroids.forEach(asteroid => {
            ctx.fillStyle = '#888';
            ctx.beginPath();
            ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw asteroid details
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.arc(asteroid.x - asteroid.size / 3, asteroid.y - asteroid.size / 3, asteroid.size / 4, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(asteroid.x + asteroid.size / 4, asteroid.y + asteroid.size / 4, asteroid.size / 5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    // Move ship
    function moveShip(dir) {
        ship.x += dir * ship.speed;
        
        // Keep ship on screen
        if (ship.x < ship.width / 2) ship.x = ship.width / 2;
        if (ship.x > canvas.width - ship.width / 2) ship.x = canvas.width - ship.width / 2;
    }
    
    // Shoot bullet
    function shootBullet() {
        bullets.push({
            x: ship.x - 2,
            y: ship.y,
            width: 4,
            height: 10,
            speed: BULLET_SPEED
        });
    }
    
    // Move bullets
    function moveBullets() {
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].y -= bullets[i].speed;
            
            // Remove bullets that go off screen
            if (bullets[i].y + bullets[i].height < 0) {
                bullets.splice(i, 1);
            }
        }
    }
    
    // Spawn asteroid
    function spawnAsteroid() {
        const size = ASTEROID_MIN_SIZE + Math.random() * (ASTEROID_MAX_SIZE - ASTEROID_MIN_SIZE) / difficulty;
        const speed = ASTEROID_MIN_SPEED + Math.random() * (ASTEROID_MAX_SPEED - ASTEROID_MIN_SPEED) * difficulty;
        
        asteroids.push({
            x: Math.random() * canvas.width,
            y: -size,
            size: size,
            speed: speed,
            health: Math.floor(size / 10) // Larger asteroids require more hits
        });
    }
    
    // Move asteroids
    function moveAsteroids() {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            asteroids[i].y += asteroids[i].speed;
            
            // Remove asteroids that go off screen
            if (asteroids[i].y - asteroids[i].size > canvas.height) {
                asteroids.splice(i, 1);
            }
        }
    }
    
    // Check collisions
    function checkCollisions() {
        // Check bullet-asteroid collisions
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            
            for (let j = asteroids.length - 1; j >= 0; j--) {
                const asteroid = asteroids[j];
                
                const distance = Math.sqrt(
                    Math.pow(bullet.x + bullet.width / 2 - asteroid.x, 2) + 
                    Math.pow(bullet.y + bullet.height / 2 - asteroid.y, 2)
                );
                
                if (distance < asteroid.size) {
                    // Hit!
                    asteroid.health--;
                    
                    if (asteroid.health <= 0) {
                        // Destroy asteroid
                        asteroids.splice(j, 1);
                        
                        // Update score
                        game.currentScore += Math.floor(asteroid.size);
                        document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
                        
                        // Increase difficulty
                        if (game.currentScore % 100 === 0) {
                            difficulty += 0.2;
                        }
                    }
                    
                    // Remove bullet
                    bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // Check ship-asteroid collisions
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            
            const distance = Math.sqrt(
                Math.pow(ship.x - asteroid.x, 2) + 
                Math.pow(ship.y + ship.height / 2 - asteroid.y, 2)
            );
            
            if (distance < asteroid.size + ship.width / 2) {
                gameOver = true;
            }
        }
    }
    
    // Controls
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === 'ArrowLeft') {
            moveShip(-1);
        } else if (e.key === 'ArrowRight') {
            moveShip(1);
        } else if (e.key === ' ' || e.key === 'ArrowUp') {
            shootBullet();
        }
    });
    
    // Game loop
    function update() {
        if (gameOver) {
            endGame();
            return;
        }
        
        frameCount++;
        
        // Spawn asteroids
        if (frameCount % Math.floor(ASTEROID_SPAWN_RATE / difficulty) === 0) {
            spawnAsteroid();
        }
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawStars();
        drawShip();
        drawBullets();
        drawAsteroids();
        
        moveBullets();
        moveAsteroids();
        checkCollisions();
        
        game.gameLoop = requestAnimationFrame(update);
    }
    
    // End game
    function endGame() {
        cancelAnimationFrame(game.gameLoop);
        
        // Display result
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '16px Arial';
        ctx.fillText(`Final Score: ${game.currentScore}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 40);
        
        // Gain experience based on score
        const expGained = Math.floor(game.currentScore / 20);
        if (expGained > 0) {
            gainExperience(expGained);
        }
        
        // Add restart functionality
        document.addEventListener('keydown', function restartHandler(e) {
            if (e.key === 'r' || e.key === 'R') {
                // Reset game state
                ship = {
                    x: canvas.width / 2,
                    y: canvas.height - 50,
                    width: SHIP_WIDTH,
                    height: SHIP_HEIGHT,
                    speed: SHIP_SPEED
                };
                
                bullets = [];
                asteroids = [];
                gameOver = false;
                frameCount = 0;
                difficulty = 1;
                
                // Restart game
                update();
                
                // Remove event listener
                document.removeEventListener('keydown', restartHandler);
            }
        });
    }
    
    // Start game
    update();
}

// Initialize Dino Run game
function initDinoRun() {
    const gameArea = document.getElementById('game-area');
    
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    canvas.style.backgroundColor = '#fff';
    gameArea.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Game constants
    const GROUND_HEIGHT = 50;
    const DINO_WIDTH = 40;
    const DINO_HEIGHT = 60;
    const DINO_JUMP_FORCE = 15;
    const GRAVITY = 0.6;
    const OBSTACLE_MIN_WIDTH = 20;
    const OBSTACLE_MAX_WIDTH = 50;
    const OBSTACLE_MIN_HEIGHT = 30;
    const OBSTACLE_MAX_HEIGHT = 70;
    const OBSTACLE_MIN_SPEED = 5;
    const OBSTACLE_MAX_SPEED = 10;
    const OBSTACLE_SPAWN_RATE = 100; // Frames
    
    // Game state
    let dino = {
        x: 50,
        y: canvas.height - GROUND_HEIGHT - DINO_HEIGHT,
        width: DINO_WIDTH,
        height: DINO_HEIGHT,
        velocityY: 0,
        jumping: false,
        ducking: false
    };
    
    let obstacles = [];
    let gameOver = false;
    let frameCount = 0;
    let score = 0;
    let highScore = 0;
    let gameSpeed = 5;
    
    // Draw ground
    function drawGround() {
        ctx.fillStyle = '#666';
        ctx.fillRect(0, canvas.height - GROUND_HEIGHT, canvas.width, GROUND_HEIGHT);
        
        // Draw ground line
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - GROUND_HEIGHT);
        ctx.lineTo(canvas.width, canvas.height - GROUND_HEIGHT);
        ctx.stroke();
    }
    
    // Draw dino
    function drawDino() {
        ctx.fillStyle = '#333';
        
        if (dino.ducking) {
            // Draw ducking dino
            ctx.fillRect(dino.x, dino.y + dino.height / 2, dino.width, dino.height / 2);
            
            // Draw head
            ctx.beginPath();
            ctx.arc(dino.x + dino.width, dino.y + dino.height / 2, dino.height / 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Draw body
            ctx.fillRect(dino.x, dino.y + dino.height / 3, dino.width, dino.height * 2 / 3);
            
            // Draw head
            ctx.beginPath();
            ctx.arc(dino.x + dino.width, dino.y + dino.height / 3, dino.height / 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw legs
            ctx.fillRect(dino.x + dino.width / 4, dino.y + dino.height, dino.width / 4, 5);
            ctx.fillRect(dino.x + 3 * dino.width / 4, dino.y + dino.height, dino.width / 4, 5);
        }
        
        // Draw eye
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(dino.x + dino.width, dino.y + dino.height / 4, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw obstacles
    function drawObstacles() {
        ctx.fillStyle = '#333';
        
        obstacles.forEach(obstacle => {
            if (obstacle.type === 'cactus') {
                // Draw cactus
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                
                // Draw cactus arms
                ctx.fillRect(obstacle.x - 10, obstacle.y + 10, 10, 10);
                ctx.fillRect(obstacle.x + obstacle.width, obstacle.y + 20, 10, 10);
            } else {
                // Draw pterodactyl
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y + obstacle.height / 2);
                ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height / 2);
                ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
                ctx.closePath();
                ctx.fill();
            }
        });
    }
    
    // Draw clouds
    function drawClouds() {
        ctx.fillStyle = '#eee';
        
        // Simple cloud pattern
        const cloudX = (frameCount / 2) % (canvas.width + 100) - 100;
        
        ctx.beginPath();
        ctx.arc(cloudX, 50, 20, 0, Math.PI * 2);
        ctx.arc(cloudX + 25, 50, 25, 0, Math.PI * 2);
        ctx.arc(cloudX + 50, 50, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Jump
    function jump() {
        if (!dino.jumping && !dino.ducking) {
            dino.velocityY = -DINO_JUMP_FORCE;
            dino.jumping = true;
        }
    }
    
    // Duck
    function duck() {
        if (!dino.jumping) {
            dino.ducking = true;
            dino.height = DINO_HEIGHT / 2;
        }
    }
    
    // Stop ducking
    function stopDuck() {
        if (dino.ducking) {
            dino.ducking = false;
            dino.height = DINO_HEIGHT;
            dino.y = canvas.height - GROUND_HEIGHT - dino.height;
        }
    }
    
    // Spawn obstacle
    function spawnObstacle() {
        const type = Math.random() > 0.7 ? 'pterodactyl' : 'cactus';
        const width = type === 'cactus' ? 
            OBSTACLE_MIN_WIDTH + Math.random() * (OBSTACLE_MAX_WIDTH - OBSTACLE_MIN_WIDTH) : 
            OBSTACLE_MAX_WIDTH;
        const height = type === 'cactus' ? 
            OBSTACLE_MIN_HEIGHT + Math.random() * (OBSTACLE_MAX_HEIGHT - OBSTACLE_MIN_HEIGHT) : 
            OBSTACLE_MIN_HEIGHT;
        
        obstacles.push({
            x: canvas.width,
            y: type === 'cactus' ? canvas.height - GROUND_HEIGHT - height : canvas.height - GROUND_HEIGHT - height - 50,
            width: width,
            height: height,
            type: type
        });
    }
    
    // Update game
    function update() {
        if (gameOver) return;
        
        frameCount++;
        
        // Update score
        if (frameCount % 10 === 0) {
            score++;
            game.currentScore = score;
            document.getElementById('game-current').textContent = `Score: ${game.currentScore}`;
            
            // Increase game speed
            if (score % 50 === 0) {
                gameSpeed += 0.5;
            }
        }
        
        // Spawn obstacles
        if (frameCount % OBSTACLE_SPAWN_RATE === 0) {
            spawnObstacle();
        }
        
        // Update dino
        if (dino.jumping) {
            dino.y += dino.velocityY;
            dino.velocityY += GRAVITY;
            
            if (dino.y >= canvas.height - GROUND_HEIGHT - dino.height) {
                dino.y = canvas.height - GROUND_HEIGHT - dino.height;
                dino.jumping = false;
                dino.velocityY = 0;
            }
        }
        
        // Update obstacles
        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].x -= gameSpeed;
            
            // Remove obstacles that go off screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
        
        // Check collisions
        obstacles.forEach(obstacle => {
            if (
                dino.x < obstacle.x + obstacle.width &&
                dino.x + dino.width > obstacle.x &&
                dino.y < obstacle.y + obstacle.height &&
                dino.y + dino.height > obstacle.y
            ) {
                gameOver = true;
            }
        });
    }
    
    // Draw game
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawClouds();
        drawGround();
        drawDino();
        drawObstacles();
        
        // Draw score
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
        ctx.fillText(`High: ${highScore}`, 20, 60);
    }
    
    // Game loop
    function gameLoop() {
        update();
        draw();
        
        if (!gameOver) {
            requestAnimationFrame(gameLoop);
        } else {
            endGame();
        }
    }
    
    // End game
    function endGame() {
        // Update high score
        if (score > highScore) {
            highScore = score;
        }
        
        // Display game over
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 30);
        
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 40);
        
        ctx.font = '16px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 80);
        
        // Gain experience based on score
        const expGained = Math.floor(score / 10);
        if (expGained > 0) {
            gainExperience(expGained);
        }
        
        // Add restart functionality
        document.addEventListener('keydown', function restartHandler(e) {
            if (e.key === 'r' || e.key === 'R') {
                // Reset game state
                dino = {
                    x: 50,
                    y: canvas.height - GROUND_HEIGHT - DINO_HEIGHT,
                    width: DINO_WIDTH,
                    height: DINO_HEIGHT,
                    velocityY: 0,
                    jumping: false,
                    ducking: false
                };
                
                obstacles = [];
                gameOver = false;
                frameCount = 0;
                score = 0;
                gameSpeed = 5;
                
                // Restart game
                gameLoop();
                
                // Remove event listener
                document.removeEventListener('keydown', restartHandler);
            }
        });
    }
    
    // Controls
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        if (e.key === ' ' || e.key === 'ArrowUp') {
            jump();
        } else if (e.key === 'ArrowDown') {
            duck();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowDown') {
            stopDuck();
        }
    });
    
    // Start game
    gameLoop();
}

// Show high scores
function showHighscores() {
    const highscoresList = document.getElementById('highscores-list');
    highscoresList.innerHTML = '';
    
    // Add high scores for each game
    Object.keys(game.highscores).forEach(gameId => {
        const item = document.createElement('div');
        item.className = 'highscore-item';
        
        const gameName = document.createElement('div');
        gameName.className = 'highscore-game';
        
        // Format game name
        const names = {
            'brick-breaker': 'Brick Breaker',
            'pong': 'Table Tennis',
            'pacman': 'Multiplayer Pac-Man',
            'tetris': 'Tetris',
            'space-invaders': 'Asteroid Blaster',
            'dino-run': 'Dinosaur Run'
        };
        
        gameName.textContent = names[gameId];
        
        const scoreValue = document.createElement('div');
        scoreValue.className = 'highscore-value';
        scoreValue.textContent = game.highscores[gameId];
        
        item.appendChild(gameName);
        item.appendChild(scoreValue);
        highscoresList.appendChild(item);
    });
    
    document.getElementById('highscores-modal').style.display = 'flex';
}

// Close high scores
function closeHighscores() {
    document.getElementById('highscores-modal').style.display = 'none';
}

// Call elevator
function callElevator() {
    if (game.player.level < 10) return;
    
    const elevator = document.getElementById('elevator');
    
    // Move elevator down (to second floor)
    elevator.style.bottom = '20%';
    
    // After a delay, move elevator back up
    setTimeout(() => {
        elevator.style.bottom = '0';
        
        // Gain experience for using elevator
        gainExperience(20);
    }, 3000);
}

// Gain experience and level up
function gainExperience(amount) {
    game.player.level += amount;
    updateLevelDisplay();
    checkElevatorAccess();
    
    // Show level up notification
    if (game.player.level % 10 === 0) {
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.textContent = `Level Up! You are now level ${game.player.level}`;
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = '#fff';
        notification.style.padding = '20px';
        notification.style.borderRadius = '10px';
        notification.style.fontSize = '24px';
        notification.style.zIndex = '1000';
        
        document.body.appendChild(notification);
        
        // Remove notification after delay
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize game when page loads
window.onload = init;
