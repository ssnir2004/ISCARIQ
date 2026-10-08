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
// The six ISO 513 groups plus SM (Sintered Materials, CBN grades only).
export type Iso513Group = "P" | "M" | "K" | "N" | "S" | "H" | "SM";
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
  labelDx: number;
  labelDy: number;
  uncertain: boolean;
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
  // Picture of the material family (ISO 513 categories).
  image?: string | null;
  // True for the six fixed ISO 513 top-level categories; other materials are
  // subcategories of the category with the same iso513Group.
  isCategory: boolean;
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
export type Application = GlossaryEntry;

// A trial / case study for a grade (usually a slide image). A null
// applicationId / iso513Group means it applies to every application / group.
// `image` is only present when fetched by id.
export interface GradeCase {
  id: string;
  gradeId: string;
  applicationId: string | null;
  application?: { id: string; name: string } | null;
  // Only present when fetched by id.
  grade?: { id: string; name: string };
  iso513Group: Iso513Group | null;
  title: string;
  notes?: string | null;
  image?: string;
  createdAt: string;
}

// A grade's box (percent of the plot area, from the top-left) on the Hard /
// Tough chart of one board scope ("all" or an Application id) and ISO group.
export interface GradeChartBox {
  scope: string;
  iso513Group: Iso513Group;
  gradeId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  // Shared by grades merged into one block.
  mergeId?: string | null;
  // Stacking order (higher is drawn in front).
  z?: number;
}

// Saved Harder -> Tougher ranking of grade ids for one ISO 513 column of one
// board: scope "all" (every grade) or an Application id.
export interface GradeColumnOrder {
  scope: string;
  iso513Group: Iso513Group;
  gradeIds: string[];
}
// A grade's carbide substrate; hardness and fracture toughness (KIC) place
// it on the substrate map.
export interface Substrate extends GlossaryEntry {
  hardness?: number | null;
  toughness?: number | null;
  grades?: Pick<Grade, "id" | "name" | "iso513Groups" | "applications">[];
}

// Each family has its own Grades screen; carbide grades also have a substrate.
export type GradeFamily = "CARBIDE" | "CBN" | "CERAMIC" | "PCD";

// A recommended cutting condition for some grades of one family. Vc in m/min.
export interface GradeRecommendation {
  id: string;
  family: GradeFamily;
  material: Material;
  grades: { id: string; name: string }[];
  applications: { id: string; name: string }[];
  rough: boolean;
  semiFinish: boolean;
  finish: boolean;
  vcMin: number | null;
  vcRec: number | null;
  vcMax: number | null;
  // Depth of cut (mm) and feed (mm/rev) ranges.
  apMin: number | null;
  apMax: number | null;
  feedMin: number | null;
  feedMax: number | null;
  dry: boolean;
  wet: boolean;
  notes: string | null;
  position: number;
}

// A tool family (e.g. F45SN) suited to some grades in some applications.
export interface ToolSubApplication {
  id: string;
  name: string;
}

export interface ToolLine {
  id: string;
  name: string;
  grades: { id: string; name: string; family: GradeFamily }[];
  applications: { id: string; name: string }[];
  subApplication: ToolSubApplication | null;
  insert: string | null;
  image: string | null;
  notes: string | null;
}

// A rule of thumb in one list ("grades:<family>" or "imc").
export interface Rule {
  id: string;
  scope: string;
  text: string;
  position: number;
}

// What a grade is made of within its family (e.g. ceramic "ALUMINA").
export interface GradeType {
  id: string;
  name: string;
  family: GradeFamily;
}

// A user-defined group of grades within one family (e.g. "Coated").
export interface GradeSet {
  id: string;
  name: string;
  family: GradeFamily;
}

export interface Grade extends GlossaryEntry {
  family: GradeFamily;
  // Short, important note shown large and bold in the grade's chart block.
  chartNote?: string | null;
  // Competitor grades it replaces.
  competitors?: { brand: string; name: string }[];
  // Optional groups within the family (e.g. "Coated"); each group gets its
  // own chart, and a grade in several groups shows in each.
  sets?: GradeSet[];
  // The grade's type (the Grades map groups grades by it).
  typeId?: string | null;
  type?: GradeType | null;
  // Materials where the grade is in only some of its groups.
  materialSets?: { iso513Group: Iso513Group; setIds: string[] }[];
  substrate?: Substrate | null;
  iso513Groups: Iso513Group[];
  applications: Application[];
  // Applications where the grade covers only some of its iso513Groups.
  applicationGroups?: { applicationId: string; iso513Groups: Iso513Group[] }[];
}
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

export interface NpaAttribute {
  id: string;
  npaId: string;
  label: string;
  value: string;
  order: number;
}

export interface Npa {
  id: string;
  npaNumber?: string | null;
  title: string;
  category?: string | null;
  applicationType?: string | null;
  designation?: string | null;
  publishDate?: string | null;
  recommendedApplications?: string | null;
  innovation?: string | null;
  keyAdvantages?: string | null;
  materialsText?: string | null;
  notes?: string | null;
  image?: string | null;
  sourceFileName?: string | null;
  sourceFileData?: string | null;
  createdAt: string;
  updatedAt: string;
  materials?: Material[];
  attributes?: NpaAttribute[];
}

export type NpaApplicationCategory =
  | "MILLING"
  | "TURNING"
  | "GROOVING"
  | "PARTING"
  | "DRILLING"
  | "THREADING"
  | "REAMING"
  | "BORING"
  | "OTHER";

export type NpaAvailability = "IN_STOCK" | "COMING_SOON" | "ASK_PRICING" | "NOT_SPECIFIED";

export interface NpaKnowledgeItem {
  id: string;
  npaNumber: string;
  title: string;
  publicationDate?: string | null;
  productFamily: string;
  subFamily?: string | null;
  insertDesignation?: string | null;
  applicationCategory: NpaApplicationCategory;
  subApplications: string[];
  iso513Groups: Iso513Group[];
  workpieceMaterials: string[];
  innovation?: string | null;
  advantages: string[];
  recommendedUse: string;
  bestForConditions: string[];
  avoidWhen?: string | null;
  keySellingMessage?: string | null;
  technicalNotes?: string | null;
  pricingNotes?: string | null;
  availability: NpaAvailability;
  npaFileName?: string | null;
  npaFileData?: string | null;
  imageData?: string | null;
  sourceLink?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NpaRecommendationResult {
  item: NpaKnowledgeItem;
  score: number;
  reasons: string[];
}

export interface AdvisorRecommendation {
  insert: Insert & { problemMatches: (InsertProblemMatch & { problemTag: ProblemTag })[] };
  cuttingCondition: Omit<CuttingCondition, "insert" | "material" | "insertId" | "materialId">;
  material: Material;
  matchedProblems: string[];
  score: number;
  apFit: boolean;
}
