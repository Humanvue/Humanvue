// Built-in question bank. Each question has one right answer and three wrong
// ones; the game shuffles them. Friends' own questions live in TriviaStore.
window.TRIVIA_CATEGORIES = [
  { id: 'military', name: 'Military' },
  { id: 'nursing', name: 'Nursing & Health' },
  { id: 'science', name: 'Science' },
  { id: 'pop', name: 'Pop Culture' },
  { id: 'sports', name: 'Sports' },
  { id: 'geo', name: 'Geography' }
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
  { id: 'g8', category: 'geo', q: 'Which U.S. state is known as the Lone Star State?', answer: 'Texas', wrong: ['Alaska', 'Arizona', 'Montana'] }
];
