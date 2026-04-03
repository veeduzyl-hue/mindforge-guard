import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";
export type LicenseStatus = "active" | "superseded" | "revoked" | "expired";
export type WebhookStatus = "received" | "processed" | "ignored" | "error";
export type MagicLinkPurpose = "portal_access" | "download_license";

export interface CustomerRecord {
  id: string;
  email: string;
  name: string | null;
  externalCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRecord {
  id: string;
  externalOrderId: string;
  paymentProvider: string;
  status: OrderStatus;
  edition: string;
  amountCents: number | null;
  currency: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
}

export interface LicenseRecord {
  id: string;
  licenseId: string;
  schemaVersion: number;
  keyId: string;
  edition: string;
  status: LicenseStatus;
  subjectEmail: string;
  issuedAt: string;
  notBefore: string;
  notAfter: string;
  revokedAt: string | null;
  revokeReason: string | null;
  payloadJson: unknown;
  signedLicenseJson: unknown;
  signatureBase64: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  orderId: string;
  supersedesLicenseId: string | null;
  supersededAt: string | null;
}

export interface WebhookEventRecord {
  id: string;
  provider: string;
  eventId: string;
  eventType: string;
  status: WebhookStatus;
  payloadJson: unknown;
  processedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string | null;
  orderId: string | null;
  licenseId: string | null;
}

export interface MagicLinkTokenRecord {
  id: string;
  email: string;
  tokenHash: string;
  purpose: MagicLinkPurpose;
  expiresAt: string;
  consumedAt: string | null;
  createdAt: string;
  customerId: string | null;
}

export interface AdminActionRecord {
  id: string;
  actorEmail: string;
  actionType: string;
  targetType: string;
  targetId: string;
  payloadJson: unknown;
  createdAt: string;
  licenseId: string | null;
}

export interface LicenseUpdatePatch {
  schemaVersion?: number;
  keyId?: string;
  edition?: string;
  status?: LicenseStatus;
  subjectEmail?: string;
  issuedAt?: string;
  notBefore?: string;
  notAfter?: string;
  revokedAt?: string | null;
  revokeReason?: string | null;
  payloadJson?: unknown;
  signedLicenseJson?: unknown;
  signatureBase64?: string;
  supersedesLicenseId?: string | null;
  supersededAt?: string | null;
}

interface FileDbShape {
  customers: CustomerRecord[];
  orders: OrderRecord[];
  licenses: LicenseRecord[];
  webhook_events: WebhookEventRecord[];
  magic_link_tokens: MagicLinkTokenRecord[];
  admin_actions: AdminActionRecord[];
}

export interface LicenseHubDb {
  getWebhookEvent(provider: string, eventId: string): Promise<WebhookEventRecord | null>;
  createWebhookEvent(input: {
    provider: string;
    eventId: string;
    eventType: string;
    payloadJson: unknown;
  }): Promise<WebhookEventRecord>;
  markWebhookEvent(
    id: string,
    patch: Partial<
      Pick<
        WebhookEventRecord,
        "status" | "processedAt" | "errorMessage" | "customerId" | "orderId" | "licenseId"
      >
    >
  ): Promise<WebhookEventRecord>;
  upsertCustomer(input: {
    email: string;
    name?: string | null;
    externalCustomerId?: string | null;
  }): Promise<CustomerRecord>;
  getCustomerByEmail(email: string): Promise<CustomerRecord | null>;
  getCustomerById(id: string): Promise<CustomerRecord | null>;
  listCustomers(): Promise<CustomerRecord[]>;
  upsertOrder(input: {
    externalOrderId: string;
    paymentProvider: string;
    customerId: string;
    edition: string;
    amountCents?: number | null;
    currency?: string | null;
    status: OrderStatus;
    paidAt?: string | null;
  }): Promise<OrderRecord>;
  getOrderById(id: string): Promise<OrderRecord | null>;
  listOrders(): Promise<OrderRecord[]>;
  findActiveLicenseByOrderId(orderId: string): Promise<LicenseRecord | null>;
  createLicense(input: Omit<LicenseRecord, "id" | "createdAt" | "updatedAt">): Promise<LicenseRecord>;
  updateLicense(id: string, patch: LicenseUpdatePatch): Promise<LicenseRecord>;
  listLicenses(): Promise<LicenseRecord[]>;
  listLicensesByCustomerEmail(email: string): Promise<LicenseRecord[]>;
  getLicenseByLicenseId(licenseId: string): Promise<LicenseRecord | null>;
  getLicenseByLicenseIdForEmail(licenseId: string, email: string): Promise<LicenseRecord | null>;
  createAdminAction(input: {
    actorEmail: string;
    actionType: string;
    targetType: string;
    targetId: string;
    payloadJson: unknown;
    licenseId?: string | null;
  }): Promise<AdminActionRecord>;
  listAdminActionsByLicenseId(licenseId: string): Promise<AdminActionRecord[]>;
  createMagicLinkToken(input: {
    email: string;
    tokenHash: string;
    purpose: MagicLinkPurpose;
    expiresAt: string;
    customerId?: string | null;
  }): Promise<MagicLinkTokenRecord>;
  getMagicLinkTokenByHash(tokenHash: string): Promise<MagicLinkTokenRecord | null>;
  consumeMagicLinkToken(id: string): Promise<MagicLinkTokenRecord>;
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function defaultFileDbPath(): string {
  return path.join(process.cwd(), ".mindforge", "license-hub", "dev-db.json");
}

function normalizeLicenseRecord(record: LicenseRecord): LicenseRecord {
  return {
    ...record,
    revokedAt: record.revokedAt ?? null,
    revokeReason: record.revokeReason ?? null,
    supersedesLicenseId: record.supersedesLicenseId ?? null,
    supersededAt: record.supersededAt ?? null,
  };
}

function readFileDb(filePath: string): FileDbShape {
  if (!fs.existsSync(filePath)) {
    return {
      customers: [],
      orders: [],
      licenses: [],
      webhook_events: [],
      magic_link_tokens: [],
      admin_actions: [],
    };
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<FileDbShape>;
  return {
    customers: raw.customers ?? [],
    orders: raw.orders ?? [],
    licenses: (raw.licenses ?? []).map(normalizeLicenseRecord),
    webhook_events: raw.webhook_events ?? [],
    magic_link_tokens: raw.magic_link_tokens ?? [],
    admin_actions: raw.admin_actions ?? [],
  };
}

function writeFileDb(filePath: string, value: FileDbShape): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function sortByCreatedDesc<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

function sortByIssuedDesc(items: LicenseRecord[]): LicenseRecord[] {
  return [...items].sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
}

class FileLicenseHubDb implements LicenseHubDb {
  constructor(private readonly filePath: string) {}

  private read(): FileDbShape {
    return readFileDb(this.filePath);
  }

  private write(value: FileDbShape): void {
    writeFileDb(this.filePath, value);
  }

  async getWebhookEvent(provider: string, eventId: string): Promise<WebhookEventRecord | null> {
    const db = this.read();
    return db.webhook_events.find((event) => event.provider === provider && event.eventId === eventId) ?? null;
  }

  async createWebhookEvent(input: {
    provider: string;
    eventId: string;
    eventType: string;
    payloadJson: unknown;
  }): Promise<WebhookEventRecord> {
    const db = this.read();
    const existing = db.webhook_events.find(
      (event) => event.provider === input.provider && event.eventId === input.eventId
    );
    if (existing) {
      return existing;
    }

    const event: WebhookEventRecord = {
      id: newId("whe"),
      provider: input.provider,
      eventId: input.eventId,
      eventType: input.eventType,
      status: "received",
      payloadJson: input.payloadJson,
      processedAt: null,
      errorMessage: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      customerId: null,
      orderId: null,
      licenseId: null,
    };

    db.webhook_events.push(event);
    this.write(db);
    return event;
  }

  async markWebhookEvent(
    id: string,
    patch: Partial<
      Pick<
        WebhookEventRecord,
        "status" | "processedAt" | "errorMessage" | "customerId" | "orderId" | "licenseId"
      >
    >
  ): Promise<WebhookEventRecord> {
    const db = this.read();
    const index = db.webhook_events.findIndex((event) => event.id === id);
    if (index === -1) {
      throw new Error(`webhook event not found: ${id}`);
    }

    db.webhook_events[index] = {
      ...db.webhook_events[index],
      ...patch,
      updatedAt: nowIso(),
    };

    this.write(db);
    return db.webhook_events[index];
  }

  async upsertCustomer(input: {
    email: string;
    name?: string | null;
    externalCustomerId?: string | null;
  }): Promise<CustomerRecord> {
    const db = this.read();
    const existing = db.customers.find((customer) => customer.email === input.email);
    if (existing) {
      existing.name = input.name ?? existing.name;
      existing.externalCustomerId = input.externalCustomerId ?? existing.externalCustomerId;
      existing.updatedAt = nowIso();
      this.write(db);
      return existing;
    }

    const created: CustomerRecord = {
      id: newId("cus"),
      email: input.email,
      name: input.name ?? null,
      externalCustomerId: input.externalCustomerId ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.customers.push(created);
    this.write(db);
    return created;
  }

  async getCustomerByEmail(email: string): Promise<CustomerRecord | null> {
    const db = this.read();
    return db.customers.find((customer) => customer.email === email) ?? null;
  }

  async getCustomerById(id: string): Promise<CustomerRecord | null> {
    const db = this.read();
    return db.customers.find((customer) => customer.id === id) ?? null;
  }

  async listCustomers(): Promise<CustomerRecord[]> {
    return sortByCreatedDesc(this.read().customers);
  }

  async upsertOrder(input: {
    externalOrderId: string;
    paymentProvider: string;
    customerId: string;
    edition: string;
    amountCents?: number | null;
    currency?: string | null;
    status: OrderStatus;
    paidAt?: string | null;
  }): Promise<OrderRecord> {
    const db = this.read();
    const existing = db.orders.find((order) => order.externalOrderId === input.externalOrderId);
    if (existing) {
      existing.paymentProvider = input.paymentProvider;
      existing.customerId = input.customerId;
      existing.edition = input.edition;
      existing.amountCents = input.amountCents ?? existing.amountCents;
      existing.currency = input.currency ?? existing.currency;
      existing.status = input.status;
      existing.paidAt = input.paidAt ?? existing.paidAt;
      existing.updatedAt = nowIso();
      this.write(db);
      return existing;
    }

    const created: OrderRecord = {
      id: newId("ord"),
      externalOrderId: input.externalOrderId,
      paymentProvider: input.paymentProvider,
      customerId: input.customerId,
      edition: input.edition,
      amountCents: input.amountCents ?? null,
      currency: input.currency ?? null,
      status: input.status,
      paidAt: input.paidAt ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.orders.push(created);
    this.write(db);
    return created;
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const db = this.read();
    return db.orders.find((order) => order.id === id) ?? null;
  }

  async listOrders(): Promise<OrderRecord[]> {
    return sortByCreatedDesc(this.read().orders);
  }

  async findActiveLicenseByOrderId(orderId: string): Promise<LicenseRecord | null> {
    const db = this.read();
    return db.licenses.find((license) => license.orderId === orderId && license.status === "active") ?? null;
  }

  async createLicense(input: Omit<LicenseRecord, "id" | "createdAt" | "updatedAt">): Promise<LicenseRecord> {
    const db = this.read();
    const created: LicenseRecord = normalizeLicenseRecord({
      ...input,
      id: newId("licrec"),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
    db.licenses.push(created);
    this.write(db);
    return created;
  }

  async updateLicense(id: string, patch: LicenseUpdatePatch): Promise<LicenseRecord> {
    const db = this.read();
    const index = db.licenses.findIndex((license) => license.id === id);
    if (index === -1) {
      throw new Error(`license not found: ${id}`);
    }

    db.licenses[index] = normalizeLicenseRecord({
      ...db.licenses[index],
      ...patch,
      updatedAt: nowIso(),
    });
    this.write(db);
    return db.licenses[index];
  }

  async listLicenses(): Promise<LicenseRecord[]> {
    return sortByIssuedDesc(this.read().licenses);
  }

  async listLicensesByCustomerEmail(email: string): Promise<LicenseRecord[]> {
    const db = this.read();
    const customer = db.customers.find((item) => item.email === email);
    if (!customer) return [];
    return sortByIssuedDesc(db.licenses.filter((license) => license.customerId === customer.id));
  }

  async getLicenseByLicenseId(licenseId: string): Promise<LicenseRecord | null> {
    const db = this.read();
    return db.licenses.find((license) => license.licenseId === licenseId) ?? null;
  }

  async getLicenseByLicenseIdForEmail(licenseId: string, email: string): Promise<LicenseRecord | null> {
    const licenses = await this.listLicensesByCustomerEmail(email);
    return licenses.find((license) => license.licenseId === licenseId) ?? null;
  }

  async createAdminAction(input: {
    actorEmail: string;
    actionType: string;
    targetType: string;
    targetId: string;
    payloadJson: unknown;
    licenseId?: string | null;
  }): Promise<AdminActionRecord> {
    const db = this.read();
    const record: AdminActionRecord = {
      id: newId("adm"),
      actorEmail: input.actorEmail,
      actionType: input.actionType,
      targetType: input.targetType,
      targetId: input.targetId,
      payloadJson: input.payloadJson,
      createdAt: nowIso(),
      licenseId: input.licenseId ?? null,
    };
    db.admin_actions.push(record);
    this.write(db);
    return record;
  }

  async listAdminActionsByLicenseId(licenseId: string): Promise<AdminActionRecord[]> {
    const db = this.read();
    return sortByCreatedDesc(db.admin_actions.filter((action) => action.licenseId === licenseId));
  }

  async createMagicLinkToken(input: {
    email: string;
    tokenHash: string;
    purpose: MagicLinkPurpose;
    expiresAt: string;
    customerId?: string | null;
  }): Promise<MagicLinkTokenRecord> {
    const db = this.read();
    const record: MagicLinkTokenRecord = {
      id: newId("mlt"),
      email: input.email,
      tokenHash: input.tokenHash,
      purpose: input.purpose,
      expiresAt: input.expiresAt,
      consumedAt: null,
      createdAt: nowIso(),
      customerId: input.customerId ?? null,
    };
    db.magic_link_tokens.push(record);
    this.write(db);
    return record;
  }

  async getMagicLinkTokenByHash(tokenHash: string): Promise<MagicLinkTokenRecord | null> {
    const db = this.read();
    return db.magic_link_tokens.find((token) => token.tokenHash === tokenHash) ?? null;
  }

  async consumeMagicLinkToken(id: string): Promise<MagicLinkTokenRecord> {
    const db = this.read();
    const index = db.magic_link_tokens.findIndex((token) => token.id === id);
    if (index === -1) {
      throw new Error(`magic link token not found: ${id}`);
    }
    db.magic_link_tokens[index] = {
      ...db.magic_link_tokens[index],
      consumedAt: nowIso(),
    };
    this.write(db);
    return db.magic_link_tokens[index];
  }
}

function asIsoString(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function mapCustomerRecord(value: Record<string, unknown>): CustomerRecord {
  return {
    id: String(value.id),
    email: String(value.email),
    name: value.name ? String(value.name) : null,
    externalCustomerId: value.externalCustomerId ? String(value.externalCustomerId) : null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
  };
}

function mapOrderRecord(value: Record<string, unknown>): OrderRecord {
  return {
    id: String(value.id),
    externalOrderId: String(value.externalOrderId),
    paymentProvider: String(value.paymentProvider),
    status: String(value.status) as OrderStatus,
    edition: String(value.edition),
    amountCents: typeof value.amountCents === "number" ? value.amountCents : null,
    currency: value.currency ? String(value.currency) : null,
    paidAt: asIsoString(value.paidAt),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
    customerId: String(value.customerId),
  };
}

function mapLicenseRecord(value: Record<string, unknown>): LicenseRecord {
  return {
    id: String(value.id),
    licenseId: String(value.licenseId),
    schemaVersion: Number(value.schemaVersion),
    keyId: String(value.keyId),
    edition: String(value.edition),
    status: String(value.status) as LicenseStatus,
    subjectEmail: String(value.subjectEmail),
    issuedAt: asIsoString(value.issuedAt) || nowIso(),
    notBefore: asIsoString(value.notBefore) || nowIso(),
    notAfter: asIsoString(value.notAfter) || nowIso(),
    revokedAt: asIsoString(value.revokedAt),
    revokeReason: value.revokeReason ? String(value.revokeReason) : null,
    payloadJson: value.payloadJson ?? null,
    signedLicenseJson: value.signedLicenseJson ?? null,
    signatureBase64: String(value.signatureBase64),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
    customerId: String(value.customerId),
    orderId: String(value.orderId),
    supersedesLicenseId: value.supersedesLicenseId ? String(value.supersedesLicenseId) : null,
    supersededAt: asIsoString(value.supersededAt),
  };
}

function mapWebhookEventRecord(value: Record<string, unknown>): WebhookEventRecord {
  return {
    id: String(value.id),
    provider: String(value.provider),
    eventId: String(value.eventId),
    eventType: String(value.eventType),
    status: String(value.status) as WebhookStatus,
    payloadJson: value.payloadJson ?? null,
    processedAt: asIsoString(value.processedAt),
    errorMessage: value.errorMessage ? String(value.errorMessage) : null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
    customerId: value.customerId ? String(value.customerId) : null,
    orderId: value.orderId ? String(value.orderId) : null,
    licenseId: value.licenseId ? String(value.licenseId) : null,
  };
}

function mapMagicLinkTokenRecord(value: Record<string, unknown>): MagicLinkTokenRecord {
  return {
    id: String(value.id),
    email: String(value.email),
    tokenHash: String(value.tokenHash),
    purpose: String(value.purpose) as MagicLinkPurpose,
    expiresAt: asIsoString(value.expiresAt) || nowIso(),
    consumedAt: asIsoString(value.consumedAt),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    customerId: value.customerId ? String(value.customerId) : null,
  };
}

function mapAdminActionRecord(value: Record<string, unknown>): AdminActionRecord {
  return {
    id: String(value.id),
    actorEmail: String(value.actorEmail),
    actionType: String(value.actionType),
    targetType: String(value.targetType),
    targetId: String(value.targetId),
    payloadJson: value.payloadJson ?? null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    licenseId: value.licenseId ? String(value.licenseId) : null,
  };
}

function mapLicensePatchForPrisma(patch: LicenseUpdatePatch): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (patch.schemaVersion !== undefined) data.schemaVersion = patch.schemaVersion;
  if (patch.keyId !== undefined) data.keyId = patch.keyId;
  if (patch.edition !== undefined) data.edition = patch.edition;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.subjectEmail !== undefined) data.subjectEmail = patch.subjectEmail;
  if (patch.issuedAt !== undefined) data.issuedAt = new Date(patch.issuedAt);
  if (patch.notBefore !== undefined) data.notBefore = new Date(patch.notBefore);
  if (patch.notAfter !== undefined) data.notAfter = new Date(patch.notAfter);
  if (patch.revokedAt !== undefined) data.revokedAt = patch.revokedAt ? new Date(patch.revokedAt) : null;
  if (patch.revokeReason !== undefined) data.revokeReason = patch.revokeReason;
  if (patch.payloadJson !== undefined) data.payloadJson = patch.payloadJson as object;
  if (patch.signedLicenseJson !== undefined) data.signedLicenseJson = patch.signedLicenseJson as object;
  if (patch.signatureBase64 !== undefined) data.signatureBase64 = patch.signatureBase64;
  if (patch.supersedesLicenseId !== undefined) data.supersedesLicenseId = patch.supersedesLicenseId;
  if (patch.supersededAt !== undefined) data.supersededAt = patch.supersededAt ? new Date(patch.supersededAt) : null;
  return data;
}

async function createPrismaDb(): Promise<LicenseHubDb> {
  const prismaModule = await import("@prisma/client");
  const prisma = new prismaModule.PrismaClient();

  return {
    async getWebhookEvent(provider, eventId) {
      const record = await prisma.webhookEvent.findUnique({
        where: {
          provider_eventId: {
            provider,
            eventId,
          },
        },
      });
      return record ? mapWebhookEventRecord(record as unknown as Record<string, unknown>) : null;
    },
    async createWebhookEvent(input) {
      const record = await prisma.webhookEvent.create({
        data: {
          provider: input.provider,
          eventId: input.eventId,
          eventType: input.eventType,
          payloadJson: input.payloadJson as object,
          status: "received",
        },
      });
      return mapWebhookEventRecord(record as unknown as Record<string, unknown>);
    },
    async markWebhookEvent(id, patch) {
      const record = await prisma.webhookEvent.update({
        where: { id },
        data: {
          ...patch,
          processedAt: patch.processedAt ? new Date(patch.processedAt) : patch.processedAt,
        },
      });
      return mapWebhookEventRecord(record as unknown as Record<string, unknown>);
    },
    async upsertCustomer(input) {
      const record = await prisma.customer.upsert({
        where: { email: input.email },
        update: {
          name: input.name ?? undefined,
          externalCustomerId: input.externalCustomerId ?? undefined,
        },
        create: {
          email: input.email,
          name: input.name ?? null,
          externalCustomerId: input.externalCustomerId ?? null,
        },
      });
      return mapCustomerRecord(record as unknown as Record<string, unknown>);
    },
    async getCustomerByEmail(email) {
      const record = await prisma.customer.findUnique({
        where: { email },
      });
      return record ? mapCustomerRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getCustomerById(id) {
      const record = await prisma.customer.findUnique({
        where: { id },
      });
      return record ? mapCustomerRecord(record as unknown as Record<string, unknown>) : null;
    },
    async listCustomers() {
      const records = await prisma.customer.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapCustomerRecord(record as unknown as Record<string, unknown>));
    },
    async upsertOrder(input) {
      const record = await prisma.order.upsert({
        where: { externalOrderId: input.externalOrderId },
        update: {
          paymentProvider: input.paymentProvider,
          customerId: input.customerId,
          edition: input.edition,
          amountCents: input.amountCents ?? null,
          currency: input.currency ?? null,
          status: input.status,
          paidAt: input.paidAt ? new Date(input.paidAt) : null,
        },
        create: {
          externalOrderId: input.externalOrderId,
          paymentProvider: input.paymentProvider,
          customerId: input.customerId,
          edition: input.edition,
          amountCents: input.amountCents ?? null,
          currency: input.currency ?? null,
          status: input.status,
          paidAt: input.paidAt ? new Date(input.paidAt) : null,
        },
      });
      return mapOrderRecord(record as unknown as Record<string, unknown>);
    },
    async getOrderById(id) {
      const record = await prisma.order.findUnique({
        where: { id },
      });
      return record ? mapOrderRecord(record as unknown as Record<string, unknown>) : null;
    },
    async listOrders() {
      const records = await prisma.order.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapOrderRecord(record as unknown as Record<string, unknown>));
    },
    async findActiveLicenseByOrderId(orderId) {
      const record = await prisma.license.findFirst({
        where: {
          orderId,
          status: "active",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return record ? mapLicenseRecord(record as unknown as Record<string, unknown>) : null;
    },
    async createLicense(input) {
      const record = await prisma.license.create({
        data: {
          licenseId: input.licenseId,
          schemaVersion: input.schemaVersion,
          keyId: input.keyId,
          edition: input.edition,
          status: input.status,
          subjectEmail: input.subjectEmail,
          issuedAt: new Date(input.issuedAt),
          notBefore: new Date(input.notBefore),
          notAfter: new Date(input.notAfter),
          revokedAt: input.revokedAt ? new Date(input.revokedAt) : null,
          revokeReason: input.revokeReason ?? null,
          payloadJson: input.payloadJson as object,
          signedLicenseJson: input.signedLicenseJson as object,
          signatureBase64: input.signatureBase64,
          customerId: input.customerId,
          orderId: input.orderId,
          supersedesLicenseId: input.supersedesLicenseId ?? null,
          supersededAt: input.supersededAt ? new Date(input.supersededAt) : null,
        },
      });
      return mapLicenseRecord(record as unknown as Record<string, unknown>);
    },
    async updateLicense(id, patch) {
      const record = await prisma.license.update({
        where: { id },
        data: mapLicensePatchForPrisma(patch),
      });
      return mapLicenseRecord(record as unknown as Record<string, unknown>);
    },
    async listLicenses() {
      const records = await prisma.license.findMany({
        orderBy: {
          issuedAt: "desc",
        },
      });
      return records.map((record) => mapLicenseRecord(record as unknown as Record<string, unknown>));
    },
    async listLicensesByCustomerEmail(email) {
      const records = await prisma.license.findMany({
        where: {
          customer: {
            email,
          },
        },
        orderBy: {
          issuedAt: "desc",
        },
      });
      return records.map((record) => mapLicenseRecord(record as unknown as Record<string, unknown>));
    },
    async getLicenseByLicenseId(licenseId) {
      const record = await prisma.license.findUnique({
        where: { licenseId },
      });
      return record ? mapLicenseRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getLicenseByLicenseIdForEmail(licenseId, email) {
      const record = await prisma.license.findFirst({
        where: {
          licenseId,
          customer: {
            email,
          },
        },
      });
      return record ? mapLicenseRecord(record as unknown as Record<string, unknown>) : null;
    },
    async createAdminAction(input) {
      const record = await prisma.adminAction.create({
        data: {
          actorEmail: input.actorEmail,
          actionType: input.actionType,
          targetType: input.targetType,
          targetId: input.targetId,
          payloadJson: input.payloadJson as object,
          licenseId: input.licenseId ?? null,
        },
      });
      return mapAdminActionRecord(record as unknown as Record<string, unknown>);
    },
    async listAdminActionsByLicenseId(licenseId) {
      const records = await prisma.adminAction.findMany({
        where: { licenseId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapAdminActionRecord(record as unknown as Record<string, unknown>));
    },
    async createMagicLinkToken(input) {
      const record = await prisma.magicLinkToken.create({
        data: {
          email: input.email,
          tokenHash: input.tokenHash,
          purpose: input.purpose,
          expiresAt: new Date(input.expiresAt),
          customerId: input.customerId ?? null,
        },
      });
      return mapMagicLinkTokenRecord(record as unknown as Record<string, unknown>);
    },
    async getMagicLinkTokenByHash(tokenHash) {
      const record = await prisma.magicLinkToken.findUnique({
        where: { tokenHash },
      });
      return record ? mapMagicLinkTokenRecord(record as unknown as Record<string, unknown>) : null;
    },
    async consumeMagicLinkToken(id) {
      const record = await prisma.magicLinkToken.update({
        where: { id },
        data: {
          consumedAt: new Date(),
        },
      });
      return mapMagicLinkTokenRecord(record as unknown as Record<string, unknown>);
    },
  };
}

export async function getLicenseHubDb(): Promise<LicenseHubDb> {
  const provider = process.env.LICENSE_HUB_DB_PROVIDER || "file";

  if (provider === "prisma") {
    return createPrismaDb();
  }

  return new FileLicenseHubDb(process.env.LICENSE_HUB_FILE_DB_PATH || defaultFileDbPath());
}
