import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type LicenseStatus = "active" | "superseded" | "revoked" | "refund_revoked" | "expired";
export type WebhookStatus = "received" | "processed" | "ignored" | "error";
export type MagicLinkPurpose = "portal_access" | "download_license";
export type OrganizationMemberRole = "owner" | "admin" | "member";
export type OrganizationMemberStatus = "active" | "pending" | "removed";
export type SeatAssignmentStatus = "active" | "unassigned" | "pending";
export type ActivationStatus = "requested" | "confirmed" | "revoked" | "expired";

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
  externalPaymentId: string | null;
  externalSubscriptionId: string | null;
  amountCents: number | null;
  currency: string | null;
  paidAt: string | null;
  failedAt: string | null;
  refundedAt: string | null;
  cancelledAt: string | null;
  statusReason: string | null;
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

export interface SystemActionRecord {
  id: string;
  source: string;
  actionType: string;
  targetType: string;
  targetId: string;
  payloadJson: unknown;
  createdAt: string;
  orderId: string | null;
  licenseId: string | null;
  webhookEventId: string | null;
}

export interface OrganizationRecord {
  id: string;
  slug: string;
  name: string;
  billingEmail: string | null;
  createdAt: string;
  updatedAt: string;
  ownerCustomerId: string | null;
}

