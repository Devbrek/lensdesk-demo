import { randomUUID } from "crypto";

export { randomUUID as uuid };

export const DEMO_USER_ID = "user-demo-001";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MockUser = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
};

export type MockShooting = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  date: Date | null;
  status: string;
  createdAt: Date;
  userId: string;
};

export type MockChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  type: string;
  priority: number | null;
  createdAt: Date;
  shootingId: string;
  inventoryItemId: string | null;
};

export type MockNote = {
  id: string;
  content: string;
  shootingId: string;
};

export type MockInventoryItem = {
  id: string;
  label: string;
  type: string | null;
  createdAt: Date;
  userId: string;
};

// ─── Données fictives ────────────────────────────────────────────────────────

export const mockUsers: MockUser[] = [
  {
    id: "demo-user",

    name: "Léo Martin",

    email: "lens@mail.com",
    password: "lens123",
    createdAt: new Date("2025-01-15"),
  },
];

export const mockShootings: MockShooting[] = [
  {
    id: "shooting-001",
    title: "Mariage Dupont",
    description:
      "Cérémonie à la Mairie du 16e puis réception au Château de Vincennes",
    location: "Paris, 16e arrondissement",
    date: new Date("2026-07-12"),
    status: "confirmed",
    createdAt: new Date("2026-03-10"),
    userId: DEMO_USER_ID,
  },
  {
    id: "shooting-002",
    title: "Portrait Corporate – StartupXYZ",
    description: "Photos de profil LinkedIn pour l'équipe dirigeante",
    location: "Studio Lumière, Boulogne-Billancourt",
    date: new Date("2026-06-03"),
    status: "draft",
    createdAt: new Date("2026-04-20"),
    userId: DEMO_USER_ID,
  },
  {
    id: "shooting-003",
    title: "Catalogue Mode Printemps",
    description: "Shooting mode en extérieur pour collection printemps",
    location: "Jardins du Palais-Royal, Paris",
    date: new Date("2026-05-28"),
    status: "confirmed",
    createdAt: new Date("2026-04-01"),
    userId: DEMO_USER_ID,
  },
];

export const mockChecklistItems: MockChecklistItem[] = [
  {
    id: "cl-001",
    label: "Sony A7IV",
    checked: true,
    type: "materiel",
    priority: 1,
    createdAt: new Date("2026-03-10"),
    shootingId: "shooting-001",
    inventoryItemId: "inv-001",
  },
  {
    id: "cl-002",
    label: "Canon 85mm f/1.4",
    checked: false,
    type: "materiel",
    priority: 1,
    createdAt: new Date("2026-03-10"),
    shootingId: "shooting-001",
    inventoryItemId: "inv-002",
  },
  {
    id: "cl-003",
    label: "Flash Godox V1",
    checked: false,
    type: "materiel",
    priority: 2,
    createdAt: new Date("2026-03-10"),
    shootingId: "shooting-001",
    inventoryItemId: "inv-004",
  },
  {
    id: "cl-004",
    label: "Contrat signé",
    checked: true,
    type: "action",
    priority: 1,
    createdAt: new Date("2026-03-11"),
    shootingId: "shooting-001",
    inventoryItemId: null,
  },
  {
    id: "cl-005",
    label: "Repérage du lieu",
    checked: false,
    type: "action",
    priority: 2,
    createdAt: new Date("2026-03-11"),
    shootingId: "shooting-001",
    inventoryItemId: null,
  },
  {
    id: "cl-006",
    label: "Batteries NP-FZ100 x4",
    checked: false,
    type: "materiel",
    priority: 2,
    createdAt: new Date("2026-03-12"),
    shootingId: "shooting-001",
    inventoryItemId: "inv-005",
  },
  {
    id: "cl-007",
    label: "Sony A7IV",
    checked: false,
    type: "materiel",
    priority: 1,
    createdAt: new Date("2026-04-20"),
    shootingId: "shooting-002",
    inventoryItemId: "inv-001",
  },
  {
    id: "cl-008",
    label: "Envoyer devis",
    checked: true,
    type: "action",
    priority: 1,
    createdAt: new Date("2026-04-20"),
    shootingId: "shooting-002",
    inventoryItemId: null,
  },
  {
    id: "cl-009",
    label: "Canon 85mm f/1.4",
    checked: false,
    type: "materiel",
    priority: 1,
    createdAt: new Date("2026-04-01"),
    shootingId: "shooting-003",
    inventoryItemId: "inv-002",
  },
  {
    id: "cl-010",
    label: "Réflecteur 5-en-1 80cm",
    checked: false,
    type: "materiel",
    priority: 2,
    createdAt: new Date("2026-04-01"),
    shootingId: "shooting-003",
    inventoryItemId: "inv-008",
  },
];

export const mockNotes: MockNote[] = [
  {
    id: "note-001",
    content:
      "La mariée veut des photos en lumière naturelle. Prévoir réflecteur.",
    shootingId: "shooting-001",
  },
  {
    id: "note-002",
    content: "Arriver 1h avant pour installer. Code parking : A-47.",
    shootingId: "shooting-001",
  },
  {
    id: "note-003",
    content: "PDG en réunion jusqu'à 10h, commencer par les équipes.",
    shootingId: "shooting-002",
  },
];

export const mockInventoryItems: MockInventoryItem[] = [
  {
    id: "inv-001",
    label: "Sony A7IV",
    type: "appareil",
    createdAt: new Date("2025-01-15"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-002",
    label: "Canon EF 85mm f/1.4",
    type: "objectif",
    createdAt: new Date("2025-01-15"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-003",
    label: "Trépied Manfrotto",
    type: "accessoire",
    createdAt: new Date("2025-02-01"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-004",
    label: "Flash Godox V1",
    type: "éclairage",
    createdAt: new Date("2025-02-01"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-005",
    label: "Batteries NP-FZ100 x4",
    type: "accessoire",
    createdAt: new Date("2025-02-10"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-006",
    label: "Cartes SD SanDisk 256Go x3",
    type: "stockage",
    createdAt: new Date("2025-02-10"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-007",
    label: "Sac Peak Design 45L",
    type: "transport",
    createdAt: new Date("2025-03-01"),
    userId: DEMO_USER_ID,
  },
  {
    id: "inv-008",
    label: "Réflecteur 5-en-1 80cm",
    type: "éclairage",
    createdAt: new Date("2025-03-01"),
    userId: DEMO_USER_ID,
  },
];
