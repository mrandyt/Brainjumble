// Brain Jumble word banks and themed rooms.
// Each room has its own prompts and its own extra magnets, which are mixed
// into every deal alongside the general bank (except Just for Kids, which
// only ever uses kid-safe words).

import { MORE_PROMPTS } from "./prompts-more.js";

const w = s => s.trim().split(/\s+/);
const uniq = a => [...new Set(a)];

// Punctuation magnets. Dealt every round in every room.
export const PUNCT = ["?", "!", "'", ",", ".", "#", "@", "-", "&"];
export const isPunct = x => PUNCT.includes(String(x));

// Cheeky words: rude-ish but nothing too vulgar. Never dealt in Just for Kids,
// and the host can switch them off in the lobby.
export const CHEEKY = uniq(w(`
piss pee wee turd poo poop ass arse dick tits boobs bloody willy shit slut fart crap bum bumhole bugger bollocks knob prat
plonker pillock wally git minger sod nipple bottom burp snot bogey wazzock jugs floozy
`));

export const GLUE = ["I", "you", "my", "the", "a", "is", "and", "of", "to", "in", "not", "me", "it", "your", "-s", "-ing", "-ed", "-ly"];

export const NOUNS = uniq(w(`
cat dog nan wizard toaster moon soup sock banana ghost robot pigeon kettle sofa potato dragon hamster spoon crumpet vampire
goat duck sandwich mattress lawyer knee armpit elbow moustache beard wig ferret llama penguin jelly custard biscuit cheese
onion pickle sausage trumpet accordion bagpipe tractor bicycle bus umbrella puddle swamp volcano cloud thunder galaxy planet
alien cowboy pirate ninja clown vicar dentist landlord mother uncle baby teenager boss neighbour ex therapist lizard worm slug
badger hedgehog owl seagull squirrel horse spider bee snail fridge toilet bath mirror attic basement garden shed castle prison
office meeting spreadsheet email password selfie phone wifi karaoke disco funeral wedding birthday holiday diet gym sweat nap
dream secret lie regret tax receipt bin tea coffee gravy butter trousers pants slippers hat kilt crown tiara beans chips cake
pie toast love fear chaos destiny soul brain belly bum nose tooth
accountant aunt bagel balloon banjo barber bathtub battery beetle bishop blanket blender bouncer brick broccoli bucket budgie
bungalow burrito butler cactus camel candle canoe caravan carrot catapult cauliflower chandelier chef chimney chin chopsticks
cloak coconut coffin compost cookie corgi cousin crab crayon crisps crocodile cucumber cupboard curtain cushion daffodil
dinosaur doughnut dungeon earwig egg eyebrow fairy feather fish-finger flamingo flannel fork fox frog gnome goblin goldfish
gorilla granny grandad hairdresser hammock hedge helicopter hippo hoover hotdog iceberg igloo jacuzzi jam kebab ketchup kitten
koala ladder lasagne lettuce lighthouse lobster lollipop magician marmalade meatball mermaid microwave milkman monk monkey mop
mushroom nugget octopus omelette orangutan otter oven pancake parrot parsnip pasta peacock pelican pensioner piano pillow
pineapple pizza plumber poodle porridge postman pudding pumpkin puppet quiche rabbit raccoon radiator rhubarb robin
rollercoaster rubbish sardine scarecrow scone shark sheep sheriff skeleton skunk snowman sponge sprout stew sumo sunbed swan
taxi teapot teddy tiger toad toenail tortoise towel trampoline troll tuba turnip unicorn wardrobe wasp waiter weasel whale
wheelbarrow wombat yacht yoghurt zebra roundabout motorway car-park supermarket queue Monday Tuesday Friday weekend midnight
breakfast brunch dinner picnic barbecue pyjamas onesie sunglasses handbag wallet knickers dressing-gown husband wife boyfriend
girlfriend bestie stranger influencer podcast hashtag playlist sat-nav remote charger laptop printer parcel caravan tent
festival pub quiz bingo raffle jigsaw scarf mittens jumper cardigan wellies flip-flops leggings hoodie tracksuit
`));

