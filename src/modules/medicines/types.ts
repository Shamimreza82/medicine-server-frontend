export interface DosageFormResponse {
  form: string;
  count: number;
}

export interface BrandResponse {
  id: number;
  name: string;
  form: string | null;
  strength: string | null;
  price: string | null;
  packSize: string | null;
  isSponsored?: boolean;
  company: {
    id: number;
    name: string;
  };
  generic: {
    id: number;
    name: string;
    therapeuticGenerics?: Array<{
      therapeutic: {
        id: number;
        name: string;
      };
    }>;
  };
}

export interface BrandRequest {
  name: string;
  companyId: number;
  genericId: number;
  form?: string | null;
  strength?: string | null;
  price?: string | null;
  packSize?: string | null;
  isSponsored?: boolean;
}

export interface GenericResponse {
  id: number;
  name: string;
  indication: string | null;
  administration: string | null;
  adultDose: string | null;
  childDose: string | null;
  renalDose: string | null;
  therapeuticClass?: string | null;
  _count?: {
    brands: number;
  };
  therapeuticGenerics?: Array<{
    therapeutic: {
      id: number;
      name: string;
    };
  }>;
}

export interface GenericRequest {
  name: string;
  indication?: string | null;
  therapeuticClass?: string | null;
  administration?: string | null;
  adultDose?: string | null;
  childDose?: string | null;
  contraIndication?: string | null;
  interaction?: string | null;
  modeOfAction?: string | null;
  precaution?: string | null;
  renalDose?: string | null;
  sideEffect?: string | null;
  pregnancyCategoryId?: number | null;
  pregnancyCategoryNote?: string | null;
  therapeuticIds?: number[];
}

export interface CompanyResponse {
  id: number;
  name: string;
}

export interface CompanyDetails extends CompanyResponse {
  brands: Array<BrandResponse & {
    generic: {
      id: number;
      name: string;
    }
  }>;
}

export interface IndicationResponse {
  id: number;
  name: string;
  _count?: {
    indicationGenerics: number;
  };
}

export interface IndicationDetails extends IndicationResponse {
  therapeutics: Array<{
    id: number;
    name: string;
  }>;
}

export interface MedicineSearchResult {
  brands: BrandResponse[];
  generics: GenericResponse[];
  indications: IndicationResponse[];
  companies: CompanyResponse[];
  herbalBrands?: BrandResponse[];
  herbalGenerics?: GenericResponse[];
}

export interface GenericDetails extends GenericResponse {
  contraIndication: string | null;
  interaction: string | null;
  modeOfAction: string | null;
  precaution: string | null;
  sideEffect: string | null;
  pregnancyCategoryNote: string | null;
  pregnancyCategory: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  therapeuticGenerics: Array<{
    therapeutic: {
      id: number;
      name: string;
    };
  }>;
}

export interface BrandDetails extends Omit<BrandResponse, 'generic'> {
  generic: GenericDetails;
  otherForms: Array<{
    id: number;
    name: string;
    form: string | null;
    strength: string | null;
  }>;
  genericAlternatives: Array<BrandResponse>;
}

export interface HerbalGenericDetails extends GenericResponse {
  composition: string | null;
  contraindication: string | null;
  description: string | null;
  dosage: string | null;
  drugInteraction: string | null;
  modeOfActions: string | null;
  precaution: string | null;
  pregnancyLactation: string | null;
  sideEffects: string | null;
}

export interface HerbalBrandDetails extends Omit<BrandResponse, 'generic'> {
  generic: HerbalGenericDetails;
}

export interface TherapeuticNode {
  id: number;
  name: string;
  systemicClassId: number;
}

export interface SystemicNode {
  id: number;
  name: string;
  parentId: number | null;
  children: SystemicNode[];
  therapeutics: TherapeuticNode[];
}

export interface MedicineSearchQuery {
  q?: string;
  page?: number;
  limit?: number;
  companyId?: number;
  genericId?: number;
  indicationId?: number;
  therapeuticId?: number;
  letter?: string;
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

export interface DiseaseSuggestionResponse {
  disease: {
    id: string;
    name: string;
    slug: string;
  };
  medicines: Array<{
    genericId: number;
    genericName: string;
    isPrimary: boolean;
    note: string | null;
    commonDoseTemplate: {
      adultDose: string | null;
      childDose: string | null;
    };
    brands: Array<{
      id: number;
      name: string;
    }>;
  }>;
}
