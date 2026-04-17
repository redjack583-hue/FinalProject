export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  website?: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  contact: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category?: string;
  time?: string;
}

// categories for services
export const serviceCategories = [
  "Mental Health",
  "Healthcare",
  "Community Support",
  "Housing",
  "Education",
  "Employment",
  "Youth",
  "Family Support",
  "Legal Help",
  "Emergency Support"
];

// types of services
export const serviceTypes = [
  "Native-Led",
  "Community Centre",
  "Clinic",
  "Shelter",
  "School",
  "Legal Clinic"
];

// business categories
export const businessCategories = [
  "Indigenous Owned",
  "Arts & Culture",
  "Retail",
  "Services",
  "Food"
];