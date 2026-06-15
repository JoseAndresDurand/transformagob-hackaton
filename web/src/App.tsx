/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  School, 
  Factory, 
  Activity, 
  Settings as SettingsIcon, 
  LogOut, 
  Download, 
  Sparkles, 
  RefreshCw, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Mail, 
  Search, 
  Lock, 
  Plus, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Terminal, 
  Layers, 
  Send, 
  Database, 
  Upload, 
  CheckCircle2, 
  ArrowUpRight, 
  HelpCircle,
  Eye
} from "lucide-react";
import { 
  TalentProfile, 
  JobVacancy, 
  AuditLog, 
  PipelineLog, 
  SystemSettings, 
  EmailDispatch 
} from "./types";

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"gestion" | "arquitectura" | "talento" | "industria">("gestion");
  
  // API State
  const [settings, setSettings] = useState<SystemSettings>({
    globalMatchThreshold: 85,
    weights: { technicalSkills: 70, gpa: 20, softSkills: 10 }
  });
  const [talents, setTalents] = useState<TalentProfile[]>([]);
  const [vacancies, setVacancies] = useState<JobVacancy[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([]);
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Interface State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedVacancyId, setExpandedVacancyId] = useState<string | null>("j-1");
  const [sliderThreshold, setSliderThreshold] = useState<number>(85);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  
  // Weights State (For saving settings)
  const [techWeight, setTechWeight] = useState<number>(70);
  const [gpaWeight, setGpaWeight] = useState<number>(20);
  const [softWeight, setSoftWeight] = useState<number>(10);

  // Email Test Journey State
  const [testEmailAddress, setTestEmailAddress] = useState<string>("joseandresdurand@gmail.com");
  const [testVacancyId, setTestVacancyId] = useState<string>("j-1");
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [latestDispatch, setLatestDispatch] = useState<EmailDispatch | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Seeding State
  const [activePresetType, setActivePresetType] = useState<"csv" | "sql">("csv");
  const [seedContent, setSeedContent] = useState<string>("");
  const [seedingInProgress, setSeedingInProgress] = useState<boolean>(false);

  // Student Module State
  const [selectedStudentId, setSelectedStudentId] = useState<string>("t-1");
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  // Employer Module State
  const [newJobTitle, setNewJobTitle] = useState<string>("");
  const [newJobCompany, setNewJobCompany] = useState<string>("");
  const [newJobLocation, setNewJobLocation] = useState<string>("Arequipa (Híbrido)");
  const [newJobMinSalary, setNewJobMinSalary] = useState<number>(4000);
  const [newJobMaxSalary, setNewJobMaxSalary] = useState<number>(7000);
  const [newJobDesc, setNewJobDesc] = useState<string>("");
  const [newJobSkills, setNewJobSkills] = useState<string[]>([]);
  const [tempSkillInput, setTempSkillInput] = useState<string>("");

  // Presets templates for easy seeding
  const csvPreset = `name,email,school,gpa,percentile,skills
Renato Lazo,renato.lazo@unsa.edu.pe,Ciencia de la Computación,18.4,Tercio Superior,Python;PyTorch;AWS SageMaker;Machine Learning;SQL
Camila Beltran,cbeltran@unsa.edu.pe,Ingeniería de Sistemas,16.5,Quinto Superior,Docker;Kubernetes;PostgreSQL;React;Next.js;Airflow;SQL
Pedro Diaz,pdiazo@unsa.edu.pe,Ciencia de la Computación,14.2,Regular,Python;Django;SQL;HTML;CSS;JavaScript
Lucia Vizcarra,lvizcarra@unsa.edu.pe,Ingeniería Industrial,17.2,Quinto Superior,Scrum;SQL;Agile;Tableau;Business Intelligence;Excel`;

  const sqlPreset = `-- UNSA Database Seeding Dump
INSERT INTO Student_Profiles (name, email, school, gpa, percentile) 
VALUES ('Francisco Flores', 'fflores@unsa.edu.pe', 'Ciencia de la Computación', 19.1, 'Primer Puesto');
INSERT INTO Student_Profiles (name, email, school, gpa, percentile) 
VALUES ('Gabriela Salas', 'gsalasq@unsa.edu.pe', 'Ingeniería de Sistemas', 17.8, 'Tercio Superior');
INSERT INTO Student_Profiles (name, email, school, gpa, percentile) 
VALUES ('Jorge Arenas', 'jarenas@unsa.edu.pe', 'Ciencia de la Computación', 15.6, 'Regular');`;

  // Fetch initial state
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      const data = await res.json();
      setSettings(data.settings);
      setSliderThreshold(data.settings.globalMatchThreshold);
      setTechWeight(data.settings.weights.technicalSkills);
      setGpaWeight(data.settings.weights.gpa);
      setSoftWeight(data.settings.weights.softSkills);
      setTalents(data.talents);
      setVacancies(data.vacancies);
      setAuditLogs(data.auditLogs);
      setPipelineLogs(data.pipelineLogs);
      setEmailDispatches(data.emailDispatches);
      setLoading(false);
    } catch (e) {
      console.error("Error loading application backend state:", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Set Seed Content when switching presets
  useEffect(() => {
    if (activePresetType === "csv") {
      setSeedContent(csvPreset);
    } else {
      setSeedContent(sqlPreset);
    }
  }, [activePresetType]);

  // Show Toast Helper
  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  // Handler: Update Slider Threshold
  const handleSliderChange = async (val: number) => {
    setSliderThreshold(val);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalMatchThreshold: val,
          weights: {
            technicalSkills: techWeight,
            gpa: gpaWeight,
            softSkills: softWeight
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setVacancies(data.vacancies);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Save Fine-Tuning Weights
  const handleSaveWeights = async () => {
    // Basic verification to make weights add up nicely (doesn't have to be exactly 100 but fits best)
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          globalMatchThreshold: sliderThreshold,
          weights: {
            technicalSkills: techWeight,
            gpa: gpaWeight,
            softSkills: softWeight
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        setVacancies(data.vacancies);
        // Refresh audit logs
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setAuditLogs(stateData.auditLogs);
        triggerToast("⚖️ Pesos algorítmicos actualizados y aplicados con éxito.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Trigger Recalculation
  const handleRecalculateMatches = async () => {
    try {
      const res = await fetch("/api/recalculate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
        setPipelineLogs(data.pipelineLogs);
        // Refresh logs
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setAuditLogs(stateData.auditLogs);
        triggerToast("🔍 Re-query vectorial pgvector recalculada en el ecosistema.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Post New Vacancy
  const handlePostVacancy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle || !newJobCompany || newJobSkills.length === 0) {
      triggerToast("⚠️ Por favor asigne Título, Empresa y al menos una habilidad requerida.");
      return;
    }

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newJobTitle,
          company: newJobCompany,
          location: newJobLocation,
          minSalary: newJobMinSalary,
          maxSalary: newJobMaxSalary,
          description: newJobDesc,
          skillsRequired: newJobSkills
        })
      });
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
        triggerToast(`💼 Vacante "${newJobTitle}" creada con taxonomía cerrada.`);
        // Reset form
        setNewJobTitle("");
        setNewJobCompany("");
        setNewJobDesc("");
        setNewJobSkills([]);
        // Refresh logs
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setAuditLogs(stateData.auditLogs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Add Temp Skill to new job
  const handleAddTempSkill = () => {
    if (tempSkillInput.trim() && !newJobSkills.includes(tempSkillInput.trim())) {
      setNewJobSkills([...newJobSkills, tempSkillInput.trim()]);
      setTempSkillInput("");
    }
  };

  // Handler: Update Student skills or availability
  const handleUpdateStudentState = async (id: string, updatedSkills: string[], active: boolean) => {
    try {
      const res = await fetch("/api/talents/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talentId: id,
          skills: updatedSkills,
          isAvailable: active
        })
      });
      const data = await res.json();
      if (data.success) {
        setVacancies(data.vacancies);
        // Refresh talents list
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setTalents(stateData.talents);
        triggerToast("🎓 Perfil de talento sincronizado con el vector algorítmico.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handler: Add custom Skill to current student
  const handleAddStudentSkill = (student: TalentProfile) => {
    if (newSkillInput.trim() && !student.skills.includes(newSkillInput.trim())) {
      const list = [...student.skills, newSkillInput.trim()];
      handleUpdateStudentState(student.id, list, student.isAvailable);
      setNewSkillInput("");
    }
  };

  // Handler: Remove Student Skill
  const handleRemoveStudentSkill = (student: TalentProfile, skillToRemove: string) => {
    const list = student.skills.filter(s => s !== skillToRemove);
    handleUpdateStudentState(student.id, list, student.isAvailable);
  };

  // Handler: Seeding Content Injection
  const handleExecuteSeed = async () => {
    if (!seedContent.trim()) return;
    setSeedingInProgress(true);
    try {
      const res = await fetch("/api/seed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileType: activePresetType,
          content: seedContent
        })
      });
      const data = await res.json();
      if (data.success) {
        setTalents(data.talents);
        setVacancies(data.vacancies);
        setPipelineLogs(data.pipelineLogs);
        triggerToast(`🌱 Seed inyectada con éxito: ${data.count} registros emparejados exitosamente.`);
        // Refresh audit logs
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setAuditLogs(stateData.auditLogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeedingInProgress(false);
    }
  };

  // Handler: Simulated Match Report Email dispatch
  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      triggerToast("⚠️ Por favor ingrese una dirección de correo.");
      return;
    }
    setSendingEmail(true);
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailAddress: testEmailAddress,
          vacancyId: testVacancyId
        })
      });
      const data = await res.json();
      if (data.success) {
        setLatestDispatch(data.dispatch);
        setShowEmailModal(true);
        triggerToast(`📧 Reporte de match transmitido con simulación analítica AI.`);
        // Refresh dispatches + audit
        const stateRes = await fetch("/api/state");
        const stateData = await stateRes.json();
        setEmailDispatches(stateData.emailDispatches);
        setAuditLogs(stateData.auditLogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSendingEmail(false);
    }
  };

  // Filter vacancies based on search table
  const filteredVacancies = vacancies.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.skillsRequired.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedStudent = talents.find(t => t.id === selectedStudentId) || talents[0];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 selection:bg-unsa-purple selection:text-white">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-deep-navy text-white px-5 py-4 rounded-xl shadow-2xl border-l-4 border-match-crimson animate-bounce">
          <Sparkles className="w-5 h-5 text-match-crimson shrink-0" />
          <span className="text-sm font-semibold tracking-wide">{successToast}</span>
        </div>
      )}

      {/* Side Nav Rail */}
      <aside className="w-full md:w-64 bg-[#0a1a3e] text-slate-300 flex flex-col pt-8 pb-5 shrink-0 border-r border-[#172e5a] relative z-40">
        {/* Brand Banner */}
        <div className="px-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-lg shadow-black/30 border border-slate-200">
            <img 
              alt="SkillMatch UNSA Institutional Logo" 
              className="w-full h-full object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7ROGQypBhmuM3gu9rLhj-evZMqH_6f1gUB1IBAazWOpJWPQdWBvSpD2Naah_hE2dWAwktYqZVhUtmcmeRnAwisKKIoW2_E8MF0nf0kbVvmHF7HxxEXtUZtuzQNZaA5-f77vdi1607q2HqZklj6g7E_AYjz7SINM5ho_tPQp3-WafDJUKu1nZuqAsycEwu0N3bXj5ha_5Fg9qFqBppO-knwkcVpnlUytudLyjqr636yiB9FdFt1g9HcXbulyatThEfYQSP7o_dUJ0d"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-white leading-tight tracking-tight">SkillMatch</h1>
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">Smart Data Gateway</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1.5 px-4">
          <button 
            onClick={() => setActiveTab("gestion")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 text-left ${
              activeTab === "gestion" 
                ? "bg-[#371283] text-white shadow-md shadow-[#371283]/30" 
                : "hover:bg-[#1a2f5c]/50 text-slate-300 hover:text-white"
            }`}
          >
            <Activity className={`w-5 h-5 shrink-0 ${activeTab === "gestion" ? "text-match-crimson" : "text-slate-400"}`} />
            <span>Gestión del Ecosistema</span>
          </button>

          <button 
            onClick={() => setActiveTab("arquitectura")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 text-left ${
              activeTab === "arquitectura" 
                ? "bg-[#371283] text-white shadow-md shadow-[#371283]/30" 
                : "hover:bg-[#1a2f5c]/50 text-slate-300 hover:text-white"
            }`}
          >
            <Database className={`w-5 h-5 shrink-0 ${activeTab === "arquitectura" ? "text-match-crimson" : "text-slate-400"}`} />
            <span>Arquitectura y Datos</span>
          </button>

          <div className="w-full h-px bg-[#172e5a] my-3"></div>

          <button 
            onClick={() => setActiveTab("talento")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 text-left ${
              activeTab === "talento" 
                ? "bg-[#371283] text-white shadow-md shadow-[#371283]/30" 
                : "hover:bg-[#1a2f5c]/50 text-slate-300 hover:text-white"
            }`}
          >
            <School className={`w-5 h-5 shrink-0 ${activeTab === "talento" ? "text-match-crimson" : "text-slate-400"}`} />
            <span>Portal Alumno (UNSA)</span>
          </button>

          <button 
            onClick={() => setActiveTab("industria")}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 text-left ${
              activeTab === "industria" 
                ? "bg-[#371283] text-white shadow-md shadow-[#371283]/30" 
                : "hover:bg-[#1a2f5c]/50 text-slate-300 hover:text-white"
            }`}
          >
            <Factory className={`w-5 h-5 shrink-0 ${activeTab === "industria" ? "text-match-crimson" : "text-slate-400"}`} />
            <span>Portal Reclutador</span>
          </button>
        </nav>

        {/* Footer info lock */}
        <div className="mt-auto px-6 pt-4 border-t border-[#172e5a]">
          <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors text-xs py-1.5 rounded-lg mb-1">
            <SettingsIcon className="w-4 h-4" />
            <span>Ajustes Generales</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            Muelle UNSA v2.8 (MVP) <br/>
            Hackatón Transformagob 2024
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Controls bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-6 md:px-10 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono tracking-wider text-slate-400 bg-slate-100 uppercase px-2 py-1 rounded">Smart Data Gateway</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">Filtro Vectorial Bidireccional</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative max-w-xs hidden md:block">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar vacante por skill, empresa..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 w-64 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-unsa-purple focus:bg-white transition-all"
              />
            </div>
            
            <span className="h-6 w-px bg-slate-200"></span>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden text-[#0a1a3e]/70">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800">UNSA Administrador</p>
                <p className="text-[10px] font-medium text-slate-400">joseandresdurand@gmail.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Global Loading state */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-600 font-medium">
            <RefreshCw className="w-12 h-12 text-[#371283] animate-spin mb-4" />
            <p className="text-lg">Iniciando Ecosistema Inteligente UNSA...</p>
            <p className="text-xs text-slate-400 mt-2">Cargando base de datos inmutable e índice semántico pgvector</p>
          </div>
        ) : (
          <main className="flex-1 p-6 md:p-10 max-w-[1440px] mx-auto w-full">
            {/* View - tab: GESTION */}
            {activeTab === "gestion" && (
              <div className="space-y-8 animate-fade-in">
                {/* View Banner Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Gestión del Ecosistema</h2>
                    <p className="text-slate-500 text-sm mt-1">Monitoreo de salud de la plataforma y ajuste en tiempo real de algoritmos de match vectorial.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sistemas Operativos Activos
                    </span>
                    <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all">
                      <Download className="w-4 h-4 text-slate-500" />
                      Exportar Reporte
                    </button>
                  </div>
                </div>

                {/* Dashboard Bento Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Algorithmic settings slider */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-2 mb-6 text-unsa-purple">
                      <Layers className="w-5 h-5 text-match-crimson shrink-0" />
                      <h3 className="text-xs font-bold tracking-wider uppercase">Ajuste de Algoritmo</h3>
                    </div>
                    
                    <div className="space-y-4 flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-semibold text-slate-500">Umbral de Match Global</span>
                        <span className="text-2xl font-black text-[#371283]">{sliderThreshold}%</span>
                      </div>
                      
                      <div className="pt-2">
                        <input 
                          type="range" 
                          min="50" 
                          max="100" 
                          value={sliderThreshold}
                          onChange={(e) => handleSliderChange(Number(e.target.value))}
                          className="w-full accent-[#371283] cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                        />
                      </div>

                      <div className="text-[11px] leading-relaxed text-slate-400 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        Ajustar este umbral actualiza instantáneamente el puntaje mínimo de compatibilidad requerido para que un egresado aparezca en las búsquedas del empleador.
                      </div>
                    </div>
                  </div>

                  {/* Stat - Active Profiles */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Perfiles Activos Totales</span>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="text-4xl font-black text-slate-900 font-mono">{talents.length} <span className="text-xs font-medium text-slate-400 shrink-0 select-none">Registrados</span></div>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-0.5 font-mono">
                        +2.1%
                      </span>
                    </div>
                    <div className="mt-3 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                      Estudiantes veridicos inscritos y cotejados con el ERP institucional.
                    </div>
                  </div>

                  {/* Stat - Open Vacancies */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Vacantes Abiertas</span>
                    <div className="mt-4 flex items-baseline justify-between">
                      <div className="text-4xl font-black text-slate-900 font-mono">{vacancies.length}</div>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-mono">
                        → 0.0%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                      Requerimientos de empleadores locales y nacionales en el muelle de datos.
                    </div>
                  </div>

                  {/* Stat - Match rate of the system */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
                    <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Tasa promedio de Match</span>
                    <div className="mt-4">
                      <div className="text-5xl font-black text-match-crimson font-mono">78%</div>
                    </div>
                    <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 relative z-10">
                      Rango global de aptitud que satisface las demandas profesionales.
                    </div>
                    {/* Decorative gradient sphere */}
                    <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#f50343]/5 rounded-full blur-2xl pointer-events-none"></div>
                  </div>
                </div>

                {/* Demand Alignment and Zero Match Alerts Row */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* CSS / SVG Bar heights Chart */}
                  <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Layers className="w-5 h-5 text-unsa-purple" />
                        <h3 className="font-bold text-sm tracking-wide text-slate-800 uppercase">Alineación de Demanda (Rendimiento Semántico)</h3>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Intervalo: </span>
                        <select className="border border-slate-200 bg-slate-50 text-xs font-medium px-2 py-1.5 rounded-lg outline-none focus:border-unsa-purple">
                          <option>Últimos 30 Días</option>
                          <option>Este Trimestre</option>
                        </select>
                      </div>
                    </div>

                    {/* Chart Columns representation */}
                    <div className="relative h-60 mt-12 mb-2 flex items-end">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex flex-col justify-between text-slate-300 font-mono text-[9px] pointer-events-none select-none pl-10">
                        <div className="w-full border-t border-slate-100 pt-1">100 Match% (Perf.)</div>
                        <div className="w-full border-t border-slate-100 pt-1">75 Match%</div>
                        <div className="w-full border-t border-slate-100 pt-1">50 Match%</div>
                        <div className="w-full border-t border-slate-100 pt-1">25 Match%</div>
                        <div className="w-full border-t border-slate-100 pt-1 border-b pb-1">0%</div>
                      </div>

                      {/* Chart Data Bars */}
                      <div className="flex-1 flex items-end justify-around h-full pl-12 z-10 relative">
                        {vacancies.slice(0, 6).map((job, idx) => {
                          const score = job.topMatchScore || 45;
                          return (
                            <div key={job.id} className="w-full max-w-[40px] group flex flex-col items-center select-none cursor-pointer">
                              {/* Hover data label */}
                              <div className="absolute -top-12 bg-[#0a1a3e] text-white text-[10px] px-2.5 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700 pointer-events-none font-bold">
                                ⚽ {score}% Best Match ({job.matchCount} Alumnos)
                              </div>
                              <div 
                                style={{ height: `${score}%` }} 
                                className={`w-full rounded-t-lg transition-all duration-500 ${
                                  score >= sliderThreshold 
                                    ? "bg-unsa-purple group-hover:bg-[#4f319b]" 
                                    : "bg-slate-200 hover:bg-slate-300"
                                }`}
                              ></div>
                              <span className="text-[10px] font-bold text-slate-500 mt-2 truncate max-w-[60px] text-center" title={job.title}>
                                {job.title.split(' ')[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Zero Matches Warning cards list */}
                  <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col max-h-[360px]">
                    <div className="flex items-center gap-2 mb-4 text-[#f50343]">
                      <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
                      <h3 className="font-bold text-sm tracking-wide uppercase">Alertas de Zero Match</h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      Vacantes que no logran encontrar candidatos por encima del umbral actual establecido del {sliderThreshold}%.
                    </p>

                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5">
                      {vacancies.filter(v => v.matchCount === 0).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                          <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
                          <p className="text-xs font-semibold">Cero Alertas Críticas</p>
                          <p className="text-[10px]">Todo los roles tienen perfiles vincularios.</p>
                        </div>
                      ) : (
                        vacancies.filter(v => v.matchCount === 0).map(v => (
                          <div key={v.id} className="p-3.5 border border-red-100 bg-red-50/40 rounded-xl flex flex-col select-none hover:border-red-200 transition-colors">
                            <span className="text-xs font-bold text-slate-800 tracking-tight">{v.title}</span>
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-red-50">
                              <span className="font-medium text-slate-500">{v.company}</span>
                              <span className="text-match-crimson font-bold">0 Matches (Insuficiente)</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Vacancy Drill-down analyzer */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-unsa-purple shrink-0" />
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 tracking-tight font-sans">Análisis Detallado de Vacantes</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Haga clic en un puesto para ver la demografía y habilidades faltantes (gaps).</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleRecalculateMatches}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
                        title="Disparador semántico manual"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        Recalcular Similitudes
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f8fafc] text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60 font-sans">
                        <tr>
                          <th className="py-4 px-6 font-bold">PUESTO / ENTIDAD</th>
                          <th className="py-4 px-6 font-bold">FECHA DE PUBLICACIÓN</th>
                          <th className="py-4 px-6 font-bold">TAMAÑO DEL POOL (≥ {sliderThreshold}%)</th>
                          <th className="py-4 px-6 font-bold">MEJOR MATCH</th>
                          <th className="py-4 px-6 text-right font-bold">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans text-xs">
                        {filteredVacancies.map(job => {
                          const isExpanded = expandedVacancyId === job.id;
                          const bestScore = job.topMatchScore;
                          
                          return (
                            <React.Fragment key={job.id}>
                              {/* Primary Row */}
                              <tr className={`hover:bg-slate-50 transition-colors ${isExpanded ? "bg-slate-50/80" : ""}`}>
                                <td className="py-4 px-6">
                                  <p className="font-bold text-slate-900 text-sm">{job.title}</p>
                                  <p className="text-[11px] text-slate-500 mt-0.5">{job.company}</p>
                                </td>
                                
                                <td className="py-4 px-6 text-slate-500 font-medium">
                                  {job.postedDate}
                                </td>

                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                      <div 
                                        style={{ width: `${Math.min((job.matchCount / 6) * 100, 100)}%` }} 
                                        className="bg-unsa-purple h-full rounded-full"
                                      ></div>
                                    </div>
                                    <span className="text-slate-800 font-bold">{job.matchCount} perfiles</span>
                                  </div>
                                </td>

                                <td className="py-4 px-6">
                                  <span className={`px-2.5 py-1 rounded-full font-black text-[10px] border tracking-wider ${
                                      bestScore >= sliderThreshold 
                                        ? "bg-[#f50343]/10 text-match-crimson border-red-200" 
                                        : "bg-slate-100 text-slate-500 border-slate-200"
                                    }`}
                                  >
                                    {bestScore > 0 ? `${bestScore}% Match` : "No Match"}
                                  </span>
                                </td>

                                <td className="py-4 px-6 text-right">
                                  <button 
                                    onClick={() => setExpandedVacancyId(isExpanded ? null : job.id)}
                                    className="text-unsa-purple font-bold hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer focus:outline-none"
                                  >
                                    <span>Demografía</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded Row with targeted academics demographics & skills gaps */}
                              {isExpanded && (
                                <tr className="bg-[#fcfdfe]">
                                  <td colSpan={5} className="py-5 px-8 border-y border-slate-200/50">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                      {/* Academic Distribution */}
                                      <div className="space-y-3 border-r border-slate-100 pr-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                          <School className="w-3.5 h-3.5 text-slate-400" />
                                          <span>Distribución Académica</span>
                                        </div>
                                        
                                        <div className="space-y-2">
                                          {Object.keys(job.degreeDistribution).length === 0 ? (
                                            <p className="text-xs text-slate-400 italic">No hay datos demográficos de egresados.</p>
                                          ) : (
                                            Object.entries(job.degreeDistribution).map(([degree, percent]) => (
                                              <div key={degree} className="flex justify-between items-center text-xs">
                                                <span className="font-medium text-slate-600 block truncate max-w-[180px]">{degree}</span>
                                                <div className="flex items-center gap-2">
                                                  <div className="w-16 bg-slate-100 rounded-full h-1">
                                                    <div style={{ width: `${percent}%` }} className="bg-unsa-purple h-full rounded-full"></div>
                                                  </div>
                                                  <span className="font-bold text-slate-800 font-mono w-8 text-right">{percent}%</span>
                                                </div>
                                              </div>
                                            ))
                                          )}
                                        </div>
                                      </div>

                                      {/* Missing Skills (Gaps) */}
                                      <div className="space-y-3 border-r border-[#eceef0]/60 pr-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                                          <Plus className="w-3.5 h-3.5 text-unsa-purple" />
                                          <span>Habilidades faltantes críticas</span>
                                        </div>

                                        <ul className="space-y-2 text-xs">
                                          {job.missingSkills.map((gap, id) => (
                                            <li key={id} className="flex items-center gap-2 font-medium text-slate-700">
                                              <span className="w-1.5 h-1.5 rounded-full bg-match-crimson"></span>
                                              <span>{gap}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>

                                      {/* Matching profiles actions */}
                                      <div className="flex flex-col justify-center space-y-3">
                                        <button 
                                          onClick={() => {
                                            setTestVacancyId(job.id);
                                            setActiveTab("arquitectura");
                                          }}
                                          className="w-full bg-[#371283] hover:bg-[#2c0d6b] text-white text-xs font-bold py-2.5 rounded-lg shadow-sm transition-all inline-flex items-center justify-center gap-1.5 group cursor-pointer"
                                        >
                                          <span>Probar viaje (Test Email)</span>
                                          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                                        </button>

                                        <div className="text-[11px] leading-relaxed text-slate-400 text-center">
                                          Cerrado con validación criptográfica inmutable.
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* View - tab: ARQUITECTURA */}
            {activeTab === "arquitectura" && (
              <div className="space-y-8 animate-fade-in">
                {/* View Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Ajustes de Arquitectura</h2>
                    <p className="text-slate-500 text-sm mt-1">Gestión técnica del índice vectorial, fine-tuning paramétrico y simulación de flujos de correo.</p>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      DB PostgreSQL Activa
                    </span>
                    <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      pgvector Iniciado
                    </span>
                  </div>
                </div>

                {/* Sub-panels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Pipeline logs terminal area */}
                  <section className="md:col-span-8 bg-[#0a1a3e] rounded-2xl border border-slate-850 overflow-hidden shadow-xl flex flex-col h-[340px]">
                    <div className="bg-[#061129] border-b border-slate-800 px-5 py-3.5 flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                        <h4 className="text-xs font-bold text-white tracking-wide uppercase">Pipeline de Ingesta ERP (Real-time logs)</h4>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded-md animate-pulse">Sincronizando</span>
                    </div>

                    <div className="p-5 flex-1 overflow-y-auto font-mono text-[11.5px] leading-relaxed text-slate-300 space-y-2 bg-[#091533]">
                      {pipelineLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-4">
                          <span className="text-[#a185f3] shrink-0 font-bold select-none">{log.timestamp}</span>
                          <span className={`shrink-0 font-semibold text-xs ${
                            log.level === "INFO" ? "text-emerald-400" : log.level === "WARN" ? "text-amber-400" : "text-rose-400"
                          }`}>[{log.level}]</span>
                          <span className="text-slate-100">{log.message}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* pgvector config parameters display */}
                  <section className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                        <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Configuración Vectorial</h4>
                        <Database className="w-5 h-5 text-unsa-purple" />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Extensión</p>
                          <p className="text-sm font-bold text-[#0a1a3e]">pgvector v0.5.0</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Dimensionalidad</p>
                          <p className="text-sm font-bold text-[#0a1a3e]">1536 (Text-Embedding-3)</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">Métrica de Distancia</p>
                          <p className="text-sm font-bold text-[#0a1a3e]">Similitud del Coseno (&lt;=&gt;)</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 mt-4 leading-relaxed italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      🔐 Los embeddings se computan server-side y se sincronizan bi-unívocamente para salvaguardar el Ground Truth.
                    </div>
                  </section>

                  {/* Seed Upload Interface */}
                  <section className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-lg text-slate-950 tracking-tight mb-2 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-[#371283]" />
                        Inyección de Datos (Ground Truth)
                      </h4>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Cargue un dump SQL estructurado o plantilla de CSV para inyectar nuevos expedientes egresados y recomputar la correspondencia de inmediato.
                      </p>

                      {/* File preset controls */}
                      <div className="flex gap-2.5 border-b border-indigo-50 pb-3 mb-4">
                        <button 
                          onClick={() => setActivePresetType("csv")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activePresetType === "csv" ? "bg-unsa-purple text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          Estructura CSV
                        </button>
                        <button 
                          onClick={() => setActivePresetType("sql")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            activePresetType === "sql" ? "bg-unsa-purple text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          Script SQL (.sql)
                        </button>
                      </div>

                      <div className="relative">
                        <textarea 
                          value={seedContent}
                          onChange={(e) => setSeedContent(e.target.value)}
                          placeholder="Seleccione el preset arriba o inserte dump aquí..."
                          className="w-full text-xs font-mono p-4 bg-slate-900 text-emerald-400 h-44 rounded-xl focus:outline-none focus:ring-1 focus:ring-unsa-purple border border-slate-800"
                        ></textarea>
                      </div>
                    </div>

                    <button 
                      onClick={handleExecuteSeed}
                      disabled={seedingInProgress || !seedContent.trim()}
                      className="mt-4 w-full bg-[#371283] hover:bg-[#2c0d6b] text-white py-3.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-900/10 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none disabled:pointer-events-none"
                    >
                      {seedingInProgress ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Inyectando registros en base de datos...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4" />
                          <span>Poblar "Ground Truth" con Datos Elegidos</span>
                        </>
                      )}
                    </button>
                  </section>

                  {/* Weights slider fine-tuning weights */}
                  <section className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-indigo-50">
                      <h4 className="font-bold text-lg text-[#0a1a3e] tracking-tight">Fine-tuning de Pesos</h4>
                      <input 
                        type="button" 
                        value="Guardar Parámetros" 
                        onClick={handleSaveWeights}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-unsa-purple font-bold px-3 py-1.5 rounded-lg text-[11px] cursor-pointer shadow-sm transition-all active:scale-[0.97]"
                      />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      Ajuste ponderado de la importancia relativa de variables para la indexación y cálculo de compatibilidad semántica.
                    </p>

                    <div className="space-y-6">
                      {/* Weight: Technical Skills */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-semibold text-slate-700">Habilidades Técnicas directas</label>
                          <span className="font-mono font-bold text-unsa-purple">{techWeight}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={techWeight} 
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setTechWeight(val);
                            // Auto-adjust others slightly to sum to 100 on hover, basic soft balancer
                          }}
                          className="w-full accent-[#371283] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Weight: GPA Academic History */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-semibold text-slate-700">Historial Académico (GPA Notas UNSA)</label>
                          <span className="font-mono font-bold text-unsa-purple">{gpaWeight}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={gpaWeight} 
                          onChange={(e) => setGpaWeight(Number(e.target.value))}
                          className="w-full accent-[#371283] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Weight: Soft skills */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <label className="font-semibold text-slate-700">Aptitudes Blandas & Experiencia</label>
                          <span className="font-mono font-bold text-unsa-purple">{softWeight}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={softWeight} 
                          onChange={(e) => setSoftWeight(Number(e.target.value))}
                          className="w-full accent-[#371283] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-indigo-50 text-[10.5px] text-slate-400 text-center leading-relaxed font-medium">
                      Estabilidad algorítmica: {techWeight + gpaWeight + softWeight}% ponderación acumulada total en pgvector.
                    </div>
                  </section>

                  {/* Test Email Simulation Area */}
                  <section className="md:col-span-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h4 className="font-bold text-lg text-slate-950 tracking-tight flex items-center gap-2 mb-2">
                      <Send className="w-5 h-5 text-match-crimson shrink-0" />
                      Prueba en Vivo: Viaje del Usuario (Test Email Simulation)
                    </h4>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                      Simule la fase de transmisión del usuario. El motor semántico elegirá el mejor alumno egresado para el rol seleccionado, formulará un reporte analítico inteligente potenciado por el modelo **gemini-3.5-flash**, lo empaquetará en una plantilla institucional formal de UNSA y simulará su despacho de correo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-end bg-[#f8fafc] p-5 rounded-2xl border border-slate-200/80">
                      <div className="flex-1 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Seleccionar Vacante para Informe</label>
                        <select 
                          value={testVacancyId}
                          onChange={(e) => setTestVacancyId(e.target.value)}
                          className="w-full border border-slate-200 bg-white text-xs font-semibold px-3 py-2.5 rounded-lg outline-none focus:border-unsa-purple text-slate-800"
                        >
                          {vacancies.map(v => (
                            <option key={v.id} value={v.id}>{v.title} ({v.company})</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Dirección de Correo Destino (Test email)</label>
                        <input 
                          type="email" 
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                          placeholder="ejemplo@unsa.edu.pe"
                          className="w-full border border-slate-200 bg-white text-xs font-bold px-3 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple tracking-wide"
                        />
                      </div>

                      <button 
                        onClick={handleSendTestEmail}
                        disabled={sendingEmail}
                        className="w-full sm:w-auto bg-[#371283] hover:bg-[#2c0d6b] text-white text-xs font-bold py-2.5 px-6 rounded-lg shadow-md transition-all active:scale-[0.98] inline-flex items-center justify-center gap-1.5 shrink-0 select-none disabled:bg-slate-300 disabled:pointer-events-none"
                      >
                        {sendingEmail ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Generando Reporte Analítico AI...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Despachar Correo de Prueba</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simulation logs list if available */}
                    {emailDispatches.length > 0 && (
                      <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                        <h5 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Historial de Despachos en esta Sesión</h5>
                        <div className="max-h-40 overflow-y-auto space-y-2.5">
                          {emailDispatches.map(dispatch => (
                            <div key={dispatch.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                              <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-800">Match al {dispatch.percentScore}%</span> para <span className="font-semibold text-unsa-purple">{dispatch.talentName}</span> ({dispatch.matchedRole})
                                </div>
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium font-mono flex items-center gap-3">
                                <span>Destinatario: {dispatch.recipient}</span>
                                <span>|</span>
                                <span>Envio: {dispatch.sentAt} p.m.</span>
                                <button 
                                  onClick={() => {
                                    setLatestDispatch(dispatch);
                                    setShowEmailModal(true);
                                  }}
                                  className="text-unsa-purple hover:underline font-bold bg-white px-2 py-1 border rounded"
                                >
                                  Ver Email
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* System Technical Audit log table */}
                  <section className="md:col-span-12 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-hidden">
                    <h4 className="font-bold text-lg text-[#0a1a3e] tracking-tight mb-4">Registros de Auditoría del Ecosistema</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs font-sans">
                        <thead className="bg-[#f8fafc] text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200/60">
                          <tr>
                            <th className="py-3 px-5">TIMESTAMP</th>
                            <th className="py-3 px-5">EVENTO DE SISTEMA</th>
                            <th className="py-3 px-5">ACTOR</th>
                            <th className="py-3 px-5">ESTADO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic">
                          {auditLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-5 text-slate-450 font-mono font-medium">{log.timestamp}</td>
                              <td className="py-3 px-5 font-medium text-slate-700">{log.event}</td>
                              <td className="py-3 px-5">
                                <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-mono text-[10px] tracking-tight">{log.actor}</span>
                              </td>
                              <td className="py-3 px-5 font-bold">
                                {log.status === "OK" ? (
                                  <span className="text-emerald-600 inline-flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> OK
                                  </span>
                                ) : (
                                  <span className="text-match-crimson inline-flex items-center gap-1">
                                    <AlertTriangle className="w-3.5 h-3.5" /> FASCÍCULO ERRONEO
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* View - tab: TALENTO */}
            {activeTab === "talento" && (
              <div className="space-y-8 animate-fade-in">
                {/* View Banner Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Portal de Talento Verificado</h2>
                    <p className="text-slate-500 text-sm mt-1">Inspeccione expedientes académicos inmutables del Ground Truth y actualice de manera controlada vectores de habilidades.</p>
                  </div>
                </div>

                {/* Main panel layout: split selector and details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Selector Rail */}
                  <div className="md:col-span-4 space-y-3.5">
                    <h3 className="font-bold text-xs tracking-wider uppercase text-slate-400">Elegir un perfil egresado</h3>
                    
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {talents.map(talent => (
                        <div 
                          key={talent.id}
                          onClick={() => setSelectedStudentId(talent.id)}
                          className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                            selectedStudentId === talent.id 
                              ? "bg-white border-[#371283] shadow-md shadow-[#371283]/5" 
                              : "bg-white border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm text-slate-900">{talent.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide ${
                              talent.isAvailable ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-slate-100 text-slate-400"
                            }`}>
                              {talent.isAvailable ? "Buscando Activo" : "Inactivo"}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 font-semibold mb-2">{talent.school}</div>
                          
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {talent.skills.slice(0, 3).map((s, idx) => (
                              <span key={idx} className="bg-slate-50 border border-slate-150 text-[10px] text-slate-600 px-2 py-0.5 rounded-lg font-medium">{s}</span>
                            ))}
                            {talent.skills.length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold">+{talent.skills.length - 3}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Student Details card containing Ground Truth locks */}
                  <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6.5 shadow-sm space-y-6">
                    {/* Header profile detailing */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-indigo-50 pb-5">
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Cotejo Egresado de Grado</p>
                        <h4 className="text-2xl font-black text-slate-950 tracking-tight">{selectedStudent.name}</h4>
                        <span className="text-xs text-slate-500 font-semibold">{selectedStudent.email}</span>
                      </div>

                      {/* Availability toggle control */}
                      <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-150 shrink-0">
                        <span className="text-xs font-semibold text-slate-500">¿Estado Búsqueda Activa?</span>
                        <button 
                          onClick={() => handleUpdateStudentState(selectedStudent.id, selectedStudent.skills, !selectedStudent.isAvailable)}
                          className={`w-11 h-6 rounded-full p-1 transition-all focus:outline-none ${
                            selectedStudent.isAvailable ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white transition-all transform ${
                            selectedStudent.isAvailable ? "translate-x-5" : "translate-x-0"
                          }`}></div>
                        </button>
                      </div>
                    </div>

                    {/* Section Inmutable Ground Truth file */}
                    <div className="space-y-3.5 bg-[#f8fafc] border border-slate-200/80 p-5 rounded-2xl">
                      <div className="flex items-center gap-2 text-unsa-purple">
                        <Lock className="w-4 h-4 text-match-crimson" />
                        <h5 className="text-xs font-bold uppercase tracking-wider">Historial Académico Inmutable (Ground Truth UNSA)</h5>
                      </div>
                      <p className="text-[11px] text-slate-400 italic leading-snug">
                        Esta sección contiene datos validados directamente por registros de matrícula UNSA y está bloqueada bajo control de firma administrativa. No editable.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-white rounded-xl border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Escuela Profesional</span>
                          <span className="text-xs font-bold text-[#0a1a3e]">{selectedStudent.school}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">GPA (Rango UNSA)</span>
                          <span className="text-xs font-bold text-[#0a1a3e]">{selectedStudent.gpa} / 20 puntos ({selectedStudent.percentile})</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Plan de Estudios</span>
                          <span className="text-xs font-semibold text-[#0a1a3e]">{selectedStudent.plan}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-150">
                          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Mención de Honores</span>
                          <span className="text-xs font-semibold text-[#0a1a3e]">{selectedStudent.gradYear} Promoción de Salida</span>
                        </div>
                      </div>
                    </div>

                    {/* Editable Dynamic Habilidades Adicionales */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Actualización de Skills Extra-Académicos</h5>
                      
                      {/* Current skill items */}
                      <div className="flex flex-wrap gap-2">
                        {selectedStudent.skills.map((skill, id) => (
                          <div key={id} className="bg-indigo-50 border border-indigo-100 text-unsa-purple px-2.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 shadow-sm select-none hover:bg-indigo-100 transition-colors">
                            <span>{skill}</span>
                            <button 
                              onClick={() => handleRemoveStudentSkill(selectedStudent, skill)}
                              className="text-unsa-purple hover:text-match-crimson focus:outline-none"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Append skill form */}
                      <div className="flex gap-2.5 max-w-sm">
                        <input 
                          type="text" 
                          placeholder="Añadir herramienta (ej. Spark, React)" 
                          value={newSkillInput}
                          onChange={(e) => setNewSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddStudentSkill(selectedStudent)}
                          className="flex-1 border border-slate-200 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-unsa-purple font-semibold"
                        />
                        <button 
                          onClick={() => handleAddStudentSkill(selectedStudent)}
                          className="bg-unsa-purple hover:bg-[#2c0d6b] text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-[0.98]"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>

                    {/* Bio Experience Statement */}
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Herramientas & Experiencia Menciones</h5>
                      <p className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-150 leading-relaxed font-medium">
                        {selectedStudent.experience}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View - tab: INDUSTRIA */}
            {activeTab === "industria" && (
              <div className="space-y-8 animate-fade-in">
                {/* View Banner Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">Portal de Reclutamiento Cerrado</h2>
                    <p className="text-slate-500 text-sm mt-1">Publique ofertas de empleo mediante formularios de taxonomía rígida (Fricción Positiva) para un emparejamiento semántico libre de sesgo.</p>
                  </div>
                </div>

                {/* Sub-panels Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Side: Create Job offer with positive friction */}
                  <div className="md:col-span-7 bg-white border border-slate-200 rounded-2xl p-6.5 shadow-sm space-y-6">
                    <h3 className="font-bold text-lg text-[#0a1a3e] tracking-tight border-b border-indigo-50 pb-3">Formulario con Fricción de Estructuración Obligatoria</h3>
                    
                    <form onSubmit={handlePostVacancy} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Título del Puesto</label>
                          <input 
                            type="text" 
                            required
                            placeholder="ej. Senior Data Scientist"
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            className="w-full border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Empresa Regulada (RUC)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="ej. TechCorp SAC"
                            value={newJobCompany}
                            onChange={(e) => setNewJobCompany(e.target.value)}
                            className="w-full border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple font-semibold"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Ubicación / Modalidad</label>
                        <select 
                          value={newJobLocation}
                          onChange={(e) => setNewJobLocation(e.target.value)}
                          className="w-full border border-slate-200 bg-white text-xs font-semibold px-3.5 py-2.5 rounded-lg focus:outline-none text-slate-700"
                        >
                          <option>Arequipa (Híbrido)</option>
                          <option>Arequipa (Presencial)</option>
                          <option>Remoto</option>
                          <option>Lima (Híbrido)</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Salario Mínimo (S/.)</label>
                          <input 
                            type="number"
                            value={newJobMinSalary}
                            onChange={(e) => setNewJobMinSalary(Number(e.target.value))}
                            className="w-full border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Salario Máximo (S/.)</label>
                          <input 
                            type="number"
                            value={newJobMaxSalary}
                            onChange={(e) => setNewJobMaxSalary(Number(e.target.value))}
                            className="w-full border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Descripción del Puesto</label>
                        <textarea 
                          rows={3}
                          placeholder="Funciones claves del rol, expectativas de liderazgo y competencias..."
                          value={newJobDesc}
                          onChange={(e) => setNewJobDesc(e.target.value)}
                          className="w-full border border-slate-200 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-unsa-purple font-medium"
                        ></textarea>
                      </div>

                      {/* Required Technical Skills builder */}
                      <div className="space-y-2 border-t border-indigo-50 pt-4">
                        <label className="text-[11px] font-bold text-slate-550 uppercase tracking-wide block">Habilidades Técnicas Requeridas (Estructuradas)</label>
                        
                        <div className="flex flex-wrap gap-2.5 mb-2.5">
                          {newJobSkills.length === 0 ? (
                            <span className="text-[11px] text-slate-400 italic">No asignado aún. Defina al menos una skill debajo.</span>
                          ) : (
                            newJobSkills.map((s, id) => (
                              <span key={id} className="bg-[#f50343]/10 border border-red-200 text-match-crimson text-xs font-bold px-2 py-1.5 rounded-xl inline-flex items-center gap-1">
                                <span>{s}</span>
                                <button 
                                  type="button"
                                  onClick={() => setNewJobSkills(newJobSkills.filter(item => item !== s))}
                                  className="hover:text-amber-500"
                                >
                                  <X className="w-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="ej. PyTorch, Next.js, JIRA"
                            value={tempSkillInput}
                            onChange={(e) => setTempSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTempSkill();
                              }
                            }}
                            className="flex-1 border border-slate-200 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-unsa-purple font-medium"
                          />
                          <button 
                            type="button"
                            onClick={handleAddTempSkill}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 rounded-lg focus:outline-none"
                          >
                            Asignar
                          </button>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        className="mt-6 w-full bg-[#371283] hover:bg-[#2c0d6b] text-white py-3.5 rounded-xl font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publicar Ofertas & Calcular Matches</span>
                      </button>
                    </form>
                  </div>

                  {/* Right Side: Identity regulado card & presets */}
                  <div className="md:col-span-5 space-y-6">
                    {/* Corporation card locked by RUC */}
                    <div className="bg-[#0a1a3e] rounded-2xl p-6 text-slate-350 shadow-xl border border-slate-800 space-y-4">
                      <div>
                        <span className="text-[10px] font-black tracking-widest text-[#a185f3] uppercase block mb-1">Cédula Corporativa</span>
                        <h4 className="text-lg font-black text-white">Ecosistema Reclutador UNSA</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-1">RUC: 20148529431 | Razón Social Certificada</p>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-400">
                        Como portal con filtros de acceso obligatorios, usted puede publicar convocatorias dirigidas única e individualmente a egresados verificados de la Universidad Nacional de San Agustín.
                      </p>

                      <div className="grid grid-cols-2 gap-3.5 pt-2">
                        <div className="bg-[#172e5a]/80 p-3 rounded-xl border border-[#21417c]/55">
                          <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5 font-sans">Uso Mensual</span>
                          <span className="text-sm font-bold text-white font-mono">14 Convocatorias</span>
                        </div>
                        <div className="bg-[#172e5a]/80 p-3 rounded-xl border border-[#21417c]/55">
                          <span className="text-[9px] font-bold text-slate-400 block tracking-wider uppercase mb-0.5 font-sans">Graduados Validados</span>
                          <span className="text-sm font-bold text-white font-mono">9,179 en Red</span>
                        </div>
                      </div>
                    </div>

                    {/* Presets cloning workspace templates */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6.5 shadow-sm space-y-4">
                      <h4 className="font-bold text-sm text-slate-800 uppercase tracking-wide border-b border-indigo-50 pb-2.5">Plantilla de Roles Comunes (Clonar)</h4>
                      <p className="text-xs text-slate-400">
                        Clone perfiles estándar en un solo clic para acelerar la búsqueda y recomputar de inmediato.
                      </p>

                      <div className="space-y-2.5">
                        <button 
                          onClick={() => {
                            setNewJobTitle("QA Automation Engineer");
                            setNewJobCompany("Devs Peru S.A.C");
                            setNewJobDesc("Automatización de pruebas de integración usando Selenium y Postman.");
                            setNewJobSkills(["React", "TypeScript", "SQL", "Git", "Selenium"]);
                            triggerToast("📋 Plantilla 'QA Automation' cargada en el formulario.");
                          }}
                          className="w-full text-left p-3 border border-slate-150 hover:border-unsa-purple rounded-xl text-xs font-semibold flex justify-between items-center transition-all bg-white cursor-pointer select-none"
                        >
                          <span>QA Automation Engineer</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                        
                        <button 
                          onClick={() => {
                            setNewJobTitle("Fullstack React Specialist");
                            setNewJobCompany("Innovatech Peru S.A.C");
                            setNewJobDesc("Desarrollo de portales responsivos modernos con React, Tailwind CSS y Node.js.");
                            setNewJobSkills(["React", "TypeScript", "Tailwind CSS", "Next.js", "Node.js", "PostgreSQL"]);
                            triggerToast("📋 Plantilla 'Fullstack Specialist' cargada en el formulario.");
                          }}
                          className="w-full text-left p-3 border border-slate-150 hover:border-unsa-purple rounded-xl text-xs font-semibold flex justify-between items-center transition-all bg-white cursor-pointer select-none"
                        >
                          <span>Fullstack React Specialist</span>
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {/* Institutional copyright footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-5 px-6 md:px-10 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 font-medium shrink-0">
          <div className="text-center md:text-left mb-2.5 md:mb-0">
            © 2024 SkillMatch UNSA • Universidad Nacional de San Agustín. Oficina de Egresabilidad y Red Alumni.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-match-crimson underline transition-colors">Normas de Privacidad</a>
            <a href="#" className="hover:text-match-crimson underline transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-match-crimson underline transition-colors">Contacto</a>
            <a href="#" className="hover:text-match-crimson underline transition-colors">Portal Académico</a>
          </div>
        </footer>
      </div>

      {/* Simulator Modal for Test Email Dispatch with HTML template visualization */}
      {showEmailModal && latestDispatch && (
        <div className="fixed inset-0 z-50 bg-[#0a1a3e]/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-100 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#0a1a3e] text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-match-crimson animate-pulse shrink-0" />
                <div>
                  <h4 className="font-bold text-sm font-sans tracking-tight">Simulador de Transmisión de Correos UNSA</h4>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Reporte Generado por Inteligencia Artificial</p>
                </div>
              </div>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Email Envelope headers */}
            <div className="bg-white border-b border-slate-200 p-4 shrink-0 text-xs space-y-2">
              <div>
                <span className="font-bold text-slate-500 w-16 inline-block">De:</span>
                <span className="text-[#371283] font-bold">SkillMatch UNSA Intelligent Agent &lt;noreply@unsa.edu.pe&gt;</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 w-16 inline-block">Para:</span>
                <span className="text-slate-800 font-bold font-mono bg-slate-50 px-2 py-0.5 border rounded">{latestDispatch.recipient}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 w-16 inline-block">Asunto:</span>
                <span className="text-slate-900 font-bold">{latestDispatch.subject}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 w-16 inline-block">Filtro:</span>
                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">Transmision Auténtica OK</span>
              </div>
            </div>

            {/* Email HTML simulated body frame */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-250">
              <div 
                className="shadow-md"
                dangerouslySetInnerHTML={{ __html: latestDispatch.htmlContent }}
              />
            </div>

            {/* Modal footer closing trigger */}
            <div className="bg-white px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
              <button 
                onClick={() => setShowEmailModal(false)}
                className="bg-[#0a1a3e] hover:bg-[#1a2f5c] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow transition-all active:scale-[0.98]"
              >
                Cerrar Visor Simulado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
