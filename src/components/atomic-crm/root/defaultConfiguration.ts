import type { ConfigurationContextValue } from "./ConfigurationContext";
// Import the logos as module assets so Vite resolves their URL relative to the
// JS chunk (import.meta.url), not the current route. A plain "./logos/..." path
// breaks on nested routes like /oauth/consent and under a deployment sub-path.
import darkModeLogo from "./logos/logo_atomic_crm_dark.svg";
import lightModeLogo from "./logos/logo_atomic_crm_light.svg";

export const defaultDarkModeLogo = darkModeLogo;
export const defaultLightModeLogo = lightModeLogo;

export const defaultCurrency = "MAD";

export const defaultTitle = "Atomic CRM";

export const defaultCompanySectors = [
  { value: "communication-services", label: "Services de communication" },
  { value: "consumer-discretionary", label: "Biens de consommation" },
  { value: "consumer-staples", label: "Biens de première nécessité" },
  { value: "energy", label: "Énergie" },
  { value: "financials", label: "Services financiers" },
  { value: "health-care", label: "Santé" },
  { value: "industrials", label: "Industrie" },
  { value: "information-technology", label: "Technologies de l'information" },
  { value: "materials", label: "Matériaux" },
  { value: "real-estate", label: "Immobilier" },
  { value: "utilities", label: "Services publics" },
];

export const defaultDealStages = [
  { value: "opportunity", label: "Opportunité" },
  { value: "proposal-sent", label: "Proposition envoyée" },
  { value: "in-negociation", label: "En négociation" },
  { value: "won", label: "Gagné" },
  { value: "lost", label: "Perdu" },
  { value: "delayed", label: "Reporté" },
];

export const defaultDealPipelineStatuses = ["won"];

export const defaultDealCategories = [
  { value: "other", label: "Autre" },
  { value: "copywriting", label: "Rédaction" },
  { value: "print-project", label: "Projet d'impression" },
  { value: "ui-design", label: "Design d'interface" },
  { value: "website-design", label: "Création de site web" },
];

export const defaultNoteStatuses = [
  { value: "cold", label: "Froid", color: "#7dbde8" },
  { value: "warm", label: "Tiède", color: "#e8cb7d" },
  { value: "hot", label: "Chaud", color: "#e88b7d" },
  { value: "in-contract", label: "Sous contrat", color: "#a4e87d" },
];

export const defaultTaskTypes = [
  { value: "none", label: "Aucun" },
  { value: "email", label: "E-mail" },
  { value: "demo", label: "Démonstration" },
  { value: "lunch", label: "Déjeuner" },
  { value: "meeting", label: "Réunion" },
  { value: "follow-up", label: "Relance" },
  { value: "thank-you", label: "Remerciement" },
  { value: "ship", label: "Envoi" },
  { value: "call", label: "Appel" },
];

export const defaultConfiguration: ConfigurationContextValue = {
  companySectors: defaultCompanySectors,
  currency: defaultCurrency,
  dealCategories: defaultDealCategories,
  dealPipelineStatuses: defaultDealPipelineStatuses,
  dealStages: defaultDealStages,
  noteStatuses: defaultNoteStatuses,
  taskTypes: defaultTaskTypes,
  title: defaultTitle,
  darkModeLogo: defaultDarkModeLogo,
  lightModeLogo: defaultLightModeLogo,
};
