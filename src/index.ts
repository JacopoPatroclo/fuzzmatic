//
// Definition of a JSON schema.
//
export interface ISchema {
    //
    // The data type being defined.
    //
    type: string;

    //
    // The minimum length of the string.
    //
    minLength?: number;

    //
    // The maximum length of the string.
    //
    maxLength?: number;
}

//
// Definition of a number schema.
//
export interface INumberSchema extends ISchema {
    //
    // The data type being defined.
    //
    type: "number";

    //
    // Minimum value.
    //
    minimum?: number;

    //
    // Maximum value.
    //
    maximum?: number;
}

//
// Definition of a string schema.
//
export interface IStringSchema extends ISchema {
    //
    // The data type being defined.
    //
    type: "string";
    
    //
    // The format of the string.
    //
    format?: 
      |"date-time"
      |"date"
      |"time"
      |"duration"
      |"email"
      |"hostname"
      |"ipv4"
      |"ipv6"
      |"uri"
      |"uri-reference"
      |"uuid"
      |"uri-template"
      |"json-pointer"
      |"relative-json-pointer"
      |"regex"
}

//
// Definition of a boolean schema.
//
export interface IBooleanSchema extends ISchema {
    //
    // The data type being defined.
    //
    type: "boolean";
}

//
// Definition of a number schema.
//
export interface IObjectSchema extends ISchema {
    //
    // The data type being defined.
    //
    type: "object";

    //
    // Properties of an object.
    //
    properties?: {
        [field: string]: ISchema;
    };

    //
    // The names of fields that must be present.
    // All other fields are optional.
    //
    required?: string[];
}

//
// Definition of an array schema.
//
export interface IArraySchema extends ISchema {
    //
    // The data type being defined.
    //
    type: "array";

    //
    // Nested schema for each item in the array.
    //
    items?: ISchema | false;

    //
    // Used for tuples where each element can have a different schema.
    //
    prefixItems?: ISchema[];

    //
    // Minimum items in a valid array.
    //
    minItems?: number;

    //
    // Maximum items in a valid array.
    //
    maxItems?: number;
}

export type AnySchema = INumberSchema | IStringSchema | IBooleanSchema | IObjectSchema | IArraySchema;

//
// Represents generated data.
//
export interface IGeneratedData {
    //
    // Set of valid data items.
    //
    valid: any[];

    //
    // Set of invalid data items.
    //
    invalid: any[];
}

//
// Generates valid and invalid options for a number.
//
function number(schema: INumberSchema): IGeneratedData {
    let minValue = schema.minimum !== undefined
        ? schema.minimum
        : -Number.MAX_VALUE;
    let maxValue = schema.maximum !== undefined
        ? schema.maximum
        : Number.MAX_VALUE;

    const valid: any[] = [];
    const invalid: any[] = [];

    //
    // Adds a value to the valid or invalid set depending on whether it is within the range.
    //
    function addValue(value: number) {
        if (minValue <= value && value <= maxValue) {
            if (!valid.includes(value)) {
                valid.push(value);
            }
        }
        else {
            if (!invalid.includes(value)) {
                invalid.push(value);
            }
        }
    }

    if (minValue > -Number.MAX_VALUE) {
        addValue(minValue - 1); // Invalid: outside range.
    }

    if (maxValue < Number.MAX_VALUE) {
        addValue(maxValue + 1); // Invalid: outside range.
    }

    addValue(minValue);
    addValue(-100);
    addValue(-10);
    addValue(-1);
    addValue(0);
    addValue(1);
    addValue(10);
    addValue(100);
    addValue(maxValue);

    invalid.push(undefined);
    invalid.push(null);
    invalid.push(Number.NaN);
    invalid.push(Number.NEGATIVE_INFINITY);
    invalid.push(Number.POSITIVE_INFINITY);
    invalid.push("a");
    invalid.push(true);
    invalid.push({});

    // Default set.
    return {
        valid,
        invalid,
    };
}

