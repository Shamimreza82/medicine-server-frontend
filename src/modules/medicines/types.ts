export interface BrandResponse {
  id: number;
  name: string;
  form: string | null;
  strength: string | null;
  price: string | null;
  packSize: string | null;
  isSponsored: boolean;
  company: {
    id: number;
    name: string;
  };
  generic: {
    id: number;
    name: string;
  };
}

export interface GenericResponse {
  id: number;
  name: string;
  indication: string | null;
  therapeuticClass?: string | null;
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
}

export interface IndicationDetails extends IndicationResponse {}

export interface MedicineSearchResult {
  brands: BrandResponse[];
  generics: GenericResponse[];
  indications: IndicationResponse[];
  companies: CompanyResponse[];
}

export interface BrandDetails extends BrandResponse {}

export interface GenericDetails extends GenericResponse {
  administration: string | null;
  adultDose: string | null;
  childDose: string | null;
  contraIndication: string | null;
  interaction: string | null;
  modeOfAction: string | null;
  precaution: string | null;
  renalDose: string | null;
  sideEffect: string | null;
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

export interface MedicineSearchQuery {
  q?: string;
  page?: number;
  limit?: number;
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
