{
  /*********** Personal Information data *********/
}
export const petOptions = [
  "dog",
  "cat",
  "fish",
  "rabbit",
  "bird",
  "snake",
  "other",
];

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-Binary" },
  { value: "none", label: "Prefer not to say" },
  { value: "other", label: "Other" },
];

export const marriageStatusOptions = [
  { value: "married", label: "Married" },
  { value: "single", label: "Single" },
  { value: "divorced", label: "Divorced/Separated" },
  { value: "widowed", label: "Widowed" },
  { value: "relationship", label: "In a relationship" },
];

export const ageGroupOptions = [
  { value: "-18", label: "Under 18" },
  { value: "18-24", label: "18-24 yrs" },
  { value: "25-34", label: "25-34 yrs" },
  { value: "35-44", label: "35-44 yrs" },
  { value: "45-54", label: "45-54 yrs" },
  { value: "55-64", label: "55-64 yrs" },
  { value: "65+", label: "65+ yrs" },
];

export const dependentsOptions = [
  { value: "children", label: "Yes, I have children" },
  { value: "dependents", label: "Yes, I have other dependents" },
  { value: "no", label: "No" },
];

{
  /*********** Geography & Culture data *********/
}

export const languagesOptions = [
  "Mandarin",
  "Spanish",
  "English",
  "Hindi",
  "Arabic",
  "Bengali",
  "Portuguese",
  "Russian",
  "Japanese",
  "Punjabi",
  "German",
  "Javanese",
  "Wu Chinese (including Shanghainese)",
  "French",
  "Turkish",
  "Vietnamese",
  "Korean",
  "Tamil",
  "Italian",
  "Urdu",
  "Persian (Farsi)",
  "Thai",
  "Gujarati",
  "Polish",
  "Ukrainian",
];

export const locationOptions = [
  { value: "urban", label: "Urban area" },
  { value: "suburban", label: "Suburban area" },
  { value: "rural", label: "Rural area" },
  { value: "other", label: "Other (Please specify)" },
];

export const regionOptions = [
  { value: "north_america", label: "North America" },
  { value: "south_america", label: "South America" },
  { value: "europe", label: "Europe" },
  { value: "africa", label: "Africa" },
  { value: "asia", label: "Asia" },
  { value: "australia_pacific_islands", label: "Australia/Pacific Islands" },
  { value: "other", label: "Other (Please specify)" },
];

export const ethnicityOptions = [
  { value: "white", label: "White or Caucasian" },
  { value: "Black", label: "Black or African American" },
  { value: "asian", label: "Asian" },
  { value: "hispanic", label: "Hispanic or Latino" },
  { value: "american", label: "American Indian or Alaska Native" },
  { value: "islander", label: "Percific Islander or Native Hawaiian" },
  { value: "other", label: "Other (Please specify)" },
];

export const religionOptions = [
  { value: "none", label: "N/A" },
  { value: "christianity", label: "Christianity" },
  { value: "islam", label: "Islam" },
  { value: "hinduism", label: "Hinduism" },
  { value: "buddhism", label: "Buddhism" },
  { value: "judaism", label: "Judaism" },
  { value: "other", label: "Other (Please specify)" },
];

{
  /*********** Education & Employment data *********/
}

export const educationLevelOptions = [
  { value: "no_education", label: "No formal education" },
  { value: "primary", label: "Primary education" },
  { value: "secondary", label: "Secondary/high school" },
  {
    value: "vocational_training",
    label: "Vocational training/certification",
  },
  { value: "associate_degree", label: "Associate degree" },
  { value: "bachelors_degree", label: "Bachelor's degree" },
  { value: "masters_degree", label: "Master's degree" },
  {
    value: "doctoral_Professional_degree",
    label: "Doctoral/Professional degree",
  },
];

export const employentStatusOptions = [
  { value: "full_time", label: "Employed full-time" },
  { value: "part_time", label: "Employed part-time" },
  { value: "self_employed", label: "Self-employed" },
  { value: "searching", label: "Unemployed but looking for work" },
  { value: "not_searching", label: "Unemployed and not looking for work" },
  { value: "student", label: "Student" },
  { value: "retired", label: "Retired" },
];

export const industryOptions = [
  { value: "fintech", label: "Fin-Tech" },
  { value: "government", label: "Government" },
  { value: "oil_and_gas", label: "Oil and Gas" },
];

export const jobRoleOptions = [
  { value: "executive_leadership", label: "Executive/Leadership" },
  { value: "management", label: "Management" },
  { value: "skilled_professional", label: "Skilled Professional" },
  { value: "administrative_clerical", label: "Administrative/Clerical" },
  { value: "technical_Engineering", label: "Technical/Engineering" },
  { value: "sales_marketing", label: "Sales/Marketing" },
  { value: "customer_service", label: "Customer Service" },
  { value: "education_research", label: "Education/Research" },
  { value: "other", label: "Other (Please specify)" },
];

