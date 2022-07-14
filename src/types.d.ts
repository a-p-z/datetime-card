export interface IAutocompleteItem {
    primaryText: string;
    secondaryText?: string;
    value: string;
}

export interface IConfig {
    readonly type: string = "custom:datetime-card";
    entities?: IEntity[] = [];
    flex_direction: "column" | "row" | "column-reverse" | "row-reverse";
    image?: string;
    title?: string;
    show_names: boolean;
}

export interface IEntity {
    id: string;
    max: number;
}

export interface IHass {
    localize(message: string, params: any): string;
    states: { [key: string]: IState; };
}

export interface IState {
    attributes: { [key: string]: string; };
    state: any
}
