import { Level } from '@prisma/client'
import prisma from '../src/lib/db'

const companies = ['Google', 'Amazon', 'Meta', 'NVIDIA', 'TCS', 'Infosys', 'Uber', 'Atlassian']
const locations = ['Bengaluru', 'Hyderabad', 'Pune', 'Noida', 'San Francisco', 'Seattle', 'Remote']
const roles = ['Software Engineer', 'Backend Engineer', 'Frontend Engineer', 'Data Engineer', 'Full Stack Engineer']

const levels = [
  Level.L3, Level.L4, Level.L5, Level.L6,
  Level.Staff, Level.Principal,
  Level.SDE_I, Level.SDE_II, Level.SDE_III
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateSalaryRecord() {
  const company = getRandomItem(companies)
  const normalized_company = company.toLowerCase()
  const location = getRandomItem(locations)
  const role = getRandomItem(roles)
  const level_standardized = getRandomItem(levels)
  
  // Create somewhat realistic correlations
  let experience_years = 1;
  let baseMultiplier = 1;

  if (level_standardized === 'L3') {
    experience_years = getRandomInt(0, 2);
    baseMultiplier = 1;
  } else if (level_standardized === 'L4') {
    experience_years = getRandomInt(2, 5);
    baseMultiplier = 1.5;
  } else if (level_standardized === 'L5') {
    experience_years = getRandomInt(5, 8);
    baseMultiplier = 2.2;
  } else if (level_standardized === 'L6') {
    experience_years = getRandomInt(8, 12);
    baseMultiplier = 3.0;
  } else if (level_standardized === 'Staff' || level_standardized === 'SDE_III') {
    experience_years = getRandomInt(12, 16);
    baseMultiplier = 4.0;
  } else if (level_standardized === 'Principal') {
    experience_years = getRandomInt(16, 20);
    baseMultiplier = 5.0;
  }

  // Adjust for location (US vs India)
  const isUS = ['San Francisco', 'Seattle'].includes(location)
  const isIndia = ['Bengaluru', 'Hyderabad', 'Pune', 'Noida'].includes(location)
  
  // Base scales
  let base_salary = 0;
  let bonus = 0;
  let stock = 0;

  if (isUS || (location === 'Remote' && Math.random() > 0.5)) {
    base_salary = getRandomInt(100000, 150000) * baseMultiplier
    bonus = base_salary * (getRandomInt(10, 20) / 100)
    stock = base_salary * (getRandomInt(20, 100) / 100)
  } else {
    // India salaries in INR (using somewhat realistic numbers, e.g., 10 Lakhs = 1,000,000)
    base_salary = getRandomInt(800000, 1500000) * baseMultiplier
    bonus = base_salary * (getRandomInt(10, 20) / 100)
    stock = base_salary * (getRandomInt(10, 50) / 100)
  }

  // Rounding to nearest 1000
  base_salary = Math.round(base_salary / 1000) * 1000
  bonus = Math.round(bonus / 1000) * 1000
  stock = Math.round(stock / 1000) * 1000

  const total_compensation = base_salary + bonus + stock
  const confidence_score = Number((Math.random() * (1 - 0.5) + 0.5).toFixed(2))

  return {
    company,
    normalized_company,
    role,
    level_standardized,
    location,
    experience_years,
    base_salary,
    bonus,
    stock,
    total_compensation,
    confidence_score
  }
}

async function main() {
  console.log('Starting seed...')
  await prisma.salary.deleteMany({}) // Clear existing data

  const records = Array.from({ length: 50 }, generateSalaryRecord)
  
  for (const record of records) {
    await prisma.salary.create({
      data: record
    })
  }

  console.log('Seed completed successfully. Inserted 50 records.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