export const VERBS = uniq(w(`
eat lick sniff kiss hug slap steal hide bury sell marry divorce haunt worship ignore forget remember cry scream whisper sing
dance wobble explode melt sneeze burp sleep run crawl wiggle juggle knit bake fry boil freeze shave tickle adopt betray forgive
confess panic pray vote invent destroy fix break borrow lose find chase smell fear want need love hate toot honk yell gargle
moonwalk cuddle overthink google text ghost
adore annoy apologise argue babysit bark bite blame bless blink bounce bribe brush burn catch cheat chew clap climb cook cough
crash dig dive doodle drink drive drool dust escape faint feed fight flirt float flush fly fold gobble gossip growl grumble
hiccup hop hum hunt impress interrupt jiggle jog kick knock laugh launch microwave mime mumble nibble nod nudge order paint
pinch poke polish pout punch purr quack rant recycle rescue roar rub scratch scrub shout shower shuffle skip slurp smash smile
snore snuggle spill spin splash squash squeak squeeze stare stomp stroke sulk swim swipe tango teleport tiptoe trip unfriend
waddle wave wink worry wrestle yawn yodel zoom binge cancel queue stalk photobomb serenade hoard sniffle wrangle
`));

export const ADJS = uniq(w(`
soggy damp moist sticky crispy greasy fluffy hairy naked tiny enormous sad angry smug lonely haunted cursed sacred forbidden
illegal ancient elderly sweaty spicy stale mouldy beautiful ugly wobbly suspicious magnificent tragic awkward sleepy grumpy
cheeky posh weird feral majestic emotional legendary rubbery glittery invisible electric nervous holy cosmic lukewarm unhinged
delicious gross golden rusty slippery French Welsh
absolute adorable bald beefy bendy bitter bossy bouncy brave bright bubbly bumpy chubby clumsy cranky crunchy cuddly curly
dainty dodgy dramatic dreamy dusty fancy fizzy floppy fruity funky fuzzy gentle giant gigantic glorious gooey grubby gullible
hungry icy itchy jolly juicy lazy loud lumpy mad mighty mini mysterious nosy nutty peckish petty pointless proper questionable
salty saucy scruffy shiny shy silly slimy smelly sneaky soft sparkly squishy stinky stroppy sunny swanky tacky tasty tipsy
toxic trashy tubby unlucky vague velvet wild wise wonky zesty British Scottish Irish Victorian medieval cheap expensive
brand-new second-hand homemade frozen chaotic iconic beige smelly vintage overrated underrated
`));

export const WILD = uniq(w(`
very extremely again forever tonight yesterday never always only almost nobody everybody somebody everything nothing because
unless until after before behind under inside without maybe please sorry oops help yes no why how what who we they he she her
his our their this that was are will can't must should too
probably definitely secretly accidentally actually literally basically totally suddenly quietly loudly badly nearly twice
once every some all more most less like as if then than so but or just still even really quite oh wow hello goodbye darling
mate love sir here there now later soon up down over off out away with for at on by from
`));

const ALL_GENERAL = { nouns: NOUNS, verbs: VERBS, adjs: ADJS };

