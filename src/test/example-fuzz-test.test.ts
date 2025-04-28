import { generateData } from "..";
import { getTopStudents } from "./example-code";
import { expectMatchesSchema } from "./lib/schema";

describe("example fuzz test", () => {

    const studentSchema = {
        type: "object",
        additionalProperties: false,
        properties: {
            name: {
                type: "string",
            },
            email: {
                type: "string",
                format: "email",
            },
            "date-time": {
              type: "string",
              format: "date-time"
            },
            "date": {
              type: "string",
              format: "date"
            },
            "time": {
              type: "string",
              format: "time"
            },
            "duration": {
              type: "string",
              format: "duration"
            },
            "hostname": {
              type: "string",
              format: "hostname"
            },
            "ipv4": {
              type: "string",
              format: "ipv4"
            },
            "ipv6": {
              type: "string",
              format: "ipv6"
            },
            "uri": {
              type: "string",
              format: "uri"
            },
            "uri-reference": {
              type: "string",
              format: "uri-reference"
            },
            "uuid": {
              type: "string",
              format: "uuid"
            },
            "uri-template": {
              type: "string",
              format: "uri-template"
            },
            "json-pointer": {
              type: "string",
              format: "json-pointer"
            },
            "relative-json-pointer": {
              type: "string",
              format: "relative-json-pointer"
            },
            "regex": {
              type: "string",
              format: "regex"
            },
            grades: {
                type: "object",
                additionalProperties: {
                    type: "number",
                },
            },
        },
        required: [
            "name",
            "grades"
        ],
    };

    const studentArraySchema = {
        type: "array",
        items: studentSchema,
    };

    const schema = {
        type: "array",
        prefixItems: [
            studentArraySchema,
            { 
                type: "number",
            },
            {
                type: "array",
                items: { type: "string" },
            },
        ],
        minItems: 3,
        maxItems: 3,
    };

    const generatedInputs = generateData(schema);

    test.each(generatedInputs.valid)('VALID: getTopStudents %#', (students, minGrade, subjects) => {
        const result = getTopStudents(students, minGrade, subjects);
        expectMatchesSchema(result, studentArraySchema);
    });

    const invalidArgs = generatedInputs.invalid.filter(invalidArgs => Array.isArray(invalidArgs) && invalidArgs.length === 3);

    test.each(invalidArgs)('INVALID: getTopStudents %#', (students, minGrade, subjects) => {
        expect(getTopStudents(students, minGrade, subjects)).toEqual([]);
    });

});