//
// Generates valid and invalid options for a string.
//
function string(schema: IStringSchema): IGeneratedData {

    const valid: any[] = [];
    const invalid: any[] = [];
    
    if (schema.format === "email") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("not an email")
        invalid.push("a")
        
        valid.push("validemail@testemail.com")
        valid.push("a@asd.co.uk.it")
        valid.push("aaa@aaa.de")
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "date") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("not a date");
        invalid.push("a");
        
        valid.push("2021-12-31");
        valid.push("1970-01-01");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "date-time") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("not a date time");
        invalid.push("Jan. 1st, 1970 at 1 pm");
        
        valid.push("1970-01-01T10:05:08");
        valid.push("1970-01-01T10:05:08.10");
        valid.push("1970-01-01T10:05:08+01:00");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "time") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("not time");
        invalid.push("45:60:62");
        invalid.push("10:05");
        invalid.push("1 pm");
          
        valid.push("10:05:08");
        valid.push("10:05:08.5");
        valid.push("10:05:08-02:30");
        valid.push("10:05:08Z");
        
        return {
            valid,
            invalid
        }
    }
    
    if (schema.format === "duration") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("PT1D");
        
        valid.push("P4DT12H30M5S");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "uuid") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("2GB8AA08-AA98-11EA-B4AA-73B441D16380");
        invalid.push("2eb8aa08aa9811eab4aa73b441d16380");
        
        valid.push("5075e9ca-8ef5-473f-a8a1-a2533dc358ca");
        valid.push("54ce2ee5-7686-48da-8758-7cfc6d29bc48");
        valid.push("5c2ef891-753d-47a5-9f9f-59c7fb3a7b05");
        valid.push("f69a71fc-3bc1-46fe-aed6-ca29530abca1");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "hostname") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("not_a_valid_host_name");
        
        valid.push("www.example.com");
        valid.push("xn--4gbwdl.xn--wgbh1c");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "regex") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("a/b");
        invalid.push("(a");
        
        valid.push("^[a-z]+$");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === "ipv4") {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("192.168.1.1.1");
        
        valid.push("192.168.0.1");
        valid.push("0.0.0.0");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'ipv6') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("12345::");
        
        valid.push("::1");
        valid.push("2001:db8:3333:4444:5555:6666:1.2.3.4");
        valid.push("::11.22.33.44");
        valid.push("2001:db8::123.123.123.123");
        valid.push("::1234:5678:91.123.4.56");
        valid.push("::1234:5678:1.2.3.4");
        valid.push("2001:db8::1234:5678:5.6.7.8");
  
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'uri') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("http://a_example.com");
        invalid.push("aaa/bbb.html");
        
        valid.push("http://example.com/path?qs=v&qs2[1]=3#fragment");
        valid.push("https://google.com");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'uri-reference') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("http://a_example.com");
        
        valid.push("aaa/bbb.html");
        valid.push("?a=b");
        valid.push("#fragment");
        valid.push("http://example.com");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'uri-template') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("http://a_example.com/file.php{?q,r}");
        
        valid.push("/{+file}.html");
        valid.push("http://example.com/dictionary/{term:1}/{term}");
        valid.push("{?q,lang}");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'json-pointer') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("/a/~");
        
        valid.push("/a/b/c");
        
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'relative-json-pointer') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("/a/b");
        
        valid.push("0/a/b");
        valid.push("5/a/b#");
        valid.push("2#");
         
        return {
          valid,
          invalid
        }
    }
    
    if (schema.format === 'iri-reference') {
        invalid.push(undefined);
        invalid.push(null);
        invalid.push(42);
        invalid.push(true);
        invalid.push({});
        invalid.push("\\\\WINDOWS\\filëßåré");
        
        valid.push("//ƒøø.ßår/?∂éœ=πîx#πîüx");
        valid.push("#ƒrägmênt");
        valid.push("http://ƒøø.com/blah_(wîkïpédiå)_blah#ßité-1");
        
        return {
          valid,
          invalid
        }
    }

    const minLength = schema.minLength || 0;
    const maxLength = schema.maxLength;

    if (minLength !== 0) {
        invalid.push(""); // Empty string not valid.
    }

    if (minLength > 1) {
        invalid.push("a"); // Too short.

        if (minLength > 2 && minLength < 100) {
            invalid.push("a".repeat(minLength - 1)); // Too short.
        }
    }

    valid.push("a".repeat(minLength)); // Minimum length.

    if (minLength === 0 && (maxLength === undefined || maxLength > 1)) {
        valid.push("a"); // One item should be allowed.
    }

    if (maxLength !== undefined && maxLength < 100) {         
        valid.push("a".repeat(maxLength));
        invalid.push("a".repeat(maxLength + 1)); // Limit the length of the string to 100. Don't want to go overboard.
    }

    invalid.push(undefined);
    invalid.push(null);
    invalid.push(42);
    invalid.push(true);
    invalid.push({});

    return { valid, invalid };
}