export const ROOMS = [
  {
    id: "classic", name: "Classic", emoji: "🧲", door: "#BFE3D0", blurb: "The original anything-goes mix",
    words: [],
    prompts: [
      "What I'm really thinking during meetings", "My recurring dream, explained", "The secret my houseplant is keeping",
      "Why the cat keeps staring at the wall", "A fortune cookie you'd hate to open", "The worst thing to say at a wedding",
      "My therapist says my real problem is…", "A new law everyone must follow", "What my dog writes in his diary",
      "The text you regret sending at 2am", "A slogan for a terrible theme park", "Instructions on a haunted shampoo bottle",
      "Your horoscope for tomorrow", "What the toaster whispers at night", "The real reason I was late",
      "A motivational poster for villains", "The opening line of my autobiography", "Advice from a very tired grandmother",
      "The least romantic proposal ever", "A warning label for Mondays", "A breakup letter to your alarm clock",
      "The last thing a robot said before it quit", "A perfume nobody should buy", "A rule I made up as a child",
      "Why the office fridge smells like that", "The fine print in a wizard's contract", "A toast at a seagull's retirement party",
      "The secret ingredient in Nan's soup", "A complaint to the manager of the universe", "The plot of a very boring action film",
      "What I'd shout from a rooftop", "A voicemail from my future self", "Never whisper this to a horse", "My hidden talent",
      "What happens at the sock monster's party", "The first line of a terrible love song", "A Christmas card from your nemesis",
      "Your inner voice at the supermarket", "A ransom note from a hamster", "What the dentist is really thinking",
      "An advert for a gym run by sloths", "The headline that would ruin my week", "What I'll be famous for",
      "A sign you're in the wrong pub", "The plan if zombies come", "How to babysit a dragon", "A riddle with no answer",
      "What the satnav says when it gives up", "A new bank holiday and how to celebrate it", "My mum's biggest worry",
      "Breaking news from the bottom of the sea", "Why the chicken really crossed the road", "The worst flavour of crisps",
      "What the pigeons are planning", "A slogan for my life", "The reason I got banned from the leisure centre",
      "What my fridge magnets say about me", "An honest estate agent's description", "The worst superhero power",
      "What goes on in the staff room", "The spell to make Monday disappear", "My last words, if I'm being honest",
      "A new rule for the family group chat", "The motto on my coat of arms", "What my sofa has seen"
    ]
  },
  {
    id: "politics", name: "Politics", emoji: "🏛️", door: "#C9D3EA", blurb: "Manifestos, U-turns and leaky memos",
    words: w(`vote ballot election minister parliament MP council mayor manifesto policy budget tax referendum debate scandal leak
      memo spin-doctor lobbyist protest placard march speech podium motion committee backbencher cabinet reshuffle coalition
      opposition party campaign rosette leaflet doorstep poll swing-voter recount landslide U-turn promise pledge expenses
      pothole bill law amendment veto summit treaty diplomat embassy ambassador president prime-minister chancellor speaker
      order! austerity red-tape crony elected resign govern heckle spin canvass filibuster hustings constituency`),
    prompts: [
      "The real reason Parliament has a recess", "A campaign slogan for a hamster running for mayor",
      "What politicians whisper after the cameras stop", "A manifesto promise nobody could keep",
      "The worst thing to say in a TV debate", "A new law I'd pass on day one", "What's really in the red briefcase",
      "The leaked memo from the Downing Street cat", "A protest sign for a very small problem", "Why the vote was delayed again",
      "The Prime Minister's secret hobby", "A party political broadcast for pigeons", "What the opposition leader dreams about",
      "The minister's excuse for the expenses", "A referendum question nobody asked for", "The speech a candidate gave by accident",
      "What the spin doctor said next", "A tax I'd happily pay", "The council's plan for the potholes", "A U-turn announcement",
      "What the backbenchers are muttering", "The motto for a brand-new political party", "A heckle from the public gallery",
      "Breaking: the government has banned…", "What MPs really do on their lunch break", "An election leaflet from a ghost",
      "The real reason for the reshuffle", "A diplomatic gift that went wrong", "How to survive Prime Minister's Questions",
      "The world leaders' group chat", "The coalition agreement between cats and dogs", "A victory speech for coming last"
    ]
  },
  {
    id: "sport", name: "Sport", emoji: "⚽", door: "#C2E6B8", blurb: "Half-time talks and dodgy refs",
    words: w(`goal penalty referee VAR offside striker keeper defender manager pundit fan chant stadium pitch trophy medal podium
      sprint marathon relay tackle header volley dribble foul red-card yellow-card bench sub injury-time extra-time half-time
      kit boots shin-pads whistle umpire wicket bowler batter innings ace serve racket shuttlecock darts bullseye snooker cue
      birdie bogey caddie jockey hurdle javelin wrestle boxing glove knockout sweat protein gym-bro squat deadlift lap pit-stop
      champion underdog relegation derby season-ticket mascot cheerleader streaker Olympics nutmeg hat-trick own-goal`),
    prompts: [
      "The manager's half-time team talk", "What the referee really said", "A chant for the worst team in the league",
      "Why I was sent off", "The secret to winning Wimbledon", "An excuse for missing an open goal",
      "What goes on in the changing room", "A brand-new Olympic sport", "The commentator's worst line", "My pre-match ritual",
      "The sponsor nobody wanted", "What the mascot is thinking", "Advice from a darts champion", "The transfer rumour of the year",
      "Why the marathon took nine hours", "A post-match interview cliché", "The real reason we lost on penalties",
      "What the goalkeeper shouts", "A golf rule nobody follows", "My fantasy football team name",
      "The weirdest thing thrown on the pitch", "A Sunday league team's tactics", "Why the cricket was rained off again",
      "The gym bro's life advice", "What the snooker player mutters", "My boxing walk-out entrance",
      "The horse's view of the Grand National", "The new VAR rule", "A pundit's hottest take", "The worst trophy ever designed"
    ]
  },
  {
    id: "grownups", name: "Grown-ups", emoji: "☕", door: "#EADBC8", blurb: "Bills, bosses and adulting",
    words: w(`mortgage rent bills council-tax pension spreadsheet inbox meeting deadline commute overtime payday overdraft budget
      invoice landlord boiler dishwasher laundry DIY flatpack self-checkout parcel neighbour bin-day recycling hangover prosecco
      wine gin decaf back-pain knees reading-glasses group-chat mute unmute appraisal promotion HR team-building away-day
      open-plan hot-desk lanyard meal-deal lunchbox school-run parents'-evening babysitter toddler in-laws insurance warranty
      receipt allotment garden-centre car-boot sensible responsible exhausted stressed adulting procrastinate reply-all
      per-my-last-email quick-chat`),
    prompts: [
      "What I actually do on a work-from-home day", "An email signature that tells the truth", "The real reason I'm tired",
      "My mortgage advisor's terrifying advice", "A hangover cure that definitely doesn't work", "What I say at the self-checkout",
      "Why I didn't reply to your text", "The group chat drama this week", "What my landlord fixed (eventually)",
      "A thing I bought instead of paying a bill", "My excuse for skipping the gym", "What my boss means by 'quick chat'",
      "The DIY project that went wrong", "Small talk at the bus stop", "What I'm cooking with what's left in the fridge",
      "A LinkedIn post nobody needs", "What the dishwasher thinks of me", "My retirement plan", "Signs I'm officially old",
      "The neighbour's parcel situation", "A complaint to the energy company", "Things I've googled at 3am",
      "The reason I left the party early", "What I tell people I do for a living", "My five-year plan",
      "A thank-you note for the free biscuits at work", "What I do when the doorbell rings unexpectedly",
      "The team-building exercise from hell", "The out-of-office reply I wish I could send", "What's in my junk drawer"
    ]
  },
  {
    id: "gaming", name: "Gaming", emoji: "🎮", door: "#D8CBF2", blurb: "Bosses, lag and rage quits",
    words: w(`boss level respawn checkpoint save-file loot XP grind noob pro lag ping controller joystick headset streamer emote
      skin DLC patch bug glitch speedrun cheat-code power-up health-bar mana quest NPC side-quest tutorial cutscene combo
      button-mash rage-quit AFK GG camper sniper tank healer raid guild clan avatar pixel arcade cartridge console high-score
      leaderboard achievement battle-royale lobby matchmaking loot-box microtransaction mod sandbox open-world crafting potion
      sword shield fireball coin gem kart double-jump crouch spawn-camp nerf buff OP`),
    prompts: [
      "The final boss's motivational speech", "A patch note nobody wanted", "What my character does when I'm AFK",
      "The tutorial level of real life", "A loading screen tip", "Why I rage quit", "The lore of a very boring RPG",
      "What the NPC really thinks of you", "A cheat code for real life", "The secret level nobody found",
      "My gamer tag, explained", "What my controller would say if it could talk", "A review of an unplayable game",
      "The side quest I'm stuck on", "A battle royale for grandparents", "The microtransaction of the year",
      "The game over message for Mondays", "What my teammates said on voice chat", "A speedrun strategy for doing the washing",
      "The worst power-up ever", "The rules for the console in our house", "A brand-new character class",
      "What happens in the respawn room", "The achievement I just unlocked", "The plot of a dating sim for robots",
      "A kart racing item that should be banned", "The save file I deleted by accident", "Why it lagged at the worst moment",
      "The loot box contained…", "The cutscene everyone skips"
    ]
  },
  {
    id: "royalty", name: "Royalty", emoji: "👑", door: "#EFDFA6", blurb: "Crowns, corgis and court gossip",
    words: w(`king queen prince princess duke duchess earl baron knight squire lady lord jester butler footman courtier corgi crown
      tiara sceptre orb throne palace castle moat drawbridge tower dungeon banquet ballroom carriage coronation jubilee decree
      heir dynasty empire realm kingdom subjects peasant royal regal majestic noble pompous gracious wave curtsey bow tea
      garden-party flag anthem guard bearskin trumpet fanfare portrait tapestry velvet ermine robe joust tournament ball gown
      slipper one's Your-Majesty off-with-their-heads`),
    prompts: [
      "What the royal butler won't tell anyone", "A royal decree for the whole kingdom", "The crown jewel nobody talks about",
      "The rules for the palace garden party", "What the corgis gossip about", "The coronation went wrong when…",
      "A royal wave tutorial", "What's in the royal handbag", "The jester's best joke", "A knight's job description",
      "The princess's secret talent", "A notice pinned to the palace gates", "The royal family's group chat",
      "What the palace guards are thinking", "Royal etiquette for eating a crumpet", "The dragon the king forgot to slay",
      "A ball invitation with a strange dress code", "What haunts the castle's west wing", "The royal wedding afterparty",
      "The banquet menu", "The heir to the throne's first rule", "A royal portrait gone wrong",
      "The kingdom's new national anthem", "Why the drawbridge is stuck", "What the queen keeps under the throne",
      "The court gossip this week", "A letter from the royal pigeon post", "How to address a duke", "The palace's spare room",
      "The royal tour's most awkward moment"
    ]
  },
  {
    id: "kids", name: "Just for Kids", emoji: "🧸", door: "#FFE48A", blurb: "Silly, safe and family-friendly", kids: true,
    words: w(`teddy dinosaur unicorn dragon robot rocket pirate princess superhero monster fairy wizard puppy kitten bunny hamster
      pony penguin panda giraffe elephant monkey frog duck owl ladybird caterpillar butterfly snail worm octopus shark mermaid
      treasure castle den treehouse playground slide swing trampoline sandpit bouncy-castle balloon kite bubble crayon glitter
      sticker slime paint blocks jigsaw teacher homework lunchbox sandwich apple banana broccoli carrot ice-cream cake cupcake
      biscuit sweets lollipop chocolate pizza chips jelly pancake bedtime pyjamas slippers wellies puddle rainbow snowman sun
      moon star cloud tooth-fairy Father-Christmas birthday party present best-friend granny grandad mum dad brother sister
      baby nap bath bubbles sock shoe hat backpack bus school class dog cat cow pig chicken horse bear lion tiger crocodile
      spaceship alien ghost pumpkin bike scooter football tractor train digger fire-engine
      giggle wiggle jump hop skip run dance sing laugh hide seek tickle cuddle share play build draw splash fly roar zoom
      wobble bounce squeak sneeze burp eat sleep swim climb tiptoe stomp wave whisper shout find lose
      big small tiny giant happy silly funny sleepy grumpy brave sparkly fluffy sticky messy noisy quiet magic secret super
      best yummy yucky smelly stinky wobbly squishy shiny spotty stripy purple green pink blue red yellow golden invisible`),
    prompts: [
      "What my teddy does at night", "The best thing to find in a lunchbox", "Why my homework is late",
      "A brand-new flavour of ice cream", "What the dinosaur wants for its birthday", "The rules of my secret den",
      "What the class hamster is thinking", "A superhero with a silly power", "What's at the bottom of the garden",
      "The best sleepover ever", "A song for the school bus", "Why the teacher laughed", "The magic word that opens any door",
      "What unicorns eat for breakfast", "My pet monster's name and why", "A new playground game", "What the moon does all day",
      "The treasure map says…", "A recipe for a giant's sandwich", "What my shoes would say if they could talk",
      "The best present ever", "Why the dog ran off with my sock", "A spell to make broccoli taste nice",
      "What happens when the toys come alive", "My robot's first words", "The silliest school rule", "Where lost socks go",
      "A letter to Father Christmas", "The tooth fairy's secret", "Things to do on a rainy day", "If I ruled the school for a day",
      "What the snowman wished for"
    ]
  },
  {
    id: "weather", name: "Weather", emoji: "🌦️", door: "#BEE1F7", blurb: "Drizzle, heatwaves and forecasts",
    words: w(`rain drizzle downpour storm thunder lightning hail sleet snow blizzard frost fog mist cloud sunshine heatwave drought
      flood puddle umbrella wellies raincoat anorak sun-cream sunburn barbecue breeze gale gust hurricane tornado monsoon
      rainbow forecast forecaster cold-front warm-front pressure humid muggy chilly freezing boiling scorching damp soggy grey
      gloomy bright sunny windy breezy overcast icy slushy snowflake snowman sledge icicle thermometer degrees bank-holiday
      summer autumn winter spring seaside deckchair windbreak sideways weather-app`),
    prompts: [
      "Tonight's forecast, read by a pirate", "Why the barbecue was rained off", "An apology from the British summer",
      "What the clouds are gossiping about", "A weather warning for my mood", "What the snowman said before melting",
      "Why it's always windy at the bus stop", "The forecast for my love life", "How to survive a British heatwave",
      "What my umbrella thinks of me", "A complaint letter to the rain", "The rainbow's secret", "Why the weather presenter quit",
      "A postcard from a hurricane", "The fog's dating profile", "A lightning bolt's to-do list",
      "The sun's excuse for not turning up", "What thunder is really shouting", "A packing list for a British beach day",
      "Why the weather app lies", "A motivational poster for drizzle", "What the frost wrote on my windscreen",
      "How to make small talk about the weather", "The snow day plan", "The worst place to be caught in a storm",
      "A poem by a puddle", "What the seagull thinks of the sea breeze", "The heatwave's list of demands",
      "The secret life of a raindrop", "What I wear when it's 'a bit nippy'"
    ]
  },
  {
    id: "books", name: "Books", emoji: "📚", door: "#EDD3C4", blurb: "Plot twists and overdue fines",
    words: w(`novel chapter page prologue epilogue plot twist hero villain sidekick narrator author poet library librarian bookshop
      bookmark spine cover blurb paperback hardback ebook audiobook bestseller sequel trilogy saga fairy-tale
      once-upon-a-time happily-ever-after detective mystery clue suspect romance thriller horror sci-fi fantasy memoir diary
      poem rhyme limerick sonnet quill ink typewriter manuscript publisher editor critic review footnote index dictionary
      overdue shh book-club cosy cliffhanger plot-hole moral fable legend myth quest orphan governess heroine tragic epic gothic
      the-end`),
    prompts: [
      "The first line of my bestselling novel", "A self-help book nobody should buy", "What the librarian is really thinking",
      "A plot twist for a bedtime story", "The blurb on the back of my autobiography", "Why the book club ended in tears",
      "A cookbook written by a dragon", "The villain's big monologue", "The last line of a terrible romance novel",
      "A children's book that went too dark", "A footnote nobody reads", "What my bookmark has seen",
      "The detective solved it because…", "A chapter title from my life", "A review on the back of a boring book",
      "A poet's shopping list", "The sequel nobody asked for", "What happens in the second-hand bookshop after dark",
      "A spell from a forgotten book", "The moral of the story is…", "My e-reader's complaint",
      "A fairy tale with a modern twist", "The book I pretend to have read", "A dedication page that says too much",
      "The one rule in a dystopian novel", "What Sherlock Holmes found in the fridge", "An overdue library book's excuse",
      "The title of my cosy mystery", "A pirate's logbook entry", "The plot hole nobody noticed"
    ]
  },
  {
    id: "space", name: "Space", emoji: "🚀", door: "#C6CBEE", blurb: "Aliens, rockets and black holes",
    words: w(`rocket astronaut alien UFO planet moon star galaxy nebula comet asteroid meteor black-hole wormhole orbit gravity
      zero-gravity spacesuit helmet satellite space-station rover Mars Jupiter Saturn Pluto Venus Mercury Neptune sun
      supernova constellation telescope launch countdown blast-off mission-control lift-off airlock oxygen tractor-beam laser
      cosmonaut light-year spaceship flying-saucer crater lunar solar cosmic interstellar galactic stardust martian earthling
      probe signal teleport abduct float drift crash-land Houston space-food`),
    prompts: [
      "The first words spoken on Mars", "What aliens say about us", "An astronaut's packing list", "Mission control's worst message",
      "An advert for space tourism", "What the moon thinks of us", "The black hole's dating profile",
      "Why the rocket launch was delayed", "The intergalactic takeaway menu", "A postcard from Saturn",
      "What the space station smells like", "The UFO sighting report", "A rule for the first Mars colony", "Pluto's complaint",
      "An alien's review of Earth", "What the robot rover found", "The countdown went wrong at…", "Space hotel house rules",
      "The constellation I just discovered", "Galactic news headline", "What astronauts dream about", "The comet's travel diary",
      "How to make friends with an alien", "A message to send into deep space", "The sun's retirement speech",
      "A warning sign on the airlock door", "A horoscope for a satellite", "Why the aliens left early", "Zero-gravity cooking tips",
      "What's really on the dark side of the moon"
    ]
  },
  {
    id: "paranormal", name: "Paranormal", emoji: "👻", door: "#CFC8DB", blurb: "Ghosts, curses and things that go bump",
    words: w(`ghost spirit phantom poltergeist ghoul banshee zombie vampire werewolf witch warlock demon spectre skeleton mummy
      goblin troll Bigfoot yeti Nessie alien UFO haunted cursed creepy spooky eerie possessed ouija séance tarot crystal-ball
      psychic medium exorcist ghost-hunter orb cobweb coffin crypt graveyard tombstone cauldron broomstick potion spell hex
      curse candle full-moon howl moan rattle chains creak attic cellar shadow footsteps whisper scream bump boo! Halloween
      pumpkin black-cat raven bat fangs garlic stake portal afterlife beyond`),
    prompts: [
      "A dating profile for a ghost", "What the ghost in my attic wants", "A review of a haunted house", "A séance message from Nan",
      "The vampire's skincare routine", "What the werewolf does at full moon", "A ransom note from Bigfoot",
      "The poltergeist's complaint", "The crop circle says…", "What the ouija board spelled out", "A ghost hunter's worst night",
      "The haunted doll's diary", "Why the lights keep flickering", "The zombie's job interview", "The witch's shopping list",
      "How to survive a haunted hotel", "The Loch Ness Monster's excuse", "The cursed thing I bought online",
      "A lullaby for sleepless vampires", "What the psychic saw in my future", "The alien abduction report", "A spell gone wrong",
      "Halloween house rules", "The banshee's karaoke song", "The mummy's unwrapping party", "What's really under the bed",
      "The ghost's unfinished business", "A tarot card nobody wants to draw", "The creepy noise was actually…",
      "The graveyard's neighbourhood watch"
    ]
  },
  {
    id: "afterdark", name: "After Dark", emoji: "🌶️", door: "#F4B9C8", blurb: "Cheeky questions for over-18s", adult: true,
    words: w(`flirt snog kiss cuddle wink tease seduce date first-date blind-date dating-app swipe match ghosted ex crush fling
      hook-up walk-of-shame morning-after hangover tipsy drunk shots tequila prosecco cocktail nightclub dancefloor taxi kebab
      hen-do stag-do naughty cheeky saucy spicy frisky steamy flirty sultry sexy hot bedroom lingerie suspenders
      fluffy-handcuffs whipped-cream massage oil candles hot-tub skinny-dip nudist naked birthday-suit bum booty thong boxers
      pillow-talk safe-word honeymoon toyboy cougar sugar-daddy lipstick love-bite romance affair scandal regret commitment
      bachelor wedding-night bed sheets spoon tango strip-poker dare truth spin-the-bottle body-shots one-night-stand
      friends-with-benefits situationship red-flag rizz`),
    prompts: [
      "The worst chat-up line ever", "My dating app bio, but honest", "What I'm really thinking on a first date",
      "The walk of shame, explained", "A text you shouldn't send after six drinks", "The hen do went wrong when…",
      "The stag do's best-kept secret", "My love language is…", "A brutally honest wedding vow", "What the hotel walls heard",
      "The real reason we broke up", "A safe word that's a terrible idea", "What happens at the office Christmas party",
      "My ex's new partner is…", "The morning-after excuse", "An honest review of last night",
      "The cocktail menu at a very naughty bar", "What my bedside drawer says about me", "A strip poker rule nobody agreed to",
      "The best excuse for being caught out", "What to whisper in someone's ear", "A cheeky toast at a divorce party",
      "The flirtiest thing a ghost could say", "My spicy secret talent", "The dress code for an adults-only party",
      "What you should never say in the bedroom", "The honeymoon went wrong because…", "An autocorrect fail I can't take back",
      "My biggest red flag", "The rules of our situationship"
    ]
  }
];

