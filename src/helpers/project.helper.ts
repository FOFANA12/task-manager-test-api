export const generateProjectReference = (id: number): string => {
    const ref = `${id}`.padStart(3, "0");
    return "PR-" + ref;
}

export const isProjectOverdue = (dueDate: Date, status: string): boolean => {
    return dueDate < new Date() && status !== "completed";
};