export interface OrganizationMemberRecord {
  id: string;
  organizationId: string;
  customerId: string | null;
  email: string;
  role: OrganizationMemberRole;
  status: OrganizationMemberStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SeatEntitlementRecord {
  id: string;
  organizationId: string;
  licenseId: string;
  edition: string;
  seatCount: number;
  activeFrom: string;
  activeUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeatAssignmentRecord {
  id: string;
  seatEntitlementId: string;
  organizationId: string;
  customerId: string | null;
  email: string;
  status: SeatAssignmentStatus;
  assignedByEmail: string | null;
  assignedAt: string;
  unassignedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivationRecord {
  id: string;
  activationId: string;
  licenseId: string;
  organizationId: string | null;
  customerId: string | null;
  requestedByEmail: string;
  deviceFingerprint: string;
  machineName: string | null;
  activationTokenHash: string | null;
  requestNonce: string | null;
  status: ActivationStatus;
  requestedAt: string;
  confirmedAt: string | null;
  lastSeenAt: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
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

export interface OrderUpdatePatch {
  paymentProvider?: string;
  status?: OrderStatus;
  edition?: string;
  externalPaymentId?: string | null;
  externalSubscriptionId?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  paidAt?: string | null;
  failedAt?: string | null;
  refundedAt?: string | null;
  cancelledAt?: string | null;
  statusReason?: string | null;
  customerId?: string;
}

interface FileDbShape {
  customers: CustomerRecord[];
  orders: OrderRecord[];
  licenses: LicenseRecord[];
  webhook_events: WebhookEventRecord[];
  magic_link_tokens: MagicLinkTokenRecord[];
  admin_actions: AdminActionRecord[];
  system_actions: SystemActionRecord[];
  organizations: OrganizationRecord[];
  organization_members: OrganizationMemberRecord[];
  seat_entitlements: SeatEntitlementRecord[];
  seat_assignments: SeatAssignmentRecord[];
  activation_records: ActivationRecord[];
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
    externalPaymentId?: string | null;
    externalSubscriptionId?: string | null;
    amountCents?: number | null;
    currency?: string | null;
    status: OrderStatus;
    paidAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
    cancelledAt?: string | null;
    statusReason?: string | null;
  }): Promise<OrderRecord>;
  updateOrder(id: string, patch: OrderUpdatePatch): Promise<OrderRecord>;
  getOrderById(id: string): Promise<OrderRecord | null>;
  getOrderByExternalOrderId(externalOrderId: string): Promise<OrderRecord | null>;
  getOrderByExternalPaymentId(externalPaymentId: string): Promise<OrderRecord | null>;
  getOrderByExternalSubscriptionId(externalSubscriptionId: string): Promise<OrderRecord | null>;
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
  createSystemAction(input: {
    source: string;
    actionType: string;
    targetType: string;
    targetId: string;
    payloadJson: unknown;
    orderId?: string | null;
    licenseId?: string | null;
    webhookEventId?: string | null;
  }): Promise<SystemActionRecord>;
  listSystemActionsByOrderId(orderId: string): Promise<SystemActionRecord[]>;
  createMagicLinkToken(input: {
    email: string;
    tokenHash: string;
    purpose: MagicLinkPurpose;
    expiresAt: string;
    customerId?: string | null;
  }): Promise<MagicLinkTokenRecord>;
  getMagicLinkTokenByHash(tokenHash: string): Promise<MagicLinkTokenRecord | null>;
  consumeMagicLinkToken(id: string): Promise<MagicLinkTokenRecord>;
  listOrdersByCustomerEmail(email: string): Promise<OrderRecord[]>;
  ensureOrganizationForCustomer(input: {
    customerId: string;
    customerEmail: string;
    customerName?: string | null;
  }): Promise<OrganizationRecord>;
  getOrganizationById(id: string): Promise<OrganizationRecord | null>;
  getOrganizationForCustomerEmail(email: string): Promise<OrganizationRecord | null>;
  listOrganizationMembers(organizationId: string): Promise<OrganizationMemberRecord[]>;
  listSeatEntitlementsByOrganizationId(organizationId: string): Promise<SeatEntitlementRecord[]>;
  listSeatAssignmentsByOrganizationId(organizationId: string): Promise<SeatAssignmentRecord[]>;
  assignSeat(input: {
    organizationId: string;
    licenseId: string;
    email: string;
    assignedByEmail: string;
    customerId?: string | null;
  }): Promise<SeatAssignmentRecord>;
  unassignSeat(input: {
    organizationId: string;
    licenseId: string;
    email: string;
  }): Promise<SeatAssignmentRecord>;
  createActivationRecord(input: {
    activationId: string;
    licenseId: string;
    organizationId?: string | null;
    customerId?: string | null;
    requestedByEmail: string;
    deviceFingerprint: string;
    machineName?: string | null;
    activationTokenHash?: string | null;
    requestNonce?: string | null;
  }): Promise<ActivationRecord>;
  getActivationRecordByActivationId(activationId: string): Promise<ActivationRecord | null>;
  confirmActivationRecord(
    activationId: string,
    patch?: {
      lastSeenAt?: string | null;
    }
  ): Promise<ActivationRecord>;
}

function nowIso(): string {
  return new Date().toISOString();
}

function newId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function slugify(value: string): string {
  return String(value || "organization")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "organization";
}

function defaultFileDbPath(): string {
  return path.join(process.cwd(), ".mindforge", "license-hub", "dev-db.json");
}

function normalizeOrderRecord(record: OrderRecord): OrderRecord {
  return {
    ...record,
    externalPaymentId: record.externalPaymentId ?? null,
    externalSubscriptionId: record.externalSubscriptionId ?? null,
    paidAt: record.paidAt ?? null,
    failedAt: record.failedAt ?? null,
    refundedAt: record.refundedAt ?? null,
    cancelledAt: record.cancelledAt ?? null,
    statusReason: record.statusReason ?? null,
  };
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

function normalizeOrganizationRecord(record: OrganizationRecord): OrganizationRecord {
  return {
    ...record,
    billingEmail: record.billingEmail ?? null,
    ownerCustomerId: record.ownerCustomerId ?? null,
  };
}

function normalizeOrganizationMemberRecord(record: OrganizationMemberRecord): OrganizationMemberRecord {
  return {
    ...record,
    customerId: record.customerId ?? null,
  };
}

function normalizeSeatEntitlementRecord(record: SeatEntitlementRecord): SeatEntitlementRecord {
  return {
    ...record,
    seatCount: record.seatCount ?? 1,
    activeUntil: record.activeUntil ?? null,
  };
}

function normalizeSeatAssignmentRecord(record: SeatAssignmentRecord): SeatAssignmentRecord {
  return {
    ...record,
    customerId: record.customerId ?? null,
    assignedByEmail: record.assignedByEmail ?? null,
    unassignedAt: record.unassignedAt ?? null,
  };
}

function normalizeActivationRecord(record: ActivationRecord): ActivationRecord {
  return {
    ...record,
    organizationId: record.organizationId ?? null,
    customerId: record.customerId ?? null,
    machineName: record.machineName ?? null,
    activationTokenHash: record.activationTokenHash ?? null,
    requestNonce: record.requestNonce ?? null,
    confirmedAt: record.confirmedAt ?? null,
    lastSeenAt: record.lastSeenAt ?? null,
    revokedAt: record.revokedAt ?? null,
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
      system_actions: [],
      organizations: [],
      organization_members: [],
      seat_entitlements: [],
      seat_assignments: [],
      activation_records: [],
    };
  }

  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as Partial<FileDbShape>;
  return {
    customers: raw.customers ?? [],
    orders: (raw.orders ?? []).map(normalizeOrderRecord),
    licenses: (raw.licenses ?? []).map(normalizeLicenseRecord),
    webhook_events: raw.webhook_events ?? [],
    magic_link_tokens: raw.magic_link_tokens ?? [],
    admin_actions: raw.admin_actions ?? [],
    system_actions: raw.system_actions ?? [],
    organizations: (raw.organizations ?? []).map(normalizeOrganizationRecord),
    organization_members: (raw.organization_members ?? []).map(normalizeOrganizationMemberRecord),
    seat_entitlements: (raw.seat_entitlements ?? []).map(normalizeSeatEntitlementRecord),
    seat_assignments: (raw.seat_assignments ?? []).map(normalizeSeatAssignmentRecord),
    activation_records: (raw.activation_records ?? []).map(normalizeActivationRecord),
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
    externalPaymentId?: string | null;
    externalSubscriptionId?: string | null;
    amountCents?: number | null;
    currency?: string | null;
    status: OrderStatus;
    paidAt?: string | null;
    failedAt?: string | null;
    refundedAt?: string | null;
    cancelledAt?: string | null;
    statusReason?: string | null;
  }): Promise<OrderRecord> {
    const db = this.read();
    const existing = db.orders.find((order) => order.externalOrderId === input.externalOrderId);
    if (existing) {
      const updated = normalizeOrderRecord({
        ...existing,
        paymentProvider: input.paymentProvider,
        customerId: input.customerId,
        edition: input.edition,
        externalPaymentId: input.externalPaymentId ?? existing.externalPaymentId,
        externalSubscriptionId: input.externalSubscriptionId ?? existing.externalSubscriptionId,
        amountCents: input.amountCents ?? existing.amountCents,
        currency: input.currency ?? existing.currency,
        status: input.status,
        paidAt: input.paidAt ?? existing.paidAt,
        failedAt: input.failedAt ?? existing.failedAt,
        refundedAt: input.refundedAt ?? existing.refundedAt,
        cancelledAt: input.cancelledAt ?? existing.cancelledAt,
        statusReason: input.statusReason ?? existing.statusReason,
        updatedAt: nowIso(),
      });
      const index = db.orders.findIndex((order) => order.id === existing.id);
      db.orders[index] = updated;
      this.write(db);
      return updated;
    }

    const created: OrderRecord = normalizeOrderRecord({
      id: newId("ord"),
      externalOrderId: input.externalOrderId,
      paymentProvider: input.paymentProvider,
      customerId: input.customerId,
      edition: input.edition,
      externalPaymentId: input.externalPaymentId ?? null,
      externalSubscriptionId: input.externalSubscriptionId ?? null,
      amountCents: input.amountCents ?? null,
      currency: input.currency ?? null,
      status: input.status,
      paidAt: input.paidAt ?? null,
      failedAt: input.failedAt ?? null,
      refundedAt: input.refundedAt ?? null,
      cancelledAt: input.cancelledAt ?? null,
      statusReason: input.statusReason ?? null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });

    db.orders.push(created);
    this.write(db);
    return created;
  }

  async updateOrder(id: string, patch: OrderUpdatePatch): Promise<OrderRecord> {
    const db = this.read();
    const index = db.orders.findIndex((order) => order.id === id);
    if (index === -1) {
      throw new Error(`order not found: ${id}`);
    }

    db.orders[index] = normalizeOrderRecord({
      ...db.orders[index],
      ...patch,
      updatedAt: nowIso(),
    });
    this.write(db);
    return db.orders[index];
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    const db = this.read();
    return db.orders.find((order) => order.id === id) ?? null;
  }

  async getOrderByExternalOrderId(externalOrderId: string): Promise<OrderRecord | null> {
    const db = this.read();
    return db.orders.find((order) => order.externalOrderId === externalOrderId) ?? null;
  }

  async getOrderByExternalPaymentId(externalPaymentId: string): Promise<OrderRecord | null> {
    const db = this.read();
    return db.orders.find((order) => order.externalPaymentId === externalPaymentId) ?? null;
  }

  async getOrderByExternalSubscriptionId(externalSubscriptionId: string): Promise<OrderRecord | null> {
    const db = this.read();
    return db.orders.find((order) => order.externalSubscriptionId === externalSubscriptionId) ?? null;
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

  async createSystemAction(input: {
    source: string;
    actionType: string;
    targetType: string;
    targetId: string;
    payloadJson: unknown;
    orderId?: string | null;
    licenseId?: string | null;
    webhookEventId?: string | null;
  }): Promise<SystemActionRecord> {
    const db = this.read();
    const record: SystemActionRecord = {
      id: newId("sys"),
      source: input.source,
      actionType: input.actionType,
      targetType: input.targetType,
      targetId: input.targetId,
      payloadJson: input.payloadJson,
      createdAt: nowIso(),
      orderId: input.orderId ?? null,
      licenseId: input.licenseId ?? null,
      webhookEventId: input.webhookEventId ?? null,
    };
    db.system_actions.push(record);
    this.write(db);
    return record;
  }

  async listSystemActionsByOrderId(orderId: string): Promise<SystemActionRecord[]> {
    const db = this.read();
    return sortByCreatedDesc(db.system_actions.filter((action) => action.orderId === orderId));
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

  async listOrdersByCustomerEmail(email: string): Promise<OrderRecord[]> {
    const customer = await this.getCustomerByEmail(email);
    if (!customer) return [];
    return sortByCreatedDesc(this.read().orders.filter((order) => order.customerId === customer.id));
  }

  async ensureOrganizationForCustomer(input: {
    customerId: string;
    customerEmail: string;
    customerName?: string | null;
  }): Promise<OrganizationRecord> {
    const db = this.read();
    const existing = db.organizations.find((organization) => organization.ownerCustomerId === input.customerId);
    if (existing) {
      return existing;
    }

    const base = slugify(input.customerName || input.customerEmail.split("@")[0] || input.customerId);
    let slug = base;
    let suffix = 1;
    while (db.organizations.some((organization) => organization.slug === slug)) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    const organization: OrganizationRecord = {
      id: newId("org"),
      slug,
      name: input.customerName ? `${input.customerName} Organization` : `${input.customerEmail} Organization`,
      billingEmail: input.customerEmail,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      ownerCustomerId: input.customerId,
    };

    const ownerMembership: OrganizationMemberRecord = {
      id: newId("orgm"),
      organizationId: organization.id,
      customerId: input.customerId,
      email: input.customerEmail.trim().toLowerCase(),
      role: "owner",
      status: "active",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.organizations.push(organization);
    db.organization_members.push(ownerMembership);
    this.write(db);
    return organization;
  }

  async getOrganizationById(id: string): Promise<OrganizationRecord | null> {
    return this.read().organizations.find((organization) => organization.id === id) ?? null;
  }

  async getOrganizationForCustomerEmail(email: string): Promise<OrganizationRecord | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const db = this.read();
    const membership = db.organization_members.find(
      (member) => member.email === normalizedEmail && member.status !== "removed"
    );
    if (membership) {
      return db.organizations.find((organization) => organization.id === membership.organizationId) ?? null;
    }

    const customer = db.customers.find((entry) => entry.email === normalizedEmail);
    if (!customer) return null;
    return db.organizations.find((organization) => organization.ownerCustomerId === customer.id) ?? null;
  }

  async listOrganizationMembers(organizationId: string): Promise<OrganizationMemberRecord[]> {
    return sortByCreatedDesc(
      this.read().organization_members.filter((member) => member.organizationId === organizationId)
    );
  }

  async listSeatEntitlementsByOrganizationId(organizationId: string): Promise<SeatEntitlementRecord[]> {
    return sortByCreatedDesc(
      this.read().seat_entitlements.filter((entitlement) => entitlement.organizationId === organizationId)
    );
  }

  async listSeatAssignmentsByOrganizationId(organizationId: string): Promise<SeatAssignmentRecord[]> {
    return sortByCreatedDesc(
      this.read().seat_assignments.filter((assignment) => assignment.organizationId === organizationId)
    );
  }

  async assignSeat(input: {
    organizationId: string;
    licenseId: string;
    email: string;
    assignedByEmail: string;
    customerId?: string | null;
  }): Promise<SeatAssignmentRecord> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const db = this.read();
    const license = db.licenses.find((entry) => entry.licenseId === input.licenseId);
    if (!license) {
      throw new Error(`license not found: ${input.licenseId}`);
    }

    let entitlement =
      db.seat_entitlements.find(
        (entry) => entry.organizationId === input.organizationId && entry.licenseId === license.id
      ) ?? null;

    if (!entitlement) {
      entitlement = {
        id: newId("seatent"),
        organizationId: input.organizationId,
        licenseId: license.id,
        edition: license.edition,
        seatCount: 1,
        activeFrom: nowIso(),
        activeUntil: null,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db.seat_entitlements.push(entitlement);
    }

    const activeAssignments = db.seat_assignments.filter(
      (assignment) => assignment.seatEntitlementId === entitlement.id && assignment.status === "active"
    );
    const existing = db.seat_assignments.find(
      (assignment) => assignment.seatEntitlementId === entitlement.id && assignment.email === normalizedEmail
    );

    if (!existing && activeAssignments.length >= entitlement.seatCount) {
      throw new Error("seat entitlement exhausted");
    }

    const assignment: SeatAssignmentRecord = existing
      ? {
          ...existing,
          customerId: input.customerId ?? existing.customerId,
          status: "active",
          assignedByEmail: input.assignedByEmail,
          assignedAt: nowIso(),
          unassignedAt: null,
          updatedAt: nowIso(),
        }
      : {
          id: newId("seatasn"),
          seatEntitlementId: entitlement.id,
          organizationId: input.organizationId,
          customerId: input.customerId ?? null,
          email: normalizedEmail,
          status: "active",
          assignedByEmail: input.assignedByEmail,
          assignedAt: nowIso(),
          unassignedAt: null,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };

    if (existing) {
      const index = db.seat_assignments.findIndex((entry) => entry.id === existing.id);
      db.seat_assignments[index] = assignment;
    } else {
      db.seat_assignments.push(assignment);
    }

    this.write(db);
    return assignment;
  }

  async unassignSeat(input: {
    organizationId: string;
    licenseId: string;
    email: string;
  }): Promise<SeatAssignmentRecord> {
    const normalizedEmail = input.email.trim().toLowerCase();
    const db = this.read();
    const license = db.licenses.find((entry) => entry.licenseId === input.licenseId);
    if (!license) {
      throw new Error(`license not found: ${input.licenseId}`);
    }

    const entitlement = db.seat_entitlements.find(
      (entry) => entry.organizationId === input.organizationId && entry.licenseId === license.id
    );
    if (!entitlement) {
      throw new Error(`seat entitlement not found for license: ${input.licenseId}`);
    }

    const index = db.seat_assignments.findIndex(
      (assignment) =>
        assignment.seatEntitlementId === entitlement.id &&
        assignment.email === normalizedEmail &&
        assignment.status === "active"
    );
    if (index === -1) {
      throw new Error(`active seat assignment not found: ${normalizedEmail}`);
    }

    db.seat_assignments[index] = {
      ...db.seat_assignments[index],
      status: "unassigned",
      unassignedAt: nowIso(),
      updatedAt: nowIso(),
    };

    this.write(db);
    return db.seat_assignments[index];
  }

  async createActivationRecord(input: {
    activationId: string;
    licenseId: string;
    organizationId?: string | null;
    customerId?: string | null;
    requestedByEmail: string;
    deviceFingerprint: string;
    machineName?: string | null;
    activationTokenHash?: string | null;
    requestNonce?: string | null;
  }): Promise<ActivationRecord> {
    const db = this.read();
    const record: ActivationRecord = {
      id: newId("act"),
      activationId: input.activationId,
      licenseId: input.licenseId,
      organizationId: input.organizationId ?? null,
      customerId: input.customerId ?? null,
      requestedByEmail: input.requestedByEmail,
      deviceFingerprint: input.deviceFingerprint,
      machineName: input.machineName ?? null,
      activationTokenHash: input.activationTokenHash ?? null,
      requestNonce: input.requestNonce ?? null,
      status: "requested",
      requestedAt: nowIso(),
      confirmedAt: null,
      lastSeenAt: null,
      revokedAt: null,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    db.activation_records.push(record);
    this.write(db);
    return record;
  }

  async getActivationRecordByActivationId(activationId: string): Promise<ActivationRecord | null> {
    return this.read().activation_records.find((record) => record.activationId === activationId) ?? null;
  }

  async confirmActivationRecord(
    activationId: string,
    patch?: {
      lastSeenAt?: string | null;
    }
  ): Promise<ActivationRecord> {
    const db = this.read();
    const index = db.activation_records.findIndex((record) => record.activationId === activationId);
    if (index === -1) {
      throw new Error(`activation record not found: ${activationId}`);
    }

    db.activation_records[index] = {
      ...db.activation_records[index],
      status: "confirmed",
      confirmedAt: db.activation_records[index].confirmedAt || nowIso(),
      lastSeenAt: patch?.lastSeenAt ?? nowIso(),
      updatedAt: nowIso(),
    };

    this.write(db);
    return db.activation_records[index];
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
  return normalizeOrderRecord({
    id: String(value.id),
    externalOrderId: String(value.externalOrderId),
    paymentProvider: String(value.paymentProvider),
    status: String(value.status) as OrderStatus,
    edition: String(value.edition),
    externalPaymentId: value.externalPaymentId ? String(value.externalPaymentId) : null,
    externalSubscriptionId: value.externalSubscriptionId ? String(value.externalSubscriptionId) : null,
    amountCents: typeof value.amountCents === "number" ? value.amountCents : null,
    currency: value.currency ? String(value.currency) : null,
    paidAt: asIsoString(value.paidAt),
    failedAt: asIsoString(value.failedAt),
    refundedAt: asIsoString(value.refundedAt),
    cancelledAt: asIsoString(value.cancelledAt),
    statusReason: value.statusReason ? String(value.statusReason) : null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
    customerId: String(value.customerId),
  });
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

function mapSystemActionRecord(value: Record<string, unknown>): SystemActionRecord {
  return {
    id: String(value.id),
    source: String(value.source),
    actionType: String(value.actionType),
    targetType: String(value.targetType),
    targetId: String(value.targetId),
    payloadJson: value.payloadJson ?? null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    orderId: value.orderId ? String(value.orderId) : null,
    licenseId: value.licenseId ? String(value.licenseId) : null,
    webhookEventId: value.webhookEventId ? String(value.webhookEventId) : null,
  };
}

function mapOrganizationRecord(value: Record<string, unknown>): OrganizationRecord {
  return normalizeOrganizationRecord({
    id: String(value.id),
    slug: String(value.slug),
    name: String(value.name),
    billingEmail: value.billingEmail ? String(value.billingEmail) : null,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
    ownerCustomerId: value.ownerCustomerId ? String(value.ownerCustomerId) : null,
  });
}

function mapOrganizationMemberRecord(value: Record<string, unknown>): OrganizationMemberRecord {
  return normalizeOrganizationMemberRecord({
    id: String(value.id),
    organizationId: String(value.organizationId),
    customerId: value.customerId ? String(value.customerId) : null,
    email: String(value.email),
    role: String(value.role) as OrganizationMemberRole,
    status: String(value.status) as OrganizationMemberStatus,
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
  });
}

function mapSeatEntitlementRecord(value: Record<string, unknown>): SeatEntitlementRecord {
  return normalizeSeatEntitlementRecord({
    id: String(value.id),
    organizationId: String(value.organizationId),
    licenseId: String(value.licenseId),
    edition: String(value.edition),
    seatCount: Number(value.seatCount ?? 1),
    activeFrom: asIsoString(value.activeFrom) || nowIso(),
    activeUntil: asIsoString(value.activeUntil),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
  });
}

function mapSeatAssignmentRecord(value: Record<string, unknown>): SeatAssignmentRecord {
  return normalizeSeatAssignmentRecord({
    id: String(value.id),
    seatEntitlementId: String(value.seatEntitlementId),
    organizationId: String(value.organizationId),
    customerId: value.customerId ? String(value.customerId) : null,
    email: String(value.email),
    status: String(value.status) as SeatAssignmentStatus,
    assignedByEmail: value.assignedByEmail ? String(value.assignedByEmail) : null,
    assignedAt: asIsoString(value.assignedAt) || nowIso(),
    unassignedAt: asIsoString(value.unassignedAt),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
  });
}

function mapActivationRecord(value: Record<string, unknown>): ActivationRecord {
  return normalizeActivationRecord({
    id: String(value.id),
    activationId: String(value.activationId),
    licenseId: String(value.licenseId),
    organizationId: value.organizationId ? String(value.organizationId) : null,
    customerId: value.customerId ? String(value.customerId) : null,
    requestedByEmail: String(value.requestedByEmail),
    deviceFingerprint: String(value.deviceFingerprint),
    machineName: value.machineName ? String(value.machineName) : null,
    activationTokenHash: value.activationTokenHash ? String(value.activationTokenHash) : null,
    requestNonce: value.requestNonce ? String(value.requestNonce) : null,
    status: String(value.status) as ActivationStatus,
    requestedAt: asIsoString(value.requestedAt) || nowIso(),
    confirmedAt: asIsoString(value.confirmedAt),
    lastSeenAt: asIsoString(value.lastSeenAt),
    revokedAt: asIsoString(value.revokedAt),
    createdAt: asIsoString(value.createdAt) || nowIso(),
    updatedAt: asIsoString(value.updatedAt) || nowIso(),
  });
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

function mapOrderPatchForPrisma(patch: OrderUpdatePatch): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  if (patch.paymentProvider !== undefined) data.paymentProvider = patch.paymentProvider;
  if (patch.status !== undefined) data.status = patch.status;
  if (patch.edition !== undefined) data.edition = patch.edition;
  if (patch.externalPaymentId !== undefined) data.externalPaymentId = patch.externalPaymentId;
  if (patch.externalSubscriptionId !== undefined) data.externalSubscriptionId = patch.externalSubscriptionId;
  if (patch.amountCents !== undefined) data.amountCents = patch.amountCents;
  if (patch.currency !== undefined) data.currency = patch.currency;
  if (patch.paidAt !== undefined) data.paidAt = patch.paidAt ? new Date(patch.paidAt) : null;
  if (patch.failedAt !== undefined) data.failedAt = patch.failedAt ? new Date(patch.failedAt) : null;
  if (patch.refundedAt !== undefined) data.refundedAt = patch.refundedAt ? new Date(patch.refundedAt) : null;
  if (patch.cancelledAt !== undefined) data.cancelledAt = patch.cancelledAt ? new Date(patch.cancelledAt) : null;
  if (patch.statusReason !== undefined) data.statusReason = patch.statusReason;
  if (patch.customerId !== undefined) data.customerId = patch.customerId;
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
          externalPaymentId: input.externalPaymentId ?? undefined,
          externalSubscriptionId: input.externalSubscriptionId ?? undefined,
          amountCents: input.amountCents ?? null,
          currency: input.currency ?? null,
          status: input.status,
          paidAt: input.paidAt ? new Date(input.paidAt) : null,
          failedAt: input.failedAt ? new Date(input.failedAt) : null,
          refundedAt: input.refundedAt ? new Date(input.refundedAt) : null,
          cancelledAt: input.cancelledAt ? new Date(input.cancelledAt) : null,
          statusReason: input.statusReason ?? null,
        },
        create: {
          externalOrderId: input.externalOrderId,
          paymentProvider: input.paymentProvider,
          customerId: input.customerId,
          edition: input.edition,
          externalPaymentId: input.externalPaymentId ?? null,
          externalSubscriptionId: input.externalSubscriptionId ?? null,
          amountCents: input.amountCents ?? null,
          currency: input.currency ?? null,
          status: input.status,
          paidAt: input.paidAt ? new Date(input.paidAt) : null,
          failedAt: input.failedAt ? new Date(input.failedAt) : null,
          refundedAt: input.refundedAt ? new Date(input.refundedAt) : null,
          cancelledAt: input.cancelledAt ? new Date(input.cancelledAt) : null,
          statusReason: input.statusReason ?? null,
        },
      });
      return mapOrderRecord(record as unknown as Record<string, unknown>);
    },
    async updateOrder(id, patch) {
      const record = await prisma.order.update({
        where: { id },
        data: mapOrderPatchForPrisma(patch),
      });
      return mapOrderRecord(record as unknown as Record<string, unknown>);
    },
    async getOrderById(id) {
      const record = await prisma.order.findUnique({
        where: { id },
      });
      return record ? mapOrderRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getOrderByExternalOrderId(externalOrderId) {
      const record = await prisma.order.findUnique({
        where: { externalOrderId },
      });
      return record ? mapOrderRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getOrderByExternalPaymentId(externalPaymentId) {
      const record = await prisma.order.findFirst({
        where: { externalPaymentId },
      });
      return record ? mapOrderRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getOrderByExternalSubscriptionId(externalSubscriptionId) {
      const record = await prisma.order.findFirst({
        where: { externalSubscriptionId },
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
    async createSystemAction(input) {
      const record = await prisma.systemAction.create({
        data: {
          source: input.source,
          actionType: input.actionType,
          targetType: input.targetType,
          targetId: input.targetId,
          payloadJson: input.payloadJson as object,
          orderId: input.orderId ?? null,
          licenseId: input.licenseId ?? null,
          webhookEventId: input.webhookEventId ?? null,
        },
      });
      return mapSystemActionRecord(record as unknown as Record<string, unknown>);
    },
    async listSystemActionsByOrderId(orderId) {
      const records = await prisma.systemAction.findMany({
        where: { orderId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapSystemActionRecord(record as unknown as Record<string, unknown>));
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
    async listOrdersByCustomerEmail(email) {
      const records = await prisma.order.findMany({
        where: {
          customer: {
            email,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapOrderRecord(record as unknown as Record<string, unknown>));
    },
    async ensureOrganizationForCustomer(input) {
      const existing = await prisma.organization.findFirst({
        where: {
          ownerCustomerId: input.customerId,
        },
      });
      if (existing) {
        return mapOrganizationRecord(existing as unknown as Record<string, unknown>);
      }

      const base = slugify(input.customerName || input.customerEmail.split("@")[0] || input.customerId);
      let slug = base;
      let suffix = 1;
      while (await prisma.organization.findUnique({ where: { slug } })) {
        suffix += 1;
        slug = `${base}-${suffix}`;
      }

      const organization = await prisma.organization.create({
        data: {
          slug,
          name: input.customerName ? `${input.customerName} Organization` : `${input.customerEmail} Organization`,
          billingEmail: input.customerEmail,
          ownerCustomerId: input.customerId,
          members: {
            create: {
              email: input.customerEmail,
              customerId: input.customerId,
              role: "owner",
              status: "active",
            },
          },
        },
      });
      return mapOrganizationRecord(organization as unknown as Record<string, unknown>);
    },
    async getOrganizationById(id) {
      const record = await prisma.organization.findUnique({ where: { id } });
      return record ? mapOrganizationRecord(record as unknown as Record<string, unknown>) : null;
    },
    async getOrganizationForCustomerEmail(email) {
      const record = await prisma.organization.findFirst({
        where: {
          OR: [
            { ownerCustomer: { email } },
            {
              members: {
                some: {
                  email,
                  status: {
                    not: "removed",
                  },
                },
              },
            },
          ],
        },
      });
      return record ? mapOrganizationRecord(record as unknown as Record<string, unknown>) : null;
    },
    async listOrganizationMembers(organizationId) {
      const records = await prisma.organizationMember.findMany({
        where: { organizationId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapOrganizationMemberRecord(record as unknown as Record<string, unknown>));
    },
    async listSeatEntitlementsByOrganizationId(organizationId) {
      const records = await prisma.seatEntitlement.findMany({
        where: { organizationId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapSeatEntitlementRecord(record as unknown as Record<string, unknown>));
    },
    async listSeatAssignmentsByOrganizationId(organizationId) {
      const records = await prisma.seatAssignment.findMany({
        where: { organizationId },
        orderBy: {
          createdAt: "desc",
        },
      });
      return records.map((record) => mapSeatAssignmentRecord(record as unknown as Record<string, unknown>));
    },
    async assignSeat(input) {
      const license = await prisma.license.findUnique({
        where: { licenseId: input.licenseId },
      });
      if (!license) {
        throw new Error(`license not found: ${input.licenseId}`);
      }

      const entitlement =
        (await prisma.seatEntitlement.findFirst({
          where: {
            organizationId: input.organizationId,
            licenseId: license.id,
          },
        })) ||
        (await prisma.seatEntitlement.create({
          data: {
            organizationId: input.organizationId,
            licenseId: license.id,
            edition: license.edition,
            seatCount: 1,
          },
        }));

      const activeAssignments = await prisma.seatAssignment.count({
        where: {
          seatEntitlementId: entitlement.id,
          status: "active",
        },
      });

      const existing = await prisma.seatAssignment.findFirst({
        where: {
          seatEntitlementId: entitlement.id,
          email: input.email,
        },
      });

      if (!existing && activeAssignments >= entitlement.seatCount) {
        throw new Error("seat entitlement exhausted");
      }

      const record = existing
        ? await prisma.seatAssignment.update({
            where: { id: existing.id },
            data: {
              customerId: input.customerId ?? existing.customerId,
              status: "active",
              assignedByEmail: input.assignedByEmail,
              assignedAt: new Date(),
              unassignedAt: null,
            },
          })
        : await prisma.seatAssignment.create({
            data: {
              seatEntitlementId: entitlement.id,
              organizationId: input.organizationId,
              customerId: input.customerId ?? null,
              email: input.email,
              status: "active",
              assignedByEmail: input.assignedByEmail,
            },
          });

      return mapSeatAssignmentRecord(record as unknown as Record<string, unknown>);
    },
    async unassignSeat(input) {
      const license = await prisma.license.findUnique({
        where: { licenseId: input.licenseId },
      });
      if (!license) {
        throw new Error(`license not found: ${input.licenseId}`);
      }

      const entitlement = await prisma.seatEntitlement.findFirst({
        where: {
          organizationId: input.organizationId,
          licenseId: license.id,
        },
      });
      if (!entitlement) {
        throw new Error(`seat entitlement not found for license: ${input.licenseId}`);
      }

      const assignment = await prisma.seatAssignment.findFirst({
        where: {
          seatEntitlementId: entitlement.id,
          email: input.email,
          status: "active",
        },
      });
      if (!assignment) {
        throw new Error(`active seat assignment not found: ${input.email}`);
      }

      const record = await prisma.seatAssignment.update({
        where: { id: assignment.id },
        data: {
          status: "unassigned",
          unassignedAt: new Date(),
        },
      });
      return mapSeatAssignmentRecord(record as unknown as Record<string, unknown>);
    },
    async createActivationRecord(input) {
      const record = await prisma.activationRecord.create({
        data: {
          activationId: input.activationId,
          licenseId: input.licenseId,
          organizationId: input.organizationId ?? null,
          customerId: input.customerId ?? null,
          requestedByEmail: input.requestedByEmail,
          deviceFingerprint: input.deviceFingerprint,
          machineName: input.machineName ?? null,
          activationTokenHash: input.activationTokenHash ?? null,
          requestNonce: input.requestNonce ?? null,
          status: "requested",
        },
      });
      return mapActivationRecord(record as unknown as Record<string, unknown>);
    },
    async getActivationRecordByActivationId(activationId) {
      const record = await prisma.activationRecord.findUnique({
        where: { activationId },
      });
      return record ? mapActivationRecord(record as unknown as Record<string, unknown>) : null;
    },
    async confirmActivationRecord(activationId, patch) {
      const record = await prisma.activationRecord.update({
        where: { activationId },
        data: {
          status: "confirmed",
          confirmedAt: new Date(),
          lastSeenAt: patch?.lastSeenAt ? new Date(patch.lastSeenAt) : new Date(),
        },
      });
      return mapActivationRecord(record as unknown as Record<string, unknown>);
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
