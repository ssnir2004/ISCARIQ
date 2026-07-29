export type RfqStatus =
  | "NEW"
  | "UNDER_REVIEW"
  | "SOLUTION_PROPOSED"
  | "DRAWING_SENT"
  | "CUSTOMER_SIGNED"
  | "REJECTED"
  | "CLOSED";

export type ProjectStatus =
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "DRAWING_READY"
  | "SENT_TO_BRANCH"
  | "CUSTOMER_SIGNED"
  | "PRODUCTION_PACKAGE_IN_PROGRESS"
  | "PRODUCTION_PACKAGE_READY"
  | "CLOSED";

export type OperationType = "TURNING" | "MILLING" | "DRILLING" | "GROOVING" | "THREADING" | "BORING";
export type Iso513Group = "P" | "M" | "K" | "N" | "S" | "H";
export type CoolantPreference = "REQUIRED" | "OPTIONAL" | "AVOID";
export type PlantMapView = "WORLD" | "GERMANY";

export interface Plant {
  id: string;
  name: string;
  regionCode?: string | null;
  specialties?: string | null;
  mapView: PlantMapView;
  x: number;
  y: number;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  teams?: Team[];
}

export interface Team {
  id: string;
  code: string;
  description: string;
  isManager: boolean;
  departmentId: string;
  department?: Department;
}

export interface Drawing {
  id: string;
  projectId: string;
  version: number;
  fileRef?: string | null;
  sentDate?: string | null;
  status: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  projectId: string;
  customerSignedDate?: string | null;
  status: string;
}

export interface ProductionOrder {
  id: string;
  poNumber: string;
  projectId: string;
  status: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  rfqId: string;
  teamId: string;
  status: ProjectStatus;
  notes?: string | null;
  rfq?: Rfq;
  team?: Team;
  drawings?: Drawing[];
  order?: Order | null;
  productionOrder?: ProductionOrder | null;
}

export interface Rfq {
  id: string;
  rfqNumber: string;
  branchId: string;
  customer: string;
  title: string;
  materialDescription?: string | null;
  problemDescription?: string | null;
  rfqDate: string;
  contactPerson?: string | null;
  status: RfqStatus;
  notes?: string | null;
  createdAt: string;
  branch?: Branch;
  projects?: Project[];
}

export interface Material {
  id: string;
  iso513Group: Iso513Group;
  name: string;
  description?: string | null;
  commonUse?: string | null;
  keyProperties?: string | null;
  hardness?: string | null;
}

export interface ProblemTag {
  id: string;
  name: string;
}

export interface GlossaryEntry {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
}

export type Shape = GlossaryEntry;
export type Chipbreaker = GlossaryEntry;
export type Grade = GlossaryEntry;
export type Coating = GlossaryEntry;

export interface Tool {
  id: string;
  designation: string;
  item?: string | null;
  tailConnection: string;
  tailSize: string;
  noseConnection: string;
  noseSize: string;
  notes?: string | null;
  image?: string | null;
}

export interface Insert {
  id: string;
  designation: string;
  item?: string | null;
  shape: string;
  size: string;
  chipbreaker: string;
  grade: string;
  coatingType?: string | null;
  substrate?: string | null;
  coolantPreference: CoolantPreference;
  notes?: string | null;
  image?: string | null;
}

export interface TestReportFile {
  id: string;
  testReportId: string;
  fileName: string;
  fileData: string;
  description?: string | null;
  fileDate?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface TestReport {
  id: string;
  insertId: string;
  testNo: string;
  testDate: string;
  description?: string | null;
  result: string;
  country?: string | null;
  customer?: string | null;
  performer?: string | null;
  createdAt: string;
  insert?: Insert;
  files?: TestReportFile[];
}

export interface CuttingCondition {
  id: string;
  insertId: string;
  materialId: string;
  operationType: OperationType;
  apMin?: number | null;
  apMax?: number | null;
  vcMin?: number | null;
  vcMax?: number | null;
  feedMin?: number | null;
  feedMax?: number | null;
  coolant: CoolantPreference;
  notes?: string | null;
  insert?: Insert;
  material?: Material;
}

export interface InsertProblemMatch {
  id: string;
  insertId: string;
  problemTagId: string;
  materialId?: string | null;
  priority: number;
  notes?: string | null;
  insert?: Insert;
  problemTag?: ProblemTag;
  material?: Material | null;
}

export interface AdvisorRecommendation {
  insert: Insert & { problemMatches: (InsertProblemMatch & { problemTag: ProblemTag })[] };
  cuttingCondition: Omit<CuttingCondition, "insert" | "material" | "insertId" | "materialId">;
  material: Material;
  matchedProblems: string[];
  score: number;
  apFit: boolean;
}
