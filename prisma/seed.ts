import prisma from "@/libs/prisma";

const universities = [
  // USA - DREAM Schools
  {
    name: "Massachusetts Institute of Technology",
    country: "USA",
    city: "Cambridge",
    ranking: 1,
    tuition: 55000,
    acceptanceRate: 0.04,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "AI/ML",
      "Mathematics",
    ],
  },
  {
    name: "Stanford University",
    country: "USA",
    city: "Stanford",
    ranking: 2,
    tuition: 57000,
    acceptanceRate: 0.04,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "AI/ML",
      "Data Science",
    ],
  },
  {
    name: "Carnegie Mellon University",
    country: "USA",
    city: "Pittsburgh",
    ranking: 3,
    tuition: 59000,
    acceptanceRate: 0.15,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "Robotics",
      "AI/ML",
    ],
  },
  {
    name: "University of California, Berkeley",
    country: "USA",
    city: "Berkeley",
    ranking: 4,
    tuition: 45000,
    acceptanceRate: 0.16,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "Data Science",
      "Mathematics",
    ],
  },
  {
    name: "California Institute of Technology",
    country: "USA",
    city: "Pasadena",
    ranking: 6,
    tuition: 56000,
    acceptanceRate: 0.03,
    programs: ["Engineering", "Computer Science", "Physics", "Mathematics"],
  },

  // USA - TARGET Schools
  {
    name: "Georgia Institute of Technology",
    country: "USA",
    city: "Atlanta",
    ranking: 15,
    tuition: 35000,
    acceptanceRate: 0.23,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "Cybersecurity",
    ],
  },
  {
    name: "University of Texas at Austin",
    country: "USA",
    city: "Austin",
    ranking: 18,
    tuition: 38000,
    acceptanceRate: 0.31,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University of Washington",
    country: "USA",
    city: "Seattle",
    ranking: 20,
    tuition: 40000,
    acceptanceRate: 0.48,
    programs: ["Computer Science", "Engineering", "Data Science", "AI/ML"],
  },
  {
    name: "University of California, San Diego",
    country: "USA",
    city: "San Diego",
    ranking: 22,
    tuition: 42000,
    acceptanceRate: 0.37,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "Bioinformatics",
    ],
  },
  {
    name: "University of Southern California",
    country: "USA",
    city: "Los Angeles",
    ranking: 25,
    tuition: 54000,
    acceptanceRate: 0.16,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "New York University",
    country: "USA",
    city: "New York",
    ranking: 30,
    tuition: 53000,
    acceptanceRate: 0.21,
    programs: ["Computer Science", "Business", "Data Science", "AI/ML"],
  },
  {
    name: "Northeastern University",
    country: "USA",
    city: "Boston",
    ranking: 35,
    tuition: 42000,
    acceptanceRate: 0.2,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },

  // USA - SAFE Schools
  {
    name: "Arizona State University",
    country: "USA",
    city: "Tempe",
    ranking: 50,
    tuition: 28000,
    acceptanceRate: 0.88,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University of Illinois Chicago",
    country: "USA",
    city: "Chicago",
    ranking: 55,
    tuition: 32000,
    acceptanceRate: 0.73,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University of Arizona",
    country: "USA",
    city: "Tucson",
    ranking: 60,
    tuition: 30000,
    acceptanceRate: 0.85,
    programs: ["Computer Science", "Engineering", "Data Science"],
  },
  {
    name: "San Jose State University",
    country: "USA",
    city: "San Jose",
    ranking: 80,
    tuition: 18000,
    acceptanceRate: 0.67,
    programs: ["Computer Science", "Engineering", "Business"],
  },

  // UK - DREAM Schools
  {
    name: "University of Oxford",
    country: "UK",
    city: "Oxford",
    ranking: 5,
    tuition: 35000,
    acceptanceRate: 0.17,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "Mathematics",
      "AI/ML",
    ],
  },
  {
    name: "University of Cambridge",
    country: "UK",
    city: "Cambridge",
    ranking: 7,
    tuition: 36000,
    acceptanceRate: 0.21,
    programs: ["Computer Science", "Engineering", "Mathematics", "Physics"],
  },
  {
    name: "Imperial College London",
    country: "UK",
    city: "London",
    ranking: 9,
    tuition: 38000,
    acceptanceRate: 0.14,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "Business",
      "AI/ML",
    ],
  },

  // UK - TARGET Schools
  {
    name: "University College London",
    country: "UK",
    city: "London",
    ranking: 10,
    tuition: 32000,
    acceptanceRate: 0.48,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University of Edinburgh",
    country: "UK",
    city: "Edinburgh",
    ranking: 16,
    tuition: 28000,
    acceptanceRate: 0.4,
    programs: ["Computer Science", "Engineering", "AI/ML", "Data Science"],
  },
  {
    name: "King's College London",
    country: "UK",
    city: "London",
    ranking: 25,
    tuition: 30000,
    acceptanceRate: 0.49,
    programs: ["Computer Science", "Business", "Data Science", "Engineering"],
  },
  {
    name: "University of Manchester",
    country: "UK",
    city: "Manchester",
    ranking: 27,
    tuition: 26000,
    acceptanceRate: 0.56,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },

  // UK - SAFE Schools
  {
    name: "University of Warwick",
    country: "UK",
    city: "Coventry",
    ranking: 30,
    tuition: 27000,
    acceptanceRate: 0.55,
    programs: ["Computer Science", "Business", "Data Science", "Engineering"],
  },
  {
    name: "University of Bristol",
    country: "UK",
    city: "Bristol",
    ranking: 40,
    tuition: 25000,
    acceptanceRate: 0.6,
    programs: ["Computer Science", "Engineering", "Data Science"],
  },

  // Canada - TARGET Schools
  {
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    ranking: 12,
    tuition: 32000,
    acceptanceRate: 0.43,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "AI/ML",
      "Data Science",
    ],
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    city: "Vancouver",
    ranking: 14,
    tuition: 28000,
    acceptanceRate: 0.52,
    programs: ["Computer Science", "Engineering", "Data Science", "Business"],
  },
  {
    name: "McGill University",
    country: "Canada",
    city: "Montreal",
    ranking: 19,
    tuition: 25000,
    acceptanceRate: 0.46,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University of Waterloo",
    country: "Canada",
    city: "Waterloo",
    ranking: 22,
    tuition: 30000,
    acceptanceRate: 0.53,
    programs: [
      "Computer Science",
      "Engineering",
      "Data Science",
      "Mathematics",
    ],
  },

  // Canada - SAFE Schools
  {
    name: "University of Alberta",
    country: "Canada",
    city: "Edmonton",
    ranking: 35,
    tuition: 22000,
    acceptanceRate: 0.58,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "Simon Fraser University",
    country: "Canada",
    city: "Burnaby",
    ranking: 40,
    tuition: 20000,
    acceptanceRate: 0.59,
    programs: ["Computer Science", "Engineering", "Business"],
  },

  // Australia - TARGET Schools
  {
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    ranking: 17,
    tuition: 35000,
    acceptanceRate: 0.7,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "Australian National University",
    country: "Australia",
    city: "Canberra",
    ranking: 21,
    tuition: 33000,
    acceptanceRate: 0.65,
    programs: ["Computer Science", "Engineering", "Data Science", "AI/ML"],
  },
  {
    name: "University of Sydney",
    country: "Australia",
    city: "Sydney",
    ranking: 23,
    tuition: 36000,
    acceptanceRate: 0.72,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },

  // Australia - SAFE Schools
  {
    name: "University of Queensland",
    country: "Australia",
    city: "Brisbane",
    ranking: 28,
    tuition: 32000,
    acceptanceRate: 0.68,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "Monash University",
    country: "Australia",
    city: "Melbourne",
    ranking: 32,
    tuition: 30000,
    acceptanceRate: 0.75,
    programs: ["Computer Science", "Engineering", "Data Science", "Business"],
  },

  // Germany - SAFE Schools (Low/No Tuition)
  {
    name: "Technical University of Munich",
    country: "Germany",
    city: "Munich",
    ranking: 24,
    tuition: 0,
    acceptanceRate: 0.08,
    programs: ["Computer Science", "Engineering", "Data Science", "AI/ML"],
  },
  {
    name: "RWTH Aachen University",
    country: "Germany",
    city: "Aachen",
    ranking: 29,
    tuition: 0,
    acceptanceRate: 0.1,
    programs: ["Computer Science", "Engineering", "Mechanical Engineering"],
  },

  // Netherlands - TARGET Schools
  {
    name: "Delft University of Technology",
    country: "Netherlands",
    city: "Delft",
    ranking: 26,
    tuition: 18000,
    acceptanceRate: 0.5,
    programs: ["Computer Science", "Engineering", "Data Science", "AI/ML"],
  },
  {
    name: "University of Amsterdam",
    country: "Netherlands",
    city: "Amsterdam",
    ranking: 31,
    tuition: 16000,
    acceptanceRate: 0.53,
    programs: ["Computer Science", "Business", "Data Science", "AI/ML"],
  },

  // Singapore - DREAM Schools
  {
    name: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    ranking: 8,
    tuition: 30000,
    acceptanceRate: 0.05,
    programs: [
      "Computer Science",
      "Engineering",
      "Business",
      "Data Science",
      "AI/ML",
    ],
  },
  {
    name: "Nanyang Technological University",
    country: "Singapore",
    city: "Singapore",
    ranking: 11,
    tuition: 28000,
    acceptanceRate: 0.09,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },

  // Ireland - SAFE Schools
  {
    name: "Trinity College Dublin",
    country: "Ireland",
    city: "Dublin",
    ranking: 36,
    tuition: 22000,
    acceptanceRate: 0.35,
    programs: ["Computer Science", "Engineering", "Business", "Data Science"],
  },
  {
    name: "University College Dublin",
    country: "Ireland",
    city: "Dublin",
    ranking: 42,
    tuition: 20000,
    acceptanceRate: 0.4,
    programs: ["Computer Science", "Business", "Data Science", "Engineering"],
  },
];

async function main() {
  console.log("🌱 Start seeding universities...");

  // Clear existing universities
  await prisma.university.deleteMany({});
  console.log("🗑️  Cleared existing universities");

  // Seed universities
  for (const university of universities) {
    await prisma.university.create({
      data: university,
    });
  }

  console.log(`✅ Seeded ${universities.length} universities`);
  console.log("✨ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
