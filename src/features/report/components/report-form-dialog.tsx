"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/features/category";
import { useEmployees } from "@/features/employee";
import { useCreateReport } from "../hooks/use-create-report";
import { useUpdateReport } from "../hooks/use-update-report";
import type { Report } from "../types";
import { reportSchema, type ReportFormValues } from "../validation";

interface ReportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  report?: Report;
}

export function ReportFormDialog({ open, onOpenChange, eventId, report }: ReportFormDialogProps) {
  const isEditing = !!report;
  const createReport = useCreateReport(eventId);
  const updateReport = useUpdateReport();
  const isPending = createReport.isPending || updateReport.isPending;

  const { data: categories } = useCategories({ enabled: open });
  const { data: employees } = useEmployees({ enabled: open });
  // A report assignee is internal staff, not the client themselves.
  const assignableEmployees = employees?.filter(
    (employee) => !employee.roles.some((role) => role.name === "CLIENT")
  );

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: report?.title ?? "",
      content: report?.content ?? null,
      categoryId: report?.categoryId ?? "",
      assigneeUserIds: report?.assignees.map((a) => a.id) ?? [],
    },
  });

  function onSubmit(values: ReportFormValues) {
    const mutation = isEditing
      ? updateReport.mutateAsync({ id: report.id, input: values })
      : createReport.mutateAsync(values);

    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit report" : "New report"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update this report's details." : "Add a new report for this event."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeUserIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned employees</FormLabel>
                  <div className="grid gap-2 rounded-md border p-3">
                    {assignableEmployees?.map((employee) => {
                      const checked = field.value.includes(employee.id);
                      return (
                        <label key={employee.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) =>
                              field.onChange(
                                next === true
                                  ? [...field.value, employee.id]
                                  : field.value.filter((id) => id !== employee.id)
                              )
                            }
                          />
                          <span className="text-sm">{employee.name}</span>
                        </label>
                      );
                    })}
                    {assignableEmployees?.length === 0 && (
                      <p className="text-sm text-muted-foreground">No employees available.</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving…" : isEditing ? "Save changes" : "Create report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
