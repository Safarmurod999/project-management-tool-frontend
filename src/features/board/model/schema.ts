import { z } from "zod";

const boardStatusSchema = z.enum(["active", "archived"]);

export const createBoardSchema = z.object({
  projectId: z.string().min(1, "Loyiha majburiy"),
  name: z
    .string()
    .trim()
    .min(1, "Board nomi majburiy")
    .max(100, "Board nomi juda uzun"),
  description: z.string().max(500, "Board tavsifi juda uzun"),
});

export const updateBoardSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Board nomi majburiy")
    .max(100, "Board nomi juda uzun"),
  description: z.string().max(500, "Board tavsifi juda uzun").nullable(),
  status: boardStatusSchema,
});

export const createColumnSchema = z.object({
  boardId: z.string().min(1, "Board majburiy"),
  name: z
    .string()
    .trim()
    .min(1, "Ustun nomi majburiy")
    .max(50, "Ustun nomi juda uzun"),
  order: z.number().int().min(0).optional(),
  // Project statuses mapped to the column on creation
  statusIds: z.array(z.string()).optional(),
});

export const updateColumnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Ustun nomi majburiy")
    .max(50, "Ustun nomi juda uzun"),
  order: z.number().int().min(0).optional(),
});

export const addColumnStatusSchema = z.object({
  statusId: z.string().min(1, "Status majburiy"),
  order: z.number().int().min(0).optional(),
});

export const createCardSchema = z.object({
  columnId: z.string().min(1, "Ustun majburiy"),
  title: z
    .string()
    .trim()
    .min(1, "Vazifa nomi majburiy")
    .max(200, "Vazifa nomi juda uzun"),
  description: z.string().max(2000, "Tavsif juda uzun").nullable(),
  order: z.number().int().min(0).optional(),
  // Omitted -> backend resolves the project default / column's first status
  statusId: z.string().optional(),
  assigneeId: z.string().nullable(),
  assignerId: z.string().nullable(),
  points: z.number().int().min(0, "Ball manfiy bo'lishi mumkin emas"),
});

export const updateCardSchema = createCardSchema
  .omit({ columnId: true })
  .partial()
  .extend({
    title: createCardSchema.shape.title,
  });

// Matches the backend's STATUS_COLOR_PATTERN
const statusColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, "Rang #RRGGBB formatida bo'lishi kerak");

export const createStatusSchema = z.object({
  projectId: z.string().min(1, "Loyiha majburiy"),
  name: z
    .string()
    .trim()
    .min(1, "Status nomi majburiy")
    .max(50, "Status nomi juda uzun"),
  color: statusColorSchema,
  order: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  isDone: z.boolean().optional(),
});

export const updateStatusSchema = createStatusSchema
  .omit({ projectId: true })
  .partial()
  .extend({ version: z.number().int().optional() });

export const workflowTransitionSchema = z
  .object({
    // `error` also covers an empty (null) Select
    fromStatusId: z
      .string({ error: "Boshlang'ich status majburiy" })
      .min(1, "Boshlang'ich status majburiy"),
    toStatusId: z
      .string({ error: "Yakuniy status majburiy" })
      .min(1, "Yakuniy status majburiy"),
    // Creates the reverse rule too
    bidirectional: z.boolean().optional(),
  })
  .refine((data) => data.fromStatusId !== data.toStatusId, {
    message: "Statuslar bir xil bo'lishi mumkin emas",
    path: ["toStatusId"],
  });

export const updateWorkflowTransitionSchema = z.object({
  fromStatusId: z.string().min(1).optional(),
  toStatusId: z.string().min(1).optional(),
});

export const createWorkflowSchema = z.object({
  projectId: z.string().min(1, "Loyiha majburiy"),
  name: z
    .string()
    .trim()
    .min(1, "Workflow nomi majburiy")
    .max(100, "Workflow nomi juda uzun"),
  description: z.string().max(500, "Tavsif juda uzun").nullable().optional(),
  isDefault: z.boolean().optional(),
  statusIds: z.array(z.string()).optional(),
  transitions: z.array(workflowTransitionSchema).optional(),
});

export const updateWorkflowSchema = createWorkflowSchema
  .pick({ name: true, description: true, isDefault: true })
  .partial()
  .extend({ version: z.number().int().optional() });

export const addWorkflowStatusSchema = z.object({
  statusId: z.string().min(1, "Status majburiy"),
});

// Card form keeps an unselected status as null (Mantine Select's empty value)
export const cardFormSchema = updateCardSchema.extend({
  statusId: z.string().nullable(),
});

export type CreateBoardFormData = z.infer<typeof createBoardSchema>;
export type UpdateBoardFormData = z.infer<typeof updateBoardSchema>;
export type CreateColumnFormData = z.infer<typeof createColumnSchema>;
export type UpdateColumnFormData = z.infer<typeof updateColumnSchema>;
export type AddColumnStatusFormData = z.infer<typeof addColumnStatusSchema>;
export type CreateStatusFormData = z.infer<typeof createStatusSchema>;
export type UpdateStatusFormData = z.infer<typeof updateStatusSchema>;
export type CreateWorkflowFormData = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowFormData = z.infer<typeof updateWorkflowSchema>;
export type AddWorkflowStatusFormData = z.infer<typeof addWorkflowStatusSchema>;
export type WorkflowTransitionFormData = z.infer<
  typeof workflowTransitionSchema
>;
export type UpdateWorkflowTransitionFormData = z.infer<
  typeof updateWorkflowTransitionSchema
>;
export type CreateCardFormData = z.infer<typeof createCardSchema>;
export type UpdateCardFormData = z.infer<typeof updateCardSchema>;
