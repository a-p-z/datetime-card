export interface IAutocompleteItem {
    primaryText: string;
    secondaryText?: string;
    value: string;
}

export interface IConfig {
    readonly type: "custom:datetime-card";
    entities?: IEntity[];
    flex_direction: "column" | "row" | "column-reverse" | "row-reverse";
    image?: string;
    reset_forward?: boolean;
    title?: string;
    show_expired_only?: boolean;
    show_names: boolean;
}

export interface IEntity {
    friendly_name?: string;
    id: string;
    max: number;
}

export interface IHass {
    states: { [key: string]: IState; };
}

export interface IState {
    attributes: { [key: string]: string; };
    state: any
}
