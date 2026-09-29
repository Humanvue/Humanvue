// Built-in question bank. Each question has one right answer and three wrong
// ones; the game shuffles them. Friends' own questions live in TriviaStore.
window.TRIVIA_CATEGORIES = [
  { id: 'military', name: 'Military' },
  { id: 'nursing', name: 'Nursing & Health' },
  { id: 'science', name: 'Science' },
  { id: 'pop', name: 'Pop Culture' },
  { id: 'sports', name: 'Sports' },
  { id: 'geo', name: 'Geography' },
  { id: 'politics', name: 'Politics' },
  { id: 'ushistory', name: 'American History' },
  { id: 'worldhistory', name: 'World History' },
  { id: 'philosophy', name: 'Philosophy' },
  { id: 'film', name: 'Film & TV' },
  { id: 'lit', name: 'Literature' },
  { id: 'auto', name: 'Automotive' }
];

window.TRIVIA_QUESTIONS = [
  // Military
  { id: 'm1', category: 'military', q: 'What is the motto of the U.S. Marine Corps?', answer: 'Semper Fidelis', wrong: ['This We\'ll Defend', 'Semper Paratus', 'Aim High'] },
  { id: 'm2', category: 'military', q: 'In the NATO phonetic alphabet, which word stands for the letter Q?', answer: 'Quebec', wrong: ['Queen', 'Quartz', 'Quest'] },
  { id: 'm3', category: 'military', q: 'In what year did the D-Day landings in Normandy take place?', answer: '1944', wrong: ['1942', '1943', '1945'] },
  { id: 'm4', category: 'military', q: 'Which is the newest branch of the U.S. Armed Forces?', answer: 'Space Force', wrong: ['Coast Guard', 'Air Force', 'Cyber Command'] },
  { id: 'm5', category: 'military', q: 'What does AWOL stand for?', answer: 'Absent Without Leave', wrong: ['Away With Official Leave', 'Absent While On Liberty', 'Active Watch On Line'] },
  { id: 'm6', category: 'military', q: 'In military time, what is 1900?', answer: '7:00 PM', wrong: ['9:00 PM', '7:00 AM', '1:00 PM'] },
  { id: 'm7', category: 'military', q: 'A single gold bar is the insignia for which U.S. Army rank?', answer: 'Second Lieutenant', wrong: ['First Lieutenant', 'Captain', 'Warrant Officer 1'] },
  { id: 'm8', category: 'military', q: 'The U.S. Military Academy is located at which place?', answer: 'West Point, NY', wrong: ['Annapolis, MD', 'Colorado Springs, CO', 'Fort Liberty, NC'] },
  { id: 'm9', category: 'military', q: 'How many sides does the Pentagon building have?', answer: '5', wrong: ['4', '6', '8'] },
  { id: 'm10', category: 'military', q: 'What does the military abbreviation MRE stand for?', answer: 'Meal, Ready-to-Eat', wrong: ['Mobile Ration Equipment', 'Main Rations, Emergency', 'Meal Replacement Entree'] },

  // Nursing & Health
  { id: 'n1', category: 'nursing', q: 'What is the normal resting heart rate range for an adult?', answer: '60 to 100 bpm', wrong: ['40 to 60 bpm', '100 to 140 bpm', '80 to 120 bpm'] },
  { id: 'n2', category: 'nursing', q: 'Which blood type is the universal red cell donor?', answer: 'O negative', wrong: ['AB positive', 'O positive', 'A negative'] },
  { id: 'n3', category: 'nursing', q: 'What is the largest organ of the human body?', answer: 'Skin', wrong: ['Liver', 'Lungs', 'Brain'] },
  { id: 'n4', category: 'nursing', q: 'What is a normal adult respiratory rate at rest?', answer: '12 to 20 breaths/min', wrong: ['6 to 10 breaths/min', '20 to 30 breaths/min', '30 to 40 breaths/min'] },
  { id: 'n5', category: 'nursing', q: 'In the RACE fire-safety acronym, what does the R stand for?', answer: 'Rescue', wrong: ['Report', 'Run', 'Remove'] },
  { id: 'n6', category: 'nursing', q: 'Which vitamin is essential for blood clotting?', answer: 'Vitamin K', wrong: ['Vitamin C', 'Vitamin D', 'Vitamin B12'] },
  { id: 'n7', category: 'nursing', q: 'What does the order NPO mean?', answer: 'Nothing by mouth', wrong: ['No pain orders', 'Nurse per order', 'Not previously observed'] },
  { id: 'n8', category: 'nursing', q: 'How many bones are in the adult human body?', answer: '206', wrong: ['186', '212', '300'] },
  { id: 'n9', category: 'nursing', q: 'What is the normal serum potassium range for an adult?', answer: '3.5 to 5.0 mEq/L', wrong: ['1.5 to 2.5 mEq/L', '135 to 145 mEq/L', '8.5 to 10.5 mEq/L'] },
  { id: 'n10', category: 'nursing', q: 'What is the lowest possible score on the Glasgow Coma Scale?', answer: '3', wrong: ['0', '1', '5'] },

  // Science
  { id: 's1', category: 'science', q: 'What is the chemical symbol for gold?', answer: 'Au', wrong: ['Ag', 'Gd', 'Go'] },
  { id: 's2', category: 'science', q: 'Which planet is known as the Red Planet?', answer: 'Mars', wrong: ['Venus', 'Jupiter', 'Mercury'] },
  { id: 's3', category: 'science', q: 'Which gas do plants absorb from the air for photosynthesis?', answer: 'Carbon dioxide', wrong: ['Oxygen', 'Nitrogen', 'Hydrogen'] },
  { id: 's4', category: 'science', q: 'At sea level, water boils at what temperature in Fahrenheit?', answer: '212°F', wrong: ['100°F', '180°F', '232°F'] },
  { id: 's5', category: 'science', q: 'What is the hardest natural substance?', answer: 'Diamond', wrong: ['Quartz', 'Granite', 'Titanium'] },
  { id: 's6', category: 'science', q: 'How many planets are in our solar system?', answer: '8', wrong: ['7', '9', '10'] },
  { id: 's7', category: 'science', q: 'Which part of the cell is called its powerhouse?', answer: 'Mitochondria', wrong: ['Nucleus', 'Ribosome', 'Golgi apparatus'] },
  { id: 's8', category: 'science', q: 'Roughly how fast does light travel?', answer: '300,000 km per second', wrong: ['30,000 km per second', '3,000 km per second', '3 million km per second'] },

  // Pop Culture
  { id: 'p1', category: 'pop', q: 'Which band recorded "Bohemian Rhapsody"?', answer: 'Queen', wrong: ['The Beatles', 'Led Zeppelin', 'The Rolling Stones'] },
  { id: 'p2', category: 'pop', q: 'In The Office (US), which company does Michael Scott work for?', answer: 'Dunder Mifflin', wrong: ['Vance Refrigeration', 'Initech', 'Sabre Corp.'] },
  { id: 'p3', category: 'pop', q: 'Which movie made the line "I\'ll be back" famous?', answer: 'The Terminator', wrong: ['Rambo', 'Die Hard', 'Predator'] },
  { id: 'p4', category: 'pop', q: 'Who played Tony Stark in the Marvel movies?', answer: 'Robert Downey Jr.', wrong: ['Chris Evans', 'Chris Hemsworth', 'Mark Ruffalo'] },
  { id: 'p5', category: 'pop', q: 'What is the name of the coffee shop in Friends?', answer: 'Central Perk', wrong: ['The Daily Grind', 'Java Joe\'s', 'MacLaren\'s'] },
  { id: 'p6', category: 'pop', q: 'Lightning McQueen is the star of which Pixar movie?', answer: 'Cars', wrong: ['Planes', 'Toy Story', 'Turbo'] },
  { id: 'p7', category: 'pop', q: 'Which school of witchcraft and wizardry does Harry Potter attend?', answer: 'Hogwarts', wrong: ['Durmstrang', 'Beauxbatons', 'Ilvermorny'] },
  { id: 'p8', category: 'pop', q: 'Which artist released the album "1989"?', answer: 'Taylor Swift', wrong: ['Adele', 'Katy Perry', 'Beyoncé'] },

  // Sports
  { id: 'sp1', category: 'sports', q: 'How many players does each soccer team have on the field?', answer: '11', wrong: ['9', '10', '12'] },
  { id: 'sp2', category: 'sports', q: 'In which sport does "love" mean a score of zero?', answer: 'Tennis', wrong: ['Golf', 'Cricket', 'Volleyball'] },
  { id: 'sp3', category: 'sports', q: 'How many points is a touchdown worth, before the extra point?', answer: '6', wrong: ['3', '7', '8'] },
  { id: 'sp4', category: 'sports', q: 'How often are the Summer Olympics held?', answer: 'Every 4 years', wrong: ['Every 2 years', 'Every 3 years', 'Every 5 years'] },
  { id: 'sp5', category: 'sports', q: 'Which country won the 2022 FIFA World Cup?', answer: 'Argentina', wrong: ['France', 'Brazil', 'Croatia'] },
  { id: 'sp6', category: 'sports', q: 'The Army–Navy Game is played in which sport?', answer: 'Football', wrong: ['Basketball', 'Lacrosse', 'Rugby'] },
  { id: 'sp7', category: 'sports', q: 'How many holes are on a standard full golf course?', answer: '18', wrong: ['9', '12', '24'] },
  { id: 'sp8', category: 'sports', q: 'In basketball, how many points is a made shot from beyond the arc?', answer: '3', wrong: ['2', '4', '1'] },

  // Geography
  { id: 'g1', category: 'geo', q: 'What is the capital of Australia?', answer: 'Canberra', wrong: ['Sydney', 'Melbourne', 'Perth'] },
  { id: 'g2', category: 'geo', q: 'Which is the largest ocean on Earth?', answer: 'Pacific', wrong: ['Atlantic', 'Indian', 'Arctic'] },
  { id: 'g3', category: 'geo', q: 'What is the capital of Canada?', answer: 'Ottawa', wrong: ['Toronto', 'Montreal', 'Vancouver'] },
  { id: 'g4', category: 'geo', q: 'The Sahara Desert is on which continent?', answer: 'Africa', wrong: ['Asia', 'Australia', 'South America'] },
  { id: 'g5', category: 'geo', q: 'What is the smallest country in the world by area?', answer: 'Vatican City', wrong: ['Monaco', 'San Marino', 'Liechtenstein'] },
  { id: 'g6', category: 'geo', q: 'Mount Everest sits on the border of Nepal and which country?', answer: 'China', wrong: ['India', 'Bhutan', 'Pakistan'] },
  { id: 'g7', category: 'geo', q: 'How many U.S. states are there?', answer: '50', wrong: ['48', '51', '52'] },
  { id: 'g8', category: 'geo', q: 'Which U.S. state is known as the Lone Star State?', answer: 'Texas', wrong: ['Alaska', 'Arizona', 'Montana'] },
  // Politics (U.S. civics, kept nonpartisan)
  { id: 'po1', category: 'politics', q: 'How many members are in the U.S. Senate?', answer: '100', wrong: ['50', '435', '538'] },
  { id: 'po2', category: 'politics', q: 'How long is one term for a U.S. senator?', answer: '6 years', wrong: ['2 years', '4 years', '8 years'] },
  { id: 'po3', category: 'politics', q: 'What is the minimum age to be President of the United States?', answer: '35', wrong: ['30', '40', '25'] },
  { id: 'po4', category: 'politics', q: 'How many justices sit on the U.S. Supreme Court?', answer: '9', wrong: ['7', '11', '12'] },
  { id: 'po5', category: 'politics', q: 'After the Vice President, who is next in the presidential line of succession?', answer: 'Speaker of the House', wrong: ['Secretary of State', 'Senate Majority Leader', 'Chief Justice'] },
  { id: 'po6', category: 'politics', q: 'Which constitutional amendment gave women the right to vote?', answer: '19th Amendment', wrong: ['15th Amendment', '21st Amendment', '26th Amendment'] },
  { id: 'po7', category: 'politics', q: 'How many electoral votes does a candidate need to win the presidency?', answer: '270', wrong: ['218', '300', '538'] },
  { id: 'po8', category: 'politics', q: 'What are the first ten amendments to the U.S. Constitution called?', answer: 'The Bill of Rights', wrong: ['The Articles of Confederation', 'The Federalist Papers', 'The Great Compromise'] },

  // American History
  { id: 'ah1', category: 'ushistory', q: 'Whose portrait is on the U.S. $50 bill?', answer: 'Ulysses S. Grant', wrong: ['Andrew Jackson', 'Alexander Hamilton', 'Benjamin Franklin'] },
  { id: 'ah2', category: 'ushistory', q: 'In 1803, the U.S. roughly doubled in size with which deal?', answer: 'The Louisiana Purchase', wrong: ['The Gadsden Purchase', 'The Alaska Purchase', 'The Treaty of Paris'] },
  { id: 'ah3', category: 'ushistory', q: 'In what year did Apollo 11 land on the Moon?', answer: '1969', wrong: ['1965', '1967', '1972'] },
  { id: 'ah4', category: 'ushistory', q: 'Which president delivered the Gettysburg Address?', answer: 'Abraham Lincoln', wrong: ['Ulysses S. Grant', 'Andrew Johnson', 'James Buchanan'] },
  { id: 'ah5', category: 'ushistory', q: 'Which was the last state admitted to the Union?', answer: 'Hawaii', wrong: ['Alaska', 'Arizona', 'New Mexico'] },
  { id: 'ah6', category: 'ushistory', q: 'Who was president during the Cuban Missile Crisis?', answer: 'John F. Kennedy', wrong: ['Dwight D. Eisenhower', 'Lyndon B. Johnson', 'Richard Nixon'] },
  { id: 'ah7', category: 'ushistory', q: 'Which president launched the New Deal?', answer: 'Franklin D. Roosevelt', wrong: ['Herbert Hoover', 'Harry S. Truman', 'Theodore Roosevelt'] },
  { id: 'ah8', category: 'ushistory', q: 'Which war was fought between the U.S. and Britain from 1812 to 1815?', answer: 'The War of 1812', wrong: ['The Revolutionary War', 'The French and Indian War', 'The Mexican-American War'] },

  // World History
  { id: 'wh1', category: 'worldhistory', q: 'In what year did the Berlin Wall fall?', answer: '1989', wrong: ['1985', '1991', '1993'] },
  { id: 'wh2', category: 'worldhistory', q: 'Who was the first woman to serve as Prime Minister of the United Kingdom?', answer: 'Margaret Thatcher', wrong: ['Theresa May', 'Queen Elizabeth II', 'Liz Truss'] },
  { id: 'wh3', category: 'worldhistory', q: 'Which civilization built Machu Picchu?', answer: 'The Inca', wrong: ['The Aztec', 'The Maya', 'The Olmec'] },
  { id: 'wh4', category: 'worldhistory', q: 'The Magna Carta was sealed in 1215 in which country?', answer: 'England', wrong: ['France', 'Scotland', 'Spain'] },
  { id: 'wh5', category: 'worldhistory', q: 'Who led the Soviet Union when it dissolved in 1991?', answer: 'Mikhail Gorbachev', wrong: ['Boris Yeltsin', 'Leonid Brezhnev', 'Vladimir Putin'] },
  { id: 'wh6', category: 'worldhistory', q: 'Nelson Mandela became president of which country in 1994?', answer: 'South Africa', wrong: ['Zimbabwe', 'Kenya', 'Namibia'] },
  { id: 'wh7', category: 'worldhistory', q: 'The Titanic sank in which year?', answer: '1912', wrong: ['1905', '1915', '1921'] },
  { id: 'wh8', category: 'worldhistory', q: 'Which empire built the Colosseum?', answer: 'The Roman Empire', wrong: ['The Greek Empire', 'The Ottoman Empire', 'The Byzantine Empire'] },

  // Philosophy
  { id: 'ph1', category: 'philosophy', q: 'Who wrote "The Republic"?', answer: 'Plato', wrong: ['Aristotle', 'Socrates', 'Cicero'] },
  { id: 'ph2', category: 'philosophy', q: 'Which philosopher said "I think, therefore I am"?', answer: 'René Descartes', wrong: ['John Locke', 'Immanuel Kant', 'Blaise Pascal'] },
  { id: 'ph3', category: 'philosophy', q: 'Who was Plato\'s teacher?', answer: 'Socrates', wrong: ['Aristotle', 'Pythagoras', 'Diogenes'] },
  { id: 'ph4', category: 'philosophy', q: 'Which philosopher wrote "Thus Spoke Zarathustra"?', answer: 'Friedrich Nietzsche', wrong: ['Søren Kierkegaard', 'Arthur Schopenhauer', 'Jean-Paul Sartre'] },
  { id: 'ph5', category: 'philosophy', q: 'Which Roman emperor wrote the Stoic classic "Meditations"?', answer: 'Marcus Aurelius', wrong: ['Julius Caesar', 'Nero', 'Augustus'] },
  { id: 'ph6', category: 'philosophy', q: 'Which philosopher wrote "Leviathan"?', answer: 'Thomas Hobbes', wrong: ['John Locke', 'Niccolò Machiavelli', 'David Hume'] },
  { id: 'ph7', category: 'philosophy', q: 'Which ancient Chinese text is the founding work of Taoism?', answer: 'Tao Te Ching', wrong: ['The Analects', 'The Art of War', 'The I Ching'] },
  { id: 'ph8', category: 'philosophy', q: 'Utilitarianism, "the greatest good for the greatest number," is most tied to which thinker?', answer: 'John Stuart Mill', wrong: ['Immanuel Kant', 'Friedrich Nietzsche', 'Thomas Aquinas'] },

  // Film & TV
  { id: 'f1', category: 'film', q: 'Which 1994 movie features the line "Life is like a box of chocolates"?', answer: 'Forrest Gump', wrong: ['The Shawshank Redemption', 'Pulp Fiction', 'The Lion King'] },
  { id: 'f2', category: 'film', q: 'Who directed "Jurassic Park" (1993)?', answer: 'Steven Spielberg', wrong: ['James Cameron', 'George Lucas', 'Ridley Scott'] },
  { id: 'f3', category: 'film', q: 'In "Breaking Bad," what subject does Walter White teach?', answer: 'Chemistry', wrong: ['Biology', 'Physics', 'Math'] },
  { id: 'f4', category: 'film', q: 'Which 1999 movie has a choice between a red pill and a blue pill?', answer: 'The Matrix', wrong: ['Fight Club', 'The Sixth Sense', 'Office Space'] },
  { id: 'f5', category: 'film', q: 'In "Seinfeld," what is Kramer\'s first name?', answer: 'Cosmo', wrong: ['Kenny', 'Newman', 'Stanley'] },
  { id: 'f6', category: 'film', q: 'Which movie won Best Picture at the 1998 Academy Awards?', answer: 'Titanic', wrong: ['Good Will Hunting', 'As Good as It Gets', 'L.A. Confidential'] },
  { id: 'f7', category: 'film', q: 'In "Back to the Future," how fast must the DeLorean go to time travel?', answer: '88 mph', wrong: ['55 mph', '100 mph', '121 mph'] },
  { id: 'f8', category: 'film', q: 'Which series is set in the fictional town of Hawkins, Indiana?', answer: 'Stranger Things', wrong: ['Twin Peaks', 'Riverdale', 'Parks and Recreation'] },

  // Literature
  { id: 'l1', category: 'lit', q: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee', wrong: ['John Steinbeck', 'Truman Capote', 'William Faulkner'] },
  { id: 'l2', category: 'lit', q: 'Who wrote the novel "1984"?', answer: 'George Orwell', wrong: ['Aldous Huxley', 'Ray Bradbury', 'H. G. Wells'] },
  { id: 'l3', category: 'lit', q: 'Which novel opens with "Call me Ishmael"?', answer: 'Moby-Dick', wrong: ['The Old Man and the Sea', 'Treasure Island', 'Robinson Crusoe'] },
  { id: 'l4', category: 'lit', q: 'Who wrote "The Great Gatsby"?', answer: 'F. Scott Fitzgerald', wrong: ['Ernest Hemingway', 'J. D. Salinger', 'Mark Twain'] },
  { id: 'l5', category: 'lit', q: 'What is the name of the heroine of "The Hunger Games"?', answer: 'Katniss Everdeen', wrong: ['Tris Prior', 'Hermione Granger', 'Primrose Everdeen'] },
  { id: 'l6', category: 'lit', q: 'Who wrote "The Old Man and the Sea"?', answer: 'Ernest Hemingway', wrong: ['Herman Melville', 'Jack London', 'John Steinbeck'] },
  { id: 'l7', category: 'lit', q: 'Which Stephen King novel features Pennywise the clown?', answer: 'It', wrong: ['The Shining', 'Carrie', 'Misery'] },
  { id: 'l8', category: 'lit', q: 'Who wrote "Pride and Prejudice"?', answer: 'Jane Austen', wrong: ['Charlotte Brontë', 'Emily Brontë', 'Mary Shelley'] },

  // Automotive
  { id: 'a1', category: 'auto', q: 'Which carmaker\'s logo is a prancing horse?', answer: 'Ferrari', wrong: ['Lamborghini', 'Maserati', 'Alfa Romeo'] },
  { id: 'a2', category: 'auto', q: 'Volvo was founded in which country?', answer: 'Sweden', wrong: ['Norway', 'Germany', 'Denmark'] },
  { id: 'a3', category: 'auto', q: 'In a car, what does ABS stand for?', answer: 'Anti-lock Braking System', wrong: ['Automatic Balance System', 'Active Brake Support', 'Axle Bearing Stabilizer'] },
  { id: 'a4', category: 'auto', q: 'The Corvette is made by which brand?', answer: 'Chevrolet', wrong: ['Ford', 'Dodge', 'Pontiac'] },
  { id: 'a5', category: 'auto', q: 'Which vehicle line has been the best-selling in the U.S. for decades?', answer: 'Ford F-Series', wrong: ['Toyota Camry', 'Chevrolet Silverado', 'Honda Civic'] },
  { id: 'a6', category: 'auto', q: 'What does a tachometer measure?', answer: 'Engine RPM', wrong: ['Vehicle speed', 'Oil pressure', 'Fuel level'] },
  { id: 'a7', category: 'auto', q: 'Which brand makes the Wrangler?', answer: 'Jeep', wrong: ['Land Rover', 'Toyota', 'Ford'] },
  { id: 'a8', category: 'auto', q: 'What does "V8" describe?', answer: 'Eight cylinders in a V shape', wrong: ['Eight valves per cylinder', 'An 8-speed transmission', 'An 8-liter engine'] }
];