//
// Generates valid and invalid options for a boolean.
//
function boolean(schema: IBooleanSchema): IGeneratedData {

    const valid: any[] = [];
    const invalid: any[] = [];

    valid.push(true);
    valid.push(false);

    invalid.push(undefined);
    invalid.push(null);
    invalid.push(42);
    invalid.push("a");
    invalid.push({});

    return { valid, invalid };
}

//
// A named field of an object.
//
interface IField {
    //
    // The name of the field.
    //
    name: string;

    //
    // Data for the field.
    //
    data: IGeneratedData;

    //
    // Set to true when field is required or false otherwise.
    //
    required: boolean;
}

//
// Generate valid and invalid combination of the set of fields.
//
function generateCombinations(fields: IField[]): IGeneratedData {

    const valid: any[] = [];
    const invalid: any[] = [];

    //
    // Build the minimal valid object.
    //
    const minimalValidObject: any = {};    
    for (const { name, data, required } of fields) {
        if (required) {
            minimalValidObject[name] = data.valid[0];  
        }
    }

    valid.push(minimalValidObject); // Note: this could be an empty object if no properties are actually required.

    if (Object.keys(minimalValidObject).length > 0) {
        //
        // If the minimal valid object is not empty, then the empty object is an invalid value.
        //
        invalid.push({});
    }

    //
    // Start with the minimal valid object and vary each of the fields across valid values.
    //
    for (const { name, data, required } of fields) {
        if (required) {
            for (const value of data.valid.slice(1)) {
                valid.push({ 
                    ...minimalValidObject,
                    [name]: value,
                });
            }
        }
    }

    //
    // Build the canoncial valid object.
    //
    const validObject: any = {};    
    for (const { name, data } of fields) {
        validObject[name] = data.valid[0];  
    }

    valid.push(validObject);

    //
    // Start with the valid object and vary each of the fields across valid values.
    //
    for (const { name, data } of fields) {
        for (const value of data.valid.slice(1)) {
            valid.push({ 
                ...validObject,
                [name]: value,
            });
        }
    }

    //
    // Start with the valid object and vary each of the fields across invalid values.
    //
    for (const { name, data, required } of fields) {
        for (const value of data.invalid) {
            if (value === undefined) {
                if (!required) {
                    // An undefined value is only invalid if the field is required.
                    continue;
                }
            }
            invalid.push({ 
                ...validObject,
                [name]: value,
            });
        }
    }

    invalid.push(undefined);
    invalid.push(null);
    invalid.push(42);
    invalid.push("a");
    invalid.push(true);

    return { valid, invalid };
}

//
// Generates valid and invalid options for an object.
//
function object(schema: IObjectSchema): IGeneratedData {
    const fields = [];
    if (schema.properties) {
        const requiredFieldSet = new Set(schema.required || []);

        for (const [field, fieldSchema] of Object.entries(schema.properties)) {
            fields.push({
                name: field,
                data: generateData(fieldSchema),
                required: requiredFieldSet.has(field),
            });
        }

        return generateCombinations(fields);
    }
    else {
        return { valid: [], invalid: [] };
    }
}

