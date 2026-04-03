import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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

interface FileDbShape {
  customers: CustomerRecord[];
  orders: OrderRecord[];
  licenses: LicenseRecord[];
  webhook_events: WebhookEventRecord[];
  magic_link_tokens: MagicLinkTokenRecord[];
  admin_actions: unknown[];
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
  findActiveLicenseByOrderId(orderId: string): Promise<LicenseRecord | null>;
  createLicense(input: Omit<LicenseRecord, "id" | "createdAt" | "updatedAt">): Promise<LicenseRecord>;
  listLicensesByCustomerEmail(email: string): Promise<LicenseRecord[]>;
  getLicenseByLicenseIdForEmail(licenseId: string, email: string): Promise<LicenseRecord | null>;
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

  return JSON.parse(fs.readFileSync(filePath, "utf8")) as FileDbShape;
}

function writeFileDb(filePath: string, value: FileDbShape): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + "\n", "utf8");
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

  async findActiveLicenseByOrderId(orderId: string): Promise<LicenseRecord | null> {
    const db = this.read();
    return db.licenses.find((license) => license.orderId === orderId && license.status === "active") ?? null;
  }

  async createLicense(input: Omit<LicenseRecord, "id" | "createdAt" | "updatedAt">): Promise<LicenseRecord> {
    const db = this.read();
    const created: LicenseRecord = {
      ...input,
      id: newId("licrec"),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.licenses.push(created);
    this.write(db);
    return created;
  }

  async listLicensesByCustomerEmail(email: string): Promise<LicenseRecord[]> {
    const db = this.read();
    const customer = db.customers.find((item) => item.email === email);
    if (!customer) return [];
    return db.licenses
      .filter((license) => license.customerId === customer.id)
      .sort((a, b) => Date.parse(b.issuedAt) - Date.parse(a.issuedAt));
  }

  async getLicenseByLicenseIdForEmail(licenseId: string, email: string): Promise<LicenseRecord | null> {
    const licenses = await this.listLicensesByCustomerEmail(email);
    return licenses.find((license) => license.licenseId === licenseId) ?? null;
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

async function createPrismaDb(): Promise<LicenseHubDb> {
  const prismaModule = await import("@prisma/client");
  const prisma = new prismaModule.PrismaClient();

  return {
    async getWebhookEvent(provider, eventId) {
      return prisma.webhookEvent.findUnique({
        where: {
          provider_eventId: {
            provider,
            eventId,
          },
        },
      }) as unknown as WebhookEventRecord | null;
    },
    async createWebhookEvent(input) {
      return prisma.webhookEvent.create({
        data: {
          provider: input.provider,
          eventId: input.eventId,
          eventType: input.eventType,
          payloadJson: input.payloadJson as object,
          status: "received",
        },
      }) as unknown as WebhookEventRecord;
    },
    async markWebhookEvent(id, patch) {
      return prisma.webhookEvent.update({
        where: { id },
        data: patch,
      }) as unknown as WebhookEventRecord;
    },
    async upsertCustomer(input) {
      return prisma.customer.upsert({
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
      }) as unknown as CustomerRecord;
    },
    async getCustomerByEmail(email) {
      return prisma.customer.findUnique({
        where: { email },
      }) as unknown as CustomerRecord | null;
    },
    async upsertOrder(input) {
      return prisma.order.upsert({
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
      }) as unknown as OrderRecord;
    },
    async findActiveLicenseByOrderId(orderId) {
      return prisma.license.findFirst({
        where: {
          orderId,
          status: "active",
        },
        orderBy: {
          createdAt: "desc",
        },
      }) as unknown as LicenseRecord | null;
    },
    async createLicense(input) {
      return prisma.license.create({
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
          payloadJson: input.payloadJson as object,
          signedLicenseJson: input.signedLicenseJson as object,
          signatureBase64: input.signatureBase64,
          customerId: input.customerId,
          orderId: input.orderId,
          supersedesLicenseId: input.supersedesLicenseId ?? null,
          supersededAt: input.supersededAt ? new Date(input.supersededAt) : null,
        },
      }) as unknown as LicenseRecord;
    },
    async listLicensesByCustomerEmail(email) {
      return prisma.license.findMany({
        where: {
          customer: {
            email,
          },
        },
        orderBy: {
          issuedAt: "desc",
        },
      }) as unknown as LicenseRecord[];
    },
    async getLicenseByLicenseIdForEmail(licenseId, email) {
      return prisma.license.findFirst({
        where: {
          licenseId,
          customer: {
            email,
          },
        },
      }) as unknown as LicenseRecord | null;
    },
    async createMagicLinkToken(input) {
      return prisma.magicLinkToken.create({
        data: {
          email: input.email,
          tokenHash: input.tokenHash,
          purpose: input.purpose,
          expiresAt: new Date(input.expiresAt),
          customerId: input.customerId ?? null,
        },
      }) as unknown as MagicLinkTokenRecord;
    },
    async getMagicLinkTokenByHash(tokenHash) {
      return prisma.magicLinkToken.findUnique({
        where: { tokenHash },
      }) as unknown as MagicLinkTokenRecord | null;
    },
    async consumeMagicLinkToken(id) {
      return prisma.magicLinkToken.update({
        where: { id },
        data: {
          consumedAt: new Date(),
        },
      }) as unknown as MagicLinkTokenRecord;
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
