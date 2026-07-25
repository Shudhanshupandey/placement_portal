import { companyLogo } from "@/data/mock/company-logos";
import { daysAgo } from "@/data/mock/mock-time";

/**
 * Recruiting companies.
 *
 * `features/companies` has no service or model yet, so the shape below is a
 * development fixture rather than a production contract — it deliberately
 * mirrors the fields `PlacementDrive` already carries (name, logo, location,
 * sector) so that promoting it to `types/models/company.ts` later is a move,
 * not a redesign.
 */
export interface MockCompany {
  id: string;
  name: string;
  logoUrl: string;
  sector: string;
  website: string;
  headquarters: string;
  size: string;
  about: string;
  /** Drives run at SAITM to date. */
  drivesCount: number;
  studentsHired: number;
  highestPackageLpa: number;
  averagePackageLpa: number;
  tier: "Tier 1" | "Tier 2" | "Tier 3";
  status: "active" | "inactive";
  onboardedAtMs: number;
}

export const MOCK_COMPANIES: MockCompany[] = [
  {
    id: "cmp-infosys",
    name: "Infosys",
    logoUrl: companyLogo("Infosys", 0),
    sector: "IT Services & Consulting",
    website: "https://www.infosys.com",
    headquarters: "Bengaluru, Karnataka",
    size: "300,000+ employees",
    about:
      "Global leader in next-generation digital services and consulting. Recruits SAITM students annually for its Systems Engineer and Digital Specialist tracks.",
    drivesCount: 6,
    studentsHired: 84,
    highestPackageLpa: 9.5,
    averagePackageLpa: 4.8,
    tier: "Tier 2",
    status: "active",
    onboardedAtMs: daysAgo(920),
  },
  {
    id: "cmp-tcs",
    name: "Tata Consultancy Services",
    logoUrl: companyLogo("Tata Consultancy Services", 1),
    sector: "IT Services & Consulting",
    website: "https://www.tcs.com",
    headquarters: "Mumbai, Maharashtra",
    size: "600,000+ employees",
    about:
      "India's largest IT services organisation. Conducts the National Qualifier Test on campus and hires across Ninja and Digital cadres.",
    drivesCount: 8,
    studentsHired: 112,
    highestPackageLpa: 11.5,
    averagePackageLpa: 4.2,
    tier: "Tier 2",
    status: "active",
    onboardedAtMs: daysAgo(1180),
  },
  {
    id: "cmp-zoho",
    name: "Zoho Corporation",
    logoUrl: companyLogo("Zoho Corporation", 3),
    sector: "Product · SaaS",
    website: "https://www.zoho.com",
    headquarters: "Chennai, Tamil Nadu",
    size: "15,000+ employees",
    about:
      "Bootstrapped SaaS product company building a 55+ application suite. Known for a rigorous multi-round programming assessment.",
    drivesCount: 3,
    studentsHired: 19,
    highestPackageLpa: 14,
    averagePackageLpa: 8.5,
    tier: "Tier 1",
    status: "active",
    onboardedAtMs: daysAgo(610),
  },
  {
    id: "cmp-deloitte",
    name: "Deloitte India",
    logoUrl: companyLogo("Deloitte India", 2),
    sector: "Consulting & Audit",
    website: "https://www2.deloitte.com/in",
    headquarters: "Gurugram, Haryana",
    size: "100,000+ employees",
    about:
      "Professional services network hiring analysts into its Technology & Transformation and Risk Advisory practices.",
    drivesCount: 4,
    studentsHired: 31,
    highestPackageLpa: 12,
    averagePackageLpa: 7.2,
    tier: "Tier 1",
    status: "active",
    onboardedAtMs: daysAgo(430),
  },
  {
    id: "cmp-hcltech",
    name: "HCLTech",
    logoUrl: companyLogo("HCLTech", 4),
    sector: "IT Services",
    website: "https://www.hcltech.com",
    headquarters: "Noida, Uttar Pradesh",
    size: "220,000+ employees",
    about:
      "Technology services company recruiting for cloud, infrastructure and application engineering roles from the NCR campus pool.",
    drivesCount: 5,
    studentsHired: 67,
    highestPackageLpa: 8,
    averagePackageLpa: 4.5,
    tier: "Tier 2",
    status: "active",
    onboardedAtMs: daysAgo(740),
  },
  {
    id: "cmp-maruti",
    name: "Maruti Suzuki",
    logoUrl: companyLogo("Maruti Suzuki", 5),
    sector: "Automotive Manufacturing",
    website: "https://www.marutisuzuki.com",
    headquarters: "Gurugram, Haryana",
    size: "40,000+ employees",
    about:
      "India's largest passenger-vehicle manufacturer. Recruits Mechanical and Electrical engineers into its Manesar and Gurugram plants.",
    drivesCount: 4,
    studentsHired: 38,
    highestPackageLpa: 9,
    averagePackageLpa: 5.6,
    tier: "Tier 1",
    status: "active",
    onboardedAtMs: daysAgo(560),
  },
  {
    id: "cmp-demo",
    name: "Demo Company Pvt Ltd",
    logoUrl: companyLogo("Demo Company Pvt Ltd", 1),
    sector: "Product Engineering",
    website: "https://demo-company.example.com",
    headquarters: "Gurugram, Haryana",
    size: "500–1,000 employees",
    about:
      "The company bound to the development recruiter account. Used to exercise the recruiter workspace end-to-end.",
    drivesCount: 2,
    studentsHired: 7,
    highestPackageLpa: 10,
    averagePackageLpa: 6.5,
    tier: "Tier 2",
    status: "active",
    onboardedAtMs: daysAgo(120),
  },
  {
    id: "cmp-wipro",
    name: "Wipro",
    logoUrl: companyLogo("Wipro", 0),
    sector: "IT Services",
    website: "https://www.wipro.com",
    headquarters: "Bengaluru, Karnataka",
    size: "250,000+ employees",
    about:
      "Global information-technology and consulting company. Hires through the Elite National Talent Hunt.",
    drivesCount: 5,
    studentsHired: 58,
    highestPackageLpa: 6.5,
    averagePackageLpa: 3.8,
    tier: "Tier 3",
    status: "inactive",
    onboardedAtMs: daysAgo(1010),
  },
];

export function findMockCompany(id: string): MockCompany | undefined {
  return MOCK_COMPANIES.find((c) => c.id === id);
}
