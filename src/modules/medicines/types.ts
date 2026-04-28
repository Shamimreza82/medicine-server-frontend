export interface MedicineProduct {
  id: string;
  strength: string;
  dosageForm: string;
  route: string | null;
  packSize: string | null;
  unitPerPack: number | null;
  price: string | null;
  isPrescriptionRequired: boolean;
}

export interface BrandSuggestion {
  id: string;
  name: string;
  slug: string;
  manufacturer: {
    id: string;
    name: string;
  };
  generic: {
    id: string;
    name: string;
    slug: string;
  };
  products: MedicineProduct[];
}

export interface GenericSuggestion {
  id: string;
  name: string;
  slug: string;
  scientificName: string | null;
  drugClass: string | null;
  therapeuticClass: string | null;
  commonDoseTemplate: {
    adultDose: string | null;
    childDose: string | null;
    dosageGuideline: string | null;
    administration: string | null;
  };
  availableBrands: Array<{
    id: string;
    name: string;
  }>;
}

export interface MedicineSearchResult {
  brands: BrandSuggestion[];
  generics: GenericSuggestion[];
}

export interface BrandDetails {
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  manufacturer: {
    id: string;
    name: string;
  };
  generic: {
    id: string;
    name: string;
    slug: string;
  };
  commonDoseTemplate: {
    adultDose: string | null;
    childDose: string | null;
    dosageGuideline: string | null;
    administration: string | null;
  };
  products: MedicineProduct[];
  strengths: string[];
  dosageForms: string[];
}

export interface GenericDoseTemplate {
  genericId: string;
  genericName: string;
  adultDose: string | null;
  childDose: string | null;
  dosageGuideline: string | null;
  administration: string | null;
  monitoring: string | null;
  precaution: string | null;
}

export interface DiseaseSuggestionResult {
  disease: {
    id: string;
    name: string;
    slug: string;
  };
  medicines: Array<{
    genericId: string;
    genericName: string;
    genericSlug: string;
    isPrimary: boolean;
    note: string | null;
    commonDoseTemplate: {
      adultDose: string | null;
      childDose: string | null;
      dosageGuideline: string | null;
      administration: string | null;
    };
    brands: Array<{
      id: string;
      name: string;
      manufacturer: {
        id: string;
        name: string;
      };
      products: MedicineProduct[];
    }>;
  }>;
}

export interface WarningRequest {
  candidateGenericId: string;
  currentGenericIds: string[];
  pregnancy: boolean;
  lactation: boolean;
  allergyNotes: string[];
}

export interface WarningSummary {
  pregnancy: null | {
    category: string;
    warning: string | null;
    recommendation: string | null;
  };
  lactation: null | {
    riskLevel: string;
    warning: string | null;
    recommendation: string | null;
  };
  contraindications: Array<{
    condition: string;
    note: string | null;
  }>;
  interactions: Array<{
    withGenericId: string;
    withGenericName: string;
    severity: string;
    effect: string | null;
    management: string | null;
    note: string | null;
  }>;
  allergyAdvisory: string | null;
}
