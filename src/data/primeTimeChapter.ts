import type { Chapter } from "../types";

/**
 * Grade 6 "Prime Time" — structured chapter aligned with multiplicative
 * structure of whole numbers (factors, primes, factorization, GCF/LCM).
 * Narration tuned for age ~11: stories first, then short worked examples.
 */
export const primeTimeChapter: Chapter = {
  meta: {
    id: "prime-time-g6",
    title: "Prime Time",
    grade: "Grade 6",
    unit: "Number Theory & Multiplicative Structure",
    description:
      "You get to break numbers apart and build them back up—like splitting prizes fairly, lining up game boards, and syncing schedules. Along the way you meet factor pairs, primes, prime factorization, GCF, and LCM with friendly examples and quick check-ins.",
  },
  lessons: [
    {
      id: "l1",
      slug: "ways-to-think-about-factors",
      title: "Ways to Think About Factors",
      shortTitle: "Factors & arrays",
      order: 1,
      conceptId: "intro",
      learningObjectives: [
        "Tell what it means when we say one whole number is a factor of another.",
        "Picture factor pairs as rows and columns in a game grid.",
        "Use multiplication or division (no remainder) to prove a factor yes-or-no.",
      ],
      vocabulary: [
        {
          term: "Factor",
          definition:
            "A whole number that divides another whole number evenly—no leftover bits. Another way to say it: two factors multiply to make a bigger number (the product).",
        },
        {
          term: "Factor pair",
          definition:
            "Two factors that multiply to your target number, like 4 and 6 for 24 because 4 × 6 = 24.",
        },
        {
          term: "Product",
          definition:
            "The answer you get when you multiply. In 4 × 6 = 24, the product is 24.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Snack packs and fair shares",
          body: [
            "Imagine you have 24 mini cookies for a party table. You want everyone at the table to get the same number of cookies, and you do not want any lonely crumbs left over. If 6 friends sit there, you can place 4 cookies in front of each friend, because 6 × 4 = 24. The numbers 6 and 4 are factors of 24—they fit evenly into the total.",
            "Worked example: Can 5 people split 24 cookies fairly? Think 24 ÷ 5. You get 4 for each person, but 4 cookies are left over. Because there is a remainder, 5 is not a factor of 24. But 24 ÷ 8 = 3 exactly, so 8 is a factor—and it pairs with 3, since 8 × 3 = 24.",
            "Picture the same idea with a deck of collectible cards you are sorting into equal stacks. Every time you can make same-size stacks with no leftovers, you have found factors: stack count × cards per stack = total cards.",
            "Worked example: You have 18 cards and want equal stacks of 6. 18 ÷ 6 = 3 stacks, so 6 and 3 are factors of 18. If you tried stacks of 7, you would have leftovers—so 7 is not a factor.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture a sticker album with exactly 24 empty spots on one page. If each row must have the same number of stickers and the page fills perfectly, the row length and row count are factors of 24—they multiply to 24 with no empty spots left over.",
              "If a row length does not work, you would finish the rows and still have stray stickers that do not complete a row. That remainder means that row length is not a factor.",
            ],
            erroneousExample: [
              "Alex says: ‘15 is a factor of 24 because 15 + 9 = 24.’",
              "Spot the mistake: factors come from multiplying or dividing evenly, not from addition. Check 24 ÷ 15—it is not a whole number.",
            ],
            practice: {
              prompt: "You have 30 stickers and want 5 full rows with the same number in each row, no extras. Does 5 work as a factor of 30? Say yes or no and use division or multiplication in one short sentence.",
              hint: "Try 30 ÷ 5 or ask what times 5 equals 30.",
              solution:
                "Yes: 30 ÷ 5 = 6 with no remainder (also 5 × 6 = 30), so 5 is a factor.",
            },
          },
        },
        {
          id: "s2",
          title: "Game boards as rectangle arrays",
          body: [
            "Lay your counters out like a game board: neat rows and columns with no holes. If the board holds 24 spaces total and both side lengths are whole numbers, those side lengths are a factor pair of 24.",
            "Worked example: A robot tile mat uses 24 tiles. You could make a 3-by-8 rectangle, because 3 × 8 = 24. You could also do 2 rows of 12, or 1 huge row of 24. Each workable pair (3, 8), (2, 12), (1, 24) is telling you a factor story about 24.",
            "This grid idea is handy when a number feels abstract. Ask: “Could I draw a perfect rectangle with that many unit squares?” If yes, you just discovered factors as the side lengths.",
            "Worked example: Can a rectangle use exactly 17 unit squares with whole-number sides? It can only be 1 × 17, because 17 is not 2×something, 3×something, and so on with whole sides. That preview matters soon when we meet primes.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Imagine a movie theater with 20 seats in one solid block of rows and columns—no gaps. If the block is full, the number of rows and the seats per row multiply to 20. Those two numbers are a factor pair for 20.",
              "If you try a guess that does not multiply to the total seats, the picture does not work; that is the same as failing the factor test.",
            ],
            erroneousExample: [
              "Bo says: ‘For 20 seats, 4 and 5 are factors because 4 + 5 + other numbers might get close to 20.’",
              "Spot the mistake: factor pairs multiply to the total. You need 4 × 5 = 20 (that works), not adding random numbers to ‘get close.’",
            ],
            practice: {
              prompt: "The band fills a block of 12 seats in rows and columns with no empty seats. Name one factor pair for 12 (two whole numbers that multiply to 12).",
              hint: "Think of a small rectangle on grid paper: try 2 rows of 6, or 3 rows of 4.",
              solution: "Examples: 2 and 6 (2 × 6 = 12), or 3 and 4 (3 × 4 = 12), or 1 and 12.",
            },
          },
        },
        {
          id: "s3",
          title: "Division as a yes-or-no factor test",
          body: [
            "Division is the cleanup crew for factors. If you divide your total by a possible factor and get remainder zero, congratulations—you found a factor. If something messy is left, that divisor fails the test.",
            "Worked example: Is 7 a factor of 42? Do 42 ÷ 7. You land on 6 with no remainder. So yes; 7 × 6 = 42 locks it in.",
            "You can flip the same check with multiplication. Ask, “Does any whole number times my guess reach the target exactly?” If the answer is yes, your guess is a factor.",
            "Worked example: Is 9 a factor of 40? Look for a whole number k with 9 × k = 40. There is not one—9 × 4 = 36 and 9 × 5 = 45 skip over 40. So 9 is not a factor.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of sharing 42 pizza slices into equal plates with no slices left on the side. If a plate size works, 42 ÷ plate size comes out even. If there are leftover slices, that plate size is not a factor of 42.",
              "Multiplication is the flip side: only factors can multiply with some whole number to hit the total exactly.",
            ],
            erroneousExample: [
              "Sam says: ‘7 is not a factor of 42 because 42 ÷ 7 equals 6 and that seems too small.’",
              "Spot the mistake: the test is remainder zero, not whether the answer ‘feels’ big or small. 42 ÷ 7 = 6 exactly, so 7 is a factor.",
            ],
            practice: {
              prompt: "Is 8 a factor of 48? Answer yes or no and show the division or a multiplication sentence that proves it.",
              hint: "Try 48 ÷ 8—or 8 × what equals 48?",
              solution:
                "Yes: 48 ÷ 8 = 6 with no remainder (8 × 6 = 48), so 8 is a factor.",
            },
          },
        },
        {
          id: "s4",
          title: "Many factor pairs, one number",
          body: [
            "One number can wear many factor outfits. For 28, you can write 1 × 28, 2 × 14, and 4 × 7. Each outfit is a factor pair, and they all multiply back to the same 28.",
            "Worked example: List factor pairs of 28 starting tiny: 1 × 28, 2 × 14 (since 28 ÷ 2 = 14), then 4 × 7 (since 28 ÷ 4 = 7). Next trial 5 fails, 6 fails, so you stop before repeating pairs backwards.",
            "Factor pairs are buddies: if you know one buddy, you can find the other by dividing. If 4 is a factor of 28, its buddy is 28 ÷ 4 = 7.",
            "Worked example: You discover 3 is a factor of 45 because 45 ÷ 3 = 15 with no remainder. Instantly you also know 15 is a factor, because 3 × 15 = 45.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Treat 24 like a playlist you chop into equal smaller playlists. 3 songs in each mini-list gives 8 lists, because 3 × 8 = 24. Each workable mini-list size pairs with a buddy count, and every pair multiplies back to 24.",
              "Different list sizes are just different outfits for the same number—they never change the fact that you still have 24 songs total.",
            ],
            erroneousExample: [
              "Riley says: ‘5 and 6 are a factor pair of 30 because 5 + 6 = 11, and 11 is almost in 30 somehow.’",
              "Spot the mistake: factor pairs multiply to the number. Check: 5 × 6 = 30—that is the real reason 5 and 6 are factors, not adding.",
            ],
            practice: {
              prompt: "List one factor pair of 21 (two whole numbers that multiply to 21).",
              hint: "Try small numbers: 1 × 21 works; is there another pair in the middle?",
              solution: "1 × 21 and 3 × 7 are the factor pairs (with 3 and 7 both whole numbers).",
            },
          },
        },
        {
          id: "s5",
          title: "Why we use strategies, not memory tricks",
          body: [
            "Nobody memorizes every factor of every number—that would be like memorizing every level map in every video game. Instead you learn moves: test small numbers, use the buddy trick with division, and sketch a quick array when you are stuck.",
            "Worked example: To hunt factors of 36, start at 1 × 36, then 2 × 18, then 3 × 12, then 4 × 9, then 6 × 6. After that the patterns mirror—so you know you are done.",
            "The big goal is understanding why a number works or fails—not racing to shout factors of 144 from cold memory.",
            "Worked example: If a classmate says “13 is a factor of 91,” you do not have to believe them blindly. Check 91 ÷ 13. It equals 7 exactly, so they are right—and you proved it with division.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of a superhero kit: you learn a few moves—test small numbers, use division with remainder zero, match buddies—instead of memorizing every villain in every comic. The moves work on new numbers you have never seen before.",
              "The win is knowing why a number passes or fails the test, not shouting the fastest answer with no proof.",
            ],
            erroneousExample: [
              "Jordan says: ‘I know 7 is a factor of 63 because I memorized it, but I cannot explain it.’",
              "Spot what is weaker: memory can slip. A proof always works—show 63 ÷ 7 = 9 with no remainder, or 7 × 9 = 63.",
            ],
            practice: {
              prompt: "Using division or multiplication, decide if 6 is a factor of 54 in one sentence of math and words.",
              hint: "Does 54 ÷ 6 come out even?",
              solution: "Yes: 54 ÷ 6 = 9 exactly (or 6 × 9 = 54), so 6 is a factor.",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt:
            "List all factor pairs of 18 (write each pair once, smaller number first).",
          hint: "Start at 1 × … and move up until partners repeat.",
          solution:
            "1 × 18, 2 × 9, 3 × 6. (Next would be 6 × 3, already listed.) So pairs: (1,18), (2,9), (3,6).",
        },
        {
          prompt: "Is 7 a factor of 42? Explain in one sentence using division or multiplication.",
          hint: "Check whether 42 ÷ 7 is a whole number.",
          solution:
            "Yes: 42 ÷ 7 = 6 with remainder 0, so 7 is a factor (also 7 × 6 = 42).",
        },
      ],
      quiz: [
        {
          id: "l1q1",
          conceptId: "intro",
          prompt: "Which statement best matches the definition of factor used in this lesson?",
          options: [
            { id: "a", label: "A number you get by adding the same value repeatedly" },
            { id: "b", label: "A whole number that divides another whole number with remainder 0" },
            { id: "c", label: "Any number that appears in a word problem" },
          ],
          hints: {
            pointing:
              "Revisit what a factor means when you split a total into equal groups—does it come from adding or from dividing evenly?",
            teaching:
              "A factor has to divide the bigger number with zero remainder. You can also think: two factors multiply to make the target number.",
            bottomOut:
              "The correct choice talks about dividing with remainder 0, not about adding.",
          },
          correctOptionId: "b",
          rationale:
            "Factors come from exact divisibility (or equivalent multiplication). Addition is a different operation.",
        },
        {
          id: "l1q2",
          conceptId: "intro",
          prompt: "Which pair is a factor pair of 28?",
          options: [
            { id: "a", label: "4 and 8 (because 4 + 8 = 12)" },
            { id: "b", label: "4 and 7 (because 4 × 7 = 28)" },
            { id: "c", label: "14 and 14 (because 14 + 14 = 28)" },
          ],
          hints: {
            pointing:
              "Scan the answer choices: which ones mention multiplication instead of addition?",
            teaching:
              "A factor pair is two numbers you multiply to get the target—here, 28.",
            bottomOut:
              "Try 4 × 7 and 4 × 8 in your head; only one pair makes exactly 28.",
          },
          correctOptionId: "b",
          rationale: "Factor pairs multiply to the number: 4 × 7 = 28.",
        },
        {
          id: "l1q3",
          conceptId: "intro",
          prompt: "Rectangular arrays with whole-number side lengths model which idea?",
          options: [
            { id: "a", label: "Factor pairs / factors" },
            { id: "b", label: "Only prime numbers" },
            { id: "c", label: "Decimal place value" },
          ],
          hints: {
            pointing:
              "Think back to rows and columns on a grid—what two numbers do the sides stand for?",
            teaching:
              "If a rectangle has n unit squares and whole-number sides, those side lengths multiply to n, so they are factors.",
            bottomOut:
              "The right answer is the one about factor pairs and factors—not only primes or decimals.",
          },
          correctOptionId: "a",
          rationale: "Side lengths of a filled rectangle for n objects are a factor pair of n.",
        },
      ],
    },
    {
      id: "l2",
      slug: "factor-pairs-systematically",
      title: "Finding Factor Pairs Systematically",
      shortTitle: "Factor search",
      order: 2,
      conceptId: "factor_pairs",
      learningObjectives: [
        "List every factor pair of a whole number without missing or duplicating.",
        "Know when to stop searching so you do not repeat the same pair backwards.",
        "Connect organized searches to area rectangles (rows × columns).",
      ],
      vocabulary: [
        {
          term: "Systematic search",
          definition:
            "Checking possible factors in order—like moving down a checklist—while writing each pair you find until you pass the middle.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "The checklist walk",
          body: [
            "Think of factor hunting like collecting gym badges in order. You try 1, then 2, then 3, and so on. Each time a number divides your target evenly, you write the pair (small buddy, big buddy) from n ÷ tester.",
            "Worked example: For 40, start: 1 × 40, 2 × 20, 4 × 10, 5 × 8. The trial 3 fails, 6 fails, 7 fails; 8 already appeared as a partner, so you stop.",
            "Keeping order matters because your brain hates doing the same puzzle twice. If you jump randomly, you might miss a middle pair or write duplicates.",
            "Worked example: For 48, you list 1×48, 2×24, 3×16, 4×12, then 6×8. Trials like 5 and 7 fail. After 6×8 you stop, because anything past that would only repeat pairs you already wrote, just flipped.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Pretend you are checking out library books on a cart. You push down the shelf numbers 1, 2, 3… in order. Whenever a shelf number divides your total evenly, you write that pair on a sticky note. Going in order keeps you from losing your place or writing the same note twice backward.",
              "Order is just a gentle path through the maze—your brain stays calmer than if you jump around randomly.",
            ],
            erroneousExample: [
              "Casey finds 4×10 = 40 and later writes 10×4 as a brand-new, different pair for 40.",
              "Spot the mistake: those are the same pair with the numbers swapped. Factor pairs are usually listed once (smaller number first) so the closet is not stuffed with duplicate outfits.",
            ],
            practice: {
              prompt: "In order, list the factor pairs of 16 until you know you can stop (write each pair once, smaller number first).",
              hint: "Start 1×16, then test 2, 3, 4… stop when you would only repeat.",
              solution: "1×16, 2×8, 4×4. After 4×4 you are done (next trials repeat flipped pairs).",
            },
          },
        },
        {
          id: "s2",
          title: "When the search safely ends",
          body: [
            "Stop when your next trial factor would be larger than the partner you just wrote. After that point you only redo pairs flipped backwards.",
            "Worked example: With 36 you record up to 6 × 6. If you tried 7 next, its partner would be smaller than 7, but you already captured those stories earlier—so you are finished.",
            "Another way to feel the stop: imagine partners walking toward each other on a number line—they meet at the square case, then turn around as repeats.",
            "Worked example: For 28, after 4 × 7, trying 5 and 6 fails; 7 × 4 would repeat. You close the notebook.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture two friends hopscotching toward each other on a number line of factor pairs. They meet in the middle at the square case (like 6×6 for 36). After they pass, every new hop is just old pairs wearing their coats inside out.",
              "So you stop once your next step would only redraw tape you already stuck on the ground.",
            ],
            erroneousExample: [
              "Drew tries factor pairs of 21 and after 1×21 says ‘I should keep going until I reach 21×1 again so I am extra sure.’",
              "Spot the mistake: you already have that story when you listed 1 and 21. Going past the middle only repeats backwards.",
            ],
            practice: {
              prompt: "For 28, you already have 4×7. Without listing more pairs, explain in one kid-friendly sentence why trying 7×4 next is not a new discovery.",
              hint: "Same two buddies, different order.",
              solution:
                "7×4 is the same factor pair as 4×7—just flipped—so it is not a new pair.",
            },
          },
        },
        {
          id: "s3",
          title: "Square numbers: the mirror moment",
          body: [
            "Sometimes both buddies are the same—that is a square number. A dance floor can be 6 by 6, which is why we call 36 a perfect square.",
            "Worked example: List pairs for 36 and notice 6 × 6 sits in the middle. You do not list 6 twice as different pairs; it is one special square pair.",
            "Square numbers are a neat landmark while searching—they tell you exactly where the repeat zone would start.",
            "Worked example: For 49, only 1 × 49 and 7 × 7 appear. The 7 × 7 moment flags 49 as a square.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Imagine a square pan of brownies cut into rows and columns with the same count on each side—like 5 rows and 5 columns for 25 treats. A square number is when both sides are the same whole number, so you get exactly one ‘double buddy’ moment instead of two different lengths.",
              "That middle moment is the mirror: after it, new guesses just replay old pairs backward.",
            ],
            erroneousExample: [
              "Taylor lists 6×6 for 36 and also writes another pair ‘6 and 6 again because there are two sixes.’",
              "Spot the mistake: you still write one square pair once. You do not need duplicate lines—6×6 is a single special stop.",
            ],
            practice: {
              prompt: "Is 64 a square number? Explain using one factor pair where both factors are the same.",
              hint: "What whole number times itself makes 64?",
              solution: "Yes: 8 × 8 = 64, so both sides match—a square.",
            },
          },
        },
        {
          id: "s4",
          title: "Area picture, same pairs",
          body: [
            "Rows × columns on a grid literally are a factor pair. If you can draw the rectangle on grid paper with a whole-number base and height, you have found factors.",
            "Worked example: Make a 4-by-10 rectangle for 40. That shows 4 × 10 = 40. Rotate the paper; you still have the same pair in a different orientation.",
            "This picture helps when numbers get bigger than your times-table comfort zone—you can sketch instead of panic.",
            "Worked example: To factor 54 visually, try 6 rows of 9 squares. That certifies 6 and 9 as factors because 6 × 9 = 54.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of two garden beds with the same number of plant squares. One bed is ‘rows’ and the other is ‘how many in each row.’ If the rectangle is perfectly filled, rows × plants-per-row equals the total—exactly your factor pair.",
              "Spin the sketch in your head: swapping rows and columns is the same pair, not a new mystery.",
            ],
            erroneousExample: [
              "Jamie draws a 3-by-8 rectangle for 18 squares and says ‘the area is 18 so this proves 3 and 8 are factors of 18.’",
              "Spot the mistake: 3×8 is 24, not 18. The rectangle has to match the total—check multiplication before you celebrate.",
            ],
            practice: {
              prompt: "Show one factor pair for 20 using a quick area story (rows and columns) in one sentence.",
              hint: "Pick numbers that multiply to 20—like 4 rows of 5.",
              solution: "Example: 4 rows with 5 squares each gives 4×5 = 20, so 4 and 5 are factors.",
            },
          },
        },
        {
          id: "s5",
          title: "Buddy division shortcut",
          body: [
            "Whenever you spot one factor, divide to reveal its buddy instantly. Finding 5 works for 40? Then 40 ÷ 5 = 8 finishes the pair.",
            "Worked example: You notice 12 divides 60. Companion is 60 ÷ 12 = 5. Pair: 12 × 5 = 60.",
            "That shortcut saves time during systematic search—you write both numbers the moment one passes the division test.",
            "Worked example: Testing if 9 divides 72 gives yes; buddy is 72 ÷ 9 = 8, so 9 × 8 = 72.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "It is like soccer: if you spot number 5 on the field and know the team has 40 players lined up equally, you instantly know the other group size by dividing—40 ÷ 5 = 8. Factors travel in pairs; division finds the missing teammate.",
              "That saves you from hunting the same clue twice.",
            ],
            erroneousExample: [
              "Max finds 40 ÷ 8 = 5 and then ignores 8, saying ‘only 5 counts.’",
              "Spot the mistake: both numbers are factors—5 and 8 are buddies because 5×8 = 40.",
            ],
            practice: {
              prompt: "If 7 is a factor of 56, what buddy factor do you get from division? Write the factor pair as a multiplication sentence.",
              hint: "Divide 56 by 7.",
              solution: "56 ÷ 7 = 8, so 7 × 8 = 56 (7 and 8 are the pair).",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt: "List all factor pairs of 40.",
          hint: "Try divisors 1, 2, 4, 5, …",
          solution: "(1,40), (2,20), (4,10), (5,8). Next would repeat.",
        },
        {
          prompt:
            "You listed 3 × 12 = 36. Without listing everything again, what pair must also be true about 36 if 4 divides 36 evenly?",
          hint: "Divide 36 by 4 to find the buddy.",
          solution: "36 ÷ 4 = 9, so 4 × 9 = 36 is another factor pair.",
        },
      ],
      quiz: [
        {
          id: "l2q1",
          conceptId: "factor_pairs",
          prompt: "You are listing factor pairs of 48. After 4 × 12, the next successful smaller factor is:",
          options: [
            { id: "a", label: "5" },
            { id: "b", label: "6" },
            { id: "c", label: "7" },
          ],
          hints: {
            pointing:
              "The question is about the number 48, right after you already know 4 × 12 works.",
            teaching:
              "Try the next small counting numbers: does 48 divide evenly by 5? by 6? by 7?",
            bottomOut:
              "48 ÷ 5 leaves a remainder, but 48 ÷ 6 is a whole number—so 6 is the next hit.",
          },
          correctOptionId: "b",
          rationale: "48 ÷ 6 = 8, so 6 × 8 is a pair. 48 ÷ 5 is not whole.",
        },
        {
          id: "l2q2",
          conceptId: "factor_pairs",
          prompt: "Which number has exactly three distinct factors (1, p, p²) if p is prime?",
          options: [
            { id: "a", label: "A prime number" },
            { id: "b", label: "The square of a prime" },
            { id: "c", label: "Any composite number" },
          ],
          hints: {
            pointing:
              "The problem mentions p squared (p²) while p itself is prime—picture a small example like 3 or 5.",
            teaching:
              "List the factors of p² when p is prime: you always get 1, p, and p²—three factors, no extras.",
            bottomOut:
              "That pattern matches the square of a prime (like 9 = 3²), not a plain prime and not ‘any’ composite.",
          },
          correctOptionId: "b",
          rationale: "For prime p, factors of p² are 1, p, and p²—three factors.",
        },
      ],
    },
    {
      id: "l3",
      slug: "prime-and-composite",
      title: "Prime and Composite Numbers",
      shortTitle: "Primes & composites",
      order: 3,
      conceptId: "prime_composite",
      learningObjectives: [
        "Sort whole numbers bigger than 1 into prime or composite using the definitions.",
        "Explain why 1 is treated as special—not prime or composite.",
        "Use quick divisibility checks as clues, not magic spells.",
      ],
      vocabulary: [
        {
          term: "Prime number",
          definition:
            "A whole number greater than 1 whose only positive factors are 1 and itself—it refuses to split into smaller whole-number pieces.",
        },
        {
          term: "Composite number",
          definition:
            "A whole number greater than 1 that has extra factors besides 1 and itself—you can break it into a smaller pair.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Building blocks vs LEGO piles",
          body: [
            "A prime is like a single LEGO piece you cannot snap into two smaller whole pieces (except the boring 1-wide splits). A composite is a build you can separate further—like 9 breaking into 3 × 3.",
            "Worked example: 7 is prime; only 1 × 7 and 7 × 1 exist with whole numbers. 8 is composite because 2 × 4 is another story.",
            "Primes are the secret ingredient list; composites are recipes made by mixing those ingredients.",
            "Worked example: 13 keeps showing up in card tricks because it is prime—only 1 and 13 divide it evenly.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of a phone passcode. A prime is a code that only breaks apart in the boring way: ‘1 × itself.’ A composite code can split into smaller whole pieces—like 10 splitting into 2 and 5—so it is built from smaller building blocks.",
              "Primes are the smallest indivisible batteries that power bigger numbers.",
            ],
            erroneousExample: [
              "Aisha says: ‘9 must be prime because it looks unfriendly and does not end in 0.’",
              "Spot the mistake: look at factors, not vibes. 9 = 3 × 3, so it has an extra factor besides 1 and 9—composite.",
            ],
            practice: {
              prompt: "Is 11 prime or composite? Give a one-sentence reason using factors.",
              hint: "Try to split 11 into two smaller whole numbers besides 1×11.",
              solution:
                "Prime: the only whole-number factor pair is 1×11, so no extra factors.",
            },
          },
        },
        {
          id: "s2",
          title: "Why 1 stands alone",
          body: [
            "The number 1 is the quiet kid at the factor dance. Primes are supposed to have exactly two different factors: 1 and themselves—but 1 only brings one outfit (itself).",
            "Worked example: If someone blurts “1 is prime because it only divides by 1,” mathematicians gently fix the rule: primes must be bigger than 1 so the building-block idea stays clean.",
            "Composite numbers also need more than two factors; 1 does not qualify there either.",
            "Worked example: Classifying the number line starts at 2 for primes: 2 is the smallest prime, the only even one.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Imagine a class dodgeball team. ‘Prime’ players must bring exactly two jerseys: one labeled 1 and one with their name. The number 1 only has one jersey that fits both jobs, so it does not fit the prime costume rules, and it also is not composite.",
              "Mathematicians keep 1 special so the prime/composite labels stay tidy for numbers bigger than 1.",
            ],
            erroneousExample: [
              "Leo says: ‘1 is composite because it is small and simple.’",
              "Spot the mistake: composite means more than two factors and bigger than 1. The number 1 does not match either label.",
            ],
            practice: {
              prompt: "Fill in the blank with prime, composite, or neither: The number 1 is ______ for our lesson’s definitions.",
              hint: "Neither bucket in this chapter—special case.",
              solution: "Neither (special case: not prime, not composite).",
            },
          },
        },
        {
          id: "s3",
          title: "Showing a composite with one witness",
          body: [
            "To prove a number is composite, you only need one honest factor—not 1, not the number itself. That single division success busts the prime myth.",
            "Worked example: Is 51 prime? Try small buddies. 51 ÷ 3 = 17 with no remainder. Boom—composite, because 3 × 17 = 51.",
            "This is like catching someone with two different keys to the same lock; one extra key is enough proof.",
            "Worked example: 39 ÷ 3 = 13, so 39 is composite even before you check anything else.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture proving someone owns two bikes. You only need to see the second bike once—you do not need a whole parking garage. For composite numbers, one honest factor besides 1 and the number itself is enough proof.",
              "That factor is your witness that the number can split further.",
            ],
            erroneousExample: [
              "Noah says: ‘35 is prime because I cannot see a factor in the first two seconds.’",
              "Spot the mistake: slow down and test—35 = 5 × 7, so 35 is composite.",
            ],
            practice: {
              prompt: "Name one factor of 34 (besides 1 and 34) or explain why you think there is not one.",
              hint: "Test 2: is 34 even?",
              solution: "2 works: 34 ÷ 2 = 17, so 34 is composite with witness 2 (also 17).",
            },
          },
        },
        {
          id: "s4",
          title: "Divisibility detective work",
          body: [
            "Small primes are your first suspects: test 2 (even?), easy 3 trick (digit sum divisible by 3?), 5 (ends in 0 or 5?). They are clues, not cheats—always tie back to actual division.",
            "Worked example: 58 ends in an even digit, so 2 divides it: 58 = 2 × 29. That proves 58 is composite instantly.",
            "If nothing small works, you think harder or use a systematic search—but for class-sized numbers the small suspects usually crack the case.",
            "Worked example: 91 looks prime-ish, but 7 × 13 = 91 reveals it is composite.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "You are a detective with three quick clues: even numbers wear the 2 hat; digit sums divisible by 3 mean 3 might fit; numbers ending in 0 or 5 cozy up to 5. Clues speed up hunting, but division still closes the case.",
              "They are hints from patterns, not magic guesses—every ‘guilty’ factor still has to pass a real divide check.",
            ],
            erroneousExample: [
              "Priya says: ‘58 must be prime because its digit sum is 13 and 13 sounds prime.’",
              "Spot the mistake: 58 is even, so 2 divides it—58 = 2 × 29—composite.",
            ],
            practice: {
              prompt: "Use one clue (even, digit sum for 3, or ending digit for 5) to show 75 is composite—then name one factor.",
              hint: "What does 75 end with?",
              solution:
                "Ends in 5, so 5 is a factor (75 ÷ 5 = 15); 75 = 5 × 15.",
            },
          },
        },
        {
          id: "s5",
          title: "The only even prime",
          body: [
            "Two is the superhero even prime. Every other even number invites 2 to the factor party, so they cannot be prime.",
            "Worked example: 2’s factors are 1 and 2 only—prime. 4 invites 2 because 2 × 2 = 4—composite.",
            "Remembering this saves time: if a number is even and bigger than 2, you already have a composite witness.",
            "Worked example: 106 is even and not 2, so 2 is a factor—106 is composite.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture a bike with two wheels—that is the number 2, still prime. Every other even number has a built-in pair of wheels: you can always split off a 2, so they cannot be prime.",
              "So 2 is the only even prime—it is the odd duck that works differently.",
            ],
            erroneousExample: [
              "Marcus says: ‘4 is prime because it is small and only uses the times table I like.’",
              "Spot the mistake: 4 = 2 × 2, so it has extra factors—composite, not prime.",
            ],
            practice: {
              prompt: "Why is 14 not prime? Answer in one short sentence.",
              hint: "Even and bigger than 2 means what factor is automatic?",
              solution:
                "14 is even and greater than 2, so 2 is a factor (14 = 2 × 7)—more than two factors overall.",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt: "Is 51 prime or composite? Give a factor other than 1 and 51.",
          hint: "Try small primes.",
          solution: "Composite: 51 = 3 × 17.",
        },
        {
          prompt: "Why can 9 be composite while 7 stays prime, using a story about sharing?",
          hint: "Can you split 9 into same-size whole groups besides 1×9?",
          solution:
            "9 can be 3 × 3, so it has an extra factor. 7 only splits as 1 × 7 with whole numbers, so it stays prime.",
        },
      ],
      quiz: [
        {
          id: "l3q1",
          conceptId: "prime_composite",
          prompt: "Which is prime?",
          options: [
            { id: "a", label: "1" },
            { id: "b", label: "29" },
            { id: "c", label: "39" },
          ],
          hints: {
            pointing:
              "Remember: 1 is a special case. Check whether the other choices split into smaller whole factors besides 1 and themselves.",
            teaching:
              "Prime means exactly two factors: 1 and the number. If you can find 3 × something or 2 × something, it is not prime.",
            bottomOut:
              "39 = 3 × 13, so 39 is out. 29 does not break apart that way—pick that one.",
          },
          correctOptionId: "b",
          rationale: "29 has only factors 1 and 29. 39 = 3 × 13. 1 is not prime by definition.",
        },
        {
          id: "l3q2",
          conceptId: "prime_composite",
          prompt: "Why is 1 neither prime nor composite?",
          options: [
            {
              id: "a",
              label: "Because it is negative",
            },
            {
              id: "b",
              label: "Because it does not fit the prime/composite definitions used for numbers > 1",
            },
            { id: "c", label: "Because it has infinitely many factors" },
          ],
          hints: {
            pointing:
              "Flip back to how the lesson defined prime and composite—which numbers do those definitions talk about?",
            teaching:
              "Primes and composites are defined for whole numbers greater than 1, so 1 does not get either label—it is its own special case.",
            bottomOut:
              "Pick the answer that says 1 does not match the rules that start ‘for numbers bigger than 1.’",
          },
          correctOptionId: "b",
          rationale: "Standard definitions are stated for whole numbers greater than 1.",
        },
      ],
    },
    {
      id: "l4",
      slug: "prime-factorization",
      title: "Prime Factorization & Factor Trees",
      shortTitle: "Prime factorization",
      order: 4,
      conceptId: "prime_factorization",
      learningObjectives: [
        "Break a composite number into a product of primes (use exponents when primes repeat).",
        "Explain, in your own words, why different trees still land on the same primes for one starting number.",
        "Draw a factor tree until every branch ends at a prime “leaf.”",
      ],
      vocabulary: [
        {
          term: "Prime factorization",
          definition:
            "A recipe showing how to rebuild a number by multiplying only primes, like 72 = 2 × 2 × 2 × 3 × 3.",
        },
        {
          term: "Factor tree",
          definition:
            "A branching picture: start with your number, split it into factors, repeat until the ends are all prime.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "Tree branches, playground style",
          body: [
            "Picture climbing a tree: at the trunk is your big number. Each branch splits into two factors you choose. Keep splitting any composite branch until every twig ends at a prime—which cannot branch further.",
            "Worked example: Start with 30. Split 30 into 5 × 6. The 5 branch is prime—done. Split 6 into 2 × 3—both prime. Leaves: 5, 2, 3. Multiply them: 2 × 3 × 5 still equals 30.",
            "You are allowed to pick different first splits; the tree shape changes but the prime “fruit” at the ends should match.",
            "Worked example: Split 30 as 3 × 10 first instead. Ten becomes 2 × 5. Leaves again: 3, 2, 5—same primes, different climb path.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Imagine a river that splits into two smaller rivers, and each smaller river splits again until every stream is a tiny ‘prime creek’ that cannot split anymore. The big number is your starting river; cracks are factors; prime creeks are the ends.",
              "You can choose where the first split happens—the water still comes from the same mountain.",
            ],
            erroneousExample: [
              "Elena stops her tree at 6 for 30 and says ‘6 is a leaf because I like 6.’",
              "Spot the mistake: 6 is composite—it splits to 2 × 3. Leaves must be prime.",
            ],
            practice: {
              prompt: "Start 30 as 5 × 6. Break 6 into primes only. List the prime ‘leaves’ you get.",
              hint: "6 breaks into 2 and 3; 5 stays prime.",
              solution: "Leaves: 5, 2, 3 (same primes as any correct tree for 30).",
            },
          },
        },
        {
          id: "s2",
          title: "Different trees, same prime fruit",
          body: [
            "If everyone in class draws a different tree for 84, you might argue about the doodles but not about the primes at the bottom. That shared answer is why prime factorization is trustworthy.",
            "Worked example: 84 → 7 × 12, then 12 → 3 × 4, then 4 → 2 × 2. Leaves: 7, 3, 2, 2. Alternatively 84 → 2 × 42 → 2 × 21 → 3 × 7. Leaves: 2, 2, 3, 7—the same multiset.",
            "Think of it like shaking a puzzle box: the pieces look jumbled, but the set of pieces stays constant.",
            "Worked example: For 60, any correct tree ends with three 2s, one 3, and one 5 when you count leaves with multiplicity.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "You and a friend each shake a puzzle box differently—loud and quiet shakes—but when you pour out the pieces, you find the same shapes every time. Prime factorization is like that: messy paths, same prime ‘pieces’ at the end.",
              "So arguments about doodles are fine; arguing about the final primes is not—those should match.",
            ],
            erroneousExample: [
              "Two students claim 84 has different prime sets—one lists 2,2,3,7 and another says ‘I got 4,3,7 from a shortcut.’",
              "Spot the mistake: 4 is not allowed in the final list—4 still splits to 2×2, so the primes must be 2,2,3,7.",
            ],
            practice: {
              prompt: "Without drawing, list the prime leaves (with repeats) you expect from 10 if you split all the way. Check by multiplying.",
              hint: "10 = 2 × 5, both prime.",
              solution: "Leaves: 2 and 5; multiply to check: 2 × 5 = 10.",
            },
          },
        },
        {
          id: "s3",
          title: "Exponent shorthand for repeats",
          body: [
            "Writing 2 × 2 × 2 gets tired. Exponents pack repeats neatly: 2³ means three copies of 2 multiplied.",
            "Worked example: 72 = 2 × 2 × 2 × 3 × 3 becomes 2³ × 3². You still see every prime; the superscripts just count copies.",
            "Exponents are like saying “three spicy 2 chips and two mild 3 chips” on your number sandwich.",
            "Worked example: 81 = 3 × 3 × 3 × 3 = 3⁴ because four threes multiply.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of packing snacks: writing 2×2×2 is three identical juice boxes stacked. An exponent is a sticky note on the stack that says ‘3 high.’ It is shorthand, not a new flavor—still all 2s multiplied.",
              "Big exponent = many repeats of the same prime teammate.",
            ],
            erroneousExample: [
              "Vik says: ‘2³ means 2 × 3, because there is a little 3.’",
              "Spot the mistake: 2³ means 2 × 2 × 2 = 8, not 2 × 3.",
            ],
            practice: {
              prompt: "Write 5 × 5 × 5 using a base and exponent (power form).",
              hint: "Three copies of the same factor.",
              solution: "5³ (five cubed).",
            },
          },
        },
        {
          id: "s4",
          title: "Rebuilding to check yourself",
          body: [
            "After you collect primes, multiply them back in any order you like—associative and commutative laws mean order is your friend, not a trap.",
            "Worked example: Check 2³ × 3²: 2³ = 8, 3² = 9, and 8 × 9 = 72. That matches where you started if your tree was for 72.",
            "If your rebuild overshoots or falls short, either a prime was miscounted or a branch stopped too early.",
            "Worked example: Claim: 50 = 2 × 3² × 5. Multiply: 2 × 9 × 5 = 90—too big. Go back—you sneaked an extra factor.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "After you unload groceries, put them back on the counter in any order—still the same snack haul. Multiplying primes in different orders is allowed; if the product matches your starting number, your factorization passes the snack audit.",
              "If the product is too big or small, something sneaked into the bag—a stray factor or a missing one.",
            ],
            erroneousExample: [
              "Kim rebuilds 2² × 3 and gets 18 instead of 12, then says ‘close enough.’",
              "Spot the mistake: check carefully—2² × 3 = 4 × 3 = 12. If you get 18, you used the wrong exponents or numbers.",
            ],
            practice: {
              prompt: "Multiply 2³ × 3 without a calculator and say what starting number a correct factor tree should rebuild.",
              hint: "2³ is 8.",
              solution: "8 × 3 = 24, so the tree should rebuild 24.",
            },
          },
        },
        {
          id: "s5",
          title: "Split choices that keep you moving",
          body: [
            "Stuck choosing a split? Start with the smallest prime that divides your number—it keeps branches shallow and calm.",
            "Worked example: For 126, note it is even: divide by 2 to get 63. Then 63 is 7 × 9, and 9 is 3 × 3. Clean leaves: 2, 7, 3, 3 → 2 × 3² × 7.",
            "If you dislike trees, repeated division works too: peel out factors like pulling layers off an onion.",
            "Worked example: 100 ÷ 2 = 50, ÷2 = 25, then ÷5 = 5, ÷5 = 1. You peeled two 2s and two 5s: 2² × 5².",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture peeling layers off an onion: if the number is even, peel a 2. If not, try the next small prime. Each peel reveals a smaller inside number until you reach 1—collect every peel label and you have your prime recipe.",
              "Trees and peeling are the same story with different art styles.",
            ],
            erroneousExample: [
              "Nate peels 18 by dividing only by 6 once and writes ‘prime factorization is just 6 × 3’ and stops.",
              "Spot the mistake: 6 is not prime—keep going: 18 = 2 × 3 × 3 (or 2 × 3²).",
            ],
            practice: {
              prompt: "Peel 12 down to primes using repeated division: divide by the smallest prime that works until you hit 1. Write the prime factorization with exponents if needed.",
              hint: "Start: 12 ÷ 2 = 6.",
              solution: "12 ÷ 2 = 6, 6 ÷ 2 = 3, 3 ÷ 3 = 1 → 2² × 3.",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt: "Write the prime factorization of 84 using exponents.",
          hint: "Divide out 2s, then 3, then 7.",
          solution: "84 = 2² × 3 × 7.",
        },
        {
          prompt:
            "Draw one factor tree for 30 and list the prime leaves. Then multiply them to rebuild 30.",
          hint: "Any split is fine if you end at primes.",
          solution: "Example tree: 30 → 6 × 5 → (2 × 3) × 5. Leaves 2, 3, 5 multiply to 30.",
        },
      ],
      quiz: [
        {
          id: "l4q1",
          conceptId: "prime_factorization",
          prompt: "Which expression is a correct prime factorization of 45?",
          options: [
            { id: "a", label: "9 × 5" },
            { id: "b", label: "3² × 5" },
            { id: "c", label: "15 × 3" },
          ],
          hints: {
            pointing:
              "Read the question carefully: it says prime factorization—every piece left at the end must be prime.",
            teaching:
              "Break 45 into primes only. 45 = 9 × 5, but 9 still splits into 3 × 3, so you should see threes and a five.",
            bottomOut:
              "You want two 3s and one 5, written with an exponent on the 3—that matches the answer with 3 squared times 5.",
          },
          correctOptionId: "b",
          rationale: "9 and 15 are not prime. 3² × 5 uses only primes.",
        },
        {
          id: "l4q2",
          conceptId: "prime_factorization",
          prompt:
            "The prime factorization of 72 includes which prime base with the largest exponent in this factorization?",
          options: [
            { id: "a", label: "2 (with exponent 3)" },
            { id: "b", label: "3 (with exponent 2)" },
            { id: "c", label: "5" },
          ],
          hints: {
            pointing:
              "Factor 72 into primes, or recall 72 = 8 × 9 and then break 8 and 9 into primes.",
            teaching:
              "Compare exponents after you write 72 as 2³ × 3²—whichever prime has the bigger superscript wins this question.",
            bottomOut:
              "The three 2s beat the two 3s, so the prime with the largest exponent is 2 cubed—that answer choice.",
          },
          correctOptionId: "a",
          rationale: "72 = 2³ × 3²; exponent on 2 is 3, on 3 is 2.",
        },
      ],
    },
    {
      id: "l5",
      slug: "gcf-and-lcm",
      title: "Greatest Common Factor & Least Common Multiple",
      shortTitle: "GCF & LCM",
      order: 5,
      conceptId: "gcf_lcm",
      learningObjectives: [
        "Find the GCF of two numbers with prime factor pictures (shared primes, smallest exponents).",
        "Find the LCM using primes that appear (take the bigger exponent each time).",
        "Tell a short story that uses GCF vs LCM in real life.",
      ],
      vocabulary: [
        {
          term: "GCF",
          definition:
            "The biggest whole number that is a factor of both numbers—your largest fair split that works for everyone.",
        },
        {
          term: "LCM",
          definition:
            "The smallest positive whole number that is a multiple of both—where two repeating cycles first line up again.",
        },
      ],
      sections: [
        {
          id: "s1",
          title: "GCF: the biggest shared slice",
          body: [
            "Imagine two sub sandwiches, 24 inches and 36 inches. You want identical kid-size pieces cut from BOTH without leftovers. The longest possible whole-inch piece is the GCF—think “max chunk that measures both.”",
            "Worked example: GCF(24, 36). List common factors: 1, 2, 3, 4, 6, 12. The greatest is 12—your mega-slice.",
            "GCF always lives at or below the smaller number—you cannot cut a 20-inch template from an 18-inch ribbon.",
            "Worked example: GCF(18, 24) is 6, because 6 is the biggest number dividing both evenly.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Two choirs learn the same short dance. One line has 24 students, another has 36. You want the biggest possible mini-teams with the same team size in BOTH lines, nobody left out. That team size is the GCF—think ‘largest matching chunk that works everywhere.’",
              "It is never bigger than the smaller line, because you cannot split a snack you do not have.",
            ],
            erroneousExample: [
              "Rosa says: ‘GCF(24, 36) is 36 because 36 is the larger number.’",
              "Spot the mistake: 36 does not divide 24. The GCF has to divide both—12 is the biggest that works.",
            ],
            practice: {
              prompt: "Find GCF(12, 16)—the largest whole number that divides both with no remainder.",
              hint: "Try common factors: 1, 2, 4… pick the greatest.",
              solution: "Common factors include 1, 2, 4; greatest is 4.",
            },
          },
        },
        {
          id: "s2",
          title: "LCM: when two beats sync",
          body: [
            "One friend taps every 4 beats, another every 6 beats. The LCM is the first beat where their taps crash together again—12 in this tiny concert.",
            "Worked example: Multiples of 4: 4, 8, 12, 16, … Multiples of 6: 6, 12, 18, … First shared hit: 12, so LCM(4, 6) = 12.",
            "LCM is never smaller than the larger original number—expect a meeting point out in multiple land.",
            "Worked example: LCM(10, 15) is 30, which is bigger than both—normal for cycling problems.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "One light blinks every 4 seconds, another every 6 seconds. You wait for both to flash together again. The first shared moment after zero is the LCM—like the first time two repeating songs hit the same beat.",
              "It can be larger than either original timing, because you are waiting for a double coincidence.",
            ],
            erroneousExample: [
              "Ty says: ‘LCM(4, 6) must be 4 because 4 is smaller.’",
              "Spot the mistake: 4 is not a multiple of 6. The first common hit is 12.",
            ],
            practice: {
              prompt: "List the first four multiples of 3 and of 4. What is the smallest number that appears in both lists?",
              hint: "Multiples of 3: 3, 6, 9, 12… Multiples of 4: 4, 8, 12…",
              solution: "LCM is 12 (first shared positive multiple).",
            },
          },
        },
        {
          id: "s3",
          title: "Prime grid showdown",
          body: [
            "Line up prime factorizations like ingredient stations. For GCF, take primes that show up in BOTH recipes, using the smaller exponent each time. For LCM, take every prime you see, using the larger exponent each time.",
            "Worked example setup: 24 = 2³ × 3¹ and 60 = 2² × 3¹ × 5¹. Shared primes: 2 and 3. Pick min exponents: 2² and 3¹ → GCF = 4 × 3 = 12.",
            "For the LCM on the same pair: grab 2³ (max of 3 and 2), 3¹ (tie), and 5¹ (only in 60) → 8 × 3 × 5 = 120.",
            "Drawing two columns helps your eyes—circle matches for GCF, scoop everything for LCM.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Picture two smoothie recipes on sticky notes. For GCF, you only steal ingredients that appear on BOTH notes, and if an ingredient repeats fewer times on one note, you take the smaller repeat count. For LCM, you borrow every ingredient from either note, but when both lists disagree on repeats, you take the bigger repeat count.",
              "It is pantry sharing vs. party shopping—two moods, same prime stickers.",
            ],
            erroneousExample: [
              "For GCF, Jade circles every prime from both numbers and multiplies them all together.",
              "Spot the mistake: that is more like LCM thinking. GCF uses only shared primes with the smaller exponent each time.",
            ],
            practice: {
              prompt: "Use the stories: for GCF do you usually multiply shared primes with the smaller or bigger exponent each time?",
              hint: "GCF is the overlap—take the weaker repeat.",
              solution: "Smaller exponent on each shared prime (the minimum).",
            },
          },
        },
        {
          id: "s4",
          title: "Walk through 18 and 24",
          body: [
            "Factor: 18 = 2 × 3² and 24 = 2³ × 3. For GCF: lowest exponent on 2 is 1, on 3 is 1 → 2 × 3 = 6.",
            "Worked example continued: LCM needs max exponents: 2³ × 3² = 8 × 9 = 72.",
            "Quick reality check: GCF times LCM should equal 18 × 24 when you calculate carefully—handy calculator for errors.",
            "Worked example check: 6 × 72 = 432 and 18 × 24 = 432. Matches—nice.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Think of 18 as one tall stack of blocks and 24 as another stack. The GCF is the biggest block size that measures BOTH stacks cleanly—the shared ruler. The LCM is how tall a tower gets if you repeat each stack until both towers first match height.",
              "Walking 18 and 24 is practice holding both ideas in your hands at once.",
            ],
            erroneousExample: [
              "After prime work, Ben claims GCF(18, 24) = 72 because ‘72 feels like both numbers smooshed.’",
              "Spot the mistake: GCF must divide both—72 does not divide 18. The lesson walk gives 6.",
            ],
            practice: {
              prompt: "For 18 = 2 × 3² and 24 = 2³ × 3, what is GCF? (Multiply shared primes using the smaller exponent each time.)",
              hint: "Share 2 and 3; take 2¹ and 3¹.",
              solution: "2 × 3 = 6.",
            },
          },
        },
        {
          id: "s5",
          title: "The GCF × LCM handshake",
          body: [
            "For two positive buddies a and b: GCF(a, b) × LCM(a, b) = a × b. It is like saying the shared part times the synced cycle rebuilds the product world.",
            "Worked example: Use a = 10, b = 15. GCF = 5, LCM = 30, product 5 × 30 = 150, and 10 × 15 = 150 too.",
            "Use this when you trust one answer more than the other—you can cross-check.",
            "Worked example: If you know GCF(8,12) = 4 and product is 96, LCM must be 96 ÷ 4 = 24.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Two friends high-five. One hand is the GCF, the other is the LCM, and clapping them together rebuilds the product of the two starting numbers (for positive whole numbers you meet in class).",
              "If you trust one answer more, multiply and divide to cross-check the other—like balancing a seesaw.",
            ],
            erroneousExample: [
              "For 8 and 12, Chen multiplies GCF × LCM and gets 48, then insists ‘the rule failed.’",
              "Spot the mistake: redo the parts—GCF(8,12)=4, LCM=24, and 4×24=96 which equals 8×12.",
            ],
            practice: {
              prompt: "If GCF(6, 15) = 3 and 6 × 15 = 90, what must LCM(6, 15) be? Use the handshake idea.",
              hint: "Divide the product by the GCF.",
              solution: "90 ÷ 3 = 30, so LCM is 30.",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt: "Find GCF(18, 24) and LCM(18, 24).",
          hint: "18 = 2 × 3²; 24 = 2³ × 3.",
          solution: "GCF = 2 × 3 = 6. LCM = 2³ × 3² = 72.",
        },
        {
          prompt:
            "Explain in one sentence why LCM(4,10) is not 4, using a “beat” or “schedule” story.",
          hint: "Multiples of 10 skip past 4 quickly.",
          solution:
            "4 is not a multiple of 10, so the first common landing must be larger—20 fits both 4 and 10.",
        },
      ],
      quiz: [
        {
          id: "l5q1",
          conceptId: "gcf_lcm",
          prompt: "GCF(12, 18) equals:",
          options: [
            { id: "a", label: "6" },
            { id: "b", label: "36" },
            { id: "c", label: "3" },
          ],
          hints: {
            pointing:
              "GCF means the biggest number that divides both 12 and 18 without leftovers.",
            teaching:
              "List factors they share: 1, 2, 3, … then pick the largest one that works for both.",
            bottomOut:
              "Both 12 and 18 are in the 6 times table (6×2 and 6×3), and nothing larger than 6 divides both—choose 6.",
          },
          correctOptionId: "a",
          rationale: "Common factors: 1,2,3,6 — greatest is 6.",
        },
        {
          id: "l5q2",
          conceptId: "gcf_lcm",
          prompt: "LCM(4, 10) equals:",
          options: [
            { id: "a", label: "2" },
            { id: "b", label: "20" },
            { id: "c", label: "40" },
          ],
          hints: {
            pointing:
              "LCM hunts for the first time both ‘count-by’ lists bump into the same number.",
            teaching:
              "Count by 4s and by 10s until you see the same total show up in both lists—the smallest match wins.",
            bottomOut:
              "4, 8, 12, 16, 20 meets 10, 20 at twenty—that is smaller than 40, so pick twenty.",
          },
          correctOptionId: "b",
          rationale: "Multiples of 4: 4,8,12,16,20,… Multiples of 10: 10,20,… Smallest common is 20.",
        },
      ],
    },
    {
      id: "l6",
      slug: "using-structure-in-problems",
      title: "Using Structure in Problems",
      shortTitle: "Applications",
      order: 6,
      conceptId: "applications",
      learningObjectives: [
        "Pick GCF or LCM based on whether you split evenly or wait for a repeat.",
        "Explain your reasoning in a short, friendly sentence.",
      ],
      vocabulary: [],
      sections: [
        {
          id: "s1",
          title: "Splitters vs timers",
          body: [
            "Ask yourself: “Am I cutting or grouping into equal biggest shares?” That is GCF energy. Or “When do two repeating patterns first match?” That is LCM energy.",
            "Worked example: Cut two ropes (24 m and 36 m) into the longest equal whole-meter pieces. That screams GCF—12 m pieces because GCF(24,36)=12.",
            "If your answer is tinier than both starting numbers, suspect GCF. If it is bigger than at least one, suspect LCM.",
            "Worked example: Buses every 12 and 18 minutes lining up—LCM(12,18)=36 minutes for the next together departure.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "Pretend one job is splitting a watermelon into the biggest equal wedges for two different picnics—same wedge size must work at both tables (GCF vibe). Another job is finding when two repeating alarms on your watch buzz at the same second (LCM vibe).",
              "Ask: am I chopping fairly, or waiting for a repeat?",
            ],
            erroneousExample: [
              "Zoe sees ‘bus schedules’ and always picks GCF because ‘factors feel safer.’",
              "Spot the mistake: ‘next time together’ after zero is the first shared multiple—usually LCM, not GCF.",
            ],
            practice: {
              prompt: "Word bite: ‘longest equal pieces cut from two ropes’—in one word, is that usually GCF or LCM thinking?",
              hint: "Biggest chunk dividing both lengths evenly.",
              solution: "GCF (greatest common factor / shared split).",
            },
          },
        },
        {
          id: "s2",
          title: "Tiling and square patches",
          body: [
            "You cover a rectangle floor with the largest possible square tiles—no gaps, same tile size for both length and width—that tile side is the GCF of the side lengths (measured in the same units).",
            "Worked example: Room pieces 16 ft by 40 ft. GCF(16,40)=8, so 8-foot square tiles are the biggest that fit both dimensions evenly.",
            "If the story says “largest same-size group using everything,” translate to GCF before crunching numbers.",
            "Worked example: 48 pencils and 60 crayons into identical bags using all supplies—bags are GCF(48,60)=12.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "You cover a bedroom floor with square stickers—no gaps, same sticker size for the whole job. The biggest sticker that fits the length and width evenly comes from the GCF of those side lengths in the same units.",
              "If the story says ‘biggest matching square,’ think GCF before you grind big multiples.",
            ],
            erroneousExample: [
              "Ray chooses LCM of the room sides to pick the tile size, hoping ‘bigger number means bigger tile.’",
              "Spot the mistake: LCM grows for syncing repeats; tile size must divide both sides—use GCF.",
            ],
            practice: {
              prompt: "A rectangle is 12 ft by 18 ft. What side length (in whole feet) is the largest square tile that divides both sides evenly?",
              hint: "GCF(12, 18).",
              solution: "6 feet (GCF = 6).",
            },
          },
        },
        {
          id: "s3",
          title: "Schedules that finally match",
          body: [
            "Repeating bells, video game events, bus loops—LCM finds the first reunion time after time zero.",
            "Worked example: Practice A every 5 days, Practice B every 9 days starting same Monday. LCM(5,9)=45 days until both land on the same day again (first time).",
            "Read carefully: “next time together” almost always means LCM, not adding the two periods.",
            "Worked example: Splash fountain every 6 minutes, light show every 15 minutes—LCM(6,15)=30 minutes.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "One friend visits every 5 days, another every 9 days after the same kickoff day. You mark X’s on a calendar until two visits fall on the same day again—that first double mark is the LCM day count.",
              "You are not adding 5 and 9; you are hunting the first overlap in two skip-count songs.",
            ],
            erroneousExample: [
              "Sasha answers LCM(5, 9) by doing 5 + 9 = 14 ‘because both are involved.’",
              "Spot the mistake: add is wrong here; the first common positive multiple of 5 and 9 is 45.",
            ],
            practice: {
              prompt: "Hot dogs come in packs of 8 and buns in packs of 10. What is the smallest number of packs you need so hot dogs and buns can match one-for-one? (Hint: LCM of 8 and 10.)",
              hint: "Find LCM(8,10)—that is the matching count; then divide by 8 and by 10 for packs.",
              solution: "LCM = 40; 5 packs of dogs, 4 packs of buns.",
            },
          },
        },
        {
          id: "s4",
          title: "Party bags and leftovers sanity check",
          body: [
            "If a problem wants no leftovers when you pack both items, the group size must divide both totals—GCF gives the largest workable group count.",
            "Worked example: 48 party straws and 72 stickers per identical bag: GCF(48,72)=24 bags max with equal counts.",
            "After solving, imagine physically packing—does your number of bags make sense? If you somehow got more bags than items, redo.",
            "Worked example: A bogus answer of 240 bags for 48 pencils means each bag has a fraction of a pencil—impossible.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "You fill treat bags with two kinds of loot—stickers and tattoos—and every bag must be identical with no orphans left on the table. The number of bags must divide both totals; the biggest honest bag count is the GCF story.",
              "After you calculate, imagine really doing the job: weird answers usually mean a plan that leaves half a sticker behind.",
            ],
            erroneousExample: [
              "With 48 straws and 72 stickers, Myles claims 100 identical bags because ‘big classes need big numbers.’",
              "Spot the mistake: 48 ÷ 100 is not a whole count per bag. Use a divisor that works for both totals—GCF(48,72)=24 bags is sensible.",
            ],
            practice: {
              prompt: "You pack 30 markers and 45 gems into identical bags using everything, same counts in each bag. Can you make 7 bags? Answer yes or no with one reason.",
              hint: "Does 7 divide both 30 and 45 evenly?",
              solution:
                "No—7 does not divide 30 (or 45) evenly, so identical full bags fail.",
            },
          },
        },
        {
          id: "s5",
          title: "Quick vibe checks",
          body: [
            "Multiply GCF and LCM mentally when you have both originals—does it equal the product of the two numbers? If not, revisit.",
            "Worked example: For 8 and 12, GCF=4, LCM=24, product check 4×24 = 96 and 8×12 = 96—good vibes.",
            "Also check units: minutes with minutes, feet with feet—don’t mix miles and sandwiches.",
            "Worked example: If a problem mixes inches and feet, convert first; structure tricks only work when measurements match.",
          ],
          remedialBody: {
            alternativeExplanation: [
              "After you solve, be a friendly coach: does your answer match the story size—timers in minutes, tiles in feet, not elephants in minutes? Also, if you have GCF and LCM for the same pair, multiplying them should recreate the product of the two originals when your work is consistent.",
              "Tiny sense-checks catch wild calculator typos before they become homework yetis.",
            ],
            erroneousExample: [
              "Lara writes GCF(8, 12) = 24 and LCM(8, 12) = 4.",
              "Spot the mistake: she swapped them—24 does not divide both 8 and 12. The GCF is 4 and the LCM is 24.",
            ],
            practice: {
              prompt: "Quick check: GCF(8, 12) = 4 and LCM(8, 12) = 24. Does 4 × 24 equal 8 × 12?",
              hint: "Multiply both sides.",
              solution: "Yes: 4 × 24 = 96 and 8 × 12 = 96.",
            },
          },
        },
      ],
      guidedPractice: [
        {
          prompt:
            "Two ropes are 24 m and 36 m. You cut equal segments as large as possible using whole meters. How long is each segment?",
          hint: "Largest segment length dividing both: GCF.",
          solution: "GCF(24,36)=12. Each segment is 12 m.",
        },
        {
          prompt:
            "Lily waters plants every 4 days and Leo every 10 days, starting today. After how many days will they both water on the same day again?",
          hint: "First common multiple after day 0: LCM.",
          solution: "LCM(4,10)=20 days.",
        },
      ],
      quiz: [
        {
          id: "l6q1",
          conceptId: "applications",
          prompt:
            "Bus A returns every 12 minutes and Bus B every 18 minutes. If both leave now, after how many minutes will they next leave together?",
          options: [
            { id: "a", label: "6 minutes (GCF)" },
            { id: "b", label: "36 minutes (LCM)" },
            { id: "c", label: "216 minutes" },
          ],
          hints: {
            pointing:
              "Buses that repeat on a timer usually need the idea about ‘when do both schedules land together,’ not the biggest shared chunk.",
            teaching:
              "List multiples of 12 and 18 (or use the LCM shortcut you practiced) to find the first time after zero.",
            bottomOut:
              "Thirty-six is the first number that is both a multiple of 12 and 18—pick the LCM answer for thirty-six minutes.",
          },
          correctOptionId: "b",
          rationale: "You want the first common multiple: LCM(12,18)=36.",
        },
        {
          id: "l6q2",
          conceptId: "applications",
          prompt: "Which situation most likely requires GCF?",
          options: [
            { id: "a", label: "Finding the first time two periodic events align" },
            { id: "b", label: "Tiling a floor with the largest possible square tiles" },
            { id: "c", label: "Listing multiples of 7" },
          ],
          hints: {
            pointing:
              "Ask: am I splitting something into the biggest matching pieces, or waiting for two cycles to meet?",
            teaching:
              "Largest square tiles on a rectangle floor mean you need the biggest length that measures both sides evenly—that is GCF-style thinking.",
            bottomOut:
              "Tiling with the biggest possible squares lines up with ‘largest shared factor’—not the bus-schedule LCM story.",
          },
          correctOptionId: "b",
          rationale:
            "Largest square tile for both dimensions uses GCF of side lengths (in consistent units).",
        },
      ],
    },
  ],
  unitAssessment: {
    id: "unit-a",
    title: "Prime Time — Unit Check",
    questions: [
      {
        id: "ua1",
        conceptId: "factor_pairs",
        prompt: "All factor pairs of 20 are:",
        options: [
          { id: "a", label: "(1,20), (2,10), (4,5)" },
          { id: "b", label: "(1,20), (3,7)" },
          { id: "c", label: "(2,10), (4,6)" },
        ],
        hints: {
          pointing:
            "Work from small factors: what times what makes 20? Check each answer choice with multiplication.",
          teaching:
            "A factor pair must multiply to exactly 20—test 3×7, 4×6, and the pairs listed in each option.",
          bottomOut:
            "1×20, 2×10, and 4×5 all work; 3×7 and 4×6 do not make 20—the first list is the winner.",
        },
        correctOptionId: "a",
        rationale: "20 = 1×20 = 2×10 = 4×5.",
      },
      {
        id: "ua2",
        conceptId: "prime_composite",
        prompt: "Which is composite?",
        options: [
          { id: "a", label: "17" },
          { id: "b", label: "23" },
          { id: "c", label: "91" },
        ],
        hints: {
          pointing:
            "Composite means you can find a factor besides 1 and the number itself—try small primes.",
          teaching:
            "Test 17 and 23 for hidden factors; if one number fails those tests, try 7 on what is left.",
          bottomOut:
            "91 breaks as 7 × 13, so the two-digit one that looks innocent is actually composite—pick 91.",
        },
        correctOptionId: "c",
        rationale: "91 = 7 × 13.",
      },
      {
        id: "ua3",
        conceptId: "prime_factorization",
        prompt: "Prime factorization of 126 is:",
        options: [
          { id: "a", label: "2 × 3² × 7" },
          { id: "b", label: "2 × 63" },
          { id: "c", label: "9 × 14" },
        ],
        hints: {
          pointing:
            "Prime factorization uses only primes—with exponents if a prime repeats.",
          teaching:
            "63, 9, and 14 still hide small primes; peel until every factor is prime.",
          bottomOut:
            "126 is even (a 2), the rest becomes 63 = 7 × 9, and 9 is 3²—so you want 2 × 3² × 7.",
        },
        correctOptionId: "a",
        rationale: "126 = 2 × 63 = 2 × 7 × 9 = 2 × 3² × 7.",
      },
      {
        id: "ua4",
        conceptId: "gcf_lcm",
        prompt: "GCF(30, 42) =",
        options: [
          { id: "a", label: "6" },
          { id: "b", label: "210" },
          { id: "c", label: "14" },
        ],
        hints: {
          pointing:
            "GCF is the biggest number you can divide into both 30 and 42 evenly.",
          teaching:
            "List shared factors—both sit in the 2 and 3 times tables—or match primes: both have a 2 and a 3.",
          bottomOut:
            "Share a 2 and a 3, but not a 5 vs 7 conflict—multiply 2 × 3 to get six.",
        },
        correctOptionId: "a",
        rationale: "30 = 2×3×5; 42 = 2×3×7; GCF = 2×3 = 6.",
      },
      {
        id: "ua5",
        conceptId: "gcf_lcm",
        prompt: "LCM(8, 12) =",
        options: [
          { id: "a", label: "24" },
          { id: "b", label: "96" },
          { id: "c", label: "4" },
        ],
        hints: {
          pointing:
            "LCM is the smallest number that is on both the count-by-8 list and the count-by-12 list.",
          teaching:
            "8 = 2³ and 12 = 2² × 3—take the bigger power of 2 and the 3 from 12, then multiply.",
          bottomOut:
            "2³ × 3 makes twenty-four, which is the first shared multiple—not 4 (too small) or 96 (skips the first meeting).",
        },
        correctOptionId: "a",
        rationale: "8 = 2³; 12 = 2²×3; LCM = 2³×3 = 24.",
      },
      {
        id: "ua6",
        conceptId: "applications",
        prompt:
          "You pack 48 pencils and 60 crayons into identical bags with the same counts in each bag, using all supplies. What is the greatest number of bags possible?",
        options: [
          { id: "a", label: "12 bags (GCF)" },
          { id: "b", label: "240 bags" },
          { id: "c", label: "2 bags" },
        ],
        hints: {
          pointing:
            "You need the same number of pencils per bag and the same number of crayons per bag, using everything—think biggest batch count that divides both totals.",
          teaching:
            "Greatest number of identical bags means take the GCF of 48 and 60 so both supplies split evenly.",
          bottomOut:
            "Twelve divides both 48 and 60 (four pencils and five crayons each bag)—choose the twelve-bag answer.",
        },
        correctOptionId: "a",
        rationale: "GCF(48,60)=12 maximizes the number of equal groups.",
      },
    ],
  },
};