// Add the 1.2 questions to each room (dropping any duplicates).
for (const r of ROOMS) {
  const have = new Set(r.prompts.map(p => p.toLowerCase()));
  for (const p of MORE_PROMPTS[r.id] || []) if (!have.has(p.toLowerCase())) { have.add(p.toLowerCase()); r.prompts.push(p); }
}

export const ROOM_BY_ID = Object.fromEntries(ROOMS.map(r => [r.id, r]));
export const roomOf = id => ROOM_BY_ID[id] || ROOM_BY_ID.classic;

// Kid-safe extras, used only in Just for Kids alongside that room's own words.
const KID_WILD = w(`very again forever tonight never always only almost nobody everybody everything nothing because after before
  behind under inside maybe please sorry oops help yes no why how what who we they he she her his our this that was are will
  can't must too suddenly quietly loudly secretly really so but or then with for on up down`);

// Deal one round's magnets for a room. Everyone in the room gets the same deal.
export function deal(roomId, rnd, opts = {}) {
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const take = (a, n, used) => {
    const out = [];
    for (const x of shuffle(a)) { if (out.length >= n) break; if (!used.has(x.toLowerCase())) { used.add(x.toLowerCase()); out.push(x); } }
    return out;
  };
  const room = roomOf(roomId);
  const used = new Set([...GLUE, ...PUNCT].map(x => x.toLowerCase()));
  const cheekyOn = !room.kids && opts.cheeky !== false;
  const cheeky = cheekyOn ? take(CHEEKY, room.adult ? 8 : 5, used) : [];
  let words;
  if (room.kids) {
    words = [...GLUE, ...take(room.words, 34, used), ...take(KID_WILD, 10, used)];
  } else if (!room.words.length) {
    words = [...GLUE, ...take(ALL_GENERAL.nouns, 15, used), ...take(ALL_GENERAL.verbs, 10, used), ...take(ALL_GENERAL.adjs, 9, used), ...take(WILD, 10, used)];
  } else {
    words = [...GLUE, ...take(room.words, 16, used), ...take(ALL_GENERAL.nouns, 8, used), ...take(ALL_GENERAL.verbs, 7, used), ...take(ALL_GENERAL.adjs, 6, used), ...take(WILD, 8, used)];
  }
  // Punctuation goes at the end of the tray so it's always easy to find.
  return [...shuffle([...words, ...cheeky]), ...PUNCT];
}

export const BANK_SIZE = uniq([...GLUE, ...PUNCT, ...CHEEKY, ...NOUNS, ...VERBS, ...ADJS, ...WILD, ...KID_WILD, ...ROOMS.flatMap(r => r.words)]).length;

// Multi-word magnets are stored with hyphens ("ice-cream") and shown with
// spaces ("ice cream"), except words that really are hyphenated.
const KEEP_HYPHEN = new Set(["u-turn", "sci-fi", "hat-trick", "half-time", "extra-time", "injury-time", "own-goal", "second-hand",
  "brand-new", "spin-doctor", "double-jump", "rage-quit", "power-up", "side-quest", "cheat-code", "light-year", "blast-off",
  "lift-off", "loot-box", "save-file", "health-bar", "hook-up", "pit-stop", "red-card", "yellow-card", "gym-bro", "spawn-camp",
  "flip-flops", "sat-nav", "self-checkout", "flatpack", "car-boot", "reply-all", "one-night-stand", "e-reader", "x-ray"]);
export const label = word => {
  const s = String(word);
  if (s.startsWith("-") || KEEP_HYPHEN.has(s.toLowerCase())) return s;
  return s.replace(/(?<=\S)-(?=\S)/g, " ");
};
