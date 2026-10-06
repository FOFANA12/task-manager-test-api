import { test, expect, describe } from 'vitest';
import {
    generateProjectReference,
    isProjectOverdue
} from '../../src/helpers/project.helper.js';

describe('generateProjectReference', () => {
    test('generates a reference with the PR prefix', () => {
        expect(generateProjectReference(123)).toBe("PR-123");
    });

    test('keeps IDs longer than 3 digits', () => {
        expect(generateProjectReference(1234)).toBe("PR-1234");
    });
});

describe('isProjectOverdue', () => {
    test('detects an overdue incomplete project', () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() - 7);
        const status = "in-progress";

        expect(isProjectOverdue(dueDate, status)).toBe(true);
    });

    test('ignores a completed project with a past due date', () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() - 7);
        const status = "completed";

        expect(isProjectOverdue(dueDate, status)).toBe(false);
    });

    test('ignores a project with a future due date', () => {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        const status = "planned";

        expect(isProjectOverdue(dueDate, status)).toBe(false);
    });
});