export const workingHoursOptions = [
  { value: "-10", label: "Less than 10 hours" },
  { value: "10-20", label: "10-20 hours" },
  { value: "21-40", label: "21-40 hours" },
  { value: "40+", label: "More than 40 hours" },
];

export const incomeOptions = [
  { value: "-10000", label: "Below $10,000" },
  { value: "10000-30000", label: "$10,000-$30,000" },
  { value: "30000-50000", label: "$30,000-$50,000" },
  { value: "50000-75000", label: "$50,000-$75,000" },
  { value: "100000", label: "Over $100,000" },
  { value: "none", label: "Prefer not to say" },
];

export const savvyOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

{
  /*********** Health & Lifestyle Markers data *********/
}

export const overallHealthOptions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" },
];

export const helathInsuranceOptions = [
  { value: "no", label: "N/A- I don't have health insurance" },
  { value: "employer", label: "A plan through my employer" },
  { value: "family", label: "A plan through a family member's employer" },
  { value: "myself", label: "A plan i purchased myself" },
  { value: "medicare_or_medicaid", label: "Medicare or Medicaid" },
  { value: "not_sure", label: "I'm not sure" },
  { value: "other", label: "Other (Please specify)" },
];

export const healthConditionOptions = [
  { value: "yes", label: "Yes (Please specify)" },
  { value: "no", label: "No" },
];

export const physicalActivityOptions = [
  { value: "daily", label: "Yes, daily" },
  { value: "few_times", label: "Yes, a few times a week" },
  { value: "rarely", label: "Yes, but rarely" },
  { value: "no", label: "No, never" },
];

export const dietryOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten_free", label: "Gluten-free" },
  { value: "dietary_free", label: "Dietary-free" },
  { value: "other", label: "Other (Please specify)" },
  { value: "no", label: "No dietary restrictions" },
];

export const smokeOptions = [
  { value: "regularly", label: "Yes, regularly" },
  { value: "occasionally", label: "Occasionally" },
  { value: "no", label: "No" },
];

export const drinkOptions = [
  { value: "regularly", label: "Yes, regularly" },
  { value: "occasionally", label: "Occasionally" },
  { value: "no", label: "No" },
];

export const sleepOptions = [
  { value: "-4", label: "Less than 4 hours" },
  { value: "4-6", label: "4-6 hours" },
  { value: "6-8", label: "6-8 hours" },
  { value: "8+", label: "More than 8 hours" },
];

{
  /*********** Technology & Media Usage data *********/
}

export const contentOptions = [
  "News & Current Events",
  "Entertainment (Movies, TV, Music)",
  "Educational Content",
  "Sport & Fitness",
  "Personal Development",
  "other",
];

export const platformOptions = [
  "Facebook",
  "TikTok",
  "Instagram",
  "X (Twitter)",
  "Whatsapp",
  "Telegram",
  "Twitch",
  "Reddit",
  "Wechat",
  "Weibo",
  "other",
];

export const browserOptions = [
  "Chrome",
  "Microsoft Edge",
  "Internet Explorer",
  "Safari",
  "Brave",
  "Opera",
  "other",
];

export const internetUsageOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const internetAccessOptions = [
  { value: "smartphone", label: "Smartphone" },
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop/Desktop" },
  { value: "other", label: "Other (Please specify)" },
];

export const socialMediaUsageOptions = [
  { value: "multiple", label: "Multiple times a day" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
];

export const PcOperatingSystemOptions = [
  { value: "windows", label: "Windows" },
  { value: "macos", label: "MacOS" },
  { value: "chromeos", label: "ChromeOS" },
  { value: "linux", label: "Linux" },
  { value: "other", label: "Other" },
];

export const operatingSystemOptions = [
  { value: "windows", label: "Windows" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "other", label: "Other" },
];

{
  /*********** Housing & Living Situations data *********/
}

export const livingConditionOptions = [
  { value: "live_alone", label: "Live alone" },
  { value: "live_with_family", label: "Live with family" },
  { value: "live_with_roommates", label: "Live with roommates" },
  { value: "other", label: "Other (Please specify)" },
];

export const livingArrangementOptions = [
  { value: "own", label: "Own" },
  { value: "rent", label: "Rent" },
  { value: "other", label: "Other (Please specify)" },
];

export const householdNumbersOptions = [
  { value: "1", label: "Just me" },
  { value: "2-3", label: "2-3 people" },
  { value: "4-5", label: "4-5 people" },
  { value: "5+", label: "More than 5" },
];

{
  /*********** Mobility & Travel data *********/
}

export const commuteOptions = [
  { value: "car", label: "Car" },
  { value: "public_transport", label: "Public transport" },
  { value: "walking", label: "Walking" },
  { value: "bicycle", label: "Bicycle" },
  { value: "other", label: "Other (Please specify)" },
];

export const travelOptions = [
  { value: "frequently", label: "Frequently (multiple times a month)" },
  { value: "occasionally", label: "Occasionally (A few times a year)" },
  { value: "rarely", label: "Rarely" },
  { value: "never", label: "Never" },
];

export const vehicleOwnershipOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
