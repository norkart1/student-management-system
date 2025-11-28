import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

const firstNames = [
  "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia", "James", 
  "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte", "Elijah", "Amelia",
  "Lucas", "Harper", "Mason", "Evelyn", "Logan", "Aria", "Alexander", 
  "Luna", "Ethan", "Chloe"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", 
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
  "Lee", "Perez", "Thompson", "White", "Harris"
];

const subjects = [
  "Mathematics", "English Literature", "Physics", "Chemistry", "Biology",
  "History", "Geography", "Computer Science", "Art", "Music", "Physical Education",
  "Economics", "Psychology", "Philosophy", "Foreign Languages"
];

const bookTitles = [
  "Introduction to Calculus", "World History: A Comprehensive Guide",
  "Chemistry Fundamentals", "Physics for Beginners", "English Grammar Mastery",
  "Biology: The Science of Life", "Computer Programming 101", "Art History",
  "Music Theory Basics", "Economics Principles", "Psychology: Mind and Behavior",
  "Advanced Mathematics", "Literature Through the Ages", "Geography of the World",
  "Philosophy: An Introduction", "Data Structures and Algorithms",
  "Organic Chemistry", "Modern Physics", "Creative Writing", "Statistics Essentials",
  "Environmental Science", "Political Science", "Sociology Basics",
  "Business Management", "Public Speaking Skills"
];

const authors = [
  "Dr. Sarah Mitchell", "Prof. John Anderson", "Emily Clarke", "Michael Roberts",
  "Dr. Lisa Wang", "James Thompson", "Dr. Robert Lee", "Amanda Foster",
  "Prof. David Kim", "Catherine Bell", "Dr. Mark Stevens", "Jennifer Adams"
];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmail(firstName: string, lastName: string, domain: string): string {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

function generatePhone(): string {
  return `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
}

function generateISBN(): string {
  return `978-${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9)}`;
}

function generateStudents(count: number) {
  const students = [];
  const usedEmails = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    let email = generateEmail(firstName, lastName, "student.school.edu");
    
    while (usedEmails.has(email)) {
      email = generateEmail(firstName + Math.floor(Math.random() * 99), lastName, "student.school.edu");
    }
    usedEmails.add(email);
    
    const enrollmentYear = 2020 + Math.floor(Math.random() * 5);
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    
    students.push({
      firstName,
      lastName,
      email,
      phone: generatePhone(),
      grade: `${Math.floor(Math.random() * 4) + 9}th`,
      enrollmentYear,
      createdAt,
      updatedAt: createdAt
    });
  }
  
  return students;
}

function generateTeachers(count: number) {
  const teachers = [];
  const usedEmails = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    let email = generateEmail(firstName, lastName, "school.edu");
    
    while (usedEmails.has(email)) {
      email = generateEmail(firstName + Math.floor(Math.random() * 99), lastName, "school.edu");
    }
    usedEmails.add(email);
    
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    
    teachers.push({
      firstName,
      lastName,
      email,
      phone: generatePhone(),
      subject: getRandomElement(subjects),
      createdAt,
      updatedAt: createdAt
    });
  }
  
  return teachers;
}

function generateBooks(count: number) {
  const books = [];
  const usedISBNs = new Set<string>();
  const usedTitles = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let title = getRandomElement(bookTitles);
    while (usedTitles.has(title) && usedTitles.size < bookTitles.length) {
      title = getRandomElement(bookTitles);
    }
    if (usedTitles.has(title)) {
      title = `${title} - Volume ${i + 1}`;
    }
    usedTitles.add(title);
    
    let isbn = generateISBN();
    while (usedISBNs.has(isbn)) {
      isbn = generateISBN();
    }
    usedISBNs.add(isbn);
    
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000));
    
    books.push({
      title,
      author: getRandomElement(authors),
      isbn,
      quantity: Math.floor(Math.random() * 50) + 1,
      category: getRandomElement(subjects),
      createdAt,
      updatedAt: createdAt
    });
  }
  
  return books;
}

async function seedDatabase() {
  console.log("Connecting to MongoDB...");
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db();
    console.log("Connected successfully!");
    
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    if (!collectionNames.includes("students")) {
      await db.createCollection("students");
      await db.collection("students").createIndex({ email: 1 });
    }
    if (!collectionNames.includes("teachers")) {
      await db.createCollection("teachers");
      await db.collection("teachers").createIndex({ email: 1 });
    }
    if (!collectionNames.includes("books")) {
      await db.createCollection("books");
      await db.collection("books").createIndex({ isbn: 1 });
    }
    
    console.log("\nClearing existing data...");
    await db.collection("students").deleteMany({});
    await db.collection("teachers").deleteMany({});
    await db.collection("books").deleteMany({});
    
    console.log("\nGenerating mock data...");
    const students = generateStudents(25);
    const teachers = generateTeachers(25);
    const books = generateBooks(25);
    
    console.log("Inserting 25 students...");
    await db.collection("students").insertMany(students);
    
    console.log("Inserting 25 teachers...");
    await db.collection("teachers").insertMany(teachers);
    
    console.log("Inserting 25 books...");
    await db.collection("books").insertMany(books);
    
    console.log("\n✅ Successfully seeded database with:");
    console.log(`   - 25 students`);
    console.log(`   - 25 teachers`);
    console.log(`   - 25 books`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("\nDatabase connection closed.");
  }
}

seedDatabase();
