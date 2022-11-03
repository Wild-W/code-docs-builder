type param = {
    name: string,
    type?: string,
    default?: any,
    optional?: boolean,
    desc?: string,
}

type codeReturn = {
    name?: string,
    type?: string,
    desc?: string,
}

enum LanguageType
{
    Lua,
    TypeScript,
}

enum DataType
{
    char,
    string,

    uint8,
    uint16,
    uint32,
    uint64,
    uint128,
    uint256,

    int8,
    int16,
    int32,
    int64,
    int128,
    int256,

    float,
    number,
    double,

    null,
    nil,
    void,

    any,

    function,

}

class FunctionBuilder
{
    private name: string;
    private params: param[];
    private returns: codeReturn[];
    private desc: string;



    constructor(construction: {
        name: string,
        params?: param[],
        returns?: codeReturn[],
        desc?: string,
    })
    {
        this.name = construction.name;
        this.params = construction.params ? construction.params : [];
        this.returns = construction.returns ? construction.returns : [];
        this.desc = construction.desc ? construction.desc : "";
    }

    SetName(newName: string): FunctionBuilder
    {
        this.name = newName;
        return this;
    }

    GetName(): string
    {
        return this.name;
    }

    AddParam(newParam: param): FunctionBuilder
    {
        this.params.push(newParam);
        return this;
    }

    ClearParam(index: number = this.params.length - 1): FunctionBuilder
    {
        this.params.splice(index, 1);
        return this;
    }

    ClearParams(): FunctionBuilder
    {
        this.params.length = 0;
        return this;
    }

    toString(type: LanguageType = LanguageType.Lua): string
    {
        switch (type)
        {
            case LanguageType.Lua:
                let paramsStr = this.stringifyParams(type);

                return  this.stringifyParamAnnotations(type) +
                        `function ${this.name}(${paramsStr}) end`;

            case LanguageType.TypeScript:
                return "unimplemented";
        }
    }

    stringifyParams(type: LanguageType): string
    {
        let str = "";
        switch (type)
        {
            case LanguageType.Lua:
                if (this.params.length < 1) return "";
                for (let i = 0; i < this.params.length - 1; i++)
                {
                    str += `${this.params[i].name}, `;
                }
                return str + this.params[this.params.length - 1].name;

            case LanguageType.TypeScript:
                return "unimplemented";
        }
    }

    stringifyParamAnnotations(type: LanguageType): string
    {
        let str = "";
        switch (type)
        {
            case LanguageType.Lua:
                for (let i = 0; i < this.params.length; i++)
                {
                    str +=  `---@param ${this.params[i].name}${this.params[i].optional ? "?" : ""} ${this.params[i].type ? this.params[i].type : "any"} ` +
                            `${this.params[i].desc ? this.params[i].desc : ""}\n`;
                }
                return str;
            
            case LanguageType.TypeScript:
                return "unimplemented";
        }
    }
}

class NamespaceBuilder
{
    private name: string;
    private functions: FunctionBuilder[];
    private classes: ClassBuilder[];
    private enums: EnumBuilder[];
    private variables: VariableBuilder[];

    constructor(construction: {name: string, functions?: FunctionBuilder[], classes?: ClassBuilder[], enums?: EnumBuilder[], variables?: VariableBuilder[]})
    {
        this.name = construction.name;
        this.functions = construction.functions ? construction.functions : [];
        this.classes = construction.classes ? construction.classes : [];
        this.enums = construction.enums ? construction.enums : [];
        this.variables = construction.variables ? construction.variables : [];
    }
}

class ClassBuilder
{

}

class EnumBuilder
{

}

class VariableBuilder
{
    private constant: boolean;
    private name: string;
    private value: any;
    private type: string;
    private desc: string;

    constructor(construction: {name: string, constant?: boolean, value?: any, type?: string, desc?: string})
    {
        this.name = construction.name;
        this.constant = construction.constant ? construction.constant : false;
        this.value = construction.value;
        this.type = construction.type ? construction.type : "any";
        this.desc = construction.desc ? construction.desc : "";
    }

    SetConstant(constant: boolean = true): VariableBuilder
    {
        this.constant = constant;
        return this;
    }

    GetConstant(): boolean
    {
        return this.constant;
    }

    SetName(newName: string): VariableBuilder
    {
        this.name = newName;
        return this;
    }

    GetName(): string
    {
        return this.name;
    }

    SetValue(newVal: any): VariableBuilder
    {
        this.value = newVal;
        return this;
    }

    GetValue(): any
    {
        return this.value;
    }

    SetType(newType: string): VariableBuilder
    {
        this.type = newType;
        return this;
    }

    GetType(): string
    {
        return this.type;
    }

    toString(type: LanguageType): string
    {
        return {
            [LanguageType.Lua]: () =>
                (this.desc ? `---${this.desc}\n` : "") +
                `---@type ${this.type}\n` +
                `${this.name} = ${this.value}`,

            [LanguageType.TypeScript]: () =>
                (this.desc ? `---${this.desc}\n` : "") +
                `declare ${this.constant ? "const" : "let"} ${this.name}: ${this.type} = ${this.value};`,
        }[type]();
    }
}

class TypeBuilder
{

}

let test = new FunctionBuilder({name: "test", desc: "This function will be for testing"});
test.AddParam({name: "thing", type: "string"}).AddParam({name: "thing2"});
console.log(test.toString(LanguageType.Lua));
console.log(new FunctionBuilder({name: "thing", params: [{name: "testing"}]}).toString(LanguageType.Lua));

let valueTest = new VariableBuilder({name: "HELLO_ALL", constant: true, value: 19, type: "number"})
console.log(valueTest.toString(LanguageType.Lua));
console.log(valueTest.toString(LanguageType.TypeScript));

export {
    LanguageType,
    ClassBuilder,
    EnumBuilder,
    FunctionBuilder,
    NamespaceBuilder,
    TypeBuilder,
    VariableBuilder,
};
