export const validateTaskTitle = (title: string): boolean => {
    return title.trim().length >= 3;
}
export const generateTaskReference = (id: number): string => {
    const ref = `${id}`.padStart(3, "0");
    return "TA-" + ref;
}
export const isTaskOverdue = (dueDate: Date, status: string): boolean => {
    return dueDate < new Date() && status !== "completed";
};