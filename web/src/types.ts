/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TalentProfile {
  id: string;
  name: string;
  email: string;
  school: string; // Escuela Profesional (e.g. Ciencia de la Computación, Ing. de Sistemas)
  gpa: number; // Historial Académico (GPA on 0-20 scale or 0-4 scale, let's use 0-20 scale standard in UNSA)
  percentile: string; // e.g. "Tercio Superior", "Quinto Superior", "Regula"
  plan: string; // e.g. "Plan de Estudios 2021"
  skills: string[]; // Dynamically editable skills
  languages: string[];
  experience: string;
  isAvailable: boolean; // Control de disponibilidad
  gradYear: number;
}

export interface JobVacancy {
  id: string;
  title: string;
  company: string;
  postedDate: string; // e.g. "Oct 24, 2024"
  description: string;
  minSalary: number;
  maxSalary: number;
  location: string;
  skillsRequired: string[];
  degreeDistribution: { [degree: string]: number };
  missingSkills: string[];
  topMatchScore: number; // calculated semantic match percentage (e.g. 98)
  matchCount: number; // how many talents match above threshold
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  actor: string;
  status: "OK" | "FAIL";
}

export interface PipelineLog {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  message: string;
}

export interface SystemSettings {
  globalMatchThreshold: number; // Umbral de Match Global (e.g. 85%)
  weights: {
    technicalSkills: number; // default: 70
    gpa: number; // default: 20
    softSkills: number; // default: 10
  };
}

export interface EmailDispatch {
  id: string;
  recipient: string;
  subject: string;
  sentAt: string;
  htmlContent: string;
  matchedRole: string;
  talentName: string;
  percentScore: number;
}