//
// Create variations of a particular sized array.
//
function createArrayVariations(validNumberOfItems: number, prefixItemsData?: IGeneratedData[], itemsData?: IGeneratedData): IGeneratedData {
    const valid: any[] = [];
    const invalid: any[] = [];

    const canoncialValidArray = [];
    for (let itemIndex = 0; itemIndex < validNumberOfItems; itemIndex++) {
        const itemData = prefixItemsData && prefixItemsData[itemIndex] || itemsData;
        if (!itemData) {
            throw new Error(`No item data for array index ${itemIndex}`);
        }
        canoncialValidArray.push(itemData.valid[0]);
    }

    valid.push(canoncialValidArray);

    //
    // Create valid variations of the array.
    //
    for (let itemIndex = 0; itemIndex < validNumberOfItems; itemIndex++) {
        const itemData = prefixItemsData && prefixItemsData[itemIndex] || itemsData;
        if (!itemData) {
            throw new Error(`No item data for array index ${itemIndex}`);
        }
        for (const validItem of itemData.valid.slice(1)) {
            valid.push([
                ...canoncialValidArray.slice(0, itemIndex), 
                validItem,
                ...canoncialValidArray.slice(itemIndex + 1),
            ]);
        }
    }

    //
    // Create invalid variations of the array.
    //
    for (let itemIndex = 0; itemIndex < validNumberOfItems; itemIndex++) {
        const itemData = prefixItemsData && prefixItemsData[itemIndex] || itemsData;
        if (!itemData) {
            throw new Error(`No item data for array index ${itemIndex}`);
        }
        for (const invalidItem of itemData.invalid) {
            invalid.push([
                ...canoncialValidArray.slice(0, itemIndex), 
                invalidItem,
                ...canoncialValidArray.slice(itemIndex + 1),
            ]);
        }
    }

    return { valid, invalid };
}

//
// Generates valid and invalid options for an array.
//
function array(schema: IArraySchema): IGeneratedData {

    if (!schema.items && !schema.prefixItems) {
        throw new Error("Array schema must have 'items' or 'prefixItems' defined.");
    }

    let valid: any[] = [];
    let invalid: any[] = [];

    const minItems = schema.minItems || 0;
    const maxItems = schema.maxItems; 
    const prefixItemsData = schema.prefixItems && schema.prefixItems.map(itemSchema => generateData(itemSchema)) || undefined;
    const itemsData = schema.items && generateData(schema.items) || undefined;

    if (minItems === 0) {
        // No items is valid.
        valid.push([]);
    }
    else {
        // An empty array is not valid.
        invalid.push([]);
    }   

    let minPositiveItems = minItems > 0 ? minItems : 1;

    const validSizes = new Set<number>();
    const invalidSizes = new Set<number>();

    validSizes.add(minPositiveItems);

    if (minPositiveItems > 1) {
        invalidSizes.add(minPositiveItems - 1);
    }

    if (maxItems !== undefined) {
        validSizes.add(maxItems);
        if (maxItems < 100) {                
            // Limits the size of the invalid array to 100.
            invalidSizes.add(maxItems + 1);            
        }
    }
    
    if (minPositiveItems === 0 && (maxItems === undefined || maxItems > 1)) {
        // One item is valid.
        validSizes.add(1);
    }

    if (minPositiveItems < 2 && (maxItems === undefined || maxItems > 2)) {
        // Two items are valid.
        validSizes.add(2);
    }        

    if (maxItems === undefined || maxItems > minPositiveItems+1) { 
        validSizes.add(minPositiveItems+1);
    }

    for (const validSize of validSizes.values()) {
        const variations = createArrayVariations(validSize, prefixItemsData, itemsData);
        valid = valid.concat(variations.valid);
        invalid = invalid.concat(variations.invalid);
    }
    
    for (const invalidSize of invalidSizes.values()) {
        const invalidItems = [];
        let latestValidItem = undefined;
        for (let itemIndex = 0; itemIndex < invalidSize; itemIndex++) {
            const itemData = prefixItemsData && prefixItemsData[itemIndex] || itemsData;
            if (itemData) {
                latestValidItem = itemData.valid[0];
            }
            invalidItems.push(latestValidItem);
        }
        invalid.push(invalidItems);
    }
  

    invalid.push(undefined);
    invalid.push(null);
    invalid.push(42);
    invalid.push("a");
    invalid.push(true);
    invalid.push({});
    
    return { valid, invalid };    
}

interface ISchemaTypeMap {
    [type: string]: (schema: ISchema) => IGeneratedData;
}

const schemaTypeMap = {
    number,
    string,
    boolean,
    object,
    array,
};

//
// Generate sets of valid and invalid data for a given schema.
//
export function generateData(schema: ISchema): IGeneratedData {
    const typeHandler = (schemaTypeMap as ISchemaTypeMap)[schema.type];
    if (!typeHandler) {
        throw new Error(`Unknown type: ${schema.type}`);
    }

    return typeHandler(schema);
}

